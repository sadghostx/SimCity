// --- src/components/Modal.jsx (Revised Generic Wrapper) ---

import React from 'react';

export default function Modal({ title, children, onClose, onSave }) {
    
    if (!children) return null;

    const handleOverlayClick = (e) => {
        if (e.target.className === 'modal-overlay') {
            onClose();
        }
    };
    
    return (
        <div className="modal-overlay" onClick={handleOverlayClick}>
            
            <div className="modal-content">
                
                <div className="modal-header">
                    <h2>{title}</h2>
                    <button onClick={onClose} className="modal-close-btn">
                        &times;
                    </button>
                </div>

                <div className="modal-body">
                    {children}
                </div>
                
                <div className="modal-footer">
                    <button onClick={onClose} className="modal-btn cancel-btn">Cancel</button>
                    <button onClick={onSave} className="modal-btn save-btn">Save Changes</button>
                </div>
            </div>
        </div>
    );
}