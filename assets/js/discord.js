class DiscordNotifier {
    constructor(webhookUrl) {
        this.webhookUrl = webhookUrl;
    }

    async notify(type, data) {
        const embeds = [{
            title: type === 'download' ? '🔽 New Download' : '💰 New Purchase',
            color: type === 'download' ? 0x00ff00 : 0xff9900,
            fields: [
                { name: 'Item', value: data.name },
                { name: 'Time', value: new Date().toLocaleString() }
            ]
        }];

        try {
            await fetch(this.webhookUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ embeds })
            });
        } catch (error) {
            console.error('Discord notification failed:', error);
        }
    }
}

class DiscordIntegration {
    constructor() {
        this.webhookUrl = CONFIG.DISCORD.WEBHOOK_URL;
        this.serverId = CONFIG.DISCORD.SERVER_ID;
        this.botToken = CONFIG.DISCORD.BOT_TOKEN;
    }

    async setupRoleSync() {
        // Sync Discord roles with shop membership levels
        const roles = {
            premium: "Premium Member",
            vip: "VIP Modder",
            developer: "Mod Developer"
        };
        
        return this.syncUserRoles(roles);
    }

    async notifyPurchase(purchase) {
        const embed = {
            title: "New Purchase!",
            description: `${purchase.user} bought ${purchase.modName}`,
            color: 0x00ff00,
            timestamp: new Date()
        };

        await this.sendWebhook(embed);
    }

    async createSupportThread(ticket) {
        return fetch(`${CONFIG.DISCORD.API}/channels/${CONFIG.DISCORD.SUPPORT_CHANNEL}/threads`, {
            method: 'POST',
            headers: {
                Authorization: `Bot ${this.botToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: `support-${ticket.id}`,
                type: 11, // GUILD_PUBLIC_THREAD
                auto_archive_duration: 1440 // 24 hours
            })
        });
    }
}

// Usage in downloads.js:
// const discord = new DiscordNotifier('your-webhook-url');
// discord.notify('download', { name: 'Item Name' });
