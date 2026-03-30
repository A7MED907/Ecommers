// ================ Error Message Component ================

import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '../ui/button';
import './ErrorMessage.css';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <div className="error-container">
      <AlertCircle className="error-icon" />
      <h3 className="error-title">Oops! Something went wrong</h3>
      <p className="error-message">{message}</p>
      {onRetry && (
        <Button onClick={onRetry} className="retry-btn">
          <RefreshCw className="btn-icon" />
          Try Again
        </Button>
      )}
    </div>
  );
}
