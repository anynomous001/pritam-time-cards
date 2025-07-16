import { useState, useEffect } from 'react';
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent } from '@dnd-kit/core';
import { Clock, User, Calendar, CheckCircle2 } from 'lucide-react';
import { TodoCard } from '@/components/TodoCard';
import { TimeSlotCard } from '@/components/TimeSlotCard';
import { TodoForm } from '@/components/TodoForm';
import { TodoHistory } from '@/components/TodoHistory';
import { Todo, TimeSlot } from '@/types/todo';
import { toast } from '@/hooks/use-toast';

const Index = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [activeTodo, setActiveTodo] = useState<Todo | null>(null);

  // Initialize time slots (6 AM to 11 PM)
  useEffect(() => {
    const slots: TimeSlot[] = [];
    for (let hour = 6; hour <= 23; hour++) {
      const time = `${hour.toString().padStart(2, '0')}:00`;
      slots.push({
        time,
        hour,
        todos: []
      });
    }
    setTimeSlots(slots);
  }, []);

  // Load todos from localStorage
  useEffect(() => {
    const savedTodos = localStorage.getItem('pritam-todos');
    if (savedTodos) {
      const parsedTodos = JSON.parse(savedTodos).map((todo: any) => ({
        ...todo,
        createdAt: new Date(todo.createdAt),
        completedAt: todo.completedAt ? new Date(todo.completedAt) : undefined,
      }));
      setTodos(parsedTodos);
    }
  }, []);

  // Save todos to localStorage
  useEffect(() => {
    if (todos.length > 0) {
      localStorage.setItem('pritam-todos', JSON.stringify(todos));
    }
  }, [todos]);

  // Update time slots when todos change
  useEffect(() => {
    setTimeSlots(prevSlots => 
      prevSlots.map(slot => ({
        ...slot,
        todos: todos.filter(todo => todo.timeSlot === slot.time)
      }))
    );
  }, [todos]);

  const addTodo = (todoData: Omit<Todo, 'id' | 'createdAt' | 'completed'>) => {
    const newTodo: Todo = {
      ...todoData,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      completed: false,
    };
    
    setTodos(prev => [...prev, newTodo]);
    toast({
      title: "Todo created!",
      description: `"${newTodo.title}" has been added to your backlog.`
    });
  };

  const toggleComplete = (todoId: string) => {
    setTodos(prev => prev.map(todo => 
      todo.id === todoId 
        ? { 
            ...todo, 
            completed: !todo.completed,
            completedAt: !todo.completed ? new Date() : undefined
          }
        : todo
    ));
    
    const todo = todos.find(t => t.id === todoId);
    if (todo) {
      toast({
        title: todo.completed ? "Todo unchecked" : "Todo completed! 🎉",
        description: todo.completed 
          ? `"${todo.title}" marked as incomplete.`
          : `Great job completing "${todo.title}"!`
      });
    }
  };

  const handleDragStart = (event: DragStartEvent) => {
    const todo = todos.find(t => t.id === event.active.id);
    setActiveTodo(todo || null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTodo(null);

    if (!over) return;

    const todoId = active.id as string;
    const timeSlot = over.id as string;

    setTodos(prev => prev.map(todo => 
      todo.id === todoId ? { ...todo, timeSlot } : todo
    ));

    const todo = todos.find(t => t.id === todoId);
    const slot = timeSlots.find(s => s.time === timeSlot);
    
    if (todo && slot) {
      const hour = slot.hour;
      const period = hour >= 12 ? 'PM' : 'AM';
      const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
      
      toast({
        title: "Todo scheduled!",
        description: `"${todo.title}" moved to ${displayHour}:00 ${period}.`
      });
    }
  };

  const unscheduledTodos = todos.filter(todo => !todo.timeSlot);
  const completedTodosCount = todos.filter(todo => todo.completed).length;
  const totalTodos = todos.length;
  const completionRate = totalTodos > 0 ? Math.round((completedTodosCount / totalTodos) * 100) : 0;

  return (
    <div className="min-h-screen bg-gradient-bg">
      <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div className="container mx-auto px-4 py-6 max-w-7xl">
          {/* Header */}
          <header className="mb-8">
            <div className="text-center mb-6">
              <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
                Pritam's Time Cards
              </h1>
              <p className="text-muted-foreground text-lg">
                Drag, schedule, and complete your daily tasks
              </p>
            </div>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-card/80 backdrop-blur-sm p-4 rounded-lg shadow-card text-center">
                <Clock className="w-5 h-5 mx-auto mb-2 text-primary" />
                <div className="text-2xl font-bold text-primary">{unscheduledTodos.length}</div>
                <div className="text-xs text-muted-foreground">Unscheduled</div>
              </div>
              
              <div className="bg-card/80 backdrop-blur-sm p-4 rounded-lg shadow-card text-center">
                <Calendar className="w-5 h-5 mx-auto mb-2 text-accent" />
                <div className="text-2xl font-bold text-accent">{todos.filter(t => t.timeSlot).length}</div>
                <div className="text-xs text-muted-foreground">Scheduled</div>
              </div>
              
              <div className="bg-card/80 backdrop-blur-sm p-4 rounded-lg shadow-card text-center">
                <CheckCircle2 className="w-5 h-5 mx-auto mb-2 text-success" />
                <div className="text-2xl font-bold text-success">{completedTodosCount}</div>
                <div className="text-xs text-muted-foreground">Completed</div>
              </div>
              
              <div className="bg-card/80 backdrop-blur-sm p-4 rounded-lg shadow-card text-center">
                <User className="w-5 h-5 mx-auto mb-2 text-primary" />
                <div className="text-2xl font-bold text-primary">{completionRate}%</div>
                <div className="text-xs text-muted-foreground">Success Rate</div>
              </div>
            </div>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              <TodoForm onAddTodo={addTodo} />
              
              {/* Unscheduled Todos */}
              <div className="bg-card/80 backdrop-blur-sm p-4 rounded-lg shadow-card">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Backlog ({unscheduledTodos.length})
                </h3>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {unscheduledTodos.map(todo => (
                    <TodoCard 
                      key={todo.id} 
                      todo={todo} 
                      onToggleComplete={toggleComplete}
                    />
                  ))}
                  {unscheduledTodos.length === 0 && (
                    <div className="text-center py-6 text-muted-foreground">
                      <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No unscheduled todos</p>
                    </div>
                  )}
                </div>
              </div>
              
              <TodoHistory todos={todos} />
            </div>

            {/* Time Grid */}
            <div className="lg:col-span-3">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {timeSlots.map(slot => (
                  <TimeSlotCard
                    key={slot.time}
                    time={slot.time}
                    hour={slot.hour}
                    todos={slot.todos}
                    onToggleComplete={toggleComplete}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Drag Overlay */}
        <DragOverlay>
          {activeTodo && (
            <div className="transform rotate-3 opacity-90">
              <TodoCard todo={activeTodo} onToggleComplete={toggleComplete} />
            </div>
          )}
        </DragOverlay>
      </DndContext>
    </div>
  );
};

export default Index;
