import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function AuthCallback() {
    const router = useRouter();

    useEffect(() => {
        supabase.auth.onAuthStateChange((event, session) => {
            console.log('Auth state changed:', event, !!session);
            if (event === 'SIGNED_IN' && session) {
                const EXTENSION_ID = localStorage.getItem('purposefuluse_extension_id');
                localStorage.setItem('purposefuluse_user_id', session.user.id);
                if (chrome?.runtime?.connect) {
                    console.log('Attempting to connect to extension');
                    try {
                        // Connect to the extension
                        chrome.runtime.connect(EXTENSION_ID).postMessage({
                            type: 'AUTH_SUCCESS',
                            session: session
                        });
                        console.log('Auth success message sent to extension');
                        
                        // Redirect to data page after notifying extension
                        router.push('/purposefuluse-data');
                    } catch (e) {
                        console.error('Extension communication failed:', e);
                        router.push('/purposefuluse-data');
                    }
                } else {
                    console.log('Not in extension context, redirecting');
                    router.push('/purposefuluse-data');
                }
            }
        });
    }, [router]);

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-lg text-gray-600">Redirecting to your dashboard...</p>
            </div>
        </div>
    );
}