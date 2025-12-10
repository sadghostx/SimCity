// src/components/AirportTracker.jsx

import React, { useState, useCallback, useMemo } from 'react';
import AirportLondonTracker from './AirportLondonTracker.jsx'; 
// Assuming you will create Paris and Tokyo trackers based on the London one
// import AirportParisTracker from './AirportParisTracker.jsx'; 
// import AirportTokyoTracker from './AirportTokyoTracker.jsx'; 

export default function AirportTracker({ onNeedsUpdate }) {
    const regions = ['London', 'Paris', 'Tokyo'];
    const [activeRegion, setActiveRegion] = useState(regions[0]);

    // This component aggregates the needs from its sub-trackers (London, Paris, Tokyo)
    // and sends them up to the parent component (SpecialNeedsContainer) using a single key.
    // NOTE: For simplicity and to avoid creating two extra files right now, 
    // we only include the London tracker. If you implement Paris/Tokyo, you'd add them here.

    const renderTracker = () => {
        switch (activeRegion) {
            case 'London':
                return <AirportLondonTracker onNeedsUpdate={onNeedsUpdate} region="London" />;
            // case 'Paris':
            //     return <AirportParisTracker onNeedsUpdate={onNeedsUpdate} region="Paris" />;
            // case 'Tokyo':
            //     return <AirportTokyoTracker onNeedsUpdate={onNeedsUpdate} region="Tokyo" />;
            default:
                return <div>Select an Airport Region.</div>;
        }
    };

    return (
        <div className="utility-card airport-tracker-container">
            <h3>Airport Export Deliveries</h3>
            <div className="tab-navigation airport-tabs">
                {regions.map(region => (
                    <button
                        key={region}
                        className={`tab-button ${activeRegion === region ? 'active' : ''}`}
                        onClick={() => setActiveRegion(region)}
                    >
                        {region}
                    </button>
                ))}
            </div>
            <div className="airport-content">
                {renderTracker()}
            </div>
        </div>
    );
}