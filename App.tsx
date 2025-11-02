import React, { useState, useEffect } from 'react';
import PasswordGenerator from './components/PasswordGenerator';

// Access key from environment variable (set in Vercel)
const SECRET_ACCESS_KEY = import.meta.env.VITE_ACCESS_KEY || '';

const App: React.FC = () => {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const accessKey = urlParams.get('access_key');
    
    if (accessKey && SECRET_ACCESS_KEY && accessKey === SECRET_ACCESS_KEY) {
      setIsAuthorized(true);
      // Save authorization in sessionStorage
      sessionStorage.setItem('authorized', 'true');
    } else if (sessionStorage.getItem('authorized') === 'true') {
      // Keep authorized during session
      setIsAuthorized(true);
    }
    
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-900 text-white">
        <p>Verifying access...</p>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 text-white p-4 text-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-red-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
        <p className="text-slate-400">Please provide a valid access key in the URL.</p>
        <p className="text-slate-500 mt-2 text-sm">Example: <code>?access_key=YOUR_KEY_HERE</code></p>
      </div>
    );
  }

  return <PasswordGenerator />;
};

export default App;