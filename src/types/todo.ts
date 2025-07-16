export interface Todo {
  id: string;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
  createdAt: Date;
  completedAt?: Date;
  timeSlot?: string; // e.g., "09:00" for 9 AM
  estimatedDuration?: number; // in minutes
}

export interface TimeSlot {
  time: string;
  hour: number;
  todos: Todo[];
}