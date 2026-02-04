
import React, { useState, useEffect } from 'react';
import { CreditCard, Plus, Loader2, Receipt, Download, Trash2 } from 'lucide-react';
import { backendService } from '../../services/backend';
import { Invoice, Lead } from '../../types';

export const FinanceView: React.FC = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  
  const [form, setForm] = useState({
    leadId: '',
    items: [{ description: '', price: 0 }],
    status: 'unpaid' as Invoice['status']
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const invData = await backendService.getAllInvoices();
    const leadData = await backendService.getAllLeads();
    setInvoices(invData);
    setLeads(leadData);
    setLoading(false);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const client = leads.find(l => l.id === form.leadId);
    if (!client) return alert("Please select a valid client");

    const total = form.items.reduce((sum, item) => sum + item.price, 0);
    
    await backendService.createInvoice({
      leadId: form.leadId,
      clientName: client.name,
      amount: total,
      items: form.items,
      status: form.status,
      date: new Date().toLocaleDateString('th-TH')
    });
    
    setShowModal(false);
    loadData();
  };

  const updateInvoiceStatus = async (id: string, status: Invoice['status']) => {
    await backendService.updateInvoiceStatus(id, status);
    loadData();
  };

  return (
    <div className="animate-reveal-up space-y-12">
      <div className="flex justify-between items-end">
        <div>
          <h3 className="text-2xl font-serif-legal font-bold text-white mb-2 italic">Financial Ledger</h3>
          <p className="text-slate-500 text-[10px] uppercase tracking-widest font-black">Invoice Management & Billing</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-[#c5a059] text-white px-8 py-4 text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-slate-900 transition-all flex items-center gap-2"
        >
          <Plus size={14} /> Issue New Invoice
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24"><Loader2 className="animate-spin text-slate-700" size={40} /></div>
      ) : (
        <div className="bg-slate-900/40 border border-white/5 overflow-hidden rounded-sm">
          <table className="w-full text-left">
            <thead className="bg-slate-950/50 border-b border-white/5 text-[10px] uppercase font-black tracking-[0.2em] text-slate-500">
              <tr>
                <th className="px-8 py-6">Invoice ID</th>
                <th className="px-8 py-6">Client</th>
                <th className="px-8 py-6">Amount</th>
                <th className="px-8 py-6">Date</th>
                <th className="px-8 py-6">State</th>
                <th className="px-8 py-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {invoices.map(inv => (
                <tr key={inv.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-8 py-6 font-mono text-[10px] text-[#c5a059]">{inv.id}</td>
                  <td className="px-8 py-6 font-bold text-white">{inv.clientName}</td>
                  <td className="px-8 py-6 text-white">฿{inv.amount.toLocaleString()}</td>
                  <td className="px-8 py-6 text-slate-500 text-xs">{inv.date}</td>
                  <td className="px-8 py-6">
                    <select 
                      value={inv.status} 
                      onChange={(e) => updateInvoiceStatus(inv.id, e.target.value as any)}
                      className={`text-[9px] font-black uppercase px-4 py-2 border border-white/10 outline-none rounded-sm ${
                        inv.status === 'paid' ? 'text-emerald-400' : 
                        inv.status === 'overdue' ? 'text-red-400' : 'text-amber-400'
                      } bg-slate-900`}
                    >
                      <option value="unpaid">UNPAID</option>
                      <option value="paid">PAID</option>
                      <option value="overdue">OVERDUE</option>
                    </select>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button className="text-slate-600 hover:text-white transition-colors"><Download size={14} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-10 bg-slate-950/98 backdrop-blur-xl">
          <div className="w-full max-w-2xl bg-slate-900 border border-[#c5a059]/30 p-12 relative rounded-sm shadow-2xl">
            <button onClick={() => setShowModal(false)} className="absolute top-8 right-8 text-slate-500 hover:text-white"><Receipt size={24} /></button>
            <h3 className="text-3xl font-serif-legal font-bold text-white mb-10 italic">Generate Professional Invoice</h3>
            
            <form onSubmit={handleCreate} className="space-y-8">
              <div className="space-y-4">
                <label className="text-[10px] font-black text-[#c5a059] uppercase tracking-widest">Select Client</label>
                <select 
                  required
                  className="w-full bg-slate-800 border-b border-white/10 py-4 px-6 text-white outline-none focus:border-[#c5a059]"
                  value={form.leadId}
                  onChange={(e) => setForm({...form, leadId: e.target.value})}
                >
                  <option value="">Choose Case Client...</option>
                  {leads.map(l => <option key={l.id} value={l.id}>{l.name} ({l.status.toUpperCase()})</option>)}
                </select>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black text-[#c5a059] uppercase tracking-widest">Line Items</label>
                {form.items.map((item, idx) => (
                  <div key={idx} className="flex gap-4">
                    <input 
                      className="flex-grow bg-slate-800 border-b border-white/10 py-3 px-4 text-white text-sm outline-none" 
                      placeholder="Service description" 
                      value={item.description}
                      onChange={(e) => {
                        const newItems = [...form.items];
                        newItems[idx].description = e.target.value;
                        setForm({...form, items: newItems});
                      }}
                    />
                    <input 
                      type="number" 
                      className="w-32 bg-slate-800 border-b border-white/10 py-3 px-4 text-white text-sm outline-none" 
                      placeholder="Price" 
                      value={item.price}
                      onChange={(e) => {
                        const newItems = [...form.items];
                        newItems[idx].price = Number(e.target.value);
                        setForm({...form, items: newItems});
                      }}
                    />
                  </div>
                ))}
                <button 
                  type="button" 
                  onClick={() => setForm({...form, items: [...form.items, { description: '', price: 0 }]})}
                  className="text-[9px] font-black text-slate-500 hover:text-[#c5a059] uppercase"
                >+ Add More Items</button>
              </div>

              <button className="w-full bg-[#c5a059] text-white py-6 font-black uppercase tracking-widest text-[11px] shadow-2xl">
                FINALIZE & ISSUE INVOICE
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
