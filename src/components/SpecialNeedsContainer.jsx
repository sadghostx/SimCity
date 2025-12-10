// src/components/SpecialNeedsContainer.jsx

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

// NOTE: You will need to import BuildingUpgradeTracker here when you create it.


export default function SpecialNeedsContainer({ onNeedsUpdate, utilityItems }) {
    
    return (
        <div className="special-needs-container">
            <h2>Special Needs Trackers (Orders Page)</h2>
            
            <div className="trackers-grid">
                
                {/* 1. Cargo Ship Tracker (Green Header) */}
                <CargoShipTracker 
                    onNeedsUpdate={onNeedsUpdate}
                    utilityItems={utilityItems}
                />

                {/* 2. War Deliveries Tracker (Red Header) */}
                <WarTracker 
                    onNeedsUpdate={onNeedsUpdate}
                    utilityItems={utilityItems}
                />

                {/* 3. Epic Project Tracker (Yellow Header) */}
                <EpicProjectTracker 
                    onNeedsUpdate={onNeedsUpdate} 
                    utilityItems={utilityItems}
                />
                
                {/* 4. Export HQ Tracker (Purple Header - Dynamic Container) */}
                <ExportTracker 
                    onNeedsUpdate={onNeedsUpdate} 
                    utilityItems={utilityItems} 
                />
                
                {/* 5, 6, 7. AIRPORT TRACKERS (Blue Headers - 3 Separate Tiles) */}
                <AirportLondonTracker 
                    onNeedsUpdate={onNeedsUpdate}
                    utilityItems={utilityItems}
                />
                <AirportParisTracker 
                    onNeedsUpdate={onNeedsUpdate}
                    utilityItems={utilityItems}
                />
                <AirportTokyoTracker 
                    onNeedsUpdate={onNeedsUpdate}
                    utilityItems={utilityItems}
                />
                
                {/* Placeholder for Building Upgrade Tracker, uncomment when ready */}
                {/* <BuildingUpgradeTracker 
                    onNeedsUpdate={onNeedsUpdate} 
                    utilityItems={utilityItems} 
                /> */}
            </div>
        </div>
    );
}