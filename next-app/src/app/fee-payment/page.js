'use client';
import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@/tools/withStyles';
import { Main } from '@/components/Main';
import { Secuence } from '@/components/Secuence';
import { Text } from '@/components/Text';
import { authService } from '@/services/authService';
import { paymentService } from '@/services/paymentService';

const styles = theme => ({
    root: {
        padding: [0, 0],
        maxWidth: '100% !important',
        width: '100%'
    },
    content: {
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        flex: 1,
        padding: [30, 20],
        maxWidth: 1000,
        margin: '0 auto',
        width: '100%',
        '@media (max-width: 768px)': {
            padding: [20, 16]
        }
    },
    mainTitle: {
        fontFamily: theme.typography.primary,
        fontSize: '2rem',
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
        marginBottom: 20,
        textAlign: 'center',
        color: theme.color.secondary.light,
        textShadow: `0 0 20px ${theme.color.secondary.main}, 0 0 40px ${theme.color.secondary.dark}`,
        '@media (max-width: 768px)': {
            fontSize: '1.8rem',
            letterSpacing: '0.1em',
            marginBottom: 15
        }
    },
    section: {
        width: '100%',
        marginBottom: 25,
        padding: [25, 30],
        background: `linear-gradient(135deg, rgba(199, 32, 113, 0.08) 0%, rgba(0, 0, 0, 0.4) 100%)`,
        border: `1px solid rgba(199, 32, 113, 0.3)`,
        borderRadius: 8,
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 3,
            background: `linear-gradient(90deg, transparent, ${theme.color.secondary.main}, transparent)`
        },
        '@media (max-width: 768px)': {
            padding: [20, 16],
            marginBottom: 30
        }
    },
    payNowSection: {
        width: '100%',
        marginBottom: 25,
        display: 'flex',
        justifyContent: 'center'
    },
    payNowButton: {
        padding: [12, 24],
        background: 'transparent',
        clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)',
        border: `2px solid ${theme.color.secondary.main}`,
        color: '#fff',
        fontFamily: theme.typography.primary,
        fontSize: '14px',
        fontWeight: 400,
        textTransform: 'uppercase',
        letterSpacing: 0,
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        textShadow: `0 0 5px ${theme.color.secondary.main}`,
        minWidth: '120px',
        '&:hover': {
            backgroundColor: theme.color.secondary.main,
            color: '#ffffff'
        },
        '@media (max-width: 768px)': {
            fontSize: '14px',
            padding: [12, 24]
        }
    },
    paymentInstructionsOverlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.9)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10000,
        padding: 20
    },
    paymentInstructionsModal: {
        background: `linear-gradient(135deg, rgba(199, 32, 113, 0.08) 0%, rgba(0, 0, 0, 0.6) 100%)`,
        border: `1px solid rgba(199, 32, 113, 0.3)`,
        borderRadius: 12,
        maxWidth: 700,
        width: '100%',
        maxHeight: '90vh',
        overflow: 'auto',
        padding: 30,
        position: 'relative',
        '@media (max-width: 768px)': {
            padding: 20
        }
    },
    messageOverlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.9)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10000,
        padding: 20
    },
    messageModal: {
        background: `linear-gradient(135deg, rgba(199, 32, 113, 0.08) 0%, rgba(0, 0, 0, 0.6) 100%)`,
        border: `1px solid rgba(199, 32, 113, 0.3)`,
        borderRadius: 12,
        maxWidth: 500,
        width: '100%',
        padding: 30,
        position: 'relative',
        '@media (max-width: 768px)': {
            padding: 20
        }
    },
    messageContent: {
        padding: [20, 0],
        display: 'flex',
        alignItems: 'center',
        gap: 15,
        fontSize: '1rem',
        fontFamily: theme.typography.secondary,
        color: '#fff',
        '& i': {
            fontSize: '2rem'
        }
    },
    messageContentError: {
        color: '#ff6666',
        '& i': {
            color: '#ff6666'
        }
    },
    messageContentSuccess: {
        color: '#00ff64',
        '& i': {
            color: '#00ff64'
        }
    },
    messageButton: {
        marginTop: 20,
        width: '100%',
        padding: [12, 24],
        background: `linear-gradient(135deg, ${theme.color.secondary.main}, ${theme.color.secondary.dark})`,
        border: 'none',
        borderRadius: 6,
        color: '#fff',
        fontFamily: theme.typography.primary,
        fontSize: '0.9rem',
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        '&:hover': {
            transform: 'scale(1.02)',
            boxShadow: `0 0 15px ${theme.color.secondary.main}60`
        }
    },
    sectionTitle: {
        fontFamily: theme.typography.primary,
        fontSize: '1.4rem',
        fontWeight: 700,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        color: theme.color.secondary.light,
        marginBottom: 18,
        textShadow: `0 0 10px ${theme.color.secondary.main}`,
        '@media (max-width: 768px)': {
            fontSize: '1.1rem',
            marginBottom: 14
        }
    },
    sectionTitleSmall: {
        fontFamily: theme.typography.primary,
        fontSize: '1.1rem',
        fontWeight: 600,
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
        color: theme.color.secondary.light,
        marginBottom: 14,
        textShadow: `0 0 8px ${theme.color.secondary.main}`,
        '@media (max-width: 768px)': {
            fontSize: '0.95rem',
            marginBottom: 10
        }
    },
    detailsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: 15,
        marginBottom: 20
    },
    detailsGridCompact: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: 12,
        marginBottom: 0
    },
    detailItem: {
        background: 'rgba(0, 0, 0, 0.3)',
        padding: 15,
        borderRadius: 8,
        border: '1px solid rgba(255, 255, 255, 0.05)'
    },
    detailItemCompact: {
        background: 'rgba(0, 0, 0, 0.3)',
        padding: 12,
        borderRadius: 6,
        border: '1px solid rgba(255, 255, 255, 0.05)'
    },
    detailLabel: {
        display: 'block',
        fontSize: '0.7rem',
        color: '#888',
        textTransform: 'uppercase',
        marginBottom: 6,
        letterSpacing: 0.5,
        fontFamily: theme.typography.secondary
    },
    detailValue: {
        color: '#fff',
        fontSize: '0.95rem',
        fontWeight: 500,
        fontFamily: theme.typography.secondary
    },
    instructionsList: {
        listStyle: 'none',
        padding: 0,
        margin: [0, 0, 15, 0],
        '& li': {
            position: 'relative',
            paddingLeft: 18,
            marginBottom: 10,
            color: '#ccc',
            fontSize: '0.85rem',
            lineHeight: 1.5,
            fontFamily: theme.typography.secondary,
            '&::before': {
                content: '"▸"',
                position: 'absolute',
                left: 0,
                color: theme.color.secondary.main
            }
        }
    },
    checkboxContainer: {
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        marginBottom: 18,
        padding: 12,
        background: 'rgba(199, 32, 113, 0.05)',
        borderRadius: 8,
        border: `1px solid rgba(199, 32, 113, 0.2)`
    },
    checkbox: {
        width: 20,
        height: 20,
        cursor: 'pointer',
        accentColor: theme.color.secondary.main
    },
    checkboxLabel: {
        color: '#fff',
        fontSize: '0.85rem',
        cursor: 'pointer',
        userSelect: 'none',
        fontFamily: theme.typography.secondary
    },
    actionBtn: {
        width: '100%',
        padding: [12, 35],
        background: `linear-gradient(135deg, ${theme.color.secondary.main}, ${theme.color.secondary.dark})`,
        border: 'none',
        borderRadius: 8,
        color: '#fff',
        fontFamily: theme.typography.primary,
        fontSize: '1rem',
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: 1.5,
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        boxShadow: `0 0 20px ${theme.color.secondary.main}60`,
        '&:hover:not($disabled)': {
            transform: 'scale(1.02)',
            boxShadow: `0 0 30px ${theme.color.secondary.main}90`
        }
    },
    disabled: {
        opacity: 0.4,
        cursor: 'not-allowed',
        background: 'rgba(100, 100, 100, 0.3)',
        boxShadow: 'none',
        '&:hover': {
            transform: 'none'
        }
    },
    formField: {
        marginBottom: 20
    },
    formLabel: {
        display: 'block',
        fontSize: '0.8rem',
        color: '#aaa',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginBottom: 10,
        fontFamily: theme.typography.secondary
    },
    radioGroup: {
        display: 'flex',
        gap: 15,
        flexWrap: 'wrap'
    },
    radioLabel: {
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        cursor: 'pointer',
        padding: [12, 20],
        background: 'rgba(255, 255, 255, 0.05)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: 6,
        transition: 'all 0.3s ease',
        fontFamily: theme.typography.secondary,
        '&:hover': {
            background: 'rgba(255, 255, 255, 0.08)',
            borderColor: 'rgba(199, 32, 113, 0.3)'
        },
        '&$radioLabelActive': {
            background: 'rgba(199, 32, 113, 0.15)',
            borderColor: theme.color.secondary.main
        }
    },
    radioLabelActive: {},
    radioLabelDisabled: {
        opacity: 0.6,
        cursor: 'not-allowed',
        background: 'rgba(100, 100, 100, 0.1)',
        borderColor: 'rgba(100, 100, 100, 0.2)',
        '&:hover': {
            background: 'rgba(100, 100, 100, 0.1)',
            borderColor: 'rgba(100, 100, 100, 0.2)'
        }
    },
    radioInput: {
        width: 18,
        height: 18,
        cursor: 'pointer',
        accentColor: theme.color.secondary.main
    },
    radioText: {
        color: '#fff',
        fontSize: '0.9rem'
    },
    uploadButton: {
        display: 'inline-block',
        padding: [12, 24],
        background: 'rgba(255, 255, 255, 0.1)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        borderRadius: 6,
        color: '#fff',
        fontFamily: theme.typography.primary,
        fontSize: '0.85rem',
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        '&:hover': {
            background: 'rgba(255, 255, 255, 0.15)',
            borderColor: 'rgba(199, 32, 113, 0.5)'
        }
    },
    previewContainer: {
        flex: 1,
        minHeight: 0,
        padding: 15,
        background: 'rgba(0, 0, 0, 0.3)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: 8,
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        overflow: 'hidden'
    },
    previewImage: {
        flex: 1,
        width: '100%',
        maxHeight: '100%',
        borderRadius: 6,
        objectFit: 'contain',
        border: '1px solid rgba(255, 255, 255, 0.1)'
    },
    previewFileName: {
        color: '#fff',
        fontSize: '0.9rem',
        fontFamily: theme.typography.secondary,
        wordBreak: 'break-word'
    },
    uploadActionBtn: {
        padding: [10, 24],
        background: `linear-gradient(135deg, ${theme.color.secondary.main}, ${theme.color.secondary.dark})`,
        border: 'none',
        borderRadius: 6,
        color: '#fff',
        fontFamily: theme.typography.primary,
        fontSize: '0.85rem',
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        '&:hover': {
            transform: 'scale(1.02)',
            boxShadow: `0 0 15px ${theme.color.secondary.main}60`
        }
    },
    previewOverlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.9)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10000,
        padding: 20
    },
    previewModal: {
        background: `linear-gradient(135deg, rgba(199, 32, 113, 0.08) 0%, rgba(0, 0, 0, 0.6) 100%)`,
        border: `1px solid rgba(199, 32, 113, 0.3)`,
        borderRadius: 12,
        width: '90vw',
        height: '90vh',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        padding: 30,
        position: 'relative',
        gap: 15
    },
    previewHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        paddingBottom: 15,
        borderBottom: `1px solid rgba(199, 32, 113, 0.3)`
    },
    previewTitle: {
        fontFamily: theme.typography.primary,
        fontSize: '1.3rem',
        color: theme.color.secondary.light,
        textTransform: 'uppercase',
        letterSpacing: '0.1em'
    },
    closeButton: {
        background: 'transparent',
        border: 'none',
        color: '#fff',
        fontSize: '1.5rem',
        cursor: 'pointer',
        padding: 5,
        lineHeight: 1,
        transition: 'color 0.3s ease',
        '&:hover': {
            color: theme.color.secondary.main
        }
    },
    previewActions: {
        display: 'flex',
        gap: 15,
        marginTop: 15,
        justifyContent: 'flex-end',
        flexShrink: 0
    },
    cancelButton: {
        padding: [10, 24],
        background: 'rgba(255, 255, 255, 0.1)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        borderRadius: 6,
        color: '#fff',
        fontFamily: theme.typography.primary,
        fontSize: '0.85rem',
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        '&:hover': {
            background: 'rgba(255, 255, 255, 0.15)'
        }
    },
    fileInput: {
        display: 'none'
    },
    message: {
        padding: [12, 16],
        borderRadius: 8,
        marginTop: 15,
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        fontSize: '0.9rem',
        fontFamily: theme.typography.secondary
    },
    successMessage: {
        background: 'rgba(0, 255, 100, 0.1)',
        border: '1px solid #00ff64',
        color: '#00ff64'
    },
    errorMessage: {
        background: 'rgba(255, 0, 0, 0.1)',
        border: '1px solid #ff4444',
        color: '#ff6666'
    },
    receiptsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: 15,
        marginTop: 20
    },
    receiptCard: {
        background: 'rgba(0, 0, 0, 0.3)',
        padding: 15,
        borderRadius: 8,
        border: '1px solid rgba(255, 255, 255, 0.05)',
        transition: 'all 0.3s ease',
        '&:hover': {
            borderColor: 'rgba(199, 32, 113, 0.3)',
            boxShadow: `0 0 15px rgba(199, 32, 113, 0.1)`
        }
    },
    receiptLink: {
        color: theme.color.tertiary.light,
        textDecoration: 'none',
        fontSize: '0.9rem',
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        marginBottom: 12,
        fontFamily: theme.typography.secondary,
        wordBreak: 'break-word',
        '&:hover': {
            color: '#00ff88'
        }
    },
    receiptMeta: {
        display: 'flex',
        gap: 8,
        flexWrap: 'wrap',
        marginBottom: 10
    },
    badge: {
        padding: [4, 10],
        borderRadius: 4,
        fontSize: '0.7rem',
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        fontFamily: theme.typography.primary
    },
    typeBadgeStudent: {
        background: 'rgba(0, 212, 255, 0.15)',
        color: '#00d4ff',
        border: '1px solid rgba(0, 212, 255, 0.3)'
    },
    typeBadgeWorkshop: {
        background: 'rgba(250, 225, 39, 0.15)',
        color: '#fae127',
        border: '1px solid rgba(250, 225, 39, 0.3)'
    },
    verifiedBadge: {
        display: 'flex',
        alignItems: 'center',
        gap: 4
    },
    verifiedBadgeVerified: {
        background: 'rgba(0, 255, 100, 0.15)',
        color: '#00ff64',
        border: '1px solid rgba(0, 255, 100, 0.3)'
    },
    verifiedBadgePending: {
        background: 'rgba(255, 165, 0, 0.15)',
        color: '#ffa500',
        border: '1px solid rgba(255, 165, 0, 0.3)'
    },
    receiptDetails: {
        paddingTop: 10,
        borderTop: '1px solid rgba(255, 255, 255, 0.05)',
        fontSize: '0.85rem',
        color: '#aaa',
        lineHeight: 1.6,
        fontFamily: theme.typography.secondary,
        '& $detailLabel': {
            display: 'inline',
            fontSize: '0.8rem'
        }
    },
    loading: {
        textAlign: 'center',
        padding: 60,
        color: '#ccc',
        fontFamily: theme.typography.secondary
    },
    spinner: {
        width: 40,
        height: 40,
        border: `3px solid rgba(199, 32, 113, 0.3)`,
        borderTopColor: theme.color.secondary.main,
        borderRadius: '50%',
        animation: '$spin 1s linear infinite',
        margin: '0 auto 20px'
    },
    '@keyframes spin': {
        to: { transform: 'rotate(360deg)' }
    }
});

class FeePaymentPage extends React.Component {
    static propTypes = {
        classes: PropTypes.object
    };

    state = {
        user: null,
        loading: true,
        showPaymentInstructions: false,
        instructionsRead: false,
        receipts: [],
        selectedType: 'STUDENT',
        uploading: false,
        uploadError: null,
        uploadSuccess: false,
        uploadSuccessMessage: null,
        selectedFile: null,
        previewUrl: null,
        showPreview: false,
        isReceiptViewerOpen: false,
        receiptViewerUrl: null,
        receiptViewerType: null,
        showMessageOverlay: false
    };

    componentDidMount() {
        this.fetchUserData();
        this.fetchReceipts();
    }

    fetchUserData = async () => {
        try {
            const response = await authService.getProfile();
            const user = response.user;

            // Set default selectedType based on payment status and user type
            let defaultType = 'STUDENT';

            // PSG students should default to WORKSHOP since they don't pay general fee
            if (user.isPSGStudent) {
                defaultType = 'WORKSHOP';
            } else if (user.generalFeePaid && !user.workshopFeePaid) {
                defaultType = 'WORKSHOP';
            } else if (!user.generalFeePaid) {
                defaultType = 'STUDENT';
            }

            this.setState({
                user,
                loading: false,
                selectedType: defaultType
            });
        } catch (error) {
            console.error('Failed to fetch user profile:', error);
            window.location.href = '/auth?type=login';
        }
    };

    fetchReceipts = async () => {
        try {
            const response = await paymentService.getPaymentReceipts();
            this.setState({ receipts: response.receipts || [] });
        } catch (error) {
            console.error('Failed to fetch receipts:', error);
        }
    };

    handlePayNowClick = () => {
        this.setState({ showPaymentInstructions: true, instructionsRead: false });
    };

    handleCloseInstructions = () => {
        this.setState({ showPaymentInstructions: false, instructionsRead: false });
    };

    handleProceedToPayment = () => {
        const paymentUrl = process.env.NEXT_PUBLIC_PAYMENT_URL;
        if (paymentUrl) {
            window.open(paymentUrl, '_blank');
            this.setState({ showPaymentInstructions: false });
        } else {
            console.error('Payment URL not configured');
        }
    };

    handleFileUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const validTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        if (!validTypes.includes(file.type)) {
            this.setState({ uploadError: 'Invalid file format. Please upload a PDF, JPEG, PNG, or WebP file.' });
            return;
        }

        const maxSize = 10 * 1024 * 1024;
        if (file.size > maxSize) {
            this.setState({ uploadError: 'File size is too large. Maximum allowed size is 10MB.' });
            return;
        }

        this.setState({ uploading: true, uploadError: null, uploadSuccess: false });

        try {
            const response = await paymentService.uploadPaymentReceipt(file, this.state.selectedType);

            // Handle verification status in success message
            const verificationMsg = 'Receipt uploaded successfully! Verification pending. You will be notified via email when your payment is verified.';

            this.setState({
                uploadSuccess: true,
                uploadError: null,
                uploadSuccessMessage: verificationMsg,
                selectedFile: null,
                previewUrl: null,
                showPreview: false,
                showMessageOverlay: true
            });

            await this.fetchReceipts();
            await this.fetchUserData(); // Refresh user data to update payment status
            event.target.value = '';
        } catch (error) {
            console.error('Upload failed:', error);

            // Handle specific error cases
            let errorMessage = 'Failed to upload receipt. Please try again.';

            if (error.response?.data) {
                const { message, details, userMobile, receiptMobile } = error.response.data;

                if (userMobile && receiptMobile) {
                    errorMessage = `Mobile number mismatch! Registered: ${userMobile}, Receipt: ${receiptMobile}`;
                } else if (message === 'Receipt already exists and is verified') {
                    errorMessage = 'A verified receipt for this fee type already exists. No need to upload again.';
                } else if (message === 'Receipt type mismatch') {
                    errorMessage = details || 'Receipt type mismatch. Please select the correct fee type.';
                } else {
                    errorMessage = message || errorMessage;
                }
            }

            this.setState({
                uploadError: errorMessage,
                uploadSuccess: false,
                showMessageOverlay: true
            });
        } finally {
            this.setState({ uploading: false });
        }
    };

    getReceiptFileUrl = (fileName) => {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        return `${baseUrl}${fileName}`;
    };

    handleFileSelect = (event) => {
        const file = event.target.files[0];
        if (!file) {
            this.setState({ selectedFile: null, previewUrl: null });
            return;
        }

        const validTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        if (!validTypes.includes(file.type)) {
            this.setState({
                uploadError: 'Invalid file format. Please upload a PDF, JPEG, PNG, or WebP file.',
                selectedFile: null,
                previewUrl: null
            });
            return;
        }

        const maxSize = 10 * 1024 * 1024;
        if (file.size > maxSize) {
            this.setState({
                uploadError: 'File size is too large. Maximum allowed size is 10MB.',
                selectedFile: null,
                previewUrl: null
            });
            return;
        }

        // Create preview URL
        const previewUrl = URL.createObjectURL(file);
        this.setState({
            selectedFile: file,
            previewUrl,
            uploadError: null,
            showPreview: true
        });
    };

    handleCancelPreview = () => {
        if (this.state.previewUrl) {
            URL.revokeObjectURL(this.state.previewUrl);
        }
        const fileInput = document.getElementById('receiptUpload');
        if (fileInput) fileInput.value = '';
        this.setState({ selectedFile: null, previewUrl: null, showPreview: false });
    };

    handleViewReceipt = (receipt) => {
        const fileUrl = this.getReceiptFileUrl(receipt.fileName);
        const fileType = receipt.fileName.toLowerCase().endsWith('.pdf') ? 'pdf' : 'image';
        this.setState({
            isReceiptViewerOpen: true,
            receiptViewerUrl: fileUrl,
            receiptViewerType: fileType
        });
    };

    handleCloseReceiptViewer = () => {
        this.setState({
            isReceiptViewerOpen: false,
            receiptViewerUrl: null,
            receiptViewerType: null
        });
    };

    handleUploadClick = async () => {
        const { selectedFile, selectedType } = this.state;
        if (!selectedFile) return;

        this.setState({ uploading: true, uploadError: null, uploadSuccess: false });

        try {
            const response = await paymentService.uploadPaymentReceipt(selectedFile, selectedType);

            const verificationMsg = 'Receipt uploaded successfully! Verification pending. You will be notified via email when your payment is verified.';

            this.setState({
                uploadSuccess: true,
                uploadError: null,
                uploadSuccessMessage: verificationMsg,
                selectedFile: null,
                previewUrl: null,
                showPreview: false,
                showMessageOverlay: true
            });

            const fileInput = document.getElementById('receiptUpload');
            if (fileInput) fileInput.value = '';

            await this.fetchReceipts();
            await this.fetchUserData();
        } catch (error) {
            console.error('Upload failed:', error);

            let errorMessage = 'Failed to upload receipt. Please try again.';

            if (error.response?.data) {
                const { message, details, userMobile, receiptMobile } = error.response.data;

                if (userMobile && receiptMobile) {
                    errorMessage = `Mobile number mismatch! Registered: ${userMobile}, Receipt: ${receiptMobile}`;
                } else if (message === 'Receipt already exists and is verified') {
                    errorMessage = 'A verified receipt for this fee type already exists. No need to upload again.';
                } else if (message === 'Receipt type mismatch') {
                    errorMessage = details || 'Receipt type mismatch. Please select the correct fee type.';
                } else {
                    errorMessage = message || errorMessage;
                }
            }

            this.setState({
                uploadError: errorMessage,
                uploadSuccess: false,
                showPreview: false,
                showMessageOverlay: true
            });
        } finally {
            this.setState({ uploading: false });
        }
    };

    render() {
        const { classes } = this.props;
        const { user, loading, instructionsRead, receipts, selectedType, uploading, uploadError, uploadSuccess } = this.state;

        return (
            <Main className={classes.root}>
                <Secuence stagger>
                    <div className={classes.content}>
                        <Text className={classes.mainTitle}>Fee Payment</Text>

                        {loading ? (
                            <div className={classes.section}>
                                <div className={classes.loading}>
                                    <div className={classes.spinner}></div>
                                    <p>Loading...</p>
                                </div>
                            </div>
                        ) : (
                            <>
                                {/* Pay Now Button - Top Center */}
                                <div className={classes.payNowSection}>
                                    <button
                                        onClick={this.handlePayNowClick}
                                        className={classes.payNowButton}
                                    >
                                        Pay Now
                                    </button>
                                </div>

                                {/* Receipt Upload Section */}
                                <div className={classes.section}>
                                    <Text className={classes.sectionTitle}>Already Paid? Upload Receipt</Text>

                                    <div className={classes.formField}>
                                        <label className={classes.formLabel}>Receipt Type *</label>
                                        <div className={classes.radioGroup}>
                                            {!user?.isPSGStudent && (
                                                <label className={`${classes.radioLabel} ${selectedType === 'STUDENT' ? classes.radioLabelActive : ''} ${(user?.generalFeePaid && user?.workshopFeePaid) || user?.generalFeePaid ? classes.radioLabelDisabled : ''}`}>
                                                    <input
                                                        type="radio"
                                                        name="receiptType"
                                                        value="STUDENT"
                                                        checked={selectedType === 'STUDENT'}
                                                        onChange={(e) => this.setState({ selectedType: e.target.value })}
                                                        className={classes.radioInput}
                                                        disabled={user?.generalFeePaid && user?.workshopFeePaid || user?.generalFeePaid}
                                                    />
                                                    <span className={classes.radioText}>
                                                        General Fee
                                                        {user?.generalFeePaid && (
                                                            <span style={{ marginLeft: 8, color: '#00ff64', fontSize: '0.85rem' }}>
                                                                <i className="ri-check-line"></i> Paid
                                                            </span>
                                                        )}
                                                    </span>
                                                </label>
                                            )}
                                            <label className={`${classes.radioLabel} ${selectedType === 'WORKSHOP' ? classes.radioLabelActive : ''} ${(user?.generalFeePaid && user?.workshopFeePaid) || user?.workshopFeePaid ? classes.radioLabelDisabled : ''}`}>
                                                <input
                                                    type="radio"
                                                    name="receiptType"
                                                    value="WORKSHOP"
                                                    checked={selectedType === 'WORKSHOP'}
                                                    onChange={(e) => this.setState({ selectedType: e.target.value })}
                                                    className={classes.radioInput}
                                                    disabled={user?.generalFeePaid && user?.workshopFeePaid || user?.workshopFeePaid}
                                                />
                                                <span className={classes.radioText}>
                                                    Workshop Fee
                                                    {user?.workshopFeePaid && (
                                                        <span style={{ marginLeft: 8, color: '#00ff64', fontSize: '0.85rem' }}>
                                                            <i className="ri-check-line"></i> Paid
                                                        </span>
                                                    )}
                                                </span>
                                            </label>
                                        </div>
                                    </div>

                                    <div className={classes.formField}>
                                        <label className={classes.formLabel}>Upload Receipt (PDF, JPG, PNG, WebP - Max 10MB)</label>
                                        <label
                                            htmlFor="receiptUpload"
                                            className={classes.uploadButton}
                                            style={{
                                                opacity: (user?.generalFeePaid && user?.workshopFeePaid) ? 0.4 : 1,
                                                cursor: (user?.generalFeePaid && user?.workshopFeePaid) ? 'not-allowed' : 'pointer'
                                            }}
                                        >
                                            Choose File
                                        </label>
                                        <input
                                            id="receiptUpload"
                                            type="file"
                                            accept=".pdf,.jpg,.jpeg,.png,.webp"
                                            onChange={this.handleFileSelect}
                                            className={classes.fileInput}
                                            disabled={user?.generalFeePaid && user?.workshopFeePaid}
                                        />
                                    </div>

                                    {receipts.length > 0 && (
                                        <>
                                            <Text className={classes.sectionTitle} style={{ marginTop: 40, fontSize: '1.3rem' }}>
                                                Your Uploaded Receipts
                                            </Text>
                                            <div className={classes.receiptsGrid}>
                                                {receipts.map((receipt, index) => (
                                                    <div key={index} className={classes.receiptCard}>
                                                        <button
                                                            onClick={() => this.handleViewReceipt(receipt)}
                                                            className={classes.receiptLink}
                                                            style={{ background: 'none', border: 'none', cursor: 'pointer', width: '100%', textAlign: 'left' }}
                                                        >
                                                            <i className="ri-file-line"></i>
                                                            {receipt.fileName.split('/').pop()}
                                                        </button>
                                                        <div className={classes.receiptMeta}>
                                                            <span className={`${classes.badge} ${receipt.type === 'STUDENT' ? classes.typeBadgeStudent : classes.typeBadgeWorkshop}`}>
                                                                {receipt.type}
                                                            </span>
                                                            <span className={`${classes.badge} ${classes.verifiedBadge} ${receipt.verified ? classes.verifiedBadgeVerified : classes.verifiedBadgePending}`}>
                                                                {receipt.verified ? (
                                                                    <><i className="ri-check-line"></i> Verified</>
                                                                ) : (
                                                                    <><i className="ri-time-line"></i> Pending</>
                                                                )}
                                                            </span>
                                                        </div>
                                                        {receipt.verified && receipt.name && (
                                                            <div className={classes.receiptDetails}>
                                                                <div><span className={classes.detailLabel}>Name:</span> {receipt.name}</div>
                                                                {receipt.receiptNumber && (
                                                                    <div><span className={classes.detailLabel}>Receipt #:</span> {receipt.receiptNumber}</div>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                </Secuence>

                {/* Payment Instructions Overlay */}
                {this.state.showPaymentInstructions && (
                    <div className={classes.paymentInstructionsOverlay} onClick={this.handleCloseInstructions}>
                        <div className={classes.paymentInstructionsModal} onClick={(e) => e.stopPropagation()}>
                            <div className={classes.previewHeader}>
                                <div className={classes.previewTitle}>Payment Instructions</div>
                                <button className={classes.closeButton} onClick={this.handleCloseInstructions}>
                                    <i className="ri-close-line"></i>
                                </button>
                            </div>

                            <ul className={classes.instructionsList} style={{ margin: '20px 0' }}>
                                <li><strong>Mobile Number Match:</strong> Ensure the mobile number entered in the payment gateway matches your registered mobile number on this website.</li>
                                <li><strong>Strict Policy:</strong> Duplicate receipts or malpractice will lead to severe disciplinary actions.</li>
                                <li><strong>Workshop Fee:</strong> ₹350 per workshop. A participant can attend only ONE workshop.</li>
                                <li><strong>General/Student Fee:</strong> ₹150. Allows participation in multiple events and paper presentations.</li>
                                <li><strong>No Refunds:</strong> All payments are non-refundable. Select your category carefully.</li>
                                <li><strong>Receipt Upload:</strong> You must upload the payment receipt here to unlock event/workshop registrations.</li>
                                <li><strong>PSG Students:</strong> Students from PSG Tech and PSG iTech are <strong>exempt</strong> from the General Fee.</li>
                            </ul>

                            <div className={classes.checkboxContainer}>
                                <input
                                    type="checkbox"
                                    id="instructionsReadModal"
                                    checked={this.state.instructionsRead}
                                    onChange={(e) => this.setState({ instructionsRead: e.target.checked })}
                                    className={classes.checkbox}
                                />
                                <label htmlFor="instructionsReadModal" className={classes.checkboxLabel}>
                                    I have read and understood the payment instructions
                                </label>
                            </div>

                            <button
                                onClick={this.handleProceedToPayment}
                                disabled={!this.state.instructionsRead}
                                className={`${classes.actionBtn} ${!this.state.instructionsRead ? classes.disabled : ''}`}
                                style={{ marginTop: 20 }}
                            >
                                Proceed to Pay
                            </button>
                        </div>
                    </div>
                )}

                {/* Message Overlay for Upload Status */}
                {this.state.showMessageOverlay && (
                    <div className={classes.messageOverlay} onClick={() => this.setState({ showMessageOverlay: false, uploadError: null, uploadSuccess: false })}>
                        <div className={classes.messageModal} onClick={(e) => e.stopPropagation()}>
                            <div className={classes.previewHeader}>
                                <div className={classes.previewTitle}>
                                    {this.state.uploadError ? 'Upload Failed' : 'Upload Successful'}
                                </div>
                                <button className={classes.closeButton} onClick={() => this.setState({ showMessageOverlay: false, uploadError: null, uploadSuccess: false })}>
                                    <i className="ri-close-line"></i>
                                </button>
                            </div>

                            <div className={`${classes.messageContent} ${this.state.uploadError ? classes.messageContentError : classes.messageContentSuccess}`}>
                                <i className={this.state.uploadError ? "ri-error-warning-line" : "ri-check-line"}></i>
                                <span>
                                    {this.state.uploadError || this.state.uploadSuccessMessage || 'Receipt uploaded successfully!'}
                                </span>
                            </div>

                            <button
                                onClick={() => this.setState({ showMessageOverlay: false, uploadError: null, uploadSuccess: false })}
                                className={classes.messageButton}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                )}

                {/* Preview Modal Overlay */}
                {this.state.showPreview && this.state.selectedFile && (
                    <div className={classes.previewOverlay} onClick={this.handleCancelPreview}>
                        <div className={classes.previewModal} onClick={(e) => e.stopPropagation()}>
                            <div className={classes.previewHeader}>
                                <div className={classes.previewTitle}>Receipt Preview</div>
                                <button className={classes.closeButton} onClick={this.handleCancelPreview}>
                                    <i className="ri-close-line"></i>
                                </button>
                            </div>

                            <div className={classes.previewContainer} style={{ marginTop: 0, border: 'none', background: 'transparent' }}>
                                <div className={classes.previewFileName}>
                                    <i className="ri-file-line"></i> {this.state.selectedFile.name}
                                </div>

                                {this.state.selectedFile.type.startsWith('image/') && (
                                    <img
                                        src={this.state.previewUrl}
                                        alt="Receipt preview"
                                        className={classes.previewImage}
                                        style={{ maxHeight: '60vh' }}
                                    />
                                )}

                                {this.state.selectedFile.type === 'application/pdf' && (
                                    <embed
                                        src={this.state.previewUrl}
                                        type="application/pdf"
                                        width="100%"
                                        height="500px"
                                        style={{ borderRadius: 6, border: '1px solid rgba(255, 255, 255, 0.1)' }}
                                    />
                                )}
                            </div>

                            <div className={classes.previewActions}>
                                <button
                                    className={classes.cancelButton}
                                    onClick={this.handleCancelPreview}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={this.handleUploadClick}
                                    disabled={uploading}
                                    className={classes.uploadActionBtn}
                                >
                                    {uploading ? 'Uploading...' : 'Upload Receipt'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Receipt Viewer Modal Overlay */}
                {this.state.isReceiptViewerOpen && this.state.receiptViewerUrl && (
                    <div className={classes.previewOverlay} onClick={this.handleCloseReceiptViewer}>
                        <div className={classes.previewModal} onClick={(e) => e.stopPropagation()}>
                            <div className={classes.previewHeader}>
                                <div className={classes.previewTitle}>Receipt Viewer</div>
                                <button className={classes.closeButton} onClick={this.handleCloseReceiptViewer}>
                                    <i className="ri-close-line"></i>
                                </button>
                            </div>

                            <div className={classes.previewContainer} style={{ marginTop: 0, border: 'none', background: 'transparent' }}>
                                {this.state.receiptViewerType === 'image' && (
                                    <img
                                        src={this.state.receiptViewerUrl}
                                        alt="Receipt"
                                        className={classes.previewImage}
                                    />
                                )}

                                {this.state.receiptViewerType === 'pdf' && (
                                    <embed
                                        src={this.state.receiptViewerUrl}
                                        type="application/pdf"
                                        width="100%"
                                        height="100%"
                                        style={{ borderRadius: 6, border: '1px solid rgba(255, 255, 255, 0.1)', flex: 1 }}
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </Main>
        );
    }
}

export default withStyles(styles)(FeePaymentPage);
