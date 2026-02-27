import React, { useRef, useState } from 'react'
import AppIcon from '../appIcon/AppIcon'
import terminal from '../../assets/icons/terminal.png'
import calculator from '../../assets/icons/calculator.png'
import explorer from '../../assets/icons/folder.png'
import '../desktop/desktop.css'
import Spline from '@splinetool/react-spline';
import Taskbar from '../taskbar/Taskbar'
import StartMenu from '../startMenu/StartMenu'
import backImg from '../../assets/images/image.png'
import GlassSurface from '../bootScreen/GlassSurface'
import LiquidChrome from './LiquidChrome'
import backVideo from '../../assets/images/background.mp4'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import useFileSystemStore from '../../store/FileSystemStore'
import useComponentStore from '../../store/ComponentStore'

const Desktop = ({isError, setErrorName}) => {

   const { contextMenu, openContextMenu, closeContextMenu } = useFileSystemStore();
   const {appIcon} = useComponentStore()


    const handleRightClick = (e)=>{
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    openContextMenu(mouseX, mouseY, "/")

  }

  const tagRef = useRef()

  return (
    <>
      <div onContextMenu={(e)=>handleRightClick(e)} onClick={()=>closeContextMenu()} className="main_desktop">

      <div className="object">

        <video src={backVideo} autoPlay loop muted ></video>
      </div>
        
        <div className="icon_grid">
          { appIcon.isOpen && <AppIcon setErrorName={setErrorName} isError={isError} iconName={"Terminal"} iconImage={terminal} size={209715200}/>}
          { appIcon.isOpen && <AppIcon setErrorName={setErrorName} isError={isError} iconName={"Calculator"} iconImage={calculator} size={419430400} />}
          { appIcon.isOpen && <AppIcon setErrorName={setErrorName} isError={isError} iconName={"File Explorer"} iconImage={explorer} size={629145600} />}
        </div>
      </div>
    </>
  )
}

export default Desktop
