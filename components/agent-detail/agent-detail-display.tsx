// /app/dashboard/bots/[id]/page.tsx
"use client";

import {
  Save,
  Brain,
  Code,
  Settings,
  TestTube,
  ArrowLeft,
  MessageSquare,
} from "lucide-react";
import { useState } from "react";
import AgentTesting from "./agent-testing";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { GeneralInfoForm } from "./general-info-form";
import KnowledgeBaseForm from "./knowledge-base-form";
import { SystemPromptForm } from "./system-prompt-form";
import { EmbedConfigurationForm } from "./embed-configuration-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export interface Document {
  id: string;
  name: string;
  file_size: string;
  file_type?: string;
  uploaded_at: string;
  status: "processing" | "ready" | "error";
}

export interface AgentConfig {
  id: string;
  name: string;
  description: string;
  systemPrompt: string;
  model: string;
  temperature: number;
  status: "active" | "inactive";
  documents: Document[];
  embed_code: string;
}

export function AgentDetailDisplay({ agent }: { agent: AgentConfig }) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("general");

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Bots
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{agent.name}</h1>
            <p className="text-muted-foreground">{agent.description}</p>
          </div>
        </div>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="general">
            <Settings className="h-4 w-4 mr-2" />
            General
          </TabsTrigger>
          <TabsTrigger value="knowledge">
            <Brain className="h-4 w-4 mr-2" />
            Knowledge Base
          </TabsTrigger>
          <TabsTrigger value="prompt">
            <MessageSquare className="h-4 w-4 mr-2" />
            Prompt
          </TabsTrigger>
          <TabsTrigger value="embed">
            <Code className="h-4 w-4 mr-2" />
            Embed
          </TabsTrigger>
          <TabsTrigger value="testing">
            <TestTube className="h-4 w-4 mr-2" />
            Testing
          </TabsTrigger>
        </TabsList>

        {/* General Settings Tab */}
        <TabsContent value="general">
          <GeneralInfoForm data={agent} />
        </TabsContent>

        {/* Knowledge Base Tab */}
        <TabsContent value="knowledge">
          <KnowledgeBaseForm agent={agent} />
        </TabsContent>

        {/* System Prompt Tab */}
        <TabsContent value="prompt">
          <SystemPromptForm agent={agent} />
        </TabsContent>

        {/* Embed Code Tab */}
        <TabsContent value="embed">
          <EmbedConfigurationForm agent={agent} />
        </TabsContent>

        {/* Testing Tab */}
        <TabsContent value="testing">
          <AgentTesting agent={agent} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
