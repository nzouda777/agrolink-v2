"use client"

import { useState, useEffect, useRef } from "react"
import { useSearchParams } from "next/navigation"
import { Search, Phone, Video, MoreVertical, Paperclip, Send, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// Placeholder data
const contacts = [
  {
    id: 1,
    name: "Ferme Durand",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "Bonjour, je voulais savoir si...",
    time: "10:30",
    unread: 2,
    online: true,
  },
  {
    id: 2,
    name: "Ferme Martin",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "Merci pour votre commande !",
    time: "Hier",
    unread: 0,
    online: false,
  },
  {
    id: 3,
    name: "Ferme Petit",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "Les produits seront disponibles...",
    time: "Lun",
    unread: 0,
    online: true,
  },
  {
    id: 4,
    name: "Ferme Legrand",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "Votre commande a été expédiée",
    time: "28/04",
    unread: 1,
    online: false,
  },
]

const messages = [
  {
    id: 1,
    senderId: 1,
    text: "Bonjour, je voulais savoir si vous aviez encore des tomates bio en stock ?",
    time: "10:30",
    date: "Aujourd'hui",
  },
  {
    id: 2,
    senderId: "me",
    text: "Bonjour ! Oui, nous avons encore des tomates bio. Combien en souhaitez-vous ?",
    time: "10:32",
    date: "Aujourd'hui",
  },
  {
    id: 3,
    senderId: 1,
    text: "Super ! J'aimerais en commander 5kg. Est-ce possible de les livrer demain ?",
    time: "10:35",
    date: "Aujourd'hui",
  },
  {
    id: 4,
    senderId: "me",
    text: "Bien sûr, nous pouvons les livrer demain après-midi. Souhaitez-vous passer commande maintenant ?",
    time: "10:38",
    date: "Aujourd'hui",
  },
  {
    id: 5,
    senderId: 1,
    text: "Oui, je vais passer commande tout de suite. Merci beaucoup pour votre réactivité !",
    time: "10:40",
    date: "Aujourd'hui",
  },
  {
    id: 6,
    senderId: 1,
    text: "J'ai une autre question : avez-vous aussi des courgettes bio ?",
    time: "10:42",
    date: "Aujourd'hui",
  },
]

export default function MessagesPage() {
  const searchParams = useSearchParams()
  const sellerParam = searchParams.get("seller")

  const [selectedContact, setSelectedContact] = useState<any>(null)
  const [messageText, setMessageText] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [mounted, setMounted] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)

    // If seller param exists, find the contact
    if (sellerParam) {
      const contact = contacts.find((c) => c.name.toLowerCase() === sellerParam.toLowerCase())
      if (contact) {
        setSelectedContact(contact)
      }
    } else if (contacts.length > 0) {
      // Otherwise select first contact
      setSelectedContact(contacts[0])
    }
  }, [sellerParam])

  useEffect(() => {
    // Scroll to bottom of messages
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [selectedContact, messages])

  const filteredContacts = contacts.filter((contact) => contact.name.toLowerCase().includes(searchQuery.toLowerCase()))

  const handleSendMessage = () => {
    if (messageText.trim() === "") return

    // In a real app, this would send the message to the API
    console.log("Sending message:", messageText)

    // Clear input
    setMessageText("")
  }

  if (!mounted) {
    return null
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Messages</h1>
        <p className="text-muted-foreground">Communiquez avec les vendeurs</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[calc(100vh-12rem)]">
        <div className="md:col-span-1 border rounded-lg overflow-hidden flex flex-col">
          <div className="p-4">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <Tabs defaultValue="all" className="px-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="all">Tous</TabsTrigger>
              <TabsTrigger value="unread">Non lus</TabsTrigger>
            </TabsList>
          </Tabs>

          <ScrollArea className="flex-1 p-4">
            {filteredContacts.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center p-4">
                <Search className="h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">Aucun contact trouvé</p>
              </div>
            ) : (
              <div className="space-y-2">
                {filteredContacts.map((contact) => (
                  <div
                    key={contact.id}
                    className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer ${
                      selectedContact?.id === contact.id ? "bg-muted" : "hover:bg-muted/50"
                    }`}
                    onClick={() => setSelectedContact(contact)}
                  >
                    <div className="relative">
                      <Avatar>
                        <AvatarImage src={contact.avatar || "/placeholder.svg"} alt={contact.name} />
                        <AvatarFallback>{contact.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      {contact.online && (
                        <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-background" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium text-sm">{contact.name}</h4>
                        <span className="text-xs text-muted-foreground">{contact.time}</span>
                      </div>
                      <p className="text-xs text-muted-foreground truncate">{contact.lastMessage}</p>
                    </div>
                    {contact.unread > 0 && <Badge className="ml-auto">{contact.unread}</Badge>}
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>

        <div className="md:col-span-2 border rounded-lg overflow-hidden flex flex-col">
          {selectedContact ? (
            <>
              <div className="p-4 border-b flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={selectedContact.avatar || "/placeholder.svg"} alt={selectedContact.name} />
                    <AvatarFallback>{selectedContact.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium">{selectedContact.name}</h3>
                    <p className="text-xs text-muted-foreground">
                      {selectedContact.online ? "En ligne" : "Hors ligne"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon">
                    <Phone className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Video className="h-5 w-5" />
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-5 w-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Voir le profil</DropdownMenuItem>
                      <DropdownMenuItem>Marquer comme lu</DropdownMenuItem>
                      <DropdownMenuItem>Bloquer le contact</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">Supprimer la conversation</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              <ScrollArea className="flex-1 p-4">
                <div className="space-y-6">
                  <div className="flex justify-center">
                    <Badge variant="outline" className="text-xs">
                      Aujourd'hui
                    </Badge>
                  </div>

                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.senderId === "me" ? "justify-end" : "justify-start"}`}
                    >
                      <div className="flex gap-2 max-w-[80%]">
                        {message.senderId !== "me" && (
                          <Avatar className="h-8 w-8">
                            <AvatarImage
                              src={selectedContact.avatar || "/placeholder.svg"}
                              alt={selectedContact.name}
                            />
                            <AvatarFallback>{selectedContact.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                          </Avatar>
                        )}
                        <div>
                          <div
                            className={`rounded-lg p-3 ${
                              message.senderId === "me" ? "bg-primary text-primary-foreground" : "bg-muted"
                            }`}
                          >
                            <p className="text-sm">{message.text}</p>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">{message.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              <div className="p-4 border-t">
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon">
                    <Paperclip className="h-5 w-5" />
                  </Button>
                  <Input
                    placeholder="Écrivez votre message..."
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault()
                        handleSendMessage()
                      }
                    }}
                  />
                  <Button variant="primary" size="icon" onClick={handleSendMessage}>
                    <Send className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center p-4">
              <MessageSquare className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">Aucune conversation sélectionnée</h3>
              <p className="text-sm text-muted-foreground mt-1">Sélectionnez un contact pour commencer à discuter</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
