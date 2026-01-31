import api from './api';

export const eventService = {
    // --- Events ---
    // Get all events
    getAllEvents: async (params = {}) => {
        const response = await api.get('/api/events', { params });
        return response.data;
    },

    // Get event by ID
    getEventById: async (eventId) => {
        const response = await api.get(`/api/events/${eventId}`);
        return response.data;
    },

    // Register for an event
    registerEvent: async (eventId) => {
        const response = await api.post(`/api/events/${eventId}/register`);
        return response.data;
    },

    // Check if event is closed / get utils
    getEventUtils: async (eventId) => {
        const response = await api.get(`/api/events/${eventId}/isclosed`);
        return response.data;
    },

    // Check if user is registered for an event
    checkUserEventRegistration: async (eventId) => {
        const response = await api.get(`/api/events/user/${eventId}`);
        return response.data;
    },


    // --- Workshops ---
    // Get all workshops
    getAllWorkshops: async (params = {}) => {
        const response = await api.get('/api/events/workshops', { params });
        return response.data;
    },

    // Get workshop by ID
    getWorkshopById: async (workshopId) => {
        const response = await api.get(`/api/events/workshops/${workshopId}`);
        return response.data;
    },

    // Register for a workshop
    registerWorkshop: async (workshopId) => {
        const response = await api.post(`/api/events/workshops/${workshopId}/register`);
        return response.data;
    },

    // Get workshop utils (amount, closed, etc.)
    getWorkshopUtils: async (workshopId) => {
        const response = await api.get(`/api/events/workshops/${workshopId}/amount`);
        return response.data;
    },

    // Check if user is registered for a workshop
    checkUserWorkshopRegistration: async (workshopId) => {
        const response = await api.get(`/api/events/user/workshop/${workshopId}`);
        return response.data;
    },


    // --- Papers ---
    // Get all papers
    getAllPapers: async (params = {}) => {
        const response = await api.get('/api/events/papers', { params });
        return response.data;
    },

    // Get paper by ID
    getPaperById: async (paperId) => {
        const response = await api.get(`/api/events/papers/${paperId}`);
        return response.data;
    },

    // Register for a paper
    registerPaper: async (paperId) => {
        const response = await api.post(`/api/events/papers/${paperId}/register`);
        return response.data;
    },

    // Submit paper abstract/file
    submitPaper: async (paperId, file) => {
        const formData = new FormData();
        formData.append('file', file);
        
        const response = await api.post(`/api/events/paper/${paperId}/submit`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },
    
    // Save paper chat/comments (if applicable)
    savePaperChat: async (paperId, data) => {
        const response = await api.post(`/api/events/paper/${paperId}/chat`, data);
        return response.data;
    },


    // --- User Dashboard ---
    // Get events registered by the logged-in user
    getUserEvents: async () => {
        const response = await api.get('/api/events/registrations');
        return response.data;
    },

    // Get workshops registered by the logged-in user
    getUserWorkshops: async () => {
        const response = await api.get('/api/events/workshops/registrations');
        //console.log(response.data);
        return response.data;
    },

    // Get papers registered by the logged-in user
    getUserPapers: async () => {
        const response = await api.get('/api/events/papers/registrations');
        //console.log(response.data);
        return response.data;
        
    }
};
