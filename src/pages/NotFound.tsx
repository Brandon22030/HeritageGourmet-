
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { BookOpen } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
      <div className="mb-6 relative">
        <BookOpen className="w-24 h-24 text-terracotta" />
        <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-2xl font-bold">404</span>
      </div>
      <h1 className="text-4xl font-serif font-bold mb-4">Page introuvable</h1>
      <p className="text-xl mb-8 max-w-md">
        La recette que vous recherchez semble ne pas exister. Peut-être a-t-elle été déplacée ou supprimée.
      </p>
      <Button asChild className="bg-terracotta hover:bg-terracotta/90">
        <Link to="/">Retourner à l'accueil</Link>
      </Button>
    </div>
  );
};

export default NotFound;
