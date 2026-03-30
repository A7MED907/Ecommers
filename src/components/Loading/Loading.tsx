// ================ Loading Component ================

import { Loader2 } from 'lucide-react';
import './Loading.css';

interface LoadingProps {
  fullScreen?: boolean;
  message?: string;
}

export function Loading({ fullScreen = false, message = 'Loading...' }: LoadingProps) {
  const className = fullScreen ? 'loading-container fullscreen' : 'loading-container';
  
  return (
    <div className={className}>
      <Loader2 className="loading-spinner" />
      <p className="loading-message">{message}</p>
    </div>
  );
}
