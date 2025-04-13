
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Book, Search, User, PlusCircle, LogIn, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const Header = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleAuthClick = () => {
    if (user) {
      // Rien ici - le menu dropdown s'occupera de ça
    } else {
      navigate('/auth');
    }
  };

  const handleNewRecipe = () => {
    if (!user) {
      navigate('/auth');
      return;
    }
    // Naviguer vers la page de création de recette (à implémenter plus tard)
  };

  const getUserInitials = () => {
    if (!user) return 'U';
    
    const email = user.email || '';
    if (email) {
      return email.substring(0, 2).toUpperCase();
    }
    
    return 'U';
  };

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
            
            <Button 
              variant="outline" 
              className="hidden md:flex gap-2 border-terracotta text-terracotta hover:bg-terracotta/10"
              onClick={handleNewRecipe}
            >
              <PlusCircle className="w-4 h-4" />
              <span>Nouvelle Recette</span>
            </Button>
            
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-brown">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-terracotta/20 text-terracotta">
                        {getUserInitials()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profil</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Book className="mr-2 h-4 w-4" />
                    <span>Mes recettes</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => signOut()}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Déconnexion</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-brown"
                onClick={handleAuthClick}
              >
                <LogIn className="w-5 h-5" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
