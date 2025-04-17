class LoyaltySystem {
    constructor(userId) {
        this.userId = userId;
        this.points = 0;
        this.tier = 'bronze';
    }

    async loadPoints() {
        const response = await fetch(`/api/users/${this.userId}/loyalty`);
        const data = await response.json();
        this.points = data.points;
        this.tier = this.calculateTier(data.points);
    }

    awardPoints(action) {
        const pointValues = {
            'purchase': 100,
            'review': 10,
            'download': 5
        };
        return this.addPoints(pointValues[action] || 0);
    }
}
