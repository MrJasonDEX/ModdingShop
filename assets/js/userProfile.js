class UserProfile {
    constructor(userId) {
        this.userId = userId;
        this.purchases = new PurchaseHistory();
        this.downloads = new DownloadHistory();
    }

    async loadProfile() {
        const [profile, stats] = await Promise.all([
            fetch(`/api/users/${this.userId}/profile`).then(r => r.json()),
            fetch(`/api/users/${this.userId}/stats`).then(r => r.json())
        ]);

        this.renderProfile(profile);
        this.renderStats(stats);
    }

    async updateAvatar(file) {
        const formData = new FormData();
        formData.append('avatar', file);

        await fetch('/api/users/avatar', {
            method: 'POST',
            body: formData
        });
    }
}

class PurchaseHistory {
    async getHistory() {
        return fetch('/api/users/purchases').then(r => r.json());
    }
}
