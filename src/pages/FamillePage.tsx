
import React, { useState, useEffect } from 'react';
import { Book, Heart, Share2, UserPlus, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import CreateFamilyGroupModal from '@/components/famille/CreateFamilyGroupModal';
import JoinFamilyGroupModal from '@/components/famille/JoinFamilyGroupModal';

interface FamilyGroup {
  id: string;
  name: string;
  description?: string;
  recipeCount: number;
  memberCount: number;
}

const FamillePage = () => {
  const [familyGroups, setFamilyGroups] = useState<FamilyGroup[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const { user } = useAuth();

  const fetchFamilyGroups = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      
      // Récupérer les groupes familiaux dont l'utilisateur est membre
      const { data: memberGroups, error: memberError } = await supabase
        .from('family_group_members')
        .select(`
          group_id,
          family_groups:group_id (
            id,
            name,
            description
          )
        `)
        .eq('user_id', user.id);
      
      if (memberError) throw memberError;
      
      if (!memberGroups || memberGroups.length === 0) {
        setFamilyGroups([]);
        setIsLoading(false);
        return;
      }
      
      // Extraire les IDs des groupes
      const groupIds = memberGroups.map(item => item.family_groups.id);
      
      // Construire la liste des groupes avec des compteurs par défaut
      const groupsWithCounts = memberGroups.map(item => {
        const group = item.family_groups;
        return {
          id: group.id,
          name: group.name,
          description: group.description,
          recipeCount: 0,
          memberCount: 0
        };
      });
      
      // Pour chaque groupe, compter le nombre de membres
      const memberCountPromises = groupIds.map(async (groupId) => {
        const { count, error } = await supabase
          .from('family_group_members')
          .select('id', { count: 'exact', head: true })
          .eq('group_id', groupId);
          
        return { groupId, count: count || 0, error };
      });
      
      // Pour chaque groupe, compter le nombre de recettes
      const recipeCountPromises = groupIds.map(async (groupId) => {
        const { count, error } = await supabase
          .from('family_recipes')
          .select('id', { count: 'exact', head: true })
          .eq('family_group_id', groupId);
          
        return { groupId, count: count || 0, error };
      });
      
      // Attendre que tous les comptages soient terminés
      const memberCounts = await Promise.all(memberCountPromises);
      const recipeCounts = await Promise.all(recipeCountPromises);
      
      // Mettre à jour les compteurs dans la liste des groupes
      const updatedGroups = groupsWithCounts.map(group => {
        const memberCount = memberCounts.find(m => m.groupId === group.id)?.count || 0;
        const recipeCount = recipeCounts.find(r => r.groupId === group.id)?.count || 0;
        
        return {
          ...group,
          memberCount,
          recipeCount
        };
      });
      
      setFamilyGroups(updatedGroups);
    } catch (error) {
      console.error('Erreur lors du chargement des groupes familiaux:', error);
      toast({
        title: 'Erreur de chargement',
        description: 'Impossible de charger vos livres de famille',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchFamilyGroups();
    }
  }, [user]);

  const handleCreateGroup = () => {
    if (!user) {
      toast({
        title: 'Non connecté',
        description: 'Veuillez vous connecter pour créer un groupe familial',
        variant: 'destructive',
      });
      return;
    }
    
    setIsCreateModalOpen(true);
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
    
    setIsJoinModalOpen(true);
  };

  const handleShareGroup = async (groupId: string) => {
    if (!user) return;
    
    try {
      // Générer un code d'invitation unique
      const inviteCode = Math.random().toString(36).substring(2, 10).toUpperCase();
      
      // Définir une date d'expiration (par exemple, dans 7 jours)
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + 7);
      
      // Enregistrer le code d'invitation dans la base de données
      const { error } = await supabase
        .from('family_group_invites')
        .insert({
          group_id: groupId,
          code: inviteCode,
          expiry_date: expiryDate.toISOString(),
          created_by: user.id
        });
      
      if (error) throw error;
      
      // Copier le code dans le presse-papier
      await navigator.clipboard.writeText(inviteCode);
      
      toast({
        title: 'Invitation générée',
        description: `Code: ${inviteCode} (valide pendant 7 jours, copié dans le presse-papier)`,
      });
    } catch (error) {
      console.error('Erreur lors de la génération du code:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de générer un code d\'invitation',
        variant: 'destructive',
      });
    }
  };

  const handleViewRecipes = (groupId: string) => {
    // Fonctionnalité à implémenter
    toast({
      title: 'Fonctionnalité à venir',
      description: 'Cette fonctionnalité sera bientôt disponible',
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
                    {group.description && (
                      <p className="text-gray-600 text-sm mb-3">{group.description}</p>
                    )}
                    <div className="flex items-center text-sm text-gray-600 mb-4">
                      <Book className="h-4 w-4 mr-1" />
                      <span>{group.recipeCount} recettes</span>
                      <span className="mx-2">•</span>
                      <UserPlus className="h-4 w-4 mr-1" />
                      <span>{group.memberCount} membres</span>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleViewRecipes(group.id)}>
                        <Heart className="h-4 w-4 mr-1" />
                        Voir les recettes
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleShareGroup(group.id)}>
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
      
      {/* Modals */}
      <CreateFamilyGroupModal 
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={fetchFamilyGroups}
      />
      
      <JoinFamilyGroupModal
        isOpen={isJoinModalOpen}
        onClose={() => setIsJoinModalOpen(false)}
        onSuccess={fetchFamilyGroups}
      />
    </div>
  );
};

export default FamillePage;
