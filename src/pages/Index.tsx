import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import LocationAutocomplete from "@/components/LocationAutocomplete";
import { motion } from "framer-motion";
import {
  Search, MapPin, Clock, Users, Car, Zap, Shield, CreditCard,
  ArrowRight, CheckCircle, Navigation, Radio
} from "lucide-react";

const features = [
  { icon: <Radio className="w-6 h-6" />, title: "Mode Disponible", desc: "Signalez que vous êtes libre. Les passagers vous trouvent automatiquement." },
  { icon: <Navigation className="w-6 h-6" />, title: "Matching Intelligent", desc: "Offre et demande se rencontrent en temps réel." },
  { icon: <Shield className="w-6 h-6" />, title: "Profils Vérifiés", desc: "Voyagez en confiance avec des profils vérifiés." },
  { icon: <CreditCard className="w-6 h-6" />, title: "Paiement Flexible", desc: "Payez en ligne ou en cash." },
  { icon: <Zap className="w-6 h-6" />, title: "Demande Ouverte", desc: "Publiez votre besoin. Les chauffeurs vous contactent." },
  { icon: <Users className="w-6 h-6" />, title: "Chat Intégré", desc: "Communiquez facilement avec votre conducteur ou passager." },
];

const steps = [
  { num: "01", title: "Publiez ou Recherchez", desc: "Créez un trajet, activez le mode dispo, ou recherchez un conducteur." },
  { num: "02", title: "Match & Contact", desc: "Le système connecte chauffeurs et passagers compatibles." },
  { num: "03", title: "Voyagez ensemble", desc: "Confirmez, payez et partagez la route." },
];

const Index = () => {
  const navigate = useNavigate();
  const [fromData, setFromData] = useState({ city: "", lat: 0, lng: 0 });
  const [toData, setToData] = useState({ city: "", lat: 0, lng: 0 });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/search?from=${encodeURIComponent(fromData.city)}&to=${encodeURIComponent(toData.city)}`);
  };

  return (
    <Layout>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-primary opacity-5" />
        <div className="container mx-auto px-4 py-12 md:py-32 relative">
          <div className="max-w-3xl mx-auto text-center space-y-5">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs md:text-sm font-medium mb-3">
                <Zap className="w-3.5 h-3.5" /> Le covoiturage nouvelle génération
              </span>
              <h1 className="font-display text-3xl md:text-6xl font-bold leading-tight">
                Voyagez <span className="gradient-text">ensemble</span>,{" "}
                <br className="hidden md:block" />en toute liberté
              </h1>
              <p className="text-base md:text-xl text-muted-foreground mt-3 max-w-2xl mx-auto">
                Conducteur dispo ou passager en recherche — RideFlow connecte l'offre et la demande en temps réel.
              </p>
            </motion.div>

            <motion.form
              onSubmit={handleSearch}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="glass rounded-2xl p-3 md:p-4 max-w-2xl mx-auto"
            >
              <div className="flex flex-col md:flex-row gap-3">
                <div className="flex-1">
                  <LocationAutocomplete
                    placeholder="Ville de départ"
                    onSelect={r => setFromData({ city: r.city, lat: r.lat, lng: r.lng })}
                    className="bg-background/50 border-border/50"
                  />
                </div>
                <div className="flex-1">
                  <LocationAutocomplete
                    placeholder="Ville d'arrivée"
                    iconColor="text-secondary"
                    onSelect={r => setToData({ city: r.city, lat: r.lat, lng: r.lng })}
                    className="bg-background/50 border-border/50"
                  />
                </div>
                <Button type="submit" className="gradient-primary border-0 px-6 min-h-[44px]">
                  <Search className="w-4 h-4 mr-2" /> Rechercher
                </Button>
              </div>
            </motion.form>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
              className="flex flex-wrap items-center justify-center gap-4 md:gap-6 text-xs md:text-sm text-muted-foreground pt-2">
              <span className="flex items-center gap-1"><CheckCircle className="w-4 h-4 text-success" /> Gratuit</span>
              <span className="flex items-center gap-1"><CheckCircle className="w-4 h-4 text-success" /> Paiement flexible</span>
              <span className="flex items-center gap-1"><CheckCircle className="w-4 h-4 text-success" /> Mode dispo</span>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 md:py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="font-display text-2xl md:text-4xl font-bold">Pourquoi <span className="gradient-text">RideFlow</span> ?</h2>
            <p className="text-muted-foreground mt-2 max-w-lg mx-auto text-sm md:text-base">On a résolu les problèmes que les autres apps ignorent.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 max-w-5xl mx-auto">
            {features.map((f, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <Card className="h-full hover:shadow-lg transition-shadow border-border/50 bg-card/80">
                  <CardContent className="p-5 space-y-3">
                    <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center text-primary">{f.icon}</div>
                    <h3 className="font-display font-semibold text-base md:text-lg">{f.title}</h3>
                    <p className="text-sm text-muted-foreground">{f.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="font-display text-2xl md:text-4xl font-bold">Comment ça <span className="gradient-text">marche</span> ?</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-4xl mx-auto">
            {steps.map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }} className="text-center space-y-2">
                <span className="font-display text-4xl md:text-5xl font-bold gradient-text">{s.num}</span>
                <h3 className="font-display font-semibold text-lg md:text-xl">{s.title}</h3>
                <p className="text-sm text-muted-foreground">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="gradient-primary rounded-2xl md:rounded-3xl p-8 md:p-16 text-center text-primary-foreground max-w-4xl mx-auto">
            <h2 className="font-display text-2xl md:text-4xl font-bold">Prêt à voyager autrement ?</h2>
            <p className="mt-3 text-primary-foreground/80 max-w-lg mx-auto text-sm md:text-base">Rejoignez RideFlow et profitez du covoiturage sans limites.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
              <Button size="lg" variant="secondary" className="bg-white text-foreground hover:bg-white/90 min-h-[44px]" onClick={() => navigate("/register")}>
                Créer un compte <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button size="lg" variant="outline" className="border-white/30 text-primary-foreground hover:bg-white/10 min-h-[44px]" onClick={() => navigate("/search")}>
                Explorer les trajets
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
