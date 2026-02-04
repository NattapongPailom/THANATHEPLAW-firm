
import { Lead, LeadStatus, NewsItem, CaseStudy, Invoice, ActivityLog, TimelineEvent, CaseFile, AdminUser, SimulatedEmail } from '../src/types';
import { GoogleGenAI } from "@google/genai";
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, updateDoc, deleteDoc, doc, query, where, orderBy, getDoc, setDoc, limit, onSnapshot } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import emailjs from '@emailjs/browser';

// --- FIREBASE INITIALIZATION ---
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const storage = getStorage(app);

// --- EMAILJS INITIALIZATION ---
if (process.env.EMAILJS_PUBLIC_KEY) {
  emailjs.init(process.env.EMAILJS_PUBLIC_KEY);
}

export const backendService = {
  // --- AUTH & LOGGING ---
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
    } catch (error) {
      console.error("Log Activity Error:", error);
    }
  },

  async getLogs(): Promise<ActivityLog[]> {
    try {
      const q = query(collection(db, "activity_logs"), orderBy("timestamp", "desc"), limit(100));
      const snap = await getDocs(q);
      // Add comment above fix: Cast d.data() to any for spreading
      return snap.docs.map(d => ({ id: d.id, ...(d.data() as any) } as ActivityLog));
    } catch (error) {
      return [];
    }
  },

  // --- NOTIFICATION ENGINE ---
  async sendSimulatedEmail(payload: Omit<SimulatedEmail, 'id' | 'timestamp'>) {
    try {
      // Add comment above fix: Cast payload to any to bypass spread check
      const emailData = {
        ...(payload as any),
        timestamp: new Date().toISOString()
      };
      const docRef = await addDoc(collection(db, "sent_emails"), emailData);
      const newEmail = { id: docRef.id, ...emailData };

      window.dispatchEvent(new CustomEvent('elite_email_dispatched', { detail: newEmail }));

      const serviceId = process.env.EMAILJS_SERVICE_ID;
      const templateId = process.env.EMAILJS_TEMPLATE_ID;
      const publicKey = process.env.EMAILJS_PUBLIC_KEY;

      if (serviceId && templateId && publicKey) {
        try {
          await emailjs.send(serviceId, templateId, {
            to_email: payload.to,
            subject: payload.subject,
            message: payload.body,
            type: payload.type,
            reply_to: payload.canReply ? "thanathep.lawfirm@gmail.com" : "no-reply@elitecounsel.com"
          });
          console.debug(`Real email successfully dispatched to ${payload.to}`);
        } catch (emailError) {
          console.error("EmailJS dispatch failed:", emailError);
        }
      } else {
        console.warn("EmailJS credentials missing in .env - Simulation only.");
      }

      return newEmail;
    } catch (error) {
      console.error("Notification Engine Error:", error);
      throw error;
    }
  },

  async getSentEmails(): Promise<SimulatedEmail[]> {
    try {
      const q = query(collection(db, "sent_emails"), orderBy("timestamp", "desc"), limit(100));
      const snap = await getDocs(q);
      // Add comment above fix: Cast d.data() to any for spreading
      return snap.docs.map(d => ({ id: d.id, ...(d.data() as any) } as SimulatedEmail));
    } catch (error) {
      return [];
    }
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

  // --- FILE STORAGE ---
  async uploadFile(file: File, folder: string = "vault"): Promise<string> {
    const fileRef = ref(storage, `${folder}/${Date.now()}_${file.name}`);
    await uploadBytes(fileRef, file);
    return await getDownloadURL(fileRef);
  },

  // --- LEAD & CASE MANAGEMENT ---
  // Add comment above fix: Cast snapshot and doc to any for QuerySnapshot usage
  onLeadsUpdate(callback: (leads: Lead[]) => void) {
    const q = query(collection(db, "leads"), orderBy("createdAt", "desc"));
    return onSnapshot(q, (snapshot: any) => {
      const leads = snapshot.docs.map((doc: any) => ({ id: doc.id, ...(doc.data() as any) } as Lead));
      callback(leads);
    });
  },

  // Add comment above fix: Cast doc.data() to any for spreading
  async getAllLeads(): Promise<Lead[]> {
    try {
      const q = query(collection(db, "leads"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...(doc.data() as any) } as Lead));
    } catch (error) {
      console.error("Firebase Error:", error);
      return [];
    }
  },

  async createLead(leadData: { name: string; phone: string; details: string; email?: string; category?: string }): Promise<Lead> {
    const newLeadData = {
      ...leadData,
      status: 'new' as LeadStatus,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      timeline: [],
      files: [],
      notes: ''
    };

    try {
      let aiSummary = "";
      try {
        aiSummary = await this.generateAISummary(leadData.details);
      } catch (e) { console.warn("AI Summary failure handled"); }

      const docRef = await addDoc(collection(db, "leads"), { ...newLeadData, aiSummary });
      await this.logActivity(`Created new lead: ${leadData.name}`, docRef.id);
      return { id: docRef.id, ...newLeadData, aiSummary };
    } catch (error) {
      console.error("Firebase Create Lead Error:", error);
      throw error;
    }
  },

  async updateLeadStatus(id: string, status: LeadStatus): Promise<void> {
    try {
      const leadRef = doc(db, "leads", id);
      await updateDoc(leadRef, { status: status, updatedAt: new Date().toISOString() });
      await this.logActivity(`Updated status to ${status}`, id);
    } catch (error) { console.error("Firebase Status Update Error:", error); }
  },

  async updateLeadNotes(id: string, notes: string): Promise<void> {
    try {
      const leadRef = doc(db, "leads", id);
      await updateDoc(leadRef, { notes: notes, updatedAt: new Date().toISOString() });
      await this.logActivity(`Updated notes for client`, id);
    } catch (error) { console.error("Firebase Notes Update Error:", error); }
  },

  async updateLeadTimeline(id: string, timeline: TimelineEvent[], notify: boolean = false): Promise<void> {
    try {
      const leadRef = doc(db, "leads", id);
      await updateDoc(leadRef, { timeline: timeline, updatedAt: new Date().toISOString() });
      await this.logActivity(`Updated timeline`, id);

      if (notify) {
        const leadSnap = await getDoc(leadRef);
        const lead = leadSnap.data() as Lead;
        if (lead && lead.email) {
          const lastEvent = timeline[timeline.length - 1];
          await this.sendSimulatedEmail({
            to: lead.email,
            subject: `Update: ${lastEvent.title}`,
            body: `ความคืบหน้าคดี: ${lastEvent.title}\nวันที่: ${lastEvent.date}`,
            type: 'milestone',
            canReply: true
          });
        }
      }
    } catch (error) { console.error("Firebase Timeline Update Error:", error); }
  },

  async updateLeadFiles(id: string, files: CaseFile[], notify: boolean = false): Promise<void> {
    try {
      const leadRef = doc(db, "leads", id);
      await updateDoc(leadRef, { files: files, updatedAt: new Date().toISOString() });
      await this.logActivity(`Updated vault documents`, id);
    } catch (error) { console.error("Firebase File Update Error:", error); }
  },

  async deleteLead(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, "leads", id));
      await this.logActivity(`Deleted lead`, id);
    } catch (error) { console.error("Firebase Delete Error:", error); }
  },

  // --- FINANCIALS ---
  // Add comment above fix: Cast doc.data() to any for spreading
  async getAllInvoices(): Promise<Invoice[]> {
    try {
      const q = query(collection(db, "invoices"), orderBy("date", "desc"));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...(doc.data() as any) } as Invoice));
    } catch (error) { return []; }
  },

  // Add comment above fix: Cast doc.data() to any for spreading
  async getInvoicesByLeadId(leadId: string): Promise<Invoice[]> {
    try {
      const q = query(collection(db, "invoices"), where("leadId", "==", leadId));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...(doc.data() as any) } as Invoice));
    } catch (error) { return []; }
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

  // --- CLIENT TRACKING ---
  // Add comment above fix: Cast d.data() to any for spreading
  async trackCaseByPhone(phone: string): Promise<Lead | null> {
    try {
      const q = query(collection(db, "leads"), where("phone", "==", phone), limit(1));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const d = querySnapshot.docs[0];
        return { id: d.id, ...(d.data() as any) } as Lead;
      }
      return null;
    } catch (error) { return null; }
  },

  // --- CMS ---
  // Add comment above fix: Cast doc.data() to any for spreading
  async getAllNews(): Promise<NewsItem[]> {
    try {
      const q = query(collection(db, "news"), orderBy("date", "desc"));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: parseInt(doc.id) || Date.now(), ...(doc.data() as any) } as any));
    } catch (error) { return []; }
  },

  async deleteNews(id: number): Promise<void> {
    await deleteDoc(doc(db, "news", id.toString()));
  },

  async createNews(newsData: Omit<NewsItem, 'id' | 'date'>, broadcast: boolean = false): Promise<NewsItem> {
    const id = Date.now().toString();
    const date = new Date().toLocaleDateString('th-TH');
    await setDoc(doc(db, "news", id), { ...newsData, date });
    if (broadcast) {
      const subscribers = await this.getSubscribers();
      for (const email of subscribers) {
        await this.sendSimulatedEmail({
          to: email,
          subject: `ใหม่: ${newsData.title}`,
          body: `อ่านบทความล่าสุดจาก Elite Counsel: ${newsData.title}\n\n${newsData.description}`,
          type: 'broadcast',
          canReply: false
        });
      }
    }
    return { id: parseInt(id), date, ...newsData };
  },

  // Add comment above fix: Cast doc.data() to any for spreading
  async getAllCases(): Promise<CaseStudy[]> {
    try {
      const q = query(collection(db, "cases"), orderBy("year", "desc"));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: parseInt(doc.id) || Date.now(), ...(doc.data() as any) } as any));
    } catch (error) { return []; }
  },

  async deleteCase(id: number): Promise<void> {
    await deleteDoc(doc(db, "cases", id.toString()));
  },

  async createCase(caseData: Omit<CaseStudy, 'id'>): Promise<CaseStudy> {
    const id = Date.now().toString();
    await setDoc(doc(db, "cases", id), caseData);
    return { id: parseInt(id), ...caseData };
  },

  // --- AI (GEMINI) ---
  async auditDocument(base64Image: string): Promise<string> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: { 
        parts: [
          { inlineData: { data: base64Image.split(',')[1], mimeType: 'image/jpeg' } }, 
          { text: "ในฐานะทนายความผู้เชี่ยวชาญ กรุณาวิเคราะห์เอกสารกฎหมายในภาพนี้อย่างละเอียด: ระบุจุดที่เสียเปรียบหรือจุดเสี่ยง (Red Flags), ข้อควรระวังสำหรับลูกความ, และสรุปสาระสำคัญเป็นข้อๆ โดยใช้ภาษาไทยที่สุภาพและเป็นทางการ" }
        ] 
      },
    });
    return response.text || "ไม่สามารถวิเคราะห์เอกสารได้ในขณะนี้";
  },

  async researchLegalTopic(queryStr: string): Promise<{ text: string, sources: any[] }> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = `วิจัยประเด็นข้อกฎหมายในประเทศไทยที่เกี่ยวกับ: "${queryStr}" โดยสรุปเป็นหัวข้อที่ชัดเจน เข้าใจง่าย พร้อมระบุมาตราทางกฎหมายหรือแนวคำพิพากษาที่เกี่ยวข้องหากมีข้อมูล`;
    
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: { tools: [{ googleSearch: {} }] },
      });
      
      const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((chunk: any) => ({
        title: chunk.web?.title || 'แหล่งข้อมูลอ้างอิง',
        uri: chunk.web?.uri
      })) || [];

      return { 
        text: response.text || "ไม่พบข้อมูลวิจัยที่ต้องการ", 
        sources: sources 
      };
    } catch (error: any) {
      if (error.message?.includes('429') || error.status === 'RESOURCE_EXHAUSTED') {
        const fallbackResponse = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: prompt + " (หมายเหตุ: ผลลัพธ์นี้มาจากฐานข้อมูลภายในของ AI โดยไม่ได้ใช้การค้นหาออนไลน์แบบเรียลไทม์เนื่องจากข้อจำกัดด้านโควตา)"
        });
        return { 
          text: fallbackResponse.text || "ไม่พบข้อมูลวิจัยที่ต้องการ", 
          sources: [] 
        };
      }
      throw error;
    }
  },

  async draftLegalDocument(docType: string, details: string): Promise<string> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({ 
      model: 'gemini-3-flash-preview', 
      contents: `กรุณาร่างเอกสารประเภท "${docType}" โดยใช้รายละเอียดต่อไปนี้: "${details}" \n\nข้อกำหนด: 1. ใช้ภาษากฎหมายไทยที่ถูกต้องและเป็นทางการ 2. แบ่งหัวข้อให้ชัดเจน 3. ระบุข้อกำหนดมาตรฐานที่จำเป็นสำหรับเอกสารประเภทนี้ 4. มีช่องว่างสำหรับลงชื่อพยานและคู่สัญญา` 
    });
    return response.text || "การร่างเอกสารล้มเหลว กรุณาลองใหม่อีกครั้ง";
  },

  async generateAISummary(details: string): Promise<string> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({ 
      model: 'gemini-3-flash-preview', 
      contents: `สรุปใจความสำคัญของข้อความนี้เป็นภาษาไทยสั้นๆ ไม่เกิน 2 ประโยค เพื่อให้ทนายความรับทราบสถานการณ์เบื้องต้น: ${details}` 
    });
    return response.text || '';
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
