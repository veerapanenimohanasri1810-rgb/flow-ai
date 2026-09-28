export type Priority = 'Low' | 'Medium' | 'High' | 'Urgent';
export type TaskStatus = 'Todo' | 'In Progress' | 'Completed';
export type ProjectStatus = 'Planning' | 'Active' | 'Paused' | 'Completed';
export type GoalCategory = 'Personal' | 'Education' | 'Career' | 'Finance' | 'Health' | 'Other';
export type GoalStatus = 'In Progress' | 'Completed' | 'On Hold';
export type CalendarEventType = 'task' | 'deadline' | 'meeting' | 'focus' | 'habit';
export type FocusSessionType = 'pomodoro' | 'custom' | 'short-break' | 'long-break';
export type NotificationType = 'info' | 'warning' | 'success' | 'deadline' | 'streak';

export interface UserProfile {
  userId: string;
  name: string;
  email: string;
  avatarUrl?: string;
  theme: 'light' | 'dark' | 'system';
  workingHoursStart: string; // e.g. "09:00"
  workingHoursEnd: string;   // e.g. "18:00"
  dailyFocusGoalMinutes: number;
  productivityScore: number;
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  id: string;
  userId: string;
  title: string;
  description: string;
  dueDate: string; // YYYY-MM-DD
  dueTime?: string; // HH:MM
  priority: Priority;
  category: string;
  projectId?: string;
  estimatedDuration: number; // in minutes
  status: TaskStatus;
  tags: string[];
  order?: number;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectMilestone {
  id: string;
  projectId: string;
  userId: string;
  title: string;
  dueDate?: string;
  completed: boolean;
  order: number;
}

export interface Project {
  id: string;
  userId: string;
  name: string;
  description: string;
  startDate: string;
  deadline: string;
  priority: Priority;
  status: ProjectStatus;
  progress: number; // 0 to 100
  color: string;
  milestones?: ProjectMilestone[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface GoalMilestone {
  id: string;
  goalId: string;
  userId: string;
  title: string;
  targetDate?: string;
  completed: boolean;
}

export interface Goal {
  id: string;
  userId: string;
  title: string;
  description: string;
  category: GoalCategory;
  targetDate: string;
  progress: number; // 0 to 100
  status: GoalStatus;
  milestones?: GoalMilestone[];
  createdAt: string;
  updatedAt: string;
}

export interface CalendarEvent {
  id: string;
  userId: string;
  title: string;
  description?: string;
  startDate: string; // YYYY-MM-DD
  endDate?: string;  // YYYY-MM-DD
  startTime?: string; // HH:MM
  endTime?: string;   // HH:MM
  allDay: boolean;
  type: CalendarEventType;
  relatedId?: string;
  color?: string;
}

export interface Habit {
  id: string;
  userId: string;
  name: string;
  description: string;
  frequency: 'daily' | 'weekly';
  targetDaysPerWeek: number;
  currentStreak: number;
  longestStreak: number;
  category: string;
  color: string;
  completedDates: string[]; // YYYY-MM-DD strings
  createdAt: string;
}

export interface HabitEntry {
  id: string;
  habitId: string;
  userId: string;
  date: string; // YYYY-MM-DD
  completed: boolean;
  notes?: string;
}

export interface FocusSession {
  id: string;
  userId: string;
  taskId?: string;
  taskTitle?: string;
  sessionGoal?: string;
  category?: string;
  durationMinutes: number;
  type: FocusSessionType;
  completed: boolean;
  timestamp: string; // ISO
}

export interface Note {
  id: string;
  userId: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  isPinned: boolean;
  summary?: string;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  read: boolean;
  createdAt: string;
  link?: string;
}

export interface DailyReview {
  id: string;
  userId: string;
  date: string; // YYYY-MM-DD
  whatWentWell: string;
  whatToImprove: string;
  tasksCompletedCount: number;
  tasksRemainingCount: number;
  focusMinutes: number;
  habitsCompletedCount: number;
  productivityRating: number; // 1 to 5
  createdAt: string;
}

export interface WeeklyReview {
  id: string;
  userId: string;
  weekIdentifier: string; // e.g. "2026-W39"
  startDate: string;
  endDate: string;
  totalTasksCompleted: number;
  totalFocusHours: number;
  goalProgressSummary: string;
  habitConsistencyRate: number; // percentage
  overdueTasksCount: number;
  keyWins: string;
  nextWeekPriorities: string;
  createdAt: string;
}

export interface AgentActivity {
  id: string;
  userId: string;
  actionType: string;
  status: 'proposed' | 'approved' | 'executed' | 'reverted';
  inputGoal: string;
  summary: string;
  details?: Record<string, unknown>;
  timestamp: string;
}
