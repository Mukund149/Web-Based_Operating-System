import React, { useRef } from 'react'
import '../fileExplorer/fileExplorer.css'
import useFileSystemStore from '../../store/FileSystemStore'
import { useKernel } from '../../context/kernelContext'
import file from '../../assets/icons/file.png'
import directory from '../../assets/icons/directory.png'
import FileIcon from './fileIcon'
import useComponentStore from '../../store/ComponentStore'


const FileExplorer = ({ windowId, setErrorName, isError }) => {

    const { createFile, createFolder, deleteFile, deleteFolder, writeFile, readFile, moveFile, listFiles, renameFile } = useKernel()
    const { contextMenu, openContextMenu, closeContextMenu, cwd, setCwd, goBack, select, clearSelect, selected } = useFileSystemStore()
    const {openComponent, closeComponent, popUp} = useComponentStore()
    const handleRightClick = (e) => {
        const mouseX = e.clientX;
        const mouseY = e.clientY;
        openContextMenu(mouseX, mouseY, "/")
    }
    // const handleRename = (newName)=>{
    //     let path
    //     let name
    //     if (selected.type === "directory") {   
    //         path = cwd + `/${selected.name}`
    //         name = newName

    //     }
    //     else if(selected.type === "file"){
    //         path = cwd + `/${selected.name}`
    //         name = `${newName}.txt`
    //     }
    //     renameFile(path, name)
    // }

    const handleDelete = () => {
        let path = cwd + `/${selected.name}`
        let result
        if (selected.type === "directory") {
            result = deleteFolder(path)
        }
        else if (selected.type === "file") {
            result = deleteFile(path)
        }
        if (result && !result.success) {
            setErrorName(result.error)
            isError()
        }
        listFiles(cwd)
    }

    const list = listFiles(cwd)
    const files = list.entries

    return (
        <div onContextMenu={(e) => handleRightClick(e)} onClick={() => {closeContextMenu(); clearSelect()}} className='explorer-main'>
            <div className="status-bar">
                <div className="navigation">
                    <div onClick={() => goBack()} className="back nav cursor-target"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M7.82843 10.9999H20V12.9999H7.82843L13.1924 18.3638L11.7782 19.778L4 11.9999L11.7782 4.22168L13.1924 5.63589L7.82843 10.9999Z"></path></svg></div>
                    <div className="forward nav"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z"></path></svg></div>
                </div>
                <div className="path"><h3>{cwd}</h3></div>
            </div>
            <div className="toolbar">
                <div onClick={(e)=>{e.stopPropagation(), openComponent("popUp", "File")}} className="tool createFile cursor-target">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M15 4H5V20H19V8H15V4ZM3 2.9918C3 2.44405 3.44749 2 3.9985 2H16L20.9997 7L21 20.9925C21 21.5489 20.5551 22 20.0066 22H3.9934C3.44476 22 3 21.5447 3 21.0082V2.9918ZM11 11V8H13V11H16V13H13V16H11V13H8V11H11Z"></path></svg>
                    <h5>File</h5>
                </div>
                <div onClick={(e)=>{e.stopPropagation(), openComponent("popUp", "Folder")}} className="tool createFolder cursor-target">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M6 7V4C6 3.44772 6.44772 3 7 3H13.4142L15.4142 5H21C21.5523 5 22 5.44772 22 6V16C22 16.5523 21.5523 17 21 17H18V20C18 20.5523 17.5523 21 17 21H3C2.44772 21 2 20.5523 2 20V8C2 7.44772 2.44772 7 3 7H6ZM6 9H4V19H16V17H6V9ZM8 5V15H20V7H14.5858L12.5858 5H8Z"></path></svg>
                    <h5>Folder</h5>
                </div>
                <div onClick={(e)=>{ e.stopPropagation(), openComponent("popUp", selected.type, "rename")}} style={{color: selected ? "white": "#ebe9e920", pointerEvents: selected?"all":"none"}} className="tool rename cursor-target">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M1 2V5H3V4H5V9H3.5V11H8.5V9H7V4H9V5H11V2H1ZM21 3H14V5H20V19H4V14H2V20C2 20.5523 2.44772 21 3 21H21C21.5523 21 22 20.5523 22 20V4C22 3.44772 21.5523 3 21 3Z"></path></svg>
                    <h5>Rename</h5>
                </div>
                <div onClick={(e)=>{ e.stopPropagation(), handleDelete(), clearSelect()}} style={{color: selected ? "white": "#ebe9e920", pointerEvents: selected?"all":"none"}} className="tool delete cursor-target">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M17 6H22V8H20V21C20 21.5523 19.5523 22 19 22H5C4.44772 22 4 21.5523 4 21V8H2V6H7V3C7 2.44772 7.44772 2 8 2H16C16.5523 2 17 2.44772 17 3V6ZM18 8H6V20H18V8ZM9 11H11V17H9V11ZM13 11H15V17H13V11ZM9 4V6H15V4H9Z"></path></svg> <h5>Delete</h5>
                </div>
                <div onClick={(e)=>{e.stopPropagation(), console.log(selected)}} style={{color: selected ? "white": "#ebe9e920", pointerEvents: selected?"all":"none"}} className="tool delete cursor-target">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M17 6H22V8H20V21C20 21.5523 19.5523 22 19 22H5C4.44772 22 4 21.5523 4 21V8H2V6H7V3C7 2.44772 7.44772 2 8 2H16C16.5523 2 17 2.44772 17 3V6ZM18 8H6V20H18V8ZM9 11H11V17H9V11ZM13 11H15V17H13V11ZM9 4V6H15V4H9Z"></path></svg> <h5>Print</h5>
                </div>
            </div>
            <div className="files">
                {files.map((entry) => {
                    let image
                    entry.type === "file" ? image = file : image = directory
                    return <FileIcon key={entry.name} iconImage={image} iconName={entry.name} type={entry.type} isSelected={selected?.name === entry.name} size={entry.size} />
                })}
            </div>
        </div>
    )
}

export default FileExplorer
