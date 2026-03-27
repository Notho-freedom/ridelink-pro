import React, { useState, useEffect, useRef } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useParams, Link } from "react-router-dom";
import { Send, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

interface Message {
  id: string;
  sender_id: string;
  content: string;
  created_at: string;
  read: boolean;
}

const MessagesPage = () => {
  const { bookingId } = useParams<{ bookingId: string }>();
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMsg, setNewMsg] = useState("");
  const [sending, setSending] = useState(false);
  const [bookings, setBookings] = useState<any[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);

  // If no bookingId, show conversation list
  useEffect(() => {
    if (!user) return;
    if (!bookingId) {
      supabase.from("bookings").select("*, trips(from_city, to_city), profiles!bookings_driver_id_fkey(first_name, last_name), passenger:profiles!bookings_passenger_id_fkey(first_name, last_name)")
        .or(`passenger_id.eq.${user.id},driver_id.eq.${user.id}`)
        .in("status", ["confirmed", "pending"])
        .order("created_at", { ascending: false })
        .then(({ data }) => setBookings(data || []));
    }
  }, [user, bookingId]);

  // Fetch messages
  useEffect(() => {
    if (!bookingId) return;
    const fetchMessages = async () => {
      const { data } = await supabase.from("messages")
        .select("*")
        .eq("booking_id", bookingId)
        .order("created_at", { ascending: true });
      setMessages(data || []);
    };
    fetchMessages();

    // Realtime
    const channel = supabase.channel(`messages-${bookingId}`)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "messages", filter: `booking_id=eq.${bookingId}` },
        (payload) => {
          setMessages(prev => [...prev, payload.new as Message]);
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [bookingId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMsg.trim() || !user || !bookingId) return;
    setSending(true);
    await supabase.from("messages").insert({
      booking_id: bookingId,
      sender_id: user.id,
      content: newMsg.trim(),
    });
    setNewMsg("");
    setSending(false);
  };

  if (!bookingId) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-6 md:py-8 pb-24 md:pb-8">
          <h1 className="font-display text-2xl font-bold mb-4">Messages</h1>
          {bookings.length === 0 ? (
            <Card className="border-border/50">
              <CardContent className="p-8 text-center text-muted-foreground">
                <p className="font-display font-semibold">Aucune conversation</p>
                <p className="text-sm mt-1">Vos conversations apparaîtront ici après une réservation.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-2">
              {bookings.map(b => {
                const other = b.passenger_id === user?.id ? b.profiles : b.passenger;
                const otherName = other ? `${other.first_name} ${other.last_name}` : "Utilisateur";
                return (
                  <Link key={b.id} to={`/messages/${b.id}`}>
                    <Card className="border-border/50 hover:shadow-md transition-shadow">
                      <CardContent className="p-4 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-bold text-sm shrink-0">
                          {otherName[0]}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{otherName}</p>
                          <p className="text-xs text-muted-foreground truncate">
                            {b.trips ? `${b.trips.from_city} → ${b.trips.to_city}` : "Réservation"}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="flex flex-col h-[calc(100vh-4rem)] md:h-[calc(100vh-4rem)]">
        {/* Header */}
        <div className="glass border-b border-border/50 p-3 flex items-center gap-3">
          <Link to="/messages" className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h2 className="font-display font-semibold text-sm">Conversation</h2>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 pb-24 md:pb-4">
          {messages.map(m => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${m.sender_id === user?.id ? "justify-end" : "justify-start"}`}
            >
              <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${
                m.sender_id === user?.id
                  ? "gradient-primary text-primary-foreground rounded-br-md"
                  : "bg-muted rounded-bl-md"
              }`}>
                {m.content}
              </div>
            </motion.div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="glass border-t border-border/50 p-3 mb-16 md:mb-0">
          <form onSubmit={handleSend} className="flex gap-2">
            <Input
              placeholder="Tapez un message..."
              value={newMsg}
              onChange={e => setNewMsg(e.target.value)}
              className="flex-1 min-h-[44px]"
            />
            <Button type="submit" className="gradient-primary border-0 min-h-[44px] min-w-[44px]" disabled={sending}>
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default MessagesPage;
