
import React, { useState, useEffect } from 'react';
import { ShieldAlert, Clock, User, Activity, Loader2 } from 'lucide-react';
import { backendService } from '../../services/backend';
import { ActivityLog } from '../../types';

export const LogsView: React.FC = () => {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const data = await backendService.getLogs();
      setLogs(data);
      setLoading(false);
    };
    fetch();
  }, []);

  return (
    <div className="animate-reveal-up space-y-12">
      <div>
        <h3 className="text-2xl font-serif-legal font-bold text-white mb-2 italic">Security Activity Audit</h3>
        <p className="text-slate-500 text-[10px] uppercase tracking-widest font-black">Historical Logs of Administrative Actions</p>
      </div>

      <div className="bg-slate-900/40 border border-white/5 rounded-sm overflow-hidden shadow-2xl">
        <div className="divide-y divide-white/5">
          {loading ? (
             <div className="p-20 flex justify-center"><Loader2 className="animate-spin text-slate-700" size={32} /></div>
          ) : logs.length === 0 ? (
            <div className="p-20 text-center text-slate-700 text-[10px] font-black uppercase tracking-[0.5em]">No records found</div>
          ) : (
            logs.map(log => (
              <div key={log.id} className="p-8 flex items-center justify-between hover:bg-white/[0.01] transition-all group">
                <div className="flex items-center gap-8">
                  <div className="w-12 h-12 rounded-full bg-slate-950 flex items-center justify-center text-[#c5a059] border border-white/5">
                    <Activity size={18} />
                  </div>
                  <div>
                    <p className="text-white text-sm font-bold mb-1">{log.action}</p>
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1.5 text-[9px] text-slate-500 font-black uppercase tracking-widest"><User size={10} className="text-[#c5a059]" /> {log.userName}</span>
                      <span className="flex items-center gap-1.5 text-[9px] text-slate-600 font-black uppercase tracking-widest"><Clock size={10} /> {new Date(log.timestamp).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                <div className="text-[9px] font-mono text-slate-800 select-none group-hover:text-slate-600 transition-colors uppercase tracking-widest">
                  REF: {log.id}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
