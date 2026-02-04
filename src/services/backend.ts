
import { leadService } from './leads';
import { db, storage } from './firebase';
import { collection, addDoc, getDocs, query, orderBy, limit, setDoc, doc, deleteDoc, where, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { GoogleGenAI } from "@google/genai";
import emailjs from '@emailjs/browser';
import { Lead, NewsItem, CaseStudy, Invoice, ActivityLog, AdminUser, SimulatedEmail, CaseFile } from '../types';
import { validation } from '../utils/validation';
import { rateLimiters } from '../utils/rateLimiter';

if (process.env.EMAILJS_PUBLIC_KEY) {
  emailjs.init(process.env.EMAILJS_PUBLIC_KEY);
}

export const backendService = {
  ...leadService,

  /**
   * 🔒 Upload file to Firebase Storage (no CORS issues, unlimited file sizes)
   */
  async uploadFileAsBase64(file: File, leadId: string, leadPhone: string): Promise<string> {
    try {
      // 🔒 Rate limiting check
      if (!rateLimiters.fileUpload.isAllowed(leadPhone)) {
        throw new Error(`❌ Too many uploads. Please try again in ${Math.ceil(rateLimiters.fileUpload.getResetTime(leadPhone) / 1000)} seconds`);
      }

      // 🔒 Validate file size (max 100MB)
      if (!validation.isValidFileSize(file.size, 100)) {
        throw new Error('❌ File size exceeds 100MB limit');
      }

      console.log(`📤 Uploading to Firebase Storage: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`);

      // ทำความสะอาดชื่อไฟล์ - แต่เก็บ Thai characters
      const sanitizedFileName = file.name
        .replace(/[\x00-\x1F\x7F]/g, '') // Remove control characters
        .replace(/[^\p{L}\p{N}\s._\-()]/gu, '') // Keep only safe chars
        .replace(/\s+/g, ' ')
        .trim()
        .substring(0, 200);

      const finalFileName = sanitizedFileName || `Document_${Date.now()}`;
      const timestamp = Date.now();
      const storagePath = `case_files/${leadId}/${timestamp}_${finalFileName}`;

      // Upload directly to Firebase Storage
      const storageRef = ref(storage, storagePath);
      console.log(`📝 Storage path: ${storagePath}`);
      
      const snapshot = await uploadBytes(storageRef, file);
      console.log(`✅ File uploaded to Storage`);

      // Get download URL
      const downloadUrl = await getDownloadURL(snapshot.ref);
      console.log(`🔗 Download URL: ${downloadUrl.substring(0, 100)}...`);

      // Store only metadata in Firestore (NOT the file content)
      const fileMetadata = {
        leadId,
        leadPhone,
        fileName: finalFileName,
        originalFileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        storagePath: storagePath,
        downloadUrl: downloadUrl,
        uploadedAt: new Date().toISOString(),
        isArchived: false,
        uploadedBy: 'admin',
        checksum: btoa(finalFileName + file.size + Date.now())
      };

      const fileRef = await addDoc(collection(db, "case_files"), fileMetadata);
      console.log(`💾 Metadata saved: ${fileRef.id}`);

      // Log activity
      await backendService.logActivity('FILE_UPLOADED', fileRef.id);
      
      // Return download URL (can be used directly)
      return downloadUrl;
    } catch (error: any) {
      console.error('❌ Upload error:', error);
      throw new Error("เกิดข้อผิดพลาดในการอัปโหลดไฟล์: " + error.message);
    }
  },

  /**
   * 🔒 Download file from Firebase Storage
   */
  async downloadFileFromFirestore(fileId: string, fileName: string): Promise<void> {
    try {
      // 🔒 Validate inputs
      if (!fileId || typeof fileId !== 'string' || fileId.length === 0) {
        throw new Error('Invalid file ID');
      }

      if (!validation.isValidTextLength(fileName, 1, 500)) {
        throw new Error('Invalid file name');
      }

      console.log(`📥 Downloading file: ${fileName} (${fileId})`);
      
      // Get file metadata from Firestore
      const fileSnap = await getDocs(query(collection(db, "case_files"), where('__name__', '==', fileId)));
      
      if (fileSnap.empty) {
        throw new Error('File not found in database');
      }

      const fileData = fileSnap.docs[0].data();
      
      if (!fileData.downloadUrl) {
        throw new Error('Download URL not found');
      }

      console.log(`✅ Got download URL from Firestore`);
      
      // Open download URL (browser will handle the download)
      const link = document.createElement('a');
      link.href = fileData.downloadUrl;
      link.download = fileName || 'download';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Log activity
      await backendService.logActivity('FILE_DOWNLOADED', fileId);
      
      console.log(`✅ Download started: ${fileName}`);
    } catch (error: any) {
      console.error("Download error:", error);
      throw new Error(`ไม่สามารถดาวน์โหลดไฟล์ได้: ${error.message}`);
    }
  },

  async logActivity(action: string, targetId: string) {
    const userStr = localStorage.getItem('elite_admin_session');
    const user: AdminUser | null = userStr ? JSON.parse(userStr) : null;
    try {
      await addDoc(collection(db, "activity_logs"), {
        userId: user?.id || 'unknown',
        userName: user?.email || 'Unknown User',
        action,
        targetId,
        timestamp: new Date().toISOString()
      });
    } catch (e) {}
  },

  async getLogs(): Promise<ActivityLog[]> {
    const q = query(collection(db, "activity_logs"), orderBy("timestamp", "desc"), limit(100));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...(d.data() as any) } as ActivityLog));
  },

  async sendSimulatedEmail(payload: Omit<SimulatedEmail, 'id' | 'timestamp'>) {
    const emailData = { ...(payload as any), timestamp: new Date().toISOString() };
    const docRef = await addDoc(collection(db, "sent_emails"), emailData);
    const newEmail = { id: docRef.id, ...emailData };
    window.dispatchEvent(new CustomEvent('elite_email_dispatched', { detail: newEmail }));

    const { EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, EMAILJS_PUBLIC_KEY } = process.env;
    if (EMAILJS_SERVICE_ID && EMAILJS_TEMPLATE_ID && EMAILJS_PUBLIC_KEY) {
      try {
        await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
          to_email: payload.to,
          subject: payload.subject,
          message: payload.body,
          type: payload.type,
          reply_to: payload.canReply ? "thanathep.lawfirm@gmail.com" : "no-reply@elitecounsel.com"
        });
      } catch (e) { console.error("EmailJS error", e); }
    }
    return newEmail;
  },

  async subscribeNewsletter(email: string): Promise<void> {
    try {
      const q = query(collection(db, "subscribers"), where("email", "==", email));
      const snap = await getDocs(q);
      if (snap.empty) {
        await addDoc(collection(db, "subscribers"), { email, createdAt: new Date().toISOString() });
      }
    } catch (error) {
      console.error("Subscribe Error:", error);
    }
  },

  async getSubscribers(): Promise<string[]> {
    try {
      const snap = await getDocs(collection(db, "subscribers"));
      return snap.docs.map(d => (d.data() as any).email);
    } catch (error) {
      return [];
    }
  },

  async getAllNews(): Promise<NewsItem[]> {
    const q = query(collection(db, "news"), orderBy("date", "desc"));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: parseInt(d.id), ...(d.data() as any) } as any));
  },

  async deleteNews(id: number) {
    await deleteDoc(doc(db, "news", id.toString()));
  },

  async createNews(data: any, broadcast: boolean) {
    const id = Date.now().toString();
    const date = new Date().toLocaleDateString('th-TH');
    await setDoc(doc(db, "news", id), { ...data, date });
    if (broadcast) {
      const subscribers = await this.getSubscribers();
      for (const email of subscribers) {
        await this.sendSimulatedEmail({
          to: email,
          subject: `ใหม่: ${data.title}`,
          body: `อ่านบทความล่าสุดจาก Elite Counsel: ${data.title}\n\n${data.description}`,
          type: 'broadcast',
          canReply: false
        });
      }
    }
    return { id: parseInt(id), date, ...data };
  },

  async getAllCases(): Promise<CaseStudy[]> {
    const q = query(collection(db, "cases"), orderBy("year", "desc"));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: parseInt(d.id), ...(d.data() as any) } as any));
  },

  async deleteCase(id: number) {
    await deleteDoc(doc(db, "cases", id.toString()));
  },

  async createCase(data: any) {
    const id = Date.now().toString();
    await setDoc(doc(db, "cases", id), data);
    return { id: parseInt(id), ...data };
  },

  async getAllInvoices(): Promise<Invoice[]> {
    const q = query(collection(db, "invoices"), orderBy("date", "desc"));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...(d.data() as any) } as Invoice));
  },

  async getInvoicesByLeadId(leadId: string): Promise<Invoice[]> {
    const q = query(collection(db, "invoices"), where("leadId", "==", leadId));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...(d.data() as any) } as Invoice));
  },

  async createInvoice(invoiceData: Omit<Invoice, 'id'>): Promise<Invoice> {
    const docRef = await addDoc(collection(db, "invoices"), invoiceData);
    await this.logActivity(`Issued invoice`, docRef.id);
    return { id: docRef.id, ...invoiceData };
  },

  async updateInvoiceStatus(id: string, status: Invoice['status']): Promise<void> {
    const invRef = doc(db, "invoices", id);
    await updateDoc(invRef, { status: status });
    await this.logActivity(`Updated invoice status`, id);
  },

  async reassignFilesToLead(newLeadId: string, oldLeadId: string): Promise<void> {
    try {
      console.log(`🔄 Reassigning files from ${oldLeadId} to ${newLeadId}`);
      
      // ดึงไฟล์ทั้งหมดที่เชื่อมกับ oldLeadId
      const filesQ = query(collection(db, "case_files"), where("leadId", "==", oldLeadId));
      const filesSnap = await getDocs(filesQ);
      
      console.log(`📁 Found ${filesSnap.docs.length} files to reassign`);
      
      // อัปเดต leadId ของแต่ละไฟล์
      for (const fileDoc of filesSnap.docs) {
        await updateDoc(doc(db, "case_files", fileDoc.id), {
          leadId: newLeadId,
          updatedAt: new Date().toISOString()
        });
        console.log(`✅ Updated file: ${fileDoc.id}`);
      }
      
      console.log(`✅ Reassignment complete! ${filesSnap.docs.length} files updated`);
    } catch (error: any) {
      console.error("Reassignment error:", error);
      throw error;
    }
  },

  async trackCaseByPhone(phone: string): Promise<Lead | null> {
    const q = query(collection(db, "leads"), where("phone", "==", phone), limit(1));
    const snap = await getDocs(q);
    if (snap.empty) return null;
    
    const leadData = { id: snap.docs[0].id, ...(snap.docs[0].data() as any) } as Lead;
    
    console.log('📱 Found Lead:', { 
      id: leadData.id, 
      name: leadData.name, 
      phone: leadData.phone,
      filesCount: leadData.files?.length || 0
    });
    
    // ✅ Files ถูกเก็บอยู่ใน leads[leadId].files แล้ว
    // ไม่ต้องดึงจาก case_files collection อีก
    if (leadData.files && leadData.files.length > 0) {
      console.log('📁 Files from leads.files:', leadData.files.length);
      leadData.files.forEach((f, idx) => {
        console.log(`  [${idx}] ${f.name} (${f.fileSize})`);
      });
    }
    
    return leadData;
  },

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  },

  // --- AI ENGINES (OPTIMIZED FOR HIGH QUOTA - GEMINI 3 FLASH + THINKING) ---

  async auditDocument(base64Image: string): Promise<string> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: { 
          parts: [
            { inlineData: { data: base64Image.split(',')[1], mimeType: 'image/jpeg' } }, 
            { text: "ในฐานะทนายความผู้เชี่ยวชาญ กรุณาวิเคราะห์เอกสารกฎหมายในภาพนี้อย่างละเอียด: ระบุจุดที่เสียเปรียบหรือจุดเสี่ยง (Red Flags), ข้อควรระวังสำหรับลูกความ, และสรุปสาระสำคัญเป็นข้อๆ โดยใช้ภาษาไทยที่สุภาพและเป็นทางการ" }
          ] 
        },
        config: {
          thinkingConfig: { thinkingBudget: 12000 }
        }
      });
      return response.text || "ไม่สามารถวิเคราะห์เอกสารได้ในขณะนี้";
    } catch (error: any) {
      console.error("Audit Error:", error);
      return "ระบบ AI Audit ขัดข้องชั่วคราวเนื่องจากปริมาณการใช้งานสูง กรุณาลองใหม่ในอีก 30 วินาที";
    }
  },

  async researchLegalTopic(queryStr: string): Promise<{ text: string, sources: any[] }> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = `วิจัยประเด็นข้อกฎหมายในประเทศไทยที่เกี่ยวกับ: "${queryStr}" โดยสรุปเป็นหัวข้อที่ชัดเจน เข้าใจง่าย พร้อมระบุมาตราทางกฎหมายหรือแนวคำพิพากษาที่เกี่ยวข้องหากมีข้อมูลเชิงลึก`;
    
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: { 
          tools: [{ googleSearch: {} }],
          thinkingConfig: { thinkingBudget: 12000 }
        },
      });
      
      const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks
        ?.filter((chunk: any) => chunk.web)
        ?.map((chunk: any) => ({
          title: chunk.web.title || 'แหล่งข้อมูลอ้างอิง',
          uri: chunk.web.uri
        })) || [];

      return { 
        text: response.text || "ไม่พบข้อมูลวิจัยที่ต้องการ", 
        sources: sources 
      };
    } catch (error: any) {
      console.error("AI Research Error:", error);
      // Fallback to basic generation if Search/Thinking triggers 429
      try {
        const fallback = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: prompt + " (โปรดสรุปจากฐานความรู้เดิมของคุณ เนื่องจากระบบค้นหาออนไลน์ติดข้อจำกัดชั่วคราว)"
        });
        return { text: fallback.text || "เกิดข้อผิดพลาดในการดึงข้อมูล", sources: [] };
      } catch (e) {
        return { text: "ขออภัย ระบบ AI ติดข้อจำกัดด้านปริมาณการใช้งาน (Rate Limit) กรุณารอสักครู่แล้วลองใหม่อีกครั้ง", sources: [] };
      }
    }
  },

  async draftLegalDocument(docType: string, details: string): Promise<string> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    try {
      const response = await ai.models.generateContent({ 
        model: 'gemini-3-flash-preview', 
        contents: `กรุณาร่างเอกสารประเภท "${docType}" โดยใช้รายละเอียดต่อไปนี้: "${details}" \n\nข้อกำหนด: 1. ใช้ภาษากฎหมายไทยที่ถูกต้องและเป็นทางการ 2. แบ่งหัวข้อให้ชัดเจน 3. ระบุข้อกำหนดมาตรฐานที่จำเป็นสำหรับเอกสารประเภทนี้ 4. มีช่องว่างสำหรับลงชื่อพยานและคู่สัญญา`,
        config: {
          thinkingConfig: { thinkingBudget: 12000 }
        }
      });
      return response.text || "การร่างเอกสารล้มเหลว กรุณาลองใหม่อีกครั้ง";
    } catch (error: any) {
      return "ระบบร่างเอกสารขัดข้องชั่วคราว กรุณาลองใหม่อีกครั้งในภายหลัง";
    }
  },

  async generateAISummary(details: string): Promise<string> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const res = await ai.models.generateContent({ 
      model: 'gemini-3-flash-preview', 
      contents: `สรุปสั้นๆ 2 ประโยค: ${details}` 
    });
    return res.text || '';
  },

  async generateThematicImage(prompt: string): Promise<string> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({ 
      model: 'gemini-2.5-flash-image', 
      contents: { parts: [{ text: `Professional high-end legal photography, luxury law office style: ${prompt}` }] } 
    });
    let imageUrl = "";
    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) { 
        if (part.inlineData) { 
          imageUrl = `data:image/png;base64,${part.inlineData.data}`; 
          break; 
        } 
      }
    }
    return imageUrl;
  }
};
