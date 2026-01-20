"use client";

import { useState, useRef } from 'react';
import { Camera, Upload, Loader2, Sparkles, AlertCircle } from 'lucide-react';
import styles from './Scanner.module.css';

interface ScannerProps {
    onIngredientsDetected: (ingredients: string[]) => void;
}

export default function Scanner({ onIngredientsDetected }: ScannerProps) {
    const [isScanning, setIsScanning] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const resizeImage = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (event) => {
                const img = new Image();
                img.src = event.target?.result as string;
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const MAX_WIDTH = 1024;
                    const MAX_HEIGHT = 1024;
                    let width = img.width;
                    let height = img.height;

                    if (width > height) {
                        if (width > MAX_WIDTH) {
                            height *= MAX_WIDTH / width;
                            width = MAX_WIDTH;
                        }
                    } else {
                        if (height > MAX_HEIGHT) {
                            width *= MAX_HEIGHT / height;
                            height = MAX_HEIGHT;
                        }
                    }

                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx?.drawImage(img, 0, 0, width, height);
                    resolve(canvas.toDataURL('image/jpeg', 0.7)); // Compress to JPEG
                };
                img.onerror = (err) => reject(err);
            };
            reader.onerror = (err) => reject(err);
        });
    };

    const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setIsScanning(true);
        setError(null);

        try {
            // Resize and compress image before sending
            const base64Image = await resizeImage(file);

            const response = await fetch('/api/analyze-fridge', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ image: base64Image }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Analyysi epäonnistui');
            }

            const data = await response.json();
            if (data.ingredients && data.ingredients.length > 0) {
                onIngredientsDetected(data.ingredients);
            } else {
                throw new Error('Jääkaapista ei tunnistettu aineksia.');
            }
        } catch (err: any) {
            console.error("Scanning failed", err);
            setError(err.message || "Tuntematon virhe tapahtui.");
        } finally {
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
                {error && (
                    <div className="flex items-center justify-center gap-2 text-red-400 mt-2 bg-red-900/20 p-2 rounded-lg">
                        <AlertCircle size={16} />
                        <span className="text-sm">{error}</span>
                    </div>
                )}
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
