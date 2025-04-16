class DownloadTracker {
    constructor() {
        this.stats = JSON.parse(localStorage.getItem('downloadStats') || '{}');
    }
    
    trackDownload(itemId) {
        this.stats[itemId] = (this.stats[itemId] || 0) + 1;
        localStorage.setItem('downloadStats', JSON.stringify(this.stats));
        
        // Optional: Send to analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', 'download', {
                'event_category': 'Downloads',
                'event_label': itemId
            });
        }
    }
    
    getStats(itemId) {
        return this.stats[itemId] || 0;
    }
}

class DownloadStats {
    constructor() {
        this.stats = {
            totalDownloads: 0,
            activeUsers: 0
        };
    }

    async updateStats() {
        // Get stats from localStorage and server
        const localStats = JSON.parse(localStorage.getItem('downloadStats') || '{}');
        const totalDownloads = Object.values(localStats).reduce((a, b) => a + b, 0);
        
        // Update UI
        document.getElementById('totalDownloads').textContent = totalDownloads;
        document.getElementById('activeUsers').textContent = 
            Object.keys(localStats).length;
    }
}

class PlatformManager {
    constructor() {
        this.platforms = {
            PS3: {
                requiredFiles: ['EBOOT.BIN', 'USRDIR'],
                installSteps: [
                    'Backup original files',
                    'Transfer to PS3',
                    'Install patches'
                ]
            },
            PC: {
                requiredFiles: ['game.exe', 'modloader.dll'],
                installSteps: [
                    'Run as administrator',
                    'Select game process',
                    'Apply patches'
                ]
            }
        };
    }

    async verifyPlatformRequirements(platform) {
        // Platform-specific checks
    }
}

class DownloadManager {
    constructor() {
        this.currentGame = null;
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        document.querySelectorAll('.game-card').forEach(card => {
            card.addEventListener('click', () => {
                const game = card.dataset.game;
                this.loadGameMods(game);
            });
        });
    }

    async loadGameMods(gameId) {
        this.currentGame = gameId;
        const downloads = await this.fetchGameMods(gameId);
        this.renderMods(downloads);
    }

    async fetchGameMods(gameId) {
        const response = await fetch('/data/downloads.json');
        const data = await response.json();
        return data.downloads.filter(mod => mod.game === gameId);
    }

    renderMods(mods) {
        const grid = document.getElementById('downloadsGrid');
        grid.innerHTML = mods.map(mod => this.createModCard(mod)).join('');
    }

    createModCard(mod) {
        return `
            <div class="mod-card">
                <h3>${mod.name}</h3>
                <div class="mod-details">
                    <span class="version">v${mod.version}</span>
                    <p>${mod.description}</p>
                </div>
                <div class="mod-actions">
                    <button onclick="downloadManager.startDownload('${mod.id}')" class="download-btn">
                        Download
                    </button>
                </div>
            </div>
        `;
    }

    async startDownload(modId) {
        // Existing download logic...
    }
}

// Initialize
const downloadManager = new DownloadManager();
document.addEventListener('DOMContentLoaded', () => downloadManager.initialize());

class ModLoader extends DownloadManager {
    constructor() {
        super();
        this.weaponCodes = new Map();
        this.perkCodes = new Map();
        this.initializeCodebase();
    }

    async initializeCodebase() {
        const data = await fetch('/data/downloads.json').then(r => r.json());
        this.categorizeItems(data.categories);
    }

    categorizeItems(categories) {
        // Process weapon codes
        Object.entries(categories.BlackOps3.Weapons).forEach(([type, weapons]) => {
            weapons.forEach(weapon => {
                this.weaponCodes.set(weapon.id, {
                    name: weapon.name,
                    type: type,
                    attachments: weapon.attachments || []
                });
            });
        });

        // Process perk codes
        Object.entries(categories.BlackOps3.Perks).forEach(([tier, perks]) => {
            perks.forEach(perk => {
                this.perkCodes.set(perk.id, {
                    name: perk.name,
                    tier: tier
                });
            });
        });
    }

    renderDownloadCard(item) {
        return `
            <div class="download__card" data-category="${item.category}">
                <div class="download__preview">
                    <img src="assets/images/previews/${item.category.toLowerCase()}/${item.id}.jpg" 
                         alt="${item.name}"
                         onerror="this.src='assets/images/default-preview.jpg'">
                    <div class="download__badge ${item.platform.toLowerCase()}">${item.platform}</div>
                </div>
                <div class="download__info">
                    <h3>${item.name}</h3>
                    <span class="version">v${item.version}</span>
                    <p>${item.description}</p>
                    <div class="download__features">
                        ${item.features.map(f => `<span class="feature">${f}</span>`).join('')}
                    </div>
                    <div class="download__meta">
                        <span class="size">${item.size}</span>
                        <span class="updated">Updated: ${new Date(item.lastUpdated).toLocaleDateString()}</span>
                    </div>
                    <button onclick="modLoader.startDownload('${item.id}')" class="download-btn">
                        Download
                    </button>
                </div>
            </div>
        `;
    }

    async showModDetails(id) {
        const item = await this.getDownloadInfo(id);
        const modal = document.createElement('div');
        modal.className = 'mod-details-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <h2>${item.name}</h2>
                <div class="requirements">
                    <h3>Requirements</h3>
                    <ul>
                        ${Object.entries(item.requirements).map(([key, value]) => 
                            `<li><strong>${key}:</strong> ${value}</li>`
                        ).join('')}
                    </ul>
                </div>
                <div class="instructions">
                    <h3>Installation</h3>
                    <ol>
                        ${item.instructions.map(step => `<li>${step}</li>`).join('')}
                    </ol>
                </div>
                <button onclick="modLoader.startDownload('${id}')" class="download-btn">
                    Download Now
                </button>
            </div>
        `;
        document.body.appendChild(modal);
    }
}

class ModDownloadManager extends DownloadManager {
    constructor() {
        super();
        this.platformFilter = document.getElementById('platformFilter');
        this.ps4GamesFilter = document.getElementById('ps4GamesFilter');
        this.ps3GamesFilter = document.getElementById('ps3GamesFilter');
        this.setupFilters();
    }

    setupFilters() {
        this.platformFilter?.addEventListener('change', (e) => {
            // Hide all game filters first
            this.ps4GamesFilter.style.display = 'none';
            this.ps3GamesFilter.style.display = 'none';
            
            // Show appropriate filter based on platform
            switch(e.target.value) {
                case 'PS4':
                    this.ps4GamesFilter.style.display = 'block';
                    break;
                case 'PS3':
                    this.ps3GamesFilter.style.display = 'block';
                    break;
            }
            
            this.filterDownloads();
        });

        // Add change event listeners for game filters
        this.ps4GamesFilter?.addEventListener('change', () => this.filterDownloads());
        this.ps3GamesFilter?.addEventListener('change', () => this.filterDownloads());
    }

    async filterDownloads() {
        const platform = this.platformFilter.value;
        const ps4Game = this.ps4GamesFilter.value;
        const ps3Game = this.ps3GamesFilter.value;
        
        const downloads = await fetchDownloads();
        const filtered = downloads.filter(item => {
            if (platform === 'all') return true;
            
            if (platform === 'PS4') {
                return item.platform === 'PS4' && (ps4Game === 'all' || item.game === ps4Game);
            }
            
            if (platform === 'PS3') {
                return item.platform === 'PS3' && (ps3Game === 'all' || item.game === ps3Game);
            }
            
            return item.platform === platform;
        });
        
        await this.renderFilteredDownloads(filtered);
    }

    setupFilters() {
        this.gameFilter?.addEventListener('change', (e) => {
            if (e.target.value === 'bo3') {
                this.bo3Filter.style.display = 'block';
                this.loadBO3Categories();
            } else {
                this.bo3Filter.style.display = 'none';
            }
            this.filterDownloads();
        });

        this.bo3Filter?.addEventListener('change', () => this.filterDownloads());
    }

    async loadBO3Categories() {
        const data = await fetch('/data/downloads.json').then(r => r.json());
        const bo3Data = data.categories.BlackOps3;
        
        // Create tag elements for each category
        const tagContainer = document.getElementById('modTags');
        tagContainer.innerHTML = '';
        
        Object.entries(bo3Data).forEach(([category, items]) => {
            const tag = document.createElement('span');
            tag.className = 'mod-tag';
            tag.textContent = category;
            tag.onclick = () => this.filterByTag(category);
            tagContainer.appendChild(tag);
        });
    }

    renderModCard(mod) {
        return `
            <div class="download-card" data-category="${mod.category}">
                <div class="card-header">
                    <h3>${mod.name}</h3>
                    <span class="version">v${mod.version}</span>
                </div>
                <div class="card-body">
                    <p>${mod.description}</p>
                    <div class="features">
                        ${mod.features.map(f => `<span class="feature-tag">${f}</span>`).join('')}
                    </div>
                </div>
                <div class="card-footer">
                    <button onclick="downloadManager.startDownload('${mod.id}')" class="download-btn">
                        Download
                    </button>
                    <button onclick="downloadManager.showInstallGuide('${mod.id}')" class="guide-btn">
                        Installation Guide
                    </button>
                </div>
            </div>`;
    }
}

// Initialize the enhanced download system
const modLoader = new ModLoader();
const tracker = new DownloadManager();
const downloadManager = new ModDownloadManager();

async function fetchDownloads() {
    try {
        const response = await fetch('/data/downloads.json');
        const data = await response.json();
        return data.downloads;
    } catch (error) {
        console.error('Error loading downloads:', error);
        return [];
    }
}

async function checkDownloadStatus(url) {
    try {
        const response = await fetch(url, { method: 'HEAD' });
        return response.ok;
    } catch {
        return false;
    }
}

async function renderDownloads() {
    const grid = document.getElementById('downloadsGrid');
    const downloads = await fetchDownloads();
    grid.innerHTML = '';
    
    for (const item of downloads) {
        const isAvailable = await checkDownloadStatus(item.downloadUrl);
        const downloadCount = tracker.getStats(item.name);
        
        const card = document.createElement('div');
        card.className = 'download__card';
        
        card.innerHTML = `
            <div class="download__preview">
                <img src="/assets/previews/${item.category.toLowerCase()}/${item.name.toLowerCase().replace(/\s+/g, '-')}.jpg" 
                     alt="${item.name} preview"
                     onerror="this.src='/assets/images/default-preview.jpg'">
                <div class="download__info">
                    <span class="version">v${item.version}</span>
                </div>
            </div>
            <div class="card__header">
                <h3 class="download__title">${item.name}</h3>
                <span class="download-count">
                    <i class="bi bi-download"></i> ${downloadCount}
                </span>
            </div>
            <div class="download__status">
                <span class="status-dot ${isAvailable ? '' : 'offline'}"></span>
                <span class="status-text ${isAvailable ? '' : 'offline'}">
                    ${isAvailable ? 'Available' : 'Temporarily Offline'}
                </span>
            </div>
            <p class="download__description">${item.description}</p>
            <div class="download__features">
                ${item.features.map(feature => `<span class="feature-tag">${feature}</span>`).join('')}
            </div>
            <div class="download__meta">
                <span class="version">v${item.version}</span>
                <span class="updated">Updated: ${new Date(item.lastUpdated).toLocaleDateString()}</span>
            </div>
            <div class="download__stats">
                <div class="stat__item">
                    <i class="bi bi-download"></i>
                    ${downloadCount} downloads
                </div>
                <div class="stat__item">
                    <i class="bi bi-star"></i>
                    ${item.rating || '4.5'}/5
                </div>
            </div>
            <a href="${item.downloadUrl}" 
               class="download__button" 
               ${!isAvailable ? 'disabled' : ''}
               onclick="tracker.trackDownload('${item.name}')">
                <i class="bi bi-download"></i>
                ${isAvailable ? 'Download' : 'Unavailable'}
            </a>
        `;
        
        grid.appendChild(card);
    }
}

async function filterDownloads(category = 'all') {
    const downloads = await fetchDownloads();
    const grid = document.getElementById('downloadsGrid');
    grid.innerHTML = '';
    
    const filtered = category === 'all' 
        ? downloads 
        : downloads.filter(item => item.category.toLowerCase() === category.toLowerCase());
        
    for (const item of filtered) {
        const isAvailable = await checkDownloadStatus(item.downloadUrl);
        const downloadCount = tracker.getStats(item.name);
        
        const card = document.createElement('div');
        card.className = 'download__card';
        
        card.innerHTML = `
            <div class="card__header">
                <h3 class="download__title">${item.name}</h3>
                <span class="download-count">
                    <i class="bi bi-download"></i> ${downloadCount}
                </span>
            </div>
            <div class="download__status">
                <span class="status-dot ${isAvailable ? '' : 'offline'}"></span>
                <span class="status-text ${isAvailable ? '' : 'offline'}">
                    ${isAvailable ? 'Available' : 'Temporarily Offline'}
                </span>
            </div>
            <p class="download__description">${item.description}</p>
            <div class="download__features">
                ${item.features.map(feature => `<span class="feature-tag">${feature}</span>`).join('')}
            </div>
            <div class="download__meta">
                <span class="version">v${item.version}</span>
                <span class="updated">Updated: ${new Date(item.lastUpdated).toLocaleDateString()}</span>
            </div>
            <a href="${item.downloadUrl}" 
               class="download__button" 
               ${!isAvailable ? 'disabled' : ''}
               onclick="tracker.trackDownload('${item.name}')">
                <i class="bi bi-download"></i>
                ${isAvailable ? 'Download' : 'Unavailable'}
            </a>
        `;
        
        grid.appendChild(card);
    }
}

function searchDownloads(query) {
    const cards = document.querySelectorAll('.download__card');
    cards.forEach(card => {
        const title = card.querySelector('.download__title').textContent.toLowerCase();
        const desc = card.querySelector('.download__description').textContent.toLowerCase();
        const visible = title.includes(query) || desc.includes(query);
        card.style.display = visible ? 'block' : 'none';
    });
}

document.addEventListener('DOMContentLoaded', () => {
    renderDownloads();
});

document.getElementById('searchDownloads')?.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase();
    searchDownloads(query);
});

document.getElementById('categoryFilter')?.addEventListener('change', (e) => {
    const category = e.target.value;
    filterDownloads(category);
});

document.addEventListener('DOMContentLoaded', () => downloadManager.initialize());