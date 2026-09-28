import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { dataService } from '../../services/dataService';
import {
  User,
  Settings,
  Sun,
  Moon,
  Clock,
  Bell,
  ShieldCheck,
  RotateCcw,
  Check,
  LogOut,
} from 'lucide-react';

interface ProfileViewProps {
  onOpenAuth: (mode?: 'login' | 'register') => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ onOpenAuth }) => {
  const { user, profile, updateUserProfile, logout } = useAuth();
  const { theme, setTheme } = useTheme();

  const [name, setName] = useState(profile.name);
  const [email, setEmail] = useState(profile.email);
  const [workingHoursStart, setWorkingHoursStart] = useState(profile.workingHoursStart || '08:30');
  const [workingHoursEnd, setWorkingHoursEnd] = useState(profile.workingHoursEnd || '18:00');
  const [dailyFocusGoal, setDailyFocusGoal] = useState<number>(profile.dailyFocusGoalMinutes || 180);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Notification preferences
  const [notifDeadlines, setNotifDeadlines] = useState(true);
  const [notifHabits, setNotifHabits] = useState(true);
  const [notifDailyReview, setNotifDailyReview] = useState(true);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      name,
      email,
      workingHoursStart,
      workingHoursEnd,
      dailyFocusGoalMinutes: dailyFocusGoal,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleResetData = () => {
    if (confirm('Reset workspace data to initial realistic demo datasets?')) {
      dataService.resetToDefaults();
      window.location.reload();
    }
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="pb-2 border-b border-neutral-200/80 dark:border-neutral-800/80 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 flex items-center gap-2">
            <Settings className="w-5 h-5 text-neutral-500" />
            <span>Profile &amp; Workspace Preferences</span>
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Configure working hours, theme, and future AI agent coordination boundaries
          </p>
        </div>

        {user && (
          <button
            onClick={logout}
            className="px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        )}
      </div>

      {savedSuccess && (
        <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/40 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-500" />
          <span>Profile and working hour preferences updated successfully.</span>
        </div>
      )}

      {/* Main Settings Form */}
      <form onSubmit={handleSave} className="space-y-6">
        {/* 1. Account Details */}
        <div className="p-5 rounded-2xl bg-white dark:bg-neutral-850 border border-neutral-200/80 dark:border-neutral-800/80 space-y-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-neutral-900 dark:text-neutral-100">
            <User className="w-4 h-4 text-blue-500" />
            <span>Personal Profile &amp; Authentication</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Display Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white focus:outline-hidden focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white focus:outline-hidden focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1 text-[11px] text-neutral-400">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
            <span>Prepared for Firebase Authentication &amp; ABAC user profile sync.</span>
          </div>
        </div>

        {/* 2. Appearance & Theme */}
        <div className="p-5 rounded-2xl bg-white dark:bg-neutral-850 border border-neutral-200/80 dark:border-neutral-800/80 space-y-3">
          <div className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">
            Visual Theme
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setTheme('light')}
              className={`flex-1 p-3 rounded-xl border text-xs font-medium flex items-center justify-center gap-2 transition-all cursor-pointer ${
                theme === 'light'
                  ? 'border-blue-600 bg-blue-50/50 text-blue-800'
                  : 'border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800'
              }`}
            >
              <Sun className="w-4 h-4" />
              <span>Light Mode</span>
            </button>

            <button
              type="button"
              onClick={() => setTheme('dark')}
              className={`flex-1 p-3 rounded-xl border text-xs font-medium flex items-center justify-center gap-2 transition-all cursor-pointer ${
                theme === 'dark'
                  ? 'border-blue-500 bg-blue-950/30 text-blue-300'
                  : 'border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800'
              }`}
            >
              <Moon className="w-4 h-4" />
              <span>Dark Mode</span>
            </button>
          </div>
        </div>

        {/* 3. Working Hours & Productivity Preferences */}
        <div className="p-5 rounded-2xl bg-white dark:bg-neutral-850 border border-neutral-200/80 dark:border-neutral-800/80 space-y-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-neutral-900 dark:text-neutral-100">
            <Clock className="w-4 h-4 text-purple-500" />
            <span>Working Hours &amp; Focus Constraints</span>
          </div>

          <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
            The upcoming AI Productivity Agent uses your working hours window to schedule tasks without causing oversubscription.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Working Hours Start
              </label>
              <input
                type="time"
                value={workingHoursStart}
                onChange={(e) => setWorkingHoursStart(e.target.value)}
                className="w-full px-3 py-2 text-xs font-mono rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Working Hours End
              </label>
              <input
                type="time"
                value={workingHoursEnd}
                onChange={(e) => setWorkingHoursEnd(e.target.value)}
                className="w-full px-3 py-2 text-xs font-mono rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white focus:outline-hidden"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
              <span>Daily Deep Focus Target</span>
              <span className="font-mono font-semibold text-blue-600 dark:text-blue-400">
                {dailyFocusGoal} mins ({Math.floor(dailyFocusGoal / 60)}h {dailyFocusGoal % 60}m)
              </span>
            </div>
            <input
              type="range"
              min={30}
              max={360}
              step={15}
              value={dailyFocusGoal}
              onChange={(e) => setDailyFocusGoal(Number(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer"
            />
          </div>
        </div>

        {/* 4. Notification Settings */}
        <div className="p-5 rounded-2xl bg-white dark:bg-neutral-850 border border-neutral-200/80 dark:border-neutral-800/80 space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-neutral-900 dark:text-neutral-100">
            <Bell className="w-4 h-4 text-orange-500" />
            <span>Notification &amp; Reminder Preferences</span>
          </div>

          <div className="space-y-2 text-xs">
            <label className="flex items-center justify-between p-2 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 cursor-pointer">
              <span>Upcoming deadline alerts (24 hours prior)</span>
              <input
                type="checkbox"
                checked={notifDeadlines}
                onChange={(e) => setNotifDeadlines(e.target.checked)}
                className="rounded accent-blue-600 cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-2 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 cursor-pointer">
              <span>Habit streak milestone celebrations</span>
              <input
                type="checkbox"
                checked={notifHabits}
                onChange={(e) => setNotifHabits(e.target.checked)}
                className="rounded accent-blue-600 cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-2 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 cursor-pointer">
              <span>Evening daily review reflection prompt (21:00)</span>
              <input
                type="checkbox"
                checked={notifDailyReview}
                onChange={(e) => setNotifDailyReview(e.target.checked)}
                className="rounded accent-blue-600 cursor-pointer"
              />
            </label>
          </div>
        </div>

        {/* Action Save Button */}
        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={handleResetData}
            className="text-xs text-neutral-500 hover:text-rose-600 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo Workspace Data</span>
          </button>

          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100 text-xs font-medium transition-colors shadow-xs cursor-pointer"
          >
            Save Preferences
          </button>
        </div>
      </form>
    </div>
  );
};
