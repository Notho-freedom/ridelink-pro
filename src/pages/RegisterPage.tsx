import React from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Car, Mail, Lock, User } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

const RegisterPage = () => {
  const { toast } = useToast();

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: "Compte créé !", description: "Bienvenue dans la communauté RideFlow." });
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-16 flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-4">
              <Car className="w-7 h-7 text-primary-foreground" />
            </div>
            <h1 className="font-display text-2xl font-bold">Créer un compte</h1>
            <p className="text-muted-foreground text-sm mt-1">Rejoignez RideFlow en quelques secondes</p>
          </div>
          <Card className="border-border/50">
            <CardContent className="p-6">
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Prénom</Label>
                    <Input placeholder="Jean" required />
                  </div>
                  <div className="space-y-2">
                    <Label>Nom</Label>
                    <Input placeholder="Dupont" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input type="email" placeholder="votre@email.com" className="pl-10" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Téléphone</Label>
                  <Input type="tel" placeholder="+1 (514) 000-0000" />
                </div>
                <div className="space-y-2">
                  <Label>Mot de passe</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input type="password" placeholder="••••••••" className="pl-10" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Vous êtes :</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {["Conducteur", "Passager", "Les deux"].map((role) => (
                      <label key={role} className="flex items-center justify-center p-3 rounded-lg border border-border hover:border-primary cursor-pointer text-sm transition-colors has-[:checked]:border-primary has-[:checked]:bg-primary/5">
                        <input type="radio" name="role" value={role} className="sr-only" defaultChecked={role === "Les deux"} />
                        {role}
                      </label>
                    ))}
                  </div>
                </div>
                <Button type="submit" className="w-full gradient-primary border-0">Créer mon compte</Button>
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
