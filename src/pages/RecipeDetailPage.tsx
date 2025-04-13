
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, Users, ChefHat, Heart, Share2, ArrowLeft, Edit, Trash2, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

interface RecipeIngredient {
  id: string;
  name: string;
  quantity: string;
  unit: string;
}

interface RecipeInstruction {
  id: string;
  step: number;
  text: string;
}

interface RecipeDetail {
  id: string;
  title: string;
  description: string;
  image_url: string;
  prep_time: number;
  cook_time: number;
  servings: number;
  difficulty: string;
  category: string;
  user_id: string;
  ingredients: RecipeIngredient[];
  instructions: RecipeInstruction[];
  created_at: string;
  is_favorite?: boolean;
}

const RecipeDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [recipe, setRecipe] = useState<RecipeDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      fetchRecipe(id);
      if (user) {
        checkIfFavorite(id);
      }
    }
  }, [id, user]);

  const fetchRecipe = async (recipeId: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('recipes')
        .select('*')
        .eq('id', recipeId)
        .single();
      
      if (error) throw error;
      
      // Transform the data to match RecipeDetail interface
      const recipeData: RecipeDetail = {
        id: data.id,
        title: data.title,
        description: data.description || '',
        image_url: data.image_url || '',
        prep_time: data.prep_time || 0,
        cook_time: data.cook_time || 0,
        servings: data.servings || 0,
        difficulty: data.difficulty || 'medium',
        category: data.category || '',
        user_id: data.user_id,
        // Parse JSON fields and provide fallbacks if null or invalid
        ingredients: Array.isArray(data.ingredients) ? data.ingredients : [],
        instructions: Array.isArray(data.instructions) ? data.instructions : [],
        created_at: data.created_at,
      };
      
      setRecipe(recipeData);
    } catch (error) {
      console.error('Erreur lors de la récupération de la recette:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de charger cette recette',
        variant: 'destructive',
      });
      navigate('/bibliotheque');
    } finally {
      setIsLoading(false);
    }
  };

  const checkIfFavorite = async (recipeId: string) => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('favorites')
        .select('id')
        .eq('user_id', user.id)
        .eq('recipe_id', recipeId)
        .single();
      
      if (error && error.code !== 'PGRST116') { // PGRST116 est le code pour "aucun résultat"
        throw error;
      }
      
      setIsFavorite(!!data);
    } catch (error) {
      console.error('Erreur lors de la vérification des favoris:', error);
    }
  };

  const toggleFavorite = async () => {
    if (!user) {
      toast({
        title: 'Non connecté',
        description: 'Veuillez vous connecter pour ajouter des favoris',
        variant: 'destructive',
      });
      return;
    }

    if (!recipe) return;
    
    try {
      if (isFavorite) {
        // Supprimer des favoris
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('recipe_id', recipe.id);
        
        if (error) throw error;
        
        toast({
          title: 'Retiré des favoris',
          description: `${recipe.title} a été retiré de vos favoris`,
        });
      } else {
        // Ajouter aux favoris
        const { error } = await supabase
          .from('favorites')
          .insert({
            user_id: user.id,
            recipe_id: recipe.id,
          });
        
        if (error) throw error;
        
        toast({
          title: 'Ajouté aux favoris',
          description: `${recipe.title} a été ajouté à vos favoris`,
        });
      }
      
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error('Erreur lors de la mise à jour des favoris:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de mettre à jour les favoris',
        variant: 'destructive',
      });
    }
  };

  const shareRecipe = () => {
    if (navigator.share) {
      navigator.share({
        title: recipe?.title,
        text: recipe?.description,
        url: window.location.href,
      })
      .catch(err => console.error('Erreur lors du partage:', err));
    } else {
      // Copier le lien dans le presse-papiers
      navigator.clipboard.writeText(window.location.href)
        .then(() => {
          toast({
            title: 'Lien copié',
            description: 'Le lien de la recette a été copié dans le presse-papiers',
          });
        })
        .catch(err => console.error('Erreur lors de la copie:', err));
    }
  };

  if (isLoading) {
    return (
      <div className="py-16 text-center">
        <p className="text-gray-600">Chargement de la recette...</p>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="py-16 text-center">
        <p className="text-red-600">Recette non trouvée</p>
        <Button className="mt-4" onClick={() => navigate('/bibliotheque')}>
          Retour à la bibliothèque
        </Button>
      </div>
    );
  }

  const isOwner = user && recipe.user_id === user.id;

  return (
    <div className="py-8">
      <div className="container mx-auto px-4">
        <Button 
          variant="ghost" 
          className="mb-6 flex items-center"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour
        </Button>
        
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          <div className="lg:col-span-3">
            {recipe.image_url && (
              <div className="relative aspect-video rounded-xl overflow-hidden mb-6">
                <img 
                  src={recipe.image_url} 
                  alt={recipe.title} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4 flex space-x-2">
                  <Button
                    variant="secondary"
                    size="icon"
                    className="bg-white/90 hover:bg-white"
                    onClick={toggleFavorite}
                  >
                    <Heart className={`h-5 w-5 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
                  </Button>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="bg-white/90 hover:bg-white"
                    onClick={shareRecipe}
                  >
                    <Share2 className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            )}
            
            <h1 className="text-3xl font-serif font-bold mb-3">{recipe.title}</h1>
            
            <p className="text-gray-700 mb-6">{recipe.description}</p>
            
            <div className="flex flex-wrap gap-4 mb-8">
              <div className="flex items-center">
                <Clock className="w-5 h-5 text-terracotta mr-2" />
                <span>Préparation: {recipe.prep_time} min</span>
              </div>
              <div className="flex items-center">
                <Clock className="w-5 h-5 text-terracotta mr-2" />
                <span>Cuisson: {recipe.cook_time} min</span>
              </div>
              <div className="flex items-center">
                <Users className="w-5 h-5 text-terracotta mr-2" />
                <span>Pour {recipe.servings} personnes</span>
              </div>
              <div className="flex items-center">
                <ChefHat className="w-5 h-5 text-terracotta mr-2" />
                <span>Difficulté: {recipe.difficulty}</span>
              </div>
            </div>
            
            {isOwner && (
              <div className="flex gap-3 mb-8">
                <Button variant="outline" className="flex items-center">
                  <Edit className="mr-2 h-4 w-4" />
                  Modifier
                </Button>
                <Button variant="outline" className="flex items-center text-red-600 hover:text-red-700">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Supprimer
                </Button>
              </div>
            )}
            
            <div className="mb-8">
              <h2 className="text-2xl font-serif font-semibold mb-4">Instructions</h2>
              {recipe.instructions && Array.isArray(recipe.instructions) ? (
                <ol className="space-y-4 list-decimal ml-5">
                  {recipe.instructions.map((instruction, index) => (
                    <li key={index} className="pl-2">
                      <p>{instruction.text}</p>
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="text-gray-500 italic">Aucune instruction disponible.</p>
              )}
            </div>
          </div>
          
          <div className="lg:col-span-2">
            <div className="bg-cream/50 p-6 rounded-xl sticky top-24">
              <h2 className="text-2xl font-serif font-semibold mb-4 flex items-center">
                <BookOpen className="mr-2 h-5 w-5" />
                Ingrédients
              </h2>
              
              <p className="text-sm text-gray-600 mb-4">Pour {recipe.servings} personnes</p>
              
              {recipe.ingredients && Array.isArray(recipe.ingredients) ? (
                <ul className="space-y-2">
                  {recipe.ingredients.map((ingredient, index) => (
                    <li key={index} className="flex items-center pb-2 border-b border-gray-200 last:border-0">
                      <div className="w-10 h-10 bg-terracotta/10 rounded-full flex items-center justify-center mr-3">
                        <span className="font-medium text-terracotta">{ingredient.quantity}</span>
                      </div>
                      <span>{ingredient.name}</span>
                      {ingredient.unit && <span className="text-gray-500 ml-1">{ingredient.unit}</span>}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 italic">Aucun ingrédient disponible.</p>
              )}
              
              <div className="mt-6 pt-6 border-t border-gray-200">
                <Button className="w-full bg-terracotta hover:bg-terracotta/90">
                  Ajouter à mon planning
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetailPage;
