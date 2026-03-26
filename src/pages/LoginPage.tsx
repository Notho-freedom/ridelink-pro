import React, { useState } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Car, Mail, Lock, User, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

const LoginPage = () => {
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: "Connexion réussie", description: "Bienvenue sur RideFlow !" });
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-16 flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-4">
              <Car className="w-7 h-7 text-primary-foreground" />
            </div>
            <h1 className="font-display text-2xl font-bold">Connexion</h1>
            <p className="text-muted-foreground text-sm mt-1">Accédez à votre compte RideFlow</p>
          </div>
          <Card className="border-border/50">
            <CardContent className="p-6">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label>Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input type="email" placeholder="votre@email.com" className="pl-10" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Mot de passe</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input type="password" placeholder="••••••••" className="pl-10" required />
                  </div>
                </div>
                <Button type="submit" className="w-full gradient-primary border-0">Se connecter</Button>
              </form>
              <p className="text-center text-sm text-muted-foreground mt-4">
                Pas encore de compte ? <Link to="/register" className="text-primary font-medium hover:underline">S'inscrire</Link>
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </Layout>
  );
};

export default LoginPage;
