import React, { useState } from 'react';
import { Goal, GoalCategory } from '../../types';
import { dataService } from '../../services/dataService';
import {
  Plus,
  Target,
  CheckCircle2,
  Circle,
  MoreVertical,
  Trash2,
  Edit,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

interface GoalsViewProps {
  onOpenGoalModal: (goal?: Goal) => void;
  onOpenAgentModal: () => void;
}

export const GoalsView: React.FC<GoalsViewProps> = ({
  onOpenGoalModal,
  onOpenAgentModal,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<'All' | GoalCategory>('All');
  const [newMilestoneText, setNewMilestoneText] = useState<{ [goalId: string]: string }>({});

  const goals = dataService.getGoals();

  const filteredGoals = goals.filter(
    (g) => selectedCategory === 'All' || g.category === selectedCategory
  );

  const categories: Array<'All' | GoalCategory> = [
    'All',
    'Personal',
    'Education',
    'Career',
    'Finance',
    'Health',
    'Other',
  ];

  const handleUpdateProgress = (goalId: string, progress: number) => {
    dataService.updateGoal(goalId, { progress });
  };

  const handleToggleMilestone = (goal: Goal, milestoneId: string) => {
    if (!goal.milestones) return;
    const updated = goal.milestones.map((m) =>
      m.id === milestoneId ? { ...m, completed: !m.completed } : m
    );
    const completedCount = updated.filter((m) => m.completed).length;
    const autoProgress = Math.round((completedCount / updated.length) * 100);

    dataService.updateGoal(goal.id, {
      milestones: updated,
      progress: autoProgress,
    });
  };

  const handleAddMilestone = (goal: Goal) => {
    const text = newMilestoneText[goal.id];
    if (!text?.trim()) return;

    const current = goal.milestones || [];
    const newM = {
      id: `gm-${Date.now()}`,
      goalId: goal.id,
      userId: goal.userId,
      title: text.trim(),
      completed: false,
    };
    const updated = [...current, newM];
    const completedCount = updated.filter((m) => m.completed).length;
    const autoProgress = Math.round((completedCount / updated.length) * 100);

    dataService.updateGoal(goal.id, {
      milestones: updated,
      progress: autoProgress,
    });

    setNewMilestoneText({ ...newMilestoneText, [goal.id]: '' });
  };

  const handleDeleteGoal = (id: string) => {
    if (confirm('Delete this goal?')) {
      dataService.deleteGoal(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-neutral-200/80 dark:border-neutral-800/80">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
            Strategic Goals
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Connect high-horizon vision to daily action plans
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={onOpenAgentModal}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-850 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 transition-colors cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-500" />
            <span>AI Goal Decomposition</span>
          </button>

          <button
            onClick={() => onOpenGoalModal()}
            className="px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100 text-xs font-medium transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Goal</span>
          </button>
        </div>
      </div>

      {/* Category selector */}
      <div className="flex flex-wrap items-center gap-1 p-1 rounded-lg bg-neutral-100 dark:bg-neutral-800 w-fit">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
              selectedCategory === cat
                ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-xs'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Goals Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredGoals.length === 0 ? (
          <div className="col-span-2 py-16 text-center text-xs text-neutral-400 rounded-2xl bg-white dark:bg-neutral-850 border border-neutral-200/80 dark:border-neutral-800/80">
            No goals found in this category. Click &ldquo;New Goal&rdquo; to define one.
          </div>
        ) : (
          filteredGoals.map((goal) => (
            <div
              key={goal.id}
              className="p-5 rounded-2xl bg-white dark:bg-neutral-850 border border-neutral-200/80 dark:border-neutral-800/80 space-y-4 shadow-xs"
            >
              {/* Card top */}
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-xs text-neutral-400 font-medium">
                    {goal.category}
                  </div>
                  <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mt-0.5">
                    {goal.title}
                  </h3>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onOpenGoalModal(goal)}
                    className="p-1 rounded text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteGoal(goal.id)}
                    className="p-1 rounded text-neutral-400 hover:text-rose-500"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {goal.description && (
                <p className="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-2 leading-relaxed">
                  {goal.description}
                </p>
              )}

              {/* Progress bar + slider */}
              <div>
                <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
                  <span className="text-neutral-600 dark:text-neutral-400">Progress</span>
                  <span className="font-mono text-emerald-600 dark:text-emerald-400">
                    {goal.progress}%
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all"
                    style={{ width: `${goal.progress}%` }}
                  />
                </div>
                <div className="mt-2 flex items-center justify-between text-[11px] text-neutral-400">
                  <span>Target Date: {goal.targetDate}</span>
                  <span className="capitalize">{goal.status}</span>
                </div>
              </div>

              {/* Milestones list */}
              <div className="space-y-2 pt-2 border-t border-neutral-100 dark:border-neutral-800">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
                  Milestone Checkpoints
                </div>
                <div className="space-y-1.5">
                  {(goal.milestones || []).map((m) => (
                    <div
                      key={m.id}
                      onClick={() => handleToggleMilestone(goal, m.id)}
                      className="p-2 rounded-lg bg-neutral-50/60 dark:bg-neutral-900/40 border border-neutral-100 dark:border-neutral-800 flex items-center justify-between cursor-pointer hover:bg-neutral-100/60 dark:hover:bg-neutral-800/40 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        {m.completed ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        ) : (
                          <Circle className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                        )}
                        <span
                          className={`text-xs ${
                            m.completed ? 'line-through text-neutral-400' : 'text-neutral-800 dark:text-neutral-200'
                          }`}
                        >
                          {m.title}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Quick add milestone input */}
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="text"
                    value={newMilestoneText[goal.id] || ''}
                    onChange={(e) =>
                      setNewMilestoneText({ ...newMilestoneText, [goal.id]: e.target.value })
                    }
                    placeholder="Add a milestone checkpoint..."
                    className="flex-1 px-2.5 py-1 text-xs rounded-md border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-hidden"
                  />
                  <button
                    onClick={() => handleAddMilestone(goal)}
                    className="px-2.5 py-1 text-xs font-medium rounded-md bg-neutral-900 text-white dark:bg-white dark:text-neutral-900"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
