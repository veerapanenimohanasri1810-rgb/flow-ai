/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { LandingPage } from './components/landing/LandingPage';
import { DashboardView } from './components/dashboard/DashboardView';
import { MyDayView } from './components/myday/MyDayView';
import { TasksView } from './components/tasks/TasksView';
import { ProjectsView } from './components/projects/ProjectsView';
import { GoalsView } from './components/goals/GoalsView';
import { CalendarView } from './components/calendar/CalendarView';
import { HabitsView } from './components/habits/HabitsView';
import { FocusView } from './components/focus/FocusView';
import { NotesView } from './components/notes/NotesView';
import { AnalyticsView } from './components/analytics/AnalyticsView';
import { ReviewsView } from './components/reviews/ReviewsView';
import { ProfileView } from './components/profile/ProfileView';

import { AIAgentModal } from './components/common/AIAgentModal';
import { AuthModal } from './components/auth/AuthModal';
import { TaskModal } from './components/tasks/TaskModal';
import { ProjectModal } from './components/projects/ProjectModal';
import { GoalModal } from './components/goals/GoalModal';
import { EventModal } from './components/calendar/EventModal';

import { dataService } from './services/dataService';
import { Task, Project, Goal, CalendarEvent } from './types';

function MainApp() {
  const [inApp, setInApp] = useState<boolean>(true); // Start in workspace or landing
  const [currentView, setCurrentView] = useState<string>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals state
  const [isAgentModalOpen, setIsAgentModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register' | 'forgot'>('login');

  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);

  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [projectToEdit, setProjectToEdit] = useState<Project | null>(null);

  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [goalToEdit, setGoalToEdit] = useState<Goal | null>(null);

  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [eventDefaultDate, setEventDefaultDate] = useState<string | undefined>(undefined);

  const [focusTask, setFocusTask] = useState<Task | null>(null);

  // Sync state subscriptions
  const [tasks, setTasks] = useState(() => dataService.getTasks());
  const [habits, setHabits] = useState(() => dataService.getHabits());

  useEffect(() => {
    const unsub = dataService.subscribe(() => {
      setTasks(dataService.getTasks());
      setHabits(dataService.getHabits());
    });
    return unsub;
  }, []);

  const todayStr = new Date().toISOString().split('T')[0];
  const pendingTasksCount = tasks.filter((t) => t.status !== 'Completed').length;
  const habitsDoneToday = habits.filter((h) => h.completedDates.includes(todayStr)).length;

  const handleStartFocus = (task?: Task) => {
    if (task) setFocusTask(task);
    setCurrentView('focus');
  };

  const handleOpenTaskModal = (task?: Task) => {
    setTaskToEdit(task || null);
    setIsTaskModalOpen(true);
  };

  const handleOpenProjectModal = (proj?: Project) => {
    setProjectToEdit(proj || null);
    setIsProjectModalOpen(true);
  };

  const handleOpenGoalModal = (goal?: Goal) => {
    setGoalToEdit(goal || null);
    setIsGoalModalOpen(true);
  };

  const handleOpenEventModal = (date?: string) => {
    setEventDefaultDate(date);
    setIsEventModalOpen(true);
  };

  const handleOpenAuth = (mode: 'login' | 'register' = 'login') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  if (!inApp) {
    return (
      <>
        <LandingPage
          onEnterApp={() => setInApp(true)}
          onOpenAuth={handleOpenAuth}
          onOpenAgentModal={() => setIsAgentModalOpen(true)}
        />
        <AIAgentModal
          isOpen={isAgentModalOpen}
          onClose={() => setIsAgentModalOpen(false)}
        />
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          initialMode={authModalMode}
        />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-100/60 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 flex flex-col transition-colors selection:bg-blue-500/20">
      {/* Sidebar Navigation */}
      <Sidebar
        currentView={currentView}
        onNavigate={(view) => setCurrentView(view)}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        taskCount={pendingTasksCount}
        habitsDoneToday={habitsDoneToday}
        totalHabits={habits.length}
        onOpenAgentModal={() => setIsAgentModalOpen(true)}
      />

      {/* Main Content Area */}
      <div className="md:pl-64 flex flex-col flex-1 min-w-0">
        <Navbar
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          onOpenAgentModal={() => setIsAgentModalOpen(true)}
          onOpenQuickTaskModal={() => handleOpenTaskModal()}
          onNavigate={(view) => setCurrentView(view)}
          onOpenLanding={() => setInApp(false)}
          searchQuery={searchQuery}
          onSearchChange={(q) => setSearchQuery(q)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {currentView === 'dashboard' && (
            <DashboardView
              onNavigate={(v) => setCurrentView(v)}
              onOpenTaskModal={() => handleOpenTaskModal()}
              onStartFocus={handleStartFocus}
              onOpenAgentModal={() => setIsAgentModalOpen(true)}
            />
          )}

          {currentView === 'myday' && (
            <MyDayView
              onStartFocus={handleStartFocus}
              onOpenTaskModal={() => handleOpenTaskModal()}
              onOpenAgentModal={() => setIsAgentModalOpen(true)}
            />
          )}

          {currentView === 'tasks' && (
            <TasksView
              onOpenTaskModal={handleOpenTaskModal}
              onStartFocus={handleStartFocus}
              onOpenAgentModal={() => setIsAgentModalOpen(true)}
            />
          )}

          {currentView === 'projects' && (
            <ProjectsView
              onOpenProjectModal={handleOpenProjectModal}
              onOpenTaskModal={handleOpenTaskModal}
            />
          )}

          {currentView === 'goals' && (
            <GoalsView
              onOpenGoalModal={handleOpenGoalModal}
              onOpenAgentModal={() => setIsAgentModalOpen(true)}
            />
          )}

          {currentView === 'calendar' && (
            <CalendarView
              onOpenEventModal={handleOpenEventModal}
              onOpenTaskModal={handleOpenTaskModal}
            />
          )}

          {currentView === 'habits' && <HabitsView />}

          {currentView === 'focus' && (
            <FocusView
              initialTask={focusTask}
              onClearInitialTask={() => setFocusTask(null)}
            />
          )}

          {currentView === 'notes' && <NotesView />}

          {currentView === 'analytics' && <AnalyticsView />}

          {currentView === 'reviews' && <ReviewsView />}

          {currentView === 'profile' && <ProfileView onOpenAuth={handleOpenAuth} />}
        </main>
      </div>

      {/* Global Modals */}
      <AIAgentModal
        isOpen={isAgentModalOpen}
        onClose={() => setIsAgentModalOpen(false)}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authModalMode}
      />

      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        taskToEdit={taskToEdit}
      />

      <ProjectModal
        isOpen={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
        projectToEdit={projectToEdit}
      />

      <GoalModal
        isOpen={isGoalModalOpen}
        onClose={() => setIsGoalModalOpen(false)}
        goalToEdit={goalToEdit}
      />

      <EventModal
        isOpen={isEventModalOpen}
        onClose={() => setIsEventModalOpen(false)}
        defaultDate={eventDefaultDate}
      />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <MainApp />
      </AuthProvider>
    </ThemeProvider>
  );
}
