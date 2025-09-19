"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { requestRoadmap } from "@/actions/growth";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DemoWorkflow from "./_components/demo-workflow-enhanced";
import WorkflowGenerator from "./_components/workflow-generator-enhanced";

export default function CareerWorkflowGeneratorPage() {
  const router = useRouter();
  const [role, setRole] = useState("");
  const [industry, setIndustry] = useState("");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const trimmedRole = role.trim();
    if (!trimmedRole) {
      setError("Please enter a target role.");
      return;
    }
    startTransition(async () => {
      try {
        const res = await requestRoadmap(trimmedRole, industry.trim());
        if (res?.ok && res?.roadmapId) {
          router.push(`/growth/roadmap/${res.roadmapId}`);
        } else {
          setError("Failed to queue generation. Try again.");
        }
      } catch (e) {
        setError(e?.message || "Something went wrong");
      }
    });
  };

  return (
    <div className="container mx-auto px-4 pb-24 pt-28 max-w-6xl">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold mb-2">Career Workflow Generator</h1>
        <p className="text-muted-foreground">
          Generate a 12-week, step-by-step workflow tailored to your target role and industry with interactive React Flow visualization.
        </p>
      </div>

      <Tabs defaultValue="generator" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="generator">Generate Workflow</TabsTrigger>
          <TabsTrigger value="demo">Interactive Demo</TabsTrigger>
        </TabsList>

        <TabsContent value="generator" className="space-y-6">
          <Card className="p-6 max-w-2xl mx-auto">
            <form onSubmit={onSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="role">Target role</Label>
                <Input
                  id="role"
                  placeholder="e.g., Frontend Engineer"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  disabled={isPending}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="industry">Industry (optional)</Label>
                <Input
                  id="industry"
                  placeholder="e.g., FinTech"
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  disabled={isPending}
                />
              </div>
              {error ? (
                <div className="text-sm text-destructive">{error}</div>
              ) : null}
              <div className="flex gap-2">
                <Button type="submit" disabled={isPending}>
                  {isPending ? "Generating…" : "Generate Workflow"}
                </Button>
              </div>
            </form>
          </Card>
        </TabsContent>

        <TabsContent value="demo" className="space-y-6">
          <DemoWorkflow />
        </TabsContent>
      </Tabs>
    </div>
  );
}


