/**
 * AI Service Interface & Architecture Definition
 *
 * NOTE: DO NOT connect to an AI model yet.
 * This file defines the integration contracts, prompt templates, and
 * interfaces for the future LLM coordination layer (e.g. Gemini 2.5 Flash / Pro).
 */

import { Task, Goal, CalendarEvent, Habit, FocusSession, DailyReview, WeeklyReview } from '../types';

export interface AIContextSnapshot {
  userGoals: Goal[];
  userTasks: Task[];
  calendarEvents: CalendarEvent[];
  habits: Habit[];
  recentFocusSessions: FocusSession[];
  workingHours: {
    start: string;
    end: string;
  };
  todayDate: string;
}

export interface AIGoalDecompositionResult {
  goalId?: string;
  proposedTasks: Array<{
    title: string;
    description: string;
    estimatedDuration: number;
    priority: 'Low' | 'Medium' | 'High' | 'Urgent';
    category: string;
    suggestedDueDate: string;
    order: number;
  }>;
  milestones: Array<{
    title: string;
    targetDate: string;
  }>;
  confidenceScore: number;
  reasoning: string;
}

export interface AIScheduleRecommendation {
  taskId: string;
  recommendedSlot: {
    date: string;
    startTime: string;
    endTime: string;
  };
  reason: string;
  conflictDetected: boolean;
}

export interface AISummaryResult {
  summary: string;
  highlights: string[];
  blockersIdentified: string[];
  recommendedFocusForTomorrow: string[];
}

export interface AIServiceStatus {
  isConfigured: boolean;
  modelTarget: string;
  statusMessage: string;
  readyForIntegration: boolean;
}

class AIService {
  private readonly modelTarget = 'gemini-2.5-flash';
  private readonly isAgentEnabled = false;

  public getStatus(): AIServiceStatus {
    return {
      isConfigured: false,
      modelTarget: this.modelTarget,
      statusMessage: 'AI Productivity Agent — Ready for integration. No active model connection.',
      readyForIntegration: true,
    };
  }

  /**
   * Placeholder: Understand user natural language prompt and extract intent
   */
  public async parseUserIntent(prompt: string): Promise<{
    intent: 'plan_day' | 'break_goal' | 'schedule_task' | 'reschedule' | 'review' | 'general_query';
    entities: Record<string, unknown>;
    rawPrompt: string;
  }> {
    // Placeholder - will connect to Gemini model once approved
    return {
      intent: 'plan_day',
      entities: { input: prompt },
      rawPrompt: prompt,
    };
  }

  /**
   * Placeholder: Generate text completion or synthesis
   */
  public async generateSummary(
    context: AIContextSnapshot,
    instructions: string
  ): Promise<AISummaryResult> {
    // Placeholder response
    return {
      summary: 'AI summarization integration pending. Once connected, this will analyze your daily velocity and milestones.',
      highlights: ['Consistent focus time logged', 'Key tasks progressed'],
      blockersIdentified: [],
      recommendedFocusForTomorrow: ['Tackle high priority deadlines early'],
    };
  }

  /**
   * Placeholder: Decompose high-level goal into actionable tasks
   */
  public async decomposeGoal(
    goal: Goal,
    context: AIContextSnapshot
  ): Promise<AIGoalDecompositionResult> {
    return {
      goalId: goal.id,
      proposedTasks: [
        {
          title: `Initial research & scoping for: ${goal.title}`,
          description: 'Define milestones and technical prerequisites.',
          estimatedDuration: 45,
          priority: 'High',
          category: goal.category,
          suggestedDueDate: goal.targetDate,
          order: 1,
        },
      ],
      milestones: [
        {
          title: 'Milestone 1: Fundamentals Complete',
          targetDate: goal.targetDate,
        },
      ],
      confidenceScore: 0.95,
      reasoning: 'Decomposition template prepared for future AI engine.',
    };
  }
}

export const aiService = new AIService();
