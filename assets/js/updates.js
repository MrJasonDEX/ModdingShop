class UpdateManager {
    constructor() {
        this.version = '1.0.0';
        this.checkInterval = 1800000; // 30 minutes
    }

    async checkForUpdates() {
        try {
            const response = await fetch('/version.json');
            const data = await response.json();
            
            if (data.version !== this.version) {
                this.showUpdateNotification();
            }
        } catch (error) {
            console.error('Update check failed:', error);
        }
    }

    showUpdateNotification() {
        const notification = document.createElement('div');
        notification.className = 'update-notification';
        notification.innerHTML = `
            <div class="notification__content">
                <h4>New Update Available!</h4>
                <p>Refresh to get the latest version</p>
            </div>
            <button onclick="location.reload()">Update Now</button>
        `;
        document.body.appendChild(notification);
    }
}
