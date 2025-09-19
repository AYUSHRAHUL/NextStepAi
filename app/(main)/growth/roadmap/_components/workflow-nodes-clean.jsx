"use client";

import React from "react";
import { Handle, Position } from "reactflow";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  BookOpen, 
  Target, 
  Users, 
  Award, 
  Code, 
  Briefcase,
  Calendar,
  CheckCircle2,
  Clock,
  TrendingUp
} from "lucide-react";

// Clean, compact node types for better workflow layout
export const WeekNode = ({ data }) => {
  const { week, focus, tasks, status = "pending" } = data;
  
  const getStatusColor = (status) => {
    switch (status) {
      case "completed": return "bg-green-500";
      case "in-progress": return "bg-blue-500";
      case "pending": return "bg-gray-400";
      default: return "bg-gray-400";
    }
  };

  return (
    <Card className="w-[200px] shadow-lg border-2 hover:shadow-xl transition-shadow">
      <CardContent className="p-3">
        <Handle type="target" position={Position.Top} className="w-2 h-2" />
        
        <div className="flex items-center justify-between mb-2">
          <Badge variant="outline" className="text-xs px-2 py-1">
            Week {week}
          </Badge>
          <div className={`w-2 h-2 rounded-full ${getStatusColor(status)}`} />
        </div>

        <h3 className="font-semibold text-sm mb-2 text-primary leading-tight">{focus}</h3>

        {tasks && tasks.length > 0 && (
          <div className="text-xs text-muted-foreground">
            <div className="flex items-center gap-1 mb-1">
              <Target className="w-3 h-3" />
              <span className="font-medium">{tasks.length} tasks</span>
            </div>
            <div className="truncate">
              {tasks[0]}
              {tasks.length > 1 && ` +${tasks.length - 1} more`}
            </div>
          </div>
        )}

        <Handle type="source" position={Position.Bottom} className="w-2 h-2" />
      </CardContent>
    </Card>
  );
};

export const SkillNode = ({ data }) => {
  const { skill, level, category } = data;
  
  return (
    <Card className="w-[160px] shadow-lg border-2 hover:shadow-xl transition-shadow">
      <CardContent className="p-3">
        <Handle type="target" position={Position.Top} className="w-2 h-2" />
        
        <div className="flex items-center gap-2 mb-2">
          <Code className="w-4 h-4 text-primary" />
          <Badge 
            variant={level === "Advanced" ? "default" : level === "Intermediate" ? "secondary" : "outline"}
            className="text-xs"
          >
            {level}
          </Badge>
        </div>

        <h3 className="font-semibold text-sm mb-1">{skill}</h3>
        <p className="text-xs text-muted-foreground">{category}</p>

        <Handle type="source" position={Position.Bottom} className="w-2 h-2" />
      </CardContent>
    </Card>
  );
};

export const ProjectNode = ({ data }) => {
  const { project, technologies, status = "planned" } = data;
  
  const getStatusColor = (status) => {
    switch (status) {
      case "completed": return "bg-green-500";
      case "in-progress": return "bg-blue-500";
      case "planned": return "bg-yellow-500";
      default: return "bg-gray-400";
    }
  };

  return (
    <Card className="w-[180px] shadow-lg border-2 hover:shadow-xl transition-shadow">
      <CardContent className="p-3">
        <Handle type="target" position={Position.Top} className="w-2 h-2" />
        
        <div className="flex items-center gap-2 mb-2">
          <Briefcase className="w-4 h-4 text-primary" />
          <div className={`w-2 h-2 rounded-full ${getStatusColor(status)}`} />
        </div>

        <h3 className="font-semibold text-sm mb-1">{project}</h3>
        
        {technologies && technologies.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {technologies.slice(0, 2).map((tech, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {tech}
              </Badge>
            ))}
            {technologies.length > 2 && (
              <Badge variant="outline" className="text-xs">
                +{technologies.length - 2}
              </Badge>
            )}
          </div>
        )}

        <Handle type="source" position={Position.Bottom} className="w-2 h-2" />
      </CardContent>
    </Card>
  );
};

export const CertificationNode = ({ data }) => {
  const { certification, provider, status = "planned" } = data;
  
  const getStatusColor = (status) => {
    switch (status) {
      case "completed": return "bg-green-500";
      case "in-progress": return "bg-blue-500";
      case "planned": return "bg-yellow-500";
      default: return "bg-gray-400";
    }
  };

  return (
    <Card className="w-[160px] shadow-lg border-2 hover:shadow-xl transition-shadow">
      <CardContent className="p-3">
        <Handle type="target" position={Position.Top} className="w-2 h-2" />
        
        <div className="flex items-center gap-2 mb-2">
          <Award className="w-4 h-4 text-primary" />
          <div className={`w-2 h-2 rounded-full ${getStatusColor(status)}`} />
        </div>

        <h3 className="font-semibold text-sm mb-1">{certification}</h3>
        <p className="text-xs text-muted-foreground">{provider}</p>

        <Handle type="source" position={Position.Bottom} className="w-2 h-2" />
      </CardContent>
    </Card>
  );
};

export const NetworkingNode = ({ data }) => {
  const { activity, platform, status = "planned" } = data;
  
  const getStatusColor = (status) => {
    switch (status) {
      case "completed": return "bg-green-500";
      case "in-progress": return "bg-blue-500";
      case "planned": return "bg-yellow-500";
      default: return "bg-gray-400";
    }
  };

  return (
    <Card className="w-[160px] shadow-lg border-2 hover:shadow-xl transition-shadow">
      <CardContent className="p-3">
        <Handle type="target" position={Position.Top} className="w-2 h-2" />
        
        <div className="flex items-center gap-2 mb-2">
          <Users className="w-4 h-4 text-primary" />
          <div className={`w-2 h-2 rounded-full ${getStatusColor(status)}`} />
        </div>

        <h3 className="font-semibold text-sm mb-1">{activity}</h3>
        <p className="text-xs text-muted-foreground">{platform}</p>

        <Handle type="source" position={Position.Bottom} className="w-2 h-2" />
      </CardContent>
    </Card>
  );
};

export const GoalNode = ({ data }) => {
  const { goal, timeline, priority = "medium" } = data;
  
  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high": return "bg-red-500";
      case "medium": return "bg-yellow-500";
      case "low": return "bg-green-500";
      default: return "bg-gray-400";
    }
  };

  return (
    <Card className="w-[220px] shadow-lg border-2 hover:shadow-xl transition-shadow bg-gradient-to-br from-primary/5 to-secondary/5">
      <CardContent className="p-4">
        <Handle type="target" position={Position.Top} className="w-2 h-2" />
        
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="w-5 h-5 text-primary" />
          <div className={`w-2 h-2 rounded-full ${getPriorityColor(priority)}`} />
        </div>

        <h3 className="font-semibold text-base mb-2">{goal}</h3>
        {timeline && (
          <Badge variant="outline" className="text-xs">
            {timeline}
          </Badge>
        )}

        <Handle type="source" position={Position.Bottom} className="w-2 h-2" />
      </CardContent>
    </Card>
  );
};

// Export node types for React Flow
export const nodeTypes = {
  weekNode: WeekNode,
  skillNode: SkillNode,
  projectNode: ProjectNode,
  certificationNode: CertificationNode,
  networkingNode: NetworkingNode,
  goalNode: GoalNode,
};
