"use client";

import React, { useState, useCallback, useMemo, useRef, useEffect } from "react";
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  ReactFlowProvider,
  useReactFlow,
} from "reactflow";
import "reactflow/dist/style.css";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  CheckCircle2,
  X,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Info,
  Calendar,
  Target,
  Code,
  Briefcase,
  Award,
  Users
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
  const [showDetails, setShowDetails] = useState(false);
  const [selectedNode, setSelectedNode] = useState(null);
  const [activeTab, setActiveTab] = useState("workflow");

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

  const onNodeClick = useCallback((event, node) => {
    setSelectedNode(node);
    setShowDetails(true);
  }, []);

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

  const handleRefresh = () => {
    const newFlowData = convertRoadmapToFlow(roadmap);
    setNodes(newFlowData.nodes);
    setEdges(newFlowData.edges);
  };

  const containerClass = isFullscreen 
    ? "fixed inset-0 z-50 bg-background" 
    : "h-[600px] w-full border rounded-lg";

  const getNodeIcon = (type) => {
    switch (type) {
      case "weekNode": return <Calendar className="w-4 h-4" />;
      case "skillNode": return <Code className="w-4 h-4" />;
      case "projectNode": return <Briefcase className="w-4 h-4" />;
      case "certificationNode": return <Award className="w-4 h-4" />;
      case "networkingNode": return <Users className="w-4 h-4" />;
      case "goalNode": return <Target className="w-4 h-4" />;
      default: return <Target className="w-4 h-4" />;
    }
  };

  const getNodeTypeLabel = (type) => {
    switch (type) {
      case "weekNode": return "Week";
      case "skillNode": return "Skill";
      case "projectNode": return "Project";
      case "certificationNode": return "Certification";
      case "networkingNode": return "Networking";
      case "goalNode": return "Goal";
      default: return "Node";
    }
  };

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
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Career Workflow</CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                {nodes.length} nodes, {edges.length} connections
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsFullscreen(!isFullscreen)}
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                {isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant={viewMode === "edit" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("edit")}
            >
              <Edit3 className="w-4 h-4 mr-1" />
              Edit
            </Button>
            <Button
              variant={viewMode === "view" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("view")}
            >
              <Eye className="w-4 h-4 mr-1" />
              View
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
            >
              <RefreshCw className="w-4 h-4 mr-1" />
              Refresh
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExport}
            >
              <Download className="w-4 h-4 mr-1" />
              Export
            </Button>
            <label htmlFor="import-workflow">
              <Button
                variant="outline"
                size="sm"
                asChild
              >
                <span>
                  <Upload className="w-4 h-4 mr-1" />
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
        </CardContent>
      </Card>

      {/* Main Content */}
      <div className="flex gap-4">
        {/* Workflow Canvas */}
        <div className={`flex-1 ${containerClass}`}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            nodeTypes={nodeTypes}
            fitView
            fitViewOptions={{ padding: 0.1 }}
            nodesDraggable={viewMode === "edit"}
            nodesConnectable={viewMode === "edit"}
            elementsSelectable={viewMode === "edit"}
            className="bg-muted/20"
          >
            <Background />
            <Controls />
            <MiniMap 
              nodeColor={(node) => {
                switch (node.type) {
                  case "goalNode": return "#6366f1";
                  case "weekNode": return "#8b5cf6";
                  case "skillNode": return "#f59e0b";
                  case "projectNode": return "#ef4444";
                  case "certificationNode": return "#10b981";
                  case "networkingNode": return "#06b6d4";
                  default: return "#6b7280";
                }
              }}
              nodeStrokeWidth={3}
              zoomable
              pannable
            />
          </ReactFlow>
        </div>

        {/* Details Panel */}
        {showDetails && selectedNode && (
          <Card className="w-80 h-fit">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getNodeIcon(selectedNode.type)}
                  <CardTitle className="text-base">
                    {getNodeTypeLabel(selectedNode.type)} Details
                  </CardTitle>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowDetails(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg mb-2">
                  {selectedNode.data.goal || 
                   selectedNode.data.focus || 
                   selectedNode.data.skill || 
                   selectedNode.data.project || 
                   selectedNode.data.certification || 
                   selectedNode.data.activity}
                </h3>
                
                {selectedNode.type === "weekNode" && (
                  <div className="space-y-3">
                    <div>
                      <Badge variant="outline" className="mb-2">
                        Week {selectedNode.data.week}
                      </Badge>
                      <p className="text-sm text-muted-foreground">
                        {selectedNode.data.focus}
                      </p>
                    </div>
                    
                    {selectedNode.data.tasks && selectedNode.data.tasks.length > 0 && (
                      <div>
                        <h4 className="font-medium text-sm mb-2 flex items-center gap-1">
                          <Target className="w-3 h-3" />
                          Tasks ({selectedNode.data.tasks.length})
                        </h4>
                        <ul className="text-sm space-y-1">
                          {selectedNode.data.tasks.map((task, index) => (
                            <li key={index} className="text-muted-foreground">• {task}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {selectedNode.type === "skillNode" && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant={selectedNode.data.level === "Advanced" ? "default" : 
                                selectedNode.data.level === "Intermediate" ? "secondary" : "outline"}
                      >
                        {selectedNode.data.level}
                      </Badge>
                      <Badge variant="outline">
                        {selectedNode.data.category}
                      </Badge>
                    </div>
                  </div>
                )}

                {selectedNode.type === "projectNode" && (
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      {selectedNode.data.description || "Hands-on project to practice skills"}
                    </p>
                    {selectedNode.data.technologies && (
                      <div>
                        <h4 className="font-medium text-sm mb-1">Technologies:</h4>
                        <div className="flex flex-wrap gap-1">
                          {selectedNode.data.technologies.map((tech, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {tech}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {selectedNode.type === "certificationNode" && (
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      Provider: {selectedNode.data.provider}
                    </p>
                    {selectedNode.data.duration && (
                      <p className="text-sm text-muted-foreground">
                        Duration: {selectedNode.data.duration}
                      </p>
                    )}
                  </div>
                )}

                {selectedNode.type === "networkingNode" && (
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      Platform: {selectedNode.data.platform}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Type: {selectedNode.data.type || "Professional"}
                    </p>
                  </div>
                )}

                {selectedNode.type === "goalNode" && (
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      Timeline: {selectedNode.data.timeline}
                    </p>
                    <Badge 
                      variant={selectedNode.data.priority === "high" ? "destructive" : 
                              selectedNode.data.priority === "medium" ? "default" : "secondary"}
                    >
                      Priority: {selectedNode.data.priority}
                    </Badge>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Workflow Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Workflow Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{nodes.filter(n => n.type === "weekNode").length}</div>
              <div className="text-sm text-muted-foreground">Weeks</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-500">{nodes.filter(n => n.type === "skillNode").length}</div>
              <div className="text-sm text-muted-foreground">Skills</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-500">{nodes.filter(n => n.type === "projectNode").length}</div>
              <div className="text-sm text-muted-foreground">Projects</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-500">{nodes.filter(n => n.type === "certificationNode").length}</div>
              <div className="text-sm text-muted-foreground">Certifications</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const WorkflowGeneratorWrapper = ({ roadmap }) => {
  return (
    <ReactFlowProvider>
      <WorkflowGenerator roadmap={roadmap} />
    </ReactFlowProvider>
  );
};

export default WorkflowGeneratorWrapper;
