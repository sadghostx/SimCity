// --- src/Data/ResourceData.jsx (FINAL SYNTACTICALLY CORRECT CODE) ---

// -----------------------------------------------------------
// 1. MASTER RESOURCE GROUPS (Used to initialize state for all trackers)
// -----------------------------------------------------------
const MASTER_RESOURCE_GROUPS = [
    // === SECTION 1: UTILITIES (type: 'utility') ===
    {
        name: 'Currencies & Keys',
        color: '#FFD700',
        type: 'utility', 
        items: [
            { name: 'Simoleons', time: 0, have: 0, production: 0 },
            { name: 'Platinum Keys', time: 0, have: 0, production: 0 },
            { name: 'Golden Keys', time: 0, have: 0, production: 0 },
            { name: 'SimCash', time: 0, have: 0, production: 0 },
        ],
    },
    {
        name: 'Storage & Vu Items',
        color: '#707070',
        type: 'utility', 
        items: [
            { name: 'Storage Bar', time: 0, have: 0, production: 0 }, 
            { name: 'Storage Lock', time: 0, have: 0, production: 0 }, 
            { name: 'Storage Cam', time: 0, have: 0, production: 0 }, 
            { name: 'Vu Glove', time: 0, have: 0, production: 0 }, 
            { name: 'Vu Battery', time: 0, have: 0, production: 0 },
            { name: 'Vu Remote', time: 0, have: 0, production: 0 },
        ],
    },
    {
        name: 'War & Regional Items',
        color: '#FF4500',
        type: 'utility', 
        items: [
            { name: 'War Remote', time: 0, have: 0, production: 0 },
            { name: 'War Shield', time: 0, have: 0, production: 0 },
            { name: 'War Glove', time: 0, have: 0, production: 0 },
            { name: 'Limestone', time: 0, have: 0, production: 0 },
            { name: 'Gold', time: 0, have: 0, production: 0 },
            { name: 'Lava', time: 0, have: 0, production: 0 },
        ],
    },

    // === SECTION 2: PRODUCTION ===
    {
        name: 'Raw Materials (Factories)',
        color: '#A9A9A9',
        items: [
            { name: 'Wood', time: 3, have: 0, production: 0 },
            { name: 'Plastic', time: 6, have: 0, production: 0 },
            { name: 'Seeds', time: 20, have: 0, production: 0 },
            { name: 'Minerals', time: 30, have: 0, production: 0 },
            { name: 'Chemicals', time: 120, have: 0, production: 0 },
            { name: 'Textiles', time: 180, have: 0, production: 0 },
            { name: 'Sugar and Spices', time: 240, have: 0, production: 0 },
            { name: 'Glass', time: 300, have: 0, production: 0 },
            { name: 'Animal Feed', time: 360, have: 0, production: 0 },
            { name: 'Electrical Components', time: 420, have: 0, production: 0 },
        ],
    },
    
    {
        name: 'Building Supplies Store',
        color: '#8B4513',
        items: [
            { name: 'Planks', time: 15, have: 0, production: 0 },
            { name: 'Bricks', time: 60, have: 0, production: 0 },
            { name: 'Cement', time: 120, have: 0, production: 0 },
            { name: 'Glue', time: 180, have: 0, production: 0 },
            { name: 'Paint', time: 240, have: 0, production: 0 },
        ],
    },
    // Add other stores here (e.g., Fast Food, Furniture, etc.) separated by commas
];


// -----------------------------------------------------------
// 2. EXPANSION ITEMS (Used for expansion/storage trackers)
// -----------------------------------------------------------
export const EXPANSION_ITEMS = [
    { id: 1, name: 'Land Deed', have: 0, need: 0 },
    { id: 2, name: 'Dozer Blade', have: 0, need: 0 },
    { id: 3, name: 'Shovel', have: 0, need: 0 },
];

export const EXPANSION_CARD_PROPS = {
    title: 'Expansion Tracking',
    headerColor: '#1E90FF', 
    items: EXPANSION_ITEMS.map(item => ({ name: item.name })),
};


// -----------------------------------------------------------
// 3. FINAL DEFAULT EXPORT (All data wrapped in one object)
// -----------------------------------------------------------
const ResourceData = {
    resourceGroups: MASTER_RESOURCE_GROUPS,
    expansionItems: EXPANSION_ITEMS,
    expansionCardProps: EXPANSION_CARD_PROPS,
};

export default ResourceData;