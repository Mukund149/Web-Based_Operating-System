import React, { useState, useEffect } from "react";
import { useKernel } from "../../context/kernelContext";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const bootTime = Date.now();

const PerformanceTab = () => {
  const { getSystemStats, getProcessStats, memoryManager } = useKernel();

  const [cpuUsage, setCpuUsage] = useState(0);
  const [memoryUsage, setMemoryUsage] = useState(0);
  const [processCount, setProcessCount] = useState(0);
  const [uptime, setUptime] = useState("0h 0m 0s");
  const [cpuHistory, setCpuHistory] = useState([]);
  const [metricView, setMetricView] = useState("cpu");

  const TOTAL_MEMORY = memoryManager?.totalMemory || 4194304;

  useEffect(() => {
    const updateMetrics = () => {
      try {
        const systemStats = getSystemStats();

        const cpu = systemStats?.UsedCPU || 0;
        setCpuUsage(cpu);

        const usedMem = systemStats?.UsedMemory || 0;
        const memoryPercent =
          TOTAL_MEMORY > 0 ? (usedMem / TOTAL_MEMORY) * 100 : 0;
        setMemoryUsage(memoryPercent);

        const processStats = getProcessStats();
        setProcessCount(processStats?.all?.length || 0);

        const elapsed = Date.now() - bootTime;
        const hours = Math.floor(elapsed / 3600000);
        const minutes = Math.floor((elapsed % 3600000) / 60000);
        const seconds = Math.floor((elapsed % 60000) / 1000);
        setUptime(`${hours}h ${minutes}m ${seconds}s`);

        setCpuHistory((prev) => {
          const next = [...prev, { cpu, memory: memoryPercent }];
          if (next.length > 60) next.shift();
          return next;
        });
      } catch (err) {
        console.error("PerformanceTab error:", err);
      }
    };

    updateMetrics();
    const interval = setInterval(updateMetrics, 1000);
    return () => clearInterval(interval);
  }, []);

  const graphData = cpuHistory.map((point, index) => ({
    time: index,
    cpu: point.cpu,
    memory: point.memory,
  }));

  return (
    <div className="performance-tab">
      <h2 className="cpu-title">Performance Metrics</h2>

      <div className="perf-toggle">
        <button
          className={`perf-btn ${metricView === "cpu" ? "active" : ""}`}
          onClick={() => setMetricView("cpu")}
        >
          CPU
        </button>

        <button
          className={`perf-btn ${metricView === "memory" ? "active" : ""}`}
          onClick={() => setMetricView("memory")}
        >
          Memory
        </button>
      </div>

      <div className="cpu-graph">
        {cpuHistory.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={graphData}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#262a30" />

              <XAxis
                dataKey="time"
                stroke="#6b7280"
                tick={{ fill: "#9ca3af", fontSize: 11 }}
                axisLine={{ stroke: "#374151" }}
                tickLine={false}
              />

              <YAxis
                domain={[0, 100]}
                stroke="#6b7280"
                tick={{ fill: "#9ca3af", fontSize: 11 }}
                axisLine={{ stroke: "#374151" }}
                tickLine={false}
              />

              <Tooltip
                contentStyle={{
                  backgroundColor: "#0b0d11",
                  border: "1px solid #27272a",
                  borderRadius: "8px",
                  color: "#fff",
                }}
                formatter={(value) => [`${value.toFixed(1)}%`, "Usage"]}
              />

              {metricView === "cpu" ? (
                <Line
                  type="monotone"
                  dataKey="cpu"
                  stroke="#22d3ee"
                  strokeWidth={3}
                  dot={false}
                  isAnimationActive={false}
                />
              ) : (
                <Line
                  type="monotone"
                  dataKey="memory"
                  stroke="#a78bfa"
                  strokeWidth={3}
                  dot={false}
                  isAnimationActive={false}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div
            style={{
              color: "white",
              textAlign: "center",
              paddingTop: "100px",
            }}
          >
            Loading graph...
          </div>
        )}
      </div>

      <div className="cpu-stats">
        <div className="stat-item">
          <span className="stat-label">
            {metricView === "cpu" ? "CPU Utilization" : "Memory Utilization"}
          </span>
          <span className="stat-value">
            {metricView === "cpu"
              ? `${cpuUsage.toFixed(1)}%`
              : `${memoryUsage.toFixed(1)}%`}
          </span>
        </div>

        <div className="stat-item">
          <span className="stat-label">Processes</span>
          <span className="stat-value">{processCount}</span>
        </div>

        <div className="stat-item">
          <span className="stat-label">Uptime</span>
          <span className="stat-value">{uptime}</span>
        </div>
      </div>
    </div>
  );
};

export default PerformanceTab;