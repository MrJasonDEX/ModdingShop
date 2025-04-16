class AchievementSystem {
    constructor(userId) {
        this.userId = userId;
        this.achievements = new Map();
        this.callbacks = new Map();
    }

    registerAchievement(id, conditions, reward) {
        this.achievements.set(id, {
            conditions,
            reward,
            earned: false,
            progress: 0
        });

        this.setupTracking(id, conditions);
    }

    async checkAchievement(id, value) {
        const achievement = this.achievements.get(id);
        if (!achievement || achievement.earned) return;

        const newProgress = await this.evaluateConditions(achievement.conditions, value);
        if (newProgress >= 100) {
            await this.unlockAchievement(id);
        } else {
            achievement.progress = newProgress;
            this.saveProgress();
        }
    }

    async unlockAchievement(id) {
        const achievement = this.achievements.get(id);
        achievement.earned = true;
        
        await this.grantReward(achievement.reward);
        this.showUnlockNotification(id);
        
        analytics.trackEvent('Achievement', 'Unlock', id);
    }
}
