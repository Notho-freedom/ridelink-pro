import React, { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { User, Phone, Mail, MapPin, Car, Save, LogOut } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const { profile, user, signOut, refreshProfile } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    first_name: "", last_name: "", phone: "", city: "", country: "", role: "both" as "driver" | "passenger" | "both",
  });

  useEffect(() => {
    if (profile) {
      setForm({
        first_name: profile.first_name || "",
        last_name: profile.last_name || "",
        phone: profile.phone || "",
        city: profile.city || "",
        country: profile.country || "",
        role: profile.role,
      });
    }
  }, [profile]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    const { error } = await supabase.from("profiles").update(form).eq("user_id", user.id);
    setLoading(false);
    if (error) {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    } else {
      await refreshProfile();
      toast({ title: "Profil mis à jour !" });
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  const initials = `${form.first_name?.[0] || ""}${form.last_name?.[0] || ""}`.toUpperCase() || "?";

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6 md:py-8 max-w-lg pb-24 md:pb-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex flex-col items-center mb-6">
            <Avatar className="w-20 h-20 mb-3">
              <AvatarFallback className="gradient-primary text-primary-foreground text-2xl font-bold">{initials}</AvatarFallback>
            </Avatar>
            <h1 className="font-display text-2xl font-bold">Mon profil</h1>
            <p className="text-muted-foreground text-sm">{user?.email}</p>
          </div>

          <Card className="border-border/50">
            <CardContent className="p-5">
              <form onSubmit={handleSave} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>Prénom</Label>
                    <Input value={form.first_name} onChange={e => setForm(p => ({ ...p, first_name: e.target.value }))} />
                  </div>
                  <div className="space-y-2">
                    <Label>Nom</Label>
                    <Input value={form.last_name} onChange={e => setForm(p => ({ ...p, last_name: e.target.value }))} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Téléphone</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input placeholder="+1 (514) 000-0000" className="pl-10" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>Ville</Label>
                    <Input placeholder="Montréal" value={form.city} onChange={e => setForm(p => ({ ...p, city: e.target.value }))} />
                  </div>
                  <div className="space-y-2">
                    <Label>Pays</Label>
                    <Input placeholder="CA" value={form.country} onChange={e => setForm(p => ({ ...p, country: e.target.value }))} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Rôle</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {([["driver", "Conducteur"], ["passenger", "Passager"], ["both", "Les deux"]] as const).map(([val, label]) => (
                      <button
                        type="button"
                        key={val}
                        onClick={() => setForm(p => ({ ...p, role: val }))}
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
                  <Save className="w-4 h-4 mr-2" /> {loading ? "Enregistrement..." : "Enregistrer"}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Button variant="outline" className="w-full mt-4 min-h-[44px] text-destructive hover:text-destructive" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" /> Se déconnecter
          </Button>
        </motion.div>
      </div>
    </Layout>
  );
};

export default ProfilePage;
