import React, { useState } from 'react';
import { CalendarEvent, Task, CalendarEventType } from '../../types';
import { dataService } from '../../services/dataService';
import {
  Calendar as CalIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  Trash2,
} from 'lucide-react';

interface CalendarViewProps {
  onOpenEventModal: (defaultDate?: string) => void;
  onOpenTaskModal: (task?: Task) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  onOpenEventModal,
  onOpenTaskModal,
}) => {
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('week');
  const [currentDate, setCurrentDate] = useState(() => new Date());

  const calendarEvents = dataService.getCalendarEvents();
  const tasks = dataService.getTasks();

  const handlePrev = () => {
    const next = new Date(currentDate);
    if (viewMode === 'month') next.setMonth(next.getMonth() - 1);
    else if (viewMode === 'week') next.setDate(next.getDate() - 7);
    else next.setDate(next.getDate() - 1);
    setCurrentDate(next);
  };

  const handleNext = () => {
    const next = new Date(currentDate);
    if (viewMode === 'month') next.setMonth(next.getMonth() + 1);
    else if (viewMode === 'week') next.setDate(next.getDate() + 7);
    else next.setDate(next.getDate() + 1);
    setCurrentDate(next);
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const dateHeaderString =
    viewMode === 'month'
      ? currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
      : viewMode === 'week'
      ? `Week of ${currentDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
      : currentDate.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' });

  // Compute week days (Sunday to Saturday)
  const getWeekDays = () => {
    const curr = new Date(currentDate);
    const first = curr.getDate() - curr.getDay();
    const days = [];
    for (let i = 0; i < 7; i++) {
      const next = new Date(curr.setDate(first + i));
      days.push(next);
    }
    return days;
  };

  const weekDays = getWeekDays();

  const handleDeleteEvent = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    dataService.deleteCalendarEvent(id);
  };

  return (
    <div className="space-y-5">
      {/* Top bar with navigation and view switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-neutral-200/80 dark:border-neutral-800/80">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
            Calendar
          </h1>
          <div className="flex items-center gap-1">
            <button
              onClick={handlePrev}
              className="p-1 rounded-md text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleToday}
              className="px-2 py-0.5 text-xs font-medium rounded-md border border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
            >
              Today
            </button>
            <button
              onClick={handleNext}
              className="p-1 rounded-md text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <span className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 ml-1">
            {dateHeaderString}
          </span>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {/* Segmented controls (buttons) */}
          <div className="flex items-center p-1 rounded-lg bg-neutral-100 dark:bg-neutral-800 border border-neutral-200/60 dark:border-neutral-700/60">
            {(['month', 'week', 'day'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-3 py-1 text-xs font-medium rounded-md capitalize transition-colors cursor-pointer ${
                  viewMode === mode
                    ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-xs'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>

          <button
            onClick={() => onOpenEventModal()}
            className="px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100 text-xs font-medium transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Event</span>
          </button>
        </div>
      </div>

      {/* VIEW 1: WEEK VIEW */}
      {viewMode === 'week' && (
        <div className="rounded-2xl bg-white dark:bg-neutral-850 border border-neutral-200/80 dark:border-neutral-800/80 overflow-hidden shadow-xs">
          {/* Week Header */}
          <div className="grid grid-cols-7 border-b border-neutral-200/80 dark:border-neutral-800 text-center divide-x divide-neutral-100 dark:divide-neutral-800">
            {weekDays.map((d) => {
              const isToday =
                d.toISOString().split('T')[0] === new Date().toISOString().split('T')[0];
              return (
                <div
                  key={d.toISOString()}
                  className={`p-3 ${isToday ? 'bg-blue-50/50 dark:bg-blue-950/20' : ''}`}
                >
                  <div className="text-[11px] font-medium text-neutral-400 uppercase">
                    {d.toLocaleDateString('en-US', { weekday: 'short' })}
                  </div>
                  <div
                    className={`text-sm font-bold mt-0.5 ${
                      isToday ? 'text-blue-600 dark:text-blue-400' : 'text-neutral-900 dark:text-white'
                    }`}
                  >
                    {d.getDate()}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Days content */}
          <div className="grid grid-cols-7 divide-x divide-neutral-100 dark:divide-neutral-800 min-h-[500px]">
            {weekDays.map((d) => {
              const dateStr = d.toISOString().split('T')[0];
              const dayEvents = calendarEvents.filter((e) => e.startDate === dateStr);
              const dayTasks = tasks.filter((t) => t.dueDate === dateStr);

              return (
                <div
                  key={dateStr}
                  onClick={() => onOpenEventModal(dateStr)}
                  className="p-2 space-y-2 hover:bg-neutral-50/40 dark:hover:bg-neutral-800/20 transition-colors cursor-pointer"
                >
                  {/* Calendar events */}
                  {dayEvents.map((evt) => (
                    <div
                      key={evt.id}
                      className="p-2 rounded-lg text-[11px] border border-neutral-200/60 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 group relative transition-all"
                    >
                      <div className="font-semibold text-neutral-900 dark:text-neutral-100 line-clamp-1">
                        {evt.title}
                      </div>
                      <div className="text-[10px] text-neutral-400 flex items-center justify-between mt-1">
                        <span>{evt.startTime || 'All day'}</span>
                        <span className="capitalize">{evt.type}</span>
                      </div>
                      <button
                        onClick={(e) => handleDeleteEvent(evt.id, e)}
                        className="opacity-0 group-hover:opacity-100 absolute top-1 right-1 p-0.5 text-neutral-400 hover:text-rose-500 transition-opacity"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}

                  {/* Tasks on this day */}
                  {dayTasks.map((t) => (
                    <div
                      key={t.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenTaskModal(t);
                      }}
                      className="p-1.5 rounded-lg text-[10px] font-medium border border-blue-500/20 bg-blue-500/10 text-blue-800 dark:text-blue-300 truncate hover:border-blue-500/50"
                      title={t.title}
                    >
                      {t.dueTime && <span className="font-mono mr-1">{t.dueTime}</span>}
                      <span>{t.title}</span>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW 2: DAY VIEW */}
      {viewMode === 'day' && (
        <div className="p-6 rounded-2xl bg-white dark:bg-neutral-850 border border-neutral-200/80 dark:border-neutral-800/80 space-y-4">
          <div className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
            Day Schedule · {currentDate.toISOString().split('T')[0]}
          </div>

          {/* Hourly Slots (08:00 - 19:00) */}
          <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
            {['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'].map(
              (hour) => {
                const dateStr = currentDate.toISOString().split('T')[0];
                const hourEvents = calendarEvents.filter(
                  (e) => e.startDate === dateStr && e.startTime?.startsWith(hour.slice(0, 2))
                );
                const hourTasks = tasks.filter(
                  (t) => t.dueDate === dateStr && t.dueTime?.startsWith(hour.slice(0, 2))
                );

                return (
                  <div key={hour} className="py-3 flex items-start gap-4">
                    <span className="w-14 font-mono text-xs text-neutral-400 font-semibold shrink-0">
                      {hour}
                    </span>
                    <div className="flex-1 space-y-1.5">
                      {hourEvents.map((evt) => (
                        <div
                          key={evt.id}
                          className="p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 flex items-center justify-between text-xs"
                        >
                          <div>
                            <span className="font-semibold text-neutral-900 dark:text-neutral-100">
                              {evt.title}
                            </span>
                            <span className="text-[11px] text-neutral-400 ml-2">
                              {evt.startTime} - {evt.endTime} · {evt.type}
                            </span>
                          </div>
                          <button
                            onClick={(e) => handleDeleteEvent(evt.id, e)}
                            className="text-neutral-400 hover:text-rose-500"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      ))}

                      {hourTasks.map((t) => (
                        <div
                          key={t.id}
                          onClick={() => onOpenTaskModal(t)}
                          className="p-2 rounded-lg border border-blue-500/20 bg-blue-500/10 text-blue-900 dark:text-blue-200 text-xs flex items-center justify-between cursor-pointer"
                        >
                          <span className="font-medium">{t.title}</span>
                          <span className="text-[11px] text-blue-600 dark:text-blue-400 font-mono">
                            {t.estimatedDuration}m · {t.priority}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              }
            )}
          </div>
        </div>
      )}

      {/* VIEW 3: MONTH VIEW */}
      {viewMode === 'month' && (
        <div className="p-4 rounded-2xl bg-white dark:bg-neutral-850 border border-neutral-200/80 dark:border-neutral-800/80">
          <div className="grid grid-cols-7 gap-1 text-center font-medium text-xs text-neutral-400 pb-2">
            <div>Sun</div>
            <div>Mon</div>
            <div>Tue</div>
            <div>Wed</div>
            <div>Thu</div>
            <div>Fri</div>
            <div>Sat</div>
          </div>
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: 35 }).map((_, idx) => {
              const dayNum = (idx % 30) + 1;
              return (
                <div
                  key={idx}
                  className="p-2 min-h-[75px] rounded-lg border border-neutral-100 dark:border-neutral-800/60 bg-neutral-50/40 dark:bg-neutral-900/30 text-left text-xs"
                >
                  <span className="font-mono text-neutral-500">{dayNum}</span>
                  {idx === 15 && (
                    <div className="mt-1 p-1 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[10px] truncate font-medium">
                      Platform Beta
                    </div>
                  )}
                  {idx === 22 && (
                    <div className="mt-1 p-1 rounded bg-purple-500/10 text-purple-600 dark:text-purple-400 text-[10px] truncate font-medium">
                      Exam Prep
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
