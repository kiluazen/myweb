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
                // Use chrome.runtime.connect with your extension ID
                const EXTENSION_ID = 'emmliknhbjpmefbickkpchogaijhpojm'; // Get this from chrome://extensions
                if (chrome?.runtime?.connect) {
                    console.log('Attempting to connect to extension');
                    try {
                        // Connect to the extension
                        chrome.runtime.connect(EXTENSION_ID).postMessage({
                            type: 'AUTH_SUCCESS',
                            session: session
                        });
                        console.log('Auth success message sent to extension');
                    } catch (e) {
                        console.error('Extension communication failed:', e);
                        router.push('/');
                    }
                } else {
                    console.log('Not in extension context, redirecting');
                    router.push('/');
                }
            }
        });
    }, [router]);


    return (
        <div>
            <p>Completing sign in...</p>
        </div>
    );
}