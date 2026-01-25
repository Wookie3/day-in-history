import { Card, CardContent } from '@/components/ui/card';
import { CalendarX } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  title?: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({
  title = "No events found",
  description = "We couldn't find any historical events matching your criteria.",
  action,
}: EmptyStateProps) {
  return (
    <Card className="p-12 text-center vintage-frame vintage-shadow">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4 border-2 border-accent/50">
        <CalendarX className="h-8 w-8 text-accent" />
      </div>
      <h3 className="text-xl font-serif-heading font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground font-serif-body mb-6">{description}</p>
      {action && (
        <Button variant="vintage-gold" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </Card>
  );
}
