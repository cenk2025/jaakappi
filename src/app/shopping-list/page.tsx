"use client";

import { useState } from 'react';
import {
    Plus,
    Trash2,
    CheckCircle2,
    Circle,
    Package,
    ShoppingCart
} from 'lucide-react';
import styles from './ShoppingList.module.css';

interface ShoppingItem {
    id: string;
    name: string;
    category: string;
    checked: boolean;
}

const initialItems: ShoppingItem[] = [
    { id: '1', name: 'Feta-juusto', category: 'Maitotuotteet', checked: false },
    { id: '2', name: 'Kirsikkatomaatit', category: 'Vihannekset', checked: false },
    { id: '3', name: 'Oliiviöljy', category: 'Kuivatuotteet', checked: true }
];

export default function ShoppingListPage() {
    const [items, setItems] = useState<ShoppingItem[]>(initialItems);
    const [newItem, setNewItem] = useState('');

    const addItem = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newItem.trim()) return;

        const item: ShoppingItem = {
            id: Math.random().toString(36).substr(2, 9),
            name: newItem,
            category: 'Muu',
            checked: false
        };

        setItems([...items, item]);
        setNewItem('');
    };

    const toggleItem = (id: string) => {
        setItems(items.map(item =>
            item.id === id ? { ...item, checked: !item.checked } : item
        ));
    };

    const deleteItem = (id: string) => {
        setItems(items.filter(item => item.id !== id));
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
