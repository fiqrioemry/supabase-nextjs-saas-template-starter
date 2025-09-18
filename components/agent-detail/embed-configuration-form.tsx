import React from "react";
import {
  Card,
  CardTitle,
  CardContent,
  CardHeader,
  CardDescription,
} from "@/components/ui/card";

import {
  Select,
  SelectItem,
  SelectValue,
  SelectTrigger,
  SelectContent,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Copy, CheckCircle2 } from "lucide-react";
import { InfoMessageBox } from "@/components/shared/ResponseMessage";
import { Switch } from "@radix-ui/react-switch";

export function EmbedConfigurationForm({ agent }: { agent: any }) {
  const [embedCopied, setEmbedCopied] = React.useState(false);

  const handleCopyEmbed = () => {
    navigator.clipboard.writeText(agent.embed_code);
    setEmbedCopied(true);
    setTimeout(() => setEmbedCopied(false), 2000);
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle>Embed Your Chatbot</CardTitle>
        <CardDescription>
          Copy the code below and paste it into your website to embed the
          chatbot
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Embed Code</Label>
          <div className="relative">
            <pre className="bg-gray-50 p-4 rounded-lg text-sm overflow-x-auto">
              <code>{agent.embed_code}</code>
            </pre>
            <Button
              variant="outline"
              size="sm"
              className="absolute top-2 right-2"
              onClick={handleCopyEmbed}
            >
              {embedCopied ? (
                <CheckCircle2 className="h-4 w-4 mr-2" />
              ) : (
                <Copy className="h-4 w-4 mr-2" />
              )}
              {embedCopied ? "Copied!" : "Copy"}
            </Button>
          </div>
        </div>

        <InfoMessageBox
          message="Place this code just before the closing &lt;/body&gt; tag in your
            HTML. The chatbot will automatically appear on your website."
        />

        <div className="space-y-4">
          <h4 className="font-medium">Customization Options</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="widget-position">Widget Position</Label>
              <Select defaultValue="bottom-right">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bottom-right">Bottom Right</SelectItem>
                  <SelectItem value="bottom-left">Bottom Left</SelectItem>
                  <SelectItem value="top-right">Top Right</SelectItem>
                  <SelectItem value="top-left">Top Left</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="widget-theme">Theme</Label>
              <Select defaultValue="light">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="auto">Auto</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch id="auto-open" />

            <Label htmlFor="auto-open">Auto-open on page load</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Switch id="show-branding" defaultChecked />
            <Label htmlFor="show-branding">
              Show "Powered by YourApp" branding
            </Label>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
