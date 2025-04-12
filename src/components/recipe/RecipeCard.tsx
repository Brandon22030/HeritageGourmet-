
import React from 'react';
import { Clock, Users, ChefHat } from 'lucide-react';
import { Link } from 'react-router-dom';

interface RecipeCardProps {
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

const RecipeCard: React.FC<RecipeCardProps> = ({
  id,
  title,
  description,
  image,
  prepTime,
  cookTime,
  servings,
  difficulty,
  category,
}) => {
  const totalTime = prepTime + cookTime;
  
  return (
    <Link to={`/recette/${id}`} className="block recipe-card transform hover:-translate-y-1 transition-all duration-300">
      <div className="relative h-48 overflow-hidden">
        <img src={image} alt={title} className="w-full h-full object-cover" />
        <div className="absolute top-3 right-3">
          <span className="recipe-tag tag-category">{category}</span>
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="font-serif text-xl font-semibold mb-2">{title}</h3>
        <p className="text-sm text-gray-600 line-clamp-2 mb-4">{description}</p>
        
        <div className="flex items-center justify-between text-sm text-brown/80">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{totalTime} min</span>
          </div>
          
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>{servings} pers.</span>
          </div>
          
          <div className="flex items-center gap-1">
            <ChefHat className="w-4 h-4" />
            <span>{difficulty}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default RecipeCard;
