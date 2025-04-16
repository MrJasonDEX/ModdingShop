class ModDashboard {
    constructor() {
        this.ws = new WebSocket('wss://moddingshop.com/stats');
        this.stats = new StatsManager();
        this.initializeRealtime();
    }

    initializeRealtime() {
        this.ws.onmessage = ({data}) => {
            const stats = JSON.parse(data);
            this.updateStats(stats);
            this.checkAlerts(stats);
        };
    }

    updateStats(stats) {
        Object.entries(stats).forEach(([key, value]) => {
            const element = document.getElementById(`stat-${key}`);
            if (element) {
                element.textContent = value;
                this.animateValue(element, value);
            }
        });
    }
}
