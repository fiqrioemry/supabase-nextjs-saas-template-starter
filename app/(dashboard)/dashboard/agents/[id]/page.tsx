import React from "react";
import { Metadata } from "next";
import { getAgentDetail } from "@/lib/actions/agents";
import { AgentDetailDisplay } from "@/components/agent-detail/agent-detail-display";

export const metadata: Metadata = {
  title: "Agent Detail - Dashboard",
  description: "Manage and configure your AI chatbots",
};

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await getAgentDetail(id);
  return <AgentDetailDisplay agent={result.data} />;
}
