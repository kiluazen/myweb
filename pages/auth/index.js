import { useEffect } from 'react';
import Head from 'next/head';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function Auth() {
    const handleGoogleLogin = async () => {
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${window.location.origin}/auth/callback`
                }
            });
            
            if (error) throw error;
        } catch (error) {
            console.error('Error:', error.message);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <Head>
                <title>PurposefulUse - Login</title>
            </Head>

            <main className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <h1 className="text-3xl font-bold text-center mb-2">PurposefulUse</h1>
                <p className="text-gray-600 text-center mb-8">
                    Login to manage your purposeful browsing
                </p>
                
                <button 
                    onClick={handleGoogleLogin}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                        {/* Google icon SVG */}
                    </svg>
                    Sign in with Google
                </button>
            </main>
        </div>
    );
}