'use client';
import React from 'react';
import PropTypes from 'prop-types';
import { QRCodeSVG } from 'qrcode.react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import api from '@/services/api'; // Add import for api

import { withStyles } from '@/tools/withStyles';
import { Secuence as SecuenceComponent } from '@/components/Secuence';

// --- Identity Data Core (Three.js Version) ---
class IdentityNode extends React.Component {
    constructor(props) {
        super(props);
        this.mountRef = React.createRef();
        this.frameId = null;
    }

    componentDidMount() {
        this.initThree();
        window.addEventListener('resize', this.handleResize);
    }

    componentWillUnmount() {
        cancelAnimationFrame(this.frameId);
        window.removeEventListener('resize', this.handleResize);
        
        const element = this.mountRef.current;
        if (this.renderer) {
            this.renderer.dispose();
            if (element && this.renderer.domElement.parentNode === element) {
                element.removeChild(this.renderer.domElement);
            }
        }
    }

    initThree = () => {
        if (!this.mountRef.current) return;
        
        // Clean container
        while(this.mountRef.current.firstChild) {
            this.mountRef.current.removeChild(this.mountRef.current.firstChild);
        }

        const width = this.mountRef.current.clientWidth;
        const height = this.mountRef.current.clientHeight;

        // 1. Scene & Camera
        this.scene = new THREE.Scene();
        // Add subtle fog for depth
        this.scene.fog = new THREE.FogExp2(0x000000, 0.03);
        
        this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
        this.camera.position.z = 6;

        // 2. Renderer
        this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        this.renderer.setSize(width, height);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.mountRef.current.appendChild(this.renderer.domElement);

        // --- GAMIFICATION LOGIC FROM DATA ---
        const { user } = this.props;
        
        // COLOR: Payment Status (Cyan = Paid/Online, Red = Unpaid/Locked)
        const baseColorHex = user.generalFeePaid ? 0x00f0ff : 0xff0055;
        
        // COMPLEXITY/SPEED: Year (Fallback to 1 if not present)
        const year = user.year || 1; 
        this.speedMultiplier = 0.5 + (year * 0.2); // Faster for seniors

        // SHAPE: Origin (PSG = Core/Organic, External = Prism/Sharp)
        const isInternal = user.isPSGStudent;

        // 3. Objects Group
        this.coreGroup = new THREE.Group();
        this.scene.add(this.coreGroup);

        // A. INNER CORE (The Identity)
        const innerGeometry = isInternal 
            ? new THREE.IcosahedronGeometry(1.2, 1) // Organic D20 look
            : new THREE.OctahedronGeometry(1.2, 0); // Sharp Diamond look

        const innerMaterial = new THREE.MeshBasicMaterial({
            color: baseColorHex,
            wireframe: true,
            transparent: true,
            opacity: 0.8
        });
        this.innerMesh = new THREE.Mesh(innerGeometry, innerMaterial);
        this.coreGroup.add(this.innerMesh);

        // B. OUTER SHELL (The Shield)
        const outerGeometry = new THREE.IcosahedronGeometry(1.8, 1);
        const outerMaterial = new THREE.MeshBasicMaterial({
            color: baseColorHex,
            wireframe: true,
            transparent: true,
            opacity: 0.15
        });
        this.outerMesh = new THREE.Mesh(outerGeometry, outerMaterial);
        this.coreGroup.add(this.outerMesh);

        // C. SENIOR RING (Rank Indicator - Only for Year 3+)
        if (year >= 3) {
            const ringGeometry = new THREE.TorusGeometry(2.8, 0.02, 16, 100);
            const ringMaterial = new THREE.MeshBasicMaterial({
                color: baseColorHex,
                transparent: true,
                opacity: 0.6
            });
            this.ringMesh = new THREE.Mesh(ringGeometry, ringMaterial);
            // Add to scene directly so it rotates independently
            this.scene.add(this.ringMesh); 
        }

        // D. LIGHTING (Glow Effect)
        const pointLight = new THREE.PointLight(baseColorHex, user.generalFeePaid ? 2 : 0.8, 10);
        pointLight.position.set(0, 0, 0);
        this.scene.add(pointLight);

        // Add a secondary rim light
        const rimLight = new THREE.DirectionalLight(0xffffff, 0.5);
        rimLight.position.set(5, 5, 5);
        this.scene.add(rimLight);

        this.animate();
    }

    handleResize = () => {
        if (!this.mountRef.current || !this.camera || !this.renderer) return;
        const width = this.mountRef.current.clientWidth;
        const height = this.mountRef.current.clientHeight;
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }

    animate = () => {
        this.frameId = requestAnimationFrame(this.animate);
        
        const time = Date.now() * 0.001;
        
        // Animate Core
        if (this.innerMesh) {
            this.innerMesh.rotation.x = -time * 0.2 * this.speedMultiplier;
            this.innerMesh.rotation.z = time * 0.1 * this.speedMultiplier;
        }

        // Animate Shell
        if (this.outerMesh) {
            this.outerMesh.rotation.x = time * 0.1 * this.speedMultiplier;
            this.outerMesh.rotation.y = time * 0.15 * this.speedMultiplier;
        }

        // Animate Ring (if exists)
        if (this.ringMesh) {
            this.ringMesh.rotation.x = Math.PI / 2 + (Math.sin(time * 0.5) * 0.1);
            this.ringMesh.rotation.y = time * 0.3;
        }

        // Gentle float of the whole group
        if (this.coreGroup) {
            this.coreGroup.position.y = Math.sin(time) * 0.1;
        }

        if (this.renderer && this.scene && this.camera) {
            this.renderer.render(this.scene, this.camera);
        }
    }

    render() {
        const { user } = this.props;
        // Text overlay styles
        const overlayStyle = {
            position: 'absolute', 
            top: 20, 
            left: 20, 
            zIndex: 10,
            fontFamily: 'monospace', 
            pointerEvents: 'none',
            textShadow: '0 0 5px rgba(0,0,0,0.8)'
        };
        const statusColor = user.generalFeePaid ? '#00f0ff' : '#ff0055';

        return (
            <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                {/* Status Overlay */}
                <div style={overlayStyle}>
                    <div style={{ color: statusColor, fontWeight: 'bold', fontSize: '0.9rem' }}>
                        STATUS: {user.generalFeePaid ? 'ONLINE' : 'RESTRICTED'}
                    </div>
                    <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem', marginTop: 4 }}>
                        LEVEL {user.year || 1} // {user.isPSGStudent ? 'CORE' : 'PRISM'}
                    </div>
                </div>
                
                {/* Three.js Canvas */}
                <div 
                    ref={this.mountRef} 
                    style={{ width: '100%', height: '100%', outline: 'none' }} 
                />
            </div>
        );
    }
}


const styles = theme => {
    return {
        root: {
            width: '100%',
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 20,
            overflowX: 'hidden',
            '@media (max-width: 960px)': {
                alignItems: 'flex-start',
                padding: '80px 15px 30px', 
                height: 'auto'
            }
        },
        dashboardContainer: {
            width: '100%',
            maxWidth: 1200,
            height: '80vh',
            display: 'flex',
            gap: 20,
            '@media (max-width: 960px)': {
                flexDirection: 'column',
                height: 'auto',
                gap: 20
            }
        },
        
        // --- LEFT COLUMN (Identity) ---
        leftColumn: {
            flex: '0 0 320px',
            display: 'flex',
            flexDirection: 'column',
            gap: 15,
            overflowY: 'auto',
            paddingRight: 4,
            '&::-webkit-scrollbar': { width: 4 },
            '&::-webkit-scrollbar-thumb': { backgroundColor: theme.color.primary.dark, borderRadius: 2 },
            '@media (max-width: 960px)': {
                display: 'contents' // Flatten children for reordering
            }
        },
        scannerContainer: {
            flexShrink: 0,
            position: 'relative',
            height: 350,
            background: 'rgba(5, 10, 20, 0.6)',
            border: `1px solid ${theme.color.primary.dark}`,
            borderRadius: 16,
            overflow: 'hidden',
            boxShadow: `0 0 30px ${theme.color.primary.dark}40`,
            // Mobile Order: 4 (After Personal Info)
            '@media (max-width: 960px)': { order: 4 }
        },
        scannerOverlay: {
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(180deg, rgba(0,255,0,0) 0%, rgba(0,255,0,0.05) 50%, rgba(0,255,0,0) 100%)',
            pointerEvents: 'none',
            zIndex: 10
        },
        identityCard: {
            flexShrink: 0,
            background: 'linear-gradient(135deg, rgba(20, 5, 10, 0.95), rgba(40, 10, 20, 0.95))',
            border: `1px solid ${theme.color.secondary.main}`,
            borderRadius: 16,
            padding: 20,
            boxShadow: `0 0 20px ${theme.color.secondary.main}40`,
            display: 'flex',
            alignItems: 'center',
            gap: 15,
            // Mobile Order: 1 (First)
            '@media (max-width: 960px)': { order: 1 }
        },
        avatarCircle: {
            width: 50,
            height: 50,
            borderRadius: '50%',
            background: theme.color.secondary.main,
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold',
            fontSize: '1.2rem',
            border: '2px solid #fff'
        },
        identityInfo: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start'
        },
        nameTitle: {
            color: '#fff',
            textTransform: 'uppercase',
            fontWeight: 800,
            fontSize: '1rem',
            letterSpacing: 1,
            margin: 0
        },
        idTag: {
            color: theme.color.secondary.main,
            fontSize: '0.75rem',
            letterSpacing: 2,
            marginBottom: 4
        },
        verifiedBadge: {
            background: 'rgba(0, 255, 100, 0.2)',
            color: '#00ff64',
            border: '1px solid #00ff64',
            padding: '2px 8px',
            borderRadius: 12,
            fontSize: '0.65rem',
            fontWeight: 'bold',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4
        },

        // --- RIGHT COLUMN (Data) ---
        rightColumn: {
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: 15,
            overflowY: 'auto',
            paddingRight: 5,
            paddingBottom: 10,
            '&::-webkit-scrollbar': { width: 4 },
            '&::-webkit-scrollbar-thumb': { backgroundColor: theme.color.secondary.dark, borderRadius: 2 },
            '@media (max-width: 960px)': {
                display: 'contents' // Flatten children for reordering
            }
        },
        dataPanel: {
            background: 'rgba(10, 5, 10, 0.7)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: 12,
            padding: 20,
            transition: 'all 0.3s ease',
            '&:hover': {
                borderColor: theme.color.secondary.main,
                boxShadow: `0 0 20px ${theme.color.secondary.main}20`
            }
        },
        // Helpers for mobile ordering of panels
        panelOrder2: { '@media (max-width: 960px)': { order: 2 } }, // QR/Status
        panelOrder3: { '@media (max-width: 960px)': { order: 3 } }, // Personal
        panelOrder5: { '@media (max-width: 960px)': { order: 5 } }, // Academic
        panelOrder6: { '@media (max-width: 960px)': { order: 6 } }, // Events
        
        panelHeader: {
            fontFamily: theme.typography.primary,
            fontSize: '1.1rem',
            color: '#fff',
            marginBottom: 15,
            borderLeft: `3px solid ${theme.color.secondary.main}`,
            paddingLeft: 10,
            textTransform: 'uppercase',
            letterSpacing: 1
        },
        dataGrid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: 15
        },
        dataField: {
            background: 'rgba(0,0,0,0.3)',
            padding: 10,
            borderRadius: 6,
            border: '1px solid rgba(255,255,255,0.05)'
        },
        fieldLabel: {
            display: 'block',
            fontSize: '0.65rem',
            color: '#aaa',
            textTransform: 'uppercase',
            marginBottom: 4,
            letterSpacing: 0.5
        },
        fieldValue: {
            color: '#fff',
            fontSize: '0.9rem',
            fontWeight: 500,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
        },
        paymentRow: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: 'rgba(255, 255, 255, 0.03)',
            padding: 10,
            borderRadius: 6,
            marginBottom: 10
        },
        statusPaid: {
            color: '#00ff64',
            fontWeight: 'bold',
            fontSize: '0.9rem',
            display: 'flex',
            alignItems: 'center',
            gap: 6
        },
        statusPending: {
            color: 'orange',
            fontWeight: 'bold',
            fontSize: '0.9rem'
        },
        qrFlex: {
            display: 'flex',
            gap: 20,
            alignItems: 'center',
            flexWrap: 'wrap'
        },
        qrBox: {
            background: '#fff',
            padding: 8,
            borderRadius: 8,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'transform 0.2s, box-shadow 0.2s',
            boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
        },
        qrContainer: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 8,
            cursor: 'zoom-in',
            flexShrink: 0,
            '&:hover $qrBox': {
                transform: 'scale(1.02) translateY(-2px)',
                boxShadow: '0 8px 25px rgba(0,255,100,0.2)'
            },
            '&:hover $qrExpandHint': {
                color: '#fff'
            }
        },
        qrExpandHint: {
            fontSize: '0.65rem',
            color: '#aaa',
            transition: 'color 0.3s ease',
            textTransform: 'uppercase',
            letterSpacing: 1,
            display: 'flex',
            alignItems: 'center',
            gap: 4
        },
        
        // --- QR OVERLAY ---
        qrOverlay: {
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.9)',
            zIndex: 2000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            animation: '$fadeIn 0.3s ease',
            backdropFilter: 'blur(5px)'
        },
        qrExpandedContent: {
            background: '#fff',
            padding: 20,
            borderRadius: 20,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 20,
            maxWidth: '90%',
            animation: '$scaleIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
        },
        qrExpandedLabel: {
            color: '#000',
            fontFamily: theme.typography.primary,
            fontSize: '1.2rem',
            textAlign: 'center'
        },
        qrCloseHint: {
            color: '#fff',
            marginTop: 20,
            fontFamily: theme.typography.secondary,
            fontSize: '0.8rem',
            letterSpacing: 1
        },
        '@keyframes fadeIn': { from: { opacity: 0 } },
        '@keyframes scaleIn': { from: { transform: 'scale(0.8)', opacity: 0 } },

        // --- ID Viewer Modal ---
        idViewerOverlay: {
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.9)',
            zIndex: 2001, // Higher than QR overlay
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            animation: '$fadeIn 0.3s ease',
            backdropFilter: 'blur(5px)'
        },
        idViewerContent: {
            background: '#1a1a1a',
            padding: 20,
            borderRadius: 16,
            maxWidth: '90vw',
            maxHeight: '90vh',
            display: 'flex',
            flexDirection: 'column',
            gap: 15,
            animation: '$scaleIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            border: '1px solid rgba(255,255,255,0.2)',
            boxShadow: '0 10px 40px rgba(0,0,0,0.5)'
        },
        idViewerHeader: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            color: '#fff',
            fontFamily: theme.typography.primary,
        },
        idViewerCloseBtn: {
            background: 'rgba(255,255,255,0.1)',
            border: '1px solid rgba(255,255,255,0.2)',
            color: '#fff',
            cursor: 'pointer',
            borderRadius: '50%',
            width: 32,
            height: 32,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background 0.2s',
            '&:hover': {
                background: 'rgba(255,255,255,0.2)'
            }
        },
        idViewerMedia: {
            flex: 1,
            overflow: 'auto',
            '& img, & embed': {
                maxWidth: '100%',
                maxHeight: 'calc(90vh - 100px)',
                display: 'block',
                margin: '0 auto',
                borderRadius: 8
            }
        },

        actionsRow: {
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 12,
            marginTop: 'auto',
            '@media (max-width: 960px)': { order: 7 }
        },
        actionBtn: {
            padding: '10px 24px',
            borderRadius: 24,
            border: 'none',
            cursor: 'pointer',
            fontFamily: theme.typography.primary,
            fontWeight: 700,
            textTransform: 'uppercase',
            fontSize: '0.8rem',
            transition: 'all 0.3s ease'
        },
        btnBack: {
            background: 'transparent',
            border: `1px solid ${theme.color.secondary.main}`,
            color: '#fff',
            '&:hover': { background: theme.color.secondary.main }
        },
        btnLogout: {
            background: theme.color.secondary.main,
            color: '#fff',
            boxShadow: `0 0 15px ${theme.color.secondary.main}60`,
            '&:hover': { transform: 'scale(1.05)' }
        }
    };
};

class ProfilePage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: null,
            loading: true,
            registeredEvents: [],
            isQRExpanded: false, // QR Expansion State
            isUploadingId: false, // uploading State
            viewIdUrl: null, // URL for viewing uploaded ID
            isIdViewerOpen: false, // ID Viewer Modal State
            idCardPreviewUrl: null, // Blob URL for the ID
            idCardPreviewType: null, // 'image' or 'pdf'
            isIdLoading: false // Loading state for fetching ID
        };
        this.fileInputRef = React.createRef();
    }

    // Toggle QR Modal
    toggleQRExpansion = () => {
        this.setState(prev => ({ isQRExpanded: !prev.isQRExpanded }));
    }

    componentDidMount() {
        this.checkAuth();
    }

    checkAuth = async () => {
        try {
            const { authService } = await import('@/services/authService');
            const response = await authService.getProfile();
            this.setState({ user: response.user, loading: false });
            
            // Fetch registered events after successful auth
            if (response.user) {
                this.fetchRegisteredEvents();
                if (response.user.idCardUrl) {
                    // Construct the full URL for viewing the ID card
                    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
                    this.setState({ viewIdUrl: `${baseUrl}/api/auth/files/${response.user.idCardUrl}` });
                }
            }
        } catch (error) {
            window.location.href = '/auth?type=login';
        }
    };

    fetchRegisteredEvents = async () => {
        try {
            const response = await api.get('/api/events/user');
            const data = response.data;
            
            let events = [];
            if (Array.isArray(data)) {
                events = data;
            } else if (data.events && Array.isArray(data.events)) {
                events = data.events;
            } else if (data.data && Array.isArray(data.data)) {
                events = data.data;
            }
            
            this.setState({ registeredEvents: events });
        } catch (error) {
            console.error("Failed to fetch registered events", error);
        }
    };

    handleLogout = async () => {
        try {
            const { authService } = await import('@/services/authService');
            const { clearAuthToken } = await import('@/services/api');
            await authService.logout();
            clearAuthToken();
            window.location.href = '/auth?type=login';
        } catch (error) {
            console.error('Logout error:', error);
            window.location.href = '/auth?type=login';
        }
    };

    handleBack = () => {
        window.location.href = '/';
    };

    handleIdCardClick = () => {
        if (this.fileInputRef.current) {
            this.fileInputRef.current.click();
        }
    };

    handleViewIdCard = async () => {
        if (!this.state.viewIdUrl || this.state.isIdLoading) return;

        this.setState({ isIdLoading: true });
        try {
            const response = await api.get(this.state.viewIdUrl, {
                responseType: 'blob', // Important to get the file as a blob
                withCredentials: true
            });

            const contentType = response.headers['content-type'];
            const blob = new Blob([response.data], { type: contentType });
            const previewUrl = URL.createObjectURL(blob);

            this.setState({
                idCardPreviewUrl: previewUrl,
                idCardPreviewType: contentType.startsWith('image/') ? 'image' : 'pdf',
                isIdViewerOpen: true
            });

        } catch (error) {
            console.error('Error fetching ID card:', error);
            alert('Could not load the ID card. Please try again.');
        } finally {
            this.setState({ isIdLoading: false });
        }
    };

    handleCloseIdViewer = () => {
        if (this.state.idCardPreviewUrl) {
            URL.revokeObjectURL(this.state.idCardPreviewUrl);
        }
        this.setState({
            isIdViewerOpen: false,
            idCardPreviewUrl: null,
            idCardPreviewType: null
        });
    };

    handleIdCardUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        // Validate file type
        const validTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        if (!validTypes.includes(file.type)) {
            alert('Invalid file format. Please upload a PDF, JPEG, PNG, or WebP file.');
            return;
        }

        // Validate file size (max 10MB)
        const maxSize = 10 * 1024 * 1024;
        if (file.size > maxSize) {
            alert('File size is too large. Max allowed size is 10MB.');
            return;
        }

        const formData = new FormData();
        // Using 'idCard' as field name, common convention for named uploads
        formData.append('idCard', file);

        this.setState({ isUploadingId: true });

        try {
            await api.post('/api/auth/user/id-card', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                withCredentials: true // Ensure cookies are sent
            });
            alert('ID Card uploaded successfully!');
            // Refresh user profile to reflect any changes
            this.checkAuth();
        } catch (error) {
            console.error('ID upload error:', error);
            const msg = error.response?.data?.message || 'Failed to upload ID Card.';
            alert(msg);
        } finally {
            this.setState({ isUploadingId: false });
            // Reset input value to allow re-uploading the same file if needed
            if (this.fileInputRef.current) {
                this.fileInputRef.current.value = '';
            }
        }
    };

    render() {
        const { classes } = this.props;
        const { user, loading, registeredEvents, isQRExpanded, isUploadingId, viewIdUrl, isIdViewerOpen, idCardPreviewUrl, idCardPreviewType, isIdLoading } = this.state;

        if (loading || !user) return null;

        return (
            <SecuenceComponent>
                <div className={classes.root}>
                    <div className={classes.dashboardContainer}>
                        
                        {/* LEFT COLUMN: VISUALS + IDENTITY */}
                        <div className={classes.leftColumn}>
                            
                            {/* 1. Main Identity Card (First on Mobile) */}
                            <div className={classes.identityCard}>
                                <div className={classes.avatarCircle}>
                                    {user.name?.charAt(0).toUpperCase()}
                                </div>
                                <div className={classes.identityInfo}>
                                    <h2 className={classes.nameTitle}>{user.name}</h2>
                                    <span className={classes.idTag}>ID: {user.uniqueId}</span>
                                    {user.verified && (
                                        <div className={classes.verifiedBadge}>
                                            <span>✓</span> Verified
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* 2. Interactive Graph (Fourth on Mobile) */}
                            <div className={classes.scannerContainer}>
                                <IdentityNode user={user} />
                                <div className={classes.scannerOverlay} />
                            </div>

                        </div>

                        {/* RIGHT COLUMN: DATA DETAILS */}
                        <div className={classes.rightColumn}>
                             
                             {/* 3. Personal Profile & QR (Merged) */}
                             <div className={`${classes.dataPanel} ${classes.panelOrder2}`}>
                                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap-reverse', gap: 20}}>
                                    
                                    {/* Info Side */}
                                    <div style={{flex: 1, minWidth: '200px', display: 'flex', flexDirection: 'column', gap: 12}}>
                                        <h3 className={classes.panelHeader} style={{marginBottom: 10}}>Profile Details</h3>
                                        <div className={classes.dataGrid}>
                                            <div className={classes.dataField}>
                                                <label className={classes.fieldLabel}>Phone</label>
                                                <div className={classes.fieldValue}>{user.phone}</div>
                                            </div>
                                            <div className={classes.dataField}>
                                                <label className={classes.fieldLabel}>Gender</label>
                                                <div className={classes.fieldValue}>{user.gender || '-'}</div>
                                            </div>
                                            <div className={classes.dataField} style={{gridColumn: '1 / -1'}}>
                                                <label className={classes.fieldLabel}>College / Institution</label>
                                                <div className={classes.fieldValue} style={{whiteSpace: 'normal', lineHeight: 1.4}}>{user.college}</div>
                                            </div>
                                            <div className={classes.dataField} style={{gridColumn: '1 / -1'}}>
                                                <label className={classes.fieldLabel}>Department</label>
                                                <div className={classes.fieldValue}>{user.department}</div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* QR Side */}
                                    <div className={classes.qrContainer} onClick={this.toggleQRExpansion}>
                                        <div className={classes.qrBox}>
                                            <QRCodeSVG
                                                value={JSON.stringify({ type: "PARTICIPANT", id: user.uniqueId })}
                                                size={110}
                                            />
                                        </div>
                                        <div className={classes.qrExpandHint}>
                                             Tap to expand
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* 4. Account & Payment Status (Moved Down) */}
                            <div className={`${classes.dataPanel} ${classes.panelOrder3}`}>
                                <h3 className={classes.panelHeader}>Account Status</h3>
                                <div className={classes.dataGrid}>
                                    <div className={classes.dataField} style={{gridColumn: '1 / -1'}}>
                                        <label className={classes.fieldLabel}>Email</label>
                                        <div className={classes.fieldValue}>{user.email}</div>
                                    </div>
                                    <div className={classes.dataField}>
                                        <label className={classes.fieldLabel}>General Fee</label>
                                        {user.generalFeePaid ? (
                                             <span className={classes.statusPaid}><span>●</span> Paid</span>
                                        ) : (
                                            <span className={classes.statusPending}>Pending</span>
                                        )}
                                    </div>
                                    <div className={classes.dataField}>
                                        <label className={classes.fieldLabel}>Student Type</label>
                                        <div className={classes.fieldValue}>{user.isPSGStudent ? 'PSG Student' : 'External'}</div>
                                    </div>
                                    <div className={classes.dataField}>
                                        <label className={classes.fieldLabel}>Accommodation</label>
                                        <div className={classes.fieldValue}>{user.accomodation ? 'Yes' : 'No'}</div>
                                    </div>
                                    <div className={classes.dataField}>
                                        <label className={classes.fieldLabel}>Reg. Source</label>
                                        <div className={classes.fieldValue} style={{textTransform:'capitalize'}}>{user.source}</div>
                                    </div>
                                </div>

                                {/* ID Card Upload Section */}
                                <div style={{ marginTop: 20, paddingTop: 15, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                                    <input
                                        type="file"
                                        ref={this.fileInputRef}
                                        style={{ display: 'none' }}
                                        accept=".pdf,.jpg,.jpeg,.png,.webp"
                                        onChange={this.handleIdCardUpload}
                                    />
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
                                        <div>
                                            <div className={classes.fieldLabel} style={{marginBottom: 2}}>Identity Verification</div>
                                            <div style={{ fontSize: '0.7rem', color: '#888' }}>Upload College ID (Max 10MB)</div>
                                            {user.idCardUploaded && (
                                                <div style={{ color: '#00ff64', fontSize: '0.7rem', marginTop: 2 }}>✓ ID Card Uploaded</div>
                                            )}
                                        </div>
                                        <div style={{ display: 'flex', gap: 8 }}>
                                            {viewIdUrl && (
                                                <button
                                                    className={classes.actionBtn}
                                                    style={{ fontSize: '0.7rem', padding: '8px 16px', backgroundColor: 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)'}}
                                                    onClick={this.handleViewIdCard}
                                                    disabled={isIdLoading}
                                                >
                                                    {isIdLoading ? 'Loading...' : 'View ID'}
                                                </button>
                                            )}
                                            <button 
                                                className={classes.actionBtn}
                                                style={{ 
                                                    fontSize: '0.7rem', 
                                                    padding: '8px 16px', 
                                                    backgroundColor: 'rgba(255,255,255,0.1)', 
                                                    color: '#fff',
                                                    border: '1px solid rgba(255,255,255,0.2)',
                                                    minWidth: 100
                                                }}
                                                onClick={this.handleIdCardClick}
                                                disabled={isUploadingId}
                                            >
                                                {isUploadingId ? 'Uploading...' : (user.idCardUploaded ? 'Re-upload' : 'Upload')}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* 5. Registered Events Section */}
                            <div className={`${classes.dataPanel} ${classes.panelOrder6}`}>
                                <h3 className={classes.panelHeader}>Registered Events</h3>
                                {registeredEvents && registeredEvents.length > 0 ? (
                                    <div className={classes.dataGrid}>
                                        {registeredEvents.map((event, index) => (
                                            <div key={index} className={classes.dataField}>
                                                <label className={classes.fieldLabel}>{event.category || 'Event'}</label>
                                                <div className={classes.fieldValue} title={event.eventName || event.name}>
                                                    {event.eventName || event.name || 'Unnamed Event'}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div style={{ padding: '10px', color: '#888', fontStyle: 'italic', fontSize: '0.85rem' }}>
                                        No registered events yet.
                                    </div>
                                )}
                            </div>

                            {/* Action Buttons */}
                            <div className={classes.actionsRow}>
                                <button className={`${classes.actionBtn} ${classes.btnBack}`} onClick={this.handleBack}>
                                    Home
                                </button>
                                <button className={`${classes.actionBtn} ${classes.btnLogout}`} onClick={this.handleLogout}>
                                    Logout
                                </button>
                            </div>

                        </div>
                    </div>

                    {/* QR EXPANSION OVERLAY */}
                    {isQRExpanded && (
                        <div className={classes.qrOverlay} onClick={this.toggleQRExpansion}>
                            <div className={classes.qrExpandedContent} onClick={(e) => e.stopPropagation()}>
                                <h3 className={classes.qrExpandedLabel}>{user.name}</h3>
                                <QRCodeSVG
                                    value={JSON.stringify({ type: "PARTICIPANT", id: user.uniqueId })}
                                    size={300}
                                />
                                <div style={{textAlign:'center', fontSize:'0.9rem', color:'#555'}}>
                                    {user.uniqueId}
                                </div>
                                <div className={classes.qrCloseHint}>
                                    Tap outside to close
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ID VIEWER OVERLAY */}
                    {isIdViewerOpen && (
                        <div className={classes.idViewerOverlay} onClick={this.handleCloseIdViewer}>
                            <div className={classes.idViewerContent} onClick={(e) => e.stopPropagation()}>
                                <div className={classes.idViewerHeader}>
                                    <span>Identity Verification Document</span>
                                    <button className={classes.idViewerCloseBtn} onClick={this.handleCloseIdViewer}>
                                        &times;
                                    </button>
                                </div>
                                <div className={classes.idViewerMedia}>
                                    {idCardPreviewType === 'image' && (
                                        <img src={idCardPreviewUrl} alt="ID Card Preview" />
                                    )}
                                    {idCardPreviewType === 'pdf' && (
                                        <embed src={idCardPreviewUrl} type="application/pdf" width="100%" height="100%" />
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </SecuenceComponent>
        );
    }
}

ProfilePage.propTypes = {
    classes: PropTypes.any.isRequired
};

export default withStyles(styles)(ProfilePage);
