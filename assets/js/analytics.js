class AnalyticsTracker {
    constructor() {
        this.events = new Map();
        this.startTime = Date.now();
    }

    trackEvent(category, action, label = null) {
        const event = {
            category,
            action,
            label,
            timestamp: Date.now()
        };

        this.events.set(crypto.randomUUID(), event);
        this.sendToServer(event);

        if (typeof gtag !== 'undefined') {
            gtag('event', action, {
                'event_category': category,
                'event_label': label
            });
        }
    }

    async sendToServer(event) {
        try {
            await fetch('/api/analytics/track', {
                method: 'POST',
                body: JSON.stringify(event)
            });
        } catch (error) {
            console.error('Analytics error:', error);
        }
    }

    getSessionDuration() {
        return Date.now() - this.startTime;
    }
}

// Initialize analytics
const analytics = new AnalyticsTracker();
window.addEventListener('unload', () => {
    analytics.trackEvent('Session', 'End', `Duration: ${analytics.getSessionDuration()}`);
});
