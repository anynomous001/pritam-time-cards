import { useState, useEffect } from 'react';
import { format, parseISO, isToday, subDays, isSameDay } from 'date-fns';
import { Todo } from '@/types/todo';
import { StreakData, DayRecord } from '@/types/streak';

export function useStreak(todos: Todo[]) {
  const [streakData, setStreakData] = useState<StreakData>({
    currentStreak: 0,
    longestStreak: 0,
    lastStreakDate: null,
    dayRecords: []
  });

  // Load streak data from localStorage
  useEffect(() => {
    const savedStreak = localStorage.getItem('pritam-streak-data');
    if (savedStreak) {
      setStreakData(JSON.parse(savedStreak));
    }
  }, []);

  // Calculate and update streak data when todos change
  useEffect(() => {
    const newStreakData = calculateStreakData(todos, streakData);
    setStreakData(newStreakData);
    localStorage.setItem('pritam-streak-data', JSON.stringify(newStreakData));
  }, [todos]);

  return streakData;
}

function calculateStreakData(todos: Todo[], currentData: StreakData): StreakData {
  // Group todos by day
  const todosByDay = new Map<string, { total: number; completed: number }>();
  
  todos.forEach(todo => {
    const dateKey = format(todo.createdAt, 'yyyy-MM-dd');
    if (!todosByDay.has(dateKey)) {
      todosByDay.set(dateKey, { total: 0, completed: 0 });
    }
    const dayData = todosByDay.get(dateKey)!;
    dayData.total++;
    if (todo.completed) {
      dayData.completed++;
    }
  });

  // Create day records
  const dayRecords: DayRecord[] = [];
  const today = new Date();
  
  // Check last 30 days
  for (let i = 29; i >= 0; i--) {
    const date = subDays(today, i);
    const dateKey = format(date, 'yyyy-MM-dd');
    const dayData = todosByDay.get(dateKey) || { total: 0, completed: 0 };
    
    const completionRate = dayData.total > 0 ? (dayData.completed / dayData.total) * 100 : 0;
    const isStreakDay = dayData.total > 0 && completionRate >= 50;
    
    dayRecords.push({
      date: dateKey,
      totalTodos: dayData.total,
      completedTodos: dayData.completed,
      completionRate,
      isStreakDay
    });
  }

  // Calculate current streak
  let currentStreak = 0;
  let longestStreak = currentData.longestStreak;
  let lastStreakDate = currentData.lastStreakDate;
  
  // Calculate current streak from today backwards
  for (let i = dayRecords.length - 1; i >= 0; i--) {
    if (dayRecords[i].isStreakDay) {
      currentStreak++;
      if (!lastStreakDate || parseISO(dayRecords[i].date) > parseISO(lastStreakDate)) {
        lastStreakDate = dayRecords[i].date;
      }
    } else {
      break;
    }
  }

  // Calculate longest streak in the period
  let tempStreak = 0;
  dayRecords.forEach(record => {
    if (record.isStreakDay) {
      tempStreak++;
      longestStreak = Math.max(longestStreak, tempStreak);
    } else {
      tempStreak = 0;
    }
  });

  return {
    currentStreak,
    longestStreak,
    lastStreakDate,
    dayRecords
  };
}