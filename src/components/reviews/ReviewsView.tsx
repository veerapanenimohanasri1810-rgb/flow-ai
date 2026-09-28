import React, { useState } from 'react';
import { DailyReview, WeeklyReview } from '../../types';
import { dataService } from '../../services/dataService';
import {
  RotateCcw,
  CheckCircle2,
  Calendar,
  Clock,
  Flame,
  Target,
  Sparkles,
  Save,
  Check,
} from 'lucide-react';

export const ReviewsView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'daily' | 'weekly'>('daily');
  const todayStr = new Date().toISOString().split('T')[0];

  const tasks = dataService.getTasks();
  const focusSessions = dataService.getFocusSessions();
  const habits = dataService.getHabits();
  const goals = dataService.getGoals();
  const dailyReviews = dataService.getDailyReviews();
  const weeklyReviews = dataService.getWeeklyReviews();

  // Daily metrics
  const completedTodayCount = tasks.filter(
    (t) => t.status === 'Completed' && (t.completedAt?.startsWith(todayStr) || t.dueDate === todayStr)
  ).length;
  const remainingTodayCount = tasks.filter(
    (t) => t.status !== 'Completed' && t.dueDate === todayStr
  ).length;
  const focusMinutesToday = focusSessions
    .filter((s) => s.completed && s.timestamp.startsWith(todayStr))
    .reduce((sum, s) => sum + s.durationMinutes, 0);
  const habitsCompletedToday = habits.filter((h) => h.completedDates.includes(todayStr)).length;

  // Existing daily review for today or fresh
  const todayReview = dailyReviews.find((r) => r.date === todayStr);

  const [whatWentWell, setWhatWentWell] = useState(
    todayReview?.whatWentWell || 'Maintained uninterrupted morning deep work on core deliverables.'
  );
  const [whatToImprove, setWhatToImprove] = useState(
    todayReview?.whatToImprove || 'Avoid opening email before noon to protect focus momentum.'
  );
  const [rating, setRating] = useState<number>(todayReview?.productivityRating || 5);
  const [dailySavedNotification, setDailySavedNotification] = useState(false);

  // Weekly review form states
  const weekId = '2026-W39';
  const existingWeekly = weeklyReviews.find((w) => w.weekIdentifier === weekId);
  const [keyWins, setKeyWins] = useState(
    existingWeekly?.keyWins || 'Completed 18 tasks across 14.5 focus hours and maintained 7-day study streak.'
  );
  const [nextWeekPriorities, setNextWeekPriorities] = useState(
    existingWeekly?.nextWeekPriorities || 'Execute distributed systems consensus test suite and verify mobile responsive styling.'
  );
  const [weeklySavedNotification, setWeeklySavedNotification] = useState(false);

  const handleSaveDaily = (e: React.FormEvent) => {
    e.preventDefault();
    dataService.saveDailyReview({
      date: todayStr,
      whatWentWell,
      whatToImprove,
      tasksCompletedCount: completedTodayCount,
      tasksRemainingCount: remainingTodayCount,
      focusMinutes: focusMinutesToday,
      habitsCompletedCount: habitsCompletedToday,
      productivityRating: rating,
    });
    setDailySavedNotification(true);
    setTimeout(() => setDailySavedNotification(false), 3000);
  };

  const handleSaveWeekly = (e: React.FormEvent) => {
    e.preventDefault();
    dataService.saveWeeklyReview({
      weekIdentifier: weekId,
      startDate: new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0],
      endDate: todayStr,
      totalTasksCompleted: 18,
      totalFocusHours: 14.5,
      goalProgressSummary: 'Advanced core strategic goals by an average of 12%.',
      habitConsistencyRate: 91,
      overdueTasksCount: 1,
      keyWins,
      nextWeekPriorities,
    });
    setWeeklySavedNotification(true);
    setTimeout(() => setWeeklySavedNotification(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-neutral-200/80 dark:border-neutral-800/80">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 flex items-center gap-2">
            <RotateCcw className="w-5 h-5 text-purple-500" />
            <span>Productivity Reviews</span>
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Structured daily reflection and weekly retrospectives
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex items-center p-1 rounded-lg bg-neutral-100 dark:bg-neutral-800">
          <button
            onClick={() => setActiveTab('daily')}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              activeTab === 'daily'
                ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-xs'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900'
            }`}
          >
            Daily Review
          </button>
          <button
            onClick={() => setActiveTab('weekly')}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              activeTab === 'weekly'
                ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-xs'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900'
            }`}
          >
            Weekly Review
          </button>
        </div>
      </div>

      {/* TAB 1: DAILY REVIEW */}
      {activeTab === 'daily' && (
        <div className="space-y-6">
          {/* Daily metrics preview */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl bg-white dark:bg-neutral-850 border border-neutral-200/80 dark:border-neutral-800/80">
              <div className="text-[11px] text-neutral-400">Tasks Completed</div>
              <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                {completedTodayCount}
              </div>
              <div className="text-[10px] text-neutral-400">{remainingTodayCount} remaining</div>
            </div>

            <div className="p-3.5 rounded-xl bg-white dark:bg-neutral-850 border border-neutral-200/80 dark:border-neutral-800/80">
              <div className="text-[11px] text-neutral-400">Focus Time</div>
              <div className="text-xl font-bold text-blue-600 dark:text-blue-400 mt-0.5">
                {Math.floor(focusMinutesToday / 60)}h {focusMinutesToday % 60}m
              </div>
              <div className="text-[10px] text-neutral-400">deep sessions</div>
            </div>

            <div className="p-3.5 rounded-xl bg-white dark:bg-neutral-850 border border-neutral-200/80 dark:border-neutral-800/80">
              <div className="text-[11px] text-neutral-400">Habits Kept</div>
              <div className="text-xl font-bold text-orange-500 mt-0.5">
                {habitsCompletedToday} / {habits.length}
              </div>
              <div className="text-[10px] text-neutral-400">daily rituals</div>
            </div>

            <div className="p-3.5 rounded-xl bg-white dark:bg-neutral-850 border border-neutral-200/80 dark:border-neutral-800/80">
              <div className="text-[11px] text-neutral-400">Day Rating</div>
              <div className="text-xl font-bold text-purple-600 dark:text-purple-400 mt-0.5">
                {rating} / 5
              </div>
              <div className="text-[10px] text-neutral-400">subjective energy</div>
            </div>
          </div>

          {/* Daily Reflection Form */}
          <form
            onSubmit={handleSaveDaily}
            className="p-6 rounded-2xl bg-white dark:bg-neutral-850 border border-neutral-200/80 dark:border-neutral-800/80 space-y-5"
          >
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
              <span className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">
                End-of-Day Reflection · {todayStr}
              </span>
              {dailySavedNotification && (
                <span className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-medium">
                  <Check className="w-3.5 h-3.5" />
                  Saved to Daily Log
                </span>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-800 dark:text-neutral-200 mb-1.5">
                What went well today?
              </label>
              <textarea
                rows={3}
                required
                value={whatWentWell}
                onChange={(e) => setWhatWentWell(e.target.value)}
                placeholder="Key accomplishments, high-focus moments, wins..."
                className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-800 dark:text-neutral-200 mb-1.5">
                What should I improve tomorrow?
              </label>
              <textarea
                rows={3}
                required
                value={whatToImprove}
                onChange={(e) => setWhatToImprove(e.target.value)}
                placeholder="Friction points, unexpected distractions, energy dips..."
                className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-800 dark:text-neutral-200 mb-1.5">
                Productivity &amp; Energy Rating (1 to 5)
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setRating(num)}
                    className={`w-9 h-9 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      rating === num
                        ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-xs'
                        : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 flex justify-end">
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100 text-xs font-medium transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Daily Review</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 2: WEEKLY REVIEW */}
      {activeTab === 'weekly' && (
        <div className="space-y-6">
          {/* Weekly aggregate highlights */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl bg-white dark:bg-neutral-850 border border-neutral-200/80 dark:border-neutral-800/80">
              <div className="text-[11px] text-neutral-400">Total Completed</div>
              <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                18 tasks
              </div>
              <div className="text-[10px] text-neutral-400">past 7 days</div>
            </div>

            <div className="p-3.5 rounded-xl bg-white dark:bg-neutral-850 border border-neutral-200/80 dark:border-neutral-800/80">
              <div className="text-[11px] text-neutral-400">Focus Hours</div>
              <div className="text-xl font-bold text-blue-600 dark:text-blue-400 mt-0.5">
                14.5 hrs
              </div>
              <div className="text-[10px] text-neutral-400">22 sessions</div>
            </div>

            <div className="p-3.5 rounded-xl bg-white dark:bg-neutral-850 border border-neutral-200/80 dark:border-neutral-800/80">
              <div className="text-[11px] text-neutral-400">Habit Consistency</div>
              <div className="text-xl font-bold text-orange-500 mt-0.5">
                91%
              </div>
              <div className="text-[10px] text-neutral-400">38 of 42 checks</div>
            </div>

            <div className="p-3.5 rounded-xl bg-white dark:bg-neutral-850 border border-neutral-200/80 dark:border-neutral-800/80">
              <div className="text-[11px] text-neutral-400">Overdue Items</div>
              <div className="text-xl font-bold text-amber-500 mt-0.5">
                1 task
              </div>
              <div className="text-[10px] text-neutral-400">rescheduled</div>
            </div>
          </div>

          {/* Weekly Synthesis Form */}
          <form
            onSubmit={handleSaveWeekly}
            className="p-6 rounded-2xl bg-white dark:bg-neutral-850 border border-neutral-200/80 dark:border-neutral-800/80 space-y-5"
          >
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
              <span className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">
                Weekly Retrospective · Week 39
              </span>
              {weeklySavedNotification && (
                <span className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-medium">
                  <Check className="w-3.5 h-3.5" />
                  Saved to Weekly Log
                </span>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-800 dark:text-neutral-200 mb-1.5">
                Key Strategic Wins This Week
              </label>
              <textarea
                rows={3}
                required
                value={keyWins}
                onChange={(e) => setKeyWins(e.target.value)}
                placeholder="Major project deliverables, breakthroughs, finished milestones..."
                className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-800 dark:text-neutral-200 mb-1.5">
                Next Week&apos;s Core Priorities &amp; Focus Blocks
              </label>
              <textarea
                rows={3}
                required
                value={nextWeekPriorities}
                onChange={(e) => setNextWeekPriorities(e.target.value)}
                placeholder="What must be accomplished next week to maintain momentum?"
                className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 flex justify-end">
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100 text-xs font-medium transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Weekly Review</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
