class TelegramBot {
    constructor(botToken, channelId) {
        this.botToken = botToken;
        this.channelId = channelId;
        this.apiUrl = `https://api.telegram.org/bot${botToken}`;
    }

    async sendNotification(message) {
        try {
            const response = await fetch(`${this.apiUrl}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: this.channelId,
                    text: message,
                    parse_mode: 'HTML'
                })
            });
            return response.ok;
        } catch (error) {
            console.error('Telegram notification failed:', error);
            return false;
        }
    }

    async sendPurchaseAlert(product) {
        const message = `🛍️ <b>New Purchase</b>\n\n` +
            `Product: ${product.name}\n` +
            `Price: £${product.price}\n` +
            `Time: ${new Date().toLocaleString()}`;
        return this.sendNotification(message);
    }

    async sendDownloadAlert(item) {
        const message = `📥 <b>New Download</b>\n\n` +
            `Item: ${item.name}\n` +
            `Category: ${item.category}\n` +
            `Version: ${item.version}`;
        return this.sendNotification(message);
    }
}
