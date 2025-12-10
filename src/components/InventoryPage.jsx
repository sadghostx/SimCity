// src/components/InventoryPage.jsx (Final Code - Tiled, Sorted, Have/Needed Columns)

import React, { useMemo, useCallback } from 'react';

// --- Comprehensive Production Data ---
const ITEM_TO_BUILDING_MAP = {
    // Factory Items
    'metal': 'Factory', 'wood': 'Factory', 'plastic': 'Factory', 'seed': 'Factory', 
    'mineral': 'Factory', 'textiles': 'Factory', 'glass': 'Factory', 'chemical': 'Factory', 
    'sugar': 'Factory', 'spice': 'Factory',
    
    // Hardware Store
    'nail': 'Hardware Store', 'plank': 'Hardware Store', 'brick': 'Hardware Store', 
    'cement': 'Hardware Store', 'glue': 'Hardware Store', 'measuring tape': 'Hardware Store',
    
    // Farmers Market
    'vegetables': 'Farmers Market', 'corn': 'Farmers Market', 'fruit': 'Farmers Market', 
    'cream': 'Farmers Market', 'cheese': 'Farmers Market', 'meat': 'Farmers Market', 
    'coffee beans': 'Farmers Market',
    
    // Building Supplies Store
    'paint': 'Building Supplies', 'wire': 'Building Supplies', 'concrete': 'Building Supplies', 
    'ladder': 'Building Supplies', 'window': 'Building Supplies', 'wallpaper': 'Building Supplies',
    
    // Furniture Store
    'chair': 'Furniture Store', 'table': 'Furniture Store', 'home textile': 'Furniture Store', 
    'cabinet': 'Furniture Store', 'sofa': 'Furniture Store', 'lighting': 'Furniture Store',
    
    // Fashion Store
    'hat': 'Fashion Store', 'shoes': 'Fashion Store', 'gloves': 'Fashion Store', 
    'watch': 'Fashion Store', 'backpack': 'Fashion Store', 'suit': 'Fashion Store',
    
    // Fast Food Shop
    'burger': 'Fast Food Shop', 'pizza': 'Fast Food Shop', 'fries': 'Fast Food Shop',
    
    // Lemonade Stand
    'lemonade': 'Lemonade Stand', 

    // Donut Shop
    'donut': 'Donut Shop',
    
    // Bakery
    'flour bag': 'Bakery', 'bread': 'Bakery', 'roll': 'Bakery', 'bagel': 'Bakery', 
    'cake': 'Bakery', 'cookie': 'Bakery',
    
    // GOURMET FOOD, HOME APPLIANCE, and other special stores should be added here
};


// Define the desired order for primary industrial buildings
const INDUSTRIAL_PRIORITY = ['Factory', 'Hardware Store'];

// Gets a list of all unique building names and applies custom sorting
const ALL_BUILDINGS = Array.from(new Set(Object.values(ITEM_TO_BUILDING_MAP)));

ALL_BUILDINGS.sort((a, b) => {
    const aPriority = INDUSTRIAL_PRIORITY.indexOf(a);
    const bPriority = INDUSTRIAL_PRIORITY.indexOf(b);

    // If both are prioritized or both are non-prioritized, sort alphabetically
    if (aPriority === bPriority) {
        return a.localeCompare(b); 
    }

    // If A is prioritized and B is not, A comes first
    if (aPriority !== -1 && bPriority === -1) {
        return -1;
    }
    
    // If B is prioritized and A is not, B comes first
    if (aPriority === -1 && bPriority !== -1) {
        return 1;
    }

    // If both are prioritized, sort by their index in INDUSTRIAL_PRIORITY (Factory then Hardware Store)
    return aPriority - bPriority;
});


export default function InventoryPage({ utilityItems, updateUtilityItem, totalNeeds }) {
    
    // 1. Pre-calculate total needs from all trackers (essential for the 'Needed' column)
    const aggregatedNeedsMap = useMemo(() => {
        const needsMap = {};
        Object.values(totalNeeds || {}).forEach(trackerNeeds => {
            for (const item in trackerNeeds) {
                const lowerItem = item.toLowerCase();
                needsMap[lowerItem] = (needsMap[lowerItem] || 0) + trackerNeeds[item];
            }
        });
        return needsMap;
    }, [totalNeeds]);


    // 2. Group items by their producing building (No filtering, all items always visible)
    const groupedInventory = useMemo(() => {
        const groups = {};
        
        ALL_BUILDINGS.forEach(building => {
            groups[building] = [];
        });

        // Populate groups with item data and total needed quantity
        Object.entries(ITEM_TO_BUILDING_MAP).forEach(([itemKey, building]) => {
            const itemState = utilityItems[itemKey] || { have: 0 };
            
            groups[building].push({
                item: itemKey,
                building: building,
                have: itemState.have,
                needed: aggregatedNeedsMap[itemKey] || 0,
            });
        });

        // Sort items within each building group alphabetically
        for (const building in groups) {
            groups[building].sort((a, b) => a.item.localeCompare(b.item));
        }

        return groups;
    }, [utilityItems, aggregatedNeedsMap]);


    // Handler for updating the 'Have' (In Stock) count
    const handleHaveChange = useCallback((item, value) => {
        updateUtilityItem(item, Number(value));
    }, [updateUtilityItem]);


    // Helper to render the rows for a single building tile
    const renderInventoryRows = (items) => (
        items.map(entry => {
            const remainingShortfall = Math.max(0, entry.needed - entry.have);

            return (
                <div key={entry.item} className="tracker-row inventory-row">
                    {/* 1. Item Name */}
                    <span className="item-name-display">{entry.item.charAt(0).toUpperCase() + entry.item.slice(1)}</span>
                    
                    {/* 2. Editable 'Have' count */}
                    <input
                        type="number"
                        value={entry.have}
                        onChange={(e) => handleHaveChange(entry.item, e.target.value)}
                        min="0"
                        className="inventory-input have-input"
                    />
                    
                    {/* 3. Read-only 'Needed' count (Color coded for urgency) */}
                    <span 
                        className={`needed-quantity ${remainingShortfall > 0 ? 'shortfall' : 'ok'}`}
                    >
                        {entry.needed}
                    </span>
                </div>
            )
        })
    );


    return (
        <div className="inventory-page-container">
            <h2>Inventory Management (By Production Building)</h2>
            <p>Displays all standard production items, grouped by where they are made.</p>
            <div className="trackers-grid">
                {ALL_BUILDINGS.map(building => {
                    const items = groupedInventory[building];
                    
                    // Always render the tile, even if empty, as per the request to show all buildings
                    const buildingClass = building.toLowerCase().replace(/[^a-z0-9]/g, '-');
                    
                    return (
                        <div 
                            key={building} 
                            className={`utility-card inventory-tile building-${buildingClass}`}
                        >
                            
                            {/* Tile Header: Building Name (Color controlled by CSS class) */}
                            <h3>{building}</h3>
                            
                            {/* Column Header Bar: Item | Have | Needed */}
                            <div className="tracker-header-bar inventory-header-bar compact-header">
                                <span className="header-item">Item</span>
                                <span className="header-have">Have</span>
                                <span className="header-needed">Needed</span>
                            </div>
                            
                            <div className="utility-content">
                                {renderInventoryRows(items)}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}