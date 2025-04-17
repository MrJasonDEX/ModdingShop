document.addEventListener('DOMContentLoaded', () => {
    const cheats = [
        { id: 1, name: 'Cheat A', platform: 'PC', description: 'PC Cheat A description', downloadUrl: '#' },
        { id: 2, name: 'Cheat B', platform: 'PS3', description: 'PS3 Cheat B description', downloadUrl: '#' },
        { id: 3, name: 'Cheat C', platform: 'PS4', description: 'PS4 Cheat C description', downloadUrl: '#' },
        { id: 4, name: 'Cheat D', platform: 'PC', description: 'PC Cheat D description', downloadUrl: '#' },
        { id: 5, name: 'Cheat E', platform: 'PS3', description: 'PS3 Cheat E description', downloadUrl: '#' },
    ];

    const platforms = {
        PC: document.getElementById('pcDownloads'),
        PS3: document.getElementById('ps3Downloads'),
        PS4: document.getElementById('ps4Downloads'),
    };

    cheats.forEach(cheat => {
        const cheatCard = document.createElement('div');
        cheatCard.className = 'cheat-card';
        cheatCard.innerHTML = `
            <h3>${cheat.name}</h3>
            <p>${cheat.description}</p>
            <a href="${cheat.downloadUrl}" class="download-btn">Download</a>
        `;
        platforms[cheat.platform].appendChild(cheatCard);
    });
});
