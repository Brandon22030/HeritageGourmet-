
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

interface CreateFamilyGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const CreateFamilyGroupModal: React.FC<CreateFamilyGroupModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: 'Non connecté',
        description: 'Veuillez vous connecter pour créer un groupe familial',
        variant: 'destructive',
      });
      return;
    }

    if (!name.trim()) {
      toast({
        title: 'Nom requis',
        description: 'Veuillez saisir un nom pour votre livre de famille',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsLoading(true);
      
      // Création du groupe familial
      const { data: groupData, error: groupError } = await supabase
        .from('family_groups')
        .insert({
          name,
          description,
          created_by: user.id,
        })
        .select('id')
        .single();
      
      if (groupError) throw groupError;
      
      // Ajout du créateur comme membre du groupe avec le rôle d'administrateur
      const { error: memberError } = await supabase
        .from('family_group_members')
        .insert({
          group_id: groupData.id,
          user_id: user.id,
          role: 'admin',
        });
      
      if (memberError) throw memberError;
      
      toast({
        title: 'Groupe créé',
        description: 'Votre livre de famille a été créé avec succès',
      });
      
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Erreur lors de la création du groupe:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de créer le groupe familial',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => !isLoading && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-serif">Créer un nouveau livre de famille</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nom du livre de famille</Label>
            <Input
              id="name"
              placeholder="ex: Recettes de Famille Dupont"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description (optionnelle)</Label>
            <Textarea
              id="description"
              placeholder="Racontez l'histoire de ce livre de famille..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isLoading}
              rows={3}
            />
          </div>
          
          <DialogFooter className="sm:justify-between mt-6">
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Annuler
            </Button>
            <Button type="submit" className="bg-terracotta hover:bg-terracotta/90" disabled={isLoading}>
              {isLoading ? 'Création...' : 'Créer le livre'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateFamilyGroupModal;
