// Workflow validation and auto-connection utilities
export const validateWorkflow = (roadmap) => {
  const issues = [];
  const suggestions = [];

  // Check if roadmap has required structure
  if (!roadmap.steps || !Array.isArray(roadmap.steps)) {
    issues.push("Missing or invalid steps array");
    return { isValid: false, issues, suggestions };
  }

  // Check week sequence
  const weeks = roadmap.steps.map(step => step.week).sort((a, b) => a - b);
  for (let i = 0; i < weeks.length - 1; i++) {
    if (weeks[i + 1] - weeks[i] !== 1) {
      issues.push(`Missing week between ${weeks[i]} and ${weeks[i + 1]}`);
    }
  }

  // Check for isolated elements
  const hasSkills = roadmap.recommendedSkills && roadmap.recommendedSkills.length > 0;
  const hasProjects = roadmap.projects && roadmap.projects.length > 0;
  const hasCertifications = roadmap.certifications && roadmap.certifications.length > 0;

  if (hasSkills && !hasProjects) {
    suggestions.push("Add projects to apply the recommended skills");
  }

  if (hasCertifications && !hasSkills) {
    suggestions.push("Add prerequisite skills for certifications");
  }

  return {
    isValid: issues.length === 0,
    issues,
    suggestions
  };
};

export const autoConnectWorkflow = (roadmap) => {
  const connections = [];

  // Connect weeks in sequence
  if (roadmap.steps && roadmap.steps.length > 0) {
    const sortedWeeks = roadmap.steps
      .map(step => ({ week: step.week, id: `week-${step.week}` }))
      .sort((a, b) => a.week - b.week);

    for (let i = 0; i < sortedWeeks.length - 1; i++) {
      connections.push({
        id: `edge-week-${sortedWeeks[i].week}-to-${sortedWeeks[i + 1].week}`,
        source: sortedWeeks[i].id,
        target: sortedWeeks[i + 1].id,
        type: "smoothstep",
        animated: true,
        style: { stroke: "#6366f1", strokeWidth: 2 }
      });
    }
  }

  // Connect skills to projects
  if (roadmap.recommendedSkills && roadmap.projects) {
    roadmap.recommendedSkills.forEach((skill, skillIndex) => {
      roadmap.projects.forEach((project, projectIndex) => {
        // Simple heuristic: connect skills to projects in the same week range
        const skillWeek = skill.week || Math.floor(skillIndex / 2) + 1;
        const projectWeek = project.week || Math.floor(projectIndex / 2) + 1;
        
        if (Math.abs(skillWeek - projectWeek) <= 2) {
          connections.push({
            id: `edge-skill-${skillIndex}-to-project-${projectIndex}`,
            source: `skill-${skillIndex}`,
            target: `project-${projectIndex}`,
            type: "smoothstep",
            style: { stroke: "#f59e0b", strokeWidth: 1 }
          });
        }
      });
    });
  }

  // Connect certifications to prerequisite skills
  if (roadmap.certifications && roadmap.recommendedSkills) {
    roadmap.certifications.forEach((cert, certIndex) => {
      roadmap.recommendedSkills.forEach((skill, skillIndex) => {
        // Connect if skill is prerequisite for certification
        if (cert.prerequisites && cert.prerequisites.includes(skill.skill)) {
          connections.push({
            id: `edge-skill-${skillIndex}-to-cert-${certIndex}`,
            source: `skill-${skillIndex}`,
            target: `cert-${certIndex}`,
            type: "smoothstep",
            style: { stroke: "#ef4444", strokeWidth: 1 }
          });
        }
      });
    });
  }

  return connections;
};

export const enhanceWorkflowStructure = (roadmap) => {
  const enhanced = { ...roadmap };

  // Ensure all elements have proper structure
  if (enhanced.recommendedSkills) {
    enhanced.recommendedSkills = enhanced.recommendedSkills.map((skill, index) => {
      if (typeof skill === 'string') {
        return {
          skill: skill,
          level: index < 3 ? "Advanced" : index < 6 ? "Intermediate" : "Beginner",
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

export const generateWorkflowConnections = (roadmap) => {
  const connections = [];

  // Connect goal to first week
  if (roadmap.steps && roadmap.steps.length > 0) {
    connections.push({
      id: "edge-goal-to-week-1",
      source: "goal",
      target: `week-${roadmap.steps[0].week}`,
      type: "smoothstep",
      animated: true,
      style: { stroke: "#6366f1", strokeWidth: 2 }
    });
  }

  // Connect weeks in sequence
  if (roadmap.steps && roadmap.steps.length > 1) {
    for (let i = 0; i < roadmap.steps.length - 1; i++) {
      connections.push({
        id: `edge-week-${roadmap.steps[i].week}-to-${roadmap.steps[i + 1].week}`,
        source: `week-${roadmap.steps[i].week}`,
        target: `week-${roadmap.steps[i + 1].week}`,
        type: "smoothstep",
        animated: true,
        style: { stroke: "#6366f1", strokeWidth: 2 }
      });
    }
  }

  // Connect skills to relevant weeks
  if (roadmap.recommendedSkills) {
    roadmap.recommendedSkills.forEach((skill, index) => {
      const skillWeek = skill.week || Math.min(12, Math.floor(index / 2) + 1);
      const weekId = `week-${skillWeek}`;
      
      connections.push({
        id: `edge-week-${skillWeek}-to-skill-${index}`,
        source: weekId,
        target: `skill-${index}`,
        type: "smoothstep",
        style: { stroke: "#f59e0b", strokeWidth: 1 }
      });
    });
  }

  // Connect projects to relevant weeks
  if (roadmap.projects) {
    roadmap.projects.forEach((project, index) => {
      const projectWeek = project.week || Math.min(12, Math.floor(index / 2) + 1);
      const weekId = `week-${projectWeek}`;
      
      connections.push({
        id: `edge-week-${projectWeek}-to-project-${index}`,
        source: weekId,
        target: `project-${index}`,
        type: "smoothstep",
        style: { stroke: "#8b5cf6", strokeWidth: 1 }
      });
    });
  }

  // Connect certifications to relevant weeks
  if (roadmap.certifications) {
    roadmap.certifications.forEach((cert, index) => {
      const certWeek = cert.week || Math.min(12, Math.floor(index / 2) + 1);
      const weekId = `week-${certWeek}`;
      
      connections.push({
        id: `edge-week-${certWeek}-to-cert-${index}`,
        source: weekId,
        target: `cert-${index}`,
        type: "smoothstep",
        style: { stroke: "#ef4444", strokeWidth: 1 }
      });
    });
  }

  // Connect networking to relevant weeks
  if (roadmap.networking) {
    roadmap.networking.forEach((activity, index) => {
      const activityWeek = activity.week || Math.min(12, Math.floor(index / 2) + 1);
      const weekId = `week-${activityWeek}`;
      
      connections.push({
        id: `edge-week-${activityWeek}-to-networking-${index}`,
        source: weekId,
        target: `networking-${index}`,
        type: "smoothstep",
        style: { stroke: "#06b6d4", strokeWidth: 1 }
      });
    });
  }

  return connections;
};
