import React from 'react';

export default function PurposeCard({ purpose, onClick }) {
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

    return (
        <div 
            onClick={onClick}
            className="bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer hover:shadow-xl transition-shadow"
        >
            <div className="p-4 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
                <h2 className="text-lg font-bold mb-1 truncate">
                    {purpose.purpose_text}
                </h2>
                <div className="text-sm opacity-90">
                    {new Date(purpose.created_at).toLocaleDateString()}
                </div>
            </div>
            <div className="p-4 grid grid-cols-2 gap-3 text-sm">
                <div>
                    <div className="font-semibold">{durationHours}h</div>
                    <div className="text-gray-600 text-xs">Duration</div>
                </div>
                <div>
                    <div className="font-semibold text-green-500">{focusScore}%</div>
                    <div className="text-gray-600 text-xs">Focus Score</div>
                </div>
                <div>
                    <div className="font-semibold">{totalChecks}</div>
                    <div className="text-gray-600 text-xs">Checks</div>
                </div>
                <div>
                    <div className="font-semibold text-red-500">{distractions}</div>
                    <div className="text-gray-600 text-xs">Distractions</div>
                </div>
            </div>
            {purpose.is_active && (
                <div className="px-4 py-2 bg-green-50 text-green-700 text-sm font-medium">
                    Active Session
                </div>
            )}
        </div>
    );
}