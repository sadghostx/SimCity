// src/components/BuildingUpgradeTracker.jsx (FINAL CORRECTED CODE)

import React, { useState, useEffect, useCallback } from 'react';

// Define the initial state for the 3 slots required for a building upgrade
const initialSlots = [
    { id: 1, item: '', quantity: 0 }, 
    { id: 2, item: '', quantity: 0 },
    { id: 3, item: '', quantity: 0 },
];

export default function BuildingUpgradeTracker({ onNeedsUpdate, utilityItems = {}, id, regionSelectorJSX, region, buildingType }) {
    const [slots, setSlots] = useState(initialSlots);
    const [isCompleted, setIsCompleted] = useState(false); 

    const trackerId = `buildingUpgrade_${id}`; 

    // --- ADDED: Helper function to create a safe CSS class name from buildingType ---
    const typeClass = buildingType.toLowerCase().replace(/[^a-z0-9]/g, '-');


    const calculateNeeds = useCallback(() => {
        const needs = {};
        if (!isCompleted) {
            slots.forEach(slot => {
                if (slot.quantity > 0 && slot.item.trim() !== '') {
                    const itemName = slot.item.toLowerCase(); 
                    needs[itemName] = (needs[itemName] || 0) + slot.quantity;
                }
            });
        }
        onNeedsUpdate({ [trackerId]: needs });
    }, [slots, onNeedsUpdate, trackerId, isCompleted]);

    useEffect(() => {
        calculateNeeds();
    }, [calculateNeeds]);


    const handleSlotChange = (slotId, field, value) => {
        setSlots(prevSlots => prevSlots.map(slot => {
            if (slot.id === slotId) {
                let newValue = value;
                if (field === 'quantity') {
                    newValue = Math.min(99, Math.max(0, Number(value))); 
                }
                return { ...slot, [field]: newValue }; 
            }
            return slot;
        }));
        setIsCompleted(false); 
    };
    
    const handleToggleCompletion = () => {
        if (isCompleted) {
            setSlots(initialSlots.map(slot => ({ 
                ...slot, 
                item: '',
                quantity: 0,
            })));
            setIsCompleted(false);
        } else {
            setIsCompleted(true);
            onNeedsUpdate({ [trackerId]: {} });
        }
    };

    const hasContent = slots.some(slot => slot.item.trim() !== '' || slot.quantity > 0);


    return (
        // --- CORRECTED: Added the dynamic type class here ---
        <div className={`utility-card building-upgrade-tracker type-${typeClass} ${isCompleted ? 'completed-tile' : ''}`}>
            
            {/* Header: Displays Building Type and Region for clarity */}
            <h3>{buildingType} Upgrade ({region})</h3>

            {/* Injected Layered Header with Dropdowns (Region/Type) */}
            {regionSelectorJSX}

            {/* Column Header Bar: Item | Own | Need | Left (4 columns) */}
            <div className="tracker-header-bar upgrade-header-bar"> 
                <span className="header-item">Item</span>
                <span className="header-own">Own</span>
                <span className="header-needed">Need</span>
                <span className="header-left">Left</span>
            </div>

            <div className="utility-content">
                {slots.map(slot => {
                    const itemName = slot.item.toLowerCase();
                    const ownedQuantity = utilityItems[itemName]?.have || 0;
                    const remainingShortfall = Math.max(0, slot.quantity - ownedQuantity);

                    return (
                        <div key={slot.id} className={`tracker-row upgrade-row`}>
                            
                            <input
                                type="text"
                                value={slot.item}
                                onChange={(e) => handleSlotChange(slot.id, 'item', e.target.value)}
                                className="item-name-input"
                                disabled={isCompleted} 
                                placeholder="item"
                            />

                            <span className="own-quantity">{ownedQuantity}</span>
                            
                            <input
                                type="number"
                                value={slot.quantity}
                                min="0"
                                onChange={(e) => handleSlotChange(slot.id, 'quantity', e.target.value)}
                                className="quantity-input"
                                disabled={isCompleted}
                            />

                            <span className={`left-quantity ${remainingShortfall > 0 ? 'shortfall' : 'ok'}`}>
                                {remainingShortfall}
                            </span>
                        </div>
                    );
                })}
                
                <button 
                    onClick={handleToggleCompletion}
                    disabled={!hasContent && !isCompleted}
                    className="complete-all-button"
                >
                    {isCompleted ? 'Start New Upgrade' : 'Complete Upgrade'}
                </button>
            </div>
        </div>
    );
}