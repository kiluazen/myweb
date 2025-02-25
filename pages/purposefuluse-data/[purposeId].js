import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/router';
import Link from 'next/link';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function PurposeDetail() {
    const [purpose, setPurpose] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const { purposeId } = router.query;

    useEffect(() => {
        async function fetchPurposeData() {
            if (!purposeId) return;

            // First, get the purpose with its basic info
            const { data: purposeData, error: purposeError } = await supabase
                .from('purposes')
                .select(`
                    id,
                    purpose_text,
                    created_at,
                    ended_at,
                    is_active,
                    resumed_at
                `)
                .eq('id', purposeId)
                .single();

            if (purposeError) {
                console.error('Error fetching purpose:', purposeError);
                return;
            }

            // Then get all context_switches for this purpose
            const { data: contextSwitchesData, error: contextError } = await supabase
                .from('context_switches_v3')
                .select('*')
                .eq('purpose_id', purposeId)
                .order('created_at', { ascending: true });

            if (contextError) {
                console.error('Error fetching context switches:', contextError);
                return;
            }

            // Identify session gaps by looking at timestamps
            const sessionData = identifySessionGaps(contextSwitchesData);

            setPurpose({ 
                ...purposeData, 
                context_switches_v3: contextSwitchesData,
                sessionGaps: sessionData.gaps,
                sessions: sessionData.sessions
            });
            setLoading(false);
        }

        fetchPurposeData();
    }, [purposeId]);

    // Function to identify gaps between recording sessions
    function identifySessionGaps(contextSwitches) {
        if (!contextSwitches || contextSwitches.length < 2) {
            return { gaps: [], sessions: [contextSwitches || []] };
        }

        const sortedSwitches = [...contextSwitches].sort((a, b) => 
            new Date(a.created_at) - new Date(b.created_at)
        );

        const gaps = [];
        const sessions = [];
        let currentSession = [sortedSwitches[0]];

        // Define a significant gap (e.g., more than 2 minutes between data points)
        const SIGNIFICANT_GAP_MS = 2 * 60 * 1000; // 2 minutes

        for (let i = 1; i < sortedSwitches.length; i++) {
            const current = new Date(sortedSwitches[i].created_at);
            const previous = new Date(sortedSwitches[i-1].created_at);
            const timeDiff = current - previous;

            if (timeDiff > SIGNIFICANT_GAP_MS || sortedSwitches[i].is_resumed_session) {
                // We found a gap - end current session and start new one
                sessions.push(currentSession);
                gaps.push({
                    start: previous,
                    end: current,
                    duration: timeDiff
                });
                currentSession = [sortedSwitches[i]];
            } else {
                // Same session continues
                currentSession.push(sortedSwitches[i]);
            }
        }

        // Don't forget to add the last session
        if (currentSession.length > 0) {
            sessions.push(currentSession);
        }

        return { gaps, sessions };
    }

    if (loading || !purpose) return <div>Loading...</div>;

    // Calculate stats
    const contextSwitches = purpose.context_switches_v3 || [];
    const totalChecks = contextSwitches.length;
    const distractions = contextSwitches.filter(cs => cs.is_context_switch).length;
    const focusedChecks = totalChecks - distractions;
    const duration = purpose.ended_at ? 
        new Date(purpose.ended_at) - new Date(purpose.created_at) :
        new Date() - new Date(purpose.created_at);
    const durationHours = (duration / (1000 * 60 * 60)).toFixed(1);
    const focusScore = totalChecks > 0 ? 
        Math.round((focusedChecks / totalChecks) * 100) : 100;

    // Calculate app stats
    const appStats = contextSwitches.reduce((acc, cs) => {
        const app = cs.detected_app || 'Unknown';
        if (!acc[app]) {
            acc[app] = { total: 0, distractions: 0 };
        }
        acc[app].total++;
        if (cs.is_context_switch) {
            acc[app].distractions++;
        }
        return acc;
    }, {});

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <Link href="/purposefuluse-data" 
                  className="mb-6 inline-block text-blue-600 hover:text-blue-800">
                ← Back to all sessions
            </Link>

            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
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

                {/* Timeline */}
                <div className="p-6 border-t">
                    <h3 className="text-xl font-semibold mb-4">Activity Timeline</h3>
                    <div className="relative h-64 w-full">
                        {/* Timeline Container */}
                        <div className="absolute inset-0">
                            {/* X-axis */}
                            <div className="absolute bottom-0 w-full h-[1px] bg-gray-300" />
                            
                            {/* Visualize session gaps */}
                            {purpose.sessionGaps && purpose.sessionGaps.map((gap, index) => {
                                const startTime = new Date(purpose.created_at).getTime();
                                const endTime = purpose.ended_at 
                                    ? new Date(purpose.ended_at).getTime() 
                                    : new Date().getTime();
                                
                                const gapStartPos = ((gap.start.getTime() - startTime) / (endTime - startTime)) * 100;
                                const gapEndPos = ((gap.end.getTime() - startTime) / (endTime - startTime)) * 100;
                                const gapWidth = gapEndPos - gapStartPos;
                                
                                return (
                                    <div 
                                        key={`gap-${index}`}
                                        className="absolute bg-gray-200 h-full opacity-50"
                                        style={{
                                            left: `${gapStartPos}%`,
                                            width: `${gapWidth}%`,
                                            bottom: '0'
                                        }}
                                        title={`Session paused from ${gap.start.toLocaleTimeString()} to ${gap.end.toLocaleTimeString()}`}
                                    >
                                        <div className="flex h-full items-center justify-center text-gray-600 text-xs">
                                            {gapWidth > 5 && "Paused"}
                                        </div>
                                    </div>
                                );
                            })}
                            
                            {purpose.context_switches_v3.map((cs, index, array) => {
                                const startTime = new Date(purpose.created_at).getTime();
                                const endTime = purpose.ended_at 
                                    ? new Date(purpose.ended_at).getTime() 
                                    : new Date().getTime();
                                const currentTime = new Date(cs.created_at).getTime();
                                
                                // Calculate x position (0 to 100%)
                                const xPos = ((currentTime - startTime) / (endTime - startTime)) * 100;
                                
                                // Calculate y position for red dots
                                const yPos = cs.is_context_switch 
                                    ? 20 + Math.random() * 40 // Random y between 20-60 for red dots
                                    : 0;

                                // Find consecutive focus points
                                const isStartOfStreak = !cs.is_context_switch && 
                                    (index === 0 || array[index - 1].is_context_switch);
                                
                                // Special handling for resumed sessions
                                const isResumePoint = cs.is_resumed_session;

                                if (isStartOfStreak) {
                                    // Calculate streak length
                                    let streakEnd = index;
                                    while (streakEnd < array.length - 1 && 
                                          !array[streakEnd + 1].is_context_switch &&
                                          !array[streakEnd + 1].is_resumed_session) {
                                        streakEnd++;
                                    }
                                    
                                    if (streakEnd > index) {
                                        // Calculate positions for the streak
                                        const streakStartTime = new Date(cs.created_at).getTime();
                                        const streakEndTime = new Date(array[streakEnd].created_at).getTime();
                                        const startXPos = ((streakStartTime - startTime) / (endTime - startTime)) * 100;
                                        const endXPos = ((streakEndTime - startTime) / (endTime - startTime)) * 100;
                                        
                                        // Render green bar for the streak
                                        return (
                                            <div
                                                key={cs.id}
                                                className="absolute h-4 bg-green-500 rounded-full"
                                                style={{
                                                    left: `${startXPos}%`,
                                                    width: `${endXPos - startXPos}%`,
                                                    bottom: '0',
                                                    transform: 'translateY(50%)'
                                                }}
                                            />
                                        );
                                    }
                                }

                                // Always render the dots (both red and green)
                                return (
                                    <div
                                        key={cs.id}
                                        className={`absolute w-3 h-3 rounded-full cursor-pointer group
                                            ${cs.is_context_switch ? 'bg-red-500' : 'bg-green-500'}
                                            ${isResumePoint ? 'ring-2 ring-blue-500' : ''}`}
                                        style={{
                                            left: `${xPos}%`,
                                            bottom: `${yPos}%`,
                                            transform: 'translate(-50%, 50%)',
                                            zIndex: '10' // Ensure dots are above the bars
                                        }}
                                    >
                                        {/* Tooltip */}
                                        <div className="invisible group-hover:visible absolute bottom-full left-1/2 
                                            transform -translate-x-1/2 p-2 bg-white shadow-lg rounded-lg 
                                            text-sm w-48 z-20 mb-2">
                                            <div className="font-medium">{cs.detected_app}</div>
                                            {isResumePoint && (
                                                <div className="text-blue-600 font-medium">Session Resumed</div>
                                            )}
                                            <div className="text-gray-600">{cs.explanation}</div>
                                            <div className="text-gray-500 text-xs">
                                                {new Date(cs.created_at).toLocaleTimeString()}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Time labels */}
                        <div className="absolute bottom-0 w-full flex justify-between text-sm text-gray-500 pt-2">
                            <span>
                                {new Date(purpose.created_at).toLocaleTimeString([], {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </span>
                            <span>
                                {purpose.ended_at 
                                    ? new Date(purpose.ended_at).toLocaleTimeString([], {
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })
                                    : new Date().toLocaleTimeString([], {
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Sessions Summary */}
                <div className="p-6 border-t">
                    <h3 className="text-xl font-semibold mb-4">Work Sessions</h3>
                    {purpose.sessions && purpose.sessions.map((session, index) => {
                        if (session.length === 0) return null;
                        
                        const sessionStart = new Date(session[0].created_at);
                        const sessionEnd = new Date(session[session.length - 1].created_at);
                        const duration = (sessionEnd - sessionStart) / (1000 * 60); // duration in minutes
                        
                        return (
                            <div key={`session-${index}`} className="mb-4 p-4 bg-gray-50 rounded-lg">
                                <div className="flex justify-between items-center mb-2">
                                    <div className="font-medium">Session {index + 1}</div>
                                    <div className="text-sm text-gray-600">
                                        Duration: {Math.round(duration)} min
                                    </div>
                                </div>
                                <div className="text-sm">
                                    <span className="text-gray-600">Started: </span>
                                    {sessionStart.toLocaleTimeString()}
                                    <span className="mx-2">→</span>
                                    <span className="text-gray-600">Ended: </span>
                                    {sessionEnd.toLocaleTimeString()}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Activity Log */}
                <div className="p-6 border-t">
                    <h3 className="text-xl font-semibold mb-4">Activity</h3>
                    <div className="space-y-3">
                        {purpose.context_switches_v3.map(cs => (
                            <div key={cs.id} 
                                 className={`p-4 rounded-lg ${
                                     cs.is_resumed_session ? 'bg-blue-50 border-l-4 border-blue-500' :
                                     cs.is_context_switch ? 'bg-red-50' : 'bg-green-50'
                                 }`}>
                                <div className="flex items-center justify-between">
                                    <span className="font-medium">
                                        {cs.is_resumed_session && '🔄 Session Resumed - '}
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
            </div>
        </div>
    );
}