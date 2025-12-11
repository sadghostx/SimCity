// src/App.jsx

import React, { useState, useEffect, useCallback } from 'react';
import TabbedProductionPlanner from './components/TabbedProductionPlanner';
import Login from './pages/Login.jsx';
import { auth, db } from './firebase.jsx'; // Import Firebase services
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore'; 
import { useMemo } from 'react'; // Added useMemo for calculating totalNeeds
import './App.css'; 


// --- Full Game Item Definitions ---
const PRODUCTION_ITEM_DEFINITIONS = {
    // Factory Items (10 items)
    'factory': ['metal', 'wood', 'plastic', 'seedlings', 'mineral', 'textile', 'glass', 'chemical', 'sugar', 'spice'],
    // Hardware Store (6 items)
    'hardware store': ['nail', 'plank', 'hammer', 'measuring tape', 'shovel', 'ladder'],
    // Farmers Market (6 items)
    'farmers market': ['tomato', 'corn', 'vegetable', 'flour bag', 'fruit', 'cream'],
    // Building Supplies (6 items)
    'building supplies': ['brick', 'cement', 'glue', 'paint', 'wire', 'mower'],
    // Furniture Store (6 items)
    'furniture store': ['chair', 'table', 'home textiles', 'cupboard', 'lighting system', 'garden furniture'],
    // Fashion Store (6 items)
    'fashion store': ['cap', 'shoes', 'dress', 'backpack', 'watch', 'suit'],
    // Fast Food Shop (6 items)
    'fast food shop': ['burger', 'pizza', 'ice cream sandwich', 'cheese fries', 'sub sandwich', 'drink'],
    // Lemonade Stand (6 items)
    'lemonade stand': ['smoothie', 'donut', 'green smoothie', 'taco', 'burrito', 'sandwich'],
    // Donut Shop (6 items)
    'donut shop': ['bread roll', 'bagel', 'coffee', 'croissant', 'cookie', 'triple shot espresso'],
    // Bakery (6 items)
    'bakery': ['donut', 'baguette', 'cake', 'cherry cheesecake', 'frozen yogurt', 'cobbler'],
};

// Helper function to build the initial inventory structure (Item: { have: 0, target: 0 })
const createInitialInventory = (definitions) => {
    const inventory = {};
    Object.values(definitions).flat().forEach(item => {
        inventory[item] = { have: 0, target: 0 };
    });
    return inventory;
};

// Full list of Utility/Expansion/War/Currency Items
const initialUtilityItems = {
    // Currencies and Keys
    'simcash': { have: 0 }, 
    'simoleons': { have: 0 }, 
    'golden keys': { have: 0 }, 
    'platinum keys': { have: 0 },
    'regional coins': { have: 0 },
    'war simoleons': { have: 0 },
    'contest currency': { have: 0 },
    // War Items
    'fire extinguisher': { have: 0 },
    'fuel canister': { have: 0 },
    'giga-charge': { have: 0 },
    'missile': { have: 0 },
    'shield': { have: 0 },
    'laser': { have: 0 },
    'magnet': { have: 0 },
    'gumball': { have: 0 },
    'vortex': { have: 0 },
    'disco fever': { have: 0 },
    // Land and Storage 
    'dozer blade': { have: 0 }, 
    'dozer wheel': { have: 0 }, 
    'dozer exhaust': { have: 0 },
    'expansion item': { have: 0 }, 
    // Storage Expansion
    'storage bar': { have: 0 }, 
    'storage lock': { have: 0 }, 
    'storage camera': { have: 0 },
    // Vu Tower
    'vu remote': { have: 0 }, 
    'vu glove': { have: 0 }, 
    'vu battery': { have: 0 },
    // Region Expansion
    'regional map': { have: 0 },
    'regional compass': { have: 0 },
    'regional flag': { have: 0 },
};


// --- FINAL INITIAL TRACKER DATA (This is the structure saved for new users) ---
const initialTrackerData = {
    // 1. Inventory Page (Production Items)
    inventoryItems: createInitialInventory(PRODUCTION_ITEM_DEFINITIONS),
    productionBuildingDefinitions: PRODUCTION_ITEM_DEFINITIONS,
    
    // 2. Utility Items Tab (Expansion, War, Currency)
    utilityItems: initialUtilityItems,

    // 3. Special Needs Containers (Start empty arrays)
    cargoOrders: [], 
    warTracker: [],
    buildingUpgrades: [], 
    
    // 4. Epic Project Points
    epicProject: { 
        points: 0, 
        goal: 200, // Bronze goal
        maxGoal: 1000 // Platinum goal
    },
};
// -----------------------------------------------------------


export default function App() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [trackerData, setTrackerData] = useState(initialTrackerData);

    const userId = user?.uid;
    const userRef = userId ? doc(db, 'users', userId) : null;

    // 1. FIRESTORE DATA SAVING (Triggered by any update function)
    const saveTrackerData = useCallback(async (updatedData) => {
        if (userRef) {
            try {
                // Merge true ensures only the fields we change are updated, protecting other fields
                await setDoc(userRef, updatedData, { merge: true });
                // console.log("Data saved to Firestore.");
            } catch (error) {
                console.error("Error saving data:", error);
            }
        }
    }, [userRef]);


    // 2. FIRESTORE DATA LOADING (CRITICAL FIX APPLIED HERE)
    const loadTrackerData = useCallback(async (uid) => {
        const docRef = doc(db, 'users', uid);
        try {
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const savedData = docSnap.data();
                
                // CRITICAL FIX: Merge saved data but preserve initial structure, 
                // explicitly preventing null saved values from overwriting entire objects.
                setTrackerData({ 
                    ...initialTrackerData, 
                    ...savedData,
                    
                    // Use saved data OR fall back to the safe initial structure
                    inventoryItems: savedData.inventoryItems || initialTrackerData.inventoryItems,
                    utilityItems: savedData.utilityItems || initialTrackerData.utilityItems,
                    
                    // Optional: Add other top-level objects if they are arrays/objects prone to null
                    cargoOrders: savedData.cargoOrders || initialTrackerData.cargoOrders,
                    warTracker: savedData.warTracker || initialTrackerData.warTracker,
                    buildingUpgrades: savedData.buildingUpgrades || initialTrackerData.buildingUpgrades,
                });
                
            } else {
                console.log("No saved data found, initializing state.");
                await setDoc(docRef, initialTrackerData);
                setTrackerData(initialTrackerData);
            }
        } catch (error) {
            console.error("Error loading data:", error);
            // If load fails, set to initial state to prevent crash
            setTrackerData(initialTrackerData); 
        }
    }, []);


    // 3. AUTHENTICATION LISTENER
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setUser(currentUser);
            if (currentUser) {
                // Found a logged-in user, load their data
                await loadTrackerData(currentUser.uid);
            } else {
                // If logged out, reset to initial state
                setTrackerData(initialTrackerData);
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, [loadTrackerData]);


    // 4. WRAPPER FOR STATE UPDATES (This must be used for all component state changes)
    const updateTrackerState = useCallback((key, newValue) => {
        // Update local state
        const updatedData = { ...trackerData, [key]: newValue };
        setTrackerData(updatedData);
        
        // Save to Firestore
        saveTrackerData(updatedData);
    }, [trackerData, saveTrackerData]);
    
    
    // 5. MEMOIZED CALCULATION FOR TOTAL NEEDS (Prevent crashes if input is null)
    const totalNeeds = useMemo(() => {
        // This calculates the needs from all sub-trackers (cargo, war, etc.)
        // Since trackerData contains arrays like cargoOrders and buildingUpgrades,
        // this object must be defined to prevent crashes in child components.
        
        // Placeholder implementation (You need to implement the actual logic in your project):
        return {
            cargoOrders: trackerData.cargoOrders || [], // Array check
            buildingUpgrades: trackerData.buildingUpgrades || [], // Array check
            // Add any other components that generate needs (e.g., WarTracker, EpicProject)
        };
    }, [trackerData]);
    

    // Logout function
    const handleLogout = () => {
        signOut(auth);
        // Auth listener handles the state clear
    };


    if (loading) {
        return <div className="loading-screen">Loading authentication...</div>;
    }

    if (!user) {
        return <Login setUser={setUser} />;
    }

    // 6. FINAL CRITICAL DATA CHECK
    if (!trackerData || !trackerData.inventoryItems || !trackerData.utilityItems) {
        return <div className="loading-screen">Loading user data...</div>;
    }


    // --- RENDER MAIN APP ---
    return (
        <div className="app-container">
            <header className="simcity-header">
                <h1>SimCity BuildIt Tracker</h1>
                <div className="user-info">
                    Logged in as: <strong>{user.email}</strong> 
                    <button onClick={handleLogout} className="logout-button">Log Out</button>
                </div>
            </header>

            <TabbedProductionPlanner 
                trackerData={trackerData} 
                updateTrackerState={updateTrackerState}
                totalNeeds={totalNeeds} // Pass the calculated needs
                utilityItems={trackerData.utilityItems}
                onUtilityUpdate={updateTrackerState} // Use the main updater
            />
        </div>
    );
}
