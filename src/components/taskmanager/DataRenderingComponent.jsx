import React, { useEffect } from 'react';
import useWindowStore from '../../store/windowStore';
import { useKernel } from '../../context/kernelContext';
import { formatBytes } from '../../formatter/formatter.js'

const DataRenderComponent = () => {
  const processes = useWindowStore(state => state.processes);
  const { processMonitoring } = useWindowStore();
  const { getProcessStats } = useKernel();
  // const format = formatBytes()

  useEffect(() => {
    processMonitoring(getProcessStats);
  }, []);

  // const memory = formatBytes()

  return (
    <div className="data-render-container">
      {processes.length > 0 ? (
        processes.map(proc => (
          <div key={proc.pid} className="data-row">
            <div className="table-column">{proc.pid}.</div>
            <div className="table-column">{proc.processName}</div>
            <div className="table-column">{formatBytes(proc.memoryUsage)}</div>
            <div className="table-column">{proc.cpuUsage}%</div>
            <div className="table-column">
              {proc.state === 'running'
                ? 'Running'
                : proc.state === 'ready'
                ? 'Ready'
                : proc.state === 'waiting'
                ? 'Waiting'
                : proc.state}
            </div>
          </div>
        ))
      ) : (
        <div>No running apps</div>
      )}
    </div>
  );
};

export default DataRenderComponent;