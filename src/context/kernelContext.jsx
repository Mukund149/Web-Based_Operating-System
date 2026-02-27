import ProcessManager from "../kernel/ProcessManager";
import MemoryManager from "../kernel/MemoryManager";
import Scheduler from "../kernel/Scheduler";
import StorageSystem from "../kernel/StorageSystem"
import iNodeFileSystem from "../kernel/InodeFileSystem";
import { createContext, useContext, useRef } from "react";

const kernelContext = createContext(null)

export const KernelProvider = ({ children }) => {
    const kernel = useRef(null)

    if (!kernel.current) {
        const memoryManager = new MemoryManager(4294967296)
        const scheduler = new Scheduler()
        const processManager = new ProcessManager(memoryManager, scheduler)
        scheduler.pm = processManager
        const storageSystem = new StorageSystem(16777216, 4)
        const fileSystem = new iNodeFileSystem(storageSystem)

        scheduler.startScheduler()


        kernel.current = {
            memoryManager,
            processManager,
            scheduler,
            storageSystem,
            fileSystem
        }
    }
    return (
        <kernelContext.Provider value={kernel.current} >
            {children}
        </kernelContext.Provider>
    )
}

export const useKernel = () => {
    const kernel = useContext(kernelContext)
    if (!kernel) {
        alert("useKernel must be used within a kernelProvider")
    }

    /** @type {import('../kernel/MemoryManager').default} */
    const memoryManager = kernel.memoryManager;

    /** @type {import('../kernel/ProcessManager').default} */
    const processManager = kernel.processManager;

    /** @type {import('../kernel/Scheduler').default} */
    const scheduler = kernel.scheduler;

    /** @type {import('../kernel/StorageSystem').default} */
    const storageSystem = kernel.storageSystem;

    /** @type {import('../kernel/InodeFileSystem').default} */
    const fileSystem = kernel.fileSystem;

    const createFile = (filePath) => {
        const { success, error, inodeId } = fileSystem.createInode(filePath, "file")
        if (!success) {
            return { success: false, error }
        }
        return { success: true, inodeId }
    }
    const createFolder = (filePath) => {
        const { success, error, inodeId } = fileSystem.createInode(filePath, "directory")
        if (!success) {
            return { success: false, error }
        }
        return { success: true, inodeId }
    }

    const readFile = (filePath) => {
        const { success, error, result } = fileSystem.readFile(filePath)
        if (!success) {
            return { success: false, error }
        }
        return { success: true, result }
    }

    const deleteFile = (filePath) => {
        const { success, error } = fileSystem.deleteFile(filePath)
        if (!success) {
            return { success: false, error }
        }
        return { success: true }
    }
    const deleteFolder = (filePath) => {
        const { success, error } = fileSystem.deleteFolder(filePath)
        if (!success) {
            return { success: false, error }
        }
        return { success: true }
    }

    const moveFile = (oldFilePath, newFilePath) => {
        const { success, error } = fileSystem.move(oldFilePath, newFilePath)
        if (!success) {
            return { success: false, error }
        }
        return { success: true }
    }

    const writeFile = (filePath, offset, data) => {
        const { success, error } = fileSystem.writeFile(filePath, offset, data)
        if (!success) {
            return { success: false, error }
        }
        return { success: true }
    }

    const listFiles = (filePath) => {
        const { success, error, entries } = fileSystem.list(filePath)
        if (!success) {
            return { success: false, error }
        }
        return { success: true, entries }
    }

    const renameFile = (filePath, newName) => {
        const { success, error } = fileSystem.renameFile(filePath, newName)
        if (!success) {
            return { success: false, error }
        }
        return {success: true}
    }

    const createApp = (appName, size) => {
        const { success, process, error } = processManager.createProcess(appName, size)
        if (!success) {
            return { success: false, error }
        }
        return { success: true, process }
    }

    const terminateApp = (pid) => {
        const { success, error } = processManager.terminateProcess(pid)
        if (!success) {
            return { success: false, error }
        }
        return { success: true }
    }

    const getProcessStats = () => {
        return {
            running: processManager.getRunningProcess(),
            all: processManager.listProcesses(),
            ready: processManager.getReadyQueue(),
            waiting: processManager.getWaitingQueue()
        }
    }

    const getSystemStats = () => {
        return {
            AvailableCPU: scheduler.getAvailableCPU(),
            AvailableMemory: memoryManager.getAvailableMemory(),
            UsedCPU: scheduler.getUsedCPU(),
            UsedMemory: memoryManager.getMemoryInUse()
        }
    }

    return {
        createFile,
        createFolder,
        deleteFile,
        deleteFolder,
        writeFile,
        renameFile,
        moveFile,
        readFile,
        listFiles,
        createApp,
        terminateApp,
        getProcessStats,
        getSystemStats,
        memoryManager,
        processManager,
        scheduler,
        storageSystem,
        fileSystem
    }

}
