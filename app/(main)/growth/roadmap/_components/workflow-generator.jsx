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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Download, 
  Upload, 
  RefreshCw, 
  Maximize2, 
  Minimize2,
  Save,
  Eye,
  Edit3,
  AlertTriangle,
  CheckCircle2
} from "lucide-react";

import { nodeTypes } from "./workflow-nodes-clean";
import { 
  validateWorkflow, 
  enhanceWorkflowStructure, 
  generateWorkflowConnections 
} from "./workflow-utils";
import { createWorkflowLayout } from "./workflow-layout";

// Use the clean layout utility for better positioning
const convertRoadmapToFlow = (roadmap) => {
  return createWorkflowLayout(roadmap);
};

const WorkflowGenerator = ({ roadmap }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [viewMode, setViewMode] = useState("edit"); // "edit" or "view"

  // Convert roadmap to flow data
  const initialFlowData = useMemo(() => {
    return convertRoadmapToFlow(roadmap);
  }, [roadmap]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialFlowData.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialFlowData.edges);

  // Validate workflow
  const validation = useMemo(() => {
    return validateWorkflow(roadmap);
  }, [roadmap]);

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
    
    const exportFileDefaultName = `career-workflow-${roadmap.targetRole?.replace(/\s+/g, '-').toLowerCase() || 'workflow'}.json`;
    
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
          // Handle error silently
        }
      };
      reader.readAsText(file);
    }
  };

  const resetWorkflow = () => {
    setNodes(initialFlowData.nodes);
    setEdges(initialFlowData.edges);
  };

  const containerClass = isFullscreen 
    ? "fixed inset-0 z-50 bg-background" 
    : "w-full h-[600px] border rounded-lg";

  return (
    <div className="space-y-4">
      {/* Validation Alerts */}
      {!validation.isValid && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <div className="font-semibold mb-2">Workflow Issues Detected:</div>
            <ul className="list-disc list-inside space-y-1">
              {validation.issues.map((issue, index) => (
                <li key={index}>{issue}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {validation.suggestions.length > 0 && (
        <Alert>
          <CheckCircle2 className="h-4 w-4" />
          <AlertDescription>
            <div className="font-semibold mb-2">Suggestions for Improvement:</div>
            <ul className="list-disc list-inside space-y-1">
              {validation.suggestions.map((suggestion, index) => (
                <li key={index}>{suggestion}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {/* Controls */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <span>Career Workflow</span>
              <Badge variant="outline">{roadmap.targetRole}</Badge>
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setViewMode(viewMode === "edit" ? "view" : "edit")}
              >
                {viewMode === "edit" ? <Eye className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
                {viewMode === "edit" ? "View" : "Edit"}
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
              
              <label htmlFor="import-workflow">
                <Button variant="outline" size="sm" asChild>
                  <span>
                    <Upload className="w-4 h-4" />
                    Import
                  </span>
                </Button>
              </label>
              <input
                id="import-workflow"
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
              nodesDraggable={viewMode === "edit"}
              nodesConnectable={viewMode === "edit"}
              elementsSelectable={viewMode === "edit"}
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

      {/* Legend */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Workflow Legend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-primary"></div>
              <span>Goal</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-green-500"></div>
              <span>Week</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-yellow-500"></div>
              <span>Skills</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-purple-500"></div>
              <span>Projects</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-red-500"></div>
              <span>Certifications</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-cyan-500"></div>
              <span>Networking</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WorkflowGenerator;
