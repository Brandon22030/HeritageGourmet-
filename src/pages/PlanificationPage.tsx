
import React, { useState, useEffect } from 'react';
import { format, addDays, startOfWeek, isSameDay } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Calendar, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import AddMealModal from '@/components/planification/AddMealModal';

interface MealPlan {
  id: string;
  date: string;
  meal_type: string;
  recipe_id: string | null;
  custom_meal: string | null;
  notes: string | null;
  recipe?: {
    title: string;
  };
}

const MEAL_TYPES = ['Petit-déjeuner', 'Déjeuner', 'Dîner'];

const PlanificationPage = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [weekDates, setWeekDates] = useState<Date[]>([]);
  const [mealPlans, setMealPlans] = useState<MealPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedMealType, setSelectedMealType] = useState<string>('');
  const { user } = useAuth();

  // Fonction pour obtenir les dates de la semaine à partir de la date actuelle
  const calculateWeekDates = (date: Date) => {
    const start = startOfWeek(date, { weekStartsOn: 1 }); // Commence lundi
    return Array.from({ length: 7 }, (_, i) => addDays(start, i));
  };

  // Mettre à jour les dates de la semaine quand la date actuelle change
  useEffect(() => {
    setWeekDates(calculateWeekDates(currentDate));
  }, [currentDate]);

  // Charger les plans de repas pour l'utilisateur connecté
  const fetchMealPlans = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const startDate = format(weekDates[0] || new Date(), 'yyyy-MM-dd');
      const endDate = format(weekDates[6] || addDays(new Date(), 6), 'yyyy-MM-dd');
      
      const { data, error } = await supabase
        .from('meal_plans')
        .select(`
          id,
          date,
          meal_type,
          recipe_id,
          custom_meal,
          notes,
          recipes (
            title
          )
        `)
        .eq('user_id', user.id)
        .gte('date', startDate)
        .lte('date', endDate);
      
      if (error) throw error;
      
      setMealPlans(data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des plans de repas:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de charger vos plans de repas',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user && weekDates.length > 0) {
      fetchMealPlans();
    }
  }, [user, weekDates]);

  // Navigation entre les semaines
  const previousWeek = () => {
    setCurrentDate(addDays(currentDate, -7));
  };

  const nextWeek = () => {
    setCurrentDate(addDays(currentDate, 7));
  };

  // Fonction pour récupérer les plans de repas pour une date et un type donnés
  const getMealPlan = (date: Date, mealType: string) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return mealPlans.find(
      plan => plan.date === dateStr && plan.meal_type === mealType
    );
  };

  // Ouvrir la modal d'ajout de repas
  const handleAddMeal = (date: Date, mealType: string) => {
    if (!user) {
      toast({
        title: 'Non connecté',
        description: 'Veuillez vous connecter pour planifier des repas',
        variant: 'destructive',
      });
      return;
    }
    
    setSelectedDate(date);
    setSelectedMealType(mealType);
    setIsAddModalOpen(true);
  };

  // Supprimer un repas planifié
  const handleDeleteMeal = async (mealId: string) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('meal_plans')
        .delete()
        .eq('id', mealId)
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      // Mettre à jour la liste locale
      setMealPlans(prev => prev.filter(plan => plan.id !== mealId));
      
      toast({
        title: 'Repas supprimé',
        description: 'Le repas a été retiré de votre planning',
      });
    } catch (error) {
      console.error('Erreur lors de la suppression du repas:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de supprimer ce repas',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-serif font-bold mb-2">Planification des Repas</h1>
            <p className="text-gray-600">Organisez vos repas de la semaine</p>
          </div>
          
          <div className="flex items-center space-x-2 mt-4 md:mt-0">
            <Button variant="outline" size="icon" onClick={previousWeek}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>{format(weekDates[0] || new Date(), 'dd MMMM', { locale: fr })} - {format(weekDates[6] || addDays(new Date(), 6), 'dd MMMM', { locale: fr })}</span>
            </Button>
            <Button variant="outline" size="icon" onClick={nextWeek}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {isLoading ? (
          <div className="text-center py-16">
            <p className="text-gray-600">Chargement de votre planning...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="px-4 py-2 border"></th>
                  {weekDates.map((date) => (
                    <th key={date.toISOString()} className="px-4 py-2 border text-center">
                      <div className="font-medium">{format(date, 'EEEE', { locale: fr })}</div>
                      <div className={`text-sm ${isSameDay(date, new Date()) ? 'bg-terracotta/20 rounded-full px-2 py-1 inline-block' : ''}`}>
                        {format(date, 'dd MMM', { locale: fr })}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {MEAL_TYPES.map((mealType) => (
                  <tr key={mealType}>
                    <td className="px-4 py-2 border font-medium">{mealType}</td>
                    {weekDates.map((date) => {
                      const mealPlan = getMealPlan(date, mealType);
                      return (
                        <td key={`${date.toISOString()}-${mealType}`} className="px-4 py-2 border">
                          {mealPlan ? (
                            <div className="p-2 bg-cream rounded-md">
                              <p className="font-medium">
                                {mealPlan.recipe?.title || mealPlan.custom_meal || 'Repas planifié'}
                              </p>
                              {mealPlan.notes && <p className="text-sm text-gray-600">{mealPlan.notes}</p>}
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-xs text-gray-500 mt-1 h-6 px-2"
                                onClick={() => handleDeleteMeal(mealPlan.id)}
                              >
                                Supprimer
                              </Button>
                            </div>
                          ) : (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="w-full h-16 border border-dashed border-gray-300 text-gray-500"
                              onClick={() => handleAddMeal(date, mealType)}
                            >
                              <Plus className="h-4 w-4 mr-1" />
                              <span className="text-xs">Ajouter</span>
                            </Button>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      {/* Modal d'ajout de repas */}
      {selectedDate && (
        <AddMealModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSuccess={fetchMealPlans}
          date={selectedDate}
          mealType={selectedMealType}
        />
      )}
    </div>
  );
};

export default PlanificationPage;
