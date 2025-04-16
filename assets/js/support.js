class SupportSystem {
    constructor() {
        this.tickets = new Map();
    }

    async createTicket(userId, issue) {
        const ticket = {
            id: crypto.randomUUID(),
            userId,
            issue,
            status: 'open',
            created: Date.now(),
            updates: []
        };

        await this.saveTicket(ticket);
        return ticket;
    }

    async updateTicket(ticketId, update) {
        const ticket = await this.getTicket(ticketId);
        ticket.updates.push({
            message: update,
            timestamp: Date.now()
        });

        await this.saveTicket(ticket);
        await this.notifyUser(ticket.userId, 'Ticket Updated');
    }

    async assignTicket(ticketId, staffId) {
        const ticket = await this.getTicket(ticketId);
        ticket.assignedTo = staffId;
        await this.saveTicket(ticket);
    }
}
