import React, { useState } from 'react';
import { Task } from '../../types';
import { dataService } from '../../services/dataService';
import {
  Sun,
  Plus,
  Play,
  CheckCircle2,
  Circle,
  Clock,
  Sparkles,
  Flame,
  Calendar,
} from 'lucide-react';

interface MyDayViewProps {
  onStartFocus: (task?: Task) => void;
  onOpenTaskModal: () => void;
  onOpenAgentModal: () => void;
}

export const MyDayView: React.FC<MyDayViewProps> = ({
  onStartFocus,
  onOpenTaskModal,
  onOpenAgentModal,
}) => {
  const [quickTitle, setQuickTitle] = useState('');
  const [quickTime, setQuickTime] = useState('14:00');

  const tasks = dataService.getTasks();
  const habits = dataService.getHabits();
  const todayStr = new Date().toISOString().split('T')[0];

  const todayTasks = tasks.filter((t) => t.dueDate === todayStr || t.status === 'In Progress');
  const otherTasks = tasks.filter((t) => t.dueDate !== todayStr && t.status !== 'Completed');

  const handleQuickAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickTitle.trim()) return;

    dataService.addTask({
      title: quickTitle,
      description: 'Quick captured on My Day',
      dueDate: todayStr,
      dueTime: quickTime,
      priority: 'High',
      category: 'Deep Work',
      estimatedDuration: 45,
      status: 'Todo',
      tags: ['my-day'],
    });

    setQuickTitle('');
  };

  const handleToggleTask = (task: Task) => {
    const newStatus = task.status === 'Completed' ? 'Todo' : 'Completed';
    dataService.updateTask(task.id, { status: newStatus });
  };

  const handleToggleHabit = (habitId: string) => {
    dataService.toggleHabitCompletion(habitId, todayStr);
  };

  const formattedDate = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  }).format(new Date());

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-neutral-200/80 dark:border-neutral-800/80">
        <div>
          <div className="flex items-center gap-2">
            <Sun className="w-5 h-5 text-amber-500" />
            <h1 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
              My Day
            </h1>
          </div>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
            {formattedDate} · Single-threaded focus stack
          </p>
        </div>

        <button
          onClick={onOpenAgentModal}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-850 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 transition-colors self-start sm:self-auto cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-blue-500" />
          <span>AI Day Optimizer</span>
        </button>
      </div>

      {/* Quick capture bar */}
      <form
        onSubmit={handleQuickAdd}
        className="p-2 rounded-xl bg-white dark:bg-neutral-850 border border-neutral-200/80 dark:border-neutral-800/80 flex items-center gap-2 shadow-xs"
      >
        <Plus className="w-4 h-4 text-neutral-400 ml-2" />
        <input
          type="text"
          value={quickTitle}
          onChange={(e) => setQuickTitle(e.target.value)}
          placeholder="Add an actionable commitment for today..."
          className="flex-1 bg-transparent text-xs text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-hidden py-1.5"
        />
        <input
          type="time"
          value={quickTime}
          onChange={(e) => setQuickTime(e.target.value)}
          className="text-xs font-mono px-2 py-1 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 focus:outline-hidden"
        />
        <button
          type="submit"
          className="px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:text-neutral-900 text-xs font-medium transition-colors cursor-pointer"
        >
          Add to Day
        </button>
      </form>

      {/* Habits check row for today */}
      <div className="p-4 rounded-xl bg-white dark:bg-neutral-850 border border-neutral-200/80 dark:border-neutral-800/80">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-neutral-800 dark:text-neutral-200 flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-orange-500" />
            <span>Today&apos;s Habit Commitments</span>
          </span>
          <span className="text-[11px] text-neutral-400">
            {habits.filter((h) => h.completedDates.includes(todayStr)).length} of {habits.length} done
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
          {habits.map((habit) => {
            const isCompleted = habit.completedDates.includes(todayStr);
            return (
              <button
                key={habit.id}
                onClick={() => handleToggleHabit(habit.id)}
                className={`p-2.5 rounded-lg text-left border transition-all cursor-pointer ${
                  isCompleted
                    ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300'
                    : 'border-neutral-200/80 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50 hover:border-neutral-300 dark:hover:border-neutral-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium truncate">{habit.name}</span>
                  {isCompleted ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  ) : (
                    <Circle className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                  )}
                </div>
                <div className="text-[10px] text-neutral-500 mt-1">
                  {habit.currentStreak} day streak
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main schedule for today */}
      <div className="rounded-xl bg-white dark:bg-neutral-850 border border-neutral-200/80 dark:border-neutral-800/80 overflow-hidden">
        <div className="px-5 py-3 border-b border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
            Planned Today ({todayTasks.length})
          </span>
          <button
            onClick={onOpenTaskModal}
            className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
          >
            <Plus className="w-3 h-3" />
            <span>New Task</span>
          </button>
        </div>

        <div className="divide-y divide-neutral-100 dark:divide-neutral-800/60">
          {todayTasks.length === 0 ? (
            <div className="p-8 text-center text-xs text-neutral-400">
              No tasks specifically scheduled for today. Add one above or pull from your backlog below.
            </div>
          ) : (
            todayTasks.map((task) => {
              const isDone = task.status === 'Completed';
              return (
                <div
                  key={task.id}
                  className="px-5 py-3.5 flex items-center justify-between gap-3 hover:bg-neutral-50/50 dark:hover:bg-neutral-800/30 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <button
                      onClick={() => handleToggleTask(task)}
                      className="text-neutral-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                      {isDone ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      ) : (
                        <Circle className="w-4 h-4" />
                      )}
                    </button>
                    <div className="min-w-0">
                      <div
                        className={`text-xs font-medium ${
                          isDone
                            ? 'line-through text-neutral-400 dark:text-neutral-500'
                            : 'text-neutral-900 dark:text-white'
                        }`}
                      >
                        {task.title}
                      </div>
                      <div className="text-[11px] text-neutral-500 dark:text-neutral-400 flex items-center gap-1.5 mt-0.5">
                        <span className="font-mono">{task.dueTime || '09:00'}</span>
                        <span>·</span>
                        <span>{task.category || 'General'}</span>
                        <span>·</span>
                        <span>{task.estimatedDuration} mins</span>
                        <span>·</span>
                        <span className={task.priority === 'Urgent' ? 'text-rose-500 font-medium' : ''}>
                          {task.priority}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => onStartFocus(task)}
                    className="px-2.5 py-1 rounded-md text-[11px] font-medium border border-neutral-200 dark:border-neutral-700 hover:bg-blue-50/50 dark:hover:bg-blue-950/30 hover:border-blue-500/50 text-neutral-700 dark:text-neutral-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-1 cursor-pointer shrink-0"
                  >
                    <Play className="w-3 h-3 fill-current" />
                    <span>Focus</span>
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Suggested backlog tasks to pull into My Day */}
      {otherTasks.length > 0 && (
        <div className="p-4 rounded-xl bg-neutral-50/80 dark:bg-neutral-900/60 border border-neutral-200/60 dark:border-neutral-800 space-y-2">
          <div className="text-xs font-semibold text-neutral-600 dark:text-neutral-400">
            Suggested Backlog to Pull into Today
          </div>
          <div className="space-y-1.5">
            {otherTasks.slice(0, 3).map((item) => (
              <div
                key={item.id}
                className="p-2.5 rounded-lg bg-white dark:bg-neutral-850 border border-neutral-200/60 dark:border-neutral-800 flex items-center justify-between text-xs"
              >
                <div>
                  <span className="font-medium text-neutral-800 dark:text-neutral-200">
                    {item.title}
                  </span>
                  <span className="text-[11px] text-neutral-400 ml-2">
                    Due {item.dueDate} · {item.priority}
                  </span>
                </div>
                <button
                  onClick={() => dataService.updateTask(item.id, { dueDate: todayStr })}
                  className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                >
                  Schedule for Today
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
