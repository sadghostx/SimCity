// --- src/components/UtilityCard.jsx (New File: Click-to-Edit Utility Card) ---

import React, { useState } from 'react';
import Modal from './Modal'; // Assumes you have a Modal component

// Component to display an individual item's current 'have' value
const UtilityItemView = ({ item }) => (
    <div className="utility-item-view">
        <span className="item-name">{item.name}</span>
        <span className="item-value">{item.have.toLocaleString()}</span>
    </div>
);

// Component inside the Modal for editing
const UtilityItemEdit = ({ item, onTempUpdate }) => {
    const handleChange = (e) => {
        const numericValue = String(e.target.value).replace(/[^0-9]/g, '');
        onTempUpdate(item.name, parseInt(numericValue, 10) || 0);
    };

    return (
        <div className="utility-item-edit">
            <label className="item-name">{item.name}</label>
            <input
                type="number"
                value={item.have}
                onChange={handleChange}
                className="card-input"
                min="0"
                placeholder="0"
            />
        </div>
    );
};


// Main Utility Card Component
export default function UtilityCard({ group, onUpdate }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    // Use temporary state for editing to prevent live updates before 'Save'
    const [tempItems, setTempItems] = useState(group.items);

    // Handler for temporary changes inside the modal
    const handleTempUpdate = (itemName, newValue) => {
        setTempItems(prevItems => prevItems.map(item =>
            item.name === itemName ? { ...item, have: newValue } : item
        ));
    };

    // Handler to open modal and initialize temp state
    const handleOpen = () => {
        setTempItems(group.items);
        setIsModalOpen(true);
    };

    // Handler to save changes
    const handleSave = () => {
        // Apply all changes from tempItems to the main state
        tempItems.forEach(item => {
            onUpdate(group.name, item.name, 'have', item.have);
        });
        setIsModalOpen(false);
    };

    return (
        <div className="utility-card" onClick={handleOpen}>
            <div className="card-header" style={{ backgroundColor: group.color || '#555' }}>
                {group.name} (Click to Edit)
            </div>
            <div className="card-content">
                {group.items.map(item => (
                    <UtilityItemView key={item.name} item={item} />
                ))}
            </div>

            {isModalOpen && (
                <Modal 
                    title={`Edit ${group.name}`} 
                    onClose={() => setIsModalOpen(false)} 
                    onSave={handleSave}
                >
                    <div className="utility-edit-grid">
                        {tempItems.map(item => (
                            <UtilityItemEdit 
                                key={item.name} 
                                item={item} 
                                onTempUpdate={handleTempUpdate}
                            />
                        ))}
                    </div>
                </Modal>
            )}
        </div>
    );
}