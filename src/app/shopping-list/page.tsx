"use client";

import { useState, useEffect } from 'react';
import {
    Plus,
    Trash2,
    CheckCircle2,
    Circle,
    Package,
    ShoppingCart
} from 'lucide-react';
import styles from './ShoppingList.module.css';

import { db } from '@/lib/db-actions';

interface ShoppingItem {
    id: string;
    name: string;
    category: string;
    checked: boolean;
}
// Remove ShoppingListItem import to avoid confusion
// import { ShoppingListItem } from '@/lib/db-actions';

// ...

export default function ShoppingListPage() {
    const [items, setItems] = useState<ShoppingItem[]>([]);
    const [newItem, setNewItem] = useState('');

    useEffect(() => {
        loadItems();
    }, []);

    const loadItems = async () => {
        const data = await db.getShoppingList();
        const mapped = data.map((item: any) => ({
            id: item.id,
            name: item.item_name,
            category: item.category || 'Muu',
            checked: item.is_checked
        }));
        setItems(mapped);
    };

    const addItem = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newItem.trim()) return;

        const success = await db.addToShoppingList([newItem]);
        if (success) {
            setNewItem('');
            loadItems();
        }
    };

    const toggleItem = async (id: string) => {
        // Optimistic update
        const item = items.find(i => i.id === id);
        if (!item) return;

        const newStatus = !item.checked;
        setItems(items.map(i => i.id === id ? { ...i, checked: newStatus } : i));

        await db.toggleShoppingItem(id, newStatus);
    };

    const deleteItem = async (id: string) => {
        // Optimistic update
        setItems(items.filter(i => i.id !== id));
        await db.deleteShoppingItem(id);
    };

    const categories = Array.from(new Set(items.map(i => i.category)));

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1 className="title-gradient">Ostoslista</h1>
                <p className={styles.subtitle}>Tarvitset nämä ainekset reseptejäsi varten.</p>
            </header>

            <form onSubmit={addItem} className={styles.addForm}>
                <div className={styles.inputWrapper}>
                    <Plus size={20} className={styles.plusIcon} />
                    <input
                        type="text"
                        placeholder="Lisää uusi aine..."
                        value={newItem}
                        onChange={(e) => setNewItem(e.target.value)}
                    />
                </div>
                <button type="submit" className={styles.submitBtn}>Lisää</button>
            </form>

            <div className={styles.list}>
                {categories.map(category => (
                    <div key={category} className={styles.categorySection}>
                        <h3 className={styles.categoryTitle}>{category}</h3>
                        <div className={styles.itemsGrid}>
                            {items.filter(i => i.category === category).map(item => (
                                <div
                                    key={item.id}
                                    className={`${styles.item} ${item.checked ? styles.checked : ''}`}
                                >
                                    <button onClick={() => toggleItem(item.id)} className={styles.checkBtn}>
                                        {item.checked ? <CheckCircle2 size={24} color="var(--primary)" /> : <Circle size={24} />}
                                    </button>
                                    <span className={styles.itemName}>{item.name}</span>
                                    <button onClick={() => deleteItem(item.id)} className={styles.deleteBtn}>
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}

                {items.length === 0 && (
                    <div className={styles.emptyState}>
                        <ShoppingCart size={64} className={styles.emptyIcon} />
                        <p>Ostoslistasi on tyhjä.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
