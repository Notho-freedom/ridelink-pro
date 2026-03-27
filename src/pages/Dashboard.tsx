import React, { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Car, Users, MapPin, Clock, Star, MessageCircle, CreditCard, Plus, Bell } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { Tables } from "@/integrations/supabase/types";

const Dashboard = () => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [trips, setTrips] = useState<Tables<"trips">[]>([]);
  const [requests, setRequests] = useState<Tables<"ride_requests">[]>([]);
  const [bookings, setBookings] = useState<Tables<"bookings">[]>([]);
  const [notifications, setNotifications] = useState<Tables<"notifications">[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetchAll = async () => {
      const [tripsRes, reqRes, bookRes, notifRes] = await Promise.all([
        supabase.from("trips").select("*").eq("driver_id", user.id).order("date", { ascending: false }).limit(10),
        supabase.from("ride_requests").select("*").eq("passenger_id", user.id).order("created_at", { ascending: false }).limit(10),
        supabase.from("bookings").select("*").or(`passenger_id.eq.${user.id},driver_id.eq.${user.id}`).order("created_at", { ascending: false }).limit(10),
        supabase.from("notifications").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(20),
      ]);
      setTrips(tripsRes.data || []);
      setRequests(reqRes.data || []);
      setBookings(bookRes.data || []);
      setNotifications(notifRes.data || []);
      setLoading(false);
    };
    fetchAll();

    // Realtime notifications
    const channel = supabase.channel("dashboard-notifs")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "notifications", filter: `user_id=eq.${user.id}` },
        (payload) => {
          const n = payload.new as Tables<"notifications">;
          setNotifications(prev => [n, ...prev]);
          toast({ title: n.title, description: n.body });
        }
      )
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [user]);

  const confirmBooking = async (id: string) => {
    await supabase.from("bookings").update({ status: "confirmed" }).eq("id", id);
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status: "confirmed" } : b));
    toast({ title: "Réservation confirmée !" });
  };

  const cancelTrip = async (id: string) => {
    await supabase.from("trips").update({ status: "cancelled" }).eq("id", id);
    setTrips(prev => prev.map(t => t.id === id ? { ...t, status: "cancelled" } : t));
    toast({ title: "Trajet annulé" });
  };

  const unreadNotifs = notifications.filter(n => !n.read).length;

  const statsData = [
    { label: "Trajets publiés", value: trips.length.toString(), icon: <Car className="w-5 h-5" /> },
    { label: "Réservations", value: bookings.length.toString(), icon: <Users className="w-5 h-5" /> },
    { label: "Demandes", value: requests.length.toString(), icon: <MapPin className="w-5 h-5" /> },
    { label: "Notifications", value: unreadNotifs.toString(), icon: <Bell className="w-5 h-5" /> },
  ];

  if (loading) return <Layout><div className="flex items-center justify-center min-h-screen"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div></Layout>;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-4 md:py-8 pb-24 md:pb-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center justify-between mb-4 md:mb-8">
            <div>
              <h1 className="font-display text-2xl md:text-3xl font-bold">Tableau de bord</h1>
              <p className="text-muted-foreground text-sm">Bonjour {profile?.first_name || "!"}</p>
            </div>
            <Link to="/publish">
              <Button className="gradient-primary border-0 min-h-[44px]" size="sm"><Plus className="w-4 h-4 mr-1" />Publier</Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4 md:mb-8">
            {statsData.map((s, i) => (
              <Card key={i} className="border-border/50">
                <CardContent className="p-3 md:p-4 flex items-center gap-3">
                  <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">{s.icon}</div>
                  <div>
                    <p className="font-display text-xl md:text-2xl font-bold">{s.value}</p>
                    <p className="text-[10px] md:text-xs text-muted-foreground">{s.label}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Tabs defaultValue="trips" className="space-y-3">
            <TabsList className="w-full grid grid-cols-4 h-10">
              <TabsTrigger value="trips" className="text-xs">Trajets</TabsTrigger>
              <TabsTrigger value="bookings" className="text-xs">Réserv.</TabsTrigger>
              <TabsTrigger value="requests" className="text-xs">Demandes</TabsTrigger>
              <TabsTrigger value="notifs" className="text-xs relative">
                Notifs
                {unreadNotifs > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 bg-destructive text-destructive-foreground rounded-full text-[9px] flex items-center justify-center">{unreadNotifs}</span>}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="trips">
              <div className="space-y-2">
                {trips.length === 0 && (
                  <Card className="border-border/50"><CardContent className="p-6 text-center text-muted-foreground text-sm">Aucun trajet publié. <Link to="/publish" className="text-primary hover:underline">Publier un trajet</Link></CardContent></Card>
                )}
                {trips.map(t => (
                  <Card key={t.id} className="border-border/50">
                    <CardContent className="p-3 md:p-4">
                      <div className="flex items-center justify-between gap-2">
                        <div className="min-w-0">
                          <p className="font-medium text-sm truncate">{t.from_city} → {t.to_city}</p>
                          <p className="text-xs text-muted-foreground flex items-center gap-2">
                            <Clock className="w-3 h-3" />{t.date} {t.departure_time} · {t.seats_available} places · {t.price_per_seat}$
                          </p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className={`text-xs px-2 py-0.5 rounded-full ${t.status === "active" ? "bg-success/10 text-success" : t.status === "cancelled" ? "bg-destructive/10 text-destructive" : "bg-muted text-muted-foreground"}`}>
                            {t.status === "active" ? "Actif" : t.status === "cancelled" ? "Annulé" : "Terminé"}
                          </span>
                          {t.status === "active" && (
                            <Button variant="destructive" size="sm" className="h-8 text-xs" onClick={() => cancelTrip(t.id)}>Annuler</Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="bookings">
              <div className="space-y-2">
                {bookings.length === 0 && (
                  <Card className="border-border/50"><CardContent className="p-6 text-center text-muted-foreground text-sm">Aucune réservation.</CardContent></Card>
                )}
                {bookings.map(b => (
                  <Card key={b.id} className="border-border/50">
                    <CardContent className="p-3 md:p-4">
                      <div className="flex items-center justify-between gap-2">
                        <div className="min-w-0">
                          <p className="font-medium text-sm">{b.seats_booked} place{b.seats_booked > 1 ? "s" : ""} · {b.amount}$</p>
                          <p className="text-xs text-muted-foreground capitalize">{b.payment_method} · {b.status}</p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            b.status === "confirmed" ? "bg-success/10 text-success" :
                            b.status === "pending" ? "bg-warning/10 text-warning" :
                            "bg-muted text-muted-foreground"
                          }`}>
                            {b.status === "pending" ? "En attente" : b.status === "confirmed" ? "Confirmé" : b.status}
                          </span>
                          {b.status === "pending" && b.driver_id === user?.id && (
                            <Button size="sm" className="h-8 text-xs gradient-primary border-0" onClick={() => confirmBooking(b.id)}>Confirmer</Button>
                          )}
                          {b.status === "confirmed" && (
                            <Link to={`/messages/${b.id}`}><Button variant="outline" size="sm" className="h-8 text-xs"><MessageCircle className="w-3 h-3 mr-1" />Chat</Button></Link>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="requests">
              <div className="space-y-2">
                {requests.length === 0 && (
                  <Card className="border-border/50"><CardContent className="p-6 text-center text-muted-foreground text-sm">Aucune demande. <Link to="/request" className="text-primary hover:underline">Publier une demande</Link></CardContent></Card>
                )}
                {requests.map(r => (
                  <Card key={r.id} className="border-border/50">
                    <CardContent className="p-3 md:p-4">
                      <div className="flex items-center justify-between gap-2">
                        <div className="min-w-0">
                          <p className="font-medium text-sm truncate">{r.from_city} → {r.to_city}</p>
                          <p className="text-xs text-muted-foreground"><Clock className="w-3 h-3 inline mr-1" />{r.date} {r.time || ""} · {r.seats_needed} place{r.seats_needed > 1 ? "s" : ""}</p>
                        </div>
                        <span className={`text-xs px-2 py-0.5 rounded-full shrink-0 ${
                          r.status === "open" ? "bg-warning/10 text-warning" :
                          r.status === "matched" ? "bg-success/10 text-success" :
                          "bg-muted text-muted-foreground"
                        }`}>
                          {r.status === "open" ? "Ouvert" : r.status === "matched" ? "Matché" : r.status}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="notifs">
              <div className="space-y-2">
                {notifications.length === 0 && (
                  <Card className="border-border/50"><CardContent className="p-6 text-center text-muted-foreground text-sm">Aucune notification.</CardContent></Card>
                )}
                {notifications.map(n => (
                  <Card key={n.id} className={`border-border/50 ${!n.read ? "bg-primary/5" : ""}`}>
                    <CardContent className="p-3 md:p-4">
                      <p className="font-medium text-sm">{n.title}</p>
                      <p className="text-xs text-muted-foreground">{n.body}</p>
                      <p className="text-[10px] text-muted-foreground mt-1">{new Date(n.created_at).toLocaleString("fr-FR")}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </Layout>
  );
};

export default Dashboard;
