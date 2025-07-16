import { useState } from 'react';
import { History, Calendar, CheckCircle, Clock, TrendingUp } from 'lucide-react';
import { Todo } from '@/types/todo';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface TodoHistoryProps {
  todos: Todo[];
}

export function TodoHistory({ todos }: TodoHistoryProps) {
  const [isOpen, setIsOpen] = useState(false);

  const completedTodos = todos.filter(todo => todo.completed);
  const todayCompleted = completedTodos.filter(todo => {
    const today = new Date();
    const todoDate = todo.completedAt;
    return todoDate && 
           todoDate.toDateString() === today.toDateString();
  });

  const thisWeekCompleted = completedTodos.filter(todo => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return todo.completedAt && todo.completedAt >= weekAgo;
  });

  const getCompletionRate = () => {
    if (todos.length === 0) return 0;
    return Math.round((completedTodos.length / todos.length) * 100);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        variant="outline"
        className="w-full h-12 text-base font-medium border-primary/20 hover:bg-primary/5"
      >
        <History className="w-5 h-5 mr-2" />
        View History ({completedTodos.length} completed)
      </Button>
    );
  }

  return (
    <Card className="border-primary/20 shadow-card animate-scale-in">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-primary" />
            Todo History
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
        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center p-3 bg-success/10 rounded-lg">
            <div className="flex items-center justify-center mb-1">
              <CheckCircle className="w-4 h-4 text-success" />
            </div>
            <div className="text-lg font-bold text-success">{todayCompleted.length}</div>
            <div className="text-xs text-muted-foreground">Today</div>
          </div>
          
          <div className="text-center p-3 bg-primary/10 rounded-lg">
            <div className="flex items-center justify-center mb-1">
              <Calendar className="w-4 h-4 text-primary" />
            </div>
            <div className="text-lg font-bold text-primary">{thisWeekCompleted.length}</div>
            <div className="text-xs text-muted-foreground">This Week</div>
          </div>
          
          <div className="text-center p-3 bg-accent/10 rounded-lg">
            <div className="flex items-center justify-center mb-1">
              <TrendingUp className="w-4 h-4 text-accent" />
            </div>
            <div className="text-lg font-bold text-accent">{getCompletionRate()}%</div>
            <div className="text-xs text-muted-foreground">Complete</div>
          </div>
        </div>

        {/* Recent completions */}
        <div>
          <h4 className="font-medium text-sm mb-3 flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Recent Completions
          </h4>
          
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {completedTodos
              .sort((a, b) => (b.completedAt?.getTime() || 0) - (a.completedAt?.getTime() || 0))
              .slice(0, 10)
              .map((todo) => (
                <div 
                  key={todo.id}
                  className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                >
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm truncate">{todo.title}</div>
                    <div className="text-xs text-muted-foreground">
                      {todo.completedAt && formatDate(todo.completedAt)}
                    </div>
                  </div>
                  
                  <div className={cn(
                    "px-2 py-1 rounded-full text-xs font-medium",
                    todo.priority === 'high' && "bg-red-100 text-red-700",
                    todo.priority === 'medium' && "bg-orange-100 text-orange-700",
                    todo.priority === 'low' && "bg-blue-100 text-blue-700"
                  )}>
                    {todo.priority}
                  </div>
                </div>
              ))}
            
            {completedTodos.length === 0 && (
              <div className="text-center py-6 text-muted-foreground">
                <CheckCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No completed todos yet</p>
                <p className="text-xs">Start checking off your tasks!</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}