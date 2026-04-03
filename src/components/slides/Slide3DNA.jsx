import React from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const COLORS = ['#6366F1', '#EC4899', '#10B981', '#F59E0B', '#3B82F6', '#8B5CF6'];

export default function Slide3DNA({ data }) {
  const chartData = Object.entries(data.languageDistribution)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 6);

  const topLanguage = chartData[0]?.name || 'Unknown';

  return (
    <div className="slide-container space-y-4 md:space-y-12">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center"
      >
        <span className="text-white/40 uppercase tracking-widest text-[10px] md:text-sm mb-2 block font-mono">Genetic Code Analysis</span>
        <h2 className="text-3xl md:text-6xl font-bold text-white tracking-tight">Your Coding DNA</h2>
        <p className="text-base md:text-xl text-white/60 mt-2 md:mt-4 leading-tight">You spoke <span className="text-primary font-bold">{topLanguage}</span> fluently this year.</p>
      </motion.div>

      <div className="w-full max-w-xs md:max-w-lg h-48 md:h-80 relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              innerRadius={45}
              outerRadius={75}
              paddingAngle={8}
              stroke="none"
              dataKey="value"
              animationBegin={200}
              animationDuration={1500}
            >
              {chartData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={COLORS[index % COLORS.length]} 
                  style={{ outline: 'none' }}
                />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ background: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
              itemStyle={{ color: '#fff' }}
            />
          </PieChart>
        </ResponsiveContainer>
        
        {/* Visual center piece */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
          <div className="flex flex-col items-center">
            <span className="text-[8px] uppercase tracking-widest text-white/30">Top Pick</span>
            <span className="text-base md:text-2xl font-bold text-white text-center">{topLanguage}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6 w-full max-w-xl">
        {chartData.map((lang, i) => (
          <motion.div
            key={lang.name}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1 + (i * 0.1) }}
            className="flex items-center gap-2 md:gap-3"
          >
            <div className="w-2 md:w-4 h-2 md:h-4 rounded-full shrink-0" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
            <div className="text-left flex flex-col min-w-0">
              <span className="text-[10px] md:text-sm font-bold text-white leading-none truncate">{lang.name}</span>
              <span className="text-[8px] md:text-xs text-white/40">{lang.value} projects</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
