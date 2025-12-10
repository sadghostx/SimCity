// src/components/BuildingUpgradeTab.jsx

import React, { useState } from 'react';
// Ensure file extension is included if you had trouble with the previous import error
import BuildingUpgradeTracker from './BuildingUpgradeTracker.jsx'; 

// --- FINAL 16-TYPE BUILDING CONSTANTS (Includes Art Nouveau Zone & Florentine/Kyoto) ---
const REGIONS = [
    'Residential', 'Canyon', 'Sunny Isles', 'Green Valley', 'Frosty Fjords', 'Limestone Cliffs'
];
// NOTE: I'm including Kyoto and Florentine as they are also primary residential types 
// mentioned on the wiki, along with Art Nouveau Zone which you showed me.
const BUILDING_TYPES = [
    'Standard', 
    'Neo-Simoleons', 
    'Beach', 
    'Mountain', 
    'Landmarks', 
    'London', 
    'Paris', 
    'Tokyo', 
    'Omega', 
    'Latin American', 
    'Old Town',
    'Doomsday',
    'Medieval',
    'University',
    'Contest of Mayors',
    'Art Nouveau Zone', // Included as seen on your screen
    'Kyoto House',
    'Florentine Zone'
];

// Initial state starts with six tracker tiles
const initialTrackers = Array.from({ length: 6 }, (_, i) => ({ 
    id: i + 1, 
    region: REGIONS[0], 
    buildingType: BUILDING_TYPES[0]
}));

export default function BuildingUpgradeTab({ onNeedsUpdate, utilityItems }) {
    const [trackers, setTrackers] = useState(initialTrackers);

    const handleTrackerNeedsUpdate = (newNeeds) => {
        onNeedsUpdate(newNeeds);
    };

    const handleDropdownChange = (id, field, value) => {
        setTrackers(prevTrackers => 
            prevTrackers.map(tracker => 
                tracker.id === id ? { ...tracker, [field]: value } : tracker
            )
        );
    };

    return (
        <div className="building-upgrade-tab">
            <h2>Building Upgrade Needs (6 Slots)</h2>
            <div className="trackers-grid"> 
                
                {trackers.map(tracker => {
                    
                    // Layered Header JSX with Type (Left) and Region (Right) Dropdowns
                    const regionSelectorJSX = (
                        <div className="region-selector-layer">
                            
                            {/* 1. TYPE (LEFT) */}
                            <div>
                                <label htmlFor={`type-${tracker.id}`}>Type:</label>
                                <select
                                    id={`type-${tracker.id}`}
                                    value={tracker.buildingType}
                                    onChange={(e) => handleDropdownChange(tracker.id, 'buildingType', e.target.value)}
                                >
                                    {BUILDING_TYPES.map(type => (
                                        <option key={type} value={type}>{type}</option>
                                    ))}
                                </select>
                            </div>

                            {/* 2. REGION (RIGHT) */}
                            <div>
                                <label htmlFor={`region-${tracker.id}`}>Region:</label>
                                <select
                                    id={`region-${tracker.id}`}
                                    value={tracker.region}
                                    onChange={(e) => handleDropdownChange(tracker.id, 'region', e.target.value)}
                                >
                                    {REGIONS.map(region => (
                                        <option key={region} value={region}>{region}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    );

                    return (
                        <div key={tracker.id} className="building-upgrade-tile-wrapper">
                            <BuildingUpgradeTracker 
                                id={tracker.id}
                                region={tracker.region}
                                buildingType={tracker.buildingType}
                                onNeedsUpdate={handleTrackerNeedsUpdate} 
                                utilityItems={utilityItems} 
                                regionSelectorJSX={regionSelectorJSX} 
                            />
                        </div>
                    );
                })}
            </div>
        </div>
    );
}