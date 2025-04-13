
import React, { useState, useEffect } from 'react';
import { Book, Heart, Share2, UserPlus, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface FamilyGroup {
  id: string;
  name: string;
  recipeCount: number;
  memberCount: number;
}

const mockFamilyGroups: FamilyGroup[] = [
  {
    id: '1',
    name: 'Recettes de Famille Dupont',
    recipeCount: 24,
    memberCount: 5,
  },
  {
    id: '2',
    name: 'Traditions Culinaires Martin',
    recipeCount: 16,
    memberCount: 3,
  },
];

const FamillePage = () => {
  const [familyGroups, setFamilyGroups] = useState<FamilyGroup[]>(mockFamilyGroups);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  // Simulation du chargement des données
  useEffect(() => {
    // Dans une version complète, nous chargerions les groupes depuis Supabase
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleCreateGroup = () => {
    if (!user) {
      toast({
        title: 'Non connecté',
        description: 'Veuillez vous connecter pour créer un groupe familial',
        variant: 'destructive',
      });
      return;
    }
    
    toast({
      title: 'Fonctionnalité à venir',
      description: 'La création de groupes familiaux sera bientôt disponible',
    });
  };

  const handleJoinGroup = () => {
    if (!user) {
      toast({
        title: 'Non connecté',
        description: 'Veuillez vous connecter pour rejoindre un groupe familial',
        variant: 'destructive',
      });
      return;
    }
    
    toast({
      title: 'Fonctionnalité à venir',
      description: 'Rejoindre un groupe familial sera bientôt disponible',
    });
  };

  const filteredGroups = familyGroups.filter(group =>
    group.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-serif font-bold mb-4">Héritage Familial Culinaire</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Préservez et partagez les recettes qui racontent l'histoire de votre famille
              à travers les générations.
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row gap-4 mb-8 justify-center">
            <Button onClick={handleCreateGroup} className="bg-terracotta hover:bg-terracotta/90">
              <Book className="mr-2 h-4 w-4" />
              Créer un nouveau livre de famille
            </Button>
            <Button onClick={handleJoinGroup} variant="outline">
              <UserPlus className="mr-2 h-4 w-4" />
              Rejoindre un livre existant
            </Button>
          </div>
          
          <div className="relative mb-8">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
            <Input
              placeholder="Rechercher dans vos livres de famille..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          {isLoading ? (
            <div className="text-center py-16">
              <p className="text-gray-600">Chargement de vos livres de famille...</p>
            </div>
          ) : filteredGroups.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredGroups.map((group) => (
                <div key={group.id} className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <div className="p-6">
                    <h3 className="text-xl font-serif font-semibold mb-2">{group.name}</h3>
                    <div className="flex items-center text-sm text-gray-600 mb-4">
                      <Book className="h-4 w-4 mr-1" />
                      <span>{group.recipeCount} recettes</span>
                      <span className="mx-2">•</span>
                      <UserPlus className="h-4 w-4 mr-1" />
                      <span>{group.memberCount} membres</span>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Heart className="h-4 w-4 mr-1" />
                        Voir les recettes
                      </Button>
                      <Button variant="outline" size="sm">
                        <Share2 className="h-4 w-4 mr-1" />
                        Inviter
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-cream/30 rounded-lg">
              <Book className="h-12 w-12 mx-auto text-terracotta/50 mb-2" />
              <h3 className="text-2xl font-serif font-bold mb-2">Aucun livre de famille</h3>
              <p className="text-gray-600 mb-4">
                Vous n'avez pas encore de livre de famille ou aucun ne correspond à votre recherche.
              </p>
              <Button onClick={handleCreateGroup} className="bg-terracotta hover:bg-terracotta/90">
                Créer mon premier livre
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FamillePage;
