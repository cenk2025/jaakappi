"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Home,
    Utensils,
    ShoppingCart,
    Settings,
    Filter,
    Check,
    LogOut,
    LogIn
} from "lucide-react";
import styles from "./Sidebar.module.css";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

const diets = [
    { id: 'vegetarian', label: 'Kasvissyöjä' },
    { id: 'keto', label: 'Keto' },
    { id: 'vegan', label: 'Vegaani' },
    { id: 'gluten-free', label: 'Gluteeniton' },
    { id: 'low-carb', label: 'Vähähiilihydraattinen' }
];

export default function Sidebar() {
    const pathname = usePathname();
    const [selectedDiets, setSelectedDiets] = useState<string[]>([]);
    const [user, setUser] = useState<any>(null);
    const router = useRouter();

    useEffect(() => {
        // Initial check
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
        });

        // Listen for changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        return () => subscription.unsubscribe();
    }, []);

    const toggleDiet = (id: string) => {
        setSelectedDiets(prev =>
            prev.includes(id) ? prev.filter(d => d !== id) : [...prev, id]
        );
    };

    const handleLogout = async () => {
        try {
            console.log("Starting logout...");
            await supabase.auth.signOut();
            localStorage.clear();
            sessionStorage.clear();
            alert("Kirjauduttu ulos onnistuneesti!");
            window.location.href = "/";
        } catch (error) {
            console.error("Logout error:", error);
            window.location.href = "/";
        }
    };

    const navItems = [
        { href: "/", label: "Koti", icon: Home },
        { href: "/recipes", label: "Reseptit", icon: Utensils },
        { href: "/shopping-list", label: "Ostoslista", icon: ShoppingCart },
        { href: "/settings", label: "Asetukset", icon: Settings },
    ];

    return (
        <aside className={styles.sidebar}>
            <div className={styles.logo}>
                <div className={styles.logoIcon}>AI</div>
                <h1>Kokki<span>Apuri</span></h1>
            </div>

            <nav className={styles.nav}>
                {navItems.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={`${styles.navItem} ${pathname === item.href ? styles.active : ""}`}
                    >
                        <item.icon size={20} />
                        <span>{item.label}</span>
                    </Link>
                ))}
            </nav>

            <div className={styles.filters}>
                <div className={styles.filterHeader}>
                    <Filter size={16} />
                    <span>Ruokavaliot</span>
                </div>
                <div className={styles.dietList}>
                    {diets.map((diet) => (
                        <button
                            key={diet.id}
                            onClick={() => toggleDiet(diet.id)}
                            className={`${styles.dietItem} ${selectedDiets.includes(diet.id) ? styles.selected : ""}`}
                        >
                            {selectedDiets.includes(diet.id) && <Check size={12} />}
                            <span>{diet.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            <div className={styles.userProfile}>
                {user ? (
                    <div className={styles.profileMain}>
                        <img
                            src={`https://ui-avatars.com/api/?name=${user.email}&background=00FF85&color=000`}
                            alt="Profile"
                        />
                        <div className={styles.userInfo}>
                            <p className={styles.userName}>{user.user_metadata?.full_name || user.email?.split('@')[0]}</p>
                            <p className={styles.userStatus}>Seikkailija</p>
                        </div>
                    </div>
                ) : (
                    <Link href="/login" className={styles.profileMain}>
                        <img
                            src="https://ui-avatars.com/api/?name=Vieras&background=333&color=fff"
                            alt="Guest"
                        />
                        <div className={styles.userInfo}>
                            <p className={styles.userName}>Vieras</p>
                            <p className={styles.userStatus}>Kirjaudu sisään</p>
                        </div>
                    </Link>
                )}

                {user ? (
                    <button type="button" onClick={handleLogout} className={styles.logoutBtn} title="Kirjaudu ulos">
                        <LogOut size={20} />
                    </button>
                ) : (
                    <Link href="/login" className={styles.loginBtn} title="Kirjaudu sisään">
                        <LogIn size={20} />
                    </Link>
                )}
            </div>
        </aside>
    );
}
