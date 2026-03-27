import React, { useState } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Car, Mail, Lock } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const RegisterPage = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", phone: "", password: "", role: "both" as "driver" | "passenger" | "both",
  });

  const update = (key: string, val: string) => setForm(p => ({ ...p, [key]: val }));

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        emailRedirectTo: window.location.origin,
        data: { first_name: form.firstName, last_name: form.lastName },
      },
    });
    setLoading(false);
    if (error) {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    } else {
      // Update profile with phone and role
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from("profiles").update({
          phone: form.phone || null,
          role: form.role,
        }).eq("user_id", user.id);
      }
      toast({ title: "Compte créé !", description: "Bienvenue dans la communauté RideFlow." });
      navigate("/dashboard");
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 md:py-16 flex items-center justify-center min-h-[calc(100vh-4rem-4rem)]">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-3">
              <Car className="w-6 h-6 text-primary-foreground" />
            </div>
            <h1 className="font-display text-2xl font-bold">Créer un compte</h1>
            <p className="text-muted-foreground text-sm mt-1">Rejoignez RideFlow en quelques secondes</p>
          </div>
          <Card className="border-border/50">
            <CardContent className="p-5">
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>Prénom</Label>
                    <Input placeholder="Jean" required value={form.firstName} onChange={e => update("firstName", e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Nom</Label>
                    <Input placeholder="Dupont" required value={form.lastName} onChange={e => update("lastName", e.target.value)} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input type="email" placeholder="votre@email.com" className="pl-10" required value={form.email} onChange={e => update("email", e.target.value)} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Téléphone</Label>
                  <Input type="tel" placeholder="+1 (514) 000-0000" value={form.phone} onChange={e => update("phone", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Mot de passe</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input type="password" placeholder="••••••••" className="pl-10" required minLength={6} value={form.password} onChange={e => update("password", e.target.value)} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Vous êtes :</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {([["driver", "Conducteur"], ["passenger", "Passager"], ["both", "Les deux"]] as const).map(([val, label]) => (
                      <button
                        type="button"
                        key={val}
                        onClick={() => update("role", val)}
                        className={`p-3 rounded-lg border text-sm transition-colors min-h-[44px] ${
                          form.role === val ? "border-primary bg-primary/5 text-primary font-medium" : "border-border hover:border-primary/50"
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
                <Button type="submit" className="w-full gradient-primary border-0 min-h-[44px]" disabled={loading}>
                  {loading ? "Création..." : "Créer mon compte"}
                </Button>
              </form>
              <p className="text-center text-sm text-muted-foreground mt-4">
                Déjà un compte ? <Link to="/login" className="text-primary font-medium hover:underline">Se connecter</Link>
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </Layout>
  );
};

export default RegisterPage;
