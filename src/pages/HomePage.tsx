
import React from 'react';
import { ArrowRight, BookOpen, Users, Calendar, Sparkles, ChefHat } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1606787366850-de6330128bfc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80')",
          }}
        >
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
        
        <div className="container mx-auto px-4 py-24 md:py-32 relative">
          <div className="max-w-2xl text-white">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-6">
              Préservez votre héritage culinaire familial
            </h1>
            <p className="text-lg md:text-xl mb-8">
              Partagez, collaborez et transmettez vos recettes précieuses de génération en génération avec CulinariaLegacy.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button className="bg-terracotta hover:bg-terracotta/90 text-white">
                Commencer gratuitement
              </Button>
              <Button variant="outline" className="border-white text-white hover:bg-white/20">
                Découvrir les fonctionnalités
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-center mb-16">
            Une nouvelle façon de préserver vos recettes
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 rounded-full bg-terracotta/10 flex items-center justify-center">
                  <BookOpen className="w-8 h-8 text-terracotta" />
                </div>
              </div>
              <h3 className="text-xl font-serif font-semibold mb-3">Bibliothèque personnelle</h3>
              <p className="text-gray-700">
                Organisez vos recettes avec un système hiérarchique de catégories, collections et favoris.
              </p>
            </div>
            
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 rounded-full bg-honey/10 flex items-center justify-center">
                  <Users className="w-8 h-8 text-honey" />
                </div>
              </div>
              <h3 className="text-xl font-serif font-semibold mb-3">Collaboration familiale</h3>
              <p className="text-gray-700">
                Partagez et modifiez des recettes en famille avec un système de versionnage et des annotations collaboratives.
              </p>
            </div>
            
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 rounded-full bg-basil/10 flex items-center justify-center">
                  <Calendar className="w-8 h-8 text-basil" />
                </div>
              </div>
              <h3 className="text-xl font-serif font-semibold mb-3">Planification des repas</h3>
              <p className="text-gray-700">
                Planifiez vos repas et générez automatiquement des listes de courses triées par rayon.
              </p>
            </div>
            
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 rounded-full bg-eggplant/10 flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-eggplant" />
                </div>
              </div>
              <h3 className="text-xl font-serif font-semibold mb-3">Héritage culinaire</h3>
              <p className="text-gray-700">
                Préservez l'histoire de vos recettes avec des champs multimédias et une carte interactive des origines.
              </p>
            </div>
            
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 rounded-full bg-turquoise/10 flex items-center justify-center">
                  <ChefHat className="w-8 h-8 text-turquoise" />
                </div>
              </div>
              <h3 className="text-xl font-serif font-semibold mb-3">Assistant de cuisine</h3>
              <p className="text-gray-700">
                Utilisez le mode cuisine avec commandes vocales et minuteurs synchronisés à chaque étape.
              </p>
            </div>
            
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 rounded-full bg-terracotta/10 flex items-center justify-center">
                  <ArrowRight className="w-8 h-8 text-terracotta" />
                </div>
              </div>
              <h3 className="text-xl font-serif font-semibold mb-3">Et bien plus encore</h3>
              <p className="text-gray-700">
                Découvrez toutes les fonctionnalités conçues pour rendre l'expérience culinaire plus riche et familiale.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-brown text-cream py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">
            Prêt à préserver votre héritage culinaire?
          </h2>
          <p className="max-w-2xl mx-auto text-lg mb-8">
            Commencez dès aujourd'hui à construire votre bibliothèque de recettes familiales pour les générations futures.
          </p>
          <Button className="bg-terracotta hover:bg-terracotta/90 text-white">
            Commencer gratuitement
          </Button>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-center mb-16">
            Ils adorent CulinariaLegacy
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="mb-4 text-honey">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-2xl">★</span>
                ))}
              </div>
              <p className="italic mb-6">
                "Grâce à CulinariaLegacy, j'ai pu numériser et préserver toutes les recettes de ma grand-mère. Un trésor familial sauvegardé!"
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-gray-300 mr-4"></div>
                <div>
                  <p className="font-semibold">Marie Dupont</p>
                  <p className="text-sm text-gray-600">Utilisatrice depuis 2 ans</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="mb-4 text-honey">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-2xl">★</span>
                ))}
              </div>
              <p className="italic mb-6">
                "La collaboration familiale est extraordinaire. Mes sœurs et moi pouvons maintenant travailler ensemble sur nos recettes peu importe la distance."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-gray-300 mr-4"></div>
                <div>
                  <p className="font-semibold">Pierre Martin</p>
                  <p className="text-sm text-gray-600">Utilisateur depuis 1 an</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="mb-4 text-honey">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-2xl">★</span>
                ))}
              </div>
              <p className="italic mb-6">
                "Le planificateur de repas a révolutionné notre quotidien. Plus besoin de se demander 'Qu'est-ce qu'on mange ce soir?'"
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-gray-300 mr-4"></div>
                <div>
                  <p className="font-semibold">Sophie Bernard</p>
                  <p className="text-sm text-gray-600">Utilisatrice depuis 6 mois</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
