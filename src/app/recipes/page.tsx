"use client";

import RecipeCard from '@/components/RecipeCard';
import styles from './Recipes.module.css';
import { Search, SlidersHorizontal } from 'lucide-react';

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
    },
    {
        id: '4',
        title: 'Kukkakaalicurry',
        image: 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?q=80&w=1000&auto=format&fit=crop',
        time: '35 min',
        calories: 380,
        difficulty: 'Keskitaso' as const,
        dietTags: ['VEGAANI', 'GLUTEENITON']
    }
];

export default function RecipesPage() {
    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1 className="title-gradient">Reseptikirjasto</h1>
                <div className={styles.controls}>
                    <div className={styles.searchBar}>
                        <Search size={20} />
                        <input type="text" placeholder="Etsi aineksella tai nimellä..." />
                    </div>
                    <button className={styles.filterBtn}>
                        <SlidersHorizontal size={20} />
                        <span>Suodattimet</span>
                    </button>
                </div>
            </header>

            <div className={styles.recipeGrid}>
                {mockRecipes.map(recipe => (
                    <RecipeCard key={recipe.id} {...recipe} />
                ))}
            </div>
        </div>
    );
}
