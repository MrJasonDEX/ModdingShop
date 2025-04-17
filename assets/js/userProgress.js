class UserProgressSystem {
    constructor(userId) {
        this.userId = userId;
        this.levels = new Map();
        this.currentXP = 0;
        this.rewards = new RewardManager();
    }

    async addXP(amount, activity) {
        this.currentXP += amount;
        const newLevel = this.calculateLevel(this.currentXP);
        
        if (newLevel > this.currentLevel) {
            await this.levelUp(newLevel);
        }

        await this.saveProgress();
        analytics.trackEvent('Progress', 'XP Gained', activity);
    }

    calculateLevel(xp) {
        return Math.floor(Math.sqrt(xp / 100));
    }

    async levelUp(newLevel) {
        const rewards = await this.rewards.getLevelRewards(newLevel);
        notifications.notify('levelUp', { level: newLevel, rewards });
    }
}
