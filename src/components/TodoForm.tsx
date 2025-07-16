import { useState } from 'react';
import { Plus, Clock, Flag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Todo } from '@/types/todo';

interface TodoFormProps {
  onAddTodo: (todo: Omit<Todo, 'id' | 'createdAt' | 'completed'>) => void;
}

export function TodoForm({ onAddTodo }: TodoFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [estimatedDuration, setEstimatedDuration] = useState<number>();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAddTodo({
      title: title.trim(),
      description: description.trim() || undefined,
      priority,
      estimatedDuration,
    });

    // Reset form
    setTitle('');
    setDescription('');
    setPriority('medium');
    setEstimatedDuration(undefined);
    setIsOpen(false);
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="w-full h-12 text-base font-medium bg-gradient-primary hover:shadow-hover transition-all duration-300"
      >
        <Plus className="w-5 h-5 mr-2" />
        Add New Todo
      </Button>
    );
  }

  return (
    <Card className="border-primary/20 shadow-card animate-scale-in">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Plus className="w-5 h-5 text-primary" />
          Create New Todo
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            placeholder="What needs to be done?"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-base"
            autoFocus
          />
          
          <Textarea
            placeholder="Add a description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="min-h-[80px] resize-none"
          />
          
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-1">
                <Flag className="w-3 h-3" />
                Priority
              </label>
              <Select value={priority} onValueChange={(value: 'low' | 'medium' | 'high') => setPriority(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">🟢 Low</SelectItem>
                  <SelectItem value="medium">🟡 Medium</SelectItem>
                  <SelectItem value="high">🔴 High</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Duration (min)
              </label>
              <Input
                type="number"
                placeholder="30"
                min="5"
                max="480"
                step="5"
                value={estimatedDuration || ''}
                onChange={(e) => setEstimatedDuration(e.target.value ? parseInt(e.target.value) : undefined)}
              />
            </div>
          </div>
          
          <div className="flex gap-2 pt-2">
            <Button type="submit" className="flex-1 bg-gradient-primary">
              Create Todo
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setIsOpen(false)}
              className="px-6"
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}