import React, { useState } from 'react';
import { Project, ProjectStatus, Task } from '../../types';
import { dataService } from '../../services/dataService';
import {
  Plus,
  FolderKanban,
  Calendar,
  CheckCircle2,
  Circle,
  MoreVertical,
  Trash2,
  Edit,
  Clock,
} from 'lucide-react';

interface ProjectsViewProps {
  onOpenProjectModal: (proj?: Project) => void;
  onOpenTaskModal: (task?: Task) => void;
}

export const ProjectsView: React.FC<ProjectsViewProps> = ({
  onOpenProjectModal,
  onOpenTaskModal,
}) => {
  const [statusFilter, setStatusFilter] = useState<'All' | ProjectStatus>('All');
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [newMilestoneTitle, setNewMilestoneTitle] = useState('');

  const projects = dataService.getProjects();
  const tasks = dataService.getTasks();

  const filteredProjects = projects.filter(
    (p) => statusFilter === 'All' || p.status === statusFilter
  );

  const selectedProject =
    projects.find((p) => p.id === selectedProjectId) || filteredProjects[0] || null;

  const projectTasks = selectedProject
    ? tasks.filter((t) => t.projectId === selectedProject.id)
    : [];

  const handleToggleMilestone = (milestoneId: string) => {
    if (!selectedProject || !selectedProject.milestones) return;
    const updatedMilestones = selectedProject.milestones.map((m) =>
      m.id === milestoneId ? { ...m, completed: !m.completed } : m
    );
    // recalculate progress
    const completedCount = updatedMilestones.filter((m) => m.completed).length;
    const progress = Math.round((completedCount / updatedMilestones.length) * 100);

    dataService.updateProject(selectedProject.id, {
      milestones: updatedMilestones,
      progress,
    });
  };

  const handleAddMilestone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProject || !newMilestoneTitle.trim()) return;

    const currentMilestones = selectedProject.milestones || [];
    const newM = {
      id: `pm-${Date.now()}`,
      projectId: selectedProject.id,
      userId: selectedProject.userId,
      title: newMilestoneTitle.trim(),
      completed: false,
      order: currentMilestones.length + 1,
    };

    const updated = [...currentMilestones, newM];
    const completedCount = updated.filter((m) => m.completed).length;
    const progress = Math.round((completedCount / updated.length) * 100);

    dataService.updateProject(selectedProject.id, {
      milestones: updated,
      progress,
    });

    setNewMilestoneTitle('');
  };

  const handleDeleteProject = (id: string) => {
    if (confirm('Are you sure you want to delete this project?')) {
      dataService.deleteProject(id);
      if (selectedProjectId === id) setSelectedProjectId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-neutral-200/80 dark:border-neutral-800/80">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
            Projects
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Organize long-horizon initiatives with milestones and progress
          </p>
        </div>

        <button
          onClick={() => onOpenProjectModal()}
          className="px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100 text-xs font-medium transition-colors flex items-center gap-1.5 shadow-xs self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Project</span>
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-1 p-1 rounded-lg bg-neutral-100 dark:bg-neutral-800 w-fit">
        {(['All', 'Planning', 'Active', 'Paused', 'Completed'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setStatusFilter(tab)}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
              statusFilter === tab
                ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-xs'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Main layout: Project cards + Selected Project deep inspection */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Project List */}
        <div className="space-y-3">
          {filteredProjects.length === 0 ? (
            <div className="p-8 text-center text-xs text-neutral-400 rounded-xl bg-white dark:bg-neutral-850 border border-neutral-200/80 dark:border-neutral-800/80">
              No projects in this category
            </div>
          ) : (
            filteredProjects.map((p) => {
              const isSelected = selectedProject?.id === p.id;
              return (
                <div
                  key={p.id}
                  onClick={() => setSelectedProjectId(p.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-white dark:bg-neutral-850 border-blue-500/80 shadow-xs'
                      : 'bg-white dark:bg-neutral-850 border-neutral-200/80 dark:border-neutral-800/80 hover:border-neutral-300 dark:hover:border-neutral-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-neutral-900 dark:text-white truncate">
                      {p.name}
                    </span>
                    <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400">
                      {p.progress}%
                    </span>
                  </div>

                  <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-1 line-clamp-2">
                    {p.description}
                  </p>

                  {/* Progress bar */}
                  <div className="w-full h-1.5 rounded-full bg-neutral-100 dark:bg-neutral-800 mt-3 overflow-hidden">
                    <div
                      className="h-full bg-blue-600 rounded-full"
                      style={{ width: `${p.progress}%` }}
                    />
                  </div>

                  <div className="mt-3 flex items-center justify-between text-[10px] text-neutral-400">
                    <span>{p.status}</span>
                    <span>Due {p.deadline}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right 2 Columns: Selected Project Inspector */}
        <div className="lg:col-span-2">
          {selectedProject ? (
            <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-neutral-850 border border-neutral-200/80 dark:border-neutral-800/80 space-y-6">
              {/* Project Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-neutral-100 dark:border-neutral-800">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-neutral-900 dark:text-white">
                      {selectedProject.name}
                    </h2>
                    <span className="text-xs text-neutral-400">({selectedProject.status})</span>
                  </div>
                  <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 flex items-center gap-2">
                    <span>Started {selectedProject.startDate}</span>
                    <span>·</span>
                    <span>Deadline {selectedProject.deadline}</span>
                    <span>·</span>
                    <span>{selectedProject.priority} Priority</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onOpenProjectModal(selectedProject)}
                    className="p-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-xs flex items-center gap-1 transition-colors"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleDeleteProject(selectedProject.id)}
                    className="p-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-xs transition-colors"
                    title="Delete project"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Progress Overview Bar */}
              <div>
                <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
                  <span className="text-neutral-700 dark:text-neutral-300">
                    Execution Velocity
                  </span>
                  <span className="text-blue-600 dark:text-blue-400 font-mono">
                    {selectedProject.progress}% complete
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
                  <div
                    className="h-full bg-blue-600 rounded-full transition-all"
                    style={{ width: `${selectedProject.progress}%` }}
                  />
                </div>
              </div>

              {/* Milestones Checklist */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                    Project Milestones
                  </h3>
                  <span className="text-[11px] text-neutral-400">
                    {selectedProject.milestones?.filter((m) => m.completed).length || 0} of{' '}
                    {selectedProject.milestones?.length || 0} completed
                  </span>
                </div>

                <div className="space-y-1.5">
                  {(selectedProject.milestones || []).map((m) => (
                    <div
                      key={m.id}
                      onClick={() => handleToggleMilestone(m.id)}
                      className="p-2.5 rounded-xl border border-neutral-100 dark:border-neutral-800 bg-neutral-50/60 dark:bg-neutral-900/40 flex items-center justify-between cursor-pointer hover:bg-neutral-100/60 dark:hover:bg-neutral-800/40 transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        {m.completed ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                        ) : (
                          <Circle className="w-4 h-4 text-neutral-400 shrink-0" />
                        )}
                        <span
                          className={`text-xs ${
                            m.completed
                              ? 'line-through text-neutral-400'
                              : 'text-neutral-800 dark:text-neutral-200'
                          }`}
                        >
                          {m.title}
                        </span>
                      </div>
                      {m.dueDate && (
                        <span className="text-[10px] font-mono text-neutral-400">
                          {m.dueDate}
                        </span>
                      )}
                    </div>
                  ))}
                </div>

                {/* Add milestone input */}
                <form onSubmit={handleAddMilestone} className="flex items-center gap-2 pt-1">
                  <input
                    type="text"
                    value={newMilestoneTitle}
                    onChange={(e) => setNewMilestoneTitle(e.target.value)}
                    placeholder="Add a milestone to this project..."
                    className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 text-xs font-medium rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:text-neutral-900 transition-colors cursor-pointer"
                  >
                    Add Milestone
                  </button>
                </form>
              </div>

              {/* Linked Tasks */}
              <div className="space-y-3 pt-2 border-t border-neutral-100 dark:border-neutral-800">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                    Linked Deliverables ({projectTasks.length})
                  </h3>
                  <button
                    onClick={() => onOpenTaskModal()}
                    className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Attach Task</span>
                  </button>
                </div>

                <div className="space-y-1.5">
                  {projectTasks.length === 0 ? (
                    <div className="py-4 text-center text-xs text-neutral-400">
                      No tasks assigned directly to this project.
                    </div>
                  ) : (
                    projectTasks.map((t) => (
                      <div
                        key={t.id}
                        className="p-2.5 rounded-lg border border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50 flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className={
                              t.status === 'Completed' ? 'line-through text-neutral-400' : ''
                            }
                          >
                            {t.title}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-[11px] text-neutral-400">
                          <span>{t.priority}</span>
                          <span>Due {t.dueDate}</span>
                          <span className="font-medium text-neutral-600 dark:text-neutral-300">
                            {t.status}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Notes */}
              {selectedProject.notes && (
                <div className="p-3.5 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200/60 dark:border-neutral-800 text-xs space-y-1">
                  <span className="font-semibold text-neutral-700 dark:text-neutral-300">
                    Strategic Notes:
                  </span>
                  <p className="text-neutral-500 dark:text-neutral-400 leading-relaxed">
                    {selectedProject.notes}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="py-20 text-center text-xs text-neutral-400">
              Select or create a project to inspect details.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
