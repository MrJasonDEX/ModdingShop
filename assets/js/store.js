class StoreManager {
    constructor() {
        this.catalog = new ModCatalog();
    }

    async loadMods() {
        try {
            const response = await fetch(CONFIG.DATA_URLS.MODS);
            const mods = await response.json();
            LocalStorage.set('mods', mods);
            return mods;
        } catch (error) {
            console.error('Failed to load mods:', error);
            return LocalStorage.get('mods') || [];
        }
    }

    async getMod(id) {
        const mods = await this.loadMods();
        return mods.find(mod => mod.id === id);
    }
}

class ModCatalog {
    constructor() {
        this.mods = new Map();
        this.categories = new Set();
        this.tags = new Set();
    }

    async searchMods(query) {
        const results = Array.from(this.mods.values()).filter(mod => 
            mod.name.toLowerCase().includes(query.toLowerCase()) ||
            mod.description.toLowerCase().includes(query.toLowerCase())
        );

        return this.rankSearchResults(results, query);
    }

    async init() {
        const mods = await fetch(CONFIG.DATA_URLS.MODS).then(r => r.json());
        mods.forEach(mod => {
            this.mods.set(mod.id, mod);
            this.categories.add(mod.category);
        });
    }
}
