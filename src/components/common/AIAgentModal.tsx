import React, { useState } from 'react';
import { Modal } from './Modal';
import { Sparkles, Calendar, CheckSquare, Target, Clock, ArrowRight, ShieldCheck, Cpu, Code2, AlertCircle } from 'lucide-react';
import { agentService } from '../../services/agentService';

interface AIAgentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AIAgentModal: React.FC<AIAgentModalProps> = ({ isOpen, onClose }) => {
  const [clickedAction, setClickedAction] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'commands' | 'architecture' | 'workflow'>('commands');
  const agentStatus = agentService.getAgentStatus();

  const handleCommandClick = (actionName: string) => {
    setClickedAction(actionName);
    setTimeout(() => {
      setClickedAction(null);
    }, 3200);
  };

  const workflowSteps = [
    { num: '01', title: 'Understand User Goals', desc: 'Parses natural language prompts, deadline constraints, and high-level objectives.' },
    { num: '02', title: 'Check Existing Tasks', desc: 'Audits active task queue, backlog, and estimated durations.' },
    { num: '03', title: 'Check Calendar Commitments', desc: 'Inspects fixed meetings, events, and focus reservations.' },
    { num: '04', title: 'Calculate Available Time', desc: 'Evaluates user working hours (08:30 - 18:00) minus existing calendar blocks.' },
    { num: '05', title: 'Break Goals into Actionable Tasks', desc: 'Decomposes strategic milestones into concrete, bounded todos with durations.' },
    { num: '06', title: 'Prioritize Tasks', desc: 'Weights urgency, Eisenhower impact, and project deadlines.' },
    { num: '07', title: 'Schedule Tasks Intelligently', desc: 'Allocates timeblocks during peak cognitive energy slots.' },
    { num: '08', title: 'Detect Schedule Conflicts', desc: 'Flags overlapping deadlines or overloaded working hours.' },
    { num: '09', title: 'Adjust & Optimize Schedule', desc: 'Resolves slot collisions and balances daily workloads.' },
    { num: '10', title: 'Track Execution in Real-Time', desc: 'Observes task completions, habit checks, and Pomodoro logs.' },
    { num: '11', title: 'Reschedule Missed Tasks', desc: 'Automatically pushes uncompleted items forward into viable future slots.' },
    { num: '12', title: 'Provide Adaptive Daily Summary', desc: 'Generates evening retrospectives and tomorrow’s primed agenda.' },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="FlowAI Productivity Agent"
      subtitle="Autonomous coordination engine"
      maxWidth="max-w-2xl"
    >
      <div className="space-y-6">
        {/* Banner with Agent Status */}
        <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/70 border border-neutral-200/80 dark:border-neutral-750">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-blue-500/10 dark:bg-blue-400/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-medium">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs uppercase tracking-wider text-neutral-500 dark:text-neutral-400 font-medium">
                  Agent Status
                </div>
                <div className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  {agentStatus.status}
                </div>
              </div>
            </div>
            <div className="text-xs text-neutral-500 dark:text-neutral-400 flex items-center gap-1.5 self-start sm:self-center">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
              <span>Firestore Schema Ready</span>
            </div>
          </div>
          <p className="mt-3 text-xs leading-relaxed text-neutral-600 dark:text-neutral-300">
            FlowAI is architected with strict typed boundaries. All tasks, goals, habits, and calendars are ready for full bidirectional AI agent planning. No fake AI responses are generated.
          </p>
        </div>

        {/* Tab selection */}
        <div className="flex items-center gap-1 p-1 bg-neutral-100 dark:bg-neutral-800 rounded-lg">
          <button
            onClick={() => setActiveTab('commands')}
            className={`flex-1 py-1.5 px-3 text-xs font-medium rounded-md transition-colors ${
              activeTab === 'commands'
                ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-xs'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            Possible Commands
          </button>
          <button
            onClick={() => setActiveTab('workflow')}
            className={`flex-1 py-1.5 px-3 text-xs font-medium rounded-md transition-colors ${
              activeTab === 'workflow'
                ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-xs'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            12-Step Agent Pipeline
          </button>
          <button
            onClick={() => setActiveTab('architecture')}
            className={`flex-1 py-1.5 px-3 text-xs font-medium rounded-md transition-colors ${
              activeTab === 'architecture'
                ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-xs'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            Service Contracts
          </button>
        </div>

        {/* Tab 1: Commands */}
        {activeTab === 'commands' && (
          <div className="space-y-4">
            <div className="text-xs text-neutral-500 dark:text-neutral-400">
              Future natural language interactions supported by the workspace:
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {agentStatus.supportedActions.map((action) => (
                <button
                  key={action}
                  onClick={() => handleCommandClick(action)}
                  className="group p-3 text-left rounded-xl border border-neutral-200 dark:border-neutral-800 hover:border-blue-500/50 dark:hover:border-blue-500/50 bg-white dark:bg-neutral-850 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-all flex items-start justify-between"
                >
                  <div>
                    <div className="text-sm font-medium text-neutral-900 dark:text-neutral-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {action}
                    </div>
                    <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                      Autonomous execution plan
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:text-blue-500 transition-transform group-hover:translate-x-0.5 mt-0.5" />
                </button>
              ))}
            </div>

            {clickedAction && (
              <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-300 text-xs flex items-center gap-2 animate-in fade-in">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>
                  <strong>{clickedAction}</strong>: AI Agent integration coming soon. All underlying data structures are currently ready.
                </span>
              </div>
            )}

            <div className="p-3.5 rounded-xl border border-dashed border-neutral-200 dark:border-neutral-800 text-neutral-500 dark:text-neutral-400 text-xs flex items-start gap-2.5">
              <Clock className="w-4 h-4 shrink-0 mt-0.5 text-neutral-400" />
              <p>
                <strong>Target Natural Language Example:</strong> &ldquo;I need to finish my project by Friday and prepare for my exam next Monday.&rdquo; The agent will break this into prioritized tasks, find calendar slots, and adjust dynamically.
              </p>
            </div>
          </div>
        )}

        {/* Tab 2: Workflow Pipeline */}
        {activeTab === 'workflow' && (
          <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-2">
              The 12-step autonomous lifecycle implemented in <code className="px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">/src/services/agentService.ts</code>:
            </p>
            {workflowSteps.map((step) => (
              <div
                key={step.num}
                className="p-2.5 rounded-lg border border-neutral-100 dark:border-neutral-800/80 bg-neutral-50/60 dark:bg-neutral-850/60 flex items-start gap-3"
              >
                <span className="text-xs font-semibold text-neutral-400 dark:text-neutral-500 font-mono mt-0.5">
                  {step.num}
                </span>
                <div>
                  <div className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">
                    {step.title}
                  </div>
                  <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                    {step.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 3: Architecture & Schemas */}
        {activeTab === 'architecture' && (
          <div className="space-y-3">
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              FlowAI exposes 14 strictly typed service functions for the upcoming LLM layer:
            </p>
            <div className="p-3 rounded-lg bg-neutral-950 text-neutral-200 text-xs font-mono space-y-1 overflow-x-auto border border-neutral-800">
              <div className="text-neutral-400">// Ready in /src/services/agentService.ts</div>
              <div>understandUserGoal(userGoalText: string)</div>
              <div>prioritizeTasks(tasks: Task[])</div>
              <div>createDailyPlan(context: DailyContext)</div>
              <div>createWeeklyPlan(context: WeeklyContext)</div>
              <div>breakGoalIntoTasks(goal: Goal)</div>
              <div>scheduleTasks(tasks: Task[], calendar: CalendarEvent[])</div>
              <div>rescheduleTasks(missedTasks: Task[])</div>
              <div>detectDeadlineConflicts(tasks, calendar)</div>
              <div>analyzeProductivity(metricsContext)</div>
              <div>suggestNextAction(tasks, sessions)</div>
              <div>updateGoal(goalId, progressDelta)</div>
              <div>createReminder(title, message, type)</div>
              <div>summarizeDailyProgress(context)</div>
              <div>summarizeWeeklyProgress(context)</div>
            </div>
            <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
              <Code2 className="w-3.5 h-3.5" />
              <span>Documented in Firestore Blueprint &amp; ABAC Security Rules.</span>
            </div>
          </div>
        )}

        {/* Action Button */}
        <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
          <span className="text-xs text-neutral-400">
            FlowAI Agent Architecture v1.0
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-white transition-colors"
          >
            Close Overview
          </button>
        </div>
      </div>
    </Modal>
  );
};
