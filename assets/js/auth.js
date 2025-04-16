class AuthManager {
    constructor() {
        this.currentUser = null;
        this.authState = 'pending';
        this.providers = ['email', 'discord', 'google'];
    }

    async login(credentials) {
        try {
            const response = await this.makeAuthRequest('/api/auth/login', {
                method: 'POST',
                body: credentials
            });
            
            if (!response.ok) {
                throw new Error(response.error || 'Login failed');
            }
            
            const data = await response.json();
            this.setSession(data);
            return data;
        } catch (error) {
            this.handleAuthError(error);
            throw error;
        }
    }

    setSession(data) {
        this.currentUser = data.user;
        localStorage.setItem('auth_token', data.token);
        localStorage.setItem('refresh_token', data.refreshToken);
        this.startTokenRefreshTimer();
    }

    handleAuthError(error) {
        if (error.status === 401) {
            this.clearSession();
        }
        console.error('Auth error:', error);
    }

    async register(userData) {
        // Implementation
    }
    
    async validateSession() {
        const token = localStorage.getItem('auth_token');
        if (!token) return false;
        
        try {
            const response = await fetch('/api/auth/validate', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            return response.ok;
        } catch {
            return false;
        }
    }

    setupAuthGuard() {
        const protectedPaths = ['/dashboard', '/profile', '/purchases'];
        if (protectedPaths.includes(window.location.pathname) && !this.currentUser) {
            window.location.href = '/login';
        }
    }

    async refreshToken() {
        // Implementation
    }
}

class StaticAuthManager {
    constructor() {
        this.currentUser = LocalStorage.get('currentUser');
    }

    async login(credentials) {
        // For demo purposes only
        if (credentials.username === 'demo' && credentials.password === 'demo') {
            const user = {
                id: 'demo-user',
                username: 'demo',
                role: 'user'
            };
            LocalStorage.set('currentUser', user);
            this.currentUser = user;
            return user;
        }
        throw new Error('Invalid credentials');
    }
}

const auth = new AuthManager();
