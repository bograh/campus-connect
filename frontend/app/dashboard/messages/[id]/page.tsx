import { ChatInterface } from "@/components/chat/chat-interface";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";

interface ChatPageProps {
  params: {
    id: string;
  };
}

export default function ChatPage({ params }: ChatPageProps) {
  return (
    <DashboardLayout>
      <ChatInterface conversationId={params.id} />
    </DashboardLayout>
  );
}
