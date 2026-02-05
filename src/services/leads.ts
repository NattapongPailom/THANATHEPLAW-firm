
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, query, orderBy, onSnapshot } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "./firebase";
import { Lead, LeadStatus, TimelineEvent, CaseFile } from "../types";
import { GoogleGenAI } from "@google/genai";

export const leadService = {
  // ซิงค์ข้อมูลจาก Firestore
  onLeadsUpdate(
    callback: (leads: Lead[]) => void,
    onError?: (error: Error) => void
  ) {
    const q = query(collection(db, "leads"), orderBy("createdAt", "desc"));
    return onSnapshot(q, (snapshot) => {
      const leads = snapshot.docs.map((doc) => ({ id: doc.id, ...(doc.data() as any) } as Lead));
      callback(leads);
    }, (error) => {
      console.error("Firestore Subscribe Error:", error);
      onError?.(error instanceof Error ? error : new Error(String(error)));
    });
  },

  async getAllLeads(): Promise<Lead[]> {
    try {
      const q = query(collection(db, "leads"), orderBy("createdAt", "desc"));
      const snap = await getDocs(q);
      return snap.docs.map(doc => ({ id: doc.id, ...(doc.data() as any) } as Lead));
    } catch (e) {
      console.error("Failed to fetch leads:", e);
      return [];
    }
  },

  async uploadFile(file: File, path: string): Promise<string> {
    try {
      const fileName = `${Date.now()}_${file.name.replace(/\s+/g, '_')}`;
      const fileRef = ref(storage, `${path}/${fileName}`);
      
      const metadata = { contentType: file.type };
      await uploadBytes(fileRef, file, metadata);
      
      const downloadURL = await getDownloadURL(fileRef);
      return downloadURL;
    } catch (error: any) {
      console.error("Cloud Upload Error:", error);
      throw new Error("การอัปโหลดไฟล์ขึ้น Cloud ล้มเหลว กรุณาลองใหม่อีกครั้ง");
    }
  },

  async resolveLocalFile(url: string): Promise<string> {
    return url;
  },

  async createLead(leadData: { name: string; phone: string; details: string; email?: string; category?: string }): Promise<Lead> {
    const newLeadData = {
      ...leadData,
      status: 'new' as LeadStatus,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      timeline: [],
      files: [],
      notes: '',
      isNotePublic: false
    };

    let aiSummary = "";
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const res = await ai.models.generateContent({ 
        model: 'gemini-3-flash-preview', 
        contents: `สรุปสั้นๆ 2 ประโยค: ${leadData.details}` 
      });
      aiSummary = res.text || '';
    } catch (e) { console.warn("AI Summary generation failed"); }

    const docRef = await addDoc(collection(db, "leads"), { ...newLeadData, aiSummary });
    return { id: docRef.id, ...newLeadData, aiSummary };
  },

  async updateLeadPortfolio(leadId: string, timeline: TimelineEvent[], files: CaseFile[]) {
    await updateDoc(doc(db, "leads", leadId), { 
      timeline, 
      files, 
      updatedAt: new Date().toISOString()
    });
  },

  async updateLeadStatus(id: string, status: LeadStatus) {
    await updateDoc(doc(db, "leads", id), { status, updatedAt: new Date().toISOString() });
  },

  async updateLeadNotes(id: string, notes: string, isPublic: boolean = false) {
    await updateDoc(doc(db, "leads", id), { 
      notes, 
      isNotePublic: isPublic, 
      updatedAt: new Date().toISOString() 
    });
  },

  async deleteLead(id: string) {
    await deleteDoc(doc(db, "leads", id));
  }
};
