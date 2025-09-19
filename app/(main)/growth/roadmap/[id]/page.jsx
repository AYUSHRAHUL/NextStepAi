import React from "react";
import { notFound } from "next/navigation";
import { db } from "@/lib/prisma";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import WorkflowGenerator from "../_components/workflow-generator-enhanced";

export default async function RoadmapDetailPage({ params }) {
  const { id } = await params;
  if (!id) return notFound();

  // Mongo ObjectId strings are stored as strings in Prisma model ids
  let roadmap = null;
  try {
    roadmap = await db.roadmap.findUnique({ where: { id } });
  } catch (e) {
    roadmap = null;
  }

  if (!roadmap) {
    return (
      <div className="container mx-auto px-4 pb-24 pt-28 max-w-3xl">
        <h1 className="text-2xl font-semibold mb-4">Workflow Not Found</h1>
        <p className="text-muted-foreground mb-6">We couldn't find that workflow. It may still be generating.</p>
        <Link href="/growth/roadmap">
          <Button variant="outline">Back to Generator</Button>
        </Link>
      </div>
    );
  }

  const isPending = roadmap.status !== "completed";
  const steps = Array.isArray(roadmap.steps) ? roadmap.steps : [];
  const certifications = Array.isArray(roadmap.certifications) ? roadmap.certifications : [];
  const projects = Array.isArray(roadmap.projects) ? roadmap.projects : [];
  const networking = Array.isArray(roadmap.networking) ? roadmap.networking : [];
  const blocks3d = Array.isArray(roadmap.blocks3d) ? roadmap.blocks3d : [];

  return (
    <div className="container mx-auto px-4 pb-24 pt-28 max-w-3xl">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">{roadmap.title || "Career Workflow"}</h1>
        <p className="text-muted-foreground">{roadmap.content || (isPending ? "Generating your workflow..." : "")}</p>
      </div>

      {isPending ? (
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="h-3 w-3 rounded-full bg-primary animate-pulse" />
            <div>We're generating your workflow. This usually takes under a minute.</div>
          </div>
          <div className="mt-4">
            <Link href={`/growth/roadmap/${id}`}>
              <Button variant="outline" size="sm">Refresh</Button>
            </Link>
          </div>
        </Card>
      ) : (
        <Tabs defaultValue="workflow" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="workflow">Interactive Workflow</TabsTrigger>
            <TabsTrigger value="timeline">Timeline View</TabsTrigger>
            <TabsTrigger value="details">Detailed View</TabsTrigger>
          </TabsList>

          <TabsContent value="workflow" className="space-y-4">
            <WorkflowGenerator roadmap={roadmap} />
          </TabsContent>

          <TabsContent value="timeline" className="space-y-8">
            {blocks3d.length ? (
              <div className="relative w-full h-[340px] rounded-xl bg-gradient-to-br from-muted to-background overflow-hidden">
                {blocks3d.map((b, i) => {
                  const left = Math.max(0, Math.min(100, Number(b.x || 0)));
                  const top = Math.max(0, Math.min(100, Number(b.y || 0)));
                  const width = Math.max(8, Math.min(28, Number(b.width || 12)));
                  const height = Math.max(8, Math.min(28, Number(b.height || 12)));
                  const depth = Math.max(6, Math.min(18, Number(b.depth || 10)));
                  const z = Math.max(0, Math.min(100, Number(b.z || 0)));
                  const color = typeof b.color === "string" ? b.color : "#6366f1";
                  const boxStyle = { left: `${left}%`, top: `${top}%`, width: `${width * 8}px`, height: `${height * 8}px`, zIndex: 100 + z };
                  return (
                    <div key={i} className="absolute" style={boxStyle}>
                      <div className="relative rounded-lg shadow-lg" style={{ backgroundColor: color, transform: `translateZ(${depth}px) rotateX(6deg) rotateY(-8deg)`, boxShadow: `0 ${depth}px ${depth * 2}px rgba(0,0,0,0.25)` }}>
                        <div className="p-3 text-xs font-medium text-white/90">Week {b.week ?? "-"}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : null}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="p-4">
                <div className="text-sm font-semibold mb-2">Certifications</div>
                {certifications.length ? (
                  <ul className="list-disc ml-5 space-y-1 text-sm">
                    {certifications.map((c, i) => (<li key={i}>{c}</li>))}
                  </ul>
                ) : (
                  <div className="text-sm text-muted-foreground">No certifications listed.</div>
                )}
              </Card>
              <Card className="p-4">
                <div className="text-sm font-semibold mb-2">Projects</div>
                {projects.length ? (
                  <ul className="list-disc ml-5 space-y-1 text-sm">
                    {projects.map((p, i) => (<li key={i}>{p}</li>))}
                  </ul>
                ) : (
                  <div className="text-sm text-muted-foreground">No projects listed.</div>
                )}
              </Card>
              <Card className="p-4">
                <div className="text-sm font-semibold mb-2">Networking</div>
                {networking.length ? (
                  <ul className="list-disc ml-5 space-y-1 text-sm">
                    {networking.map((n, i) => (<li key={i}>{n}</li>))}
                  </ul>
                ) : (
                  <div className="text-sm text-muted-foreground">No networking items listed.</div>
                )}
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="details" className="space-y-4">
            {steps.length === 0 ? (
              <Card className="p-6">No steps found.</Card>
            ) : (
              steps.map((week, idx) => (
                <Card key={idx} className="p-6">
                  <div className="flex items-baseline justify-between">
                    <h2 className="text-lg font-semibold">Week {week.week}: {week.focus}</h2>
                  </div>
                  {Array.isArray(week.tasks) && week.tasks.length ? (
                    <div className="mt-3">
                      <div className="text-sm font-medium mb-1">Tasks</div>
                      <ul className="list-disc ml-5 space-y-1">
                        {week.tasks.map((t, i) => (
                          <li key={i} className="text-sm">{t}</li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                  {Array.isArray(week.resources) && week.resources.length ? (
                    <div className="mt-3">
                      <div className="text-sm font-medium mb-1">Resources</div>
                      <ul className="list-disc ml-5 space-y-1">
                        {week.resources.map((r, i) => (
                          <li key={i} className="text-sm">{r}</li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                  {Array.isArray(week.milestones) && week.milestones.length ? (
                    <div className="mt-3">
                      <div className="text-sm font-medium mb-1">Milestones</div>
                      <ul className="list-disc ml-5 space-y-1">
                        {week.milestones.map((m, i) => (
                          <li key={i} className="text-sm">{m}</li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}


