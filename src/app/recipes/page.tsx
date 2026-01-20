"use client";

import { useState, useEffect } from 'react';
import RecipeCard from '@/components/RecipeCard';
import styles from './Recipes.module.css';
import { Search, SlidersHorizontal } from 'lucide-react';

export default function RecipesPage() {
    const [recipes, setRecipes] = useState<any[]>([]);

    useEffect(() => {
        const storedRecipes = localStorage.getItem('generatedRecipes');
        if (storedRecipes) {
            try {
                setRecipes(JSON.parse(storedRecipes));
            } catch (e) {
                console.error("Failed to parse recipes", e);
            }
        }
    }, []);

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1 className="title-gradient">Reseptikirjasto</h1>
                <div className={styles.controls}>
                    <div className={styles.searchBar}>
                        <Search size={20} />
                        <input type="text" placeholder="Etsi aineksella tai nimellä..." />
                    </div>
                </div>
            </header>

            <div className={styles.recipeGrid}>
                {recipes.length > 0 ? (
                    recipes.map(recipe => (
                        <RecipeCard key={recipe.id} {...recipe} />
                    ))
                ) : (
                    <div className="text-gray-400 col-span-full text-center py-10">
                        <p>Ei tallennettuja reseptejä.</p>
                        <p className="text-sm mt-2">Skannaa jääkaappi etusivulla saadaksesi reseptejä.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
