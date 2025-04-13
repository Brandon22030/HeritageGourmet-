
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

interface JoinFamilyGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const JoinFamilyGroupModal: React.FC<JoinFamilyGroupModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const [inviteCode, setInviteCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: 'Non connecté',
        description: 'Veuillez vous connecter pour rejoindre un groupe familial',
        variant: 'destructive',
      });
      return;
    }

    if (!inviteCode.trim()) {
      toast({
        title: 'Code requis',
        description: 'Veuillez saisir le code d\'invitation',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsLoading(true);
      
      // Vérifier si le code d'invitation est valide
      const { data: inviteData, error: inviteError } = await supabase
        .from('family_group_invites')
        .select('group_id, expiry_date')
        .eq('code', inviteCode.trim())
        .single();
      
      if (inviteError) {
        toast({
          title: 'Code invalide',
          description: 'Le code d\'invitation n\'existe pas ou a expiré',
          variant: 'destructive',
        });
        return;
      }
      
      // Vérifier si l'invitation n'a pas expiré
      if (inviteData.expiry_date && new Date(inviteData.expiry_date) < new Date()) {
        toast({
          title: 'Code expiré',
          description: 'Cette invitation a expiré',
          variant: 'destructive',
        });
        return;
      }
      
      // Vérifier si l'utilisateur est déjà membre du groupe
      const { data: existingMember, error: memberCheckError } = await supabase
        .from('family_group_members')
        .select('id')
        .eq('group_id', inviteData.group_id)
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (existingMember) {
        toast({
          title: 'Déjà membre',
          description: 'Vous êtes déjà membre de ce groupe familial',
          variant: 'destructive',
        });
        return;
      }
      
      // Ajouter l'utilisateur comme membre du groupe
      const { error: joinError } = await supabase
        .from('family_group_members')
        .insert({
          group_id: inviteData.group_id,
          user_id: user.id,
          role: 'member',
        });
      
      if (joinError) throw joinError;
      
      toast({
        title: 'Bienvenue !',
        description: 'Vous avez rejoint le livre de famille avec succès',
      });
      
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Erreur lors de l\'adhésion au groupe:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de rejoindre le groupe familial',
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
          <DialogTitle className="text-xl font-serif">Rejoindre un livre de famille</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="inviteCode">Code d'invitation</Label>
            <Input
              id="inviteCode"
              placeholder="Saisissez le code d'invitation"
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value)}
              disabled={isLoading}
              required
            />
            <p className="text-sm text-gray-500">
              Un membre de votre famille doit vous avoir envoyé un code d'invitation.
            </p>
          </div>
          
          <DialogFooter className="sm:justify-between mt-6">
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Annuler
            </Button>
            <Button type="submit" className="bg-terracotta hover:bg-terracotta/90" disabled={isLoading}>
              {isLoading ? 'Vérification...' : 'Rejoindre'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default JoinFamilyGroupModal;
