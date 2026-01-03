import {motion} from 'framer-motion'
import { useInViewOnce } from "../utils/viewonce.js";



export default function GoalsRewards() {
  const [ref, inView] = useInViewOnce();

  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 12, scale: 0.98 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.45 }}
      className="card p-6 rounded-2xl shadow-lg dark:bg-ink-900/40"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="section-title text-slate-700 dark:text-slate-300">Goals & Rewards</h3>
        <span className="text-xs text-slate-500">Progress & perks</span>
      </div>

      <div className="space-y-4">
        {/* Goal */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Emergency Fund</span>
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">46%</span>
          </div>

          <div className="w-full bg-slate-300/20 dark:bg-white/10 rounded-full h-2 overflow-hidden">
            <div className="h-2 bg-emerald-600" style={{ width: "46%" }} />
          </div>
        </div>

        {/* Rewards */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-700 dark:text-slate-300">Rewards points</span>
            <div className="font-semibold text-lg text-slate-700 dark:text-slate-300">2,400 pts</div>
          </div>

          <div className="text-right">
            <span className="text-xs text-slate-500">Tier</span>
            <div className="font-semibold text-slate-700 dark:text-slate-300">Silver</div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
