import {
  Task,
  Project,
  Goal,
  CalendarEvent,
  Habit,
  FocusSession,
  Note,
  NotificationItem,
  DailyReview,
  WeeklyReview,
  UserProfile,
} from '../types';

const STORAGE_KEYS = {
  PROFILE: 'flowai_profile',
  TASKS: 'flowai_tasks',
  PROJECTS: 'flowai_projects',
  GOALS: 'flowai_goals',
  CALENDAR: 'flowai_calendar',
  HABITS: 'flowai_habits',
  FOCUS: 'flowai_focus',
  NOTES: 'flowai_notes',
  NOTIFICATIONS: 'flowai_notifications',
  DAILY_REVIEWS: 'flowai_daily_reviews',
  WEEKLY_REVIEWS: 'flowai_weekly_reviews',
  AUTH_USER: 'flowai_auth_user',
};

// Initial realistic default data
const DEFAULT_USER_ID = 'usr_alex_chen';

const DEFAULT_PROFILE: UserProfile = {
  userId: DEFAULT_USER_ID,
  name: 'Alex Chen',
  email: 'alex.chen@flowai.work',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  theme: 'dark',
  workingHoursStart: '08:30',
  workingHoursEnd: '18:00',
  dailyFocusGoalMinutes: 180, // 3 hours
  productivityScore: 88,
  createdAt: '2026-01-15T09:00:00Z',
  updatedAt: '2026-09-28T08:00:00Z',
};

const getTodayString = (offsetDays = 0): string => {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().split('T')[0];
};

const DEFAULT_PROJECTS: Project[] = [
  {
    id: 'proj-1',
    userId: DEFAULT_USER_ID,
    name: 'FlowAI Platform v1.0 Launch',
    description: 'Core product architecture, dashboard polish, and deployment pipelines.',
    startDate: getTodayString(-20),
    deadline: getTodayString(12),
    priority: 'Urgent',
    status: 'Active',
    progress: 78,
    color: '#3b82f6', // blue
    milestones: [
      { id: 'pm-1', projectId: 'proj-1', userId: DEFAULT_USER_ID, title: 'Database schema & state management', completed: true, order: 1 },
      { id: 'pm-2', projectId: 'proj-1', userId: DEFAULT_USER_ID, title: 'Calendar & Focus mode integration', completed: true, order: 2 },
      { id: 'pm-3', projectId: 'proj-1', userId: DEFAULT_USER_ID, title: 'Security rules and ABAC audit', completed: false, order: 3 },
      { id: 'pm-4', projectId: 'proj-1', userId: DEFAULT_USER_ID, title: 'Final UX walkthrough & beta release', completed: false, order: 4 },
    ],
    notes: 'Focus on zero-pill layout discipline and responsive design.',
    createdAt: getTodayString(-20),
    updatedAt: getTodayString(),
  },
  {
    id: 'proj-2',
    userId: DEFAULT_USER_ID,
    name: 'Deep Learning Specialization',
    description: 'Master transformers, attention mechanisms, and multi-modal alignment models.',
    startDate: getTodayString(-45),
    deadline: getTodayString(30),
    priority: 'High',
    status: 'Active',
    progress: 65,
    color: '#8b5cf6', // purple
    milestones: [
      { id: 'pm-21', projectId: 'proj-2', userId: DEFAULT_USER_ID, title: 'Course 1-3 Deep Neural Nets', completed: true, order: 1 },
      { id: 'pm-22', projectId: 'proj-2', userId: DEFAULT_USER_ID, title: 'Sequence Models & Attention', completed: true, order: 2 },
      { id: 'pm-23', projectId: 'proj-2', userId: DEFAULT_USER_ID, title: 'Transformer Architecture implementation', completed: false, order: 3 },
      { id: 'pm-24', projectId: 'proj-2', userId: DEFAULT_USER_ID, title: 'Capstone practical project', completed: false, order: 4 },
    ],
    notes: 'Complete 1 module every weekend with active code implementation.',
    createdAt: getTodayString(-45),
    updatedAt: getTodayString(),
  },
  {
    id: 'proj-3',
    userId: DEFAULT_USER_ID,
    name: 'Personal Financial Portfolio Rebalance',
    description: 'Quarterly review of index funds, high-yield savings, and capital investments.',
    startDate: getTodayString(-10),
    deadline: getTodayString(5),
    priority: 'Medium',
    status: 'Planning',
    progress: 40,
    color: '#10b981', // emerald
    milestones: [
      { id: 'pm-31', projectId: 'proj-3', userId: DEFAULT_USER_ID, title: 'Export Q3 dividend and dividend reinvestment', completed: true, order: 1 },
      { id: 'pm-32', projectId: 'proj-3', userId: DEFAULT_USER_ID, title: 'Assess tax-advantaged account allocations', completed: false, order: 2 },
      { id: 'pm-33', projectId: 'proj-3', userId: DEFAULT_USER_ID, title: 'Execute quarterly rebalance orders', completed: false, order: 3 },
    ],
    createdAt: getTodayString(-10),
    updatedAt: getTodayString(),
  },
];

const DEFAULT_TASKS: Task[] = [
  {
    id: 'task-1',
    userId: DEFAULT_USER_ID,
    title: 'Finish project documentation & API specifications',
    description: 'Document the service contracts for aiService and agentService and verify parameter signatures.',
    dueDate: getTodayString(0),
    dueTime: '09:00',
    priority: 'High',
    category: 'Engineering',
    projectId: 'proj-1',
    estimatedDuration: 60,
    status: 'Completed',
    tags: ['docs', 'architecture', 'api'],
    completedAt: `${getTodayString(0)}T10:15:00Z`,
    createdAt: getTodayString(-2),
    updatedAt: getTodayString(0),
  },
  {
    id: 'task-2',
    userId: DEFAULT_USER_ID,
    title: 'Study Deep Learning & Transformer Self-Attention',
    description: 'Work through lecture 8 notes on scaled dot-product attention and multi-head projection layers.',
    dueDate: getTodayString(0),
    dueTime: '11:00',
    priority: 'High',
    category: 'Education',
    projectId: 'proj-2',
    estimatedDuration: 90,
    status: 'In Progress',
    tags: ['machine-learning', 'research', 'math'],
    createdAt: getTodayString(-1),
    updatedAt: getTodayString(0),
  },
  {
    id: 'task-3',
    userId: DEFAULT_USER_ID,
    title: 'Complete assignment: Distributed systems consensus lab',
    description: 'Implement Raft leader election and log replication test suite passing 100%.',
    dueDate: getTodayString(0),
    dueTime: '14:00',
    priority: 'Urgent',
    category: 'Education',
    projectId: 'proj-2',
    estimatedDuration: 120,
    status: 'Todo',
    tags: ['coding', 'lab', 'homework'],
    createdAt: getTodayString(-1),
    updatedAt: getTodayString(0),
  },
  {
    id: 'task-4',
    userId: DEFAULT_USER_ID,
    title: 'Exercise & Endurance Training (Zone 2 Cardio)',
    description: '45 minutes aerobic stationary cycling or 5km outdoor trail run, keep HR around 135 bpm.',
    dueDate: getTodayString(0),
    dueTime: '17:00',
    priority: 'Medium',
    category: 'Health',
    estimatedDuration: 45,
    status: 'Todo',
    tags: ['fitness', 'recovery', 'cardio'],
    createdAt: getTodayString(0),
    updatedAt: getTodayString(0),
  },
  {
    id: 'task-5',
    userId: DEFAULT_USER_ID,
    title: 'Audit Firebase security rules against Red Team attack vectors',
    description: 'Validate isValidId helper and check affectedKeys rules for terminal state integrity.',
    dueDate: getTodayString(1),
    dueTime: '10:00',
    priority: 'Urgent',
    category: 'Engineering',
    projectId: 'proj-1',
    estimatedDuration: 90,
    status: 'Todo',
    tags: ['security', 'firebase', 'audit'],
    createdAt: getTodayString(-1),
    updatedAt: getTodayString(0),
  },
  {
    id: 'task-6',
    userId: DEFAULT_USER_ID,
    title: 'Review quarterly savings distribution and index fund rebalancing',
    description: 'Confirm automated deposit clearances and check rebalancing threshold bands.',
    dueDate: getTodayString(3),
    dueTime: '15:30',
    priority: 'Low',
    category: 'Finance',
    projectId: 'proj-3',
    estimatedDuration: 30,
    status: 'Todo',
    tags: ['finance', 'quarterly'],
    createdAt: getTodayString(-3),
    updatedAt: getTodayString(0),
  },
];

const DEFAULT_GOALS: Goal[] = [
  {
    id: 'goal-1',
    userId: DEFAULT_USER_ID,
    title: 'Complete Machine Learning Course & Certification',
    description: 'Gain comprehensive mastery of deep learning foundations, transformer models, and real-world deployment.',
    category: 'Education',
    targetDate: getTodayString(35),
    progress: 65,
    status: 'In Progress',
    milestones: [
      { id: 'gm-1', goalId: 'goal-1', userId: DEFAULT_USER_ID, title: 'Foundations & backprop calculus', targetDate: getTodayString(-20), completed: true },
      { id: 'gm-2', goalId: 'goal-1', userId: DEFAULT_USER_ID, title: 'Convolutional & Sequence networks', targetDate: getTodayString(-5), completed: true },
      { id: 'gm-3', goalId: 'goal-1', userId: DEFAULT_USER_ID, title: 'Transformer attention implementation', targetDate: getTodayString(10), completed: false },
      { id: 'gm-4', goalId: 'goal-1', userId: DEFAULT_USER_ID, title: 'Deploy capstone production service', targetDate: getTodayString(35), completed: false },
    ],
    createdAt: getTodayString(-50),
    updatedAt: getTodayString(),
  },
  {
    id: 'goal-2',
    userId: DEFAULT_USER_ID,
    title: 'Launch FlowAI Productivity SaaS Beta',
    description: 'Ship polished, high-performance personal workspace web app with full scheduling, habit tracking, and focus modes.',
    category: 'Career',
    targetDate: getTodayString(14),
    progress: 80,
    status: 'In Progress',
    milestones: [
      { id: 'gm-21', goalId: 'goal-2', userId: DEFAULT_USER_ID, title: 'Interactive UX & Task Manager', targetDate: getTodayString(-10), completed: true },
      { id: 'gm-22', goalId: 'goal-2', userId: DEFAULT_USER_ID, title: 'Focus Pomodoro & Analytics Dashboard', targetDate: getTodayString(-2), completed: true },
      { id: 'gm-23', goalId: 'goal-2', userId: DEFAULT_USER_ID, title: 'Firestore schema and security rules hardening', targetDate: getTodayString(5), completed: false },
      { id: 'gm-24', goalId: 'goal-2', userId: DEFAULT_USER_ID, title: 'Public beta release and initial feedback loop', targetDate: getTodayString(14), completed: false },
    ],
    createdAt: getTodayString(-30),
    updatedAt: getTodayString(),
  },
  {
    id: 'goal-3',
    userId: DEFAULT_USER_ID,
    title: 'Run a Half Marathon under 1h 45m',
    description: 'Build aerobic capacity, weekly mileage volume, and functional mobility.',
    category: 'Health',
    targetDate: getTodayString(60),
    progress: 45,
    status: 'In Progress',
    milestones: [
      { id: 'gm-31', goalId: 'goal-3', userId: DEFAULT_USER_ID, title: 'Consistently hit 30km/week', targetDate: getTodayString(-15), completed: true },
      { id: 'gm-32', goalId: 'goal-3', userId: DEFAULT_USER_ID, title: 'Complete 16km long training run', targetDate: getTodayString(15), completed: false },
      { id: 'gm-33', goalId: 'goal-3', userId: DEFAULT_USER_ID, title: 'Official race day finish', targetDate: getTodayString(60), completed: false },
    ],
    createdAt: getTodayString(-40),
    updatedAt: getTodayString(),
  },
  {
    id: 'goal-4',
    userId: DEFAULT_USER_ID,
    title: 'Build 6-Month Emergency & Investment Reserve',
    description: 'Maintain liquid capital in high-yield vehicles to ensure peace of mind and flexibility.',
    category: 'Finance',
    targetDate: getTodayString(90),
    progress: 85,
    status: 'In Progress',
    milestones: [
      { id: 'gm-41', goalId: 'goal-4', userId: DEFAULT_USER_ID, title: '3-Month living expenses achieved', completed: true },
      { id: 'gm-42', goalId: 'goal-4', userId: DEFAULT_USER_ID, title: '6-Month capital threshold reached', completed: false },
    ],
    createdAt: getTodayString(-100),
    updatedAt: getTodayString(),
  },
];

const DEFAULT_HABITS: Habit[] = [
  {
    id: 'habit-1',
    userId: DEFAULT_USER_ID,
    name: 'Study & Deep Work',
    description: 'At least 60 minutes dedicated to deliberate technical learning without phone or tab distraction.',
    frequency: 'daily',
    targetDaysPerWeek: 6,
    currentStreak: 7,
    longestStreak: 21,
    category: 'Education',
    color: '#8b5cf6',
    completedDates: [
      getTodayString(-6),
      getTodayString(-5),
      getTodayString(-4),
      getTodayString(-3),
      getTodayString(-2),
      getTodayString(-1),
      getTodayString(0),
    ],
    createdAt: getTodayString(-30),
  },
  {
    id: 'habit-2',
    userId: DEFAULT_USER_ID,
    name: 'Exercise & Movement',
    description: 'Run, strength session, or high-pace recovery walk.',
    frequency: 'daily',
    targetDaysPerWeek: 5,
    currentStreak: 5,
    longestStreak: 18,
    category: 'Health',
    color: '#10b981',
    completedDates: [
      getTodayString(-4),
      getTodayString(-3),
      getTodayString(-2),
      getTodayString(-1),
      getTodayString(0),
    ],
    createdAt: getTodayString(-45),
  },
  {
    id: 'habit-3',
    userId: DEFAULT_USER_ID,
    name: 'Read 20 Pages',
    description: 'Books on engineering, philosophy, psychology, or biographies.',
    frequency: 'daily',
    targetDaysPerWeek: 7,
    currentStreak: 12,
    longestStreak: 30,
    category: 'Personal',
    color: '#f59e0b',
    completedDates: [
      getTodayString(-5),
      getTodayString(-4),
      getTodayString(-3),
      getTodayString(-2),
      getTodayString(-1),
    ],
    createdAt: getTodayString(-60),
  },
  {
    id: 'habit-4',
    userId: DEFAULT_USER_ID,
    name: 'Meditation & Breathwork',
    description: '10 minutes morning mindfulness breath practice.',
    frequency: 'daily',
    targetDaysPerWeek: 7,
    currentStreak: 4,
    longestStreak: 14,
    category: 'Health',
    color: '#06b6d4',
    completedDates: [
      getTodayString(-3),
      getTodayString(-2),
      getTodayString(-1),
      getTodayString(0),
    ],
    createdAt: getTodayString(-20),
  },
  {
    id: 'habit-5',
    userId: DEFAULT_USER_ID,
    name: 'Drink 2.5L Water',
    description: 'Hydrate consistently throughout morning and afternoon focus sessions.',
    frequency: 'daily',
    targetDaysPerWeek: 7,
    currentStreak: 9,
    longestStreak: 25,
    category: 'Health',
    color: '#3b82f6',
    completedDates: [
      getTodayString(-4),
      getTodayString(-3),
      getTodayString(-2),
      getTodayString(-1),
      getTodayString(0),
    ],
    createdAt: getTodayString(-50),
  },
  {
    id: 'habit-6',
    userId: DEFAULT_USER_ID,
    name: 'Practice Coding & Algorithms',
    description: 'Solve 1 algorithmic design challenge or commit to open-source repository.',
    frequency: 'daily',
    targetDaysPerWeek: 5,
    currentStreak: 6,
    longestStreak: 15,
    category: 'Career',
    color: '#ec4899',
    completedDates: [
      getTodayString(-5),
      getTodayString(-4),
      getTodayString(-3),
      getTodayString(-2),
      getTodayString(-1),
      getTodayString(0),
    ],
    createdAt: getTodayString(-40),
  },
];

const DEFAULT_CALENDAR_EVENTS: CalendarEvent[] = [
  {
    id: 'evt-1',
    userId: DEFAULT_USER_ID,
    title: 'Finish project documentation',
    description: 'Deep work block for API specs',
    startDate: getTodayString(0),
    startTime: '09:00',
    endTime: '10:00',
    allDay: false,
    type: 'task',
    color: '#3b82f6',
  },
  {
    id: 'evt-2',
    userId: DEFAULT_USER_ID,
    title: 'Study Deep Learning',
    description: 'Attention mechanisms and transformer layers',
    startDate: getTodayString(0),
    startTime: '11:00',
    endTime: '12:30',
    allDay: false,
    type: 'focus',
    color: '#8b5cf6',
  },
  {
    id: 'evt-3',
    userId: DEFAULT_USER_ID,
    title: 'Complete assignment',
    description: 'Raft protocol consensus lab submit deadline',
    startDate: getTodayString(0),
    startTime: '14:00',
    endTime: '16:00',
    allDay: false,
    type: 'deadline',
    color: '#ef4444',
  },
  {
    id: 'evt-4',
    userId: DEFAULT_USER_ID,
    title: 'Exercise & Zone 2 Cardio',
    startDate: getTodayString(0),
    startTime: '17:00',
    endTime: '18:00',
    allDay: false,
    type: 'habit',
    color: '#10b981',
  },
  {
    id: 'evt-5',
    userId: DEFAULT_USER_ID,
    title: 'Sprint Sync & Architecture Review',
    description: 'Bi-weekly engineering alignment',
    startDate: getTodayString(1),
    startTime: '10:00',
    endTime: '11:00',
    allDay: false,
    type: 'meeting',
    color: '#f59e0b',
  },
  {
    id: 'evt-6',
    userId: DEFAULT_USER_ID,
    title: 'FlowAI Platform v1.0 Soft Launch',
    description: 'Production container deploy & monitoring',
    startDate: getTodayString(12),
    startTime: '15:00',
    endTime: '16:00',
    allDay: false,
    type: 'deadline',
    color: '#ec4899',
  },
];

const DEFAULT_FOCUS_SESSIONS: FocusSession[] = [
  {
    id: 'fs-1',
    userId: DEFAULT_USER_ID,
    taskId: 'task-1',
    taskTitle: 'Finish project documentation & API specifications',
    sessionGoal: 'Finalize interface contracts and payload types',
    category: 'Engineering',
    durationMinutes: 50,
    type: 'pomodoro',
    completed: true,
    timestamp: `${getTodayString(0)}T09:50:00Z`,
  },
  {
    id: 'fs-2',
    userId: DEFAULT_USER_ID,
    taskId: 'task-2',
    taskTitle: 'Study Deep Learning & Transformer Self-Attention',
    sessionGoal: 'Derive key-value query attention matrix transformations',
    category: 'Education',
    durationMinutes: 45,
    type: 'pomodoro',
    completed: true,
    timestamp: `${getTodayString(-1)}T11:45:00Z`,
  },
  {
    id: 'fs-3',
    userId: DEFAULT_USER_ID,
    taskTitle: 'Code refactoring and modularization',
    sessionGoal: 'Isolate data repositories into clean abstraction',
    category: 'Engineering',
    durationMinutes: 60,
    type: 'custom',
    completed: true,
    timestamp: `${getTodayString(-1)}T15:00:00Z`,
  },
  {
    id: 'fs-4',
    userId: DEFAULT_USER_ID,
    taskTitle: 'Research competitive productivity tools',
    sessionGoal: 'Synthesize optimal visual hierarchy and minimal layout',
    category: 'Research',
    durationMinutes: 30,
    type: 'pomodoro',
    completed: true,
    timestamp: `${getTodayString(-2)}T16:30:00Z`,
  },
];

const DEFAULT_NOTES: Note[] = [
  {
    id: 'note-1',
    userId: DEFAULT_USER_ID,
    title: 'Transformer Architecture & Attention Intuitions',
    content: `# Attention Is All You Need Notes
- Query, Key, Value vectors are computed as linear projections of input embeddings.
- Scaled Dot-Product Attention: Attention(Q, K, V) = softmax(Q K^T / sqrt(d_k)) V
- Multi-Head Attention allows the model to jointly attend to information from different representation subspaces at different positions.
- Positional encodings (sinusoidal or RoPE) preserve sequence ordering without recurrent state.`,
    category: 'Machine Learning',
    tags: ['ai', 'transformers', 'deep-learning', 'math'],
    isPinned: true,
    summary: 'Core formulas and mechanisms for Multi-Head Scaled Dot-Product Attention in modern LLMs.',
    createdAt: getTodayString(-5),
    updatedAt: getTodayString(0),
  },
  {
    id: 'note-2',
    userId: DEFAULT_USER_ID,
    title: 'FlowAI Product Architecture & Future Agent Lifecycle',
    content: `# Agent Execution Pipeline
1. Ingest user goals, current tasks, deadlines, and booked calendar events.
2. Formulate scheduling constraints based on defined working hours (08:30 - 18:00).
3. Detect overlapping deadlines or overloaded days.
4. Recommend actionable, time-bounded daily plan.
5. Track completion in real-time and reschedule missed tasks adaptively.`,
    category: 'Architecture',
    tags: ['flowai', 'agent', 'architecture'],
    isPinned: true,
    summary: 'The 12-step autonomous workflow that the future AI Productivity Agent will follow.',
    createdAt: getTodayString(-8),
    updatedAt: getTodayString(-1),
  },
  {
    id: 'note-3',
    userId: DEFAULT_USER_ID,
    title: 'Weekly Workout & Zone 2 Protocol',
    content: `Weekly target: 150 minutes of Zone 2 cardio (HR 130-140 bpm) + 3 full-body resistance sessions.
- Monday: Legs & Core + 20 min cooldown
- Tuesday: 45 min Zone 2 run
- Thursday: Upper Body Hypertrophy
- Friday: Zone 2 cycle
- Saturday: Long trail run (10-15km)`,
    category: 'Health',
    tags: ['fitness', 'training', 'zone2'],
    isPinned: false,
    summary: 'Weekly endurance training and resistance routine.',
    createdAt: getTodayString(-12),
    updatedAt: getTodayString(-2),
  },
];

const DEFAULT_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    userId: DEFAULT_USER_ID,
    title: '3 tasks are due tomorrow',
    message: 'Review your upcoming deliverables and schedule focus blocks early.',
    type: 'deadline',
    read: false,
    createdAt: `${getTodayString(0)}T08:00:00Z`,
    link: 'tasks',
  },
  {
    id: 'notif-2',
    userId: DEFAULT_USER_ID,
    title: 'Your project deadline is approaching',
    message: 'FlowAI Platform v1.0 Launch has 2 milestones pending with 12 days remaining.',
    type: 'warning',
    read: false,
    createdAt: `${getTodayString(0)}T07:30:00Z`,
    link: 'projects',
  },
  {
    id: 'notif-3',
    userId: DEFAULT_USER_ID,
    title: 'You have maintained a 7-day habit streak!',
    message: 'Outstanding consistency on Study & Deep Work. Keep the momentum going.',
    type: 'streak',
    read: true,
    createdAt: `${getTodayString(-1)}T19:00:00Z`,
    link: 'habits',
  },
];

const DEFAULT_DAILY_REVIEWS: DailyReview[] = [
  {
    id: 'dr-1',
    userId: DEFAULT_USER_ID,
    date: getTodayString(-1),
    whatWentWell: 'Completed the core architecture for task management and maintained deep focus for 105 minutes uninterrupted.',
    whatToImprove: 'Start the afternoon focus session earlier to prevent evening deadline rush.',
    tasksCompletedCount: 4,
    tasksRemainingCount: 2,
    focusMinutes: 105,
    habitsCompletedCount: 5,
    productivityRating: 5,
    createdAt: `${getTodayString(-1)}T21:00:00Z`,
  },
  {
    id: 'dr-2',
    userId: DEFAULT_USER_ID,
    date: getTodayString(-2),
    whatWentWell: 'High energy during morning deep work. Finished all project documentation drafts.',
    whatToImprove: 'Remember to take a 5-minute stretch break between Pomodoro sessions.',
    tasksCompletedCount: 3,
    tasksRemainingCount: 3,
    focusMinutes: 90,
    habitsCompletedCount: 4,
    productivityRating: 4,
    createdAt: `${getTodayString(-2)}T21:30:00Z`,
  },
];

const DEFAULT_WEEKLY_REVIEWS: WeeklyReview[] = [
  {
    id: 'wr-1',
    userId: DEFAULT_USER_ID,
    weekIdentifier: '2026-W39',
    startDate: getTodayString(-7),
    endDate: getTodayString(-1),
    totalTasksCompleted: 18,
    totalFocusHours: 14.5,
    goalProgressSummary: 'Advanced Machine Learning course by 15% and finalized beta product specs.',
    habitConsistencyRate: 91,
    overdueTasksCount: 1,
    keyWins: 'Consistently logged focus sessions every weekday. Maintained study habit for 7 consecutive days.',
    nextWeekPriorities: 'Execute Raft consensus lab, wrap up UI components, and verify all responsive views.',
    createdAt: `${getTodayString(-1)}T22:00:00Z`,
  },
];

type Listener = () => void;

class DataService {
  private listeners: Set<Listener> = new Set();

  private get<T>(key: string, defaultValue: T): T {
    try {
      const data = localStorage.getItem(key);
      if (!data) return defaultValue;
      return JSON.parse(data) as T;
    } catch {
      return defaultValue;
    }
  }

  private set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      this.notifyListeners();
    } catch (e) {
      console.error(`Error saving key ${key} to localStorage:`, e);
    }
  }

  public subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notifyListeners(): void {
    this.listeners.forEach((fn) => fn());
  }

  // --- Profile & User ---
  public getProfile(): UserProfile {
    return this.get<UserProfile>(STORAGE_KEYS.PROFILE, DEFAULT_PROFILE);
  }

  public updateProfile(updates: Partial<UserProfile>): UserProfile {
    const current = this.getProfile();
    const updated = { ...current, ...updates, updatedAt: new Date().toISOString() };
    this.set(STORAGE_KEYS.PROFILE, updated);
    return updated;
  }

  // --- Tasks ---
  public getTasks(): Task[] {
    return this.get<Task[]>(STORAGE_KEYS.TASKS, DEFAULT_TASKS);
  }

  public getTaskById(id: string): Task | undefined {
    return this.getTasks().find((t) => t.id === id);
  }

  public addTask(taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'userId'>): Task {
    const profile = this.getProfile();
    const newTask: Task = {
      ...taskData,
      id: `task-${Date.now()}`,
      userId: profile.userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const list = [newTask, ...this.getTasks()];
    this.set(STORAGE_KEYS.TASKS, list);
    return newTask;
  }

  public updateTask(id: string, updates: Partial<Task>): Task | null {
    const list = this.getTasks();
    const index = list.findIndex((t) => t.id === id);
    if (index === -1) return null;

    const updated: Task = {
      ...list[index],
      ...updates,
      updatedAt: new Date().toISOString(),
      completedAt: updates.status === 'Completed' ? new Date().toISOString() : updates.status ? undefined : list[index].completedAt,
    };
    list[index] = updated;
    this.set(STORAGE_KEYS.TASKS, list);
    return updated;
  }

  public deleteTask(id: string): boolean {
    const list = this.getTasks();
    const filtered = list.filter((t) => t.id !== id);
    if (filtered.length === list.length) return false;
    this.set(STORAGE_KEYS.TASKS, filtered);
    return true;
  }

  public duplicateTask(id: string): Task | null {
    const task = this.getTaskById(id);
    if (!task) return null;
    return this.addTask({
      title: `${task.title} (Copy)`,
      description: task.description,
      dueDate: task.dueDate,
      dueTime: task.dueTime,
      priority: task.priority,
      category: task.category,
      projectId: task.projectId,
      estimatedDuration: task.estimatedDuration,
      status: 'Todo',
      tags: [...task.tags],
    });
  }

  // --- Projects ---
  public getProjects(): Project[] {
    return this.get<Project[]>(STORAGE_KEYS.PROJECTS, DEFAULT_PROJECTS);
  }

  public getProjectById(id: string): Project | undefined {
    return this.getProjects().find((p) => p.id === id);
  }

  public addProject(data: Omit<Project, 'id' | 'createdAt' | 'updatedAt' | 'userId'>): Project {
    const profile = this.getProfile();
    const newProj: Project = {
      ...data,
      id: `proj-${Date.now()}`,
      userId: profile.userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const list = [newProj, ...this.getProjects()];
    this.set(STORAGE_KEYS.PROJECTS, list);
    return newProj;
  }

  public updateProject(id: string, updates: Partial<Project>): Project | null {
    const list = this.getProjects();
    const index = list.findIndex((p) => p.id === id);
    if (index === -1) return null;

    list[index] = { ...list[index], ...updates, updatedAt: new Date().toISOString() };
    this.set(STORAGE_KEYS.PROJECTS, list);
    return list[index];
  }

  public deleteProject(id: string): boolean {
    const list = this.getProjects();
    const filtered = list.filter((p) => p.id !== id);
    if (filtered.length === list.length) return false;
    this.set(STORAGE_KEYS.PROJECTS, filtered);
    return true;
  }

  // --- Goals ---
  public getGoals(): Goal[] {
    return this.get<Goal[]>(STORAGE_KEYS.GOALS, DEFAULT_GOALS);
  }

  public addGoal(data: Omit<Goal, 'id' | 'createdAt' | 'updatedAt' | 'userId'>): Goal {
    const profile = this.getProfile();
    const newGoal: Goal = {
      ...data,
      id: `goal-${Date.now()}`,
      userId: profile.userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const list = [newGoal, ...this.getGoals()];
    this.set(STORAGE_KEYS.GOALS, list);
    return newGoal;
  }

  public updateGoal(id: string, updates: Partial<Goal>): Goal | null {
    const list = this.getGoals();
    const index = list.findIndex((g) => g.id === id);
    if (index === -1) return null;

    list[index] = { ...list[index], ...updates, updatedAt: new Date().toISOString() };
    this.set(STORAGE_KEYS.GOALS, list);
    return list[index];
  }

  public deleteGoal(id: string): boolean {
    const list = this.getGoals();
    const filtered = list.filter((g) => g.id !== id);
    if (filtered.length === list.length) return false;
    this.set(STORAGE_KEYS.GOALS, filtered);
    return true;
  }

  // --- Habits ---
  public getHabits(): Habit[] {
    return this.get<Habit[]>(STORAGE_KEYS.HABITS, DEFAULT_HABITS);
  }

  public toggleHabitCompletion(habitId: string, date: string): Habit | null {
    const list = this.getHabits();
    const habit = list.find((h) => h.id === habitId);
    if (!habit) return null;

    const exists = habit.completedDates.includes(date);
    let newDates: string[];
    if (exists) {
      newDates = habit.completedDates.filter((d) => d !== date);
    } else {
      newDates = [...habit.completedDates, date].sort();
    }

    // calculate current streak roughly
    let streak = 0;
    const checkDate = new Date();
    // if today is done, count backward
    const todayStr = getTodayString(0);
    const yesterdayStr = getTodayString(-1);

    if (newDates.includes(todayStr) || newDates.includes(yesterdayStr)) {
      let pointer = new Date();
      if (!newDates.includes(todayStr) && newDates.includes(yesterdayStr)) {
        pointer.setDate(pointer.getDate() - 1);
      }
      while (true) {
        const dStr = pointer.toISOString().split('T')[0];
        if (newDates.includes(dStr)) {
          streak++;
          pointer.setDate(pointer.getDate() - 1);
        } else {
          break;
        }
      }
    }

    habit.completedDates = newDates;
    habit.currentStreak = streak;
    habit.longestStreak = Math.max(habit.longestStreak, streak);

    this.set(STORAGE_KEYS.HABITS, list);
    return habit;
  }

  public addHabit(data: Omit<Habit, 'id' | 'createdAt' | 'userId' | 'currentStreak' | 'longestStreak' | 'completedDates'>): Habit {
    const profile = this.getProfile();
    const newHabit: Habit = {
      ...data,
      id: `habit-${Date.now()}`,
      userId: profile.userId,
      currentStreak: 0,
      longestStreak: 0,
      completedDates: [],
      createdAt: new Date().toISOString(),
    };
    const list = [...this.getHabits(), newHabit];
    this.set(STORAGE_KEYS.HABITS, list);
    return newHabit;
  }

  public deleteHabit(id: string): boolean {
    const list = this.getHabits();
    const filtered = list.filter((h) => h.id !== id);
    if (filtered.length === list.length) return false;
    this.set(STORAGE_KEYS.HABITS, filtered);
    return true;
  }

  // --- Calendar Events ---
  public getCalendarEvents(): CalendarEvent[] {
    return this.get<CalendarEvent[]>(STORAGE_KEYS.CALENDAR, DEFAULT_CALENDAR_EVENTS);
  }

  public addCalendarEvent(data: Omit<CalendarEvent, 'id' | 'userId'>): CalendarEvent {
    const profile = this.getProfile();
    const newEvt: CalendarEvent = {
      ...data,
      id: `evt-${Date.now()}`,
      userId: profile.userId,
    };
    const list = [...this.getCalendarEvents(), newEvt];
    this.set(STORAGE_KEYS.CALENDAR, list);
    return newEvt;
  }

  public deleteCalendarEvent(id: string): boolean {
    const list = this.getCalendarEvents();
    const filtered = list.filter((e) => e.id !== id);
    if (filtered.length === list.length) return false;
    this.set(STORAGE_KEYS.CALENDAR, filtered);
    return true;
  }

  // --- Focus Sessions ---
  public getFocusSessions(): FocusSession[] {
    return this.get<FocusSession[]>(STORAGE_KEYS.FOCUS, DEFAULT_FOCUS_SESSIONS);
  }

  public logFocusSession(data: Omit<FocusSession, 'id' | 'userId' | 'timestamp'>): FocusSession {
    const profile = this.getProfile();
    const newSession: FocusSession = {
      ...data,
      id: `fs-${Date.now()}`,
      userId: profile.userId,
      timestamp: new Date().toISOString(),
    };
    const list = [newSession, ...this.getFocusSessions()];
    this.set(STORAGE_KEYS.FOCUS, list);
    return newSession;
  }

  // --- Notes ---
  public getNotes(): Note[] {
    return this.get<Note[]>(STORAGE_KEYS.NOTES, DEFAULT_NOTES);
  }

  public addNote(data: Omit<Note, 'id' | 'createdAt' | 'updatedAt' | 'userId'>): Note {
    const profile = this.getProfile();
    const newNote: Note = {
      ...data,
      id: `note-${Date.now()}`,
      userId: profile.userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const list = [newNote, ...this.getNotes()];
    this.set(STORAGE_KEYS.NOTES, list);
    return newNote;
  }

  public updateNote(id: string, updates: Partial<Note>): Note | null {
    const list = this.getNotes();
    const index = list.findIndex((n) => n.id === id);
    if (index === -1) return null;

    list[index] = { ...list[index], ...updates, updatedAt: new Date().toISOString() };
    this.set(STORAGE_KEYS.NOTES, list);
    return list[index];
  }

  public deleteNote(id: string): boolean {
    const list = this.getNotes();
    const filtered = list.filter((n) => n.id !== id);
    if (filtered.length === list.length) return false;
    this.set(STORAGE_KEYS.NOTES, filtered);
    return true;
  }

  // --- Notifications ---
  public getNotifications(): NotificationItem[] {
    return this.get<NotificationItem[]>(STORAGE_KEYS.NOTIFICATIONS, DEFAULT_NOTIFICATIONS);
  }

  public markNotificationAsRead(id: string): void {
    const list = this.getNotifications();
    const index = list.findIndex((n) => n.id === id);
    if (index !== -1) {
      list[index].read = true;
      this.set(STORAGE_KEYS.NOTIFICATIONS, list);
    }
  }

  public markAllNotificationsAsRead(): void {
    const list = this.getNotifications().map((n) => ({ ...n, read: true }));
    this.set(STORAGE_KEYS.NOTIFICATIONS, list);
  }

  public clearNotifications(): void {
    this.set(STORAGE_KEYS.NOTIFICATIONS, []);
  }

  // --- Reviews ---
  public getDailyReviews(): DailyReview[] {
    return this.get<DailyReview[]>(STORAGE_KEYS.DAILY_REVIEWS, DEFAULT_DAILY_REVIEWS);
  }

  public saveDailyReview(data: Omit<DailyReview, 'id' | 'userId' | 'createdAt'>): DailyReview {
    const profile = this.getProfile();
    const list = this.getDailyReviews();
    const existingIndex = list.findIndex((r) => r.date === data.date);

    const review: DailyReview = {
      ...data,
      id: existingIndex !== -1 ? list[existingIndex].id : `dr-${Date.now()}`,
      userId: profile.userId,
      createdAt: new Date().toISOString(),
    };

    if (existingIndex !== -1) {
      list[existingIndex] = review;
    } else {
      list.unshift(review);
    }
    this.set(STORAGE_KEYS.DAILY_REVIEWS, list);
    return review;
  }

  public getWeeklyReviews(): WeeklyReview[] {
    return this.get<WeeklyReview[]>(STORAGE_KEYS.WEEKLY_REVIEWS, DEFAULT_WEEKLY_REVIEWS);
  }

  public saveWeeklyReview(data: Omit<WeeklyReview, 'id' | 'userId' | 'createdAt'>): WeeklyReview {
    const profile = this.getProfile();
    const list = this.getWeeklyReviews();
    const existingIndex = list.findIndex((r) => r.weekIdentifier === data.weekIdentifier);

    const review: WeeklyReview = {
      ...data,
      id: existingIndex !== -1 ? list[existingIndex].id : `wr-${Date.now()}`,
      userId: profile.userId,
      createdAt: new Date().toISOString(),
    };

    if (existingIndex !== -1) {
      list[existingIndex] = review;
    } else {
      list.unshift(review);
    }
    this.set(STORAGE_KEYS.WEEKLY_REVIEWS, list);
    return review;
  }

  // --- Calculated Productivity Score ---
  public calculateProductivityScore(): { score: number; breakdown: { tasks: number; focus: number; habits: number; goals: number } } {
    const tasks = this.getTasks();
    const completedTasks = tasks.filter((t) => t.status === 'Completed').length;
    const taskScore = Math.min(30, completedTasks * 6);

    const focus = this.getFocusSessions();
    const totalMinutes = focus.reduce((acc, s) => (s.completed ? acc + s.durationMinutes : acc), 0);
    const focusScore = Math.min(30, Math.round((totalMinutes / 120) * 30));

    const habits = this.getHabits();
    const todayStr = getTodayString(0);
    const doneToday = habits.filter((h) => h.completedDates.includes(todayStr)).length;
    const habitScore = habits.length > 0 ? Math.round((doneToday / habits.length) * 25) : 20;

    const goals = this.getGoals();
    const avgGoalProgress = goals.length > 0 ? goals.reduce((a, g) => a + g.progress, 0) / goals.length : 50;
    const goalScore = Math.round((avgGoalProgress / 100) * 15);

    const total = Math.min(100, Math.max(35, taskScore + focusScore + habitScore + goalScore));
    return {
      score: total,
      breakdown: {
        tasks: taskScore,
        focus: focusScore,
        habits: habitScore,
        goals: goalScore,
      },
    };
  }

  // Reset demo data helper
  public resetToDefaults(): void {
    localStorage.removeItem(STORAGE_KEYS.PROFILE);
    localStorage.removeItem(STORAGE_KEYS.TASKS);
    localStorage.removeItem(STORAGE_KEYS.PROJECTS);
    localStorage.removeItem(STORAGE_KEYS.GOALS);
    localStorage.removeItem(STORAGE_KEYS.CALENDAR);
    localStorage.removeItem(STORAGE_KEYS.HABITS);
    localStorage.removeItem(STORAGE_KEYS.FOCUS);
    localStorage.removeItem(STORAGE_KEYS.NOTES);
    localStorage.removeItem(STORAGE_KEYS.NOTIFICATIONS);
    localStorage.removeItem(STORAGE_KEYS.DAILY_REVIEWS);
    localStorage.removeItem(STORAGE_KEYS.WEEKLY_REVIEWS);
    this.notifyListeners();
  }
}

export const dataService = new DataService();
