import React, { useState } from 'react'
import '../windowingSystem/appWindow.css'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { useRef, useEffect } from 'react'
import { Rnd } from 'react-rnd'
import appRegistry from '../store/appRegistry'
import useWindowStore from '../store/windowStore'
import { useKernel } from '../context/kernelContext'
import TargetCursor from '../components/cursor/TargetCursor'
import {motion} from 'motion/react'
import useFileEditorStore from '../store/fileEditorStore'

const AppWindow = ({ windowData, children, appImg }) => {
    const { createApp, terminateApp, memoryManager, processManager, scheduler, storageSystem, fileSystem } = useKernel()
    const {removeEditor, editors} = useFileEditorStore()

    const { id, name, cpuUsage, memoryUsage, state, size, position, zIndex, isMinimized, isMaximized, isFocused } = windowData

    const windows = useWindowStore((state) => state.windows)
    const minimizeWindow = useWindowStore((state) => state.minimizeWindow)
    const addWindow = useWindowStore((state) => state.addWindow);
    const bringTofront = useWindowStore((state) => state.bringToFront);
    const closeWindow = useWindowStore((state) => state.closeWindow);
    const toggleMinimize = useWindowStore((state) => state.toggleMinimize);
    const maximizeWindow = useWindowStore((state) => state.maximizeWindow);
    const moveWindow = useWindowStore((state) => state.moveWindow);
    const resizeWindow = useWindowStore((state) => state.resizeWindow);
    const animationRequests = useWindowStore(state => state.animationRequests);
    const clearAnimationRequest = useWindowStore(state => state.clearAnimationRequest);

    const [localPosition, setlocalPosition] = useState(position)
    const [localSize, setlocalSize] = useState(size)
    const [isAnimating, setIsAnimating] = useState(false)
    const preMaximizedState = useRef({ position: position, size: size })
    const hasEntered = useRef(false)
    const layerRef = useRef()


    useEffect(() => {
    if (!windowRef.current || hasEntered.current ) return;

    hasEntered.current = true
    gsap.fromTo(windowRef.current,
        { opacity: 0, scale: 0.9 },
        {
            opacity: 1,
            scale: 1,
            duration: 0.5,
            ease: 'back.inOut'
        }
    );
}, []);

    // Cleanup animations on unmount
    useEffect(() => {
        return () => {
            if (windowRef.current) {
                gsap.killTweensOf(windowRef.current);
            }
        };
    }, []);

    useEffect(() => {
        if (!isAnimating) {
            setlocalPosition(position)
            setlocalSize(size)
            if (!isMaximized) {
                preMaximizedState.current = { position, size }
            }
        }
    }, [position, size, isAnimating, isMaximized])

    useEffect(() => {
        const request = animationRequests[id];
        if (!request) return;

        if (request === "minimize") {
            minimize(); // your existing minimize() function
        } else if (request === "restore") {
            restoreAnimation(); // write similar to restore GSAP animation
        }

        // Clear request after handling
        clearAnimationRequest(id);
    }, [animationRequests[id]]);

    const restoreAnimation = () => {
        if (isAnimating) return;
        setIsAnimating(true);
        bringTofront(id)

        var tl = gsap.timeline()

        tl.fromTo(windowRef.current,
            { y: window.innerHeight + 100, scale: 0, opacity: 0.7 },
            {
                x: 0,
                y: 0,
                scale: 1,
                opacity: 1,
                duration: 0.6,
                ease: "power2.out",
                onComplete: () => {
                    toggleMinimize(id); // Zustand updates final state
                    setIsAnimating(false);
                }
            }
        )
        tl.to(windowRef.current.querySelectorAll(".slide-box"), {
            // opacity:0,
            x:"-110%",
            stagger:0.04,
            duration:0.5,
            reversed:true
        }, '-=0.2')
    };


    let lastPosition = useRef(position)
    let lastSize = useRef(size)
    const prevIsMinimized = useRef(isMinimized);
    const minimizeRef = useRef()
    const maximizeRef = useRef()
    const crossRef = useRef()
    const windowRef = useRef()

    const close = () => {
        closeWindow(id)
        terminateApp(id)
        if (name==="File Editor") {
            removeEditor(id)
            console.log(editors)
        }
    }

    const handleHover = (ref) => {
        if (ref === crossRef) {
            gsap.to(ref.current, {
                backgroundColor: "red",
                duration: 0.1
            })
        } else {
            gsap.to(ref.current, {
                backgroundColor: "#333",
                duration: 0.1
            })
        }
    }

    const mouseLeave = (ref) => {
        gsap.to(ref.current, {
            backgroundColor: "#212121",
            duration: 0.1
        })
    }

    // FIX: Proper minimize function that triggers animation
    const minimize = () => {
        if (isAnimating) return
        setIsAnimating(true)

        gsap.killTweensOf(windowRef.current);

        var tl = gsap.timeline({
             onComplete: () => {
                toggleMinimize(id)
                setIsAnimating(false)
                
            }
        })

        tl.to(windowRef.current.querySelectorAll(".slide-box"), {
            x:"0",
            stagger:0.04,
            duration:0.5,
            // opacity:1
        })
        tl.to(windowRef.current, {
            y: window.innerHeight + 100,
            // x: window.innerWidth/2,
            scale: 0,
            opacity: 0.7,
            duration: 0.5,
            ease: "power2.inOut",
        }, '-=0.4')
    }

    // FIX: Single useGSAP hook for minimize/restore logic
    const wasMinimized = useRef(false)

    const handleMaximizeToggle = () => {
        if (isAnimating) return
        setIsAnimating(true)

        if (!isMaximized) {
            preMaximizedState.current = {
                position: localPosition,
                size: localSize
            }
            const targetPos = { x: 0, y: 0 }
            const targetSize = { width: window.innerWidth, height: window.innerHeight }
            const startSize = { ...localSize }
            const startPos = { ...localPosition }

            gsap.to({ progress: 0 }, {
                progress: 1,
                duration: 0.5,
                ease: "power2.inOut",
                onUpdate: function () {
                    const progress = this.targets()[0].progress
                    const currentSize = {
                        width: startSize.width + (targetSize.width - startSize.width) * progress,
                        height: startSize.height + (targetSize.height - startSize.height) * progress
                    }
                    const currentPos = {
                        x: startPos.x + (targetPos.x - startPos.x) * progress,
                        y: startPos.y + (targetPos.y - startPos.y) * progress
                    }
                    setlocalSize(currentSize)
                    setlocalPosition(currentPos)
                },
                onComplete: () => {
                    maximizeWindow(id)
                    resizeWindow(id, targetSize)
                    moveWindow(id, targetPos)
                    setIsAnimating(false)
                }
            })

            gsap.to(windowRef.current, { borderRadius: 0, duration: 0.5, ease: "power2.inOut" })

        } else {
            const { position: restorePos, size: restoreSize } = preMaximizedState.current
            const startSize = { ...localSize }
            const startPos = { ...localPosition }

            gsap.to({ progress: 0 }, {
                progress: 1,
                duration: 0.5,
                ease: "power2.inOut",
                onUpdate: function () {
                    const progress = this.targets()[0].progress
                    const currentSize = {
                        width: startSize.width + (restoreSize.width - startSize.width) * progress,
                        height: startSize.height + (restoreSize.height - startSize.height) * progress
                    }
                    const currentPos = {
                        x: startPos.x + (restorePos.x - startPos.x) * progress,
                        y: startPos.y + (restorePos.y - startPos.y) * progress
                    }
                    setlocalSize(currentSize)
                    setlocalPosition(currentPos)
                },
                onComplete: () => {
                    maximizeWindow(id)
                    resizeWindow(id, restoreSize)
                    moveWindow(id, restorePos)
                    setIsAnimating(false)
                }
            })

            gsap.to(windowRef.current, { borderRadius: 10, duration: 0.5, ease: "power2.inOut" })
        }
    }

    // Don't render if minimized and not animating
if (isMinimized && !isAnimating && wasMinimized.current) {
    return null;
}

    return (
        <>
            <Rnd
            style={{
                pointerEvents: isMinimized ? 'none':'all',
                cursor: isMinimized ? 'none': '',
            }}
                onDragStart={() => bringTofront(id)}
                onResize={() => bringTofront(id)}
                onDragStop={(e, d) => {
                    if (!isMaximized && !isAnimating) {
                        const newPos = { x: d.x, y: d.y }
                        setlocalPosition(newPos)
                        moveWindow(id, newPos)
                    }
                }}
                onResizeStop={(e, direction, ref, delta, newPos) => {
                    if (!isMaximized && !isAnimating) {
                        const newSize = {
                            width: parseInt(ref.style.width),
                            height: parseInt(ref.style.height)
                        }
                        setlocalPosition(newPos)
                        setlocalSize(newSize)
                        resizeWindow(id, newSize)
                        moveWindow(id, newPos)
                    }
                }}
                size={localSize}
                position={localPosition}
                minWidth={600}
                minHeight={400}
                bounds="body"
                dragHandleClassName="status_bar"
                disableDragging={isMaximized || isAnimating}
                enableResizing={!isMaximized && !isAnimating && !isMinimized}
            >
                <motion.div
                transition={{
                    ease:'backInOut',
                    duration:0.5
                }}
                exit={{
                    opacity:0,
                    scale:0.9
                }}
                
                
                 style={{ zIndex: zIndex, border: isMaximized?'none':'1px solid rgba(255, 255, 255, 0.219)' }} onClick={() => bringTofront(id)} ref={windowRef} className="app_window">
                    <div className="layer">
                        <div className="layer-box">
                            <div className="slide-box"></div>
                        </div>
                        <div className="layer-box">
                            <div className="slide-box"></div>
                        </div>
                        <div className="layer-box">
                            <div className="slide-box"></div>
                        </div>
                        <div className="layer-box">
                            <div className="slide-box"></div>
                        </div>
                        <div className="layer-box">
                            <div className="slide-box"></div>
                        </div>
                        <div className="layer-box">
                            <div className="slide-box"></div>
                        </div>
                        <div className="layer-box">
                            <div className="slide-box"></div>
                        </div>
                        <div className="layer-box">
                            <div className="slide-box"></div>
                        </div>
                        <div className="layer-box">
                            <div className="slide-box"></div>
                        </div>
                        <div className="layer-box">
                            <div className="slide-box"></div>
                        </div>
                        <div className="layer-box">
                            <div className="slide-box"></div>
                        </div>
                        <div className="layer-box">
                            <div className="slide-box"></div>
                        </div>
                        <div className="layer-box">
                            <div className="slide-box"></div>
                        </div>
                        <div className="layer-box">
                            <div className="slide-box"></div>
                        </div>
                    </div>
                    <div onDoubleClick={() => handleMaximizeToggle()} className="status_bar cursor-target">
                        <div className="app_name"> <img src={appImg} alt="" /> {name}</div>
                        <div className="window_btns">
                            <button
                                ref={minimizeRef}
                                onMouseEnter={() => handleHover(minimizeRef)}
                                onMouseLeave={() => mouseLeave(minimizeRef)}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    minimize(); // FIX: Call the minimize function instead of toggleMinimize
                                }}
                                className='minimize cursor-target'
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M5 11V13H19V11H5Z"></path>
                                </svg>
                            </button>

                            <button
                                ref={maximizeRef}
                                onClick={(e) => { e.stopPropagation(); handleMaximizeToggle() }}
                                onMouseEnter={() => handleHover(maximizeRef)}
                                onMouseLeave={() => mouseLeave(maximizeRef)}
                                className='maximize cursor-target'
                            >
                                {isMaximized ?
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M6.99979 7V3C6.99979 2.44772 7.4475 2 7.99979 2H20.9998C21.5521 2 21.9998 2.44772 21.9998 3V16C21.9998 16.5523 21.5521 17 20.9998 17H17V20.9925C17 21.5489 16.551 22 15.9925 22H3.00728C2.45086 22 2 21.5511 2 20.9925L2.00276 8.00748C2.00288 7.45107 2.4518 7 3.01025 7H6.99979ZM8.99979 7H15.9927C16.549 7 17 7.44892 17 8.00748V15H19.9998V4H8.99979V7ZM4.00255 9L4.00021 20H15V9H4.00255Z"></path>
                                    </svg> :
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M4 3H20C20.5523 3 21 3.44772 21 4V20C21 20.5523 20.5523 21 20 21H4C3.44772 21 3 20.5523 3 20V4C3 3.44772 3.44772 3 4 3ZM5 5V19H19V5H5Z"></path>
                                    </svg>
                                }
                            </button>

                            <button
                                ref={crossRef}
                                onClick={(e) => { e.stopPropagation(); close() }}
                                onMouseEnter={() => { handleHover(crossRef) }}
                                onMouseLeave={() => mouseLeave(crossRef)}
                                className='cross cursor-target'
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M10.5859 12L2.79297 4.20706L4.20718 2.79285L12.0001 10.5857L19.793 2.79285L21.2072 4.20706L13.4143 12L21.2072 19.7928L19.793 21.2071L12.0001 13.4142L4.20718 21.2071L2.79297 19.7928L10.5859 12Z"></path>
                                </svg>
                            </button>
                        </div>
                    </div>

                    <div className="content">
                        {children}
                    </div>
                </motion.div>
            </Rnd>
        </>
    )
}

export default AppWindow