import React, { useState } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DollarSign, Car, Radio } from "lucide-react";
import LocationAutocomplete from "@/components/LocationAutocomplete";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

const PublishPage = () => {
  const { toast } = useToast();
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [loadingTrip, setLoadingTrip] = useState(false);
  const [loadingAvail, setLoadingAvail] = useState(false);

  const [trip, setTrip] = useState({
    from_city: "", from_lat: 0, from_lng: 0,
    to_city: "", to_lat: 0, to_lng: 0,
    date: "", departure_time: "", seats_available: 3,
    price_per_seat: 0, vehicle: "",
  });

  const [avail, setAvail] = useState({
    city: "", lat: 0, lng: 0,
    radius_km: 50, date: "", time_from: "", time_to: "",
    seats: 4, vehicle: "",
  });

  const handleSubmitTrip = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoadingTrip(true);
    const { error } = await supabase.from("trips").insert({
      driver_id: user.id,
      from_city: trip.from_city, from_lat: trip.from_lat, from_lng: trip.from_lng,
      to_city: trip.to_city, to_lat: trip.to_lat, to_lng: trip.to_lng,
      date: trip.date, departure_time: trip.departure_time,
      seats_available: trip.seats_available,
      price_per_seat: trip.price_per_seat,
      vehicle: trip.vehicle || null,
    });
    setLoadingTrip(false);
    if (error) {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Trajet publié !", description: "Votre trajet est maintenant visible." });
      navigate("/dashboard");
    }
  };

  const handleSubmitAvailable = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoadingAvail(true);
    const { error } = await supabase.from("availabilities").insert({
      driver_id: user.id,
      city: avail.city, lat: avail.lat, lng: avail.lng,
      radius_km: avail.radius_km, date: avail.date,
      time_from: avail.time_from, time_to: avail.time_to,
      seats: avail.seats, vehicle: avail.vehicle || null,
    });
    setLoadingAvail(false);
    if (error) {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Mode dispo activé ! 🟢", description: "Les passagers dans votre zone peuvent vous trouver." });
      navigate("/dashboard");
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6 md:py-8 max-w-lg pb-24 md:pb-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-display text-2xl md:text-3xl font-bold mb-1">Publier</h1>
          <p className="text-muted-foreground text-sm mb-6">Proposez un trajet ou signalez votre disponibilité.</p>

          <Tabs defaultValue="trip" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2 h-12">
              <TabsTrigger value="trip" className="flex items-center gap-2 text-sm min-h-[44px]">
                <Car className="w-4 h-4" /> Trajet planifié
              </TabsTrigger>
              <TabsTrigger value="available" className="flex items-center gap-2 text-sm min-h-[44px]">
                <Radio className="w-4 h-4" /> Je suis dispo
              </TabsTrigger>
            </TabsList>

            <TabsContent value="trip">
              <Card className="border-border/50">
                <CardContent className="p-5">
                  <form onSubmit={handleSubmitTrip} className="space-y-4">
                    <div className="space-y-2">
                      <Label>Ville de départ</Label>
                      <LocationAutocomplete
                        placeholder="Ex: Montréal"
                        country={profile?.country || undefined}
                        onSelect={r => setTrip(p => ({ ...p, from_city: r.city, from_lat: r.lat, from_lng: r.lng }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Ville d'arrivée</Label>
                      <LocationAutocomplete
                        placeholder="Ex: Ottawa"
                        iconColor="text-secondary"
                        country={profile?.country || undefined}
                        onSelect={r => setTrip(p => ({ ...p, to_city: r.city, to_lat: r.lat, to_lng: r.lng }))}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label>Date</Label>
                        <Input type="date" required value={trip.date} onChange={e => setTrip(p => ({ ...p, date: e.target.value }))} />
                      </div>
                      <div className="space-y-2">
                        <Label>Heure</Label>
                        <Input type="time" required value={trip.departure_time} onChange={e => setTrip(p => ({ ...p, departure_time: e.target.value }))} />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label>Places</Label>
                        <Input type="number" min={1} max={8} value={trip.seats_available} onChange={e => setTrip(p => ({ ...p, seats_available: parseInt(e.target.value) || 1 }))} />
                      </div>
                      <div className="space-y-2">
                        <Label>Prix/place ($)</Label>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input type="number" min={0} placeholder="25" className="pl-10" required value={trip.price_per_seat || ""} onChange={e => setTrip(p => ({ ...p, price_per_seat: parseFloat(e.target.value) || 0 }))} />
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Véhicule</Label>
                      <Input placeholder="Ex: Toyota Camry" value={trip.vehicle} onChange={e => setTrip(p => ({ ...p, vehicle: e.target.value }))} />
                    </div>
                    <Button type="submit" className="w-full gradient-primary border-0 min-h-[44px]" disabled={loadingTrip}>
                      {loadingTrip ? "Publication..." : "Publier le trajet"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="available">
              <Card className="border-border/50">
                <CardHeader className="pb-2">
                  <CardTitle className="font-display text-lg flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-success animate-pulse" /> Mode Disponible
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-5 pt-2">
                  <form onSubmit={handleSubmitAvailable} className="space-y-4">
                    <div className="space-y-2">
                      <Label>Votre zone (ville)</Label>
                      <LocationAutocomplete
                        placeholder="Ex: Montréal"
                        country={profile?.country || undefined}
                        onSelect={r => setAvail(p => ({ ...p, city: r.city, lat: r.lat, lng: r.lng }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Rayon (km)</Label>
                      <Input type="number" min={5} max={200} value={avail.radius_km} onChange={e => setAvail(p => ({ ...p, radius_km: parseInt(e.target.value) || 50 }))} />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label>De</Label>
                        <Input type="time" required value={avail.time_from} onChange={e => setAvail(p => ({ ...p, time_from: e.target.value }))} />
                      </div>
                      <div className="space-y-2">
                        <Label>Jusqu'à</Label>
                        <Input type="time" required value={avail.time_to} onChange={e => setAvail(p => ({ ...p, time_to: e.target.value }))} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Date</Label>
                      <Input type="date" required value={avail.date} onChange={e => setAvail(p => ({ ...p, date: e.target.value }))} />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label>Places</Label>
                        <Input type="number" min={1} max={8} value={avail.seats} onChange={e => setAvail(p => ({ ...p, seats: parseInt(e.target.value) || 1 }))} />
                      </div>
                      <div className="space-y-2">
                        <Label>Véhicule</Label>
                        <Input placeholder="Ex: Honda Civic" value={avail.vehicle} onChange={e => setAvail(p => ({ ...p, vehicle: e.target.value }))} />
                      </div>
                    </div>
                    <Button type="submit" className="w-full bg-success hover:bg-success/90 text-success-foreground border-0 min-h-[44px]" disabled={loadingAvail}>
                      <Radio className="w-4 h-4 mr-2" /> {loadingAvail ? "Activation..." : "Activer le mode dispo"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </Layout>
  );
};

export default PublishPage;
