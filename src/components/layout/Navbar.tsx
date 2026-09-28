import React from 'react';
import {
  Menu,
  Search,
  Sparkles,
  Sun,
  Moon,
  Plus,
  Compass,
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { NotificationsDropdown } from '../common/NotificationsDropdown';

interface NavbarProps {
  onToggleSidebar: () => void;
  onOpenAgentModal: () => void;
  onOpenQuickTaskModal: () => void;
  onNavigate: (view: string) => void;
  onOpenLanding: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onToggleSidebar,
  onOpenAgentModal,
  onOpenQuickTaskModal,
  onNavigate,
  onOpenLanding,
  searchQuery,
  onSearchChange,
}) => {
  const { theme, toggleTheme } = useTheme();
  const { user, profile } = useAuth();

  const formattedDate = new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  }).format(new Date());

  return (
    <header className="sticky top-0 z-30 h-14 border-b border-neutral-200/80 dark:border-neutral-800/80 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between gap-4">
      {/* Left items: sidebar toggle + Brand / date */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="p-1.5 rounded-lg text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          aria-label="Toggle navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:flex items-center gap-2 text-xs font-medium text-neutral-500 dark:text-neutral-400">
          <span>{formattedDate}</span>
          <span>·</span>
          <span className="text-neutral-800 dark:text-neutral-200 font-medium">Workspace</span>
        </div>
      </div>

      {/* Center: Search input */}
      <div className="flex-1 max-w-md mx-2">
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search tasks, goals, projects, notes..."
            className="w-full pl-8.5 pr-3 py-1.5 text-xs rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-850 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-hidden focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          />
        </div>
      </div>

      {/* Right items */}
      <div className="flex items-center gap-2">
        {/* Landing page link */}
        <button
          onClick={onOpenLanding}
          className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          title="View Landing Page"
        >
          <Compass className="w-3.5 h-3.5" />
          <span>Home</span>
        </button>

        {/* AI Agent Status Pill Button */}
        <button
          onClick={onOpenAgentModal}
          className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/80 hover:bg-blue-50 dark:hover:bg-blue-950/30 hover:border-blue-300 dark:hover:border-blue-700/50 text-neutral-700 dark:text-neutral-300 transition-colors cursor-pointer"
        >
          <Sparkles className="w-3 h-3 text-blue-500 animate-pulse" />
          <span>AI Agent: Ready</span>
        </button>

        {/* Quick Add Task */}
        <button
          onClick={onOpenQuickTaskModal}
          className="p-1.5 sm:px-3 sm:py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100 text-xs font-medium transition-colors flex items-center gap-1 shadow-xs cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">New Task</span>
        </button>

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="p-1.5 rounded-lg text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Notifications */}
        <NotificationsDropdown onNavigate={onNavigate} />

        {/* User avatar/Profile click */}
        <button
          onClick={() => onNavigate('profile')}
          className="flex items-center gap-2 p-1 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
          title="Account & Settings"
        >
          {profile.avatarUrl ? (
            <img
              src={profile.avatarUrl}
              alt={profile.name}
              className="w-7 h-7 rounded-full object-cover border border-neutral-200 dark:border-neutral-700"
            />
          ) : (
            <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-semibold">
              {(profile.name || 'User').charAt(0)}
            </div>
          )}
        </button>
      </div>
    </header>
  );
};
