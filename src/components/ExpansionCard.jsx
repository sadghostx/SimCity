// --- src/components/ExpansionCard.jsx (Final, Stable Code with Default Props) ---

import React from 'react';

const ExpansionItem = ({ item, onUpdate }) => {
    const handleChange = (field, value) => {
        // Only allow non-negative integer input
        const numericValue = String(value).replace(/[^0-9]/g, '');
        onUpdate(item.id, field, parseInt(numericValue, 10) || 0);
    };

    return (
        <div className="card-item">
            <span className="card-item-label">
                {item.name} 
                {item.needed > 0 && <span style={{ color: 'red', marginLeft: '5px', fontSize: '0.8em' }}>({item.needed} Needed)</span>}
            </span>
            <label>
                Have:
                <input
                    type="number"
                    value={item.have}
                    onChange={(e) => handleChange('have', e.target.value)}
                    className="card-input"
                    min="0"
                    placeholder="0"
                />
            </label>
            <label style={{ marginLeft: '10px' }}>
                Req:
                <input
                    type="number"
                    value={item.required}
                    onChange={(e) => handleChange('required', e.target.value)}
                    className="card-input"
                    min="0"
                    placeholder="0"
                />
            </label>
        </div>
    );
};


// Main Expansion Card Component
export default function ExpansionCard({ title, headerColor, items = [], onUpdate }) {
    // Check if items is an array before mapping
    const itemsToRender = Array.isArray(items) ? items : [];

    return (
        <div className="expansion-card">
            <div className="card-header" style={{ backgroundColor: headerColor }}>
                {title}
            </div>
            <div className="card-content">
                {itemsToRender.length === 0 ? (
                    <p style={{ textAlign: 'center', margin: '10px 0' }}>No expansion items defined.</p>
                ) : (
                    itemsToRender.map(item => (
                        <ExpansionItem 
                            key={item.id} 
                            item={item} 
                            onUpdate={onUpdate}
                        />
                    ))
                )}
            </div>
            {/* Footer remains empty or can be added */}
        </div>
    );
}