import React, { useState } from 'react'
import './taskManager.css'
import DataRenderComponent from './DataRenderingComponent'
import PerformanceTab from './PerformanceTab'
import { motion } from 'motion/react'

const TaskManager = () => {
  const [activeTab, setActiveTab] = useState('processes')

  return (
    <motion.div
      transformTemplate={(transform, generated) => `translateX(-50%) ${generated}`}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 30 }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
      className="taskmanager-container"
    >
      {/* Sidebar + Content */}
      <div className="taskmanager-body">
        <div className="taskmanager-sidebar">
          <button
            className={`sidebar-btn ${activeTab === 'processes' ? 'active' : ''}`}
            onClick={() => setActiveTab('processes')}
          >
            <span className="sidebar-label">Processes</span>
          </button>

          <button
            className={`sidebar-btn ${activeTab === 'performance' ? 'active' : ''}`}
            onClick={() => setActiveTab('performance')}
          >
            <span className="sidebar-label">Performance</span>
          </button>
        </div>

        <div className="taskmanager-content">
          {activeTab === 'processes' && (
            <>
              <div className="data-row header">
                <div className="table-column table-header">PID</div>
                <div className="table-column table-header">App Name</div>
                <div className="table-column table-header">Memory Usage</div>
                <div className="table-column table-header">CPU Usage</div>
                <div className="table-column table-header">Status</div>
              </div>
              <DataRenderComponent />
            </>
          )}

          {activeTab === 'performance' && <PerformanceTab />}
        </div>
      </div>
    </motion.div>
  )
}

export default TaskManager