// "use client"
// import { useState, useEffect } from "react"
// import type React from "react"

// import { Input } from "@/components/ui/input"
// import { Button } from "@/components/ui/button"
// import { Send, Loader2, Bot } from "lucide-react"
// import PlayerCard from "@/components/dashboard/chat/player-card"
// import { getChatMessages } from "@/services/chatService"
// import { Avatar, AvatarFallback } from "@/components/ui/avatar"

// type Message = {
//   id: string
//   role: "user" | "assistant"
//   content: string
// }

// export default function ChatPage() {
//   const [messages, setMessages] = useState<Message[]>([])
//   const [input, setInput] = useState("")
//   const [isLoading, setIsLoading] = useState(false)
//   const [userName, setUserName] = useState("")

//   useEffect(() => {
//     // Get user name from localStorage
//     const storedUserName = localStorage.getItem("user_name") || "User"
//     setUserName(storedUserName)
//   }, [])

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setInput(e.target.value)
//   }

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     if (!input.trim()) return

//     // Add user message to chat
//     const userMessage: Message = {
//       id: Date.now().toString(),
//       role: "user",
//       content: input,
//     }

//     setMessages((prev) => [...prev, userMessage])
//     setInput("")
//     setIsLoading(true)

//     try {
//       // Send request to API
//       const response = await getChatMessages(input.trim())

//       // Create assistant message
//       const assistantMessage: Message = {
//         id: (Date.now() + 1).toString(),
//         role: "assistant",
//         content: response.query_results && response.query_results.length > 0 && 
//           response.query_results[0].category && response.query_results[0].name && 
//           response.query_results[0].university && response.query_results[0].value !== null
//           ? `PLAYER_CARD:${JSON.stringify(response.query_results[0])}SUMMARY:${response.explanation}`
//           : response.explanation,
//       }

//       setMessages((prev) => [...prev, assistantMessage])
//     } catch (error) {
//       console.error("Error getting chat response:", error)

//       // Add error message
//       const errorMessage: Message = {
//         id: (Date.now() + 1).toString(),
//         role: "assistant",
//         content: "Sorry, I couldn't process your request. Please try again.",
//       }

//       setMessages((prev) => [...prev, errorMessage])
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   return (
//     <div className="flex flex-col h-[90vh] max-w-4xl mx-auto p-4">
//       <h1 className="text-2xl font-bold mb-4 text-center">Sprit 11 Cricket Assistant</h1>

//       <div className="flex-1 overflow-y-auto mb-4 space-y-4 p-4 rounded-lg border">
//         {messages.length === 0 ? (
//           <div className="text-center text-muted-foreground py-8">Ask about cricket players, teams, or strategies!</div>
//         ) : (
//           messages.map((message) => (
//             <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
//                 <div className="flex items-start gap-4">
//                 {message.role === "user" ? (
//                   <>

//                   <div className="max-w-[80%] bg-primary text-primary-foreground rounded-lg p-4">
//                     <div className="text-white">{message.content}</div>
//                   </div>
//                     <Avatar className="h-12 w-12 bg-black-500 text-black text-lg">
//                     <AvatarFallback>{userName.charAt(0).toUpperCase()}</AvatarFallback>
//                     </Avatar>
//                   </>
//                 ) : (
//                   <>
//                   <Avatar className="h-12 w-12 bg-black-500 text-black text-lg">
//                     <AvatarFallback>
//                     <Bot className="h-6 w-" />
//                     </AvatarFallback>
//                   </Avatar>
//                     {message.content.includes("PLAYER_CARD:") ? (
//                     <div>
//                       <div className="max-w-[50%]"><PlayerCard player={extractPlayerData(message.content)} /></div>
//                       <br />
//                       <div className="max-w-[80%] bg-muted rounded-lg p-4">
//                         <div className="mt-4">{extractSummary(message.content)}</div>
//                       </div>
//                     </div>
//                     ) : (
//                     <div className="max-w-[80%] bg-muted rounded-lg p-4">
//                     <div>{message.content}</div>
//                     </div>
//                     )}
                  
//                   </>
//                 )}
//                 </div>
//             </div>
//           ))
//         )}
//         {isLoading && (
//           <div className="flex justify-start ">
//             <div className="flex items-start gap-4">
//             <Avatar className="h-12 w-12 bg-black-500 text-black text-lg">
//                     <AvatarFallback>
//                     <Bot className="h-6 w-" />
//                     </AvatarFallback>
//                   </Avatar>
//             </div>
//             <div className="max-w-[80%] bg-muted rounded-lg p-4">
//               <div className="flex items-start gap-4">
//                 <div className="flex space-x-2">
//                   <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"></div>
//                   <div
//                     className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
//                     style={{ animationDelay: "0.2s" }}
//                   ></div>
//                   <div
//                     className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
//                     style={{ animationDelay: "0.4s" }}
//                   ></div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>

//       <form onSubmit={handleSubmit} className="flex items-center space-x-2">
//         <Input
//           value={input}
//           onChange={handleInputChange}
//           placeholder="Ask about cricket players..."
//           className="flex-1"
//           disabled={isLoading}
//         />
//         <Button type="submit" disabled={isLoading}>
//           {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
//         </Button>
//       </form>
//     </div>
//   )
// }

// function extractPlayerData(content: string) {
//   // This is a simple extraction - in a real app, you might use a more robust approach
//   if (!content.includes("PLAYER_CARD:")) return null

//   try {
//     const cardData = content.split("PLAYER_CARD:")[1].split("SUMMARY:")[0].trim()
//     return JSON.parse(cardData)
//   } catch (e) {
//     console.error("Failed to parse player data", e)
//     return null
//   }
// }

// function extractSummary(content: string) {
//   if (!content.includes("SUMMARY:")) return content

//   try {
//     return content.split("SUMMARY:")[1].trim()
//   } catch (e) {
//     return content
//   }
// }

// "use client"
// import { useState, useEffect } from "react"
// import type React from "react"

// import { Input } from "@/components/ui/input"
// import { Button } from "@/components/ui/button"
// import { Send, Loader2, Bot } from "lucide-react"
// import PlayerCard from "@/components/dashboard/chat/player-card"
// import { getChatMessages } from "@/services/chatService"
// import { Avatar, AvatarFallback } from "@/components/ui/avatar"

// type Message = {
//   id: string
//   role: "user" | "assistant"
//   content: string
// }

// export default function ChatPage() {
//   const [messages, setMessages] = useState<Message[]>([])
//   const [input, setInput] = useState("")
//   const [isLoading, setIsLoading] = useState(false)
//   const [userName, setUserName] = useState("")

//   useEffect(() => {
//     // Get user name from localStorage
//     const storedUserName = localStorage.getItem("user_name") || "User"
//     setUserName(storedUserName)
//   }, [])

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setInput(e.target.value)
//   }

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     if (!input.trim()) return

//     // Add user message to chat
//     const userMessage: Message = {
//       id: Date.now().toString(),
//       role: "user",
//       content: input,
//     }

//     setMessages((prev) => [...prev, userMessage])
//     setInput("")
//     setIsLoading(true)

//     try {
//       // Prepare conversation history for API
//       // Include both user and assistant messages in the history
//       const conversationHistory = messages.map((msg) => ({
//         role: msg.role,
//         content: msg.content,
//       }))

//       // Add current message
//       conversationHistory.push({
//         role: "user",
//         content: input.trim(),
//       })

//       // Send request to API with conversation history
//       const response = await getChatMessages(conversationHistory)

//       // Extract content for assistant message
//       const assistantContent = response.explanation

//       // Create assistant message
//       const assistantMessage: Message = {
//         id: (Date.now() + 1).toString(),
//         role: "assistant",
//         content:
//           response.query_results &&
//           response.query_results.length > 0 &&
//           response.query_results[0].category &&
//           response.query_results[0].name &&
//           response.query_results[0].university &&
//           response.query_results[0].value !== null
//             ? `PLAYER_CARD:${JSON.stringify(response.query_results[0])}SUMMARY:${assistantContent}`
//             : assistantContent,
//       }

//       // Add assistant message to chat
//       setMessages((prev) => [...prev, assistantMessage])

//       // Log messages for debugging
//       console.log("Conversation history sent to API:", conversationHistory)
//       console.log("API response:", response)
//     } catch (error) {
//       console.error("Error getting chat response:", error)

//       // Add error message
//       const errorMessage: Message = {
//         id: (Date.now() + 1).toString(),
//         role: "assistant",
//         content: "Sorry, I couldn't process your request. Please try again.",
//       }

//       setMessages((prev) => [...prev, errorMessage])
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   return (
//     <div className="flex flex-col h-[90vh] max-w-4xl mx-auto p-4">
//       <h1 className="text-2xl font-bold mb-4 text-center">Sprit 11 Cricket Assistant</h1>

//       <div className="flex-1 overflow-y-auto mb-4 space-y-4 p-4 rounded-lg border">
//         {messages.length === 0 ? (
//           <div className="text-center text-muted-foreground py-8">Ask about cricket players, teams, or strategies!</div>
//         ) : (
//           messages.map((message) => (
//             <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
//               <div className="flex items-start gap-4">
//                 {message.role === "user" ? (
//                   <>
//                     <div className="max-w-[80%] bg-primary text-primary-foreground rounded-lg p-4">
//                       <div className="text-white">{message.content}</div>
//                     </div>
//                     <Avatar className="h-12 w-12 bg-black-500 text-black text-lg">
//                       <AvatarFallback>{userName.charAt(0).toUpperCase()}</AvatarFallback>
//                     </Avatar>
//                   </>
//                 ) : (
//                   <>
//                     <Avatar className="h-12 w-12 bg-black-500 text-black text-lg">
//                       <AvatarFallback>
//                         <Bot className="h-6 w-6" />
//                       </AvatarFallback>
//                     </Avatar>
//                     {message.content.includes("PLAYER_CARD:") ? (
//                       <div>
//                         <div className="max-w-[50%]">
//                           <PlayerCard player={extractPlayerData(message.content)} />
//                         </div>
//                         <br />
//                         <div className="max-w-[80%] bg-muted rounded-lg p-4">
//                           <div className="mt-4">{extractSummary(message.content)}</div>
//                         </div>
//                       </div>
//                     ) : (
//                       <div className="max-w-[80%] bg-muted rounded-lg p-4">
//                         <div>{message.content}</div>
//                       </div>
//                     )}
//                   </>
//                 )}
//               </div>
//             </div>
//           ))
//         )}
//         {isLoading && (
//           <div className="flex justify-start">
//             <div className="flex items-start gap-4">
//               <Avatar className="h-12 w-12 bg-black-500 text-black text-lg">
//                 <AvatarFallback>
//                   <Bot className="h-6 w-6" />
//                 </AvatarFallback>
//               </Avatar>
//               <div className="max-w-[80%] bg-muted rounded-lg p-4">
//                 <div className="flex space-x-2">
//                   <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"></div>
//                   <div
//                     className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
//                     style={{ animationDelay: "0.2s" }}
//                   ></div>
//                   <div
//                     className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
//                     style={{ animationDelay: "0.4s" }}
//                   ></div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>

//       <form onSubmit={handleSubmit} className="flex items-center space-x-2">
//         <Input
//           value={input}
//           onChange={handleInputChange}
//           placeholder="Ask about cricket players..."
//           className="flex-1"
//           disabled={isLoading}
//         />
//         <Button type="submit" disabled={isLoading}>
//           {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
//         </Button>
//       </form>
//     </div>
//   )
// }

// function extractPlayerData(content: string) {
//   // This is a simple extraction - in a real app, you might use a more robust approach
//   if (!content.includes("PLAYER_CARD:")) return null

//   try {
//     const cardData = content.split("PLAYER_CARD:")[1].split("SUMMARY:")[0].trim()
//     return JSON.parse(cardData)
//   } catch (e) {
//     console.error("Failed to parse player data", e)
//     return null
//   }
// }

// function extractSummary(content: string) {
//   if (!content.includes("SUMMARY:")) return content

//   try {
//     return content.split("SUMMARY:")[1].trim()
//   } catch (e) {
//     return content
//   }
// }

"use client"
import { useState, useEffect } from "react"
import type React from "react"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Send, Loader2, Bot } from "lucide-react"
import PlayerCard from "@/components/dashboard/chat/player-card"
import { getChatMessages } from "@/services/chatService"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Player } from "@/types/playerTypes"

type Message = {
  id: string
  role: "user" | "assistant"
  content: string
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [userName, setUserName] = useState("")

  useEffect(() => {
    // Get user name from localStorage
    const storedUserName = localStorage.getItem("user_name") || "User"
    setUserName(storedUserName)
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    // Add user message to chat
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      // Prepare conversation history for API
      // Include both user and assistant messages in the history
      const conversationHistory = messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      }))

      // Add current message
      conversationHistory.push({
        role: "user",
        content: input.trim(),
      })

      // Send request to API with conversation history
      const response = await getChatMessages(conversationHistory)

      // Extract content for assistant message
      const assistantContent = response.explanation

      // Create assistant message
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content:
          response.query_results && response.query_results.length > 0
            ? `PLAYER_CARDS:${JSON.stringify(response.query_results)}SUMMARY:${assistantContent}`
            : assistantContent,
      }

      // Add assistant message to chat
      setMessages((prev) => [...prev, assistantMessage])

      // Log messages for debugging
      console.log("Conversation history sent to API:", conversationHistory)
      console.log("API response:", response)
    } catch (error) {
      console.error("Error getting chat response:", error)

      // Add error message
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Sorry, I couldn't process your request. Please try again.",
      }

      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-[90vh] max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">Sprit 11 Cricket Assistant</h1>

      <div className="flex-1 overflow-y-auto mb-4 space-y-4 p-4 rounded-lg border">
        {messages.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">Ask about cricket players, teams, or strategies!</div>
        ) : (
          messages.map((message) => (
            <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className="flex items-start gap-4">
                {message.role === "user" ? (
                  <>
                    <div className="max-w-[80%] bg-primary text-primary-foreground rounded-lg p-4">
                      <div className="text-white">{message.content}</div>
                    </div>
                    <Avatar className="h-12 w-12 bg-black-500 text-black text-lg">
                      <AvatarFallback>{userName.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                  </>
                ) : (
                  <>
                    <Avatar className="h-12 w-12 bg-black-500 text-black text-lg">
                      <AvatarFallback>
                        <Bot className="h-6 w-6" />
                      </AvatarFallback>
                    </Avatar>
                    {message.content.includes("PLAYER_CARDS:") ? (
                      <div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-[80%]">
                          {extractPlayersData(message.content).map((player: Player | null, index: any) => (
                            player ? <PlayerCard key={player.id || index} player={player} /> : null
                          ))}
                        </div>
                        <br />
                        <div className="max-w-[80%] bg-muted rounded-lg p-4">
                          <div className="mt-4">{extractSummary(message.content)}</div>
                        </div>
                      </div>
                    ) : (
                      <div className="max-w-[80%] bg-muted rounded-lg p-4">
                        <div>{message.content}</div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          ))
        )}
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex items-start gap-4">
              <Avatar className="h-12 w-12 bg-black-500 text-black text-lg">
                <AvatarFallback>
                  <Bot className="h-6 w-6" />
                </AvatarFallback>
              </Avatar>
              <div className="max-w-[80%] bg-muted rounded-lg p-4">
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
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="flex items-center space-x-2">
        <Input
          value={input}
          onChange={handleInputChange}
          placeholder="Ask about cricket players..."
          className="flex-1"
          disabled={isLoading}
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        </Button>
      </form>
    </div>
  )
}

function extractPlayersData(content: string) {
  if (!content.includes("PLAYER_CARDS:")) return []

  try {
    const cardsData = content.split("PLAYER_CARDS:")[1].split("SUMMARY:")[0].trim()
    return JSON.parse(cardsData)
  } catch (e) {
    console.error("Failed to parse player data", e)
    return []
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

