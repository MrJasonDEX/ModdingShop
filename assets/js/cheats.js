const cheatData = {
    submachineGuns: {
        title: "Submachine Guns",
        items: [
            { name: "Kuda", code: "10" },
            { name: "VMP", code: "14" },
            { name: "Weevil", code: "15" },
            { name: "Vesper", code: "12" },
            { name: "Pharo", code: "11" },
            { name: "Razorback", code: "13" },
            { name: "HG40", code: "17" },
            { name: "DIY 11 Renovator", code: "19" },
            { name: "HLX4", code: "18" },
            { name: "PPSH", code: "38" },
            { name: "AK74u", code: "16" },
            { name: "XMC", code: "34" },
            { name: "Sten", code: "110" }
        ]
    },
    assaultRifles: {
        title: "Assault Rifles",
        items: [
            { name: "KN44", code: "20" },
            { name: "XR2", code: "24" },
            { name: "HVK-30", code: "22" },
            { name: "ICR-1", code: "21" },
            { name: "Man-O-War", code: "23" },
            { name: "Sheiva", code: "26" },
            { name: "M8A7", code: "25" },
            { name: "MX Garand", code: "28" },
            { name: "FFAR", code: "29" },
            { name: "Peacekeeper MK2", code: "7" },
            { name: "LV8 Basilisk", code: "36" },
            { name: "M16", code: "37" },
            { name: "Galil", code: "126" },
            { name: "KVK-99m", code: "27" },
            { name: "M14", code: "129" }
        ]
    },
    attachments: {
        title: "Attachments",
        items: [
            { name: "Quickdraw", code: "6" },
            { name: "Grip", code: "8" },
            { name: "Stock", code: "9" },
            { name: "High Caliber", code: "10" },
            { name: "FMJ", code: "11" },
            { name: "Rapid Fire", code: "17" }
        ]
    },
    perks: {
        title: "Perks",
        items: [
            { name: "Afterburner", code: "154" },
            { name: "Ghost", code: "151" },
            { name: "Scavenger", code: "157" },
            { name: "Fast Hands", code: "159" },
            { name: "Dead Silence", code: "165" }
        ]
    },
    scorestreaks: {
        title: "Scorestreaks",
        items: [
            { name: "HC-XD", code: "198" },
            { name: "UAV", code: "199" },
            { name: "Care Package", code: "202" },
            { name: "Counter-UAV", code: "201" },
            { name: "Dart", code: "224" },
            { name: "Guardian", code: "203" },
            { name: "Lightning Strike", code: "205" }
        ]
    },
    specialists: {
        title: "Specialists",
        items: [
            { name: "Rogue", code: "93" },
            { name: "Gambler", code: "92" },
            { name: "Gravity Spikes", code: "113" },
            { name: "Sparrow", code: "117" }
        ]
    },
    gobblegums: {
        title: "Gobblegums",
        items: [
            { name: "Tone Death", code: "190" },
            { name: "Soda Fountain", code: "191" },
            { name: "Reign Drops", code: "192" }
        ]
    },
    // Add new categories from Mods folder
    shotguns: {
        title: "Shotguns",
        items: [
            { name: "KRM 262", code: "52" },
            { name: "205 Brecci", code: "53" },
            { name: "Haymaker 12", code: "50" }
        ]
    },
    lightMachineGuns: {
        title: "Light Machine Guns",
        items: [
            { name: "BRM", code: "32" },
            { name: "Dingo", code: "30" },
            { name: "Gorgon", code: "33" },
            { name: "48 Dredge", code: "31" },
            { name: "R70 Ajax", code: "35" },
            { name: "RPK", code: "128" }
        ]
    },
    snipers: {
        title: "Snipers",
        items: [
            { name: "Drakon", code: "41" },
            { name: "Locus", code: "40" },
            { name: "P-06", code: "43" },
            { name: "SVG 100", code: "42" }
        ]
    },
    camos: {
        title: "Camos",
        items: [
            { name: "Dark Matter", code: "17" },
            { name: "Diamond", code: "16" },
            { name: "Gold", code: "15" },
            { name: "Weaponized 115", code: "28" }
        ]
    },
    wildcards: {
        title: "Wildcards",
        items: [
            { name: "Primary Gunfighter", code: "178" },
            { name: "Overkill", code: "182" },
            { name: "Danger Close", code: "186" }
        ]
    },
    zombies: {
        title: "Zombies Cheats",
        items: [
            { name: "Unlimited Beast Mode", code: "301" },
            { name: "God Mode", code: "302" },
            { name: "Instant Kill", code: "303" },
            { name: "Max Points", code: "304" },
            { name: "All Perks", code: "305" }
        ]
    },
    specialWeapons: {
        title: "Special Weapons",
        items: [
            { name: "Death Machine", code: "401" },
            { name: "Shadow Claw", code: "402" },
            { name: "Ballistic Knife", code: "403" },
            { name: "D13 Sector", code: "404" }
        ]
    }
};

function renderCheats(category = 'all') {
    const container = document.getElementById('cheatsList');
    container.innerHTML = '';
    
    Object.entries(cheatData).forEach(([key, data]) => {
        if (category === 'all' || category === key) {
            const section = document.createElement('div');
            section.className = 'cheat-category';
            section.innerHTML = `
                <h2>${data.title}</h2>
                <div class="cheat-list">
                    ${data.items.map(item => `
                        <div class="cheat-item">
                            <div class="name">${item.name}</div>
                            <div class="code">${item.code}</div>
                            <button onclick="copyCode('${item.code}')">Copy</button>
                        </div>
                    `).join('')}
                </div>
            `;
            container.appendChild(section);
        }
    });
}

// Add copy functionality
function copyCode(code) {
    navigator.clipboard.writeText(code);
    showToast('Code copied!');
}

function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast success';
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2000);
}

// Add favorite system
function toggleFavorite(code) {
    const favorites = JSON.parse(localStorage.getItem('favoritesCheats') || '[]');
    const index = favorites.indexOf(code);
    
    if (index === -1) {
        favorites.push(code);
    } else {
        favorites.splice(index, 1);
    }
    
    localStorage.setItem('favoritesCheats', JSON.stringify(favorites));
    renderCheats(currentCategory);
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    renderCheats();
    
    // Category filter
    document.querySelectorAll('.list-group-item').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.list-group-item').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            renderCheats(e.target.dataset.category);
        });
    });
    
    // Search
    document.getElementById('searchCheats').addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        document.querySelectorAll('.cheat-item').forEach(item => {
            const text = item.textContent.toLowerCase();
            item.style.display = text.includes(query) ? 'block' : 'none';
        });
    });
});
