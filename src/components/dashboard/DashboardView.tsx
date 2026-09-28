import React from 'react';
import {
  CheckSquare,
  Clock,
  Flame,
  Target,
  FolderKanban,
  Calendar as CalendarIcon,
  Play,
  ArrowRight,
  Plus,
  CheckCircle2,
  Circle,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { Task, Project, Goal, Habit, FocusSession } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { dataService } from '../../services/dataService';

interface DashboardViewProps {
  onNavigate: (view: string) => void;
  onOpenTaskModal: () => void;
  onStartFocus: (task?: Task) => void;
  onOpenAgentModal: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onNavigate,
  onOpenTaskModal,
  onStartFocus,
  onOpenAgentModal,
}) => {
  const { profile } = useAuth();

  const tasks = dataService.getTasks();
  const projects = dataService.getProjects();
  const goals = dataService.getGoals();
  const habits = dataService.getHabits();
  const focusSessions = dataService.getFocusSessions();

  const todayStr = new Date().toISOString().split('T')[0];

  // Greeting by hour
  const currentHour = new Date().getHours();
  const greeting =
    currentHour < 12
      ? 'Good morning'
      : currentHour < 18
      ? 'Good afternoon'
      : 'Good evening';

  const formattedDate = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date());

  // Metrics
  const tasksRemaining = tasks.filter((t) => t.status !== 'Completed').length;
  const tasksCompletedToday = tasks.filter(
    (t) => t.status === 'Completed' && (t.completedAt?.startsWith(todayStr) || t.dueDate === todayStr)
  ).length;

  const totalFocusMinutesToday = focusSessions
    .filter((s) => s.completed && s.timestamp.startsWith(todayStr))
    .reduce((sum, s) => sum + s.durationMinutes, 0);

  const bestHabitStreak = habits.length > 0 ? Math.max(...habits.map((h) => h.currentStreak)) : 0;
  const activeProjectsCount = projects.filter((p) => p.status === 'Active').length;

  // Today's schedule items (matching user prompt example + dynamic tasks due today)
  const todayTasks = tasks
    .filter((t) => t.dueDate === todayStr)
    .sort((a, b) => (a.dueTime || '23:59').localeCompare(b.dueTime || '23:59'));

  // Fallback / standard TODAY roadmap items if none due today
  const scheduleItems = todayTasks.length > 0
    ? todayTasks
    : tasks.slice(0, 4);

  const upcomingDeadlines = tasks
    .filter((t) => t.status !== 'Completed' && t.dueDate >= todayStr)
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
    .slice(0, 3);

  const handleToggleTask = (task: Task) => {
    const newStatus = task.status === 'Completed' ? 'Todo' : 'Completed';
    dataService.updateTask(task.id, { status: newStatus });
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Greeting */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
            {greeting}, {profile.name || 'Alex'}
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
            {formattedDate} · Workspace optimized for deliberate action
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            onClick={onOpenAgentModal}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-850 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 transition-colors cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-500" />
            <span>AI Plan</span>
          </button>
          <button
            onClick={onOpenTaskModal}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100 transition-colors shadow-xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Task</span>
          </button>
        </div>
      </div>

      {/* Primary Metrics Row (Anti-slop: clean, unboxed stat metrics without garish pill capsules) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-3.5 rounded-xl bg-white dark:bg-neutral-850 border border-neutral-200/80 dark:border-neutral-800/80">
          <div className="text-[11px] font-medium text-neutral-500 dark:text-neutral-400">
            Remaining Tasks
          </div>
          <div className="text-xl font-bold text-neutral-900 dark:text-white mt-1">
            {tasksRemaining}
          </div>
          <div className="text-[10px] text-neutral-400 mt-0.5">active backlog</div>
        </div>

        <div className="p-3.5 rounded-xl bg-white dark:bg-neutral-850 border border-neutral-200/80 dark:border-neutral-800/80">
          <div className="text-[11px] font-medium text-neutral-500 dark:text-neutral-400">
            Completed Today
          </div>
          <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
            {tasksCompletedToday}
          </div>
          <div className="text-[10px] text-neutral-400 mt-0.5">verified outputs</div>
        </div>

        <div className="p-3.5 rounded-xl bg-white dark:bg-neutral-850 border border-neutral-200/80 dark:border-neutral-800/80">
          <div className="text-[11px] font-medium text-neutral-500 dark:text-neutral-400">
            Focus Time
          </div>
          <div className="text-xl font-bold text-blue-600 dark:text-blue-400 mt-1">
            {Math.floor(totalFocusMinutesToday / 60)}h {totalFocusMinutesToday % 60}m
          </div>
          <div className="text-[10px] text-neutral-400 mt-0.5">deep work logged</div>
        </div>

        <div className="p-3.5 rounded-xl bg-white dark:bg-neutral-850 border border-neutral-200/80 dark:border-neutral-800/80">
          <div className="text-[11px] font-medium text-neutral-500 dark:text-neutral-400">
            Habit Streak
          </div>
          <div className="text-xl font-bold text-orange-500 mt-1 flex items-baseline gap-1">
            <span>{bestHabitStreak}</span>
            <span className="text-xs font-normal text-neutral-400">days</span>
          </div>
          <div className="text-[10px] text-neutral-400 mt-0.5">peak consistency</div>
        </div>

        <div className="p-3.5 rounded-xl bg-white dark:bg-neutral-850 border border-neutral-200/80 dark:border-neutral-800/80">
          <div className="text-[11px] font-medium text-neutral-500 dark:text-neutral-400">
            Active Projects
          </div>
          <div className="text-xl font-bold text-purple-600 dark:text-purple-400 mt-1">
            {activeProjectsCount}
          </div>
          <div className="text-[10px] text-neutral-400 mt-0.5">in execution</div>
        </div>

        <div className="p-3.5 rounded-xl bg-white dark:bg-neutral-850 border border-neutral-200/80 dark:border-neutral-800/80">
          <div className="text-[11px] font-medium text-neutral-500 dark:text-neutral-400">
            Strategic Goals
          </div>
          <div className="text-xl font-bold text-cyan-600 dark:text-cyan-400 mt-1">
            {goals.length}
          </div>
          <div className="text-[10px] text-neutral-400 mt-0.5">active objectives</div>
        </div>
      </div>

      {/* MAJOR SECTION: TODAY */}
      <div className="rounded-2xl bg-white dark:bg-neutral-850 border border-neutral-200/80 dark:border-neutral-800/80 overflow-hidden shadow-xs">
        <div className="px-5 py-4 border-b border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
            <h2 className="text-sm font-semibold tracking-wide text-neutral-900 dark:text-white uppercase">
              TODAY
            </h2>
            <span className="text-xs text-neutral-400">· Timeline Schedule</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate('myday')}
              className="text-xs text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white flex items-center gap-1 transition-colors"
            >
              <span>Detailed Day Plan</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="divide-y divide-neutral-100 dark:divide-neutral-800/60">
          {scheduleItems.map((task) => {
            const isDone = task.status === 'Completed';
            return (
              <div
                key={task.id}
                className="px-5 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-neutral-50/60 dark:hover:bg-neutral-800/40 transition-colors"
              >
                <div className="flex items-start sm:items-center gap-3">
                  {/* Time label */}
                  <div className="w-14 shrink-0 font-mono text-xs font-semibold text-neutral-600 dark:text-neutral-400">
                    {task.dueTime || '09:00'}
                  </div>

                  {/* Completion check */}
                  <button
                    onClick={() => handleToggleTask(task)}
                    className="mt-0.5 sm:mt-0 text-neutral-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    aria-label="Toggle task completion"
                  >
                    {isDone ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <Circle className="w-4 h-4" />
                    )}
                  </button>

                  {/* Task details */}
                  <div className="min-w-0">
                    <div
                      className={`text-xs font-medium ${
                        isDone
                          ? 'line-through text-neutral-400 dark:text-neutral-500'
                          : 'text-neutral-900 dark:text-neutral-100'
                      }`}
                    >
                      {task.title}
                    </div>
                    {/* Quiet metadata with typographic separators */}
                    <div className="text-[11px] text-neutral-500 dark:text-neutral-400 flex items-center gap-1.5 mt-0.5">
                      <span>{task.category || 'General'}</span>
                      <span aria-hidden="true">·</span>
                      <span>{task.estimatedDuration}m</span>
                      <span aria-hidden="true">·</span>
                      <span
                        className={
                          task.priority === 'Urgent'
                            ? 'text-rose-500 font-medium'
                            : task.priority === 'High'
                            ? 'text-amber-500'
                            : ''
                        }
                      >
                        {task.priority} Priority
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right action: Focus button */}
                <div className="flex items-center gap-2 self-end sm:self-center pl-17 sm:pl-0">
                  <button
                    onClick={() => onStartFocus(task)}
                    className="px-2.5 py-1 rounded-md text-[11px] font-medium border border-neutral-200 dark:border-neutral-700 hover:border-blue-500/50 hover:bg-blue-50/50 dark:hover:bg-blue-950/30 text-neutral-700 dark:text-neutral-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Play className="w-3 h-3 fill-current" />
                    <span>Focus</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Grid: Upcoming Deadlines & Active Projects */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Upcoming Deadlines */}
        <div className="p-5 rounded-2xl bg-white dark:bg-neutral-850 border border-neutral-200/80 dark:border-neutral-800/80">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
            <div className="flex items-center gap-2">
              <CalendarIcon className="w-4 h-4 text-neutral-400" />
              <h3 className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">
                Upcoming Deadlines
              </h3>
            </div>
            <button
              onClick={() => onNavigate('tasks')}
              className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline"
            >
              View all
            </button>
          </div>

          <div className="mt-3 space-y-2.5">
            {upcomingDeadlines.length === 0 ? (
              <div className="py-4 text-center text-xs text-neutral-400">
                No immediate deadlines
              </div>
            ) : (
              upcomingDeadlines.map((item) => (
                <div
                  key={item.id}
                  className="p-2.5 rounded-xl border border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50 flex items-center justify-between"
                >
                  <div className="min-w-0 pr-2">
                    <div className="text-xs font-medium text-neutral-800 dark:text-neutral-200 truncate">
                      {item.title}
                    </div>
                    <div className="text-[11px] text-neutral-400 mt-0.5">
                      {item.category} · {item.priority}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-xs font-mono font-medium text-neutral-600 dark:text-neutral-400">
                      {item.dueDate}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Active Projects Preview */}
        <div className="p-5 rounded-2xl bg-white dark:bg-neutral-850 border border-neutral-200/80 dark:border-neutral-800/80">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
            <div className="flex items-center gap-2">
              <FolderKanban className="w-4 h-4 text-neutral-400" />
              <h3 className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">
                Active Projects
              </h3>
            </div>
            <button
              onClick={() => onNavigate('projects')}
              className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline"
            >
              Manage projects
            </button>
          </div>

          <div className="mt-3 space-y-3">
            {projects.slice(0, 2).map((proj) => (
              <div
                key={proj.id}
                className="p-3 rounded-xl border border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-neutral-800 dark:text-neutral-200 truncate">
                    {proj.name}
                  </span>
                  <span className="font-mono text-xs font-semibold text-blue-600 dark:text-blue-400">
                    {proj.progress}%
                  </span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-neutral-200 dark:bg-neutral-800 mt-2 overflow-hidden">
                  <div
                    className="h-full bg-blue-600 rounded-full"
                    style={{ width: `${proj.progress}%` }}
                  />
                </div>
                <div className="mt-2 text-[10px] text-neutral-400 flex items-center justify-between">
                  <span>{proj.status} · Due {proj.deadline}</span>
                  <span>{proj.milestones?.length || 0} Milestones</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
