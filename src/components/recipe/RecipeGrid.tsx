
import React from 'react';
import RecipeCard from './RecipeCard';

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

interface RecipeGridProps {
  recipes: Recipe[];
}

const RecipeGrid: React.FC<RecipeGridProps> = ({ recipes }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {recipes.map((recipe) => (
        <RecipeCard key={recipe.id} {...recipe} />
      ))}
    </div>
  );
};

export default RecipeGrid;
