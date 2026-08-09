import { useState } from 'react';
import { supabase } from '../utils/supabase';

export default function GoogleSignIn() {
  const [error, setError] = useState(false);

  const handleSignIn = async () => {
    const { error: signInError } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
      },
    });
    if (signInError) setError(true);
  };

  return (
    <div className="google-signin">
      <button type="button" className="gsi-button" onClick={handleSignIn}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M21.35 11.1H12v3.4h5.32c-.4 2.09-1.87 3.87-3.82 4.63v3.05h4.4c3.42-3.15 5.45-7.79 5.45-11.08z" fill="#4285F4" />
          <path d="M12 22c3.6 0 6.62-1.2 8.83-3.24l-4.4-3.05c-1.22.82-2.78 1.3-4.43 1.3-3.4 0-6.28-2.3-7.31-5.39H.6v3.13A12 12 0 0012 22z" fill="#34A853" />
          <path d="M4.69 13.62a7.4 7.4 0 010-3.24V7.25H.6a12 12 0 000 9.5l4.09-3.13z" fill="#FBBC05" />
          <path d="M12 4.75c1.96 0 3.71.68 5.1 2l3.7-3.7A12 12 0 000 7.25l4.09 3.13C5.72 7.05 8.6 4.75 12 4.75z" fill="#EA4335" />
        </svg>
        Continue with Google
      </button>
      {error && <p className="google-error">Google sign-in failed. Please try again.</p>}
    </div>
  );
}
