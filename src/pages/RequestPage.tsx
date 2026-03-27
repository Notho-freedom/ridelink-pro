import React, { useState } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import LocationAutocomplete from "@/components/LocationAutocomplete";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { MapPin, CalendarDays, Clock, Users, Send } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const RequestPage = () => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    from_city: "", from_lat: 0, from_lng: 0,
    to_city: "", to_lat: 0, to_lng: 0,
    date: "", time: "", seats_needed: 1,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    const { error } = await supabase.from("ride_requests").insert({
      passenger_id: user.id,
      from_city: form.from_city,
      from_lat: form.from_lat,
      from_lng: form.from_lng,
      to_city: form.to_city,
      to_lat: form.to_lat,
      to_lng: form.to_lng,
      date: form.date,
      time: form.time || null,
      seats_needed: form.seats_needed,
    });
    setLoading(false);
    if (error) {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Demande publiée !", description: "Les chauffeurs disponibles seront notifiés." });
      navigate("/dashboard");
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6 md:py-8 max-w-lg pb-24 md:pb-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-display text-2xl md:text-3xl font-bold mb-2">Demande ouverte</h1>
          <p className="text-muted-foreground text-sm mb-6">Publiez votre besoin de trajet — les chauffeurs vous contacteront.</p>

          <Card className="border-border/50">
            <CardContent className="p-5">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label>Départ</Label>
                  <LocationAutocomplete
                    placeholder="Ville de départ"
                    country={profile?.country || undefined}
                    onSelect={r => setForm(p => ({ ...p, from_city: r.city, from_lat: r.lat, from_lng: r.lng }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Arrivée</Label>
                  <LocationAutocomplete
                    placeholder="Ville d'arrivée"
                    iconColor="text-secondary"
                    country={profile?.country || undefined}
                    onSelect={r => setForm(p => ({ ...p, to_city: r.city, to_lat: r.lat, to_lng: r.lng }))}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>Date</Label>
                    <Input type="date" required value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))} />
                  </div>
                  <div className="space-y-2">
                    <Label>Heure souhaitée</Label>
                    <Input type="time" value={form.time} onChange={e => setForm(p => ({ ...p, time: e.target.value }))} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Places nécessaires</Label>
                  <Input type="number" min={1} max={8} value={form.seats_needed} onChange={e => setForm(p => ({ ...p, seats_needed: parseInt(e.target.value) || 1 }))} />
                </div>
                <Button type="submit" className="w-full gradient-primary border-0 min-h-[44px]" disabled={loading}>
                  <Send className="w-4 h-4 mr-2" /> {loading ? "Publication..." : "Publier ma demande"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </Layout>
  );
};

export default RequestPage;
