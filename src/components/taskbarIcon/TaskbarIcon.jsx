import React, { useEffect, useRef } from 'react'
import '../taskbarIcon/taskbarIcon.css'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import {motion} from 'motion/react'

const TaskbarIcon = ({iconImage, isFocused, onClick, isMinimized}) => {
    const imgRef = useRef()
    
    const taskRef = useRef()

    // useEffect(()=>{
    //     gsap.to(taskRef.current.querySelector('.task-layer').children, {
    //         opacity:0,
    //         stagger:0.2,
    //         duration:0.1,
    //     })
    // }, [])

    
    useGSAP(()=>{
            if (isMinimized) {
        var tl = gsap.timeline()
        tl.to(taskRef.current.querySelectorAll('.task-slide-box'), {
            stagger:0.05,
            // opacity:1,
            x:"0",
            duration:0.2,
            // reversed: !isMinimized ? true : undefined
        })
        tl.to(taskRef.current.querySelectorAll('.task-slide-box'), {
            stagger:0.05,
            // opacity:0,
            x:"110%",
            duration:0.2,
            // reversed: !isMinimized ? true : undefined
        })
        
    }
    }, [isMinimized])

  return (
    <>
    <motion.div
    initial={{
        y:20,
        opacity:0
    }}
    animate={{
        y:0,
        opacity:1
    }}
    transition={{
        ease:'anticipate',
        duration:0.5
    }}

    exit={{
        y:20,
        opacity:0
    }}
     ref={taskRef}  onClick={onClick} className="taskBarIcon cursor-target">
        <div className="task-layer">
            <div className="task-layer-box">
                <div className="task-slide-box"></div>
            </div>
            <div className="task-layer-box">
                <div className="task-slide-box"></div>
            </div>
            <div className="task-layer-box">
                <div className="task-slide-box"></div>
            </div>
            <div className="task-layer-box">
                <div className="task-slide-box"></div>
            </div>
            <div className="task-layer-box">
                <div className="task-slide-box"></div>
            </div>
            <div className="task-layer-box">
                <div className="task-slide-box"></div>
            </div>
        </div>
        <img ref={imgRef} src={iconImage} alt="" />
        <div style={{width: isFocused?"35%":"10%"}} className="iconlineIsFocused"></div>
    </motion.div>
    </>
  )
}

export default TaskbarIcon
