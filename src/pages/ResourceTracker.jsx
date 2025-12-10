import React, { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid'; 

// Import all required components
import CargoShipTracker from '../components/CargoShipTracker';
import WarTracker from '../components/WarTracker';
import AirportParisTracker from '../components/AirportParisTracker';
import AirportTokyoTracker from '../components/AirportTokyoTracker';
import AirportLondonTracker from '../components/AirportLondonTracker';
import ExportTracker from '../components/ExportTracker';
import EpicProjectTracker from '../components/EpicProjectTracker';

const EXPORT_REGIONS = ['Green Valley', 'Limestone Cliffs', 'Cactus Canyon', 'Frosty Fjords', 'Sunny Isles'];

export default function ResourceTracker({ onNeedsUpdate }) {
    // State for dynamically added Export HQ trackers
    const [exportTrackers, setExportTrackers] = useState([
        { id: uuidv4(), regionName: 'Export HQ 1' }
    ]);
    
    // State to hold combined needs from all trackers
    const [allNeeds, setAllNeeds] = useState({});

    // Master function to aggregate needs from individual trackers
    const handleNeedsUpdate = useCallback((newNeeds, trackerId) => {
        setAllNeeds(prevNeeds => {
            const updatedNeeds = { ...prevNeeds };
            
            // Remove old needs for this tracker
            Object.keys(updatedNeeds).forEach(key => {
                if (key.includes(trackerId)) {
                    delete updatedNeeds[key];
                }
            });
            
            // Add new needs for this tracker
            Object.keys(newNeeds).forEach(itemName => {
                updatedNeeds[itemName] = newNeeds[itemName];
            });

            // PASSING NEEDS UPSTREAM: ADDED SAFEGUARD
            if (onNeedsUpdate) {
                onNeedsUpdate(updatedNeeds); // Update parent
            }
            
            return updatedNeeds;
        });
    }, [onNeedsUpdate]); // onNeedsUpdate is now a dependency

    // Function to add a new Export HQ Tile
    const handleAddExportTracker = () => {
        const newId = uuidv4();
        const nextIndex = exportTrackers.length + 1;
        setExportTrackers(prevTrackers => [
            ...prevTrackers,
            { id: newId, regionName: `Export HQ ${nextIndex}` }
        ]);
    };

    // Function to remove an Export HQ Tile (currently not exposed)
    const handleRemoveExportTracker = (idToRemove) => {
        setExportTrackers(prevTrackers => 
            prevTrackers.filter(tracker => tracker.id !== idToRemove)
        );
        // Also remove its needs from the aggregated list
        setAllNeeds(prevNeeds => {
            const updatedNeeds = { ...prevNeeds };
            Object.keys(updatedNeeds).forEach(key => {
                if (key.includes(idToRemove)) {
                    delete updatedNeeds[key];
                }
            });
            if (onNeedsUpdate) {
                onNeedsUpdate(updatedNeeds); // Update parent
            }
            return updatedNeeds;
        });
    };

    // Placeholder for handling region name changes in ExportTracker 
    const handleExportRegionChange = (oldName, newName) => {
        // Simple placeholder for now.
    };

    return (
        <div className="main-content">
            {/* ======================================================= */}
            {/* SPECIAL NEEDS TRACKERS (The main grid) */}
            {/* ======================================================= */}
            <h2>Special Needs</h2>
            <div className="special-needs-container">
                
                {/* Fixed Trackers */}
                <CargoShipTracker 
                    onNeedsUpdate={(needs) => handleNeedsUpdate(needs, 'CargoShip')}
                />

                <WarTracker 
                    onNeedsUpdate={(needs) => handleNeedsUpdate(needs, 'War')}
                />

                <AirportParisTracker 
                    onNeedsUpdate={(needs) => handleNeedsUpdate(needs, 'AirportParis')}
                />

                <AirportTokyoTracker 
                    onNeedsUpdate={(needs) => handleNeedsUpdate(needs, 'AirportTokyo')}
                />

                <AirportLondonTracker 
                    onNeedsUpdate={(needs) => handleNeedsUpdate(needs, 'AirportLondon')}
                />

                {/* Dynamic Export HQ Trackers */}
                {exportTrackers.map((tracker) => (
                    <ExportTracker
                        key={tracker.id}
                        regionName={tracker.regionName}
                        onNeedsUpdate={(needs) => handleNeedsUpdate(needs, tracker.id)} 
                        onRegionChange={handleExportRegionChange}
                        onAddTile={handleAddExportTracker} 
                    />
                ))}

            </div>

            {/* ======================================================= */}
            {/* EPIC PROJECT TRACKER */}
            {/* ======================================================= */}
            <div style={{ marginTop: '30px' }}>
                <EpicProjectTracker 
                    onNeedsUpdate={(needs) => handleNeedsUpdate(needs, 'Epic')}
                />
            </div>
            
        </div>
    );
}