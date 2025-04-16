class LocalStorage {
    static set(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    }

    static get(key) {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    }

    static remove(key) {
        localStorage.removeItem(key);
    }

    static clear() {
        localStorage.clear();
    }
}

class ClientDB {
    constructor() {
        this.dbName = 'ModShopDB';
        this.version = 1;
    }

    async init() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.version);
            
            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve(request.result);
            
            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                
                if (!db.objectStoreNames.contains('mods')) {
                    db.createObjectStore('mods', { keyPath: 'id' });
                }
                if (!db.objectStoreNames.contains('downloads')) {
                    db.createObjectStore('downloads', { keyPath: 'id' });
                }
            };
        });
    }
}

class StaticDataManager {
    static async loadMods() {
        try {
            const response = await fetch('/ModdingShop/data/mods.json');
            const data = await response.json();
            LocalStorage.set('mods', data.mods);
            return data.mods;
        } catch (error) {
            return LocalStorage.get('mods') || [];
        }
    }

    static async loadCategories() {
        // ...existing code...
    }
}
