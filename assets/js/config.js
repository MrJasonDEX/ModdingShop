const CONFIG = {
    SITE_NAME: "Modding Ninja's",
    DATA_URLS: {
        BASE: '/ModdingShop',
        MODS: '/ModdingShop/data/mods.json',
        CATEGORIES: '/ModdingShop/data/categories.json',
        DOWNLOADS: '/ModdingShop/data/downloads.json'
    },
    STORAGE_KEYS: {
        USER_DATA: 'modshop_user',
        DOWNLOADS: 'modshop_downloads',
        SETTINGS: 'modshop_settings'
    },
    UI: {
        THEME: 'dark',
        ANIMATIONS: true,
        TOAST_DURATION: 3000
    },
    STORAGE: {
        TYPE: 'localStorage', // For GitHub Pages compatibility
        PREFIX: 'modshop_',
        ENCRYPTION: true
    },
    FEATURES: {
        OFFLINE_SUPPORT: true,
        LOCAL_VERIFICATION: true,
        PROGRESS_TRACKING: true
    },
    SECURITY: {
        CLIENT_SIDE_VALIDATION: true,
        HASH_VERIFICATION: true,
        INTEGRITY_CHECK: true
    }
};

// Environment-specific settings
const ENV = {
    isDevelopment: window.location.hostname === 'localhost',
    isProd: window.location.hostname === 'your-prod-domain.com'
};
