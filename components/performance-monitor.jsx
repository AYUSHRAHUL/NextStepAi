"use client";

import React, { useEffect, useState } from "react";

export default function PerformanceMonitor() {
  const [metrics, setMetrics] = useState(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Web Vitals monitoring
    const measureWebVitals = () => {
      // Largest Contentful Paint
      new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        const lastEntry = entries[entries.length - 1];
        console.log("LCP:", lastEntry.startTime);
      }).observe({ entryTypes: ["largest-contentful-paint"] });

      // First Input Delay
      new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        entries.forEach((entry) => {
          console.log("FID:", entry.processingStart - entry.startTime);
        });
      }).observe({ entryTypes: ["first-input"] });

      // Cumulative Layout Shift
      let clsValue = 0;
      new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        entries.forEach((entry) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        });
        console.log("CLS:", clsValue);
      }).observe({ entryTypes: ["layout-shift"] });
    };

    // Memory usage monitoring
    const measureMemory = () => {
      if ("memory" in performance) {
        const memory = performance.memory;
        setMetrics({
          usedJSHeapSize: Math.round(memory.usedJSHeapSize / 1048576), // MB
          totalJSHeapSize: Math.round(memory.totalJSHeapSize / 1048576), // MB
          jsHeapSizeLimit: Math.round(memory.jsHeapSizeLimit / 1048576), // MB
        });
      }
    };

    measureWebVitals();
    measureMemory();

    // Monitor memory every 30 seconds
    const interval = setInterval(measureMemory, 30000);

    return () => clearInterval(interval);
  }, []);

  // Only show in development
  if (process.env.NODE_ENV !== "development" || !metrics) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black/80 text-white p-2 rounded text-xs font-mono z-50">
      <div>Memory: {metrics.usedJSHeapSize}MB / {metrics.totalJSHeapSize}MB</div>
      <div>Limit: {metrics.jsHeapSizeLimit}MB</div>
    </div>
  );
}
