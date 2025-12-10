// src/components/ExportTracker.jsx

import React, { useState } from 'react';
import ExportHQTracker from './ExportHQTracker';

// List of possible regions for the dropdown
const REGIONS = [
    'Default', 
    'Canyon', 
    'Sunny Isles', 
    'Green Valley', 
    'Frosty Fjords', 
    'Limestone Cliffs'
];

// Initial state starts with one tracker tile
const initialTrackers = [
    { id: 1, region: REGIONS[0], needs: {} }
];

let nextId = initialTrackers.length + 1;

export default function ExportTracker({ onNeedsUpdate, utilityItems }) {
    const [trackers, setTrackers] = useState(initialTrackers);

    const handleTrackerNeedsUpdate = (newNeeds) => {
        onNeedsUpdate(newNeeds);
    };

    const handleAddTracker = () => {
        setTrackers(prevTrackers => [
            ...prevTrackers,
            { id: nextId++, region: REGIONS[0], needs: {} }
        ]);
    };

    const handleRemoveTracker = (idToRemove) => {
        setTrackers(prevTrackers => 
            prevTrackers.filter(tracker => tracker.id !== idToRemove)
        );
        onNeedsUpdate({ [`exportHQ_${idToRemove}`]: {} });
    };

    const handleRegionChange = (id, newRegion) => {
        setTrackers(prevTrackers => 
            prevTrackers.map(tracker => 
                tracker.id === id ? { ...tracker, region: newRegion } : tracker
            )
        );
    };

    return (
        // Returning fragments to render individual tiles directly into the main trackers-grid
        <> 
            {trackers.map((tracker, index) => {
                
                // Region Selector Component JSX (The Layered Bar)
                const regionSelector = (
                    <div className="region-selector-layer">
                        <label htmlFor={`region-${tracker.id}`}>Export Region:</label>
                        <select
                            id={`region-${tracker.id}`}
                            value={tracker.region}
                            onChange={(e) => handleRegionChange(tracker.id, e.target.value)}
                        >
                            {REGIONS.map(region => (
                                <option key={region} value={region}>{region}</option>
                            ))}
                        </select>
                    </div>
                );

                return (
                    // Wrapper div to contain the Tracker Tile and the Add Button
                    <div key={tracker.id} className="export-hq-full-tile-wrapper">
                        
                        <ExportHQTracker
                            id={tracker.id}
                            region={tracker.region}
                            onNeedsUpdate={handleTrackerNeedsUpdate}
                            utilityItems={utilityItems}
                            onRemove={handleRemoveTracker}
                            regionSelectorJSX={regionSelector} // PASS IT AS A PROP
                        />
                        
                        {/* Add Tracker Button (Only show on the last tracker) */}
                        {index === trackers.length - 1 && (
                            <button 
                                onClick={handleAddTracker} 
                                className="complete-all-button add-tracker-button"
                            >
                                + Add Export HQ Tracker
                            </button>
                        )}
                    </div>
                );
            })}
        </>
    );
}