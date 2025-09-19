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

// Custom node types for different workflow stages
export const WeekNode = ({ data }) => {
  const { week, focus, tasks, resources, milestones, status = "pending" } = data;
  
  const getStatusColor = (status) => {
    switch (status) {
      case "completed": return "bg-green-500";
      case "in-progress": return "bg-blue-500";
      case "pending": return "bg-gray-400";
      default: return "bg-gray-400";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed": return <CheckCircle2 className="w-4 h-4" />;
      case "in-progress": return <Clock className="w-4 h-4" />;
      case "pending": return <Calendar className="w-4 h-4" />;
      default: return <Calendar className="w-4 h-4" />;
    }
  };

  return (
    <Card className="min-w-[300px] max-w-[400px] shadow-lg border-2 hover:shadow-xl transition-shadow">
      <CardContent className="p-4">
        <Handle type="target" position={Position.Top} className="w-3 h-3" />
        
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              Week {week}
            </Badge>
            <div className={`w-2 h-2 rounded-full ${getStatusColor(status)}`} />
          </div>
          {getStatusIcon(status)}
        </div>

        <h3 className="font-semibold text-lg mb-2 text-primary">{focus}</h3>

        {tasks && tasks.length > 0 && (
          <div className="mb-3">
            <div className="flex items-center gap-1 mb-1">
              <Target className="w-3 h-3 text-muted-foreground" />
              <span className="text-xs font-medium text-muted-foreground">Tasks</span>
            </div>
            <ul className="text-xs space-y-1 ml-4">
              {tasks.slice(0, 3).map((task, index) => (
                <li key={index} className="text-muted-foreground">• {task}</li>
              ))}
              {tasks.length > 3 && (
                <li className="text-muted-foreground">• +{tasks.length - 3} more...</li>
              )}
            </ul>
          </div>
        )}

        {resources && resources.length > 0 && (
          <div className="mb-3">
            <div className="flex items-center gap-1 mb-1">
              <BookOpen className="w-3 h-3 text-muted-foreground" />
              <span className="text-xs font-medium text-muted-foreground">Resources</span>
            </div>
            <ul className="text-xs space-y-1 ml-4">
              {resources.slice(0, 2).map((resource, index) => (
                <li key={index} className="text-muted-foreground">• {resource}</li>
              ))}
              {resources.length > 2 && (
                <li className="text-muted-foreground">• +{resources.length - 2} more...</li>
              )}
            </ul>
          </div>
        )}

        {milestones && milestones.length > 0 && (
          <div>
            <div className="flex items-center gap-1 mb-1">
              <Award className="w-3 h-3 text-muted-foreground" />
              <span className="text-xs font-medium text-muted-foreground">Milestones</span>
            </div>
            <ul className="text-xs space-y-1 ml-4">
              {milestones.slice(0, 2).map((milestone, index) => (
                <li key={index} className="text-muted-foreground">• {milestone}</li>
              ))}
              {milestones.length > 2 && (
                <li className="text-muted-foreground">• +{milestones.length - 2} more...</li>
              )}
            </ul>
          </div>
        )}

        <Handle type="source" position={Position.Bottom} className="w-3 h-3" />
      </CardContent>
    </Card>
  );
};

export const SkillNode = ({ data }) => {
  const { skill, level, category } = data;
  
  return (
    <Card className="min-w-[200px] shadow-lg border-2 hover:shadow-xl transition-shadow">
      <CardContent className="p-3">
        <Handle type="target" position={Position.Top} className="w-3 h-3" />
        
        <div className="flex items-center gap-2 mb-2">
          <Code className="w-4 h-4 text-primary" />
          <Badge variant="secondary" className="text-xs">{category}</Badge>
        </div>

        <h3 className="font-semibold text-sm mb-1">{skill}</h3>
        
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Level:</span>
          <Badge 
            variant={level === "Advanced" ? "default" : level === "Intermediate" ? "secondary" : "outline"}
            className="text-xs"
          >
            {level}
          </Badge>
        </div>

        <Handle type="source" position={Position.Bottom} className="w-3 h-3" />
      </CardContent>
    </Card>
  );
};

export const ProjectNode = ({ data }) => {
  const { project, description, technologies, status = "planned" } = data;
  
  const getStatusColor = (status) => {
    switch (status) {
      case "completed": return "bg-green-500";
      case "in-progress": return "bg-blue-500";
      case "planned": return "bg-yellow-500";
      default: return "bg-gray-400";
    }
  };

  return (
    <Card className="min-w-[250px] shadow-lg border-2 hover:shadow-xl transition-shadow">
      <CardContent className="p-3">
        <Handle type="target" position={Position.Top} className="w-3 h-3" />
        
        <div className="flex items-center gap-2 mb-2">
          <Briefcase className="w-4 h-4 text-primary" />
          <div className={`w-2 h-2 rounded-full ${getStatusColor(status)}`} />
        </div>

        <h3 className="font-semibold text-sm mb-1">{project}</h3>
        <p className="text-xs text-muted-foreground mb-2">{description}</p>
        
        {technologies && technologies.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {technologies.slice(0, 3).map((tech, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {tech}
              </Badge>
            ))}
            {technologies.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{technologies.length - 3}
              </Badge>
            )}
          </div>
        )}

        <Handle type="source" position={Position.Bottom} className="w-3 h-3" />
      </CardContent>
    </Card>
  );
};

export const CertificationNode = ({ data }) => {
  const { certification, provider, duration, status = "planned" } = data;
  
  const getStatusColor = (status) => {
    switch (status) {
      case "completed": return "bg-green-500";
      case "in-progress": return "bg-blue-500";
      case "planned": return "bg-yellow-500";
      default: return "bg-gray-400";
    }
  };

  return (
    <Card className="min-w-[220px] shadow-lg border-2 hover:shadow-xl transition-shadow">
      <CardContent className="p-3">
        <Handle type="target" position={Position.Top} className="w-3 h-3" />
        
        <div className="flex items-center gap-2 mb-2">
          <Award className="w-4 h-4 text-primary" />
          <div className={`w-2 h-2 rounded-full ${getStatusColor(status)}`} />
        </div>

        <h3 className="font-semibold text-sm mb-1">{certification}</h3>
        <p className="text-xs text-muted-foreground mb-1">{provider}</p>
        {duration && (
          <Badge variant="outline" className="text-xs">
            {duration}
          </Badge>
        )}

        <Handle type="source" position={Position.Bottom} className="w-3 h-3" />
      </CardContent>
    </Card>
  );
};

export const NetworkingNode = ({ data }) => {
  const { activity, type, platform, status = "planned" } = data;
  
  const getStatusColor = (status) => {
    switch (status) {
      case "completed": return "bg-green-500";
      case "in-progress": return "bg-blue-500";
      case "planned": return "bg-yellow-500";
      default: return "bg-gray-400";
    }
  };

  return (
    <Card className="min-w-[200px] shadow-lg border-2 hover:shadow-xl transition-shadow">
      <CardContent className="p-3">
        <Handle type="target" position={Position.Top} className="w-3 h-3" />
        
        <div className="flex items-center gap-2 mb-2">
          <Users className="w-4 h-4 text-primary" />
          <div className={`w-2 h-2 rounded-full ${getStatusColor(status)}`} />
        </div>

        <h3 className="font-semibold text-sm mb-1">{activity}</h3>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs">{type}</Badge>
          {platform && (
            <Badge variant="secondary" className="text-xs">{platform}</Badge>
          )}
        </div>

        <Handle type="source" position={Position.Bottom} className="w-3 h-3" />
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
    <Card className="min-w-[250px] shadow-lg border-2 hover:shadow-xl transition-shadow bg-gradient-to-br from-primary/5 to-secondary/5">
      <CardContent className="p-4">
        <Handle type="target" position={Position.Top} className="w-3 h-3" />
        
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

        <Handle type="source" position={Position.Bottom} className="w-3 h-3" />
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
