
import React, { useState, useEffect, useRef } from 'react';
import { Plus, Loader2, Newspaper, Briefcase, Trash2, X, Image as ImageIcon, Sparkles, Send, Upload } from 'lucide-react';
import { backendService } from '../../services/backend';
import { NewsItem, CaseStudy } from '../../types';

export const CMSView: React.FC<{ type: 'news' | 'cases' }> = ({ type }) => {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [broadcastToSubscribers, setBroadcastToSubscribers] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form State
  const [form, setForm] = useState<any>({
    title: '', category: '', description: '', image: '', mainImage: '', author: '', fullContent: '', impact: '', year: '', imagePrompt: ''
  });

  useEffect(() => {
    loadContent();
  }, [type]);

  const loadContent = async () => {
    setLoading(true);
    const data = type === 'news' ? await backendService.getAllNews() : await backendService.getAllCases();
    setItems(data);
    setLoading(false);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if image exists (from URL or upload)
    const imageField = type === 'news' ? form.image : form.mainImage;
    if (!imageField) {
      alert("❌ Please upload or generate an image before publishing");
      return;
    }

    // Check if title and description exist
    if (!form.title.trim()) {
      alert("❌ Please enter a title");
      return;
    }

    if (!form.description.trim()) {
      alert("❌ Please enter a description");
      return;
    }

    if (!form.fullContent.trim()) {
      alert("❌ Please enter content");
      return;
    }
    
    try {
      if (type === 'news') {
        await backendService.createNews({ 
          ...form, 
          fullContent: form.fullContent.split('\n'), 
          readingTime: 'อ่าน 5 นาที', 
          tags: ['Legal'] 
        }, broadcastToSubscribers);
        alert("✅ News published successfully!");
      } else {
        await backendService.createCase({ 
          ...form, 
          categoryLabel: form.category.toUpperCase(), 
          fullContent: form.fullContent.split('\n'), 
          gallery: [form.mainImage], 
          highlights: ['Winning Result'] 
        });
        alert("✅ Case study published successfully!");
      }
      setShowModal(false);
      resetForm();
      loadContent();
    } catch (error: any) {
      console.error("Create error:", error);
      alert(`❌ Error: ${error.message || 'Failed to publish. Please try again.'}`);
    }
  };

  const resetForm = () => {
    setForm({ title: '', category: '', description: '', image: '', mainImage: '', author: '', fullContent: '', impact: '', year: '', imagePrompt: '' });
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Confirm deletion of this entry?')) {
      type === 'news' ? await backendService.deleteNews(id) : await backendService.deleteCase(id);
      loadContent();
    }
  };

  const generateAIImage = async () => {
    const prompt = form.imagePrompt || form.title;
    if (!prompt) return alert("Please enter a title or image prompt first to guide the AI");
    setIsGeneratingImage(true);
    try {
      const url = await backendService.generateThematicImage(prompt);
      setForm({ ...form, [type === 'news' ? 'image' : 'mainImage']: url });
      alert("✅ AI Image generated successfully!");
    } catch (e) { 
      alert("AI Image Generation failed. Please try again.");
      console.error(e);
    }
    setIsGeneratingImage(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        compressImage(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const compressImage = (base64String: string) => {
    const img = new Image();
    img.src = base64String;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const maxWidth = 1200;
      const maxHeight = 800;
      let width = img.width;
      let height = img.height;

      // Calculate dimensions to fit within max size
      if (width > height) {
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(img, 0, 0, width, height);

      // Compress with quality reduction
      let quality = 0.9;
      let compressedImage = canvas.toDataURL('image/jpeg', quality);

      // Keep reducing quality until size is acceptable
      while (compressedImage.length > 900000 && quality > 0.3) {
        quality -= 0.1;
        compressedImage = canvas.toDataURL('image/jpeg', quality);
      }

      if (compressedImage.length > 900000) {
        alert('❌ Image is still too large after compression. Please use a smaller image.');
        return;
      }

      setForm({ ...form, [type === 'news' ? 'image' : 'mainImage']: compressedImage });
      alert('✅ Image compressed and uploaded successfully!');
    };
  };

  return (
    <div className="animate-reveal-up pb-20">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
        <div 
          onClick={() => setShowModal(true)} 
          className="group border-2 border-dashed border-white/5 aspect-video flex flex-col items-center justify-center text-slate-600 hover:text-[#c5a059] hover:border-[#c5a059]/50 transition-all duration-500 cursor-pointer bg-slate-900/20 rounded-sm relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-[#c5a059]/0 group-hover:bg-[#c5a059]/5 transition-colors duration-500"></div>
          <Plus size={48} className="group-hover:scale-110 transition-transform duration-500" />
          <span className="text-[11px] font-black uppercase tracking-[0.4em] mt-6 group-hover:tracking-[0.5em] transition-all">Create {type === 'news' ? 'News' : 'Case Study'}</span>
        </div>

        {loading ? (
          <div className="aspect-video flex items-center justify-center bg-slate-900/20">
             <Loader2 className="animate-spin text-slate-700" size={32} />
          </div>
        ) : (
          items.map(item => (
            <div key={item.id} className="bg-slate-900/40 border border-white/5 overflow-hidden group rounded-sm shadow-xl flex flex-col h-full hover:border-white/10 transition-all">
              <div className="aspect-video overflow-hidden relative">
                <img 
                  src={type === 'news' ? item.image : item.mainImage} 
                  className="w-full h-full object-cover opacity-60 grayscale group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-1000" 
                  alt={item.title}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60"></div>
              </div>
              <div className="p-8 flex flex-col flex-grow">
                <h3 className="text-white font-bold text-lg mb-6 line-clamp-2 leading-snug group-hover:text-[#c5a059] transition-colors">{item.title}</h3>
                <div className="mt-auto pt-6 border-t border-white/5 flex justify-between items-center">
                  <span className="text-[9px] text-slate-600 font-black uppercase tracking-widest">{type === 'news' ? 'NEWS' : 'CASE STUDY'}</span>
                  <button onClick={() => handleDelete(item.id)} className="text-red-500/40 hover:text-red-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all">
                    <Trash2 size={12} /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 sm:p-10">
          <div 
            className="absolute inset-0 bg-slate-950/98 backdrop-blur-2xl"
            onClick={() => setShowModal(false)}
          ></div>
          
          <div className="w-full max-w-4xl bg-slate-900 border border-[#c5a059]/20 shadow-[0_0_100px_rgba(0,0,0,0.8)] relative z-10 flex flex-col max-h-[90vh] rounded-sm">
            
            <div className="p-8 sm:p-12 border-b border-white/5 flex justify-between items-center">
              <div>
                <p className="text-[#c5a059] text-[9px] font-black uppercase tracking-[0.5em] mb-2">Internal Management</p>
                <h2 className="text-3xl sm:text-4xl font-serif-legal font-bold text-white italic">Create {type.toUpperCase()} Entry</h2>
              </div>
              <button 
                onClick={() => setShowModal(false)} 
                className="p-3 text-slate-500 hover:text-white hover:bg-white/5 rounded-full transition-all"
              >
                <X size={28} />
              </button>
            </div>

            <div className="flex-grow overflow-y-auto p-8 sm:p-12">
              <form onSubmit={handleCreate} id="cms-form" className="space-y-12">
                
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-[#c5a059] uppercase tracking-widest">Entry Title</label>
                  <input 
                    required 
                    className="w-full bg-slate-950/50 border border-white/10 py-5 px-6 text-white text-xl sm:text-2xl font-serif-legal outline-none focus:border-[#c5a059] transition-all placeholder:text-slate-700" 
                    placeholder="Enter headline..." 
                    value={form.title} 
                    onChange={(e) => setForm({...form, title: e.target.value})} 
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-[#c5a059] uppercase tracking-widest">Category</label>
                    <input 
                      required
                      className="w-full bg-slate-950/50 border border-white/10 py-4 px-6 text-white text-sm outline-none focus:border-[#c5a059] transition-all" 
                      placeholder="e.g. Labor Law, News" 
                      value={form.category} 
                      onChange={(e) => setForm({...form, category: e.target.value})} 
                    />
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-[#c5a059] uppercase tracking-widest">
                      {type === 'news' ? 'Author Name' : 'Achievement Impact'}
                    </label>
                    <input 
                      required
                      className="w-full bg-slate-950/50 border border-white/10 py-4 px-6 text-white text-sm outline-none focus:border-[#c5a059] transition-all" 
                      placeholder={type === 'news' ? "Attorney Name" : "e.g. 10M Win"} 
                      value={type === 'news' ? form.author : form.impact} 
                      onChange={(e) => setForm({...form, [type === 'news' ? 'author' : 'impact']: e.target.value})} 
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black text-[#c5a059] uppercase tracking-widest">Lead Description</label>
                  <input 
                    required
                    className="w-full bg-slate-950/50 border border-white/10 py-4 px-6 text-white text-sm outline-none focus:border-[#c5a059] transition-all" 
                    placeholder="Brief summary for list view..." 
                    value={form.description} 
                    onChange={(e) => setForm({...form, description: e.target.value})} 
                  />
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black text-[#c5a059] uppercase tracking-widest">Hero Image Resource</label>
                  <div className="flex flex-col gap-6">
                    <div className="relative">
                      <ImageIcon className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                      <input 
                        className="w-full bg-slate-950/50 border border-white/10 py-4 pl-14 pr-6 text-white text-sm outline-none focus:border-[#c5a059] transition-all" 
                        placeholder="https://images.unsplash.com/... or upload from computer" 
                        value={type === 'news' ? form.image : form.mainImage} 
                        onChange={(e) => setForm({...form, [type === 'news' ? 'image' : 'mainImage']: e.target.value})} 
                      />
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-4">
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleFileUpload} 
                        className="hidden" 
                        accept="image/*"
                      />
                      <button 
                        type="button" 
                        onClick={() => fileInputRef.current?.click()}
                        className="flex-grow bg-slate-800 text-white px-8 py-4 text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-slate-900 transition-all flex items-center justify-center gap-3 border border-white/5"
                      >
                        <Upload size={14} /> UPLOAD FROM COMPUTER
                      </button>
                      
                      <button 
                        type="button" 
                        onClick={generateAIImage} 
                        disabled={isGeneratingImage}
                        className="flex-grow bg-[#c5a059] text-white px-8 py-4 text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-slate-900 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                      >
                        {isGeneratingImage ? <Loader2 className="animate-spin" size={14} /> : <Sparkles size={14} />}
                        {isGeneratingImage ? 'GENERATING...' : 'AI GENERATE'}
                      </button>
                    </div>

                    {(type === 'news' ? form.image : form.mainImage) && (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between mb-2">
                          <label className="text-[10px] font-black text-[#c5a059] uppercase tracking-widest">Image Preview</label>
                          <button
                            type="button"
                            onClick={() => setForm({...form, [type === 'news' ? 'image' : 'mainImage']: ''})}
                            className="text-[8px] font-black text-red-500 hover:text-red-400 uppercase tracking-widest"
                          >
                            ✕ REMOVE
                          </button>
                        </div>
                        <div className="relative group overflow-hidden rounded-lg border border-[#c5a059]/30 hover:border-[#c5a059]/60 transition-all">
                          <div className="aspect-video bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 flex items-center justify-center overflow-hidden">
                            <img 
                              src={type === 'news' ? form.image : form.mainImage} 
                              alt="Preview" 
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                                e.currentTarget.parentElement!.innerHTML = '<div class="flex flex-col items-center justify-center w-full h-full text-slate-600"><span class="text-[12px] font-black uppercase">❌ Image Not Found</span></div>';
                              }}
                            />
                          </div>
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-between p-4">
                            <span className="text-[9px] font-black text-white uppercase tracking-widest">
                              {type === 'news' ? 'News Hero Image' : 'Case Study Hero Image'}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="space-y-3 pt-4 border-t border-white/10">
                      <label className="text-[10px] font-black text-[#c5a059] uppercase tracking-widest">AI Image Prompt (Optional)</label>
                      <textarea 
                        rows={2}
                        className="w-full bg-slate-950/50 border border-white/10 p-4 text-white text-sm outline-none focus:border-[#c5a059] transition-all placeholder:text-slate-700 rounded-sm" 
                        placeholder="e.g. 'Professional lawyer in modern office, luxury law firm style' or leave empty to use title" 
                        value={form.imagePrompt} 
                        onChange={(e) => setForm({...form, imagePrompt: e.target.value})} 
                      />
                      <p className="text-[8px] text-slate-600 italic">Hint: More detailed prompts produce better AI-generated images</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-end">
                    <label className="text-[10px] font-black text-[#c5a059] uppercase tracking-widest">Primary Content Narrative</label>
                    <span className="text-[9px] text-slate-600 uppercase font-black">Use new line for each paragraph</span>
                  </div>
                  <textarea 
                    required 
                    rows={10} 
                    className="w-full bg-slate-950/50 border border-white/10 p-8 text-white text-base leading-relaxed outline-none focus:border-[#c5a059] transition-all placeholder:text-slate-800 rounded-sm" 
                    placeholder="Draft the detailed article or case story here..." 
                    value={form.fullContent} 
                    onChange={(e) => setForm({...form, fullContent: e.target.value})} 
                  />
                </div>
                
                {type === 'news' && (
                  <div className="pt-6 border-t border-white/5">
                    <label className="flex items-center gap-4 cursor-pointer group">
                      <div 
                        onClick={() => setBroadcastToSubscribers(!broadcastToSubscribers)}
                        className={`w-12 h-6 rounded-full relative transition-all ${broadcastToSubscribers ? 'bg-[#c5a059]' : 'bg-slate-800'}`}
                      >
                        <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${broadcastToSubscribers ? 'left-7' : 'left-1'}`}></div>
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-white">Broadcast to Subscribers</p>
                        <p className="text-[8px] text-slate-500 uppercase">Send notification email to all newsletter members</p>
                      </div>
                    </label>
                  </div>
                )}
              </form>
            </div>

            <div className="p-8 sm:p-12 border-t border-white/5 bg-slate-900/80 backdrop-blur-md">
              <button 
                type="submit" 
                form="cms-form"
                className="w-full bg-white text-slate-900 py-6 font-black uppercase tracking-[0.6em] text-[11px] hover:bg-[#c5a059] hover:text-white transition-all shadow-2xl flex items-center justify-center gap-4"
              >
                <Send size={16} /> PUBLISH OFFICIAL ENTRY
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};
