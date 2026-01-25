import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({ message = "Unable to load historical events", onRetry }: ErrorStateProps) {
  return (
    <Alert variant="destructive" className="my-6 border-2 border-destructive/50 vintage-shadow">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle className="font-serif-heading">Error</AlertTitle>
      <AlertDescription className="mt-2 font-serif-body">
        {message}. Please try again.
      </AlertDescription>
      {onRetry && (
        <Button variant="vintage" className="mt-4" onClick={onRetry}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Try Again
        </Button>
      )}
    </Alert>
  );
}
