"use client";

import { useState } from 'react';
import { ArrowLeft, Lock, ShieldCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';
import styles from '../Settings.module.css';

export default function SecurityPage() {
    const router = useRouter();
    const [isSaving, setIsSaving] = useState(false);

    const handleUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setTimeout(() => {
            setIsSaving(false);
            alert("Salasana päivitetty!");
        }, 1500);
    };

    return (
        <div className={styles.container}>
            <button onClick={() => router.back()} className={styles.backBtn}>
                <ArrowLeft size={20} />
                <span>Takaisin</span>
            </button>
            <h1 className="title-gradient">Tietoturva</h1>

            <div className={styles.profileCard}>
                <form onSubmit={handleUpdate} className={styles.profileForm}>
                    <div className={styles.formGroup}>
                        <label>Nykyinen salasana</label>
                        <input type="password" placeholder="••••••••" />
                    </div>
                    <div className={styles.formGroup}>
                        <label>Uusi salasana</label>
                        <input type="password" placeholder="••••••••" />
                    </div>
                    <div className={styles.formGroup}>
                        <label>Vahvista uusi salasana</label>
                        <input type="password" placeholder="••••••••" />
                    </div>
                    <button type="submit" className={styles.saveBtn} disabled={isSaving}>
                        {isSaving ? 'Päivitetään...' : 'Vaihda salasana'}
                    </button>
                </form>

                <div className={styles.stats} style={{ marginTop: '2rem' }}>
                    <div className={styles.toggleItem} style={{ width: '100%', border: 'none', background: 'none' }}>
                        <div className={styles.toggleInfo}>
                            <h4>Kaksivaiheinen tunnistautuminen</h4>
                            <p>Lisää tiliisi ylimääräinen suojauskerros.</p>
                        </div>
                        <label className={styles.switch}>
                            <input type="checkbox" />
                            <span className={styles.slider}></span>
                        </label>
                    </div>
                </div>
            </div>
        </div>
    );
}
