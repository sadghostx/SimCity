// src/components/UtilityItemsTab.jsx

import React, { useState, useMemo, useCallback } from 'react';

// Define all utility/expansion items and their headers
const UTILITY_ITEM_GROUPS = {
    // Currencies and Keys
    'Currencies & Keys': [
        'simcash', 
        'simoleons', 
        'golden keys', 
        'platinum keys',
        'regional coins',
        'war simoleons',
        'contest currency' 
    ],
    // War Items
    'War Items': [
        'fire extinguisher',
        'fuel canister',
        'giga-charge',
        'missile',
        'shield',
        'laser',
        'magnet',
        'gumball',
        'vortex',
        'disco fever'
    ],
    // Land and Storage (Existing Groups)
    'Land Expansion': [
        'dozer blade', 
        'dozer wheel', 
        'dozer exhaust',
        'expansion item' 
    ],
    'Storage Expansion': [
        'storage bar', 
        'storage lock', 
        'storage camera'
    ],
    'Vu Tower': [
        'vu remote', 
        'vu glove', 
        'vu battery'
    ],
    'Region Expansion': [
        'regional map',
        'regional compass',
        'regional flag',
    ]
};

const ALL_GROUPS = Object.keys(UTILITY_ITEM_GROUPS);


export default function UtilityItemsTab({ utilityItems, updateUtilityItem }) {
    
    // Handler for updating the 'Have' (In Stock) count
    const handleHaveChange = useCallback((item, value) => {
        // Only updates the 'have' count
        updateUtilityItem(item, Number(value));
    }, [updateUtilityItem]);

    // Goal/Target tracking logic is not needed for this compact view.


    // Helper to render the item rows for a single utility group tile
    const renderUtilityRows = (items) => (
        items.map(itemKey => {
            // Target is still tracked in utilityItems but not displayed/editable here
            const itemState = utilityItems[itemKey] || { have: 0, target: 0 };
            
            return (
                <div key={itemKey} className="tracker-row utility-item-row">
                    
                    {/* 1. Item Name */}
                    <span className="item-name-display">{itemKey.charAt(0).toUpperCase() + itemKey.slice(1)}</span>
                    
                    {/* 2. Editable 'Have' count */}
                    <input
                        type="number"
                        value={itemState.have}
                        onChange={(e) => handleHaveChange(itemKey, e.target.value)}
                        min="0"
                        className="inventory-input have-input"
                    />
                    
                    {/* Removed: Editable 'Target' count */}
                </div>
            );
        })
    );


    return (
        <div className="utility-items-tab-container">
            <h2>Utility and Expansion Items</h2>
            <p>Track land, storage, and Vu expansion item inventory and goals.</p>
            
            <div className="trackers-grid">
                {ALL_GROUPS.map(groupName => {
                    // Create a safe CSS class name from the group name for styling
                    const groupClass = groupName.toLowerCase().replace(/[^a-z0-9]/g, '-');
                    
                    return (
                        <div key={groupName} className={`utility-card utility-tile building-${groupClass}`}>
                            
                            {/* Tile Header: Group Name (Color controlled by CSS class) */}
                            <h3>{groupName}</h3>
                            
                            {/* Column Header Bar: Item | Have (Removed Goal) */}
                            <div className="tracker-header-bar utility-header-bar">
                                <span className="header-item">Item</span>
                                <span className="header-have">Have</span>
                                {/* Removed: Goal column header */}
                            </div>
                            
                            <div className="utility-content">
                                {renderUtilityRows(UTILITY_ITEM_GROUPS[groupName])}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}