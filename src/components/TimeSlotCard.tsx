import { useDroppable } from '@dnd-kit/core';
import { TodoCard } from './TodoCard';
import { Todo } from '@/types/todo';
import { cn } from '@/lib/utils';

interface TimeSlotProps {
  time: string;
  hour: number;
  todos: Todo[];
  onToggleComplete: (todoId: string) => void;
}

export function TimeSlotCard({ time, hour, todos, onToggleComplete }: TimeSlotProps) {
  const { isOver, setNodeRef } = useDroppable({
    id: time,
  });

  const formatTime = (hour: number) => {
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${displayHour}:00 ${period}`;
  };

  const getTimeSlotClass = () => {
    const now = new Date();
    const currentHour = now.getHours();
    
    if (hour === currentHour) {
      return "bg-gradient-primary text-primary-foreground shadow-lg";
    }
    if (hour < currentHour) {
      return "bg-muted/50 text-muted-foreground";
    }
    return "bg-card/80 backdrop-blur-sm";
  };

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "p-4 rounded-lg border transition-all duration-300",
        "min-h-[120px] relative",
        isOver && "ring-2 ring-primary ring-offset-2 bg-primary/5",
        getTimeSlotClass()
      )}
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-medium text-sm">
          {formatTime(hour)}
        </h3>
        <span className="text-xs opacity-70">
          {todos.length} task{todos.length !== 1 ? 's' : ''}
        </span>
      </div>
      
      <div className="space-y-2">
        {todos.map((todo) => (
          <TodoCard 
            key={todo.id} 
            todo={todo} 
            onToggleComplete={onToggleComplete}
          />
        ))}
        
        {todos.length === 0 && (
          <div className={cn(
            "flex items-center justify-center h-16 border-2 border-dashed rounded-lg",
            "text-muted-foreground text-sm transition-all",
            isOver ? "border-primary bg-primary/5" : "border-muted"
          )}>
            Drop todos here
          </div>
        )}
      </div>
    </div>
  );
}