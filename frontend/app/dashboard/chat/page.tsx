"use client"
import { useChat } from "@ai-sdk/react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Send } from "lucide-react"
import PlayerCard from "@/components/dashboard/chat/player-card"

export default function ChatPage() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat()

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Sprit 11 Cricket Assistant</h1>

      <div className="flex-1 overflow-y-auto mb-4 space-y-4 p-4 rounded-lg border">
        {messages.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">Ask about cricket players, teams, or strategies!</div>
        ) : (
          messages.map((message) => (
            <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[80%] ${message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"} rounded-lg p-3`}
              >
                {message.role === "user" ? (
                  <div>{message.content}</div>
                ) : (
                  <div>
                    {message.content.includes("PLAYER_CARD:") ? (
                      <>
                        <PlayerCard player={extractPlayerData(message.content)} />
                        <div className="mt-4">{extractSummary(message.content)}</div>
                      </>
                    ) : (
                      <div>{message.content}</div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
        {isLoading && (
          <div className="flex justify-start">
            <div className="max-w-[80%] bg-muted rounded-lg p-3">
              <div className="flex space-x-2">
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"></div>
                <div
                  className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></div>
                <div
                  className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                  style={{ animationDelay: "0.4s" }}
                ></div>
              </div>
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="flex items-center space-x-2">
        <Input
          value={input}
          onChange={handleInputChange}
          placeholder="Ask about cricket players..."
          className="flex-1"
        />
        <Button type="submit" disabled={isLoading}>
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  )
}

function extractPlayerData(content: string) {
  // This is a simple extraction - in a real app, you might use a more robust approach
  if (!content.includes("PLAYER_CARD:")) return null

  try {
    const cardData = content.split("PLAYER_CARD:")[1].split("SUMMARY:")[0].trim()
    return JSON.parse(cardData)
  } catch (e) {
    console.error("Failed to parse player data", e)
    return null
  }
}

function extractSummary(content: string) {
  if (!content.includes("SUMMARY:")) return content

  try {
    return content.split("SUMMARY:")[1].trim()
  } catch (e) {
    return content
  }
}

