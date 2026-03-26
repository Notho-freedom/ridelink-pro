import React, { useState } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Clock, Users, DollarSign, Car, Radio, CalendarDays } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

const PublishPage = () => {
  const { toast } = useToast();

  const handleSubmitTrip = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: "Trajet publié !", description: "Votre trajet est maintenant visible par les passagers." });
  };

  const handleSubmitAvailable = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: "Mode dispo activé ! 🟢", description: "Les passagers dans votre zone peuvent vous trouver." });
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-display text-3xl font-bold mb-2">Publier</h1>
          <p className="text-muted-foreground mb-8">Proposez un trajet ou signalez votre disponibilité.</p>

          <Tabs defaultValue="trip" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 h-12">
              <TabsTrigger value="trip" className="flex items-center gap-2 text-sm">
                <Car className="w-4 h-4" /> Trajet planifié
              </TabsTrigger>
              <TabsTrigger value="available" className="flex items-center gap-2 text-sm">
                <Radio className="w-4 h-4" /> Je suis dispo
              </TabsTrigger>
            </TabsList>

            <TabsContent value="trip">
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="font-display text-xl">Nouveau trajet</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmitTrip} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Ville de départ</Label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                          <Input placeholder="Ex: Montréal" className="pl-10" required />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Ville d'arrivée</Label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary" />
                          <Input placeholder="Ex: Ottawa" className="pl-10" required />
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label>Date</Label>
                        <Input type="date" required />
                      </div>
                      <div className="space-y-2">
                        <Label>Heure de départ</Label>
                        <Input type="time" required />
                      </div>
                      <div className="space-y-2">
                        <Label>Places disponibles</Label>
                        <Input type="number" min={1} max={8} defaultValue={3} required />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Prix par place ($)</Label>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input type="number" min={0} placeholder="25" className="pl-10" required />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Véhicule</Label>
                        <div className="relative">
                          <Car className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input placeholder="Ex: Toyota Camry" className="pl-10" />
                        </div>
                      </div>
                    </div>
                    <Button type="submit" className="w-full gradient-primary border-0" size="lg">
                      Publier le trajet
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="available">
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="font-display text-xl flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-success animate-pulse" />
                    Mode Disponible
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmitAvailable} className="space-y-4">
                    <div className="space-y-2">
                      <Label>Votre zone (ville)</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                        <Input placeholder="Ex: Montréal" className="pl-10" required />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Rayon de disponibilité (km)</Label>
                      <Input type="number" min={5} max={200} defaultValue={50} required />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Disponible de</Label>
                        <Input type="time" required />
                      </div>
                      <div className="space-y-2">
                        <Label>Jusqu'à</Label>
                        <Input type="time" required />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Date</Label>
                      <Input type="date" required />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Places disponibles</Label>
                        <Input type="number" min={1} max={8} defaultValue={4} required />
                      </div>
                      <div className="space-y-2">
                        <Label>Véhicule</Label>
                        <Input placeholder="Ex: Honda Civic" />
                      </div>
                    </div>
                    <Button type="submit" className="w-full bg-success hover:bg-success/90 text-success-foreground border-0" size="lg">
                      <Radio className="w-4 h-4 mr-2" /> Activer le mode dispo
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
