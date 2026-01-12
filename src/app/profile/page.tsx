"use client";

import { useState, useEffect } from 'react';
import { ArrowLeft, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import styles from '../settings/Settings.module.css';

export default function ProfilePage() {
    const router = useRouter();
    const [name, setName] = useState('Chef Julian');
    const [title, setTitle] = useState('Seikkailija');
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setTimeout(() => {
            setIsSaving(false);
            alert("Profiili päivitetty onnistuneesti!");
        }, 1000);
    };

    return (
        <div className={styles.container}>
            <button onClick={() => router.back()} className={styles.backBtn}>
                <ArrowLeft size={20} />
                <span>Takaisin</span>
            </button>
            <h1 className="title-gradient">Profiili</h1>

            <div className={styles.profileCard}>
                <div className={styles.profileHeader}>
                    <img src={`https://ui-avatars.com/api/?name=${name}&background=00FF85&color=000`} alt="Profile" />
                    <div className={styles.profileInfoText}>
                        <form onSubmit={handleSave} className={styles.profileForm}>
                            <div className={styles.formGroup}>
                                <label>Nimi</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Titteli</label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                />
                            </div>
                            <button type="submit" className={styles.saveBtn} disabled={isSaving}>
                                {isSaving ? 'Tallennetaan...' : 'Tallenna muutokset'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
