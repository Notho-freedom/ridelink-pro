import React, { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Search, Clock, Users, Star, Car, List, Map as MapIcon } from "lucide-react";
import LocationAutocomplete from "@/components/LocationAutocomplete";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import type { Tables } from "@/integrations/supabase/types";
import { useAuth } from "@/contexts/AuthContext";

type Trip = Tables<"trips"> & { driver_profile?: Tables<"profiles"> };
type Availability = Tables<"availabilities"> & { driver_profile?: Tables<"profiles"> };

const SearchPage = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { profile } = useAuth();
  const [from, setFrom] = useState(params.get("from") || "");
  const [to, setTo] = useState(params.get("to") || "");
  const [date, setDate] = useState("");
  const [trips, setTrips] = useState<Trip[]>([]);
  const [availabilities, setAvailabilities] = useState<Availability[]>([]);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState<"list" | "map">("list");

  const doSearch = async () => {
    setLoading(true);
    // Fetch trips
    let tripQuery = supabase.from("trips").select("*").eq("status", "active");
    if (from) tripQuery = tripQuery.ilike("from_city", `%${from}%`);
    if (to) tripQuery = tripQuery.ilike("to_city", `%${to}%`);
    if (date) tripQuery = tripQuery.eq("date", date);
    const { data: tripData } = await tripQuery.order("date", { ascending: true }).limit(20);

    // Fetch availabilities
    let availQuery = supabase.from("availabilities").select("*").eq("is_active", true);
    if (from) availQuery = availQuery.ilike("city", `%${from}%`);
    if (date) availQuery = availQuery.eq("date", date);
    const { data: availData } = await availQuery.limit(20);

    // Fetch driver profiles
    const driverIds = new Set<string>();
    (tripData || []).forEach(t => driverIds.add(t.driver_id));
    (availData || []).forEach(a => driverIds.add(a.driver_id));
    
    let profilesMap: Record<string, Tables<"profiles">> = {};
    if (driverIds.size > 0) {
      const { data: profiles } = await supabase.from("profiles").select("*").in("user_id", Array.from(driverIds));
      (profiles || []).forEach(p => { profilesMap[p.user_id] = p; });
    }

    setTrips((tripData || []).map(t => ({ ...t, driver_profile: profilesMap[t.driver_id] })));
    setAvailabilities((availData || []).map(a => ({ ...a, driver_profile: profilesMap[a.driver_id] })));
    setLoading(false);
  };

  useEffect(() => { doSearch(); }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    doSearch();
  };

  const totalResults = trips.length + availabilities.length;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-4 md:py-8 pb-24 md:pb-8">
        {/* Search form */}
        <form onSubmit={handleSearch} className="glass rounded-2xl p-3 mb-4 md:mb-8">
          <div className="flex flex-col md:flex-row gap-2 md:gap-3">
            <div className="flex-1">
              <LocationAutocomplete
                placeholder="Départ"
                value={from}
                onChange={setFrom}
                country={profile?.country || undefined}
                onSelect={r => setFrom(r.city)}
              />
            </div>
            <div className="flex-1">
              <LocationAutocomplete
                placeholder="Arrivée"
                value={to}
                onChange={setTo}
                iconColor="text-secondary"
                country={profile?.country || undefined}
                onSelect={r => setTo(r.city)}
              />
            </div>
            <Input type="date" className="md:w-40 min-h-[44px]" value={date} onChange={e => setDate(e.target.value)} />
            <Button type="submit" className="gradient-primary border-0 min-h-[44px]" disabled={loading}>
              <Search className="w-4 h-4 mr-2" />{loading ? "..." : "Chercher"}
            </Button>
          </div>
        </form>

        {/* Toolbar */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-muted-foreground">{totalResults} résultat{totalResults !== 1 ? "s" : ""}</p>
          <div className="flex gap-1 bg-muted rounded-lg p-1">
            <button onClick={() => setViewMode("list")} className={`p-2 rounded-md transition-colors min-w-[36px] min-h-[36px] flex items-center justify-center ${viewMode === "list" ? "bg-card shadow-sm text-primary" : "text-muted-foreground"}`}>
              <List className="w-4 h-4" />
            </button>
            <button onClick={() => setViewMode("map")} className={`p-2 rounded-md transition-colors min-w-[36px] min-h-[36px] flex items-center justify-center ${viewMode === "map" ? "bg-card shadow-sm text-primary" : "text-muted-foreground"}`}>
              <MapIcon className="w-4 h-4" />
            </button>
          </div>
        </div>

        {viewMode === "list" ? (
          <div className="space-y-3">
            {/* Trips */}
            {trips.map((r, i) => {
              const dp = r.driver_profile;
              const initials = dp ? `${dp.first_name?.[0] || ""}${dp.last_name?.[0] || ""}` : "?";
              return (
                <motion.div key={r.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                  <Card className="hover:shadow-md transition-shadow border-border/50 cursor-pointer" onClick={() => navigate(`/trip/${r.id}`)}>
                    <CardContent className="p-4">
                      <div className="flex flex-col gap-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-bold text-xs shrink-0">{initials}</div>
                            <div>
                              <p className="font-medium text-sm">{dp?.first_name} {dp?.last_name}</p>
                              {r.vehicle && <p className="text-xs text-muted-foreground">{r.vehicle}</p>}
                            </div>
                          </div>
                          <span className="px-2.5 py-1 rounded-full bg-secondary/10 text-secondary text-xs font-medium">📍 Planifié</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-sm">{r.from_city} → {r.to_city}</p>
                            <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                              <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{r.date} {r.departure_time}</span>
                              <span className="flex items-center gap-1"><Users className="w-3 h-3" />{r.seats_available} places</span>
                            </div>
                          </div>
                          <span className="font-display text-xl font-bold">{r.price_per_seat}$</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
            {/* Availabilities */}
            {availabilities.map((a, i) => {
              const dp = a.driver_profile;
              const initials = dp ? `${dp.first_name?.[0] || ""}${dp.last_name?.[0] || ""}` : "?";
              return (
                <motion.div key={a.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: (trips.length + i) * 0.05 }}>
                  <Card className="hover:shadow-md transition-shadow border-border/50">
                    <CardContent className="p-4">
                      <div className="flex flex-col gap-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-success/20 flex items-center justify-center text-success font-bold text-xs shrink-0">{initials}</div>
                            <div>
                              <p className="font-medium text-sm">{dp?.first_name} {dp?.last_name}</p>
                              {a.vehicle && <p className="text-xs text-muted-foreground">{a.vehicle}</p>}
                            </div>
                          </div>
                          <span className="px-2.5 py-1 rounded-full bg-success/10 text-success text-xs font-medium">🟢 Dispo</span>
                        </div>
                        <div>
                          <p className="font-medium text-sm">Zone : {a.city} ({a.radius_km} km)</p>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                            <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{a.date} {a.time_from}-{a.time_to}</span>
                            <span className="flex items-center gap-1"><Users className="w-3 h-3" />{a.seats} places</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
            {totalResults === 0 && !loading && (
              <Card className="border-border/50">
                <CardContent className="p-8 text-center text-muted-foreground">
                  <Search className="w-10 h-10 mx-auto mb-3 opacity-50" />
                  <p className="font-display font-semibold">Aucun résultat</p>
                  <p className="text-sm mt-1">Essayez avec d'autres critères ou publiez une demande.</p>
                  <Button className="mt-4 gradient-primary border-0 min-h-[44px]" onClick={() => navigate("/request")}>Publier une demande</Button>
                </CardContent>
              </Card>
            )}
          </div>
        ) : (
          <Card className="h-[400px] md:h-[500px] flex items-center justify-center border-border/50">
            <div className="text-center text-muted-foreground space-y-2">
              <MapIcon className="w-12 h-12 mx-auto opacity-50" />
              <p className="font-display font-semibold">Carte interactive</p>
              <p className="text-sm">Module de carte à venir</p>
            </div>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default SearchPage;
