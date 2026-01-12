"use client";

import { useState, useEffect } from 'react';
import {
    ArrowLeft,
    Volume2,
    ChevronRight,
    ChevronLeft,
    X,
    ShoppingCart,
    CheckCircle2,
    Clock,
    Flame
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import styles from './RecipeDetail.module.css';

const mockFullRecipe = {
    id: '1',
    title: 'Pinaatti-Feta Munakas',
    image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?q=80&w=1000&auto=format&fit=crop',
    prepTime: '5 min',
    cookTime: '10 min',
    calories: 320,
    ingredients: [
        { name: 'Kananmunat', amount: '3 kpl', status: 'instock' },
        { name: 'Tuore pinaatti', amount: '2 kourallista', status: 'instock' },
        { name: 'Feta-juusto', amount: '50g', status: 'missing' },
        { name: 'Maito', amount: '0.5 dl', status: 'instock' },
        { name: 'Suola ja pippuri', amount: 'maun mukaan', status: 'instock' }
    ],
    steps: [
        {
            title: 'Valmistele ainekset',
            instruction: 'Riko kananmunat kulhoon. Lisää maito, suola ja pippuri. Vatkaa kevyesti haarukalla.',
            ingredients: ['Kananmunat', 'Maito', 'Suola ja pippuri']
        },
        {
            title: 'Kuullota pinaatti',
            instruction: 'Lämmitä pannu keskilämmöllä. Lisää tilkka öljyä ja paista pinaattia, kunnes se menee kasaan.',
            ingredients: ['Tuore pinaatti']
        },
        {
            title: 'Paista munakas',
            instruction: 'Kaada munaseos pannulle pinaatin päälle. Murenna feta-juusto pinnalle.',
            ingredients: ['Feta-juusto']
        },
        {
            title: 'Viimeistely',
            instruction: 'Paista miedolla lämmöllä kannen alla 3-5 minuuttia, kunnes munakas on hyytynyt. Tarjoile heti.',
            ingredients: []
        }
    ]
};

export default function RecipeDetailPage() {
    const router = useRouter();
    const [cookingMode, setCookingMode] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [completedSteps, setCompletedSteps] = useState<number[]>([]);
    const [shoppingList, setShoppingList] = useState<string[]>([]);

    const recipe = mockFullRecipe; // In real app, fetch by id

    const speak = (text: string) => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'fi-FI';
            window.speechSynthesis.speak(utterance);
        }
    };

    const addToShoppingList = (item: string) => {
        if (!shoppingList.includes(item)) {
            setShoppingList([...shoppingList, item]);
        }
    };

    if (cookingMode) {
        const step = recipe.steps[currentStep];
        const progress = ((currentStep + 1) / recipe.steps.length) * 100;

        return (
            <div className={styles.cookingOverlay}>
                <div className={styles.cookingHeader}>
                    <button onClick={() => setCookingMode(false)} className={styles.closeBtn}>
                        <X size={24} />
                    </button>
                    <div className={styles.progressContainer}>
                        <p>Vaihe {currentStep + 1} / {recipe.steps.length}</p>
                        <div className={styles.progressBar}>
                            <div className={styles.progressFill} style={{ width: `${progress}%` }}></div>
                        </div>
                    </div>
                    <div className={styles.headerSpacer}></div>
                </div>

                <div className={styles.cookingContent}>
                    <div className={`${styles.instructionBox} animate-fade-in`}>
                        {step.ingredients.length > 0 && (
                            <div className={styles.stepIngredients}>
                                <p className={styles.stepIngTitle}>Tässä vaiheessa tarvitset:</p>
                                <div className={styles.ingList}>
                                    {step.ingredients.map(ing => (
                                        <span key={ing} className={styles.ingBadge}>{ing}</span>
                                    ))}
                                </div>
                            </div>
                        )}
                        <h2 className={styles.instructionText}>{step.instruction}</h2>
                        <button onClick={() => speak(step.instruction)} className={styles.readAloudBtn}>
                            <Volume2 size={24} />
                            <span>Lue ääneen</span>
                        </button>
                    </div>
                </div>

                <div className={styles.cookingFooter}>
                    <button
                        onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                        disabled={currentStep === 0}
                        className={styles.navBtn}
                    >
                        <ChevronLeft size={24} />
                        <span>Takaisin</span>
                    </button>

                    <button
                        onClick={() => {
                            if (currentStep < recipe.steps.length - 1) {
                                setCurrentStep(currentStep + 1);
                            } else {
                                setCookingMode(false);
                                alert("Hyvää ruokahalua! Munakas on valmis.");
                            }
                        }}
                        className={`${styles.navBtn} ${styles.primaryNav}`}
                    >
                        <span>{currentStep === recipe.steps.length - 1 ? 'Valmis' : 'Seuraava'}</span>
                        <ChevronRight size={24} />
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <button onClick={() => router.back()} className={styles.backLink}>
                <ArrowLeft size={20} />
                <span>Takaisin</span>
            </button>

            <div className={styles.heroSection}>
                <div className={styles.mainImage}>
                    <img src={recipe.image} alt={recipe.title} />
                </div>
                <div className={styles.heroContent}>
                    <h1 className="title-gradient">{recipe.title}</h1>
                    <div className={styles.quickMeta}>
                        <div className={styles.metaItem}>
                            <Clock size={20} />
                            <span>Valmistus: {recipe.prepTime}</span>
                        </div>
                        <div className={styles.metaItem}>
                            <Flame size={20} />
                            <span>{recipe.calories} kcal</span>
                        </div>
                    </div>
                    <button onClick={() => setCookingMode(true)} className={styles.startBtn}>
                        Aloita Kokkaus
                    </button>
                </div>
            </div>

            <div className={styles.layoutGrid}>
                <section className={styles.ingredientsList}>
                    <h2>Ainekset</h2>
                    <div className={styles.ingredientsGrid}>
                        {recipe.ingredients.map((ing, index) => (
                            <div key={index} className={`${styles.ingredientItem} ${ing.status === 'missing' ? styles.missing : ''}`}>
                                <div className={styles.ingInfo}>
                                    <p className={styles.ingName}>{ing.name}</p>
                                    <p className={styles.ingAmount}>{ing.amount}</p>
                                </div>
                                {ing.status === 'missing' ? (
                                    <button
                                        onClick={() => addToShoppingList(ing.name)}
                                        className={styles.addBtn}
                                    >
                                        {shoppingList.includes(ing.name) ? <CheckCircle2 size={20} /> : <ShoppingCart size={20} />}
                                    </button>
                                ) : (
                                    <div className={styles.inStock}>
                                        <CheckCircle2 size={20} />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </section>

                <section className={styles.instructionsPreview}>
                    <h2>Ohjeet yhdellä silmäyksellä</h2>
                    <div className={styles.stepsPreview}>
                        {recipe.steps.map((step, index) => (
                            <div key={index} className={styles.stepPreviewItem}>
                                <span className={styles.stepNum}>{index + 1}</span>
                                <p>{step.instruction}</p>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
}
