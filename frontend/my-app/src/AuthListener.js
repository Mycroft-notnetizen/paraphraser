import { useEffect } from 'react';
import { supabase } from './supabaseClient';

const AuthStateListener = () => {
    useEffect(() => {
        const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
            if (session) {
                console.log('Auth state changed:', event);
                console.log('Session:', session);
                localStorage.setItem('supabase.auth.token', JSON.stringify(session));
            } else {
                // If the session is null, it means the user logged out
                localStorage.removeItem('supabase.auth.token');
            }
        });

        return () => {
            authListener?.unsubscribe();
        };
    }, []);

    return null; // This component doesn't render anything
};

export default AuthStateListener;
