import React, { useState, useEffect, useRef } from 'react';
import { Task, FocusSessionType } from '../../types';
import { dataService } from '../../services/dataService';
import {
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  Clock,
  Volume2,
  VolumeX,
  Target,
  Sparkles,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface FocusViewProps {
  initialTask?: Task | null;
  onClearInitialTask?: () => void;
}

export const FocusView: React.FC<FocusViewProps> = ({
  initialTask,
  onClearInitialTask,
}) => {
  const tasks = dataService.getTasks();
  const focusSessions = dataService.getFocusSessions();

  const [selectedTask, setSelectedTask] = useState<Task | null>(initialTask || null);
  const [sessionGoal, setSessionGoal] = useState('');
  const [sessionType, setSessionType] = useState<FocusSessionType>('pomodoro');
  const [durationMinutes, setDurationMinutes] = useState<number>(25);

  const [timeLeft, setTimeLeft] = useState<number>(25 * 60);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isCompletedModalOpen, setIsCompletedModalOpen] = useState<boolean>(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (initialTask) {
      setSelectedTask(initialTask);
      setSessionGoal(`Deep focus on: ${initialTask.title}`);
    }
  }, [initialTask]);

  // Handle mode changes
  const handleSelectMode = (type: FocusSessionType, minutes: number) => {
    setIsRunning(false);
    setSessionType(type);
    setDurationMinutes(minutes);
    setTimeLeft(minutes * 60);
  };

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            handleSessionFinished();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning]);

  const handleSessionFinished = () => {
    setIsRunning(false);
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });

    dataService.logFocusSession({
      taskId: selectedTask?.id,
      taskTitle: selectedTask?.title || 'Focused Work Session',
      sessionGoal: sessionGoal || 'Deep Work Sprint',
      category: selectedTask?.category || 'Engineering',
      durationMinutes,
      type: sessionType,
      completed: true,
    });

    setIsCompletedModalOpen(true);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(durationMinutes * 60);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const progressPercent = ((durationMinutes * 60 - timeLeft) / (durationMinutes * 60)) * 100;

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 flex items-center justify-center gap-2">
          <Clock className="w-5 h-5 text-blue-500" />
          <span>Distraction-Free Focus</span>
        </h1>
        <p className="text-xs text-neutral-500 dark:text-neutral-400">
          Single-task immersion. Reduce mental clutter and enter flow state.
        </p>
      </div>

      {/* Mode Selectors */}
      <div className="flex items-center justify-center gap-2 p-1.5 rounded-xl bg-neutral-100 dark:bg-neutral-850 w-fit mx-auto border border-neutral-200/60 dark:border-neutral-800">
        <button
          onClick={() => handleSelectMode('pomodoro', 25)}
          className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
            sessionType === 'pomodoro' && durationMinutes === 25
              ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-xs'
              : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900'
          }`}
        >
          25m Pomodoro
        </button>
        <button
          onClick={() => handleSelectMode('custom', 50)}
          className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
            sessionType === 'custom' && durationMinutes === 50
              ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-xs'
              : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900'
          }`}
        >
          50m Deep Work
        </button>
        <button
          onClick={() => handleSelectMode('short-break', 5)}
          className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
            sessionType === 'short-break'
              ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-xs'
              : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900'
          }`}
        >
          5m Break
        </button>
        <button
          onClick={() => handleSelectMode('long-break', 15)}
          className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
            sessionType === 'long-break'
              ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-xs'
              : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900'
          }`}
        >
          15m Long Break
        </button>
      </div>

      {/* Main Focus Chamber */}
      <div className="p-8 sm:p-12 rounded-3xl bg-white dark:bg-neutral-850 border border-neutral-200/80 dark:border-neutral-800/80 shadow-md text-center space-y-6 relative overflow-hidden">
        {/* Subtle radial background glow */}
        <div className="absolute inset-0 bg-radial from-blue-500/5 via-transparent to-transparent pointer-events-none" />

        {/* Target task / Goal label */}
        <div className="max-w-md mx-auto space-y-2">
          <div className="text-[11px] uppercase tracking-wider text-neutral-400 font-semibold">
            Current Focus Target
          </div>

          <select
            value={selectedTask?.id || ''}
            onChange={(e) => {
              const t = tasks.find((item) => item.id === e.target.value) || null;
              setSelectedTask(t);
              if (t) setSessionGoal(`Focus on: ${t.title}`);
            }}
            className="w-full px-3 py-1.5 text-xs rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white focus:outline-hidden text-center truncate"
          >
            <option value="">No task linked (Open Focus Session)</option>
            {tasks
              .filter((t) => t.status !== 'Completed')
              .map((t) => (
                <option key={t.id} value={t.id}>
                  {t.title} ({t.priority})
                </option>
              ))}
          </select>

          <input
            type="text"
            value={sessionGoal}
            onChange={(e) => setSessionGoal(e.target.value)}
            placeholder="What is your singular intention for this block?"
            className="w-full px-3 py-1.5 text-xs text-center border-b border-neutral-200 dark:border-neutral-700 bg-transparent text-neutral-700 dark:text-neutral-300 placeholder-neutral-400 focus:outline-hidden focus:border-blue-500"
          />
        </div>

        {/* Big Digital Clock */}
        <div className="py-4">
          <div className="text-7xl sm:text-8xl font-mono font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
            {formatTime(timeLeft)}
          </div>
          <div className="w-48 mx-auto h-1.5 rounded-full bg-neutral-100 dark:bg-neutral-800 mt-4 overflow-hidden">
            <div
              className="h-full bg-blue-600 transition-all duration-1000 ease-linear rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Timer Control Buttons */}
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className={`px-6 py-2.5 rounded-xl font-medium text-xs flex items-center gap-2 cursor-pointer transition-all shadow-xs ${
              isRunning
                ? 'bg-amber-500 hover:bg-amber-600 text-white'
                : 'bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100'
            }`}
          >
            {isRunning ? (
              <>
                <Pause className="w-4 h-4 fill-current" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>{timeLeft < durationMinutes * 60 ? 'Resume' : 'Start Focus'}</span>
              </>
            )}
          </button>

          <button
            onClick={handleReset}
            className="p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-400 transition-colors"
            title="Reset timer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={handleSessionFinished}
            className="px-4 py-2.5 rounded-xl border border-emerald-500/40 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Complete Early</span>
          </button>
        </div>
      </div>

      {/* Recent Focus Log */}
      <div className="p-5 rounded-2xl bg-white dark:bg-neutral-850 border border-neutral-200/80 dark:border-neutral-800/80 space-y-3">
        <div className="flex items-center justify-between text-xs font-semibold">
          <span className="text-neutral-900 dark:text-neutral-100">
            Recent Logged Focus Sessions
          </span>
          <span className="text-neutral-400">
            Total {focusSessions.reduce((sum, s) => sum + s.durationMinutes, 0)} mins
          </span>
        </div>

        <div className="divide-y divide-neutral-100 dark:divide-neutral-800/60">
          {focusSessions.slice(0, 4).map((s) => (
            <div
              key={s.id}
              className="py-2.5 flex items-center justify-between text-xs"
            >
              <div className="min-w-0 pr-2">
                <span className="font-medium text-neutral-800 dark:text-neutral-200">
                  {s.taskTitle || s.sessionGoal || 'Focus Session'}
                </span>
                <div className="text-[11px] text-neutral-400">
                  {s.category || 'General'} · {s.type}
                </div>
              </div>
              <div className="text-right shrink-0">
                <span className="font-mono font-medium text-blue-600 dark:text-blue-400">
                  {s.durationMinutes} mins
                </span>
                <div className="text-[10px] text-neutral-400">
                  {new Date(s.timestamp).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
