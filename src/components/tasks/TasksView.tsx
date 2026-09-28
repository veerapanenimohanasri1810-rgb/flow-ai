import React, { useState } from 'react';
import { Task, Priority, TaskStatus } from '../../types';
import { dataService } from '../../services/dataService';
import {
  Plus,
  Search,
  SlidersHorizontal,
  ListFilter,
  Kanban,
  Calendar as CalendarViewIcon,
  List,
  MoreVertical,
  CheckCircle2,
  Circle,
  Copy,
  Trash2,
  Clock,
  ArrowRight,
  Sparkles,
  Tag,
  Folder,
} from 'lucide-react';

interface TasksViewProps {
  onOpenTaskModal: (taskToEdit?: Task) => void;
  onStartFocus: (task?: Task) => void;
  onOpenAgentModal: () => void;
}

export const TasksView: React.FC<TasksViewProps> = ({
  onOpenTaskModal,
  onStartFocus,
  onOpenAgentModal,
}) => {
  const [viewMode, setViewMode] = useState<'list' | 'kanban' | 'calendar'>('list');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | TaskStatus>('All');
  const [priorityFilter, setPriorityFilter] = useState<'All' | Priority>('All');
  const [sortBy, setSortBy] = useState<'dueDate' | 'priority' | 'title'>('dueDate');
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const tasks = dataService.getTasks();
  const projects = dataService.getProjects();

  // Filter tasks
  const filteredTasks = tasks.filter((t) => {
    const matchesSearch =
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      (t.description && t.description.toLowerCase().includes(search.toLowerCase())) ||
      (t.tags && t.tags.some((tag) => tag.toLowerCase().includes(search.toLowerCase())));
    const matchesStatus = statusFilter === 'All' || t.status === statusFilter;
    const matchesPriority = priorityFilter === 'All' || t.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  // Sort tasks
  const priorityOrder: Record<Priority, number> = { Urgent: 4, High: 3, Medium: 2, Low: 1 };
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortBy === 'priority') {
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    }
    if (sortBy === 'title') {
      return a.title.localeCompare(b.title);
    }
    return a.dueDate.localeCompare(b.dueDate);
  });

  const handleToggleStatus = (task: Task) => {
    const nextStatus = task.status === 'Completed' ? 'Todo' : 'Completed';
    dataService.updateTask(task.id, { status: nextStatus });
  };

  const handleDelete = (id: string) => {
    dataService.deleteTask(id);
    setActiveMenuId(null);
  };

  const handleDuplicate = (id: string) => {
    dataService.duplicateTask(id);
    setActiveMenuId(null);
  };

  const handleReschedule = (id: string, daysAhead: number) => {
    const d = new Date();
    d.setDate(d.getDate() + daysAhead);
    const newDate = d.toISOString().split('T')[0];
    dataService.updateTask(id, { dueDate: newDate });
    setActiveMenuId(null);
  };

  const handleMoveKanban = (taskId: string, targetStatus: TaskStatus) => {
    dataService.updateTask(taskId, { status: targetStatus });
  };

  return (
    <div className="space-y-5">
      {/* Top Header & View Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-neutral-200/80 dark:border-neutral-800/80">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
            Task Manager
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            {sortedTasks.length} tasks matching current filters
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {/* Segmented view tabs (buttons per frontend design guidelines) */}
          <div className="flex items-center p-1 rounded-lg bg-neutral-100 dark:bg-neutral-800 border border-neutral-200/60 dark:border-neutral-700/60">
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-md text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer ${
                viewMode === 'list'
                  ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-xs'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">List</span>
            </button>
            <button
              onClick={() => setViewMode('kanban')}
              className={`p-1.5 rounded-md text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer ${
                viewMode === 'kanban'
                  ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-xs'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900'
              }`}
            >
              <Kanban className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Kanban</span>
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`p-1.5 rounded-md text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer ${
                viewMode === 'calendar'
                  ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-xs'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900'
              }`}
            >
              <CalendarViewIcon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Calendar</span>
            </button>
          </div>

          <button
            onClick={() => onOpenTaskModal()}
            className="px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100 text-xs font-medium transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Task</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-white dark:bg-neutral-850 border border-neutral-200/80 dark:border-neutral-800/80">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title, description, or tag..."
            className="w-full pl-8.5 pr-3 py-1.5 text-xs rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as 'All' | TaskStatus)}
            className="px-2.5 py-1.5 text-xs rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 focus:outline-hidden"
          >
            <option value="All">All Statuses</option>
            <option value="Todo">Todo</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>

          {/* Priority filter */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value as 'All' | Priority)}
            className="px-2.5 py-1.5 text-xs rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 focus:outline-hidden"
          >
            <option value="All">All Priorities</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="Urgent">Urgent</option>
          </select>

          {/* Sort selector */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'dueDate' | 'priority' | 'title')}
            className="px-2.5 py-1.5 text-xs rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 focus:outline-hidden"
          >
            <option value="dueDate">Sort: Due Date</option>
            <option value="priority">Sort: Priority</option>
            <option value="title">Sort: Title</option>
          </select>
        </div>
      </div>

      {/* VIEW 1: LIST VIEW */}
      {viewMode === 'list' && (
        <div className="rounded-2xl bg-white dark:bg-neutral-850 border border-neutral-200/80 dark:border-neutral-800/80 overflow-hidden shadow-xs">
          <div className="divide-y divide-neutral-100 dark:divide-neutral-800/60">
            {sortedTasks.length === 0 ? (
              <div className="py-12 text-center text-xs text-neutral-400">
                No tasks found matching your filter criteria.
              </div>
            ) : (
              sortedTasks.map((task) => {
                const isCompleted = task.status === 'Completed';
                const project = projects.find((p) => p.id === task.projectId);

                return (
                  <div
                    key={task.id}
                    className="p-4 flex items-center justify-between gap-4 hover:bg-neutral-50/60 dark:hover:bg-neutral-800/40 transition-colors relative"
                  >
                    <div className="flex items-start sm:items-center gap-3 min-w-0">
                      <button
                        onClick={() => handleToggleStatus(task)}
                        className="mt-0.5 sm:mt-0 text-neutral-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                        aria-label="Toggle status"
                      >
                        {isCompleted ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        ) : (
                          <Circle className="w-4 h-4" />
                        )}
                      </button>

                      <div className="min-w-0">
                        <div
                          onClick={() => onOpenTaskModal(task)}
                          className={`text-xs font-medium cursor-pointer hover:underline ${
                            isCompleted
                              ? 'line-through text-neutral-400 dark:text-neutral-500'
                              : 'text-neutral-900 dark:text-white'
                          }`}
                        >
                          {task.title}
                        </div>

                        {/* Quiet metadata line without pills */}
                        <div className="text-[11px] text-neutral-500 dark:text-neutral-400 flex flex-wrap items-center gap-1.5 mt-0.5">
                          {project && (
                            <>
                              <span className="text-neutral-700 dark:text-neutral-300 font-medium">
                                {project.name}
                              </span>
                              <span aria-hidden="true">·</span>
                            </>
                          )}
                          <span>{task.category || 'General'}</span>
                          <span aria-hidden="true">·</span>
                          <span className="font-mono">{task.dueDate}</span>
                          {task.dueTime && (
                            <>
                              <span className="font-mono">{task.dueTime}</span>
                              <span aria-hidden="true">·</span>
                            </>
                          )}
                          <span>{task.estimatedDuration}m</span>
                          <span aria-hidden="true">·</span>
                          <span
                            className={
                              task.priority === 'Urgent'
                                ? 'text-rose-500 font-semibold'
                                : task.priority === 'High'
                                ? 'text-amber-500 font-medium'
                                : ''
                            }
                          >
                            {task.priority}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onStartFocus(task)}
                        className="hidden sm:flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium rounded-md border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                      >
                        <Clock className="w-3 h-3 text-neutral-400" />
                        <span>Focus</span>
                      </button>

                      {/* Dropdown Menu */}
                      <div className="relative">
                        <button
                          onClick={() =>
                            setActiveMenuId(activeMenuId === task.id ? null : task.id)
                          }
                          className="p-1 rounded-md text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>

                        {activeMenuId === task.id && (
                          <div className="absolute right-0 mt-1 w-44 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xl z-20 py-1 text-xs">
                            <button
                              onClick={() => {
                                onOpenTaskModal(task);
                                setActiveMenuId(null);
                              }}
                              className="w-full text-left px-3 py-1.5 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300"
                            >
                              Edit details
                            </button>
                            <button
                              onClick={() => handleDuplicate(task.id)}
                              className="w-full text-left px-3 py-1.5 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 flex items-center justify-between"
                            >
                              <span>Duplicate</span>
                              <Copy className="w-3 h-3 text-neutral-400" />
                            </button>
                            <button
                              onClick={() => handleReschedule(task.id, 1)}
                              className="w-full text-left px-3 py-1.5 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300"
                            >
                              Reschedule to Tomorrow
                            </button>
                            <button
                              onClick={() => handleReschedule(task.id, 7)}
                              className="w-full text-left px-3 py-1.5 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300"
                            >
                              Reschedule next week
                            </button>
                            <div className="border-t border-neutral-100 dark:border-neutral-800 my-1" />
                            <button
                              onClick={() => handleDelete(task.id)}
                              className="w-full text-left px-3 py-1.5 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-rose-600 dark:text-rose-400 flex items-center justify-between"
                            >
                              <span>Delete</span>
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* VIEW 2: KANBAN BOARD */}
      {viewMode === 'kanban' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {(['Todo', 'In Progress', 'Completed'] as TaskStatus[]).map((colStatus) => {
            const colTasks = sortedTasks.filter((t) => t.status === colStatus);
            return (
              <div
                key={colStatus}
                className="rounded-2xl bg-neutral-50/70 dark:bg-neutral-900/50 border border-neutral-200/80 dark:border-neutral-800/80 p-3.5 flex flex-col min-h-[450px]"
              >
                {/* Column Header */}
                <div className="flex items-center justify-between pb-3 border-b border-neutral-200/60 dark:border-neutral-800 mb-3">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        colStatus === 'Completed'
                          ? 'bg-emerald-500'
                          : colStatus === 'In Progress'
                          ? 'bg-blue-500'
                          : 'bg-neutral-400'
                      }`}
                    />
                    <span className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">
                      {colStatus}
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-neutral-400">
                    {colTasks.length}
                  </span>
                </div>

                {/* Cards */}
                <div className="space-y-2.5 flex-1 overflow-y-auto">
                  {colTasks.length === 0 ? (
                    <div className="py-8 text-center text-xs text-neutral-400">
                      Empty column
                    </div>
                  ) : (
                    colTasks.map((task) => (
                      <div
                        key={task.id}
                        className="p-3 rounded-xl bg-white dark:bg-neutral-850 border border-neutral-200/80 dark:border-neutral-800/80 shadow-xs hover:border-neutral-300 dark:hover:border-neutral-700 transition-all space-y-2"
                      >
                        <div
                          onClick={() => onOpenTaskModal(task)}
                          className="text-xs font-medium text-neutral-900 dark:text-neutral-100 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer"
                        >
                          {task.title}
                        </div>

                        {task.description && (
                          <p className="text-[11px] text-neutral-500 line-clamp-2">
                            {task.description}
                          </p>
                        )}

                        <div className="text-[10px] text-neutral-400 flex items-center justify-between pt-1">
                          <span className="font-mono">{task.dueDate}</span>
                          <span
                            className={
                              task.priority === 'Urgent'
                                ? 'text-rose-500 font-medium'
                                : task.priority === 'High'
                                ? 'text-amber-500 font-medium'
                                : ''
                            }
                          >
                            {task.priority}
                          </span>
                        </div>

                        {/* Kanban status step changer */}
                        <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-[11px]">
                          {colStatus !== 'Todo' && (
                            <button
                              onClick={() => handleMoveKanban(task.id, 'Todo')}
                              className="text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 cursor-pointer"
                            >
                              &larr; Todo
                            </button>
                          )}
                          {colStatus !== 'In Progress' && (
                            <button
                              onClick={() => handleMoveKanban(task.id, 'In Progress')}
                              className="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                            >
                              In Progress
                            </button>
                          )}
                          {colStatus !== 'Completed' && (
                            <button
                              onClick={() => handleMoveKanban(task.id, 'Completed')}
                              className="text-neutral-400 hover:text-emerald-600 dark:hover:text-emerald-400 cursor-pointer"
                            >
                              Done &rarr;
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* VIEW 3: CALENDAR GRID OF TASKS */}
      {viewMode === 'calendar' && (
        <div className="p-5 rounded-2xl bg-white dark:bg-neutral-850 border border-neutral-200/80 dark:border-neutral-800/80 space-y-4">
          <div className="text-xs font-semibold text-neutral-500">
            Task Due Date Matrix (Next 7 Days)
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-2">
            {[0, 1, 2, 3, 4, 5, 6].map((offset) => {
              const d = new Date();
              d.setDate(d.getDate() + offset);
              const dateStr = d.toISOString().split('T')[0];
              const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
              const dayTasks = sortedTasks.filter((t) => t.dueDate === dateStr);

              return (
                <div
                  key={dateStr}
                  className="p-3 rounded-xl border border-neutral-100 dark:border-neutral-800 bg-neutral-50/60 dark:bg-neutral-900/50 min-h-[160px] flex flex-col"
                >
                  <div className="flex items-center justify-between text-xs pb-2 border-b border-neutral-200/60 dark:border-neutral-800">
                    <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                      {dayName}
                    </span>
                    <span className="font-mono text-[11px] text-neutral-400">
                      {dateStr.slice(5)}
                    </span>
                  </div>

                  <div className="mt-2 space-y-1.5 flex-1 overflow-y-auto">
                    {dayTasks.map((t) => (
                      <div
                        key={t.id}
                        onClick={() => onOpenTaskModal(t)}
                        className="p-1.5 rounded-lg bg-white dark:bg-neutral-850 border border-neutral-200/80 dark:border-neutral-800 text-[11px] font-medium text-neutral-800 dark:text-neutral-200 truncate cursor-pointer hover:border-blue-400"
                        title={t.title}
                      >
                        {t.dueTime && <span className="font-mono text-neutral-400 mr-1">{t.dueTime}</span>}
                        <span>{t.title}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
