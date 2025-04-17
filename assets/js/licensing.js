class LicenseManager {
    constructor() {
        this.keyPrefix = 'MOD';
        this.keyLength = 16;
    }

    generateLicense(productId, userId) {
        const timestamp = Date.now().toString(36);
        const random = crypto.randomBytes(8).toString('hex');
        return `${this.keyPrefix}-${productId}-${random}-${timestamp}`;
    }

    async validateLicense(key) {
        try {
            const response = await fetch('/api/license/validate', {
                method: 'POST',
                body: JSON.stringify({ key })
            });
            
            if (!response.ok) throw new Error('Invalid license');
            return response.json();
        } catch (error) {
            console.error('License validation failed:', error);
            return false;
        }
    }

    async activateLicense(key, machineId) {
        return fetch('/api/license/activate', {
            method: 'POST',
            body: JSON.stringify({ key, machineId })
        }).then(r => r.json());
    }
}
