// src/components/ProductionPlanner.jsx (Finalized Code)

import React, { useMemo } from 'react';

// ProductionPlanner receives all aggregated needs (called totalNeeds in App.jsx)
export default function ProductionPlanner({ totalNeeds, utilityItems, onUtilityUpdate }) {
    
    // 1. Combine all tracker needs into a single map of { item: total_needed }
    const aggregatedNeedsMap = useMemo(() => {
        const needsMap = {};
        
        // totalNeeds is an object like: { cargoShip: {nail: 3}, war: {cheese: 2}, ... }
        Object.values(totalNeeds).forEach(trackerNeeds => {
            for (const item in trackerNeeds) {
                // Ensure item names are lowercase for consistent aggregation
                const lowerItem = item.toLowerCase();
                needsMap[lowerItem] = (needsMap[lowerItem] || 0) + trackerNeeds[item];
            }
        });
        return needsMap;
    }, [totalNeeds]);

    // 2. Calculate the final production plan and remaining shortfall for display
    const productionPlan = useMemo(() => {
        const plan = [];

        // Collect all unique item names from both the needs map and the inventory
        const allItemNames = new Set([
            ...Object.keys(aggregatedNeedsMap), 
            ...Object.keys(utilityItems)
        ]);

        const sortedItemNames = Array.from(allItemNames).sort();

        // Pass 1: Calculate initial plan and shortfalls
        for (const item of sortedItemNames) {
            const needed = aggregatedNeedsMap[item] || 0;
            const have = utilityItems[item]?.have || 0;
            const remaining = needed - have; // Can be negative (surplus)

            // Only display items that are needed (needed > 0) OR we have a shortfall (remaining > 0)
            if (needed > 0 || remaining > 0) {
                 plan.push({
                    item,
                    needed,
                    have,
                    remaining,
                });
            }
        }
        
        // Pass 2: Sort the plan: prioritize items with the largest shortfall first
        plan.sort((a, b) => b.remaining - a.remaining);

        return plan;
    }, [aggregatedNeedsMap, utilityItems]);


    return (
        <div className="main-content production-planner-container">
            <h2>Production Planning (Total Needs)</h2>
            <p>Displays all needed items aggregated from all orders and projects.</p>
            
            <table className="production-table">
                <thead>
                    <tr>
                        <th>Item</th>
                        <th>Needed (Total)</th>
                        <th>In Stock (Have)</th>
                        <th>Shortfall / Surplus</th>
                    </tr>
                </thead>
                <tbody>
                    {productionPlan.map(entry => (
                        <tr 
                            key={entry.item} 
                            // Highlight shortfall rows in red
                            className={entry.remaining > 0 ? 'shortfall-row' : 'ok-row'} 
                        >
                            <td>{entry.item.charAt(0).toUpperCase() + entry.item.slice(1)}</td>
                            <td>{entry.needed}</td>
                            
                            {/* Editable 'Have' count */}
                            <td>
                                <input
                                    type="number"
                                    value={entry.have}
                                    min="0"
                                    // Use onUtilityUpdate from App.jsx to persist inventory changes
                                    onChange={(e) => onUtilityUpdate(entry.item, Number(e.target.value))}
                                    className="inventory-input"
                                />
                            </td>
                            
                            <td className="remaining-cell">
                                <strong>{entry.remaining}</strong>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}