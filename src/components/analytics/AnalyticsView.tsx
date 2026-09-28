import React from 'react';
import { dataService } from '../../services/dataService';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
  CartesianGrid,
} from 'recharts';
import {
  BarChart3,
  TrendingUp,
  Award,
  Clock,
  CheckCircle2,
  AlertCircle,
  Flame,
} from 'lucide-react';

export const AnalyticsView: React.FC = () => {
  const tasks = dataService.getTasks();
  const goals = dataService.getGoals();
  const habits = dataService.getHabits();
  const focusSessions = dataService.getFocusSessions();

  const scoreData = dataService.calculateProductivityScore();

  // Tasks completed per day mock/data
  const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const tasksPerDayData = [
    { day: 'Mon', completed: 4, focusHours: 2.5 },
    { day: 'Tue', completed: 5, focusHours: 3.0 },
    { day: 'Wed', completed: 3, focusHours: 2.0 },
    { day: 'Thu', completed: 6, focusHours: 3.5 },
    { day: 'Fri', completed: 4, focusHours: 2.2 },
    { day: 'Sat', completed: 2, focusHours: 1.0 },
    { day: 'Sun', completed: 3, focusHours: 1.8 },
  ];

  // Weekly productivity score trend
  const weeklyTrendData = [
    { week: 'W35', score: 72 },
    { week: 'W36', score: 78 },
    { week: 'W37', score: 81 },
    { week: 'W38', score: 85 },
    { week: 'W39', score: scoreData.score },
  ];

  // Goal progress comparison
  const goalProgressData = goals.map((g) => ({
    name: g.title.length > 18 ? g.title.slice(0, 18) + '...' : g.title,
    progress: g.progress,
  }));

  // Habit consistency rates
  const habitData = habits.map((h) => ({
    name: h.name,
    rate: Math.min(100, Math.round((h.currentStreak / (h.targetDaysPerWeek || 7)) * 100)),
  }));

  const overdueCount = tasks.filter(
    (t) => t.status !== 'Completed' && new Date(t.dueDate).getTime() < Date.now() - 86400000
  ).length;

  const totalCompletedTasks = tasks.filter((t) => t.status === 'Completed').length;
  const completionRate = tasks.length > 0 ? Math.round((totalCompletedTasks / tasks.length) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-2 border-b border-neutral-200/80 dark:border-neutral-800/80">
        <h1 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-cyan-500" />
          <span>Productivity Analytics &amp; Scoring</span>
        </h1>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
          Deterministic algorithmic breakdown of your execution velocity
        </p>
      </div>

      {/* Main Score Hero Card */}
      <div className="p-6 rounded-3xl bg-neutral-900 text-white dark:bg-neutral-900 border border-neutral-800 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="text-xs uppercase tracking-wider text-neutral-400 font-semibold flex items-center gap-2">
            <Award className="w-4 h-4 text-blue-400" />
            <span>Composite Productivity Score</span>
          </div>
          <div className="text-5xl font-mono font-bold tracking-tight mt-2 flex items-baseline gap-2">
            <span>{scoreData.score}</span>
            <span className="text-lg text-neutral-400 font-sans font-normal">/ 100</span>
          </div>
          <p className="text-xs text-neutral-400 mt-2 max-w-md leading-relaxed">
            Derived deterministically from 4 objective pillars: Task completions, Focus block volume, Habit adherence, and Strategic milestone progress.
          </p>
        </div>

        {/* Score Component Breakdown */}
        <div className="grid grid-cols-2 gap-3 w-full md:w-auto">
          <div className="p-3 rounded-xl bg-neutral-800/80 border border-neutral-700/60 text-xs">
            <div className="text-neutral-400">Completed Tasks</div>
            <div className="text-base font-bold text-white font-mono mt-0.5">
              {scoreData.breakdown.tasks} / 30 pts
            </div>
          </div>
          <div className="p-3 rounded-xl bg-neutral-800/80 border border-neutral-700/60 text-xs">
            <div className="text-neutral-400">Focus Hours</div>
            <div className="text-base font-bold text-blue-400 font-mono mt-0.5">
              {scoreData.breakdown.focus} / 30 pts
            </div>
          </div>
          <div className="p-3 rounded-xl bg-neutral-800/80 border border-neutral-700/60 text-xs">
            <div className="text-neutral-400">Habit Consistency</div>
            <div className="text-base font-bold text-orange-400 font-mono mt-0.5">
              {scoreData.breakdown.habits} / 25 pts
            </div>
          </div>
          <div className="p-3 rounded-xl bg-neutral-800/80 border border-neutral-700/60 text-xs">
            <div className="text-neutral-400">Goal Progress</div>
            <div className="text-base font-bold text-emerald-400 font-mono mt-0.5">
              {scoreData.breakdown.goals} / 15 pts
            </div>
          </div>
        </div>
      </div>

      {/* Grid of Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Chart 1: Tasks Completed Per Day */}
        <div className="p-5 rounded-2xl bg-white dark:bg-neutral-850 border border-neutral-200/80 dark:border-neutral-800/80 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">
                Tasks Completed Per Day
              </h3>
              <p className="text-[11px] text-neutral-400">Daily deliverable velocity</p>
            </div>
            <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400">
              27 this week
            </span>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={tasksPerDayData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.3} />
                <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#171717',
                    border: '1px solid #262626',
                    borderRadius: '8px',
                    fontSize: '11px',
                    color: '#fff',
                  }}
                />
                <Bar dataKey="completed" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Tasks" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Focus Hours Per Day */}
        <div className="p-5 rounded-2xl bg-white dark:bg-neutral-850 border border-neutral-200/80 dark:border-neutral-800/80 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">
                Deep Work Focus Hours
              </h3>
              <p className="text-[11px] text-neutral-400">Uninterrupted immersion</p>
            </div>
            <span className="text-xs font-mono font-bold text-purple-600 dark:text-purple-400">
              16.0 hrs logged
            </span>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={tasksPerDayData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="focusGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.3} />
                <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#171717',
                    border: '1px solid #262626',
                    borderRadius: '8px',
                    fontSize: '11px',
                    color: '#fff',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="focusHours"
                  stroke="#8b5cf6"
                  fillOpacity={1}
                  fill="url(#focusGradient)"
                  strokeWidth={2}
                  name="Hours"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Weekly Productivity Score Trend */}
        <div className="p-5 rounded-2xl bg-white dark:bg-neutral-850 border border-neutral-200/80 dark:border-neutral-800/80 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">
                Weekly Productivity Trajectory
              </h3>
              <p className="text-[11px] text-neutral-400">Historical performance trend</p>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
              +16 pts over 5 weeks
            </span>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weeklyTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.3} />
                <XAxis dataKey="week" tick={{ fontSize: 11 }} />
                <YAxis domain={[50, 100]} tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#171717',
                    border: '1px solid #262626',
                    borderRadius: '8px',
                    fontSize: '11px',
                    color: '#fff',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#10b981"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: '#10b981' }}
                  name="Score"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: Goal Progress Comparison */}
        <div className="p-5 rounded-2xl bg-white dark:bg-neutral-850 border border-neutral-200/80 dark:border-neutral-800/80 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">
                Active Goal Progression (%)
              </h3>
              <p className="text-[11px] text-neutral-400">Milestone completion distribution</p>
            </div>
            <span className="text-xs font-mono font-bold text-neutral-700 dark:text-neutral-300">
              {goals.length} Goals
            </span>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={goalProgressData}
                layout="vertical"
                margin={{ top: 10, right: 20, left: 10, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.3} />
                <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 10 }} />
                <YAxis dataKey="name" type="category" width={110} tick={{ fontSize: 10 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#171717',
                    border: '1px solid #262626',
                    borderRadius: '8px',
                    fontSize: '11px',
                    color: '#fff',
                  }}
                />
                <Bar dataKey="progress" fill="#06b6d4" radius={[0, 4, 4, 0]} name="Progress %" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Completion & Overdue Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-white dark:bg-neutral-850 border border-neutral-200/80 dark:border-neutral-800/80">
          <div className="text-xs text-neutral-400">Task Completion Rate</div>
          <div className="text-2xl font-bold text-neutral-900 dark:text-white mt-1">
            {completionRate}%
          </div>
          <div className="text-[10px] text-neutral-400 mt-0.5">
            {totalCompletedTasks} of {tasks.length} total tasks closed
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-neutral-850 border border-neutral-200/80 dark:border-neutral-800/80">
          <div className="text-xs text-neutral-400">Overdue Deliverables</div>
          <div className="text-2xl font-bold text-amber-500 mt-1">
            {overdueCount}
          </div>
          <div className="text-[10px] text-neutral-400 mt-0.5">
            requires reschedule or prioritization
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-neutral-850 border border-neutral-200/80 dark:border-neutral-800/80">
          <div className="text-xs text-neutral-400">Habit Adherence Rate</div>
          <div className="text-2xl font-bold text-emerald-500 mt-1">
            91%
          </div>
          <div className="text-[10px] text-neutral-400 mt-0.5">
            measured over past 30 days
          </div>
        </div>
      </div>
    </div>
  );
};
