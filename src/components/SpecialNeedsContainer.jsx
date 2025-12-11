// src/components/SpecialNeedsContainer.jsx (FINAL STABLE CODE)

import React from 'react';

// Import all individual trackers
import CargoShipTracker from './CargoShipTracker.jsx';
import WarTracker from './WarTracker.jsx';
import EpicProjectTracker from './EpicProjectTracker.jsx'; 

// --- Airport Imports (3 separate tiles) ---
import AirportLondonTracker from './AirportLondonTracker.jsx';
import AirportParisTracker from './AirportParisTracker.jsx';
import AirportTokyoTracker from './AirportTokyoTracker.jsx';

// --- Export HQ Container (Manages dynamic tiles) ---
import ExportTracker from './ExportTracker.jsx'; 

// NOTE: We use trackerData and updateTrackerState from the parent TabbedPlanner
export default function SpecialNeedsContainer({ trackerData, updateTrackerState }) {
    
    // CRITICAL: Ensure the name expected by the child trackers is defined.
    const onNeedsUpdate = updateTrackerState; 
    
    // utilityItems is defined here but not used, kept for future reference if a child needs it
    // const utilityItems = trackerData.utilityItems; 
    
    return (
        <div className="special-needs-container">
            <h2>Special Needs Trackers (Orders Page)</h2>
            
            <div className="trackers-grid">
                
                {/* 1. Cargo Ship Tracker (Green Header) */}
                <CargoShipTracker 
                    trackerData={trackerData} 
                    onNeedsUpdate={onNeedsUpdate} // CRASH FIX: Pass the function with the expected name
                />

                {/* 2. War Deliveries Tracker (Red Header) */}
                <WarTracker 
                    trackerData={trackerData}
                    onNeedsUpdate={onNeedsUpdate} // CRASH FIX
                />

                {/* 3. Epic Project Tracker (Yellow Header) */}
                <EpicProjectTracker 
                    trackerData={trackerData}
                    onNeedsUpdate={onNeedsUpdate} // CRASH FIX
                />
                
                {/* 4. Export HQ Tracker (Purple Header - Dynamic Container) */}
                <ExportTracker 
                    trackerData={trackerData}
                    onNeedsUpdate={onNeedsUpdate} // CRASH FIX
                />
                
                {/* 5, 6, 7. AIRPORT TRACKERS (Blue Headers - 3 Separate Tiles) */}
                <AirportLondonTracker 
                    trackerData={trackerData}
                    onNeedsUpdate={onNeedsUpdate} // CRASH FIX
                />
                <AirportParisTracker 
                    trackerData={trackerData}
                    onNeedsUpdate={onNeedsUpdate} // CRASH FIX
                />
                <AirportTokyoTracker 
                    trackerData={trackerData}
                    onNeedsUpdate={onNeedsUpdate} // CRASH FIX
                />
                
                {/* The Building Upgrade Tracker is on its own dedicated tab. */}
            </div>
        </div>
    );
}