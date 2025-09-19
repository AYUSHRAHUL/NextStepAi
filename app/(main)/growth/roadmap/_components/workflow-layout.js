// Improved workflow layout utilities for better positioning and no overlapping

export const createWorkflowLayout = (roadmap) => {
  const nodes = [];
  const edges = [];
  
  // Enhanced roadmap structure
  const enhancedRoadmap = enhanceWorkflowStructure(roadmap);
  
  // Layout constants
  const NODE_WIDTH = 200;
  const NODE_HEIGHT = 120;
  const HORIZONTAL_SPACING = 250;
  const VERTICAL_SPACING = 200;
  const LAYER_HEIGHT = 300;

  // Add goal node at the top center
  if (enhancedRoadmap.targetRole) {
    nodes.push({
      id: "goal",
      type: "goalNode",
      position: { x: 400, y: 50 },
      data: {
        goal: `Become a ${enhancedRoadmap.targetRole}`,
        timeline: "12 weeks",
        priority: "high"
      }
    });
  }

  // Layout weeks in a clean grid pattern
  if (enhancedRoadmap.steps && Array.isArray(enhancedRoadmap.steps)) {
    const weeks = enhancedRoadmap.steps.sort((a, b) => a.week - b.week);
    const weeksPerRow = 4;
    
    weeks.forEach((week, index) => {
      const row = Math.floor(index / weeksPerRow);
      const col = index % weeksPerRow;
      
      const node = {
        id: `week-${week.week}`,
        type: "weekNode",
        position: { 
          x: 100 + col * HORIZONTAL_SPACING, 
          y: 200 + row * VERTICAL_SPACING 
        },
        data: {
          week: week.week,
          focus: week.focus,
          tasks: week.tasks || [],
          status: index === 0 ? "in-progress" : "pending"
        }
      };
      nodes.push(node);
    });

    // Connect weeks in sequence
    for (let i = 0; i < weeks.length - 1; i++) {
      edges.push({
        id: `edge-week-${weeks[i].week}-to-${weeks[i + 1].week}`,
        source: `week-${weeks[i].week}`,
        target: `week-${weeks[i + 1].week}`,
        type: "smoothstep",
        animated: true,
        style: { stroke: "#6366f1", strokeWidth: 2 }
      });
    }

    // Connect goal to first week
    if (weeks.length > 0) {
      edges.push({
        id: "edge-goal-to-week-1",
        source: "goal",
        target: `week-${weeks[0].week}`,
        type: "smoothstep",
        animated: true,
        style: { stroke: "#6366f1", strokeWidth: 2 }
      });
    }
  }

  // Layout skills in a clean row below weeks
  if (enhancedRoadmap.recommendedSkills && Array.isArray(enhancedRoadmap.recommendedSkills)) {
    const skillsPerRow = 6;
    const skillStartY = 600;
    
    enhancedRoadmap.recommendedSkills.forEach((skill, index) => {
      const row = Math.floor(index / skillsPerRow);
      const col = index % skillsPerRow;
      
      const node = {
        id: `skill-${index}`,
        type: "skillNode",
        position: { 
          x: 50 + col * 180, 
          y: skillStartY + row * 150 
        },
        data: {
          skill: skill.skill || skill,
          level: skill.level || (index < 2 ? "Advanced" : index < 4 ? "Intermediate" : "Beginner"),
          category: skill.category || "Technical"
        }
      };
      nodes.push(node);
    });
  }

  // Layout projects on the right side
  if (enhancedRoadmap.projects && Array.isArray(enhancedRoadmap.projects)) {
    const projectStartX = 1200;
    const projectStartY = 200;
    
    enhancedRoadmap.projects.forEach((project, index) => {
      const node = {
        id: `project-${index}`,
        type: "projectNode",
        position: { 
          x: projectStartX, 
          y: projectStartY + index * 180 
        },
        data: {
          project: project.name || project,
          technologies: project.technologies || ["React", "Node.js"],
          status: "planned"
        }
      };
      nodes.push(node);
    });
  }

  // Layout certifications below projects
  if (enhancedRoadmap.certifications && Array.isArray(enhancedRoadmap.certifications)) {
    const certStartX = 1200;
    const certStartY = 500;
    
    enhancedRoadmap.certifications.forEach((cert, index) => {
      const node = {
        id: `cert-${index}`,
        type: "certificationNode",
        position: { 
          x: certStartX + (index % 2) * 200, 
          y: certStartY + Math.floor(index / 2) * 150 
        },
        data: {
          certification: cert.name || cert,
          provider: cert.provider || "Industry Standard",
          status: "planned"
        }
      };
      nodes.push(node);
    });
  }

  // Layout networking activities at the bottom
  if (enhancedRoadmap.networking && Array.isArray(enhancedRoadmap.networking)) {
    const networkingStartY = 800;
    const networkingPerRow = 5;
    
    enhancedRoadmap.networking.forEach((activity, index) => {
      const row = Math.floor(index / networkingPerRow);
      const col = index % networkingPerRow;
      
      const node = {
        id: `networking-${index}`,
        type: "networkingNode",
        position: { 
          x: 50 + col * 180, 
          y: networkingStartY + row * 120 
        },
        data: {
          activity: activity.activity || activity,
          platform: activity.platform || "LinkedIn",
          status: "planned"
        }
      };
      nodes.push(node);
    });
  }

  // Create smart connections between related elements
  createSmartConnections(nodes, edges, enhancedRoadmap);

  return { nodes, edges };
};

const createSmartConnections = (nodes, edges, roadmap) => {
  // Connect skills to relevant weeks
  const weekNodes = nodes.filter(node => node.type === "weekNode");
  const skillNodes = nodes.filter(node => node.type === "skillNode");
  
  skillNodes.forEach((skillNode, skillIndex) => {
    const skillWeek = roadmap.recommendedSkills?.[skillIndex]?.week || Math.min(12, Math.floor(skillIndex / 2) + 1);
    const weekNode = weekNodes.find(week => week.data.week === skillWeek);
    
    if (weekNode) {
      edges.push({
        id: `edge-week-${skillWeek}-to-skill-${skillIndex}`,
        source: weekNode.id,
        target: skillNode.id,
        type: "smoothstep",
        style: { stroke: "#f59e0b", strokeWidth: 1 }
      });
    }
  });

  // Connect projects to relevant weeks
  const projectNodes = nodes.filter(node => node.type === "projectNode");
  
  projectNodes.forEach((projectNode, projectIndex) => {
    const projectWeek = roadmap.projects?.[projectIndex]?.week || Math.min(12, Math.floor(projectIndex / 2) + 1);
    const weekNode = weekNodes.find(week => week.data.week === projectWeek);
    
    if (weekNode) {
      edges.push({
        id: `edge-week-${projectWeek}-to-project-${projectIndex}`,
        source: weekNode.id,
        target: projectNode.id,
        type: "smoothstep",
        style: { stroke: "#8b5cf6", strokeWidth: 1 }
      });
    }
  });

  // Connect certifications to relevant weeks
  const certNodes = nodes.filter(node => node.type === "certificationNode");
  
  certNodes.forEach((certNode, certIndex) => {
    const certWeek = roadmap.certifications?.[certIndex]?.week || Math.min(12, Math.floor(certIndex / 2) + 1);
    const weekNode = weekNodes.find(week => week.data.week === certWeek);
    
    if (weekNode) {
      edges.push({
        id: `edge-week-${certWeek}-to-cert-${certIndex}`,
        source: weekNode.id,
        target: certNode.id,
        type: "smoothstep",
        style: { stroke: "#ef4444", strokeWidth: 1 }
      });
    }
  });

  // Connect networking to relevant weeks
  const networkingNodes = nodes.filter(node => node.type === "networkingNode");
  
  networkingNodes.forEach((networkingNode, networkingIndex) => {
    const networkingWeek = roadmap.networking?.[networkingIndex]?.week || Math.min(12, Math.floor(networkingIndex / 2) + 1);
    const weekNode = weekNodes.find(week => week.data.week === networkingWeek);
    
    if (weekNode) {
      edges.push({
        id: `edge-week-${networkingWeek}-to-networking-${networkingIndex}`,
        source: weekNode.id,
        target: networkingNode.id,
        type: "smoothstep",
        style: { stroke: "#06b6d4", strokeWidth: 1 }
      });
    }
  });
};

const enhanceWorkflowStructure = (roadmap) => {
  const enhanced = { ...roadmap };

  // Ensure all elements have proper structure
  if (enhanced.recommendedSkills) {
    enhanced.recommendedSkills = enhanced.recommendedSkills.map((skill, index) => {
      if (typeof skill === 'string') {
        return {
          skill: skill,
          level: index < 2 ? "Advanced" : index < 4 ? "Intermediate" : "Beginner",
          category: "Technical",
          week: Math.min(12, Math.floor(index / 2) + 1),
          prerequisites: []
        };
      }
      return skill;
    });
  }

  if (enhanced.projects) {
    enhanced.projects = enhanced.projects.map((project, index) => {
      if (typeof project === 'string') {
        return {
          name: project,
          description: `Hands-on project to practice ${project.toLowerCase()}`,
          technologies: ["React", "Node.js", "MongoDB"],
          difficulty: index < 2 ? "Advanced" : index < 4 ? "Intermediate" : "Beginner",
          week: Math.min(12, Math.floor(index / 2) + 1),
          prerequisites: []
        };
      }
      return project;
    });
  }

  if (enhanced.certifications) {
    enhanced.certifications = enhanced.certifications.map((cert, index) => {
      if (typeof cert === 'string') {
        return {
          name: cert,
          provider: "Industry Standard",
          duration: "4-6 weeks",
          week: Math.min(12, Math.floor(index / 2) + 1),
          prerequisites: []
        };
      }
      return cert;
    });
  }

  if (enhanced.networking) {
    enhanced.networking = enhanced.networking.map((activity, index) => {
      if (typeof activity === 'string') {
        return {
          activity: activity,
          platform: "LinkedIn",
          type: "Professional",
          week: Math.min(12, Math.floor(index / 2) + 1)
        };
      }
      return activity;
    });
  }

  return enhanced;
};
