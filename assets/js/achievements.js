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

    renderAchievements() {
        const container = document.getElementById('achievements');
        container.innerHTML = Array.from(this.achievements.values())
            .map(achievement => `
                <div class="achievement ${achievement.earned ? 'earned' : ''}">
                    <h3>${achievement.name}</h3>
                    <p>${achievement.description}</p>
                    <div class="progress-bar">
                        <div class="progress" style="width: ${achievement.progress}%"></div>
                    </div>
                </div>
            `).join('');
    }
}
