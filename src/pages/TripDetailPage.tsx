import React, { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useParams, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { MapPin, Clock, Users, Star, Car, CreditCard, DollarSign } from "lucide-react";
import { motion } from "framer-motion";
import type { Tables } from "@/integrations/supabase/types";

type Trip = Tables<"trips"> & { driver_profile?: Tables<"profiles"> };

const TripDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [seats, setSeats] = useState(1);
  const [payMethod, setPayMethod] = useState<"cash" | "online">("cash");

  useEffect(() => {
    const fetch = async () => {
      if (!id) return;
      const { data } = await supabase
        .from("trips")
        .select("*")
        .eq("id", id)
        .single();
      if (data) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("user_id", data.driver_id)
          .single();
        setTrip({ ...data, driver_profile: profile || undefined });
      }
      setLoading(false);
    };
    fetch();
  }, [id]);

  const handleBook = async () => {
    if (!user || !trip) return;
    setBooking(true);
    const { error } = await supabase.from("bookings").insert({
      trip_id: trip.id,
      passenger_id: user.id,
      driver_id: trip.driver_id,
      seats_booked: seats,
      payment_method: payMethod,
      amount: Number(trip.price_per_seat) * seats,
    });
    setBooking(false);
    if (error) {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Réservation envoyée !", description: "Le chauffeur doit confirmer votre réservation." });
      navigate("/dashboard");
    }
  };

  if (loading) return <Layout><div className="flex items-center justify-center min-h-screen"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div></Layout>;
  if (!trip) return <Layout><div className="container mx-auto px-4 py-16 text-center"><h1 className="font-display text-2xl font-bold">Trajet introuvable</h1></div></Layout>;

  const dp = trip.driver_profile;
  const initials = dp ? `${dp.first_name?.[0] || ""}${dp.last_name?.[0] || ""}` : "?";

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6 md:py-8 max-w-lg pb-24 md:pb-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          {/* Route header */}
          <div className="text-center">
            <h1 className="font-display text-2xl font-bold">{trip.from_city} → {trip.to_city}</h1>
            <p className="text-muted-foreground text-sm mt-1 flex items-center justify-center gap-2">
              <Clock className="w-4 h-4" /> {trip.date} à {trip.departure_time}
            </p>
          </div>

          {/* Driver */}
          <Card className="border-border/50">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="w-14 h-14 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-bold text-lg shrink-0">
                {initials}
              </div>
              <div>
                <p className="font-medium">{dp?.first_name} {dp?.last_name}</p>
                {trip.vehicle && <p className="text-sm text-muted-foreground flex items-center gap-1"><Car className="w-3.5 h-3.5" /> {trip.vehicle}</p>}
              </div>
            </CardContent>
          </Card>

          {/* Details */}
          <Card className="border-border/50">
            <CardContent className="p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground flex items-center gap-2"><Users className="w-4 h-4" /> Places disponibles</span>
                <span className="font-semibold">{trip.seats_available}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground flex items-center gap-2"><DollarSign className="w-4 h-4" /> Prix par place</span>
                <span className="font-display text-xl font-bold">{trip.price_per_seat}$</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground flex items-center gap-2"><CreditCard className="w-4 h-4" /> Paiement accepté</span>
                <span className="text-sm font-medium capitalize">{trip.accepted_payment === "both" ? "En ligne / Cash" : trip.accepted_payment}</span>
              </div>
            </CardContent>
          </Card>

          {/* Booking */}
          {user && user.id !== trip.driver_id && (
            <Card className="border-border/50">
              <CardContent className="p-5 space-y-4">
                <h3 className="font-display font-semibold">Réserver</h3>
                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground">Nombre de places</label>
                  <input
                    type="number"
                    min={1}
                    max={trip.seats_available}
                    value={seats}
                    onChange={e => setSeats(parseInt(e.target.value) || 1)}
                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm min-h-[44px]"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground">Mode de paiement</label>
                  <div className="grid grid-cols-2 gap-2">
                    {(["cash", "online"] as const).map(m => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setPayMethod(m)}
                        className={`p-3 rounded-lg border text-sm min-h-[44px] transition-colors ${
                          payMethod === m ? "border-primary bg-primary/5 text-primary font-medium" : "border-border"
                        }`}
                      >
                        {m === "cash" ? "💵 Cash" : "💳 En ligne"}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-border">
                  <span className="text-sm text-muted-foreground">Total</span>
                  <span className="font-display text-2xl font-bold">{Number(trip.price_per_seat) * seats}$</span>
                </div>
                <Button onClick={handleBook} className="w-full gradient-primary border-0 min-h-[44px]" disabled={booking}>
                  {booking ? "Réservation..." : "Confirmer la réservation"}
                </Button>
              </CardContent>
            </Card>
          )}

          {!user && (
            <Card className="border-border/50">
              <CardContent className="p-5 text-center">
                <p className="text-sm text-muted-foreground mb-3">Connectez-vous pour réserver</p>
                <Button onClick={() => navigate("/login")} className="gradient-primary border-0 min-h-[44px]">Se connecter</Button>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </div>
    </Layout>
  );
};

export default TripDetailPage;
