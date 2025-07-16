export interface DayRecord {
  date: string; // YYYY-MM-DD format
  totalTodos: number;
  completedTodos: number;
  completionRate: number;
  isStreakDay: boolean; // true if completion rate >= 50%
}

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastStreakDate: string | null;
  dayRecords: DayRecord[];
}