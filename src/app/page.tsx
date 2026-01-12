"use client";

import { useState, useEffect } from "react";
import { supabase } from '@/lib/supabase';
import Scanner from '@/components/Scanner';
import RecipeCard from '@/components/RecipeCard';
import styles from './page.module.css';
import { ChefHat, Search } from 'lucide-react';

const mockRecipes = [
  {
    id: '1',
    title: 'Pinaatti-Feta Munakas',
    image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?q=80&w=1000&auto=format&fit=crop',
    time: '15 min',
    calories: 320,
    difficulty: 'Helppo' as const,
    dietTags: ['KETO', 'KASVISSYÖJÄ']
  },
  {
    id: '2',
    title: 'Paistettu Lohi ja Avokadosalsa',
    image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?q=80&w=1000&auto=format&fit=crop',
    time: '25 min',
    calories: 450,
    difficulty: 'Keskitaso' as const,
    dietTags: ['KETO', 'GLUTEENITON']
  },
  {
    id: '3',
    title: 'Vihreä Smoothie Bowl',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1000&auto=format&fit=crop',
    time: '10 min',
    calories: 280,
    difficulty: 'Helppo' as const,
    dietTags: ['VEGAANI', 'GLUTEENITON']
  }
];

export default function Home() {
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [recipes, setRecipes] = useState<any[]>(mockRecipes);
  const [loading, setLoading] = useState(false);
  const [showRecipes, setShowRecipes] = useState(false);
  const [userName, setUserName] = useState<string>("Vieras");

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUserName(session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || "Chef");
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUserName(session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || "Chef");
      } else {
        setUserName("Vieras");
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleIngredientsDetected = async (newIngredients: string[]) => {
    setIngredients(newIngredients);
    setLoading(true);
    setShowRecipes(true);

    try {
      const response = await fetch('/api/generate-recipes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ingredients: newIngredients, diets: [] }),
      });
      const data = await response.json();
      if (data.recipes) {
        setRecipes(data.recipes);
      }
    } catch (error) {
      console.error("Failed to generate recipes", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1>Tervetuloa takaisin, <span className={styles.username}>{userName}</span></h1>
          <p className={styles.subtitle}>Mitä kokkaamme tänään?</p>
        </div>
        <div className={styles.searchBar}>
          <Search size={20} />
          <input type="text" placeholder="Etsi reseptejä..." />
        </div>
      </header>

      <Scanner onIngredientsDetected={handleIngredientsDetected} />

      {ingredients.length > 0 && (
        <section className={`${styles.ingredientsSection} animate-fade-in`}>
          <div className={styles.sectionHeader}>
            <ChefHat size={24} color="var(--primary)" />
            <h2>Havaitut ainekset</h2>
          </div>
          <div className={styles.ingredientChips}>
            {ingredients.map(ing => (
              <span key={ing} className={styles.chip}>{ing}</span>
            ))}
          </div>
        </section>
      )}

      {showRecipes && (
        <section className={`${styles.recipesSection} animate-fade-in`}>
          <div className={styles.sectionHeader}>
            <h2>AI:n suositukset sinulle</h2>
            <button className={styles.seeAll}>Katso kaikki</button>
          </div>
          {loading ? (
            <div className={styles.loadingState}>Ladataan parhaita reseptejä...</div>
          ) : (
            <div className={styles.recipeGrid}>
              {recipes.map(recipe => (
                <RecipeCard key={recipe.id} {...recipe} />
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
}
