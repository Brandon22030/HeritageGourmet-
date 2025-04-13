
import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

interface Recipe {
  id: string;
  title: string;
}

interface AddMealModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  date: Date;
  mealType: string;
}

const AddMealModal: React.FC<AddMealModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  date,
  mealType
}) => {
  const [recipeId, setRecipeId] = useState<string | null>(null);
  const [notes, setNotes] = useState('');
  const [customMeal, setCustomMeal] = useState('');
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchingRecipes, setFetchingRecipes] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const fetchRecipes = async () => {
      if (!user) return;
      
      try {
        setFetchingRecipes(true);
        const { data, error } = await supabase
          .from('recipes')
          .select('id, title')
          .eq('user_id', user.id)
          .order('title', { ascending: true });
        
        if (error) throw error;
        setRecipes(data || []);
      } catch (error) {
        console.error('Erreur lors du chargement des recettes:', error);
        toast({
          title: 'Erreur',
          description: 'Impossible de charger vos recettes',
          variant: 'destructive',
        });
      } finally {
        setFetchingRecipes(false);
      }
    };
    
    if (isOpen) {
      fetchRecipes();
    }
  }, [isOpen, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: 'Non connecté',
        description: 'Veuillez vous connecter pour planifier un repas',
        variant: 'destructive',
      });
      return;
    }

    if (!recipeId && !customMeal.trim()) {
      toast({
        title: 'Information manquante',
        description: 'Veuillez sélectionner une recette ou saisir un repas personnalisé',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsLoading(true);
      
      const formattedDate = format(date, 'yyyy-MM-dd');
      
      const { error } = await supabase
        .from('meal_plans')
        .insert({
          user_id: user.id,
          date: formattedDate,
          meal_type: mealType,
          recipe_id: recipeId,
          custom_meal: !recipeId ? customMeal.trim() : null,
          notes: notes.trim() || null,
        });
      
      if (error) throw error;
      
      toast({
        title: 'Repas planifié',
        description: `${mealType} ajouté pour le ${format(date, 'dd MMMM', { locale: fr })}`,
      });
      
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Erreur lors de la planification du repas:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de planifier ce repas',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formattedDate = format(date, 'EEEE dd MMMM', { locale: fr });

  return (
    <Dialog open={isOpen} onOpenChange={() => !isLoading && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-serif">
            Planifier un {mealType.toLowerCase()}
          </DialogTitle>
          <p className="text-sm text-gray-500 mt-1">
            {formattedDate}
          </p>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="recipeSelect">Choisir une recette</Label>
            <Select
              value={recipeId || ""}
              onValueChange={(value) => {
                setRecipeId(value || null);
                if (value) setCustomMeal('');
              }}
              disabled={isLoading || fetchingRecipes}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une recette" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Aucune recette (repas personnalisé)</SelectItem>
                {recipes.map((recipe) => (
                  <SelectItem key={recipe.id} value={recipe.id}>
                    {recipe.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {!recipeId && (
            <div className="space-y-2">
              <Label htmlFor="customMeal">Repas personnalisé</Label>
              <Input
                id="customMeal"
                placeholder="ex: Dîner au restaurant"
                value={customMeal}
                onChange={(e) => setCustomMeal(e.target.value)}
                disabled={isLoading || !!recipeId}
              />
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (optionnel)</Label>
            <Textarea
              id="notes"
              placeholder="Ajoutez des notes supplémentaires..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              disabled={isLoading}
              rows={2}
            />
          </div>
          
          <DialogFooter className="sm:justify-between mt-6">
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Annuler
            </Button>
            <Button type="submit" className="bg-terracotta hover:bg-terracotta/90" disabled={isLoading}>
              {isLoading ? 'Enregistrement...' : 'Planifier ce repas'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddMealModal;
