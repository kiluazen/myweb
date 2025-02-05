import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/router';
import PurposeCard from '../../components/PurposeCard';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);
// const TEST_USER_ID='55520887-6bc3-4b19-bc20-15a5b0d28500';

export default function PurposefulData() {
    const [purposes, setPurposes] = useState([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        async function fetchData() {
            const userId = localStorage.getItem('purposefuluse_user_id');
            if (!userId) {
                console.error('No user ID found');
                router.push('/auth'); // Redirect to auth if no user ID
                return;
            }
            const { data: purposeData, error } = await supabase
                .from('purposes')
                .select(`
                    id,
                    purpose_text,
                    created_at,
                    ended_at,
                    is_active,
                    context_switches_v3 (
                        id,
                        is_context_switch,
                        active_tab_url,
                        active_tab_title,
                        detected_app,
                        explanation,
                        created_at
                    )
                `)
                // .eq('user_id', TEST_USER_ID)
                .eq('user_id', userId) 
                .order('created_at', { ascending: false });

            if (error) {
                console.error('Error fetching data:', error);
                return;
            }

            setPurposes(purposeData);
            setLoading(false);
        }

        fetchData();
    }, []);

    const handlePurposeClick = (purposeId) => {
        router.push(`/purposefuluse-data/${purposeId}`);
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">Your Focus Journey</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {purposes.map(purpose => (
                    <PurposeCard
                        key={purpose.id}
                        purpose={purpose}
                        onClick={() => handlePurposeClick(purpose.id)}
                    />
                ))}
            </div>
        </div>
    );
}