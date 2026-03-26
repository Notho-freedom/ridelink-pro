import React from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Car, Users, MapPin, Clock, Star, MessageCircle, CreditCard, Radio, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const stats = [
  { label: "Trajets effectués", value: "12", icon: <Car className="w-5 h-5" /> },
  { label: "Passagers transportés", value: "34", icon: <Users className="w-5 h-5" /> },
  { label: "Note moyenne", value: "4.8", icon: <Star className="w-5 h-5" /> },
  { label: "Revenus", value: "580$", icon: <CreditCard className="w-5 h-5" /> },
];

const myTrips = [
  { id: 1, from: "Montréal", to: "Ottawa", date: "28 Mars", time: "10:00", seats: 3, booked: 1, status: "active" },
  { id: 2, from: "Ottawa", to: "Toronto", date: "30 Mars", time: "08:00", seats: 4, booked: 2, status: "active" },
];

const myRequests = [
  { id: 1, from: "Gatineau", to: "Montréal", date: "29 Mars", time: "06:30", status: "pending" },
];

const Dashboard = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-display text-3xl font-bold">Tableau de bord</h1>
              <p className="text-muted-foreground">Bienvenue ! Gérez vos trajets et demandes.</p>
            </div>
            <Link to="/publish">
              <Button className="gradient-primary border-0"><Plus className="w-4 h-4 mr-2" />Nouveau trajet</Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {stats.map((s, i) => (
              <Card key={i} className="border-border/50">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">{s.icon}</div>
                  <div>
                    <p className="font-display text-2xl font-bold">{s.value}</p>
                    <p className="text-xs text-muted-foreground">{s.label}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Tabs defaultValue="trips" className="space-y-4">
            <TabsList>
              <TabsTrigger value="trips">Mes trajets</TabsTrigger>
              <TabsTrigger value="requests">Mes demandes</TabsTrigger>
              <TabsTrigger value="messages">Messages</TabsTrigger>
            </TabsList>

            <TabsContent value="trips">
              <div className="space-y-3">
                {myTrips.map((t) => (
                  <Card key={t.id} className="border-border/50">
                    <CardContent className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary">
                          <Car className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">{t.from} → {t.to}</p>
                          <p className="text-xs text-muted-foreground flex items-center gap-2">
                            <Clock className="w-3 h-3" />{t.date} à {t.time}
                            <Users className="w-3 h-3 ml-2" />{t.booked}/{t.seats} places
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">Modifier</Button>
                        <Button variant="destructive" size="sm">Annuler</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="requests">
              <div className="space-y-3">
                {myRequests.map((r) => (
                  <Card key={r.id} className="border-border/50">
                    <CardContent className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center text-accent-foreground">
                          <MapPin className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">{r.from} → {r.to}</p>
                          <p className="text-xs text-muted-foreground flex items-center gap-2">
                            <Clock className="w-3 h-3" />{r.date} à {r.time}
                          </p>
                        </div>
                      </div>
                      <span className="px-3 py-1 rounded-full bg-warning/10 text-warning text-xs font-medium">En attente</span>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="messages">
              <Card className="border-border/50">
                <CardContent className="p-8 text-center text-muted-foreground">
                  <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p className="font-display font-semibold">Aucun message</p>
                  <p className="text-sm">Vos conversations apparaîtront ici après un match.</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </Layout>
  );
};

export default Dashboard;
