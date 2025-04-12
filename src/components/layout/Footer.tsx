
import React from 'react';
import { Link } from 'react-router-dom';
import { Book, Instagram, Facebook, Twitter } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-brown text-cream py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center space-x-2">
              <Book className="w-8 h-8 text-cream" />
              <h2 className="text-2xl font-serif font-bold">CulinariaLegacy</h2>
            </Link>
            <p className="mt-4">Préservez et partagez l'héritage culinaire de votre famille.</p>
            <div className="flex space-x-4 mt-6">
              <a href="#" className="text-cream hover:text-honey transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-cream hover:text-honey transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-cream hover:text-honey transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-serif text-lg font-semibold mb-4">Navigation</h3>
            <ul className="space-y-2">
              <li><Link to="/bibliotheque" className="hover:text-honey transition-colors">Bibliothèque</Link></li>
              <li><Link to="/explorer" className="hover:text-honey transition-colors">Explorer</Link></li>
              <li><Link to="/planification" className="hover:text-honey transition-colors">Planification</Link></li>
              <li><Link to="/famille" className="hover:text-honey transition-colors">Héritage Familial</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-serif text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li><Link to="/aide" className="hover:text-honey transition-colors">Centre d'aide</Link></li>
              <li><Link to="/contact" className="hover:text-honey transition-colors">Contact</Link></li>
              <li><Link to="/faq" className="hover:text-honey transition-colors">FAQ</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-serif text-lg font-semibold mb-4">Légal</h3>
            <ul className="space-y-2">
              <li><Link to="/conditions" className="hover:text-honey transition-colors">Conditions d'utilisation</Link></li>
              <li><Link to="/confidentialite" className="hover:text-honey transition-colors">Politique de confidentialité</Link></li>
              <li><Link to="/cookies" className="hover:text-honey transition-colors">Cookies</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-6 border-t border-cream/20 text-center">
          <p>&copy; {new Date().getFullYear()} CulinariaLegacy. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
