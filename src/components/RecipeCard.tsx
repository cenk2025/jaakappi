"use client";

import { Clock, Flame, BarChart } from 'lucide-react';
import styles from './RecipeCard.module.css';
import Link from 'next/link';

interface RecipeCardProps {
    id: string;
    title: string;
    image: string;
    time: string;
    calories: number;
    difficulty: 'Helppo' | 'Keskitaso' | 'Vaikea';
    dietTags: string[];
}

export default function RecipeCard({ id, title, image, time, calories, difficulty, dietTags }: RecipeCardProps) {
    return (
        <Link href={`/recipes/${id}`} className={styles.card}>
            <div className={styles.imageWrapper}>
                <img src={image} alt={title} className={styles.image} />
                <div className={styles.tags}>
                    {dietTags.map(tag => (
                        <span key={tag} className={styles.tag}>{tag}</span>
                    ))}
                </div>
            </div>

            <div className={styles.content}>
                <h3 className={styles.title}>{title}</h3>

                <div className={styles.meta}>
                    <div className={styles.metaItem}>
                        <Clock size={16} />
                        <span>{time}</span>
                    </div>
                    <div className={styles.metaItem}>
                        <Flame size={16} />
                        <span>{calories} kcal</span>
                    </div>
                    <div className={styles.metaItem}>
                        <BarChart size={16} />
                        <span>{difficulty}</span>
                    </div>
                </div>
            </div>
        </Link>
    );
}
