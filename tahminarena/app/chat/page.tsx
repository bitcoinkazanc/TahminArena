import PageContainer from "@/components/layout/PageContainer";
import ChatBox from "@/components/chat/ChatBox";
import type { ChatMessage } from "@/types/chat";

const demoMessages: ChatMessage[] = [
  {
    id: "message-1",
    userId: "demo-user-1",
    username: "futbolsever",
    displayName: "Futbolsever",
    avatarUrl: null,
    text: "Bugünkü maçlar hakkında ne düşünüyorsunuz?",
    type: "text",
    predictionId: null,
    createdAt: new Date(
      Date.now() - 10 * 60 * 1000,
    ).toISOString(),
    updatedAt: new Date(
      Date.now() - 10 * 60 * 1000,
    ).toISOString(),
  },
  {
    id: "message-2",
    userId: "demo-user-2",
    username: "tahminci",
    displayName: "Tahminci",
    avatarUrl: null,
    text: "Ben ev sahibi tarafındayım. Özellikle son maç performansı dikkat çekici.",
    type: "text",
    predictionId: null,
    createdAt: new Date(
      Date.now() - 5 * 60 * 1000,
    ).toISOString(),
    updatedAt: new Date(
      Date.now() - 5 * 60 * 1000,
    ).toISOString(),
  },
];

export default function ChatPage() {
  return (
    <main>
      <PageContainer>
        <section>
          <h2>💬 Sohbet</h2>

          <p>
            Futbol gündemini toplulukla konuş.
          </p>
        </section>

        <ChatBox
          initialMessages={demoMessages}
          currentUserId="demo-current-user"
        />
      </PageContainer>
    </main>
  );
}