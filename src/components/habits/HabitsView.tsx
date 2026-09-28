import React, { useState } from 'react';
import { Habit } from '../../types';
import { dataService } from '../../services/dataService';
import {
  Flame,
  Plus,
  CheckCircle2,
  Circle,
  Calendar,
  Trash2,
  TrendingUp,
} from 'lucide-react';
import { Modal } from '../common/Modal';

export const HabitsView: React.FC = () => {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Personal');
  const [targetDaysPerWeek, setTargetDaysPerWeek] = useState(7);

  const habits = dataService.getHabits();

  // Past 7 days array
  const last7Days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().split('T')[0];
  });

  const todayStr = new Date().toISOString().split('T')[0];

  const handleToggle = (habitId: string, date: string) => {
    dataService.toggleHabitCompletion(habitId, date);
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    dataService.addHabit({
      name: name.trim(),
      description: description.trim(),
      frequency: 'daily',
      targetDaysPerWeek,
      category,
      color: '#3b82f6',
    });

    setName('');
    setDescription('');
    setIsAddOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this habit?')) {
      dataService.deleteHabit(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-neutral-200/80 dark:border-neutral-800/80">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 flex items-center gap-2">
            <Flame className="w-5 h-5 text-orange-500" />
            <span>Habit Tracker</span>
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Compound consistency across daily rituals and active recall
          </p>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100 text-xs font-medium transition-colors flex items-center gap-1.5 shadow-xs self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Habit</span>
        </button>
      </div>

      {/* Main Habits Matrix Table */}
      <div className="rounded-2xl bg-white dark:bg-neutral-850 border border-neutral-200/80 dark:border-neutral-800/80 overflow-hidden shadow-xs">
        {/* Table header */}
        <div className="p-4 border-b border-neutral-100 dark:border-neutral-800 grid grid-cols-12 items-center text-xs font-semibold text-neutral-400">
          <div className="col-span-5 sm:col-span-4 uppercase tracking-wider text-[11px]">
            Habit Routine
          </div>
          <div className="col-span-5 sm:col-span-6 flex items-center justify-around">
            {last7Days.map((dStr) => {
              const d = new Date(dStr + 'T00:00:00');
              const isToday = dStr === todayStr;
              return (
                <div key={dStr} className="text-center">
                  <div className="text-[10px] uppercase font-mono">
                    {d.toLocaleDateString('en-US', { weekday: 'narrow' })}
                  </div>
                  <div
                    className={`text-[11px] font-mono mt-0.5 ${
                      isToday ? 'text-blue-600 dark:text-blue-400 font-bold' : ''
                    }`}
                  >
                    {d.getDate()}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="col-span-2 text-right uppercase tracking-wider text-[11px]">
            Streak
          </div>
        </div>

        {/* Rows */}
        <div className="divide-y divide-neutral-100 dark:divide-neutral-800/60">
          {habits.map((habit) => {
            const completedCount7 = last7Days.filter((d) =>
              habit.completedDates.includes(d)
            ).length;
            const completionRate = Math.round((completedCount7 / 7) * 100);

            return (
              <div
                key={habit.id}
                className="p-4 grid grid-cols-12 items-center hover:bg-neutral-50/50 dark:hover:bg-neutral-800/30 transition-colors"
              >
                {/* Habit name & category */}
                <div className="col-span-5 sm:col-span-4 min-w-0 pr-2">
                  <div className="text-xs font-semibold text-neutral-900 dark:text-neutral-100 truncate">
                    {habit.name}
                  </div>
                  <div className="text-[11px] text-neutral-400 mt-0.5">
                    {habit.category} · {completionRate}% this week
                  </div>
                </div>

                {/* 7 Days check buttons */}
                <div className="col-span-5 sm:col-span-6 flex items-center justify-around">
                  {last7Days.map((dStr) => {
                    const isDone = habit.completedDates.includes(dStr);
                    return (
                      <button
                        key={dStr}
                        onClick={() => handleToggle(habit.id, dStr)}
                        className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
                          isDone
                            ? 'bg-emerald-500 text-white shadow-xs'
                            : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-300 dark:text-neutral-600 hover:bg-neutral-200 dark:hover:bg-neutral-700'
                        }`}
                        title={`${habit.name} on ${dStr}`}
                      >
                        {isDone ? (
                          <CheckCircle2 className="w-4 h-4 fill-emerald-500 text-white" />
                        ) : (
                          <Circle className="w-3.5 h-3.5" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Streak & Actions */}
                <div className="col-span-2 flex items-center justify-end gap-2">
                  <div className="flex items-center gap-1 text-xs font-bold text-orange-500 font-mono">
                    <Flame className="w-3.5 h-3.5 fill-current" />
                    <span>{habit.currentStreak}d</span>
                  </div>
                  <button
                    onClick={() => handleDelete(habit.id)}
                    className="p-1 rounded text-neutral-400 hover:text-rose-500 transition-colors"
                    title="Delete habit"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Monthly Heatmap Calendar Overview */}
      <div className="p-5 rounded-2xl bg-white dark:bg-neutral-850 border border-neutral-200/80 dark:border-neutral-800/80 space-y-3">
        <div className="flex items-center justify-between text-xs font-semibold">
          <span className="text-neutral-800 dark:text-neutral-200">
            30-Day Activity Heatmap
          </span>
          <span className="text-neutral-400">Total Habit Consistency: 91%</span>
        </div>

        <div className="flex flex-wrap gap-1.5 pt-1">
          {Array.from({ length: 30 }).map((_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - (29 - i));
            const dStr = d.toISOString().split('T')[0];
            const activeOnDay = habits.filter((h) => h.completedDates.includes(dStr)).length;
            const ratio = habits.length > 0 ? activeOnDay / habits.length : 0;

            const bgClass =
              ratio === 0
                ? 'bg-neutral-100 dark:bg-neutral-800'
                : ratio < 0.4
                ? 'bg-emerald-200 dark:bg-emerald-950 text-emerald-800'
                : ratio < 0.8
                ? 'bg-emerald-400 dark:bg-emerald-700 text-white'
                : 'bg-emerald-600 dark:bg-emerald-500 text-white';

            return (
              <div
                key={dStr}
                className={`w-6 h-6 rounded-md ${bgClass} flex items-center justify-center text-[10px] font-mono`}
                title={`${dStr}: ${activeOnDay}/${habits.length} habits completed`}
              >
                {activeOnDay > 0 ? activeOnDay : ''}
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Habit Modal */}
      <Modal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title="Add Recurring Habit"
        subtitle="Consistent ritual building"
        maxWidth="max-w-md"
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
              Habit Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Read 20 Pages"
              className="w-full px-3 py-2 text-sm rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
              Description
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Define clear trigger, routine, and reward..."
              className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Category
              </label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Personal, Health, Education"
                className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-hidden focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Target Days / Week
              </label>
              <input
                type="number"
                min={1}
                max={7}
                value={targetDaysPerWeek}
                onChange={(e) => setTargetDaysPerWeek(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-hidden focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-neutral-100 dark:border-neutral-800">
            <button
              type="button"
              onClick={() => setIsAddOpen(false)}
              className="px-3.5 py-2 text-xs font-medium rounded-lg text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-medium rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:text-neutral-900 transition-colors shadow-xs cursor-pointer"
            >
              Create Habit
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
