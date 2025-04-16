class NotificationSystem {
    constructor() {
        this.notifications = [];
        this.subscribers = new Set();
    }

    async notify(type, data) {
        const notification = {
            id: crypto.randomUUID(),
            type,
            data,
            timestamp: new Date(),
            read: false
        };

        this.notifications.push(notification);
        this.notifySubscribers(notification);
        await this.saveToDatabase(notification);
    }

    subscribe(callback) {
        this.subscribers.add(callback);
        return () => this.subscribers.delete(callback);
    }

    notifySubscribers(notification) {
        this.subscribers.forEach(callback => callback(notification));
    }

    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    }
}

// Initialize global notification system
const notifications = new NotificationSystem();
