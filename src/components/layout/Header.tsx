
import React from 'react';
import { Link } from 'react-router-dom';
import { Book, Search, User, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Header = () => {
  return (
    <header className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="flex items-center space-x-2">
            <Book className="w-8 h-8 text-terracotta" />
            <h1 className="text-2xl font-serif font-bold text-terracotta">
              CulinariaLegacy
            </h1>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/bibliotheque" className="nav-link">Bibliothèque</Link>
            <Link to="/explorer" className="nav-link">Explorer</Link>
            <Link to="/planification" className="nav-link">Planification</Link>
            <Link to="/famille" className="nav-link">Héritage Familial</Link>
          </nav>
          
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="text-brown">
              <Search className="w-5 h-5" />
            </Button>
            <Button variant="outline" className="hidden md:flex gap-2 border-terracotta text-terracotta hover:bg-terracotta/10">
              <PlusCircle className="w-4 h-4" />
              <span>Nouvelle Recette</span>
            </Button>
            <Button variant="ghost" size="icon" className="text-brown">
              <User className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
