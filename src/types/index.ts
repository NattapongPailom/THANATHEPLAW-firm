
import React from 'react';

export interface NavLink {
  name: string;
  href: string;
  id?: string;
  children?: { name: string; href: string; id?: string }[];
}

export interface ServiceItem {
  title: string;
  description: string;
  icon?: React.ReactNode;
  highlights?: string[];
}

export interface ServiceCategory {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ReactNode;
  mainImage: string;
  subServices: ServiceItem[];
  extraInsights?: {
    title: string;
    content: string;
  }[];
}

export interface NewsItem {
  id: number;
  category: string;
  date: string;
  title: string;
  description: string;
  image: string;
  fullContent: string[];
  author: string;
  readingTime: string;
  tags: string[];
}

export interface CaseStudy {
  id: number;
  category: string;
  categoryLabel: string;
  title: string;
  year: string;
  impact: string;
  description: string;
  fullContent: string[];
  mainImage: string;
  gallery: string[];
  highlights: string[];
}

export type LeadStatus = 'new' | 'contacted' | 'negotiating' | 'contracted' | 'closed';

export interface TimelineEvent {
  id: string;
  date: string;
  time?: string;
  title: string;
  description: string;
  isCompleted: boolean;
}

export interface CaseFile {
  id: string;
  name: string;
  url: string;
  type: 'contract' | 'evidence' | 'court_order' | 'other';
  fileSize?: string;
  uploadDate?: string;
}

export interface Lead {
  id: string;
  name: string;
  phone: string;
  email?: string;
  category?: string;
  details: string;
  status: LeadStatus;
  aiSummary?: string;
  notes?: string;
  isNotePublic?: boolean; // New: Toggle visibility for client
  createdAt: string;
  updatedAt: string;
  timeline?: TimelineEvent[];
  files?: CaseFile[];
}

export interface Invoice {
  id: string;
  leadId: string;
  clientName: string;
  amount: number;
  status: 'unpaid' | 'paid' | 'overdue';
  items: { description: string; price: number }[];
  date: string;
}

export interface ActivityLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  timestamp: string;
  targetId: string;
}

export interface AdminUser {
  id: string;
  email: string;
  role: 'admin' | 'attorney';
}

export interface SimulatedEmail {
  id: string;
  to: string;
  subject: string;
  body: string;
  type: 'milestone' | 'vault' | 'broadcast';
  canReply: boolean;
  timestamp: string;
}
