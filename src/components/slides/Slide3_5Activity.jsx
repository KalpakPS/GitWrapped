import React from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Sun, Moon, Coffee, Zap, Clock, Calendar } from 'lucide-react';

const COLORS = ['#6366F1', '#EC4899', '#10B981', '#F59E0B', '#3B82F6', '#8B5CF6'];

export default function Slide3_5Activity({ data }) {
  const { commitTimestamps, mostActiveDay: totalMostActiveDay } = data;

  // Process timestamps in local timezone
  const hourCounts = Array(24).fill(0);
  const dayCounts = Array(7).fill(0);
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const fullDayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  commitTimestamps.forEach(ts => {
    const date = new Date(ts);
    const hour = date.getHours();
    const day = date.getDay();
    hourCounts[hour]++;
    dayCounts[day]++;
  });

  const dailyActivity = dayNames.map((name, i) => ({
    day: name,
    count: dayCounts[i]
  }));

  const hourlyActivity = hourCounts.map((count, i) => ({
    hour: i,
    count
  }));

  // Find peak hour
  let mostActiveHour = 14;
  let maxHourCount = -1;
  hourCounts.forEach((count, i) => {
    if (count > maxHourCount) {
      maxHourCount = count;
      mostActiveHour = i;
    }
  });

  // Find peak day from timestamps
  let peakDayIndex = 1;
  let maxDayCount = -1;
  dayCounts.forEach((count, i) => {
    if (count > maxDayCount) {
      maxDayCount = count;
      peakDayIndex = i;
    }
  });
  const mostActiveDay = fullDayNames[peakDayIndex];

  let timeOfDay = 'Afternoon';
  if (mostActiveHour >= 0 && mostActiveHour < 5) timeOfDay = 'Deep Night';
  else if (mostActiveHour >= 5 && mostActiveHour < 9) timeOfDay = 'Early Morning';
  else if (mostActiveHour >= 9 && mostActiveHour < 12) timeOfDay = 'Morning';
  else if (mostActiveHour >= 12 && mostActiveHour < 17) timeOfDay = 'Afternoon';
  else if (mostActiveHour >= 17 && mostActiveHour < 21) timeOfDay = 'Evening';
  else timeOfDay = 'Late Night';

  const getActivityTitle = () => {
    if (mostActiveDay === 'Saturday' || mostActiveDay === 'Sunday') return 'The Weekend Warrior';
    if (mostActiveHour >= 22 || mostActiveHour <= 4) return 'The Night Owl';
    if (mostActiveHour >= 5 && mostActiveHour <= 9) return 'The Early Bird';
    if (mostActiveHour >= 12 && mostActiveHour <= 17) return 'Midday Maverick';
    if (data.totalCommits > 500) return 'The Coding Machine';
    return 'The Daily Crusader';
  };

  const getTimeIcon = () => {
    switch (timeOfDay) {
      case 'Deep Night': return <Moon className="w-8 h-8 text-indigo-400" />;
      case 'Early Morning': return <Coffee className="w-8 h-8 text-yellow-400" />;
      case 'Morning': return <Sun className="w-8 h-8 text-yellow-500" />;
      case 'Afternoon': return <Zap className="w-8 h-8 text-orange-400" />;
      case 'Evening': return <Clock className="w-8 h-8 text-purple-400" />;
      default: return <Moon className="w-8 h-8 text-blue-400" />;
    }
  };

  return (
    <div className="slide-container h-full flex flex-col justify-center items-center py-4 px-4 md:px-8 space-y-6 md:space-y-10 overflow-y-auto w-full">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="flex items-center justify-center gap-3 mb-2">
          {getTimeIcon()}
          <span className="text-white/40 uppercase tracking-[0.2em] text-[10px] md:text-xs font-mono">Activity Rhythm</span>
        </div>
        <h2 className="text-3xl md:text-6xl font-bold text-white tracking-tight leading-tight">
          {getActivityTitle()}
        </h2>
        <p className="text-sm md:text-xl text-white/60 mt-2">
          You thrive during the <span className="text-primary font-bold">{timeOfDay}</span>, 
          especially on <span className="text-primary font-bold">{mostActiveDay}s</span>.
        </p>
      </motion.div>

      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
        {/* Weekly Activity */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="glass p-4 md:p-6 rounded-3xl border border-white/5 flex flex-col items-center group relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="flex items-center gap-2 mb-4 self-start text-white/60">
            <Calendar className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">Weekly Energy</span>
          </div>
          <div className="w-full h-40 md:h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailyActivity}>
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366F1" stopOpacity={1}/>
                    <stop offset="100%" stopColor="#8B5CF6" stopOpacity={0.4}/>
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="day" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12, fontWeight: 500 }}
                  dy={10}
                />
                <Tooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.05)', radius: 8 }}
                  contentStyle={{ background: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                  itemStyle={{ color: '#fff' }}
                  labelStyle={{ display: 'none' }}
                />
                <Bar 
                  dataKey="count" 
                  fill="url(#barGradient)" 
                  radius={[6, 6, 0, 0]}
                  animationBegin={200}
                  animationDuration={800}
                >
                  {dailyActivity.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`}
                      fill={entry.day === mostActiveDay.substring(0, 3) ? '#EC4899' : 'url(#barGradient)'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Hourly Activity */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="glass p-4 md:p-6 rounded-3xl border border-white/5 flex flex-col items-center group relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="flex items-center gap-2 mb-4 self-start text-white/60">
            <Clock className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">Hourly Pulse</span>
          </div>
          <div className="w-full h-40 md:h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={hourlyActivity}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EC4899" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#EC4899" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="hour" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10 }}
                  interval={3}
                  tickFormatter={(val) => `${val}:00`}
                  dy={10}
                />
                <Tooltip 
                  contentStyle={{ background: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                  itemStyle={{ color: '#fff' }}
                  labelFormatter={(val) => `${val}:00`}
                />
                <Area 
                  type="monotone" 
                  dataKey="count" 
                  stroke="#EC4899" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorCount)" 
                  animationBegin={400}
                  animationDuration={1000}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="text-[10px] md:text-xs text-white/20 font-mono uppercase tracking-widest mt-4"
      >
        Analysis based on your top 5 most active repositories
      </motion.p>
    </div>
  );
}
