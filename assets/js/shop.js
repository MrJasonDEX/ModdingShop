$('.shop__category').click(function () {
    if(!$(this).hasClass('active')) {
        $('.shop__category').removeClass('active');
        $(this).addClass('active');
        $('.shop__cards').fadeOut();
        $('#category-'+$(this).data('category-index')).fadeIn();
    }
});

class ShopManager {
    constructor() {
        this.telegram = new TelegramBot('YOUR_BOT_TOKEN', 'YOUR_CHANNEL_ID');
    }

    async processPurchase(product) {
        try {
            const purchaseId = this.generateOrderId();
            const details = {
                id: purchaseId,
                product: product.name,
                price: product.price,
                date: new Date().toISOString()
            };
            
            localStorage.setItem(`purchase_${purchaseId}`, JSON.stringify(details));
            await this.telegram.sendPurchaseAlert({...product, orderId: purchaseId});
            
            return purchaseId;
        } catch (error) {
            console.error('Purchase failed:', error);
            this.showError('Purchase failed. Please try again.');
            return null;
        }
    }

    generateOrderId() {
        return 'ORD-' + Date.now().toString(36).toUpperCase();
    }

    showSuccess(message) {
        // ...toast notification code...
    }

    showError(message) {
        // ...toast notification code...
    }
}

// Initialize shop manager
const shopManager = new ShopManager();

// Add click handlers to purchase buttons
document.querySelectorAll('.shop__card__purchase').forEach(button => {
    button.addEventListener('click', async (e) => {
        const card = e.target.closest('.shop__card');
        const product = {
            name: card.querySelector('.shop__card__title').textContent,
            price: card.querySelector('.shop__card__price span').textContent.replace('£', '')
        };
        await shopManager.processPurchase(product);
    });
});