import { useState } from "react";
import Button from './Button';
import { motion, AnimatePresence } from "framer-motion";

export default function SupportDrawer() {

      const [supportOpen, setSupportOpen] = useState(false);
    return (
      <AnimatePresence>
        {supportOpen && (
          <motion.aside initial={{ x: 320 }} animate={{ x: 0 }} exit={{ x: 320 }} transition={{ type: 'tween' }} className="fixed right-0 top-0 h-full z-70 w-[92vw] sm:w-[420px] bg-white dark:bg-ink-800 shadow-2xl p-4 support-drawer">
            <div className="flex items-center justify-between mb-4"><h4 className="text-lg font-semibold">Support</h4><button className="icon-btn" onClick={() => setSupportOpen(false)}><X /></button></div>
            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-gray-50 dark:bg-ink-700"><div className="text-sm font-medium">Chat with our assistant</div><div className="text-xs text-slate-500">Demo assistant — integrate your bot here</div></div>
              <div className="p-3 rounded-lg bg-white dark:bg-ink-700"><div className="text-xs text-slate-500 mb-2">Message</div><textarea rows="4" className="w-full px-3 py-2 rounded-md bg-gray-50 dark:bg-white/6" placeholder="Describe your issue..."></textarea><div className="mt-2 flex justify-end gap-2"><Button variant="ghost">Attach</Button><Button variant="primary">Send</Button></div></div>
              <div className="text-sm text-slate-500"><div className="font-medium">Need urgent help?</div><div>Call us: <a href="tel:+18005551234" className="text-emerald-600">+1 (800) 555-1234</a></div></div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    );
  }