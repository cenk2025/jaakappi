"use client";

import { useState } from 'react';
import { ArrowLeft, Check } from 'lucide-react';
import { useRouter } from 'next/navigation';
import styles from '../Settings.module.css';

export default function LanguagePage() {
    const router = useRouter();
    const [lang, setLang] = useState('fi');

    const languages = [
        { id: 'fi', name: 'Suomi', flag: '🇫🇮' },
        { id: 'en', name: 'English', flag: '🇬🇧' },
        { id: 'se', name: 'Svenska', flag: '🇸🇪' }
    ];

    return (
        <div className={styles.container}>
            <button onClick={() => router.back()} className={styles.backBtn}>
                <ArrowLeft size={20} />
                <span>Takaisin</span>
            </button>
            <h1 className="title-gradient">Kieli</h1>

            <div className={styles.settingsList}>
                {languages.map((l) => (
                    <button
                        key={l.id}
                        className={`${styles.toggleItem} ${lang === l.id ? styles.activeLang : ''}`}
                        onClick={() => setLang(l.id)}
                        style={{ width: '100%', textAlign: 'left', cursor: 'pointer' }}
                    >
                        <div className={styles.toggleInfo} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <span style={{ fontSize: '1.5rem' }}>{l.flag}</span>
                            <h4>{l.name}</h4>
                        </div>
                        {lang === l.id && <Check size={24} color="var(--primary)" />}
                    </button>
                ))}
            </div>
        </div>
    );
}
