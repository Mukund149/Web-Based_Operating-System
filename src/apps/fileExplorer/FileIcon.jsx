import React, { useRef } from 'react'
import '../../components/appIcon/appIcon.css'
import useFileSystemStore from '../../store/FileSystemStore'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { motion } from 'motion/react'
import useWindowStore from '../../store/windowStore'
import useFileEditorStore from '../../store/fileEditorStore'
import { useKernel } from '../../context/kernelContext'


const FileIcon = ({ iconImage, iconName, type, isSelected, size }) => {
    const addWindow = useWindowStore((state) => state.addWindow);
    const { cwd, setCwd, goBack, select, selected } = useFileSystemStore()
    const iconRef = useRef()
    const { createApp, terminateApp, memoryManager, processManager, scheduler, storageSystem, fileSystem, getProcessStats, getSystemStats } = useKernel()
    const {createEditor, editors, canCreateEditor} = useFileEditorStore()

    const handleOpen = () => {
        if (type === 'directory') {
            setCwd(iconName)
        }
        if (type === 'file') {
            let path = cwd === "/"?`/${iconName}`:`${cwd}/${iconName}`
            const canCreate = canCreateEditor(path)
            if (canCreate) {
                const { success, process, error } = createApp(iconName, size)
                if (success) {
                    createEditor(process.pid, { fileName: iconName, filePath: path })
                    addWindow({
                        pid: process.pid,
                        ProcessName: "File Editor",
                        cpuUsage: process.cpuUsage,
                        memoryUsage: process.size,
                        state: process.state
                    })
                }
                else {
                    alert(error)
                }
            }
        }
    }

    const handleClick = () => {
        select({ name: iconName, type })
    }



    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={(e) => { e.stopPropagation(), handleClick() }} onDoubleClick={() => handleOpen()} className={`icon cursor-target ${isSelected ? 'selected' : ''}`}>
            <div className="iconImage">
                <img src={iconImage} alt="" />
            </div>
            <div className="iconName fileName"><h4>{iconName}</h4></div>

        </motion.div>
    )
}

export default FileIcon
