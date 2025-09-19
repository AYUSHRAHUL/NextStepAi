"use client";

import React, { useState, useCallback, useMemo } from "react";
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  ReactFlowProvider,
} from "reactflow";
import "reactflow/dist/style.css";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Download, 
  Upload, 
  RefreshCw, 
  Maximize2, 
  Minimize2,
  Play,
  Pause
} from "lucide-react";

import { nodeTypes } from "./workflow-nodes-clean";

// Demo workflow data with clean layout
const demoWorkflowData = {
  nodes: [
    {
      id: "goal",
      type: "goalNode",
      position: { x: 400, y: 50 },
      data: {
        goal: "Become a Senior Frontend Developer",
        timeline: "12 weeks",
        priority: "high"
      }
    },
    {
      id: "week-1",
      type: "weekNode",
      position: { x: 100, y: 200 },
      data: {
        week: 1,
        focus: "React Fundamentals",
        tasks: ["Learn JSX syntax", "Understand components", "Practice props and state"],
        status: "completed"
      }
    },
    {
      id: "week-2",
      type: "weekNode",
      position: { x: 350, y: 200 },
      data: {
        week: 2,
        focus: "State Management",
        tasks: ["Learn useState hook", "Understand useEffect", "Practice custom hooks"],
        status: "in-progress"
      }
    },
    {
      id: "week-3",
      type: "weekNode",
      position: { x: 600, y: 200 },
      data: {
        week: 3,
        focus: "Advanced React",
        tasks: ["Learn Context API", "Understand Redux", "Practice performance optimization"],
        status: "pending"
      }
    },
    {
      id: "skill-1",
      type: "skillNode",
      position: { x: 50, y: 600 },
      data: {
        skill: "JavaScript ES6+",
        level: "Advanced",
        category: "Technical"
      }
    },
    {
      id: "skill-2",
      type: "skillNode",
      position: { x: 230, y: 600 },
      data: {
        skill: "React.js",
        level: "Intermediate",
        category: "Framework"
      }
    },
    {
      id: "skill-3",
      type: "skillNode",
      position: { x: 410, y: 600 },
      data: {
        skill: "TypeScript",
        level: "Beginner",
        category: "Language"
      }
    },
    {
      id: "project-1",
      type: "projectNode",
      position: { x: 1200, y: 200 },
      data: {
        project: "E-commerce Dashboard",
        technologies: ["React", "Redux", "Material-UI"],
        status: "planned"
      }
    },
    {
      id: "cert-1",
      type: "certificationNode",
      position: { x: 1200, y: 500 },
      data: {
        certification: "React Developer Certification",
        provider: "Meta",
        status: "planned"
      }
    },
    {
      id: "networking-1",
      type: "networkingNode",
      position: { x: 50, y: 800 },
      data: {
        activity: "Join React Community",
        platform: "Discord",
        status: "completed"
      }
    }
  ],
  edges: [
    {
      id: "edge-goal-to-week-1",
      source: "goal",
      target: "week-1",
      type: "smoothstep",
      animated: true,
      style: { stroke: "#6366f1", strokeWidth: 2 }
    },
    {
      id: "edge-week-1-to-week-2",
      source: "week-1",
      target: "week-2",
      type: "smoothstep",
      animated: true,
      style: { stroke: "#6366f1", strokeWidth: 2 }
    },
    {
      id: "edge-week-2-to-week-3",
      source: "week-2",
      target: "week-3",
      type: "smoothstep",
      animated: true,
      style: { stroke: "#6366f1", strokeWidth: 2 }
    },
    {
      id: "edge-week-1-to-skill-1",
      source: "week-1",
      target: "skill-1",
      type: "smoothstep",
      style: { stroke: "#f59e0b", strokeWidth: 1 }
    },
    {
      id: "edge-week-2-to-skill-2",
      source: "week-2",
      target: "skill-2",
      type: "smoothstep",
      style: { stroke: "#f59e0b", strokeWidth: 1 }
    },
    {
      id: "edge-week-3-to-project-1",
      source: "week-3",
      target: "project-1",
      type: "smoothstep",
      style: { stroke: "#8b5cf6", strokeWidth: 1 }
    }
  ]
};

const DemoWorkflow = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const [nodes, setNodes, onNodesChange] = useNodesState(demoWorkflowData.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(demoWorkflowData.edges);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const handleExport = () => {
    const flowData = {
      nodes: nodes.map(node => ({
        id: node.id,
        type: node.type,
        position: node.position,
        data: node.data
      })),
      edges: edges.map(edge => ({
        id: edge.id,
        source: edge.source,
        target: edge.target,
        type: edge.type
      }))
    };
    
    const dataStr = JSON.stringify(flowData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = 'demo-career-workflow.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handleImport = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const flowData = JSON.parse(e.target.result);
          setNodes(flowData.nodes);
          setEdges(flowData.edges);
        } catch (error) {
          console.error('Error parsing workflow file:', error);
        }
      };
      reader.readAsText(file);
    }
  };

  const resetWorkflow = () => {
    setNodes(demoWorkflowData.nodes);
    setEdges(demoWorkflowData.edges);
  };

  const containerClass = isFullscreen 
    ? "fixed inset-0 z-50 bg-background" 
    : "w-full h-[600px] border rounded-lg";

  return (
    <div className="space-y-4">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <span>Interactive Career Workflow Demo</span>
              <Badge variant="outline">Frontend Developer</Badge>
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsPlaying(!isPlaying)}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                {isPlaying ? "Pause" : "Play"}
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsFullscreen(!isFullscreen)}
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                {isFullscreen ? "Exit" : "Fullscreen"}
              </Button>
              
              <Button variant="outline" size="sm" onClick={resetWorkflow}>
                <RefreshCw className="w-4 h-4" />
                Reset
              </Button>
              
              <Button variant="outline" size="sm" onClick={handleExport}>
                <Download className="w-4 h-4" />
                Export
              </Button>
              
              <label htmlFor="import-demo-workflow">
                <Button variant="outline" size="sm" asChild>
                  <span>
                    <Upload className="w-4 h-4" />
                    Import
                  </span>
                </Button>
              </label>
              <input
                id="import-demo-workflow"
                type="file"
                accept=".json"
                onChange={handleImport}
                className="hidden"
              />
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* React Flow */}
      <Card className={containerClass}>
        <CardContent className={isFullscreen ? "h-full p-0" : "h-[600px] p-0"}>
          <ReactFlowProvider>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              nodeTypes={nodeTypes}
              fitView
              attributionPosition="bottom-left"
              nodesDraggable={true}
              nodesConnectable={true}
              elementsSelectable={true}
            >
              <Controls />
              <MiniMap 
                nodeStrokeColor={(n) => {
                  if (n.type === 'goalNode') return '#6366f1';
                  if (n.type === 'weekNode') return '#10b981';
                  if (n.type === 'skillNode') return '#f59e0b';
                  if (n.type === 'projectNode') return '#8b5cf6';
                  if (n.type === 'certificationNode') return '#ef4444';
                  if (n.type === 'networkingNode') return '#06b6d4';
                  return '#6b7280';
                }}
                nodeColor={(n) => {
                  if (n.type === 'goalNode') return '#6366f1';
                  if (n.type === 'weekNode') return '#10b981';
                  if (n.type === 'skillNode') return '#f59e0b';
                  if (n.type === 'projectNode') return '#8b5cf6';
                  if (n.type === 'certificationNode') return '#ef4444';
                  if (n.type === 'networkingNode') return '#06b6d4';
                  return '#6b7280';
                }}
                nodeBorderRadius={2}
              />
              <Background color="#aaa" gap={16} />
            </ReactFlow>
          </ReactFlowProvider>
        </CardContent>
      </Card>

      {/* Features */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">React Flow Career Workflow Features</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
            <div className="space-y-2">
              <h4 className="font-semibold text-primary">Interactive Nodes</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Drag and drop nodes</li>
                <li>• Connect with edges</li>
                <li>• Custom node types</li>
                <li>• Status indicators</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-primary">Visual Elements</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Color-coded categories</li>
                <li>• Animated connections</li>
                <li>• Mini-map overview</li>
                <li>• Zoom and pan controls</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-primary">Export/Import</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• JSON workflow export</li>
                <li>• Import existing workflows</li>
                <li>• Share with others</li>
                <li>• Version control</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-primary">Workflow Types</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Weekly milestones</li>
                <li>• Skill development</li>
                <li>• Project planning</li>
                <li>• Certification paths</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DemoWorkflow;
