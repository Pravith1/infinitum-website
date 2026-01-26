'use client';
import React from 'react';
import PropTypes from 'prop-types';
import { QRCodeSVG } from 'qrcode.react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import api from '@/services/api';
import axios from 'axios';
import { useSearchParams, useRouter } from 'next/navigation';

import { withStyles } from '@/tools/withStyles';
import { Secuence as SecuenceComponent } from '@/components/Secuence';
import { Button } from '@/components/Button';
import colleges from '@/app/CollegeList';
import { eventService } from '@/services/eventservice';

// Accommodation Instructions
const ACCOMMODATION_INSTRUCTIONS = [
    "Accommodation is provided on a first-come, first-served basis. Only the first 100 registrations will be accommodated (50 boys and 50 girls).",
    "The accommodation fee is ₹250 per night (₹500 for 2 nights). Payment QR code will be provided at the time of check-in.",
    "Food will not be provided. Participants must arrange their own meals.",
    "Accommodation is provided in PSG IMSR hostel. Two beds with bedsheets will be provided per room.",
    "Strictly no drinking, smoking, or any prohibited substances. Violators will be disqualified from the event and their respective institutions will be informed.",
    "Participants must follow all hostel rules and regulations during their stay.",
    "Please carry a valid college ID card for verification at check-in."
];

// --- Mobile Quick Actions Component ---
const MobileActions = ({ user, classes, onQrClick, onIdClick, onViewIdClick, isIdLoading, viewIdUrl, idToUpload }) => (
    <div className={classes.mobileActionsContainer}>
        {/* ID Verification Header */}
        <h3 className={classes.panelHeader} style={{ marginBottom: 10 }}>Identity Verification</h3>

        {/* QR Code */}
        <div className={classes.qrContainer} onClick={onQrClick} style={{ justifyContent: 'center', marginTop: 10 }}>
            <div className={classes.qrBox}>
                <QRCodeSVG
                    value={JSON.stringify({ type: "PARTICIPANT", uniqueId: user.uniqueId })}
                    size={80}
                />
            </div>
            <div className={classes.qrExpandHint} style={{ textAlign: 'center' }}>
                Tap to expand QR
            </div>
        </div>

        {/* ID Verification Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, marginTop: 15, width: '100%' }}>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap' }}>
                {viewIdUrl && !idToUpload && (
                    <button
                        className={classes.actionBtn}
                        onClick={onViewIdClick}
                        disabled={isIdLoading}
                    >
                        {isIdLoading ? '...' : 'View ID'}
                    </button>
                )}
                {!idToUpload && (
                    <button
                        className={classes.actionBtn}
                        onClick={onIdClick}
                    >
                        {user.profilePhoto ? 'Re-upload' : 'Upload'}
                    </button>
                )}
            </div>
            {user.profilePhoto && !idToUpload && (
                <div style={{ color: '#00ff64', fontSize: '0.7rem', marginTop: 2 }}>✓ ID Uploaded</div>
            )}
        </div>
    </div>
);


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
        while (this.mountRef.current.firstChild) {
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
        const year = user.year || 1;
        const isInternal = user.isPSGStudent;
        const isPaid = user.generalFeePaid;

        let baseColorHex, innerGeometry, outerGeometry;
        this.speedMultiplier = 0.5 + (year * 0.2); // Base speed

        switch (year) {
            case 1: // Freshman: Simple, foundational shapes
                baseColorHex = isPaid ? 0x00f0ff : 0xff0055; // Cyan / Red
                innerGeometry = isInternal ? new THREE.BoxGeometry(1.5, 1.5, 1.5) : new THREE.TetrahedronGeometry(1.4, 0);
                outerGeometry = new THREE.BoxGeometry(2.2, 2.2, 2.2);
                this.speedMultiplier = 0.6;
                break;
            case 2: // Sophomore: More complex, developing
                baseColorHex = isPaid ? 0x00ff88 : 0xff6b35; // Green / Orange
                innerGeometry = isInternal ? new THREE.OctahedronGeometry(1.3, 0) : new THREE.ConeGeometry(1, 2, 4);
                outerGeometry = new THREE.OctahedronGeometry(2.0, 1);
                this.speedMultiplier = 0.8;
                break;
            case 3: // Junior: Established, intricate
                baseColorHex = isPaid ? 0xffff00 : 0xff44ff; // Yellow / Magenta
                innerGeometry = isInternal ? new THREE.IcosahedronGeometry(1.2, 0) : new THREE.TorusKnotGeometry(0.8, 0.3, 100, 8);
                outerGeometry = new THREE.IcosahedronGeometry(1.8, 1);
                this.speedMultiplier = 1.0;
                // Add a single ring for juniors
                const ringGeometry = new THREE.TorusGeometry(2.8, 0.02, 16, 100);
                const ringMaterial = new THREE.MeshBasicMaterial({ color: baseColorHex, transparent: true, opacity: 0.6 });
                this.ringMesh = new THREE.Mesh(ringGeometry, ringMaterial);
                this.scene.add(this.ringMesh);
                break;
            case 4: // Senior: Advanced, refined
                baseColorHex = isPaid ? 0xff8c00 : 0x9400d3; // Orange / Dark Violet
                innerGeometry = isInternal ? new THREE.DodecahedronGeometry(1.4, 0) : new THREE.CylinderGeometry(1, 1, 2, 6);
                outerGeometry = new THREE.DodecahedronGeometry(2.2, 1);
                this.speedMultiplier = 1.2;
                // Add two rings for seniors
                const ring1 = new THREE.TorusGeometry(2.8, 0.02, 16, 100);
                const ring2 = new THREE.TorusGeometry(3.1, 0.02, 16, 100);
                const ringMat = new THREE.MeshBasicMaterial({ color: baseColorHex, transparent: true, opacity: 0.7 });
                this.ringMesh = new THREE.Mesh(ring1, ringMat);
                this.ringMesh2 = new THREE.Mesh(ring2, ringMat);
                this.scene.add(this.ringMesh);
                this.scene.add(this.ringMesh2);
                break;
            case 5: // Post-grad/Master: Mastered, complex & stable
            default:
                baseColorHex = isPaid ? 0xffffff : 0xaaaaaa; // White / Grey
                innerGeometry = isInternal ? new THREE.TorusKnotGeometry(1, 0.2, 128, 16) : new THREE.SphereGeometry(1.2, 32, 16);
                outerGeometry = new THREE.SphereGeometry(2.5, 64, 32);
                this.speedMultiplier = 1.4;
                // Three rings for masters
                const mRing1 = new THREE.TorusGeometry(2.8, 0.03, 16, 100);
                const mRing2 = new THREE.TorusGeometry(3.2, 0.02, 16, 100);
                const mRing3 = new THREE.TorusGeometry(3.5, 0.01, 16, 100);
                const mRingMat = new THREE.MeshBasicMaterial({ color: baseColorHex, transparent: true, opacity: 0.8 });
                this.ringMesh = new THREE.Mesh(mRing1, mRingMat);
                this.ringMesh2 = new THREE.Mesh(mRing2, mRingMat);
                this.ringMesh3 = new THREE.Mesh(mRing3, mRingMat);
                this.scene.add(this.ringMesh);
                this.scene.add(this.ringMesh2);
                this.scene.add(this.ringMesh3);
                break;
        }

        // 3. Objects Group
        this.coreGroup = new THREE.Group();
        this.scene.add(this.coreGroup);

        // A. INNER CORE (The Identity)
        const innerMaterial = new THREE.MeshBasicMaterial({
            color: baseColorHex,
            wireframe: true,
            transparent: true,
            opacity: 0.8
        });
        this.innerMesh = new THREE.Mesh(innerGeometry, innerMaterial);
        this.coreGroup.add(this.innerMesh);

        // B. OUTER SHELL (The Shield)
        const outerMaterial = new THREE.MeshBasicMaterial({
            color: baseColorHex,
            wireframe: true,
            transparent: true,
            opacity: 0.15
        });
        this.outerMesh = new THREE.Mesh(outerGeometry, outerMaterial);
        this.coreGroup.add(this.outerMesh);

        // C. SENIOR RING (Rank Indicator - Only for Year 3+) - Logic moved to switch case

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
        if (this.ringMesh2) {
            this.ringMesh2.rotation.x = Math.PI / 2 + (Math.cos(time * 0.4) * 0.15);
            this.ringMesh2.rotation.y = -time * 0.2;
        }
        if (this.ringMesh3) {
            this.ringMesh3.rotation.x = Math.PI / 2 + (Math.sin(time * 0.3) * 0.2);
            this.ringMesh3.rotation.y = time * 0.1;
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
        const { user, isMobile } = this.props;
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
                {!isMobile && (
                    <div style={overlayStyle}>
                        <div style={{ color: statusColor, fontWeight: 'bold', fontSize: '0.9rem' }}>
                            STATUS: {user.generalFeePaid ? 'ONLINE' : 'RESTRICTED'}
                        </div>
                        <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem', marginTop: 4 }}>
                            LEVEL {user.year || 1} // {user.isPSGStudent ? 'CORE' : 'PRISM'}
                        </div>
                    </div>
                )}

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
            height: '100vh', // Use height instead of minHeight
            position: 'relative',
            display: 'flex',
            flexDirection: 'column', // Set flex direction here
            alignItems: 'center', // Center the dashboard container
            padding: '0 20px 20px', // Remove top padding
            overflow: 'hidden', // Hide overflow to prevent body scroll
            '@media (max-width: 960px)': {
                height: 'auto', // Allow content to define height on mobile
                padding: '20px 15px 30px', // Add top padding back for mobile
                overflowY: 'auto', // Allow vertical scrolling on mobile
            }
        },
        headerActions: {
            position: 'absolute',
            top: 20,
            right: 20,
            display: 'flex',
            gap: 12,
            zIndex: 100,
            '@media (max-width: 960px)': {
                top: 30,
                right: 15,
            }
        },
        dashboardContainer: {
            width: '100%',
            maxWidth: 1200,
            flex: 1, // Allow container to fill remaining space
            minHeight: 0, // Prevent flexbox overflow issues
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
            position: 'relative', // For positioning the mobile graph
            // Mobile Order: 1 (First)
            '@media (max-width: 960px)': { order: 1 }
        },
        mobileGraphContainer: {
            display: 'none', // Hidden by default
            '@media (max-width: 960px)': {
                display: 'block',
                width: 70,
                height: 70,
                position: 'absolute',
                right: 15,
                top: '50%',
                transform: 'translateY(-50%)',
                borderRadius: 8,
                overflow: 'hidden',
                border: '1px solid rgba(255,255,255,0.1)'
            }
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
            margin: 0,
            '@media (max-width: 960px)': {
                fontSize: '0.9rem'
            }
        },
        idTag: {
            color: theme.color.secondary.main,
            fontSize: '0.75rem',
            letterSpacing: 2,
            marginBottom: 4,
            '@media (max-width: 960px)': {
                fontSize: '0.65rem'
            }
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
            '&::-webkit-scrollbar': { width: 6 }, // Slightly wider for border
            '&::-webkit-scrollbar-thumb': {
                backgroundColor: 'transparent',
                border: '2px solid #FFD700', // Yellow border
                borderRadius: 0 // Rectangle shape
            },
            '@media (max-width: 960px)': {
                display: 'contents' // Flatten children for reordering
            }
        },
        dataPanel: {
            background: 'rgba(10, 5, 10, 0.7)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 12,
            padding: 20,
            transition: 'all 0.3s ease',
            '&:hover': {
                borderColor: theme.color.secondary.main,
                boxShadow: `0 0 20px ${theme.color.secondary.main}20`
            }
        },
        accordionHeader: {
            cursor: 'pointer',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            '&::after': {
                content: '"\\25BC"', // Down arrow
                transition: 'transform 0.3s ease',
                fontSize: '0.8rem',
                color: '#888'
            }
        },
        accordionHeaderOpen: {
            '&::after': {
                transform: 'rotate(180deg)' // Up arrow
            }
        },
        accordionContent: {
            maxHeight: 0,
            overflow: 'hidden',
            transition: 'max-height 0.5s ease-out, padding-top 0.5s ease-out',
            paddingTop: 0,
        },
        accordionContentOpen: {
            paddingTop: 15,
            maxHeight: '1500px', // Large enough to not clip content
            transition: 'max-height 1s ease-in, padding-top 0.5s ease-in',
        },
        // Helpers for mobile ordering of panels
        panelOrder2: { '@media (max-width: 960px)': { order: 3 } }, // Profile Details
        panelOrder3: { '@media (max-width: 960px)': { order: 4 } }, // Account Status
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

        // --- Mobile Actions Bar ---
        mobileActionsContainer: {
            display: 'none',
            '@media (max-width: 960px)': {
                order: 2, // Show right after the main identity card
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'stretch',
                gap: 0,
                padding: '15px',
                background: 'rgba(10, 5, 10, 0.7)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 12,
            }
        },
        mobileSectionHeader: {
            fontFamily: theme.typography.primary,
            fontSize: '0.9rem',
            color: '#fff',
            textTransform: 'uppercase',
            letterSpacing: 1,
            margin: 0,
            paddingBottom: 4,
            borderBottom: `2px solid ${theme.color.secondary.main}`,
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
            width: '90vw',
            height: '90vh',
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
            width: '100%', // Ensure full width
            minHeight: 0, // Critical for flex child scrolling/sizing
            overflow: 'hidden',
            position: 'relative',
            '& img': {
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                display: 'block',
                margin: '0 auto',
                borderRadius: 8
            },
            '& embed': {
                width: '100%',
                height: '100%',
                display: 'block',
                margin: '0 auto',
                borderRadius: 8,
                border: 'none'
            }
        },

        actionsRow: {
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 12,
            marginTop: 'auto',
            '@media (max-width: 960px)': {
                order: 7,
                display: 'none' // Hide original buttons on mobile
            }
        },
        actionBtn: {
            padding: '8px 16px',
            border: 'none',
            cursor: 'pointer',
            fontFamily: theme.typography.primary,
            fontWeight: 700,
            textTransform: 'uppercase',
            fontSize: '0.75rem',
            transition: 'all 0.3s ease',
            textAlign: 'center',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            whiteSpace: 'nowrap', // Prevent text wrapping
            background: 'rgba(255,255,255,0.1)',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.2)',
            '&:hover': {
                background: 'rgba(255,255,255,0.2)'
            },
            '@media (max-width: 960px)': {
                padding: '6px 12px',
                fontSize: '0.7rem',
            },
            '@media (max-width: 480px)': {
                padding: '6px 12px',
                fontSize: '0.65rem',
            }
        },
        btnBack: {
            background: 'transparent',
            border: `1px solid ${theme.color.secondary.main}`,
            color: '#fff',
            '&:hover, &:active': {
                background: theme.color.secondary.main,
                color: '#fff !important'
            }
        },
        btnLogout: {
            background: theme.color.secondary.main,
            color: '#fff',
            boxShadow: `0 0 15px ${theme.color.secondary.main}60`,
            '&:hover, &:active': {
                transform: 'scale(1.05)',
                color: '#fff !important'
            }
        },
        // Mobile-only logout button container at bottom of page
        mobileLogoutContainer: {
            display: 'none',
            '@media (max-width: 767px)': {
                display: 'flex',
                order: 99, // Ensure it appears last
                justifyContent: 'center',
                padding: '20px 0',
                marginTop: 10
            }
        },
        mobileLogoutBtn: {
            background: theme.color.secondary.main,
            color: '#fff',
            border: 'none',
            padding: '14px 40px',
            fontFamily: theme.typography.primary,
            fontWeight: 700,
            fontSize: '0.9rem',
            textTransform: 'uppercase',
            letterSpacing: 1,
            cursor: 'pointer',
            clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)',
            boxShadow: `0 0 20px ${theme.color.secondary.main}60`,
            transition: 'all 0.3s ease',
            '&:active': {
                transform: 'scale(0.95)'
            }
        },
        editInput: {
            background: 'rgba(255,255,255,0.1)',
            color: '#fff',
            padding: 10,
            borderRadius: 6,
            border: '1px solid rgba(255,255,255,0.2)',
            fontSize: '0.9rem',
            width: '100%',
            boxSizing: 'border-box',
            '&:focus': {
                outline: 'none',
                borderColor: theme.color.secondary.main,
                boxShadow: `0 0 5px ${theme.color.secondary.main}40`
            },
            '&::placeholder': {
                color: 'rgba(255,255,255,0.7)'
            }
        },
        editSelect: {
            appearance: 'none',
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23c72071' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right 12px center',
            paddingRight: 36,
            '& option': {
                background: '#1a020b',
                color: '#eeeeee',
                border: `1px solid ${theme.color.secondary.main}`
            }
        },
        // Tab Navigation Styles
        tabNavigation: {
            display: 'flex',
            gap: 0,
            marginBottom: 20,
            borderBottom: '1px solid rgba(255,255,255,0.1)',
            '@media (max-width: 960px)': {
                marginBottom: 15
            }
        },
        tab: {
            padding: '12px 24px',
            background: 'transparent',
            border: 'none',
            borderBottom: '2px solid transparent',
            color: '#888',
            fontFamily: theme.typography.primary,
            fontSize: '0.9rem',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: 1,
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            '&:hover': {
                color: '#fff',
                background: 'rgba(255,255,255,0.05)'
            },
            '@media (max-width: 960px)': {
                padding: '10px 16px',
                fontSize: '0.75rem'
            }
        },
        tabActive: {
            color: theme.color.secondary.main,
            borderBottomColor: theme.color.secondary.main,
            '&:hover': {
                color: theme.color.secondary.main
            }
        },
        // Accommodation Section Styles
        accommodationPanel: {
            background: 'rgba(10, 5, 10, 0.7)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 12,
            padding: 20,
            marginBottom: 15
        },
        instructionsList: {
            listStyle: 'none',
            padding: 0,
            margin: 0,
            '& li': {
                position: 'relative',
                paddingLeft: 20,
                marginBottom: 12,
                color: '#ccc',
                fontSize: '0.85rem',
                lineHeight: 1.5,
                '&::before': {
                    content: '"▸"',
                    position: 'absolute',
                    left: 0,
                    color: theme.color.secondary.main
                }
            }
        },
        accommodationForm: {
            display: 'flex',
            flexDirection: 'column',
            gap: 15,
            marginTop: 20
        },
        formRow: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 15
        },
        formField: {
            display: 'flex',
            flexDirection: 'column',
            gap: 6
        },
        formLabel: {
            fontSize: '0.75rem',
            color: '#aaa',
            textTransform: 'uppercase',
            letterSpacing: 0.5
        },
        registeredBadge: {
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            padding: '6px 12px',
            background: 'rgba(0, 255, 100, 0.15)',
            border: '1px solid #00ff64',
            borderRadius: 20,
            color: '#00ff64',
            fontSize: '0.8rem',
            fontWeight: 600
        },
        detailsGrid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: 15,
            marginTop: 15
        },
        detailItem: {
            background: 'rgba(0,0,0,0.3)',
            padding: 12,
            borderRadius: 8,
            border: '1px solid rgba(255,255,255,0.05)'
        },
        detailLabel: {
            display: 'block',
            fontSize: '0.65rem',
            color: '#888',
            textTransform: 'uppercase',
            marginBottom: 4,
            letterSpacing: 0.5
        },
        detailValue: {
            color: '#fff',
            fontSize: '0.9rem',
            fontWeight: 500
        },
        // Success Popup Styles
        successOverlay: {
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.85)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            backdropFilter: 'blur(5px)'
        },
        successPopup: {
            background: 'linear-gradient(135deg, #0a050a 0%, #1a0a1a 100%)',
            border: '2px solid #00ff64',
            borderRadius: 16,
            padding: '40px 50px',
            textAlign: 'center',
            maxWidth: 400,
            boxShadow: '0 0 40px rgba(0,255,100,0.3)'
        },
        successIcon: {
            width: 70,
            height: 70,
            borderRadius: '50%',
            background: 'rgba(0,255,100,0.15)',
            border: '3px solid #00ff64',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
            fontSize: '2rem',
            color: '#00ff64'
        },
        successTitle: {
            fontSize: '1.4rem',
            fontWeight: 700,
            color: '#00ff64',
            marginBottom: 10
        },
        successMessage: {
            fontSize: '0.9rem',
            color: '#ccc',
            marginBottom: 25,
            lineHeight: 1.5
        },
        successBtn: {
            background: '#00ff64',
            color: '#000',
            border: 'none',
            padding: '12px 40px',
            borderRadius: 8,
            fontSize: '0.9rem',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            '&:hover': {
                transform: 'scale(1.05)',
                boxShadow: '0 0 20px rgba(0,255,100,0.5)'
            }
        },
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
            isIdLoading: false, // Loading state for fetching ID
            idToUpload: null, // Staged file for upload
            idToUploadPreview: null, // Preview URL for staged file
            idToUploadType: null, // Type of staged file
            openAccordion: null, // Tracks which accordion is open on mobile
            isMobile: false, // Tracks if mobile view is active
            isEditing: false,
            formData: {},
            isSaving: false,
            // Accommodation state
            activeTab: 'profile',
            accommodationData: null,
            accommodationLoading: true,
            accommodationRegistered: false,
            accommodationForm: {
                residentialAddress: '',
                city: '',
                gender: ''
            },
            accommodationSubmitting: false,
            accommodationError: null,
            accommodationSuccess: false, // Success popup state
            showFeeReminder: false, // Reminder state (initially hidden)
        };
        this.fileInputRef = React.createRef();
    }

    // Toggle QR Expansion
    toggleQRExpansion = () => {
        this.setState(prev => ({ isQRExpanded: !prev.isQRExpanded }));
    }

    checkMobile = () => {
        this.setState({ isMobile: window.innerWidth <= 960 });
    };

    componentDidMount() {
        // Set initial tab from URL query param (passed via props)
        if (this.props.initialTab) {
            this.setState({ activeTab: this.props.initialTab });
        }
        this.checkAuth();

        this.checkMobile();
        window.addEventListener('resize', this.checkMobile);

        // Show reminder after 3 seconds
        this.reminderTimer = setTimeout(() => {
            this.setState({ showFeeReminder: true });
        }, 3000);
    }

    componentWillUnmount() {
        try {
            window.removeEventListener('resize', this.checkMobile);
        } catch (e) { }
    }

    checkAuth = async () => {
        try {
            const { authService } = await import('@/services/authService');
            const response = await authService.getProfile();
            this.setState({ user: response.user, loading: false }, () => {
                // Fetch accommodation after user is set
                this.fetchAccommodation();
            });

            // Fetch registered events after successful auth
            if (response.user) {
                this.fetchRegisteredItems();
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

    fetchRegisteredItems = async () => {
        try {
            const [eventsRes, workshopsRes, papersRes] = await Promise.all([
                eventService.getUserEvents(),
                eventService.getUserWorkshops(),
                eventService.getUserPapers()
            ]);

            const safeExtract = (res, key) => {
                if (!res) return [];
                if (Array.isArray(res)) return res;
                if (res[key] && Array.isArray(res[key])) return res[key];
                if (res.data && Array.isArray(res.data)) return res.data;
                return [];
            };

            const events = safeExtract(eventsRes, 'events');
            const workshops = safeExtract(workshopsRes, 'workshops');
            const papers = safeExtract(papersRes, 'papers');

            const allItems = [
                ...events.map(item => ({ ...item, itemType: 'event' })),
                ...workshops.map(item => ({ ...item, itemType: 'workshop' })),
                ...papers.map(item => ({ ...item, itemType: 'paper' }))
            ];

            this.setState({ registeredEvents: allItems });
        } catch (error) {
            console.error("Failed to fetch registered items", error);
        }
    };

    // Accommodation Methods
    fetchAccommodation = async () => {
        this.setState({ accommodationLoading: true });

        const { user } = this.state;
        if (!user?.uniqueId) return;

        try {
            const response = await api.get(`/api/acc/accommodation/uniqueId/${user.uniqueId}`);
            //console.log(response);
            if (response.data.success && response.data.data?.accommodation) {
                this.setState({
                    accommodationData: response.data.data.accommodation,
                    accommodationRegistered: true,
                    accommodationLoading: false
                });
            } else {
                this.setState({ accommodationLoading: false });
            }
        } catch (error) {
            // 404 means not registered - this is expected
            if (error.response?.status === 404) {
                this.setState({ accommodationLoading: false, accommodationRegistered: false });
            } else {
                this.setState({
                    accommodationLoading: false,
                    accommodationError: 'Failed to check accommodation status'
                });
            }
        }
    };

    handleAccommodationFormChange = (e) => {
        const { name, value } = e.target;
        this.setState(prevState => ({
            accommodationForm: {
                ...prevState.accommodationForm,
                [name]: value
            }
        }));
    };

    registerAccommodation = async () => {
        const { user, accommodationForm } = this.state;

        // Validate required fields
        if (!accommodationForm.residentialAddress || !accommodationForm.city || !accommodationForm.gender) {
            alert('Please fill in all required fields');
            return;
        }

        this.setState({ accommodationSubmitting: true, accommodationError: null });

        try {
            const payload = {
                name: user.name,
                email: user.email,
                uniqueId: user.uniqueId,
                college: user.college,
                phone: user.phone,
                residentialAddress: accommodationForm.residentialAddress,
                city: accommodationForm.city,
                gender: accommodationForm.gender,
                amount: 0,
                optin: true
            };
            const response = await api.post('/api/acc/accommodation/register', payload);

            if (response.data.success) {
                this.setState({
                    accommodationData: response.data.data,
                    accommodationRegistered: true,
                    accommodationSubmitting: false,
                    accommodationSuccess: true // Show success popup
                });
            }
        } catch (error) {
            let errorMessage = 'Failed to register accommodation';
            if (error.response?.status === 409) {
                errorMessage = 'You have already registered for accommodation';
                // Re-fetch to get the existing data
                this.fetchAccommodation();
            } else if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            }
            this.setState({
                accommodationSubmitting: false,
                accommodationError: errorMessage
            });
            alert(errorMessage);
        }
    };

    handleTabChange = (tab) => {
        this.setState({ activeTab: tab });
        // Update URL without reload
        const url = new URL(window.location);
        if (tab === 'profile') {
            url.searchParams.delete('tab');
        } else {
            url.searchParams.set('tab', tab);
        }
        window.history.pushState({}, '', url);
    };

    handleLogout = async () => {
        try {
            const { authService } = await import('@/services/authService');
            await authService.logout();
            window.location.href = '/auth?type=login';
        } catch (error) {
            console.error('Logout error:', error);
            // Even if logout fails on server, clear client-side auth
            const { clearAuthToken } = await import('@/services/api');
            clearAuthToken();
            window.location.href = '/auth?type=login';
        }
    };

    handleEdit = () => {
        const { user } = this.state;
        this.setState({
            isEditing: true,
            formData: {
                name: user.name || '',
                phone: user.phone || '',
                college: user.college || '',
                department: user.department || '',
                year: user.year || '',
                discoveryMethod: user.discoveryMethod || ''
            }
        });
    };

    handleCancelEdit = () => {
        this.setState({ isEditing: false, formData: {} });
    };

    handleFormChange = (e) => {
        const { name, value } = e.target;
        this.setState(prevState => ({
            formData: {
                ...prevState.formData,
                [name]: value
            }
        }));
    };

    handleSave = async () => {
        this.setState({ isSaving: true });
        try {
            const { authService } = await import('@/services/authService');
            await authService.updateProfile(this.state.formData);
            // Refresh user data
            await this.checkAuth();
            this.setState({ isEditing: false, isSaving: false });
            alert('Profile updated successfully!');
        } catch (error) {
            console.error('Failed to update profile', error);
            alert(error.response?.data?.message || 'Failed to update profile.');
            this.setState({ isSaving: false });
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

        // Create a preview URL
        const previewUrl = URL.createObjectURL(file);
        this.setState({
            idToUpload: file,
            idToUploadPreview: previewUrl,
            idToUploadType: file.type.startsWith('image/') ? 'image' : 'pdf'
        });
    };

    confirmIdUpload = async () => {
        const { idToUpload } = this.state;
        if (!idToUpload) return;

        const formData = new FormData();
        formData.append('idCard', idToUpload);

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
            this.setState({
                isUploadingId: false,
                idToUpload: null,
                idToUploadPreview: null,
                idToUploadType: null
            });
            // Reset input value to allow re-uploading the same file if needed
            if (this.fileInputRef.current) {
                this.fileInputRef.current.value = '';
            }
        }
    };

    cancelIdUpload = () => {
        if (this.state.idToUploadPreview) {
            URL.revokeObjectURL(this.state.idToUploadPreview);
        }
        this.setState({
            idToUpload: null,
            idToUploadPreview: null,
            idToUploadType: null
        });
        if (this.fileInputRef.current) {
            this.fileInputRef.current.value = '';
        }
    };

    toggleAccordion = (panel) => {
        this.setState(prevState => ({
            openAccordion: prevState.openAccordion === panel ? null : panel
        }));
    };

    render() {
        const { classes } = this.props;
        const { user, loading, registeredEvents, isQRExpanded, isUploadingId, viewIdUrl, isIdViewerOpen, idCardPreviewUrl, idCardPreviewType, isIdLoading, idToUpload, idToUploadPreview, idToUploadType, openAccordion, isMobile, isEditing, formData, isSaving, activeTab, accommodationData, accommodationLoading, accommodationRegistered, accommodationForm, accommodationSubmitting, accommodationError, accommodationSuccess } = this.state;

        // Show loading placeholder with minimum height to prevent footer from jumping
        if (loading || !user) {
            return (
                <div className={classes.root} style={{ minHeight: '100vh' }}>
                    {/* Loading placeholder - maintains page height */}
                </div>
            );
        }

        // Category colors inspired by EventsGrid
        const categoryColors = {
            'Technical': '#c72071',
            'Non-Technical': '#00d4ff',
            'Workshops': '#00ff88',
            'Paper-Presentations': '#ffbb00',
            'Other': '#888'
        };

        // Group registered events by category
        const groupedEvents = registeredEvents.reduce((acc, event) => {
            // Normalize category names for grouping
            const category = (event.category || 'general').toLowerCase();
            let groupName = 'Other';

            if (event.itemType === 'workshop') {
                groupName = 'Workshops';
            } else if (event.itemType === 'paper') {
                groupName = 'Paper-Presentations';
            } else if (category.includes('non technical') || category.includes('non-technical')) {
                groupName = 'Non-Technical';
            } else if (category.includes('technical')) {
                groupName = 'Technical';
            }


            if (!acc[groupName]) {
                acc[groupName] = [];
            }
            acc[groupName].push(event);
            return acc;
        }, {});

        const groupedEventCategories = Object.keys(groupedEvents).sort((a, b) => {
            const order = ['Technical', 'Non-Technical', 'Workshops', 'Paper Presentations', 'Other'];
            return order.indexOf(a) - order.indexOf(b);
        });

        return (
            <SecuenceComponent>
                <div className={classes.root}>
                    {/* Hidden file input, available on all screen sizes */}
                    <input
                        type="file"
                        ref={this.fileInputRef}
                        style={{ display: 'none' }}
                        accept=".pdf,.jpg,.jpeg,.png,.webp"
                        onChange={this.handleIdCardUpload}
                    />

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
                                <div className={classes.mobileGraphContainer}>
                                    <IdentityNode user={user} isMobile={isMobile} />
                                </div>
                            </div>

                            {/* 2. Interactive Graph (Fourth on Mobile, hidden if mobile) */}
                            {!isMobile && (
                                <div className={classes.scannerContainer}>
                                    <IdentityNode user={user} isMobile={isMobile} />
                                    <div className={classes.scannerOverlay} />
                                </div>
                            )}

                        </div>

                        {/* RIGHT COLUMN: DATA DETAILS */}
                        <div className={classes.rightColumn}>

                            {/* Tab Navigation */}
                            <div className={classes.tabNavigation}>
                                <button
                                    className={`${classes.tab} ${activeTab === 'profile' ? classes.tabActive : ''}`}
                                    onClick={() => this.handleTabChange('profile')}
                                >
                                    Profile
                                </button>
                                <button
                                    className={`${classes.tab} ${activeTab === 'accommodation' ? classes.tabActive : ''}`}
                                    onClick={() => this.handleTabChange('accommodation')}
                                >
                                    Accommodation
                                </button>
                            </div>

                            {/* Profile Tab Content */}
                            {activeTab === 'profile' && (
                                <>

                                    {/* NEW: Mobile Quick Actions */}
                                    {isMobile && (
                                        <MobileActions
                                            user={user}
                                            classes={classes}
                                            onQrClick={this.toggleQRExpansion}
                                            onIdClick={this.handleIdCardClick}
                                            onViewIdClick={this.handleViewIdCard}
                                            isIdLoading={isIdLoading}
                                            viewIdUrl={viewIdUrl}
                                            idToUpload={idToUpload}
                                        />
                                    )}

                                    {/* 3. Personal Profile & QR (Merged) */}
                                    <div className={`${classes.dataPanel} ${classes.panelOrder2}`}>
                                        <div
                                            className={isMobile ? `${classes.accordionHeader} ${openAccordion === 'profile' ? classes.accordionHeaderOpen : ''}` : ''}
                                            onClick={() => isMobile && this.toggleAccordion('profile')}
                                        >
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                                                <h3 className={classes.panelHeader} style={{ marginBottom: isMobile ? 0 : 10 }}>Profile Details</h3>
                                                {!isMobile && !isEditing && (
                                                    <div style={{ display: 'flex', gap: '8px', marginLeft: 'auto' }}>
                                                        <button
                                                            className={classes.actionBtn}
                                                            onClick={() => window.location.href = '/fee-payment'}
                                                            style={{ padding: '4px 12px', fontSize: '0.7rem', background: 'rgba(199, 32, 113, 0.2)', borderColor: '#c72071' }}
                                                        >
                                                            Payment
                                                        </button>
                                                        <button
                                                            className={classes.actionBtn}
                                                            onClick={this.handleEdit}
                                                            style={{ padding: '4px 12px', fontSize: '0.7rem' }}
                                                        >
                                                            Edit Profile
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className={isMobile ? `${classes.accordionContent} ${openAccordion === 'profile' ? classes.accordionContentOpen : ''}` : ''}>
                                            {isMobile && !isEditing && (
                                                <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: 15, gap: '10px' }}>
                                                    <button
                                                        className={classes.actionBtn}
                                                        onClick={() => window.location.href = '/fee-payment'}
                                                        style={{ padding: '6px 14px', fontSize: '0.75rem', background: 'rgba(199, 32, 113, 0.2)', borderColor: '#c72071' }}
                                                    >
                                                        Payment
                                                    </button>
                                                    <button
                                                        className={classes.actionBtn}
                                                        onClick={this.handleEdit}
                                                        style={{ padding: '6px 14px', fontSize: '0.75rem' }}
                                                    >
                                                        Edit Profile
                                                    </button>
                                                </div>
                                            )}
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap-reverse', gap: 20, paddingTop: isMobile ? 0 : 15 }}>

                                                {/* Info Side */}
                                                <div style={{ flex: 1, minWidth: '200px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                                                    <div className={classes.dataGrid}>
                                                        <div className={classes.dataField}>
                                                            <label className={classes.fieldLabel}>Full Name</label>
                                                            {isEditing ? (
                                                                <input type="text" name="name" value={formData.name} onChange={this.handleFormChange} className={classes.editInput} />
                                                            ) : (
                                                                <div className={classes.fieldValue}>{user.name}</div>
                                                            )}
                                                        </div>
                                                        <div className={classes.dataField}>
                                                            <label className={classes.fieldLabel}>Phone</label>
                                                            {isEditing ? (
                                                                <input type="tel" name="phone" value={formData.phone} onChange={this.handleFormChange} className={classes.editInput} pattern="[0-9]{10}" />
                                                            ) : (
                                                                <div className={classes.fieldValue}>{user.phone}</div>
                                                            )}
                                                        </div>
                                                        <div className={classes.dataField}>
                                                            <label className={classes.fieldLabel}>Department</label>
                                                            {isEditing ? (
                                                                <input type="text" name="department" value={formData.department} onChange={this.handleFormChange} className={classes.editInput} />
                                                            ) : (
                                                                <div className={classes.fieldValue}>{user.department}</div>
                                                            )}
                                                        </div>
                                                        <div className={classes.dataField}>
                                                            <label className={classes.fieldLabel}>Year</label>
                                                            {isEditing ? (
                                                                <select name="year" value={formData.year} onChange={this.handleFormChange} className={`${classes.editInput} ${classes.editSelect}`}>
                                                                    <option value="">Select year</option>
                                                                    <option value="1">1st Year</option>
                                                                    <option value="2">2nd Year</option>
                                                                    <option value="3">3rd Year</option>
                                                                    <option value="4">4th Year</option>
                                                                    <option value="5">5th Year</option>
                                                                </select>
                                                            ) : (
                                                                <div className={classes.fieldValue}>{user.year}</div>
                                                            )}
                                                        </div>
                                                        <div className={classes.dataField} style={{ gridColumn: '1 / -1' }}>
                                                            <label className={classes.fieldLabel}>College / Institution</label>
                                                            {isEditing ? (
                                                                <select name="college" value={formData.college} onChange={this.handleFormChange} className={`${classes.editInput} ${classes.editSelect}`}>
                                                                    <option value="">Select your college</option>
                                                                    {colleges.map((college, index) => (
                                                                        <option key={index} value={college}>{college}</option>
                                                                    ))}
                                                                </select>
                                                            ) : (
                                                                <div className={classes.fieldValue} style={{ whiteSpace: 'normal', lineHeight: 1.4 }}>{user.college}</div>
                                                            )}
                                                        </div>
                                                    </div>
                                                    {isEditing && (
                                                        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 15 }}>
                                                            <button className={`${classes.actionBtn} ${classes.btnBack}`} onClick={this.handleCancelEdit} disabled={isSaving}>
                                                                Cancel
                                                            </button>
                                                            <button className={classes.actionBtn} onClick={this.handleSave} disabled={isSaving} style={{ background: '#00ff64', color: '#000', border: 'none', fontWeight: 800 }}>
                                                                {isSaving ? 'Saving...' : 'Save Changes'}
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* QR Side (Desktop only now) */}
                                                {!isMobile && (
                                                    <div className={classes.qrContainer} onClick={this.toggleQRExpansion} style={{ marginTop: -15 }}>
                                                        <div className={classes.qrBox}>
                                                            <QRCodeSVG
                                                                value={JSON.stringify({ type: "PARTICIPANT", uniqueId: user.uniqueId })}
                                                                size={110}
                                                            />
                                                        </div>
                                                        <div className={classes.qrExpandHint}>
                                                            Tap to expand
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* 4. Account & Payment Status (Moved Down) */}
                                    <div className={`${classes.dataPanel} ${classes.panelOrder3}`}>
                                        <div
                                            className={isMobile ? `${classes.accordionHeader} ${openAccordion === 'account' ? classes.accordionHeaderOpen : ''}` : ''}
                                            onClick={() => isMobile && this.toggleAccordion('account')}
                                        >
                                            <h3 className={classes.panelHeader} style={{ marginBottom: isMobile ? 0 : 15 }}>Account Status</h3>
                                        </div>
                                        <div className={isMobile ? `${classes.accordionContent} ${openAccordion === 'account' ? classes.accordionContentOpen : ''}` : ''}>
                                            <div className={classes.dataGrid} style={{ paddingTop: isMobile ? 0 : 15 }}>
                                                <div className={classes.dataField} style={{ gridColumn: '1 / -1' }}>
                                                    <label className={classes.fieldLabel}>Email</label>
                                                    <div className={classes.fieldValue}>{user.email}</div>
                                                </div>
                                                {!user.isPSGStudent && (
                                                    <div className={classes.dataField}>
                                                        <label className={classes.fieldLabel}>General Fee</label>
                                                        {user.generalFeePaid ? (
                                                            <span className={classes.statusPaid}><span>●</span> Paid</span>
                                                        ) : (
                                                            <span className={classes.statusPending}>Pending</span>
                                                        )}
                                                    </div>
                                                )}
                                                <div className={classes.dataField}>
                                                    <label className={classes.fieldLabel}>Workshop Fee</label>
                                                    {user.workshopFeePaid ? (
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
                                                    <label className={classes.fieldLabel}>Reg. Source</label>
                                                    <div className={classes.fieldValue} style={{ textTransform: 'capitalize' }}>{user.source}</div>
                                                </div>
                                            </div>

                                            {/* ID Card Upload Section (Desktop only now) */}
                                            {!isMobile && (
                                                <div style={{ marginTop: 20, paddingTop: 15, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
                                                        <div>
                                                            <h3 className={classes.panelHeader} style={{ marginBottom: isMobile ? 0 : 10 }}>Identity Verification</h3>
                                                            <div style={{ fontSize: '0.7rem', color: '#888' }}>Upload College ID (Max 10MB)</div>
                                                            {user.idCardUrl && !idToUpload && (
                                                                <div style={{ color: '#00ff64', fontSize: '0.7rem', marginTop: 2 }}>✓ ID Card Uploaded</div>
                                                            )}
                                                        </div>
                                                        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                                                            {viewIdUrl && !idToUpload && (
                                                                <button
                                                                    className={classes.actionBtn}
                                                                    onClick={this.handleViewIdCard}
                                                                    disabled={isIdLoading}
                                                                >
                                                                    {isIdLoading ? 'Loading...' : 'View ID'}
                                                                </button>
                                                            )}
                                                            {!idToUpload && (
                                                                <button
                                                                    className={classes.actionBtn}
                                                                    onClick={this.handleIdCardClick}
                                                                    disabled={isUploadingId}
                                                                >
                                                                    {isUploadingId ? '...' : (user.idCardUrl ? 'Re-upload' : 'Upload')}
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* 5. Registered Events Section */}
                                    <div className={`${classes.dataPanel} ${classes.panelOrder6}`}>
                                        <div
                                            className={isMobile ? `${classes.accordionHeader} ${openAccordion === 'events' ? classes.accordionHeaderOpen : ''}` : ''}
                                            onClick={() => isMobile && this.toggleAccordion('events')}
                                        >
                                            <h3 className={classes.panelHeader} style={{ marginBottom: isMobile ? 0 : 15 }}>Registered Events</h3>
                                        </div>
                                        <div className={isMobile ? `${classes.accordionContent} ${openAccordion === 'events' ? classes.accordionContentOpen : ''}` : ''}>
                                            {registeredEvents && registeredEvents.length > 0 ? (
                                                <div className={classes.dataGrid} style={{ paddingTop: isMobile ? 0 : 15, gridTemplateColumns: `repeat(auto-fit, minmax(200px, 1fr))` }}>
                                                    {groupedEventCategories.map(category => {
                                                        const categoryColor = categoryColors[category] || categoryColors['Other'];
                                                        return (
                                                            <div
                                                                key={category}
                                                                className={classes.dataField}
                                                                style={{
                                                                    display: 'flex',
                                                                    flexDirection: 'column',
                                                                    gap: 8,
                                                                    borderColor: categoryColor, // Apply category color to border
                                                                    borderWidth: 1, // Ensure border is visible
                                                                }}
                                                            >
                                                                <label className={classes.fieldLabel} style={{ borderBottom: `1px solid ${categoryColor}40`, paddingBottom: 6, marginBottom: 4, color: categoryColor }}>{category}</label>
                                                                <ul className={classes.eventList}>
                                                                    {groupedEvents[category].map(event => (
                                                                        <li key={event._id || event.eventId}>
                                                                            {event.eventName || event.workshopName || 'Unnamed Event'}
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            ) : (
                                                <div style={{ padding: '10px', color: '#888', fontStyle: 'italic', fontSize: '0.85rem', paddingTop: isMobile ? 0 : 15 }}>
                                                    No registered events yet.
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className={classes.actionButtons}>
                                        {/* Buttons are now inside the profile details panel when editing */}
                                    </div>
                                </>
                            )}

                            {/* Accommodation Tab Content */}
                            {activeTab === 'accommodation' && (
                                <>
                                    {/* Instructions Panel */}
                                    <div className={classes.accommodationPanel}>
                                        <h3 className={classes.panelHeader}>Accommodation Guidelines</h3>
                                        <ul className={classes.instructionsList}>
                                            {ACCOMMODATION_INSTRUCTIONS.map((instruction, index) => (
                                                <li key={index}>{instruction}</li>
                                            ))}
                                        </ul>
                                    </div>

                                    {/* Registration Panel */}
                                    <div className={classes.accommodationPanel}>
                                        <h3 className={classes.panelHeader}>
                                            {accommodationRegistered ? 'Registration Details' : 'Register for Accommodation'}
                                        </h3>

                                        {accommodationLoading ? (
                                            <div style={{ padding: '20px', textAlign: 'center', color: '#888' }}>
                                                Loading accommodation status...
                                            </div>
                                        ) : accommodationRegistered ? (
                                            /* Registered View */
                                            <div>
                                                <div className={classes.registeredBadge}>
                                                    <span>✓</span> Registered for Accommodation
                                                </div>

                                                <div className={classes.detailsGrid}>
                                                    <div className={classes.detailItem}>
                                                        <span className={classes.detailLabel}>Name</span>
                                                        <span className={classes.detailValue}>{accommodationData?.name || user.name}</span>
                                                    </div>
                                                    <div className={classes.detailItem}>
                                                        <span className={classes.detailLabel}>Email</span>
                                                        <span className={classes.detailValue}>{accommodationData?.email || user.email}</span>
                                                    </div>
                                                    <div className={classes.detailItem}>
                                                        <span className={classes.detailLabel}>College</span>
                                                        <span className={classes.detailValue}>{accommodationData?.college || user.college}</span>
                                                    </div>
                                                    <div className={classes.detailItem}>
                                                        <span className={classes.detailLabel}>Phone</span>
                                                        <span className={classes.detailValue}>{accommodationData?.phone || user.phone}</span>
                                                    </div>
                                                    <div className={classes.detailItem}>
                                                        <span className={classes.detailLabel}>Residential Address</span>
                                                        <span className={classes.detailValue}>{accommodationData?.residentialAddress}</span>
                                                    </div>
                                                    <div className={classes.detailItem}>
                                                        <span className={classes.detailLabel}>City</span>
                                                        <span className={classes.detailValue}>{accommodationData?.city}</span>
                                                    </div>
                                                    <div className={classes.detailItem}>
                                                        <span className={classes.detailLabel}>Gender</span>
                                                        <span className={classes.detailValue} style={{ textTransform: 'capitalize' }}>{accommodationData?.gender}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            /* Registration Form */
                                            <div className={classes.accommodationForm}>
                                                {accommodationError && (
                                                    <div style={{ padding: '10px', background: 'rgba(255,0,0,0.1)', border: '1px solid #ff4444', borderRadius: 8, color: '#ff6666', fontSize: '0.85rem' }}>
                                                        {accommodationError}
                                                    </div>
                                                )}

                                                <div className={classes.formField}>
                                                    <label className={classes.formLabel}>Residential Address *</label>
                                                    <textarea
                                                        name="residentialAddress"
                                                        value={accommodationForm.residentialAddress}
                                                        onChange={this.handleAccommodationFormChange}
                                                        className={classes.editInput}
                                                        placeholder="Enter your full residential address"
                                                        rows={3}
                                                        style={{ resize: 'vertical', minHeight: '60px' }}
                                                    />
                                                </div>

                                                <div className={classes.formRow}>
                                                    <div className={classes.formField}>
                                                        <label className={classes.formLabel}>City *</label>
                                                        <input
                                                            type="text"
                                                            name="city"
                                                            value={accommodationForm.city}
                                                            onChange={this.handleAccommodationFormChange}
                                                            className={classes.editInput}
                                                            placeholder="Enter your city"
                                                        />
                                                    </div>
                                                    <div className={classes.formField}>
                                                        <label className={classes.formLabel}>Gender *</label>
                                                        <select
                                                            name="gender"
                                                            value={accommodationForm.gender}
                                                            onChange={this.handleAccommodationFormChange}
                                                            className={`${classes.editInput} ${classes.editSelect}`}
                                                        >
                                                            <option value="">Select gender</option>
                                                            <option value="male">Male</option>
                                                            <option value="female">Female</option>
                                                            <option value="other">Other</option>
                                                        </select>
                                                    </div>
                                                </div>

                                                <div style={{ marginTop: 10 }}>
                                                    <button
                                                        className={classes.actionBtn}
                                                        onClick={this.registerAccommodation}
                                                        disabled={accommodationSubmitting}
                                                        style={{
                                                            background: accommodationSubmitting ? '#666' : '#00ff64',
                                                            color: '#000',
                                                            border: 'none',
                                                            fontWeight: 800,
                                                            padding: '12px 24px',
                                                            fontSize: '0.85rem'
                                                        }}
                                                    >
                                                        {accommodationSubmitting ? 'Registering...' : 'Register for Accommodation'}
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </>
                            )}

                            {/* Mobile-only Logout Button */}
                            <div className={classes.mobileLogoutContainer}>
                                <button
                                    className={classes.mobileLogoutBtn}
                                    onClick={this.handleLogout}
                                >
                                    Logout
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* QR EXPANSION OVERLAY */}
                    {isQRExpanded && (
                        <div className={classes.qrOverlay} onClick={this.toggleQRExpansion}>
                            <div className={classes.qrExpandedContent} onClick={(e) => e.stopPropagation()}>
                                <QRCodeSVG
                                    value={JSON.stringify({ type: "PARTICIPANT", uniqueId: user.uniqueId })}
                                    size={300}
                                />
                                <div className={classes.qrCloseHint} style={{ color: 'black', fontSize: '16px' }}>
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

                    {/* UPLOAD CONFIRMATION OVERLAY (Both Mobile & Desktop) */}
                    {idToUpload && (
                        <div className={classes.idViewerOverlay} onClick={this.cancelIdUpload}>
                            <div className={classes.idViewerContent} onClick={(e) => e.stopPropagation()}>
                                <div className={classes.idViewerHeader}>
                                    <span>Confirm Upload</span>
                                    <button className={classes.idViewerCloseBtn} onClick={this.cancelIdUpload}>
                                        &times;
                                    </button>
                                </div>
                                <div className={classes.idViewerMedia}>
                                    {idToUploadType === 'image' && (
                                        <img src={idToUploadPreview} alt="Upload Preview" />
                                    )}
                                    {idToUploadType === 'pdf' && (
                                        <embed src={idToUploadPreview} type="application/pdf" width="100%" height="100%" />
                                    )}
                                </div>
                                <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 15, flexShrink: 0 }}>
                                    <button
                                        className={classes.actionBtn}
                                        onClick={this.cancelIdUpload}
                                        disabled={isUploadingId}
                                        style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.3)' }}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        className={classes.actionBtn}
                                        onClick={this.confirmIdUpload}
                                        disabled={isUploadingId}
                                        style={{ background: '#00ff64', color: '#000', border: 'none', fontWeight: 800 }}
                                    >
                                        {isUploadingId ? 'Uploading...' : 'Confirm'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ACCOMMODATION SUCCESS POPUP */}
                    {accommodationSuccess && (
                        <div className={classes.successOverlay} onClick={() => this.setState({ accommodationSuccess: false })}>
                            <div className={classes.successPopup} onClick={(e) => e.stopPropagation()}>
                                <div className={classes.successIcon}>✓</div>
                                <div className={classes.successTitle}>Registration Successful!</div>
                                <div className={classes.successMessage}>
                                    You have successfully registered for accommodation. Please carry your college ID card during check-in.
                                </div>
                                <button
                                    className={classes.successBtn}
                                    onClick={() => this.setState({ accommodationSuccess: false })}
                                >
                                    Got it!
                                </button>
                            </div>
                        </div>
                    )}

                    {/* REMINDERS (Fee & ID Card) */}
                    {!loading && user && this.state.showFeeReminder && activeTab === 'profile' && (
                        <>
                            {/* 1. General Fee Reminder (Priority for non-PSG students) */}
                            {!user.isPSGStudent && !user.generalFeePaid && (
                                <div className={classes.idViewerOverlay} onClick={() => this.setState({ showFeeReminder: false })}>
                                    <div className={classes.successPopup} onClick={(e) => e.stopPropagation()} style={{ borderColor: '#fae127', boxShadow: '0 0 30px rgba(250, 225, 39, 0.2)' }}>
                                        <div className={classes.successIcon} style={{ background: 'rgba(250, 225, 39, 0.2)', color: '#fae127', border: '2px solid #fae127' }}>!</div>
                                        <div className={classes.successTitle} style={{ color: '#fff' }}>General Fee Pending</div>
                                        <div className={classes.successMessage} style={{ marginBottom: '20px' }}>
                                            Please complete the general fee payment to register for events and paper presentations.
                                        </div>
                                        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                                            <button
                                                className={classes.successBtn}
                                                onClick={() => window.location.href = '/fee-payment'}
                                                style={{ background: 'linear-gradient(135deg, #fae127, #f0ca00)', color: '#000', fontWeight: 'bold' }}
                                            >
                                                Pay Now
                                            </button>
                                            <button
                                                className={classes.successBtn}
                                                onClick={() => this.setState({ showFeeReminder: false })}
                                                style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.3)', color: '#fff' }}
                                            >
                                                Later
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* 2. ID Card Upload Reminder (If fee cleared/exempt but no ID uploaded) */}
                            {((user.isPSGStudent || user.generalFeePaid) && !user.idCardUrl) && (
                                <div className={classes.idViewerOverlay} onClick={() => this.setState({ showFeeReminder: false })}>
                                    <div className={classes.successPopup} onClick={(e) => e.stopPropagation()} style={{ borderColor: '#00d4ff', boxShadow: '0 0 30px rgba(0, 212, 255, 0.2)' }}>
                                        <div className={classes.successIcon} style={{ background: 'rgba(0, 212, 255, 0.2)', color: '#00d4ff', border: '2px solid #00d4ff', fontSize: '1.2rem', fontWeight: 'bold' }}>ID</div>
                                        <div className={classes.successTitle} style={{ color: '#fff' }}>Upload ID Card</div>
                                        <div className={classes.successMessage} style={{ marginBottom: '20px' }}>
                                            Please upload your college ID card to complete your profile verification.
                                        </div>
                                        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                                            <button
                                                className={classes.successBtn}
                                                onClick={() => {
                                                    this.setState({ showFeeReminder: false });
                                                    this.handleIdCardClick();
                                                }}
                                                style={{ background: 'linear-gradient(135deg, #00d4ff, #0088ff)', color: '#fff', fontWeight: 'bold' }}
                                            >
                                                Upload Now
                                            </button>
                                            <button
                                                className={classes.successBtn}
                                                onClick={() => this.setState({ showFeeReminder: false })}
                                                style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.3)', color: '#fff' }}
                                            >
                                                Later
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </SecuenceComponent>
        );
    }
}

ProfilePage.propTypes = {
    classes: PropTypes.any.isRequired
};

// Styled class component
const StyledProfilePage = withStyles(styles)(ProfilePage);

// Wrapper functional component to provide URL query params to the class component
function ProfilePageWrapper(props) {
    const searchParams = useSearchParams();
    const initialTab = searchParams.get('tab') || 'profile';

    return <StyledProfilePage {...props} initialTab={initialTab} />;
}

export default ProfilePageWrapper;