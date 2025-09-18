// /app/dashboard/bots/page.tsx

import { Metadata } from "next";
import AgentsStats from "@/components/agents/agents-stats";
import { AgentsLists } from "@/components/agents/agents-lists";
import { getAgents, getAgentsStatistic } from "@/lib/actions/agents";
import { CreateNewAgent } from "@/components/agents/create-new-agents";

export const metadata: Metadata = {
  title: "My Agents - Dashboard",
  description: "Manage and configure your AI agents",
};

export default async function AgentsPage() {
  const [stats, agents] = await Promise.all([
    getAgentsStatistic(),
    getAgents(),
  ]);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">My Bots</h1>
          <p className="text-muted-foreground">
            Manage and configure your AI chatbots
          </p>
        </div>
        <CreateNewAgent />
      </div>

      <AgentsStats stats={stats.data!} />

      <AgentsLists agents={agents.data} />
    </div>
  );
}
