import React from 'react';
import {
  LayoutDashboard,
  Sun,
  CheckSquare,
  FolderKanban,
  Target,
  Calendar,
  Flame,
  Clock,
  FileText,
  BarChart3,
  RotateCcw,
  User,
  Sparkles,
  X,
} from 'lucide-react';

interface SidebarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  isOpen: boolean;
  onClose: () => void;
  taskCount: number;
  habitsDoneToday: number;
  totalHabits: number;
  onOpenAgentModal: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onNavigate,
  isOpen,
  onClose,
  taskCount,
  habitsDoneToday,
  totalHabits,
  onOpenAgentModal,
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'myday', label: 'My Day', icon: Sun },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare, badge: taskCount },
    { id: 'projects', label: 'Projects', icon: FolderKanban },
    { id: 'goals', label: 'Goals', icon: Target },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'habits', label: 'Habits', icon: Flame, badge: `${habitsDoneToday}/${totalHabits}` },
    { id: 'focus', label: 'Focus', icon: Clock },
    { id: 'notes', label: 'Notes', icon: FileText },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'reviews', label: 'Reviews', icon: RotateCcw },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-neutral-950/60 backdrop-blur-xs md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-white dark:bg-neutral-900 border-r border-neutral-200/80 dark:border-neutral-800/80 flex flex-col transition-transform duration-200 ease-in-out md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-14 px-4 flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800/80">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 flex items-center justify-center font-bold text-xs">
              FL
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-xs tracking-tight text-neutral-900 dark:text-white">
                FlowAI
              </span>
              <span className="text-[10px] text-neutral-400 font-normal">
                Productivity Workspace
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 md:hidden"
            aria-label="Close sidebar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Items List */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-0.5">
          <div className="px-2 pb-1.5 text-[10px] font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
            Workspace
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  onClose();
                }}
                className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white font-semibold'
                    : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-850 hover:text-neutral-900 dark:hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon
                    className={`w-4 h-4 ${
                      isActive
                        ? 'text-blue-600 dark:text-blue-400'
                        : 'text-neutral-400 dark:text-neutral-500'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span className="text-[10px] font-mono text-neutral-400 dark:text-neutral-500 font-normal">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* AI Agent Footer Teaser */}
        <div className="p-3 border-t border-neutral-100 dark:border-neutral-800/80">
          <div
            onClick={onOpenAgentModal}
            className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-850 border border-neutral-200/70 dark:border-neutral-800 hover:border-blue-500/40 dark:hover:border-blue-500/40 transition-colors cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-neutral-900 dark:text-neutral-100">
                <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                <span>AI Productivity Agent</span>
              </div>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            </div>
            <p className="mt-1 text-[11px] text-neutral-500 dark:text-neutral-400 line-clamp-2">
              Ready for autonomous goal &amp; schedule coordination.
            </p>
            <div className="mt-2 text-[10px] text-blue-600 dark:text-blue-400 font-medium group-hover:underline flex items-center gap-1">
              <span>View Agent Specs</span>
              <span>&rarr;</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
