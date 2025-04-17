class PaymentProcessor {
    constructor() {
        this.stripe = Stripe(CONFIG.STRIPE_KEY);
        this.paypal = new PayPalClient();
        this.crypto = new CryptoPayments();
    }

    async createCheckoutSession(product) {
        try {
            const session = await fetch('/api/create-checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    product_id: product.id,
                    price: product.price,
                    currency: 'GBP'
                })
            }).then(r => r.json());

            return this.stripe.redirectToCheckout({
                sessionId: session.id
            });
        } catch (error) {
            console.error('Payment failed:', error);
            throw new Error('Payment processing failed');
        }
    }

    async processRefund(orderId) {
        // Implement refund logic
    }

    async validatePayment(paymentId) {
        // Implement payment validation
    }

    async initializeCryptoPayment(product) {
        const supportedCoins = ['BTC', 'ETH', 'XMR'];
        const rates = await this.getCryptoRates();
        
        return {
            addresses: await this.generatePaymentAddresses(supportedCoins),
            amounts: supportedCoins.reduce((acc, coin) => ({
                ...acc,
                [coin]: (product.price / rates[coin]).toFixed(8)
            }), {})
        };
    }

    async monitorCryptoPayment(paymentId) {
        return new Promise((resolve) => {
            const checkInterval = setInterval(async () => {
                const status = await this.checkPaymentStatus(paymentId);
                if (status.confirmed) {
                    clearInterval(checkInterval);
                    resolve(status);
                }
            }, 30000); // Check every 30 seconds
        });
    }
}
