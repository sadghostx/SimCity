// src/components/ExportHQTracker.jsx

import React, { useState, useEffect, useCallback } from 'react';

const initialSlots = [
    { id: 1, item: '', quantity: 0, completed: false }, 
    { id: 2, item: '', quantity: 0, completed: false },
    { id: 3, item: '', quantity: 0, completed: false },
];

export default function ExportHQTracker({ onNeedsUpdate, utilityItems = {}, id, region, regionSelectorJSX }) {
    const [slots, setSlots] = useState(initialSlots);

    // Calculates and sends item needs up to App.jsx
    const calculateNeeds = useCallback(() => {
        const needs = {};
        slots.forEach(slot => {
            if (!slot.completed && slot.quantity > 0 && slot.item.trim() !== '') {
                const itemName = slot.item.toLowerCase(); 
                needs[itemName] = (needs[itemName] || 0) + slot.quantity;
            }
        });
        onNeedsUpdate({ [`exportHQ_${id}`]: needs });
    }, [slots, onNeedsUpdate, id]);

    useEffect(() => {
        calculateNeeds();
    }, [calculateNeeds]);


    // Handler for changing item name or quantity
    const handleSlotChange = (slotId, field, value) => {
        setSlots(prevSlots => prevSlots.map(slot => {
            if (slot.id === slotId) {
                let newValue = value;
                if (field === 'quantity') {
                    newValue = Math.min(99, Math.max(0, Number(value))); 
                }
                return { ...slot, [field]: newValue, completed: false };
            }
            return slot;
        }));
    };

    // Handler for completing a single slot (Checkbox Toggler)
    const handleSlotComplete = (slotId) => {
        setSlots(prevSlots => prevSlots.map(slot => 
            slot.id === slotId ? { ...slot, completed: !slot.completed } : slot
        ));
    };

    const handleRefreshDelivery = () => {
        setSlots(initialSlots.map(slot => ({ 
            ...slot, 
            completed: false,
        })));
    };

    const allCompleted = slots.every(slot => slot.completed);


    return (
        <div className="utility-card export-hq-tracker">
            
            {/* 1. Simple Header (Purple) */}
            <h3>Export HQ ({region})</h3>
            
            {/* 2. REGION SELECTOR LAYER (Injected here to mirror Epic Project) */}
            {regionSelectorJSX}
            
            {/* 3. Column Header Bar: Item | Own | Need | Left | Done */}
            <div className="tracker-header-bar">
                <span className="header-item">Item</span>
                <span className="header-own">Own</span>
                <span className="header-needed">Need</span>
                <span className="header-left">Left</span>
                <span className="header-action">Done</span>
            </div>

            <div className="utility-content">
                {slots.map(slot => {
                    const itemName = slot.item.toLowerCase();
                    const ownedQuantity = utilityItems[itemName]?.have || 0;
                    const remainingShortfall = Math.max(0, slot.quantity - ownedQuantity);

                    return (
                        <div key={slot.id} className={`tracker-row ${slot.completed ? 'completed' : ''}`}>
                            
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

                            {/* 5. Checkbox Action (Always Visible) */}
                            <input
                                type="checkbox"
                                checked={slot.completed}
                                onChange={() => handleSlotComplete(slot.id)} 
                                className="complete-checkbox"
                            />
                        </div>
                    );
                })}
                
                <button 
                    onClick={handleRefreshDelivery}
                    disabled={!allCompleted}
                    className="complete-all-button"
                >
                    {allCompleted ? 'Ready for New Order' : 'Waiting for Completion'}
                </button>
            </div>
        </div>
    );
}