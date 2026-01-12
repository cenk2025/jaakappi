"use client";

import { useState } from 'react';
import { ArrowLeft, Moon, Sun, Monitor } from 'lucide-react';
import { useRouter } from 'next/navigation';
import styles from '../Settings.module.css';

export default function AppearancePage() {
    const router = useRouter();
    const [theme, setTheme] = useState('dark');

    const themes = [
        { id: 'dark', name: 'Tumma', icon: Moon, desc: 'Säästä virtaa ja silmiäsi.' },
        { id: 'light', name: 'Vaalea', icon: Sun, desc: 'Klassinen ja energinen ilme.' },
        { id: 'system', name: 'Järjestelmä', icon: Monitor, desc: 'Seuraa laitteen asetuksia.' }
    ];

    return (
        <div className={styles.container}>
            <button onClick={() => router.back()} className={styles.backBtn}>
                <ArrowLeft size={20} />
                <span>Takaisin</span>
            </button>
            <h1 className="title-gradient">Ulkoasu</h1>

            <div className={styles.grid}>
                {themes.map((t) => (
                    <button
                        key={t.id}
                        className={`${styles.settingItem} ${theme === t.id ? styles.selectedTheme : ''}`}
                        onClick={() => setTheme(t.id)}
                        style={{ border: theme === t.id ? '2px solid var(--primary)' : '1px solid var(--card-border)' }}
                    >
                        <div className={styles.iconBox}>
                            <t.icon size={24} />
                        </div>
                        <div className={styles.info}>
                            <h3>{t.name}</h3>
                            <p>{t.desc}</p>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
}
