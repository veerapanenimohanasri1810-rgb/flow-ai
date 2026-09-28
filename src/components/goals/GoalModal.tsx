import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Goal, GoalCategory, GoalStatus } from '../../types';
import { dataService } from '../../services/dataService';

interface GoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  goalToEdit?: Goal | null;
  onSave?: (goal: Goal) => void;
}

export const GoalModal: React.FC<GoalModalProps> = ({
  isOpen,
  onClose,
  goalToEdit,
  onSave,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<GoalCategory>('Education');
  const [targetDate, setTargetDate] = useState('');
  const [progress, setProgress] = useState<number>(0);
  const [status, setStatus] = useState<GoalStatus>('In Progress');

  useEffect(() => {
    if (goalToEdit) {
      setTitle(goalToEdit.title);
      setDescription(goalToEdit.description);
      setCategory(goalToEdit.category);
      setTargetDate(goalToEdit.targetDate);
      setProgress(goalToEdit.progress);
      setStatus(goalToEdit.status);
    } else {
      setTitle('');
      setDescription('');
      setCategory('Education');
      const future = new Date();
      future.setDate(future.getDate() + 60);
      setTargetDate(future.toISOString().split('T')[0]);
      setProgress(0);
      setStatus('In Progress');
    }
  }, [goalToEdit, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (goalToEdit) {
      const updated = dataService.updateGoal(goalToEdit.id, {
        title,
        description,
        category,
        targetDate,
        progress,
        status,
      });
      if (updated && onSave) onSave(updated);
    } else {
      const created = dataService.addGoal({
        title,
        description,
        category,
        targetDate,
        progress,
        status,
        milestones: [
          { id: `gm-${Date.now()}-1`, goalId: '', userId: '', title: 'Phase 1: Initial Milestone', completed: false },
          { id: `gm-${Date.now()}-2`, goalId: '', userId: '', title: 'Phase 2: Master Core Concepts', completed: false },
        ],
      });
      if (onSave) onSave(created);
    }
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={goalToEdit ? 'Edit Goal' : 'Define New Goal'}
      subtitle="Strategic life & career milestones"
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
            Goal Name *
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Complete Machine Learning course"
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
            placeholder="Why does this goal matter and what is the target outcome?"
            className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as GoalCategory)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-hidden focus:ring-1 focus:ring-blue-500"
            >
              <option value="Personal">Personal</option>
              <option value="Education">Education</option>
              <option value="Career">Career</option>
              <option value="Finance">Finance</option>
              <option value="Health">Health</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
              Target Date
            </label>
            <input
              type="date"
              required
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-hidden focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
            <span>Progress</span>
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">{progress}%</span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            value={progress}
            onChange={(e) => setProgress(Number(e.target.value))}
            className="w-full accent-emerald-500 cursor-pointer"
          />
        </div>

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-neutral-100 dark:border-neutral-800">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-2 text-xs font-medium rounded-lg text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-xs font-medium rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100 transition-colors shadow-xs cursor-pointer"
          >
            {goalToEdit ? 'Save Changes' : 'Save Goal'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
