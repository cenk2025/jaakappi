"use client";

import { useState, useEffect } from "react";
import { supabase } from '@/lib/supabase';
import Scanner from '@/components/Scanner';
import RecipeCard from '@/components/RecipeCard';
import styles from './page.module.css';
import { ChefHat, Search, ShoppingCart, AlertCircle } from 'lucide-react';

// Placeholder images since text-to-image is expensive/slow
const PLACEHOLDER_IMAGES = [
  'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80',
  'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800&q=80',
  'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&q=80',
  'https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=800&q=80',
  'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800&q=80'
];

export default function Home() {
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [recipes, setRecipes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>("Vieras");
  const [missingIngredients, setMissingIngredients] = useState<string[]>([]);

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
    setShowResults(true);
    setError(null);
    setRecipes([]);
    setMissingIngredients([]);

    try {
      const response = await fetch('/api/generate-recipes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ingredients: newIngredients, diets: [] }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Reseptien haku epäonnistui");
      }

      if (data.recipes && Array.isArray(data.recipes)) {
        // Map API response to UI Component props
        const mappedRecipes = data.recipes.map((r: any, index: number) => ({
          ...r,
          // FORCE the ID to be strictly generated to avoid encoding issues with Finnish characters in URL
          id: `gen-${index}`,
          time: r.prepTime || '30 min', // Map prepTime to time
          image: PLACEHOLDER_IMAGES[index % PLACEHOLDER_IMAGES.length], // Assign placeholder
          missingIngredients: r.ingredients?.filter((i: any) => i.status === 'missing').map((i: any) => i.name) || []
        }));

        setRecipes(mappedRecipes);
        localStorage.setItem('generatedRecipes', JSON.stringify(mappedRecipes));

        // Aggregate all unique missing ingredients for the shopping list
        const allMissing = new Set<string>();
        mappedRecipes.forEach((r: any) => {
          r.missingIngredients?.forEach((ing: string) => allMissing.add(ing));
        });
        setMissingIngredients(Array.from(allMissing));
      }
    } catch (err: any) {
      console.error("Failed to generate recipes", err);
      setError(err.message || "Tuntematon virhe tapahtui reseptejä haettaessa.");
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

      {error && (
        <div className="bg-red-900/20 text-red-200 p-4 rounded-xl mt-4 flex items-center gap-3 animate-fade-in">
          <AlertCircle />
          <p>{error}</p>
        </div>
      )}

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

      {/* Shopping List Section */}
      {missingIngredients.length > 0 && (
        <section className={`${styles.recipesSection} animate-fade-in`}>
          <div className={styles.sectionHeader}>
            <ShoppingCart size={24} color="var(--accent)" />
            <h2>Ostoslista (puuttuvat)</h2>
          </div>
          <div className="bg-white/5 p-4 rounded-xl backdrop-blur-sm border border-white/10">
            <p className="text-sm text-gray-400 mb-3">Näitä tarvitset ehdotettuihin resepteihin:</p>
            <div className={styles.ingredientChips}>
              {missingIngredients.map(item => (
                <span key={item} className={`${styles.chip} border-orange-500/50 text-orange-200`}>
                  + {item}
                </span>
              ))}
            </div>
          </div>
        </section>
      )}

      {showResults && (
        <section className={`${styles.recipesSection} animate-fade-in mt-8`}>
          <div className={styles.sectionHeader}>
            <h2>AI:n suositukset sinulle</h2>
          </div>

          {loading ? (
            <div className={styles.loadingState}>
              <div className="flex flex-col items-center gap-4">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                <p>AI kokki miettii reseptejä...</p>
                <p className="text-sm text-gray-500">Tämä voi kestää hetken</p>
              </div>
            </div>
          ) : (
            <div className={styles.recipeGrid}>
              {recipes.length > 0 ? recipes.map(recipe => (
                <RecipeCard key={recipe.id} {...recipe} />
              )) : (
                !error && <p className="text-gray-400">Ei reseptejä löytynyt.</p>
              )}
            </div>
          )}
        </section>
      )}
    </div>
  );
}
