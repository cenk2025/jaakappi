"use client";

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './Login.module.css';
import { ChefHat, Mail, Lock, ArrowRight } from 'lucide-react';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [isSignUp, setIsSignUp] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (isSignUp) {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: {
                            full_name: email.split('@')[0],
                        }
                    }
                });
                if (error) throw error;
                alert("Vahvistusviesti on lähetetty sähköpostiisi!");
            } else {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;
                router.push('/');
                router.refresh();
            }
        } catch (err: any) {
            setError(err.message || "Tapahtui virhe");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.loginCard}>
                <div className={styles.header}>
                    <div className={styles.logo}>
                        <ChefHat size={40} color="var(--primary)" />
                    </div>
                    <h1>{isSignUp ? 'Luo tili' : 'Tervetuloa takaisin'}</h1>
                    <p>{isSignUp ? 'Aloita älykkäämpi kokkaus tänään' : 'Kirjaudu sisään jatkaaksesi'}</p>
                </div>

                <form onSubmit={handleAuth} className={styles.form}>
                    {error && <div className={styles.error}>{error}</div>}

                    <div className={styles.inputGroup}>
                        <label><Mail size={18} /> Sähköposti</label>
                        <input
                            type="email"
                            placeholder="esimerkki@mail.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label><Lock size={18} /> Salasana</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className={styles.submitBtn} disabled={loading}>
                        {loading ? 'Käsitellään...' : (isSignUp ? 'Luo tili' : 'Kirjaudu sisään')}
                        <ArrowRight size={20} />
                    </button>
                </form>

                <div className={styles.footer}>
                    <button onClick={() => setIsSignUp(!isSignUp)} className={styles.switchBtn}>
                        {isSignUp ? 'Onko sinulla jo tili? Kirjaudu' : 'Eikö sinulla ole tiliä? Rekisteröidy'}
                    </button>
                </div>

                <Link href="/" className={styles.backHome}>
                    Palaa etusivulle
                </Link>
            </div>
        </div>
    );
}
