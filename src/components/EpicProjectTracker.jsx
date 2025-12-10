// src/components/EpicProjectTracker.jsx

import React, { useState, useEffect, useCallback } from 'react';

// Start with a minimal initial state, using empty strings for item names
const initialSlots = [
    { id: 1, item: '', quantity: 0, points: 1, completed: false }, 
    { id: 2, item: '', quantity: 0, points: 1, completed: false },
    { id: 3, item: '', quantity: 0, points: 1, completed: false },
];

let nextId = initialSlots.length + 1;

// IMPORTANT: Use utilityItems = {} as a safe default
export default function EpicProjectTracker({ onNeedsUpdate, utilityItems = {} }) {
    const [slots, setSlots] = useState(initialSlots);
    const [currentPoints, setCurrentPoints] = useState(0);

    // Calculates and sends item needs up to App.jsx
    const calculateNeeds = useCallback(() => {
        let totalPoints = 0;
        const needs = {};

        slots.forEach(slot => {
            // Only aggregate needs if not completed, quantity > 0, and item name is entered
            if (!slot.completed && slot.quantity > 0 && slot.item.trim() !== '') {
                const itemName = slot.item.toLowerCase(); 
                needs[itemName] = (needs[itemName] || 0) + slot.quantity;
            }
            // Calculate total points from all completed slots
            if (slot.completed) {
                totalPoints += slot.points;
            }
        });
        
        setCurrentPoints(totalPoints);
        // Send needs with unique key 'epicProject'
        onNeedsUpdate({ epicProject: needs });
    }, [slots, onNeedsUpdate]);

    useEffect(() => {
        calculateNeeds();
    }, [calculateNeeds]);


    // Handler for changing item name, quantity, or points
    const handleSlotChange = (id, field, value) => {
        setSlots(prevSlots => prevSlots.map(slot => {
            if (slot.id === id) {
                let newValue = value;
                if (field === 'quantity' || field === 'points') {
                    // Ensure non-negative and cap points at a reasonable max (e.g., 3)
                    newValue = Math.max(0, Number(value));
                    if (field === 'points') {
                        newValue = Math.min(3, newValue); 
                    }
                }
                return { ...slot, [field]: newValue, completed: false };
            }
            return slot;
        }));
    };

    // Handler for completing a single slot (Checkbox Toggler)
    const handleSlotComplete = (id) => {
        setSlots(prevSlots => prevSlots.map(slot => 
            slot.id === id ? { ...slot, completed: !slot.completed } : slot
        ));
    };

    // Handler for adding a new empty row
    const handleAddItem = () => {
        setSlots(prevSlots => [
            ...prevSlots,
            { id: nextId++, item: '', quantity: 0, points: 1, completed: false },
        ]);
    };

    // Handler to reset the project (removes extra rows, unchecks all)
    const handleCompleteProject = () => {
        setSlots(initialSlots.map(slot => ({ 
            ...slot, 
            completed: false,
        })));
        setCurrentPoints(0);
    };

    const allCompleted = slots.length > 0 && slots.every(slot => slot.completed);


    return (
        <div className="utility-card epic-project-tracker">
            <h3>Epic Project</h3>
            
            {/* Display Current Points */}
            <div className="current-points-display">
                Current Points: <span>{currentPoints}</span>
            </div>

            {/* Column Header Bar: Item | Own | Need | Left | Points | Done */}
            <div className="tracker-header-bar epic-header">
                <span className="header-item">Item</span>
                <span className="header-own">Own</span>
                <span className="header-needed">Need</span>
                <span className="header-left">Left</span>
                <span className="header-points">Pts</span> {/* New Points Header */}
                <span className="header-action">Done</span>
            </div>

            <div className="utility-content">
                {slots.map(slot => {
                    const itemName = slot.item.toLowerCase();
                    const ownedQuantity = utilityItems[itemName]?.have || 0;
                    const remainingShortfall = Math.max(0, slot.quantity - ownedQuantity);

                    return (
                        <div key={slot.id} className={`tracker-row epic-row ${slot.completed ? 'completed' : ''}`}>
                            
                            {/* 1. Editable Item Name */}
                            <input
                                type="text"
                                value={slot.item}
                                onChange={(e) => handleSlotChange(slot.id, 'item', e.target.value)}
                                className="item-name-input"
                                disabled={slot.completed}
                                placeholder="item"
                            />

                            {/* 2. Own Quantity (from Inventory) */}
                            <span className="own-quantity">{ownedQuantity}</span>
                            
                            {/* 3. Editable Need Quantity Input */}
                            <input
                                type="number"
                                value={slot.quantity}
                                min="0"
                                onChange={(e) => handleSlotChange(slot.id, 'quantity', e.target.value)}
                                className="quantity-input"
                                disabled={slot.completed}
                            />

                            {/* 4. Left Quantity (Shortfall Calculation) */}
                            <span className={`left-quantity ${remainingShortfall > 0 ? 'shortfall' : 'ok'}`}>
                                {remainingShortfall}
                            </span>
                            
                            {/* 5. Points Input (New Column) */}
                            <input
                                type="number"
                                value={slot.points}
                                min="1"
                                max="3"
                                onChange={(e) => handleSlotChange(slot.id, 'points', e.target.value)}
                                className="points-input"
                                disabled={slot.completed}
                            />

                            {/* 6. Checkbox Action */}
                            <input
                                type="checkbox"
                                checked={slot.completed}
                                onChange={() => handleSlotComplete(slot.id)} 
                                className="complete-checkbox"
                            />
                        </div>
                    );
                })}
                
                {/* Button to add more items */}
                <button 
                    onClick={handleAddItem}
                    className="complete-all-button add-item-button"
                >
                    + Add Item
                </button>
                
                {/* Button to reset the project */}
                <button 
                    onClick={handleCompleteProject}
                    disabled={!allCompleted}
                    className="complete-all-button reset-button"
                >
                    Reset Project
                </button>
            </div>
        </div>
    );
}