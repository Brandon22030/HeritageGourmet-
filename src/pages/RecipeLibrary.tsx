
import React, { useState } from 'react';
import { Search, Filter, Grid, List } from 'lucide-react';
import RecipeGrid from '@/components/recipe/RecipeGrid';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

// Mock data for demonstration
const mockRecipes = [
  {
    id: '1',
    title: 'Tarte aux Pommes Normande',
    description: 'Une tarte aux pommes traditionnelle de Normandie avec une touche de calvados et de la creme fraiche.',
    image: 'https://images.unsplash.com/photo-1568571780765-9276ac8b75a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80',
    prepTime: 30,
    cookTime: 45,
    servings: 8,
    difficulty: 'Moyen' as const,
    category: 'Dessert',
  },
  {
    id: '2',
    title: 'Bœuf Bourguignon',
    description: 'Un plat traditionnel francais mijote au vin rouge de Bourgogne avec des legumes et des herbes.',
    image: 'https://images.unsplash.com/photo-1600891963935-9e69cec6e1a5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1742&q=80',
    prepTime: 45,
    cookTime: 180,
    servings: 6,
    difficulty: 'Difficile' as const,
    category: 'Plat Principal',
  },
  {
    id: '3',
    title: 'Quiche Lorraine',
    description: 'Une tarte salee aux lardons et a la creme, specialite de la region de Lorraine.',
    image: 'https://images.unsplash.com/photo-1591985666643-9b27aa22ac62?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80',
    prepTime: 20,
    cookTime: 40,
    servings: 6,
    difficulty: 'Facile' as const,
    category: 'Entree',
  },
  {
    id: '4',
    title: 'Ratatouille Provençale',
    description: 'Un ragout de legumes d\'ete du sud de la France, parfume aux herbes de Provence.',
    image: 'https://images.unsplash.com/photo-1572453800999-e8d2d1589b7c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80',
    prepTime: 30,
    cookTime: 60,
    servings: 4,
    difficulty: 'Facile' as const,
    category: 'Plat Principal',
  },
  {
    id: '5',
    title: 'Mousse au Chocolat',
    description: 'Un dessert leger et aerien au chocolat noir, parfait pour terminer un repas.',
    image: 'https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1650&q=80',
    prepTime: 20,
    cookTime: 240,
    servings: 6,
    difficulty: 'Moyen' as const,
    category: 'Dessert',
  },
  {
    id: '6',
    title: 'Coq au Vin',
    description: 'Un plat traditionnel francais ou le poulet est mijote dans du vin rouge avec des champignons et des lardons.',
    image: 'https://images.unsplash.com/photo-1592415499556-74fcb9321a8e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1675&q=80',
    prepTime: 40,
    cookTime: 90,
    servings: 4,
    difficulty: 'Difficile' as const,
    category: 'Plat Principal',
  },
  {
    id: '7',
    title: 'Crêpes Sucrées',
    description: 'Des crepes fines et legeres, parfaites pour le petit-dejeuner ou un dessert simple.',
    image: 'https://images.unsplash.com/photo-1519676867240-f03562e64548?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1756&q=80',
    prepTime: 10,
    cookTime: 20,
    servings: 4,
    difficulty: 'Facile' as const,
    category: 'Dessert',
  },
  {
    id: '8',
    title: 'Soupe a l\'Oignon',  // Escaped apostrophe and simplified characters
    description: 'Une soupe reconfortante a base d\'oignons caramelises, gratinee avec du fromage et du pain.',
    image: 'https://images.unsplash.com/photo-1583608354155-90119f1cc2d7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1742&q=80',
    prepTime: 20,
    cookTime: 60,
    servings: 4,
    difficulty: 'Moyen' as const,
    category: 'Entree',
  },
];

const RecipeLibrary = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredRecipes = mockRecipes.filter(recipe => 
    recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    recipe.description.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <div className="py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-serif font-bold mb-2">Ma Bibliothèque de Recettes</h1>
            <p className="text-gray-600">Organisez et accédez à toutes vos recettes préférées</p>
          </div>
          
          <div className="mt-4 md:mt-0 flex items-center space-x-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="icon"
              onClick={() => setViewMode('grid')}
            >
              <Grid className="w-5 h-5" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="icon"
              onClick={() => setViewMode('list')}
            >
              <List className="w-5 h-5" />
            </Button>
          </div>
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
          <h2 className="text-xl font-serif font-semibold mb-4">Catégories populaires</h2>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" className="rounded-full">Tous</Button>
            <Button variant="outline" className="rounded-full">Plat Principal</Button>
            <Button variant="outline" className="rounded-full">Dessert</Button>
            <Button variant="outline" className="rounded-full">Entrée</Button>
            <Button variant="outline" className="rounded-full">Petit-déjeuner</Button>
            <Button variant="outline" className="rounded-full">Collation</Button>
          </div>
        </div>
        
        {filteredRecipes.length > 0 ? (
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

export default RecipeLibrary;
