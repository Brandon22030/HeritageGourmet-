
import React, { useEffect, useState } from 'react';
import { Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import RecipeGrid from '@/components/recipe/RecipeGrid';
import { supabase } from '@/integrations/supabase/client';

interface Recipe {
  id: string;
  title: string;
  description: string;
  image: string;
  prepTime: number;
  cookTime: number;
  servings: number;
  difficulty: 'Facile' | 'Moyen' | 'Difficile';
  category: string;
  favorite?: boolean;
}

const ExplorerPage = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = [
    'Tous', 
    'Plat Principal', 
    'Dessert', 
    'Entrée', 
    'Petit-déjeuner', 
    'Collation'
  ];

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    setIsLoading(true);
    try {
      let query = supabase
        .from('recipes')
        .select('*')
        .eq('is_public', true);
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      if (data) {
        const formattedRecipes = data.map(recipe => ({
          id: recipe.id,
          title: recipe.title,
          description: recipe.description || '',
          image: recipe.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c',
          prepTime: recipe.prep_time || 0,
          cookTime: recipe.cook_time || 0,
          servings: recipe.servings || 0,
          difficulty: (recipe.difficulty as 'Facile' | 'Moyen' | 'Difficile') || 'Facile',
          category: recipe.category || 'Non catégorisé',
        }));
        
        setRecipes(formattedRecipes);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des recettes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredRecipes = recipes.filter(recipe => {
    const matchesSearch = 
      recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      recipe.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = 
      !selectedCategory || 
      selectedCategory === 'Tous' || 
      recipe.category === selectedCategory;
      
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-serif font-bold mb-2">Explorer les Recettes</h1>
          <p className="text-gray-600">Découvrez de nouvelles recettes partagées par la communauté</p>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
            <Input
              placeholder="Rechercher une recette..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="w-4 h-4" />
            <span>Filtres</span>
          </Button>
        </div>
        
        <div className="mb-8">
          <h2 className="text-xl font-serif font-semibold mb-4">Catégories</h2>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button 
                key={category}
                variant="outline" 
                className={`rounded-full ${selectedCategory === category ? 'bg-terracotta/10 border-terracotta text-terracotta' : ''}`}
                onClick={() => setSelectedCategory(category === 'Tous' ? null : category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
        
        {isLoading ? (
          <div className="text-center py-16">
            <p className="text-gray-600">Chargement des recettes...</p>
          </div>
        ) : filteredRecipes.length > 0 ? (
          <RecipeGrid recipes={filteredRecipes} />
        ) : (
          <div className="text-center py-16">
            <h3 className="text-2xl font-serif font-bold mb-2">Aucune recette trouvée</h3>
            <p className="text-gray-600">Essayez de modifier vos critères de recherche</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExplorerPage;
