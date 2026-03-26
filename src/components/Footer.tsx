import React from "react";
import { Link } from "react-router-dom";
import { Car, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => (
  <footer className="bg-card border-t border-border">
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="space-y-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg gradient-primary flex items-center justify-center">
              <Car className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-display text-xl font-bold gradient-text">RideFlow</span>
          </Link>
          <p className="text-sm text-muted-foreground">
            Le covoiturage réinventé. Connectez-vous avec des conducteurs disponibles en temps réel.
          </p>
        </div>

        <div>
          <h4 className="font-display font-semibold mb-4">Navigation</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/search" className="hover:text-primary transition-colors">Rechercher un trajet</Link></li>
            <li><Link to="/publish" className="hover:text-primary transition-colors">Publier un trajet</Link></li>
            <li><Link to="/dashboard" className="hover:text-primary transition-colors">Tableau de bord</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-display font-semibold mb-4">Légal</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><a href="#" className="hover:text-primary transition-colors">Conditions d'utilisation</a></li>
            <li><a href="#" className="hover:text-primary transition-colors">Politique de confidentialité</a></li>
            <li><a href="#" className="hover:text-primary transition-colors">CGV</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-display font-semibold mb-4">Contact</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-2"><Mail className="w-4 h-4" /> contact@rideflow.app</li>
            <li className="flex items-center gap-2"><MapPin className="w-4 h-4" /> Mondial</li>
          </ul>
        </div>
      </div>

      <div className="mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} RideFlow. Tous droits réservés.
      </div>
    </div>
  </footer>
);

export default Footer;
