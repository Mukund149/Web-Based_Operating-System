import React, { useEffect, useState } from 'react'
import '../src/App.css'
import Desktop from './components/desktop/Desktop'
import Taskbar from './components/taskbar/Taskbar'
import StartMenu from './components/startMenu/StartMenu'
import AppWindow from './windowingSystem/AppWindow'
import useWindowStore from './store/windowStore'
import appRegistry from './store/appRegistry'
import BootScreen from './components/bootScreen/BootScreen'
import TargetCursor from './components/cursor/TargetCursor'
import iconRegistry from './store/iconRegistry'
import { AnimatePresence } from "motion/react"
import ErrorBox from './components/errorBox/ErrorBox'
import useFileSystemStore from './store/FileSystemStore'
import useComponentStore from './store/ComponentStore'
import TaskManager from './components/taskmanager/TaskManager'
import SubMenu from './components/SubMenu/SubMenu'
import Popup from './components/createPopUp/Popup'

const App = () => {

  
  const { contextMenu, openContextMenu, closeContextMenu } = useFileSystemStore();
  const {startMenu, errorBox, boot, taskManager, appIcon, taskBar, popUp} = useComponentStore()

  useEffect(()=>{
    const handleGlobalRightClick = (e)=>{
      e.preventDefault()
    }
    document.addEventListener("contextmenu", handleGlobalRightClick)

    return ()=>{
      document.removeEventListener("contextmenu", handleGlobalRightClick)
    }
  }, [])


  const [isError, setisError] = useState(false)
  const [errorName, seterrorName] = useState('')

  const handleError = ()=>{setisError(!isError)}


  const windows = useWindowStore((state) => state.windows)


  
  return (
    <>
      <div className="app_container">
        <main className='main_content'>

          <Desktop setErrorName={seterrorName} isError={handleError} />


          { isError && < ErrorBox errorName={errorName} isError={handleError} />}


          <TargetCursor spinDuration={2} hideDefaultCursor={true} />


          { boot.isOpen && <BootScreen/>}


        <AnimatePresence>
        { popUp.isOpen && <Popup isError={handleError} setErrorName={seterrorName} />}
        </AnimatePresence>

          <AnimatePresence>
          {windows.map((win) => {
            const Component = appRegistry[win.name]
            const image = iconRegistry[win.name]

            if (!Component) return null
            return (

              <AppWindow key={win.id} appImg={image} windowData={win}>
                <Component windowId={win.id} setErrorName={seterrorName} isError={handleError} />
              </AppWindow>
            )
          })}
          </AnimatePresence>


          <AnimatePresence>
          { contextMenu.isOpen && <SubMenu key="Context-menu" contextPosition={{x:contextMenu.x, y:contextMenu.y }} />}
          </AnimatePresence>

        </main>

        <footer className='taskbar-footer'>
          {taskBar.isOpen && <Taskbar/>}
        </footer>

      </div>
    </>
  )
}

export default App
