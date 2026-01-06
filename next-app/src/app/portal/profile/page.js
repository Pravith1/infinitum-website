'use client';
import React from 'react';
import PropTypes from 'prop-types';
import { QRCodeSVG } from 'qrcode.react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

import { withStyles } from '@/tools/withStyles';
import { Secuence as SecuenceComponent } from '@/components/Secuence';

// --- Interactive 3D Face Grid (Three.js Version) ---
class InteractiveFace extends React.Component {
    constructor(props) {
        super(props);
        this.mountRef = React.createRef();
        this.isDragging = false;
        this.isRotating = false;
        this.dragIndex = -1;
        this.previousMouse = { x: 0, y: 0 };
        this.mouse = new THREE.Vector2();
        this.raycaster = new THREE.Raycaster();
        this.plane = new THREE.Plane();
        this.intersectPoint = new THREE.Vector3();
        this.samplingRate = 10; // RESTORED: Lower value = more points (smoother surface)
        this.isCompMounted = false;
        this.loadId = 0; // TRACKER: Prevents ghost models from old loads
    }

    componentDidMount() {
        this.isCompMounted = true;
        this.initThree();
        window.addEventListener('resize', this.handleResize);
        
        // Input Listeners
        const element = this.mountRef.current;
        if(element) {
            element.addEventListener('mousedown', this.onMouseDown);
            element.addEventListener('mousemove', this.onMouseMove);
            window.addEventListener('mouseup', this.onMouseUp);
            element.addEventListener('touchstart', this.onTouchStart, { passive: false });
            element.addEventListener('touchmove', this.onTouchMove, { passive: false });
            window.addEventListener('touchend', this.onTouchEnd);
        }
    }

    componentWillUnmount() {
        this.isCompMounted = false;
        cancelAnimationFrame(this.frameId);
        window.removeEventListener('resize', this.handleResize);
        
        const element = this.mountRef.current;
        if (element) {
            element.removeEventListener('mousedown', this.onMouseDown);
            element.removeEventListener('mousemove', this.onMouseMove);
            element.removeEventListener('touchstart', this.onTouchStart);
            element.removeEventListener('touchmove', this.onTouchMove);
        }
        window.removeEventListener('mouseup', this.onMouseUp);
        window.removeEventListener('touchend', this.onTouchEnd);

        // Cleanup Three.js
        if (this.renderer) {
            this.renderer.dispose();
            if(element && this.renderer.domElement.parentNode === element) {
                element.removeChild(this.renderer.domElement);
            }
        }
    }

    initThree = () => {
        if (!this.mountRef.current) return;
        
        // Clears previous canvas to ensure clean slate
        while(this.mountRef.current.firstChild) {
            this.mountRef.current.removeChild(this.mountRef.current.firstChild);
        }

        const width = this.mountRef.current.clientWidth;
        const height = this.mountRef.current.clientHeight;

        // Capture the current load ID
        const myLoadId = ++this.loadId;

        // 1. Scene & Camera
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
        this.camera.position.z = 8;

        // 2. Renderer
        this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        this.renderer.setSize(width, height);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.mountRef.current.appendChild(this.renderer.domElement);

        // 3. Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(ambientLight);
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(2, 2, 5);
        this.scene.add(directionalLight);

        // 4. Load Model
        const loader = new GLTFLoader();
        loader.load('/models/face.glb', (gltf) => {
            // FIX: Prevent ghost model by checking if this load is still relevant
            if (!this.isCompMounted || this.loadId !== myLoadId) return;

            const model = gltf.scene;
            let targetMesh = null;
            model.traverse((child) => {
                if (child.isMesh && !targetMesh) targetMesh = child;
            });

            if (targetMesh) {
                this.geometry = targetMesh.geometry.clone();
                
                // FIX: Rotate model geometry 90 degrees to make it upright
                this.geometry.rotateX(1.5*Math.PI);

                this.geometry.center(); 
                this.geometry.computeBoundingBox();
                
                const size = new THREE.Vector3();
                this.geometry.boundingBox.getSize(size);
                const maxDim = Math.max(size.x, size.y, size.z);
                
                if (maxDim > 0) {
                    const targetSize = 5; 
                    const scaleFactor = targetSize / maxDim;
                    this.geometry.scale(scaleFactor, scaleFactor, scaleFactor);
                }
                
                // A. Create Geometry
                this.sparseGeometry = new THREE.BufferGeometry();
                const originalPos = this.geometry.attributes.position.array;
                const sparsePos = [];
                const indices = [];
                
                // Extract points with revised sampling rate for smoothness
                for (let i = 0; i < originalPos.length; i += 3 * this.samplingRate) {
                    sparsePos.push(originalPos[i], originalPos[i+1], originalPos[i+2]);
                }
                
                this.sparseGeometry.setAttribute('position', new THREE.Float32BufferAttribute(sparsePos, 3));

                // B. Generate Clean Grid Connections
                const posCount = sparsePos.length / 3;
                // Tuned distance: tighter threshold ensures we only connect immediate neighbors
                const connectionDist = 0.65; 
                
                for(let i = 0; i < posCount; i++) {
                    const x1 = sparsePos[i*3];
                    const y1 = sparsePos[i*3+1];
                    const z1 = sparsePos[i*3+2];
                    
                    for(let j = i + 1; j < posCount; j++) {
                        const x2 = sparsePos[j*3];
                        const y2 = sparsePos[j*3+1];
                        const z2 = sparsePos[j*3+2];
                        
                        // Simple distance check
                        const distSq = (x2-x1)*(x2-x1) + (y2-y1)*(y2-y1) + (z2-z1)*(z2-z1);
                        
                        if(distSq < connectionDist * connectionDist) {
                            indices.push(i, j);
                        }
                    }
                }
                this.sparseGeometry.setIndex(indices);

                // C. Visual Elements
                const wireframeMaterial = new THREE.LineBasicMaterial({
                    color: 0x00ff64,
                    opacity: 0.15,
                    transparent: true
                });
                // Using LineSegments ensures lines move when points move
                this.wireframeMesh = new THREE.LineSegments(this.sparseGeometry, wireframeMaterial);

                const pointsMaterial = new THREE.PointsMaterial({ 
                    color: 0x00ff64, 
                    size: 0.045, // Slightly larger dots
                    sizeAttenuation: true 
                });
                this.points = new THREE.Points(this.sparseGeometry, pointsMaterial);

                this.faceGroup = new THREE.Group();
                this.faceGroup.add(this.wireframeMesh);
                this.faceGroup.add(this.points);

                // Clear scene just in case
                this.scene.clear();
                this.scene.add(ambientLight);
                this.scene.add(directionalLight);
                this.scene.add(this.faceGroup);

                this.raycaster.params.Points.threshold = 0.15;
            }
        }, undefined, (error) => {
            console.error('Error loading /models/face.glb:', error);
        });

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

    // --- Interaction ---
    
    updateMouse(clientX, clientY) {
        if(!this.mountRef.current) return;
        const rect = this.mountRef.current.getBoundingClientRect();
        this.mouse.x = ((clientX - rect.left) / rect.width) * 2 - 1;
        this.mouse.y = -((clientY - rect.top) / rect.height) * 2 + 1;
    }

    handleInputStart = (clientX, clientY) => {
        if (!this.points) return;
        this.updateMouse(clientX, clientY);
        this.raycaster.setFromCamera(this.mouse, this.camera);

        const intersects = this.raycaster.intersectObject(this.points);

        if (intersects.length > 0) {
            this.isDragging = true;
            this.dragIndex = intersects[0].index; // This is the index in the SPARSE geometry
            
            this.plane.setFromNormalAndCoplanarPoint(
                this.camera.getWorldDirection(this.plane.normal),
                intersects[0].point
            );
            
            if(this.mountRef.current) this.mountRef.current.style.cursor = 'grabbing';
            
            // Highlight logic ...
            if(!this.points.geometry.attributes.color) {
                const count = this.points.geometry.attributes.position.count;
                this.points.geometry.setAttribute('color', new THREE.BufferAttribute(new Float32Array(count * 3), 3));
                const colors = this.points.geometry.attributes.color;
                for(let i=0; i<count; i++) colors.setXYZ(i, 0, 1, 0.4); 
            }
            
            const colors = this.points.geometry.attributes.color;
            colors.setXYZ(this.dragIndex, 1, 0, 0.3); // Red highlight
            colors.needsUpdate = true;
            this.points.material.vertexColors = true;
        } else {
            // Start Rotation
            this.isRotating = true;
            this.previousMouse = { x: clientX, y: clientY };
            if(this.mountRef.current) this.mountRef.current.style.cursor = 'grab';
        }
    }

    handleInputMove = (clientX, clientY) => {
        this.updateMouse(clientX, clientY);
        
        if (this.isDragging && this.dragIndex !== -1) {
            this.raycaster.setFromCamera(this.mouse, this.camera);
            if (this.raycaster.ray.intersectPlane(this.plane, this.intersectPoint)) {
                
                const localPoint = this.intersectPoint.clone().applyMatrix4(this.faceGroup.matrixWorld.clone().invert());
                
                // 1. Update the visible dot
                const sparsePos = this.sparseGeometry.attributes.position;
                sparsePos.setXYZ(this.dragIndex, localPoint.x, localPoint.y, localPoint.z);
                sparsePos.needsUpdate = true;

                // 2. Update the actual mesh vertex (Mapping back using sampling rate)
                const realIndex = this.dragIndex * this.samplingRate;
                const meshPos = this.geometry.attributes.position;
                
                // Update the specific vertex
                meshPos.setXYZ(realIndex, localPoint.x, localPoint.y, localPoint.z);

                meshPos.needsUpdate = true;
            }
        } else if (this.isRotating) {
            // Manual Rotation
            const deltaX = clientX - this.previousMouse.x;
            this.faceGroup.rotation.y += deltaX * 0.005;
            this.previousMouse = { x: clientX, y: clientY };

        } else if (this.points && this.mountRef.current) {
            this.raycaster.setFromCamera(this.mouse, this.camera);
            const intersects = this.raycaster.intersectObject(this.points);
            this.mountRef.current.style.cursor = intersects.length > 0 ? 'grab' : 'default';
        }
    }

    handleInputEnd = () => {
        this.isDragging = false;
        this.isRotating = false;
        this.dragIndex = -1;
        if(this.mountRef.current) this.mountRef.current.style.cursor = 'default';
        
        if(this.points && this.points.material.vertexColors) {
            this.points.material.vertexColors = false;
            this.points.material.needsUpdate = true;
        }
    }

    onMouseDown = (e) => this.handleInputStart(e.clientX, e.clientY);
    onMouseMove = (e) => this.handleInputMove(e.clientX, e.clientY);
    onMouseUp = () => this.handleInputEnd();
    
    onTouchStart = (e) => {
         // passive: false on listener allows preventDefault
         if(e.cancelable && e.preventDefault) e.preventDefault();
         const touch = e.touches[0];
         this.handleInputStart(touch.clientX, touch.clientY);
    }
    onTouchMove = (e) => {
        if(e.cancelable && e.preventDefault) e.preventDefault();
        const touch = e.touches[0];
        this.handleInputMove(touch.clientX, touch.clientY);
    }
    onTouchEnd = () => this.handleInputEnd();

    animate = () => {
        this.frameId = requestAnimationFrame(this.animate);
        
        // Removed auto-rotation

        if (this.renderer && this.scene && this.camera) {
            this.renderer.render(this.scene, this.camera);
        }
    }

    render() {
        return (
            <div 
                ref={this.mountRef} 
                style={{ width: '100%', height: '100%', outline: 'none' }} 
            />
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
                flex: 'none',
                width: '100%',
                overflowY: 'visible',
                height: 'auto'
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
            boxShadow: `0 0 30px ${theme.color.primary.dark}40`
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
            gap: 15
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
            '&::-webkit-scrollbar-thumb': { backgroundColor: theme.color.secondary.dark, borderRadius: 2 }
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
            padding: 5,
            borderRadius: 6,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        },
        actionsRow: {
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 12,
            marginTop: 'auto'
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
            loading: true
            // registeredEvents removed
        };
    }

    componentDidMount() {
        this.checkAuth();
    }

    checkAuth = async () => {
        try {
            const { authService } = await import('@/services/authService');
            const response = await authService.getProfile();
            this.setState({ user: response.user, loading: false });
            // Removed fetchRegisteredEvents call
        } catch (error) {
            window.location.href = '/auth?type=login';
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

    render() {
        const { classes } = this.props;
        const { user, loading } = this.state;

        if (loading || !user) return null;

        return (
            <SecuenceComponent>
                <div className={classes.root}>
                    <div className={classes.dashboardContainer}>
                        
                        {/* LEFT COLUMN: VISUALS + IDENTITY */}
                        <div className={classes.leftColumn}>
                            {/* Interactive Face */}
                            <div className={classes.scannerContainer}>
                                <InteractiveFace />
                                <div className={classes.scannerOverlay} />
                            </div>

                            {/* Main Identity Card */}
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
                        </div>

                        {/* RIGHT COLUMN: DATA DETAILS */}
                        <div className={classes.rightColumn}>
                             {/* Personal Info */}
                            <div className={classes.dataPanel}>
                                <h3 className={classes.panelHeader}>Personal Information</h3>
                                <div className={classes.dataGrid}>
                                    <div className={classes.dataField}>
                                        <label className={classes.fieldLabel}>Email</label>
                                        <div className={classes.fieldValue}>{user.email}</div>
                                    </div>
                                    <div className={classes.dataField}>
                                        <label className={classes.fieldLabel}>Phone</label>
                                        <div className={classes.fieldValue}>{user.phone}</div>
                                    </div>
                                    <div className={classes.dataField}>
                                        <label className={classes.fieldLabel}>Gender</label>
                                        <div className={classes.fieldValue}>{user.gender || 'Not Specified'}</div>
                                    </div>
                                </div>
                            </div>

                            {/* Academic Info */}
                            <div className={classes.dataPanel}>
                                <h3 className={classes.panelHeader}>Academic Information</h3>
                                <div className={classes.dataGrid}>
                                    <div className={classes.dataField}>
                                        <label className={classes.fieldLabel}>College</label>
                                        <div className={classes.fieldValue}>{user.college}</div>
                                    </div>
                                    <div className={classes.dataField}>
                                        <label className={classes.fieldLabel}>Department</label>
                                        <div className={classes.fieldValue}>{user.department}</div>
                                    </div>
                                    <div className={classes.dataField}>
                                        <label className={classes.fieldLabel}>Student Type</label>
                                        <div className={classes.fieldValue}>{user.isPSGStudent ? 'PSG Student' : 'External'}</div>
                                    </div>
                                    <div className={classes.dataField}>
                                        <label className={classes.fieldLabel}>Accomodation</label>
                                        <div className={classes.fieldValue}>{user.accomodation ? 'Yes' : 'No'}</div>
                                    </div>
                                </div>
                            </div>

                             {/* Payment Status + QR */}
                             <div className={classes.dataPanel}>
                                <h3 className={classes.panelHeader}>Status & Access</h3>
                                <div className={classes.qrFlex}>
                                    <div style={{ flex: 1 }}>
                                        <div className={classes.paymentRow}>
                                            <span style={{ color: '#aaa', fontSize: '0.8rem' }}>General Fee</span>
                                            {user.generalFeePaid ? (
                                                 <span className={classes.statusPaid}><span>●</span> Paid</span>
                                            ) : (
                                                <span className={classes.statusPending}>Pending</span>
                                            )}
                                        </div>
                                        <div className={classes.dataField} style={{ marginTop: 10 }}>
                                            <label className={classes.fieldLabel}>Registration Source</label>
                                            <div className={classes.fieldValue} style={{textTransform:'capitalize'}}>{user.source}</div>
                                        </div>
                                    </div>
                                    {/* QR Code on Right */}
                                    <div className={classes.qrBox}>
                                        <QRCodeSVG
                                            value={JSON.stringify({ type: "PARTICIPANT", id: user.uniqueId })}
                                            size={80}
                                        />
                                    </div>
                                </div>
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
                </div>
            </SecuenceComponent>
        );
    }
}

ProfilePage.propTypes = {
    classes: PropTypes.any.isRequired
};

export default withStyles(styles)(ProfilePage);
