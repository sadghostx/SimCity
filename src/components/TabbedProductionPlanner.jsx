// src/components/TabbedProductionPlanner.jsx

import React, { useState } from 'react'; 
import ProductionPlanner from './ProductionPlanner'; 
import InventoryPage from './InventoryPage'; 
import UtilityItemsTab from './UtilityItemsTab';
import SpecialNeedsContainer from './SpecialNeedsContainer'; 
import BuildingUpgradeTab from './BuildingUpgradeTab'; // <-- NEW IMPORT


export default function TabbedProductionPlanner({ trackerData, updateTrackerState, totalNeeds, utilityItems, onUtilityUpdate }) {
    
    // 1. Add state to manage the active tab
    // Changed initial tab to Production for a better landing page
    const [activeTab, setActiveTab] = useState('Production'); 

    // ** CRITICAL DATA CHECK **
    if (!totalNeeds || !utilityItems || !trackerData) {
        return <div className="loading-screen">Preparing Planner...</div>;
    }
    // ****************************
    
    // 2. Define the content to display based on the active tab
    let TabContent;
    
    switch (activeTab) {
        case 'Production':
            TabContent = (
                <ProductionPlanner 
                    totalNeeds={totalNeeds} 
                    utilityItems={utilityItems} 
                    onUtilityUpdate={onUtilityUpdate}
                />
            );
            break;
            
        case 'Inventory':
            TabContent = (
                <InventoryPage 
                    trackerData={trackerData} 
                    updateTrackerState={updateTrackerState} 
                />
            );
            break;

        case 'Needs':
            TabContent = (
                <SpecialNeedsContainer 
                    trackerData={trackerData} 
                    updateTrackerState={updateTrackerState} 
                />
            );
            break;
            
        case 'Utility':
            TabContent = (
                <UtilityItemsTab 
                    trackerData={trackerData} 
                    updateTrackerState={updateTrackerState} 
                />
            );
            break;

        case 'Building': // <-- NEW CASE FOR BUILDING UPGRADES
            TabContent = (
                <BuildingUpgradeTab 
                    // This tab component handles its own state for the six trackers,
                    // but needs the global update and utility items for calculations.
                    onNeedsUpdate={updateTrackerState} 
                    utilityItems={utilityItems} 
                />
            );
            break;
            
        default:
            TabContent = <ProductionPlanner totalNeeds={totalNeeds} utilityItems={utilityItems} onUtilityUpdate={onUtilityUpdate} />;
    }


    return (
        <div className="production-tab-container">
            {/* 3. Add the navigation buttons (Now 5 buttons) */}
            <div className="tab-navigation">
                <button 
                    className={activeTab === 'Production' ? 'active' : ''}
                    onClick={() => setActiveTab('Production')}
                >
                    Production Plan
                </button>
                <button 
                    className={activeTab === 'Inventory' ? 'active' : ''}
                    onClick={() => setActiveTab('Inventory')}
                >
                    Inventory
                </button>
                <button 
                    className={activeTab === 'Utility' ? 'active' : ''}
                    onClick={() => setActiveTab('Utility')}
                >
                    Utility Items
                </button>
                <button 
                    className={activeTab === 'Needs' ? 'active' : ''}
                    onClick={() => setActiveTab('Needs')}
                >
                    Orders & Upgrades
                </button>
                <button // <-- NEW TAB BUTTON
                    className={activeTab === 'Building' ? 'active' : ''}
                    onClick={() => setActiveTab('Building')}
                >
                    Building Upgrades
                </button>
            </div>
            
            {/* 4. Display the selected content */}
            <div className="tab-content">
                {TabContent}
            </div>
            
        </div>
    );
}