import { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CalendarIcon, Flame, Target, Trophy, TrendingUp } from 'lucide-react';
import { format, parseISO, isToday } from 'date-fns';
import { Todo } from '@/types/todo';
import { useStreak } from '@/hooks/useStreak';
import { cn } from '@/lib/utils';

interface CalendarViewProps {
  todos: Todo[];
}

export function CalendarView({ todos }: CalendarViewProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const streakData = useStreak(todos);

  const getDayData = (date: Date) => {
    const dateKey = format(date, 'yyyy-MM-dd');
    return streakData.dayRecords.find(record => record.date === dateKey);
  };

  const getSelectedDateTodos = () => {
    if (!selectedDate) return [];
    const dateKey = format(selectedDate, 'yyyy-MM-dd');
    return todos.filter(todo => format(todo.createdAt, 'yyyy-MM-dd') === dateKey);
  };

  const selectedDateData = selectedDate ? getDayData(selectedDate) : null;
  const selectedDateTodos = getSelectedDateTodos();

  if (!isOpen) {
    return (
      <div className="space-y-4">
        {/* Streak Stats */}
        <Card className="border-primary/20 shadow-card">
          <CardContent className="p-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Flame className="w-5 h-5 text-orange-500" />
                </div>
                <div className="text-2xl font-bold text-orange-500">{streakData.currentStreak}</div>
                <div className="text-xs text-muted-foreground">Current Streak</div>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Trophy className="w-5 h-5 text-amber-500" />
                </div>
                <div className="text-2xl font-bold text-amber-500">{streakData.longestStreak}</div>
                <div className="text-xs text-muted-foreground">Best Streak</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Button
          onClick={() => setIsOpen(true)}
          variant="outline"
          className="w-full h-12 text-base font-medium border-primary/20 hover:bg-primary/5"
        >
          <CalendarIcon className="w-5 h-5 mr-2" />
          View Calendar & Streak
        </Button>
      </div>
    );
  }

  return (
    <Card className="border-primary/20 shadow-card animate-scale-in">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-primary" />
            Progress Calendar
          </div>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setIsOpen(false)}
            className="text-xs"
          >
            Close
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Streak Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center p-3 bg-orange-500/10 rounded-lg">
            <div className="flex items-center justify-center mb-1">
              <Flame className="w-4 h-4 text-orange-500" />
            </div>
            <div className="text-lg font-bold text-orange-500">{streakData.currentStreak}</div>
            <div className="text-xs text-muted-foreground">Streak</div>
          </div>
          
          <div className="text-center p-3 bg-amber-500/10 rounded-lg">
            <div className="flex items-center justify-center mb-1">
              <Trophy className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-lg font-bold text-amber-500">{streakData.longestStreak}</div>
            <div className="text-xs text-muted-foreground">Best</div>
          </div>
          
          <div className="text-center p-3 bg-green-500/10 rounded-lg">
            <div className="flex items-center justify-center mb-1">
              <Target className="w-4 h-4 text-green-500" />
            </div>
            <div className="text-lg font-bold text-green-500">50%</div>
            <div className="text-xs text-muted-foreground">Goal</div>
          </div>
        </div>

        {/* Calendar */}
        <div className="flex justify-center">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            className="rounded-md border border-border/50 pointer-events-auto"
            modifiers={{
              streakDay: (date) => {
                const dayData = getDayData(date);
                return dayData?.isStreakDay || false;
              },
              today: (date) => isToday(date)
            }}
            modifiersStyles={{
              streakDay: {
                backgroundColor: 'hsl(var(--primary))',
                color: 'hsl(var(--primary-foreground))',
                fontWeight: 'bold'
              }
            }}
          />
        </div>

        {/* Selected Date Info */}
        {selectedDate && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-sm">
                {format(selectedDate, 'EEEE, MMMM d, yyyy')}
              </h4>
              {selectedDateData?.isStreakDay && (
                <Badge variant="secondary" className="bg-primary/10 text-primary">
                  <Flame className="w-3 h-3 mr-1" />
                  Streak Day
                </Badge>
              )}
            </div>
            
            {selectedDateData ? (
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2 bg-muted/30 rounded">
                  <div className="text-sm font-bold">{selectedDateData.totalTodos}</div>
                  <div className="text-xs text-muted-foreground">Total</div>
                </div>
                <div className="p-2 bg-muted/30 rounded">
                  <div className="text-sm font-bold text-success">{selectedDateData.completedTodos}</div>
                  <div className="text-xs text-muted-foreground">Done</div>
                </div>
                <div className="p-2 bg-muted/30 rounded">
                  <div className={cn(
                    "text-sm font-bold",
                    selectedDateData.completionRate >= 50 ? "text-success" : "text-muted-foreground"
                  )}>
                    {Math.round(selectedDateData.completionRate)}%
                  </div>
                  <div className="text-xs text-muted-foreground">Rate</div>
                </div>
              </div>
            ) : (
              <div className="text-center py-4 text-muted-foreground">
                <Target className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No todos on this day</p>
              </div>
            )}

            {/* Todos for selected date */}
            {selectedDateTodos.length > 0 && (
              <div className="space-y-2">
                <h5 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Todos ({selectedDateTodos.length})
                </h5>
                <div className="space-y-1 max-h-32 overflow-y-auto">
                  {selectedDateTodos.map(todo => (
                    <div key={todo.id} className="flex items-center gap-2 p-2 bg-muted/20 rounded text-xs">
                      <div className={cn(
                        "w-2 h-2 rounded-full flex-shrink-0",
                        todo.completed ? "bg-success" : "bg-muted-foreground"
                      )} />
                      <span className={cn(
                        "flex-1 truncate",
                        todo.completed && "line-through text-muted-foreground"
                      )}>
                        {todo.title}
                      </span>
                      <Badge 
                        variant="outline" 
                        className={cn(
                          "text-xs px-1 py-0",
                          todo.priority === 'high' && "border-red-300 text-red-600",
                          todo.priority === 'medium' && "border-orange-300 text-orange-600",
                          todo.priority === 'low' && "border-blue-300 text-blue-600"
                        )}
                      >
                        {todo.priority}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}