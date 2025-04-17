class ReviewSystem {
    constructor() {
        this.auth = new AuthManager();
    }

    async submitReview(modId, rating, comment) {
        if (!this.auth.currentUser) throw new Error('Must be logged in');
        
        const review = {
            modId,
            userId: this.auth.currentUser.id,
            rating,
            comment,
            timestamp: new Date()
        };

        await fetch('/api/reviews/submit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(review)
        });

        await this.updateModRating(modId);
    }

    async listModReviews(modId) {
        return fetch(`/api/reviews/${modId}`).then(r => r.json());
    }

    renderReviews(reviews, container) {
        container.innerHTML = reviews.map(review => `
            <div class="review-card">
                <div class="review-header">
                    <div class="user">${review.username}</div>
                    <div class="rating">${'★'.repeat(review.rating)}</div>
                </div>
                <div class="review-content">${review.comment}</div>
                <div class="review-date">${new Date(review.timestamp).toLocaleDateString()}</div>
            </div>
        `).join('');
    }
}
