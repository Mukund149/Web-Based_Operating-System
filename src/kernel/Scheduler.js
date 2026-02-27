class Scheduler{

/**
 * @param {import('./ProcessManager.js').default} processManager
 */

    constructor(processManager){
        this.totalCPU = 100
        this.usedCPU = 5
        this.availableCPU = this.totalCPU - this.usedCPU
        this.pm = processManager
        this.current = 0
    }

    startScheduler(time = 500){
        setInterval(() => {            
            const readyQueue = this.pm.getReadyQueue();
            if (!readyQueue.length) {
                return null
            }
            this.usedCPU = 5

            const allProcessesDecayList = this.pm.getReadyQueue().concat(this.pm.getWaitingQueue())

            allProcessesDecayList.forEach(p => {
                if (p.state !== "running") {
                    p.cpuUsage = Math.max(p.cpuUsage - 10, 0)   
                }
                this.usedCPU += p.cpuUsage
            });

            this.availableCPU = this.totalCPU - this.usedCPU

            this.pm.contextSwitch()
            const runningProcess = this.pm.getRunningProcess()
            if (!runningProcess) {return; }
            runningProcess.state = "running"

            const maxUsable = Math.min(30, this.availableCPU)
            const assignedCPU = Math.floor(Math.random() * Math.min(20, maxUsable)) + 10
            runningProcess.cpuUsage = Math.min(assignedCPU, this.availableCPU)

            this.usedCPU += runningProcess.cpuUsage;
            this.availableCPU = this.totalCPU - this.usedCPU


            this.current++
            
        }, time);
    }

    releaseCpu(amount){
        this.usedCPU -= amount
        if (this.usedCPU < 5) {
            this.usedCPU = 5 
        }
        this.availableCPU = this.totalCPU - this.usedCPU
    }

    getAvailableCPU(){
        return this.availableCPU
    }
    getUsedCPU(){
        return this.usedCPU
    }
}

export default Scheduler