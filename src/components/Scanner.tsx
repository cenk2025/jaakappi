"use client";

import { useState, useRef } from 'react';
import { Camera, Upload, Loader2, Sparkles } from 'lucide-react';
import styles from './Scanner.module.css';

interface ScannerProps {
    onIngredientsDetected: (ingredients: string[]) => void;
}

export default function Scanner({ onIngredientsDetected }: ScannerProps) {
    const [isScanning, setIsScanning] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setIsScanning(true);

        try {
            // Convert file to base64
            const reader = new FileReader();
            reader.onloadend = async () => {
                const base64Image = reader.result as string;

                const response = await fetch('/api/analyze-fridge', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ image: base64Image }),
                });

                const data = await response.json();
                if (data.ingredients) {
                    onIngredientsDetected(data.ingredients);
                } else {
                    // Fallback to mock if API fails (e.g. no key)
                    const mockIngredients = ['Pinaatti', 'Kananmunat', 'Avokado', 'Lohi', 'Maito'];
                    onIngredientsDetected(mockIngredients);
                }
                setIsScanning(false);
            };
            reader.readAsDataURL(file);
        } catch (error) {
            console.error("Scanning failed", error);
            const mockIngredients = ['Pinaatti', 'Kananmunat', 'Avokado', 'Lohi', 'Maito'];
            onIngredientsDetected(mockIngredients);
            setIsScanning(false);
        }
    };

    return (
        <div className={`${styles.scannerContainer} glass`}>
            <div className={styles.iconCircle}>
                <Camera size={48} className={styles.cameraIcon} />
            </div>

            <div className={styles.textContent}>
                <h2 className="title-gradient">Mitä jääkaapissasi on?</h2>
                <p>Ota kuva aineksistasi saadaksesi välittömiä AI-resepti-ideoita.</p>
            </div>

            <div className={styles.actions}>
                <button
                    className={styles.primaryButton}
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isScanning}
                >
                    {isScanning ? (
                        <>
                            <Loader2 className={styles.spin} size={20} />
                            <span>Analysoidaan...</span>
                        </>
                    ) : (
                        <>
                            <Sparkles size={20} />
                            <span>Skannaa Jääkaappi</span>
                        </>
                    )}
                </button>
                <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    accept="image/*"
                    onChange={handleUpload}
                />
                <p className={styles.hint}>Tai lataa olemassa oleva kuva</p>
            </div>
        </div>
    );
}
