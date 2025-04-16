class AdminDashboard {
    constructor() {
        this.stats = new DashboardStats();
        this.security = new SecurityManager();
    }

    async initialize() {
        await this.loadStats();
        this.setupEventListeners();
        this.startRealtimeUpdates();
    }

    async loadStats() {
        const stats = await fetch('/api/admin/stats').then(r => r.json());
        this.renderStats(stats);
    }

    renderStats(stats) {
        document.getElementById('totalRevenue').textContent = `£${stats.revenue}`;
        document.getElementById('totalUsers').textContent = stats.users;
        document.getElementById('activeDownloads').textContent = stats.downloads;
    }

    startRealtimeUpdates() {
        const ws = new WebSocket('wss://your-domain.com/admin');
        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            this.handleRealtimeUpdate(data);
        };
    }
}
