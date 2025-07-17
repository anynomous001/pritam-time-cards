import { useDraggable } from '@dnd-kit/core';
import { Check, Clock, Flag } from 'lucide-react';
import { Todo } from '@/types/todo';
import { cn } from '@/lib/utils';

interface TodoCardProps {
  todo: Todo;
  onToggleComplete: (todoId: string) => void;
}

export function TodoCard({ todo, onToggleComplete }: TodoCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
  } = useDraggable({
    id: todo.id,
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-red-400 bg-red-50';
      case 'medium': return 'border-accent bg-orange-50';
      case 'low': return 'border-primary bg-blue-50';
      default: return 'border-muted bg-card';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return <Flag className="w-3 h-3 text-red-500" />;
      case 'medium': return <Flag className="w-3 h-3 text-accent" />;
      case 'low': return <Flag className="w-3 h-3 text-primary" />;
      default: return null;
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={cn(
        "group p-3 rounded-lg border-2 transition-all duration-300 cursor-grab active:cursor-grabbing",
        "shadow-card hover:shadow-hover backdrop-blur-sm",
        isDragging ? "opacity-50 rotate-2 scale-105" : "hover:scale-102",
        todo.completed 
          ? "bg-success/10 border-success/30 opacity-75" 
          : getPriorityColor(todo.priority),
        "animate-slide-up"
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            {getPriorityIcon(todo.priority)}
            <h3 className={cn(
              "font-medium text-sm truncate",
              todo.completed && "line-through text-muted-foreground"
            )}>
              {todo.title}
            </h3>
          </div>
          
          {todo.description && (
            <p className={cn(
              "text-xs text-muted-foreground line-clamp-2",
              todo.completed && "line-through"
            )}>
              {todo.description}
            </p>
          )}
          
          {todo.estimatedDuration && (
            <div className="flex items-center gap-1 mt-2">
              <Clock className="w-3 h-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">
                {todo.estimatedDuration}m
              </span>
            </div>
          )}
        </div>
        
        <button
          onClick={(e) => {
            e.stopPropagation();
            console.log('Toggling todo:', todo.id, 'current status:', todo.completed);
            onToggleComplete(todo.id);
          }}
          className={cn(
            "flex items-center justify-center w-6 h-6 rounded-full border-2 transition-all",
            "hover:scale-110 active:scale-95",
            todo.completed 
              ? "bg-success border-success text-success-foreground" 
              : "border-muted-foreground/30 hover:border-primary"
          )}
        >
          {todo.completed && <Check className="w-3 h-3" />}
        </button>
      </div>
    </div>
  );
}