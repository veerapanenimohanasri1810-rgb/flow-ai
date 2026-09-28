import React from 'react';
import {
  CheckSquare,
  FolderKanban,
  Target,
  Calendar as CalendarIcon,
  Flame,
  Clock,
  BarChart3,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Check,
  Compass,
  FileText,
  Sliders,
  Sun,
  Moon,
  Zap,
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface LandingPageProps {
  onEnterApp: () => void;
  onOpenAuth: (mode?: 'login' | 'register') => void;
  onOpenAgentModal: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onEnterApp,
  onOpenAuth,
  onOpenAgentModal,
}) => {
  const { theme, toggleTheme } = useTheme();

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 transition-colors">
      {/* Navigation Header */}
      <header className="sticky top-0 z-40 w-full border-b border-neutral-200/80 dark:border-neutral-800/80 bg-white/80 dark:bg-neutral-950/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 flex items-center justify-center font-bold text-sm tracking-tight shadow-xs">
              FL
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-semibold tracking-tight text-base">FlowAI</span>
              <span className="text-xs text-neutral-400 hidden sm:inline">Workspace</span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-neutral-600 dark:text-neutral-300">
            <button onClick={() => scrollToSection('tasks')} className="hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer">
              Tasks
            </button>
            <button onClick={() => scrollToSection('projects')} className="hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer">
              Projects
            </button>
            <button onClick={() => scrollToSection('goals')} className="hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer">
              Goals
            </button>
            <button onClick={() => scrollToSection('calendar')} className="hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer">
              Calendar
            </button>
            <button onClick={() => scrollToSection('focus')} className="hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer">
              Focus
            </button>
            <button onClick={() => scrollToSection('habits')} className="hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer">
              Habits
            </button>
            <button onClick={() => scrollToSection('ai-agent')} className="hover:text-neutral-900 dark:hover:text-white transition-colors flex items-center gap-1 cursor-pointer">
              <Sparkles className="w-3 h-3 text-blue-500" />
              <span>AI Agent</span>
            </button>
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <button
              onClick={() => onOpenAuth('login')}
              className="text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:text-neutral-950 dark:hover:text-white px-3 py-1.5 transition-colors cursor-pointer"
            >
              Sign In
            </button>
            <button
              onClick={onEnterApp}
              className="text-xs font-medium px-4 py-2 rounded-lg bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100 transition-colors shadow-xs cursor-pointer flex items-center gap-1.5"
            >
              <span>Launch App</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative pt-20 pb-24 md:pt-28 md:pb-32 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-neutral-100 dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-800 mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
          <span>Next-Generation Personal Productivity Workspace</span>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-neutral-900 dark:text-white max-w-4xl mx-auto leading-[1.12]">
          Get More Done. <br className="hidden sm:inline" />
          With Less Mental Clutter.
        </h1>

        <p className="mt-6 text-base sm:text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto font-normal leading-relaxed">
          One workspace for your tasks, goals, projects, habits and time.
        </p>

        {/* Hero CTA buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => onOpenAuth('register')}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm transition-all shadow-md shadow-blue-500/10 flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Start Free</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => scrollToSection('how-it-works')}
            className="w-full sm:w-auto px-6 py-3 rounded-xl border border-neutral-300 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-medium text-sm transition-colors cursor-pointer"
          >
            See How It Works
          </button>
        </div>

        {/* Quick Launch Demo pill */}
        <div className="mt-5 text-xs text-neutral-500 dark:text-neutral-400 flex items-center justify-center gap-2">
          <span>Ready to test directly?</span>
          <button
            onClick={onEnterApp}
            className="text-blue-600 dark:text-blue-400 font-medium hover:underline inline-flex items-center gap-1 cursor-pointer"
          >
            <span>Open Interactive Demo Workspace</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {/* Hero Preview Card */}
        <div className="mt-14 p-2 rounded-2xl bg-neutral-100/80 dark:bg-neutral-900/80 border border-neutral-200 dark:border-neutral-800 shadow-2xl">
          <div className="rounded-xl overflow-hidden bg-white dark:bg-neutral-950 border border-neutral-200/80 dark:border-neutral-800/80 p-4 sm:p-6 text-left">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-100 dark:border-neutral-800/80">
              <div className="flex items-center gap-2 text-xs font-semibold text-neutral-900 dark:text-neutral-100">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                <span>Today’s High Velocity Schedule · 2026-09-28</span>
              </div>
              <span className="text-xs text-neutral-500 dark:text-neutral-400">Score 88/100 · Peak Focus</span>
            </div>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-xl border border-neutral-100 dark:border-neutral-850 bg-neutral-50/70 dark:bg-neutral-900/50">
                <div className="text-xs text-neutral-500 dark:text-neutral-400 font-mono">09:00</div>
                <div className="text-xs font-semibold text-neutral-800 dark:text-neutral-200 mt-1">Finish project documentation</div>
                <div className="text-[11px] text-neutral-500 mt-1">FlowAI Platform v1.0 · High</div>
              </div>
              <div className="p-3.5 rounded-xl border border-neutral-100 dark:border-neutral-850 bg-neutral-50/70 dark:bg-neutral-900/50">
                <div className="text-xs text-neutral-500 dark:text-neutral-400 font-mono">11:00</div>
                <div className="text-xs font-semibold text-neutral-800 dark:text-neutral-200 mt-1">Study Deep Learning</div>
                <div className="text-[11px] text-neutral-500 mt-1">Transformers &amp; Self-Attention · High</div>
              </div>
              <div className="p-3.5 rounded-xl border border-neutral-100 dark:border-neutral-850 bg-neutral-50/70 dark:bg-neutral-900/50">
                <div className="text-xs text-neutral-500 dark:text-neutral-400 font-mono">14:00</div>
                <div className="text-xs font-semibold text-neutral-800 dark:text-neutral-200 mt-1">Complete assignment</div>
                <div className="text-[11px] text-neutral-500 mt-1">Distributed consensus lab · Urgent</div>
              </div>
              <div className="p-3.5 rounded-xl border border-neutral-100 dark:border-neutral-850 bg-neutral-50/70 dark:bg-neutral-900/50">
                <div className="text-xs text-neutral-500 dark:text-neutral-400 font-mono">17:00</div>
                <div className="text-xs font-semibold text-neutral-800 dark:text-neutral-200 mt-1">Exercise</div>
                <div className="text-[11px] text-neutral-500 mt-1">Zone 2 Aerobic run · Medium</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 1: TASKS */}
      <section id="tasks" className="py-20 border-t border-neutral-200/80 dark:border-neutral-800/80 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-2">
              <CheckSquare className="w-4 h-4" />
              <span>Section 01 · Task Manager</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Powerful task control with multi-dimensional clarity.
            </h2>
            <p className="mt-4 text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Every task includes due date, precise time, priority (Low, Medium, High, Urgent), categories, duration estimates, tags, and project associations.
            </p>
            <ul className="mt-6 space-y-2.5 text-xs text-neutral-600 dark:text-neutral-300">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Multi-view options: Structured List, Kanban Board, and Calendar matrix.</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Instant create, edit, duplicate, filter, and reschedule workflows.</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Pre-structured for upcoming AI agent timeblock allocation.</span>
              </li>
            </ul>
          </div>
          <div className="p-5 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-3">
            <div className="p-3 rounded-xl bg-white dark:bg-neutral-850 border border-neutral-200/60 dark:border-neutral-800 flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold">Finish project documentation</div>
                <div className="text-[11px] text-neutral-500 mt-0.5">High · Engineering · 60m · Today 09:00</div>
              </div>
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">Completed</span>
            </div>
            <div className="p-3 rounded-xl bg-white dark:bg-neutral-850 border border-neutral-200/60 dark:border-neutral-800 flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold">Study Deep Learning</div>
                <div className="text-[11px] text-neutral-500 mt-0.5">High · Education · 90m · Today 11:00</div>
              </div>
              <span className="text-[11px] text-blue-600 dark:text-blue-400 font-medium">In Progress</span>
            </div>
            <div className="p-3 rounded-xl bg-white dark:bg-neutral-850 border border-neutral-200/60 dark:border-neutral-800 flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold">Complete assignment: Consensus lab</div>
                <div className="text-[11px] text-neutral-500 mt-0.5">Urgent · Education · 120m · Today 14:00</div>
              </div>
              <span className="text-[11px] text-amber-600 dark:text-amber-400 font-medium">Todo</span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: PROJECTS */}
      <section id="projects" className="py-20 border-t border-neutral-200/80 dark:border-neutral-800/80 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1 p-5 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-4">
            <div className="p-4 rounded-xl bg-white dark:bg-neutral-850 border border-neutral-200/60 dark:border-neutral-800">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold">FlowAI Platform v1.0 Launch</span>
                <span className="text-xs font-bold text-blue-600 dark:text-blue-400">78%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-neutral-100 dark:bg-neutral-800 mt-2 overflow-hidden">
                <div className="h-full bg-blue-600 rounded-full" style={{ width: '78%' }} />
              </div>
              <div className="mt-3 text-[11px] text-neutral-500 flex items-center justify-between">
                <span>Active · 4 Milestones · 12 Days remaining</span>
                <span>Urgent Priority</span>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-white dark:bg-neutral-850 border border-neutral-200/60 dark:border-neutral-800">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold">Deep Learning Specialization</span>
                <span className="text-xs font-bold text-purple-600 dark:text-purple-400">65%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-neutral-100 dark:bg-neutral-800 mt-2 overflow-hidden">
                <div className="h-full bg-purple-600 rounded-full" style={{ width: '65%' }} />
              </div>
              <div className="mt-3 text-[11px] text-neutral-500 flex items-center justify-between">
                <span>Active · 4 Milestones · 30 Days remaining</span>
                <span>High Priority</span>
              </div>
            </div>
          </div>
          <div className="order-1 md:order-2">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-purple-600 dark:text-purple-400 mb-2">
              <FolderKanban className="w-4 h-4" />
              <span>Section 02 · Project Management</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Group initiatives with clear milestones and visual progress.
            </h2>
            <p className="mt-4 text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Define projects across Planning, Active, Paused, and Completed states. Group tasks under milestones, attach strategic notes, and track real delivery velocity.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 3: GOALS */}
      <section id="goals" className="py-20 border-t border-neutral-200/80 dark:border-neutral-800/80 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-2">
            <Target className="w-4 h-4" />
            <span>Section 03 · Strategic Goals</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Connect daily tasks to your overarching life objectives.
          </h2>
          <p className="mt-3 text-sm text-neutral-600 dark:text-neutral-400">
            Categorize goals into Personal, Education, Career, Finance, Health, and Other with verifiable milestone gates.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
            <span className="text-xs text-neutral-500">Education</span>
            <div className="text-sm font-semibold mt-1">Complete Machine Learning course</div>
            <div className="mt-4 flex items-center justify-between text-xs">
              <span className="text-neutral-500">Progress</span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">65%</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-neutral-200 dark:bg-neutral-800 mt-1.5 overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full" style={{ width: '65%' }} />
            </div>
          </div>
          <div className="p-5 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
            <span className="text-xs text-neutral-500">Career</span>
            <div className="text-sm font-semibold mt-1">Launch FlowAI Productivity SaaS Beta</div>
            <div className="mt-4 flex items-center justify-between text-xs">
              <span className="text-neutral-500">Progress</span>
              <span className="font-semibold text-blue-600 dark:text-blue-400">80%</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-neutral-200 dark:bg-neutral-800 mt-1.5 overflow-hidden">
              <div className="h-full bg-blue-500 rounded-full" style={{ width: '80%' }} />
            </div>
          </div>
          <div className="p-5 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
            <span className="text-xs text-neutral-500">Health</span>
            <div className="text-sm font-semibold mt-1">Run Half Marathon under 1h 45m</div>
            <div className="mt-4 flex items-center justify-between text-xs">
              <span className="text-neutral-500">Progress</span>
              <span className="font-semibold text-amber-600 dark:text-amber-400">45%</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-neutral-200 dark:bg-neutral-800 mt-1.5 overflow-hidden">
              <div className="h-full bg-amber-500 rounded-full" style={{ width: '45%' }} />
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: CALENDAR */}
      <section id="calendar" className="py-20 border-t border-neutral-200/80 dark:border-neutral-800/80 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-rose-600 dark:text-rose-400 mb-2">
              <CalendarIcon className="w-4 h-4" />
              <span>Section 04 · Unified Calendar</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              One view for tasks, meetings, deadlines, and focus blocks.
            </h2>
            <p className="mt-4 text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Switch seamlessly between Month, Week, and Day perspectives. Visually differentiate hard meetings from flexible focus sessions and habit checks.
            </p>
          </div>
          <div className="p-5 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
            <div className="text-xs font-semibold text-neutral-500 mb-3">Day Timeline View · Working Hours</div>
            <div className="space-y-2 font-mono text-xs">
              <div className="p-2.5 rounded-lg border border-blue-500/20 bg-blue-500/10 flex items-center justify-between">
                <span>09:00 - 10:00 · Finish project documentation</span>
                <span className="text-[11px] font-sans">Task block</span>
              </div>
              <div className="p-2.5 rounded-lg border border-purple-500/20 bg-purple-500/10 flex items-center justify-between">
                <span>11:00 - 12:30 · Study Deep Learning</span>
                <span className="text-[11px] font-sans">Deep Focus</span>
              </div>
              <div className="p-2.5 rounded-lg border border-rose-500/20 bg-rose-500/10 flex items-center justify-between">
                <span>14:00 - 16:00 · Complete assignment</span>
                <span className="text-[11px] font-sans">Deadline</span>
              </div>
              <div className="p-2.5 rounded-lg border border-emerald-500/20 bg-emerald-500/10 flex items-center justify-between">
                <span>17:00 - 18:00 · Exercise &amp; Cardio</span>
                <span className="text-[11px] font-sans">Habit</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: FOCUS */}
      <section id="focus" className="py-20 border-t border-neutral-200/80 dark:border-neutral-800/80 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="p-6 rounded-2xl bg-neutral-900 text-white dark:bg-neutral-900 border border-neutral-800 text-center space-y-4">
            <div className="text-xs uppercase tracking-wider text-neutral-400">Pomodoro Focus Timer</div>
            <div className="text-5xl font-mono font-bold tracking-tight">25:00</div>
            <div className="text-xs text-neutral-300">Goal: Implement Raft consensus leader election</div>
            <div className="pt-2 flex justify-center gap-2">
              <span className="px-3 py-1 rounded-lg bg-blue-600 text-xs font-medium">25m Work</span>
              <span className="px-3 py-1 rounded-lg bg-neutral-800 text-xs text-neutral-300">5m Short Break</span>
              <span className="px-3 py-1 rounded-lg bg-neutral-800 text-xs text-neutral-300">15m Long Break</span>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-2">
              <Clock className="w-4 h-4" />
              <span>Section 05 · Distraction-Free Focus</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Deep work intervals tied directly to active deliverables.
            </h2>
            <p className="mt-4 text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Pomodoro and custom session timers with task linkings, session goals, pause/resume mechanisms, and automatic logging into your productivity history.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 6: HABITS */}
      <section id="habits" className="py-20 border-t border-neutral-200/80 dark:border-neutral-800/80 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-orange-600 dark:text-orange-400 mb-2">
            <Flame className="w-4 h-4" />
            <span>Section 06 · Habit Tracker</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Build consistency through streaks and monthly habit heatmaps.
          </h2>
          <p className="mt-3 text-sm text-neutral-600 dark:text-neutral-400">
            Track daily rituals like Study, Exercise, Read, Meditation, Drink water, and Practice coding with completion analytics.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { name: 'Study', streak: 7, days: '7/7' },
            { name: 'Exercise', streak: 5, days: '5/7' },
            { name: 'Read', streak: 12, days: '7/7' },
            { name: 'Meditation', streak: 4, days: '4/7' },
            { name: 'Drink water', streak: 9, days: '7/7' },
            { name: 'Practice coding', streak: 6, days: '6/7' },
          ].map((h) => (
            <div key={h.name} className="p-3.5 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-center">
              <div className="text-xs font-medium text-neutral-800 dark:text-neutral-200">{h.name}</div>
              <div className="text-lg font-bold text-orange-500 mt-1 flex items-center justify-center gap-1">
                <Flame className="w-4 h-4 fill-orange-500" />
                <span>{h.streak}</span>
              </div>
              <div className="text-[11px] text-neutral-500 mt-0.5">{h.days} this week</div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 7: ANALYTICS */}
      <section id="analytics" className="py-20 border-t border-neutral-200/80 dark:border-neutral-800/80 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cyan-600 dark:text-cyan-400 mb-2">
              <BarChart3 className="w-4 h-4" />
              <span>Section 07 · Productivity Analytics</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Deterministic scoring and transparent velocity trends.
            </h2>
            <p className="mt-4 text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Inspect daily tasks completed, focus hours, completion rates, habit consistency, and overdue items with clean charts and zero guesswork.
            </p>
          </div>
          <div className="p-5 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200 dark:border-neutral-800">
              <span className="text-xs font-semibold">Weekly Productivity Score</span>
              <span className="text-xl font-bold text-blue-600 dark:text-blue-400">88/100</span>
            </div>
            <div className="mt-4 space-y-2 text-xs">
              <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
                <span>Completed Tasks (18 completed)</span>
                <span className="font-semibold text-neutral-900 dark:text-neutral-100">30 / 30 pts</span>
              </div>
              <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
                <span>Focus Hours (14.5 hrs logged)</span>
                <span className="font-semibold text-neutral-900 dark:text-neutral-100">28 / 30 pts</span>
              </div>
              <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
                <span>Habit Consistency (91%)</span>
                <span className="font-semibold text-neutral-900 dark:text-neutral-100">20 / 25 pts</span>
              </div>
              <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
                <span>Goal Progression</span>
                <span className="font-semibold text-neutral-900 dark:text-neutral-100">10 / 15 pts</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 8: FUTURE AI ASSISTANT */}
      <section id="ai-agent" className="py-20 border-t border-neutral-200/80 dark:border-neutral-800/80 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-neutral-900 text-white dark:bg-neutral-900 border border-neutral-800 relative overflow-hidden">
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20 mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Section 08 · AI Productivity Agent — Coming Soon</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Architected for future autonomous coordination.
            </h2>
            <p className="mt-4 text-sm text-neutral-300 leading-relaxed">
              When activated, the AI agent will receive natural prompts like: <br />
              <em className="text-white font-serif">&ldquo;I need to finish my project by Friday and prepare for my exam next Monday.&rdquo;</em>
            </p>
            <div className="mt-6 flex flex-wrap gap-2 text-xs">
              <span className="px-3 py-1.5 rounded-lg bg-neutral-800 text-neutral-300">Plan my day</span>
              <span className="px-3 py-1.5 rounded-lg bg-neutral-800 text-neutral-300">Organize my week</span>
              <span className="px-3 py-1.5 rounded-lg bg-neutral-800 text-neutral-300">Prioritize tasks</span>
              <span className="px-3 py-1.5 rounded-lg bg-neutral-800 text-neutral-300">Break goal into tasks</span>
              <span className="px-3 py-1.5 rounded-lg bg-neutral-800 text-neutral-300">Detect conflicts</span>
            </div>
            <div className="mt-8 flex items-center gap-4">
              <button
                onClick={onOpenAgentModal}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs transition-colors flex items-center gap-2 cursor-pointer"
              >
                <span>Inspect Agent Architecture</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <span className="text-xs text-neutral-400">Agent Status: Ready for integration</span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 9: HOW IT WORKS */}
      <section id="how-it-works" className="py-20 border-t border-neutral-200/80 dark:border-neutral-800/80 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-2">
            <Sliders className="w-4 h-4" />
            <span>Section 09 · How It Works</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Three simple steps to calm, deliberate execution.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
            <div className="text-2xl font-bold text-neutral-300 dark:text-neutral-700 font-mono mb-3">01</div>
            <h3 className="text-base font-semibold mb-2">Capture &amp; Organize</h3>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Capture your tasks, group them under projects, align with strategic goals, and define daily habits.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
            <div className="text-2xl font-bold text-neutral-300 dark:text-neutral-700 font-mono mb-3">02</div>
            <h3 className="text-base font-semibold mb-2">Timeblock &amp; Focus</h3>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
              View your day’s clear timeline. Lock in 25 or 50 minute Pomodoro intervals without context switching.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
            <div className="text-2xl font-bold text-neutral-300 dark:text-neutral-700 font-mono mb-3">03</div>
            <h3 className="text-base font-semibold mb-2">Review &amp; Adapt</h3>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Complete daily and weekly retrospectives. Evaluate what went well and prepare tomorrow’s agenda.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 10: FINAL CTA */}
      <section className="py-24 border-t border-neutral-200/80 dark:border-neutral-800/80 bg-neutral-50 dark:bg-neutral-900/40 text-center px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-xs uppercase tracking-wider text-blue-600 dark:text-blue-400 font-semibold mb-2">
            Section 10 · Final Call to Action
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-900 dark:text-white">
            Experience the calm of a coordinated workspace today.
          </h2>
          <p className="mt-4 text-sm text-neutral-600 dark:text-neutral-400 max-w-xl mx-auto leading-relaxed">
            Free forever for personal productivity. No complex setup or credit card required.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => onOpenAuth('register')}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100 font-medium text-sm transition-colors shadow-sm cursor-pointer"
            >
              Start Free Today
            </button>
            <button
              onClick={onEnterApp}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 font-medium text-sm transition-colors cursor-pointer"
            >
              Open Workspace Directly
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-neutral-200 dark:border-neutral-800 text-center text-xs text-neutral-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-neutral-700 dark:text-neutral-300">FlowAI</span>
            <span>· Personal Productivity Workspace</span>
          </div>
          <div className="flex items-center gap-4 text-neutral-500 dark:text-neutral-400">
            <span>Tasks</span>
            <span>·</span>
            <span>Projects</span>
            <span>·</span>
            <span>Goals</span>
            <span>·</span>
            <span>Habits</span>
            <span>·</span>
            <span>Focus</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
