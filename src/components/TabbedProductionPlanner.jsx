// src/components/TabbedProductionPlanner.jsx (Corrected Code)

import React from 'react';
import ProductionPlanner from './ProductionPlanner'; 

export default function TabbedProductionPlanner({ totalNeeds, utilityItems, onUtilityUpdate }) {
    
    // Total needs and utility items are passed down from App.jsx

    return (
        <div className="production-tab">
            
            {/* REMOVE the duplicate tab buttons here! */}
            {/* The main production view */}
            <ProductionPlanner 
                totalNeeds={totalNeeds} 
                utilityItems={utilityItems} 
                onUtilityUpdate={onUtilityUpdate}
            />
            
        </div>
    );
}