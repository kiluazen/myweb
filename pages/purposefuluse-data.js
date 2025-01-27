import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/router';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);
const TEST_USER_ID='55520887-6bc3-4b19-bc20-15a5b0d28500';

export default function PurposefulData() {
    const [purposes, setPurposes] = useState([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        async function fetchData() {
            // Fetch purposes with their context switches
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
                .eq('user_id', TEST_USER_ID)
                .order('created_at', { ascending: false });

            if (error) {
                console.error('Error fetching data:', error);
                return;
            }

            console.log('Fetched data:', purposeData);
            setPurposes(purposeData);
            setLoading(false);
        }

        fetchData();
    }, []);

    if (loading) return <div>Loading...</div>;

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">Your Focus Journey</h1>
            
            {purposes.map(purpose => {
                const contextSwitches = purpose.context_switches_v3 || [];
                const totalChecks = contextSwitches.length;
                const distractions = contextSwitches.filter(cs => cs.is_context_switch).length;
                const focusedChecks = totalChecks - distractions;
                const duration = purpose.ended_at ? 
                    new Date(purpose.ended_at) - new Date(purpose.created_at) :
                    new Date() - new Date(purpose.created_at);
                const durationHours = (duration / (1000 * 60 * 60)).toFixed(1);
                
                // Calculate focus score (0-100)
                const focusScore = totalChecks > 0 ? 
                    Math.round((focusedChecks / totalChecks) * 100) : 100;

                // Group context switches by detected app
                const appStats = contextSwitches.reduce((acc, cs) => {
                    const app = cs.detected_app || 'Unknown';
                    if (!acc[app]) acc[app] = { total: 0, distractions: 0 };
                    acc[app].total++;
                    if (cs.is_context_switch) acc[app].distractions++;
                    return acc;
                }, {});

                return (
                    <div key={purpose.id} className="mb-12 bg-white rounded-xl shadow-lg overflow-hidden">
                        {/* Purpose Header */}
                        <div className="p-6 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
                            <h2 className="text-2xl font-bold mb-2">{purpose.purpose_text}</h2>
                            <div className="flex items-center space-x-4 text-sm">
                                <span>Started: {new Date(purpose.created_at).toLocaleString()}</span>
                                {purpose.is_active ? 
                                    <span className="px-2 py-1 bg-green-500 rounded-full">Active</span> :
                                    <span>Ended: {new Date(purpose.ended_at).toLocaleString()}</span>
                                }
                            </div>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6">
                            <div className="stat-card">
                                <div className="text-3xl font-bold">{durationHours}h</div>
                                <div className="text-gray-600">Duration</div>
                            </div>
                            <div className="stat-card">
                                <div className="text-3xl font-bold">{totalChecks}</div>
                                <div className="text-gray-600">Total Checks</div>
                            </div>
                            <div className="stat-card">
                                <div className="text-3xl font-bold text-red-500">{distractions}</div>
                                <div className="text-gray-600">Distractions</div>
                            </div>
                            <div className="stat-card">
                                <div className="text-3xl font-bold text-green-500">{focusScore}%</div>
                                <div className="text-gray-600">Focus Score</div>
                            </div>
                        </div>

                        {/* App Usage Stats */}
                        {Object.keys(appStats).length > 0 && (
                            <div className="p-6 border-t">
                                <h3 className="text-xl font-semibold mb-4">Application Usage</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {Object.entries(appStats).map(([app, stats]) => (
                                        <div key={app} className="p-4 bg-gray-50 rounded-lg">
                                            <div className="font-medium">{app}</div>
                                            <div className="text-sm text-gray-600">
                                                {stats.distractions} distractions / {stats.total} checks
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Timeline */}
                        {contextSwitches.length > 0 && (
                            <div className="p-6 border-t">
                                <h3 className="text-xl font-semibold mb-4">Activity Timeline</h3>
                                <div className="space-y-3">
                                    {contextSwitches.map(cs => (
                                        <div key={cs.id} 
                                             className={`p-4 rounded-lg ${
                                                 cs.is_context_switch ? 'bg-red-50' : 'bg-green-50'
                                             }`}>
                                            <div className="flex items-center justify-between">
                                                <span className="font-medium">
                                                    {cs.detected_app || 'Unknown'} 
                                                    {cs.is_context_switch ? ' ❌' : ' ✅'}
                                                </span>
                                                <span className="text-sm text-gray-500">
                                                    {new Date(cs.created_at).toLocaleTimeString()}
                                                </span>
                                            </div>
                                            <div className="text-sm text-gray-600 mt-1">{cs.explanation}</div>
                                            {cs.active_tab_title && (
                                                <div className="text-xs text-gray-500 mt-1">
                                                    {cs.active_tab_title}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}