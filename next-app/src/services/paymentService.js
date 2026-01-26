import api from "./api";

export const paymentService = {
    verifyCode: async (code) => {
        const response = await api.post('/api/payment/decrypt-redirect', { data: code });
        return response.data;
    },

    uploadPaymentReceipt: async (file, type) => {
        const formData = new FormData();
        formData.append('receipt', file);
        formData.append('type', type);

        const response = await api.post('/api/auth/user/upload-payment-receipt', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    getPaymentReceipts: async () => {
        const response = await api.get('/api/auth/user/payment-receipts');
        return response.data;
    }
}