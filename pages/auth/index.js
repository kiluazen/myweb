import { useEffect, useState } from 'react';
import Head from 'next/head';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function Auth() {
    const [extensionId, setExtensionId] = useState('');
    
    useEffect(() => {
        // Load saved extension ID if exists
        const savedId = localStorage.getItem('purposefuluse_extension_id');
        if (savedId) {
            setExtensionId(savedId);
        }
    }, []);

    const handleGoogleLogin = async () => {
        try {
            if (!extensionId.trim()) {
                alert('Please enter the Extension ID to continue');
                return;
            }
            
            localStorage.setItem('purposefuluse_extension_id', extensionId.trim());
            
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: 'https://kushalsm.com/auth/callback'
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

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Extension ID
                    </label>
                    <input 
                        type="text"
                        value={extensionId}
                        onChange={(e) => setExtensionId(e.target.value)}
                        placeholder="Enter extension ID from chrome://extensions"
                        className="w-full p-2 border rounded-md mb-2"
                        required
                    />
                    <p className="text-xs text-gray-500">
                        Find this in chrome://extensions with Developer Mode enabled
                    </p>
                </div>
                
                <button 
                    onClick={handleGoogleLogin}
                    disabled={!extensionId.trim()}
                    className={`w-full py-2 px-4 rounded-md flex items-center justify-center gap-2 transition-colors
                        ${extensionId.trim() 
                            ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                            : 'bg-gray-300 cursor-not-allowed text-gray-500'}`}
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