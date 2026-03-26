import React, { useState } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useSearchParams } from "react-router-dom";
import { Search, MapPin, Clock, Users, Star, Car, List, Map as MapIcon, Filter } from "lucide-react";
import { motion } from "framer-motion";

const mockResults = [
  {
    id: 1, type: "planned",
    driver: "Amadou K.", rating: 4.8, avatar: "AK",
    from: "Montréal", to: "Ottawa", date: "28 Mars", time: "10:00",
    seats: 3, price: 25, car: "Toyota Camry",
  },
  {
    id: 2, type: "available",
    driver: "Sophie L.", rating: 4.9, avatar: "SL",
    from: "Zone Montréal", to: "Flexible", date: "Aujourd'hui", time: "14:00 - 20:00",
    seats: 4, price: 0, car: "Honda Civic",
  },
  {
    id: 3, type: "planned",
    driver: "Jean-Pierre M.", rating: 4.6, avatar: "JP",
    from: "Gatineau", to: "Montréal", date: "29 Mars", time: "06:30",
    seats: 2, price: 20, car: "Hyundai Elantra",
  },
];

const SearchPage = () => {
  const [params] = useSearchParams();
  const [from, setFrom] = useState(params.get("from") || "");
  const [to, setTo] = useState(params.get("to") || "");
  const [viewMode, setViewMode] = useState<"list" | "map">("list");

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Search form */}
        <div className="glass rounded-2xl p-4 mb-8">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1 relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
              <Input placeholder="Départ" value={from} onChange={(e) => setFrom(e.target.value)} className="pl-10" />
            </div>
            <div className="flex-1 relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary" />
              <Input placeholder="Arrivée" value={to} onChange={(e) => setTo(e.target.value)} className="pl-10" />
            </div>
            <Input type="date" className="md:w-40" />
            <Button className="gradient-primary border-0"><Search className="w-4 h-4 mr-2" />Chercher</Button>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-muted-foreground">{mockResults.length} résultats trouvés</p>
          <div className="flex gap-1 bg-muted rounded-lg p-1">
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-md transition-colors ${viewMode === "list" ? "bg-card shadow-sm text-primary" : "text-muted-foreground"}`}
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("map")}
              className={`p-2 rounded-md transition-colors ${viewMode === "map" ? "bg-card shadow-sm text-primary" : "text-muted-foreground"}`}
            >
              <MapIcon className="w-4 h-4" />
            </button>
          </div>
        </div>

        {viewMode === "list" ? (
          <div className="space-y-4">
            {mockResults.map((r, i) => (
              <motion.div key={r.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                <Card className="hover:shadow-md transition-shadow border-border/50">
                  <CardContent className="p-5">
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                      {/* Driver info */}
                      <div className="flex items-center gap-3 min-w-[180px]">
                        <div className="w-11 h-11 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
                          {r.avatar}
                        </div>
                        <div>
                          <p className="font-medium text-sm">{r.driver}</p>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Star className="w-3 h-3 text-accent fill-accent" /> {r.rating}
                          </div>
                        </div>
                      </div>

                      {/* Route */}
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2 text-sm">
                          <span className="font-medium">{r.from}</span>
                          <span className="text-muted-foreground">→</span>
                          <span className="font-medium">{r.to}</span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{r.date} à {r.time}</span>
                          <span className="flex items-center gap-1"><Users className="w-3 h-3" />{r.seats} places</span>
                          <span className="flex items-center gap-1"><Car className="w-3 h-3" />{r.car}</span>
                        </div>
                      </div>

                      {/* Badge + price */}
                      <div className="flex items-center gap-3">
                        {r.type === "available" ? (
                          <span className="px-2.5 py-1 rounded-full bg-success/10 text-success text-xs font-medium">🟢 Dispo</span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full bg-secondary/10 text-secondary text-xs font-medium">📍 Planifié</span>
                        )}
                        <div className="text-right">
                          {r.price > 0 ? (
                            <span className="font-display text-xl font-bold">{r.price}$</span>
                          ) : (
                            <span className="text-sm text-muted-foreground">À convenir</span>
                          )}
                        </div>
                        <Button size="sm" className="gradient-primary border-0">Réserver</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <Card className="h-[500px] flex items-center justify-center border-border/50">
            <div className="text-center text-muted-foreground space-y-2">
              <MapIcon className="w-12 h-12 mx-auto opacity-50" />
              <p className="font-display font-semibold">Carte interactive</p>
              <p className="text-sm">La carte sera disponible avec l'intégration Google Maps</p>
            </div>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default SearchPage;
