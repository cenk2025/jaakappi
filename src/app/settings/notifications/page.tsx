"use client";

import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import styles from '../Settings.module.css';

export default function NotificationsPage() {
    const router = useRouter();
    const [settings, setSettings] = useState({
        daily: true,
        newRecipes: true,
        shopping: false
    });

    const toggle = (key: keyof typeof settings) => {
        setSettings(prev => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <div className={styles.container}>
            <button onClick={() => router.back()} className={styles.backBtn}>
                <ArrowLeft size={20} />
                <span>Takaisin</span>
            </button>
            <h1 className="title-gradient">Ilmoitukset</h1>

            <div className={styles.settingsList}>
                <div className={styles.toggleItem}>
                    <div className={styles.toggleInfo}>
                        <h4>Päivittäiset muistutukset</h4>
                        <p>Saa vinkkejä siitä, mitä kokata tänään.</p>
                    </div>
                    <label className={styles.switch}>
                        <input type="checkbox" checked={settings.daily} onChange={() => toggle('daily')} />
                        <span className={styles.slider}></span>
                    </label>
                </div>

                <div className={styles.toggleItem}>
                    <div className={styles.toggleInfo}>
                        <h4>Uudet reseptit</h4>
                        <p>Ilmoita, kun AI löytää uusia suosikkeja.</p>
                    </div>
                    <label className={styles.switch}>
                        <input type="checkbox" checked={settings.newRecipes} onChange={() => toggle('newRecipes')} />
                        <span className={styles.slider}></span>
                    </label>
                </div>

                <div className={styles.toggleItem}>
                    <div className={styles.toggleInfo}>
                        <h4>Ostoslista-ilmoitukset</h4>
                        <p>Muistuta, kun tärkeitä aineita puuttuu.</p>
                    </div>
                    <label className={styles.switch}>
                        <input type="checkbox" checked={settings.shopping} onChange={() => toggle('shopping')} />
                        <span className={styles.slider}></span>
                    </label>
                </div>
            </div>
        </div>
    );
}
