  import { useEffect, useState } from "react";
  import { Shield } from "lucide-react";
  


export default function TrustBar() {
    // online/offline
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  useEffect(() => {
    const onOnline = () => setIsOnline(true);
    const onOffline = () => setIsOnline(false);
    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);
    return () => { window.removeEventListener("online", onOnline); window.removeEventListener("offline", onOffline); };
  }, []);
  
    return (
      <div className="w-full bg-white/90 dark:bg-ink-800/90 border-b border-black/15 dark:border-white/10 trust-bar" role="status" aria-hidden>
        <div className="mx-auto max-w-7xl px-4 md:px-6 py-2 flex items-center justify-between text-xs text-slate-700 dark:text-slate-300">
          <div className="flex items-center gap-4">
            
            <div className="flex items-center trust-item"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden><circle cx="12" cy="12" r="10" fill="#e6eefb" /><path d="M8 12l2 2 4-4" stroke="#0b62c3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg><span>FDIC insured</span></div>
            <div className="flex items-center trust-item"><Shield className="w-4 h-4 text-[#0F5F7F]" /><span>256-bit encryption</span></div>
            {!isOnline && (<div className="flex items-center gap-2 text-amber-500"><CloudOff className="w-6 h-6" /> Offline data available</div>)}
          </div>
          <div className="flex items-center gap-4 "><span>Session active</span><button className="text-slate-500 dark:text-slate-400">Account & Security</button></div>
        </div>
      </div>
    );
  }