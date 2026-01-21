
import { supabase } from './supabase';

export interface ShoppingListItem {
    id?: string;
    user_id?: string;
    item_name: string;
    is_checked: boolean;
    category?: string;
}

export interface SavedRecipe {
    id?: string; // Database ID
    user_id?: string;
    recipe_id: string; // The valid 'gen-x' or 'recipe-x' ID
    recipe_data: any;
    created_at?: string;
}

export const db = {
    // --- Shopping List ---
    async addToShoppingList(items: string[]) {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return false;

            const records = items.map(item => ({
                user_id: user.id,
                item_name: item,
                is_checked: false,
                category: 'Muu' // Default category
            }));

            const { error } = await supabase.from('shopping_list').insert(records);
            if (error) {
                console.error("Error adding to shopping list:", error);
                return false;
            }
            return true;
        } catch (e) {
            console.error("Db error:", e);
            return false;
        }
    },

    async getShoppingList() {
        const { data, error } = await supabase
            .from('shopping_list')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error("Error fetching shopping list:", error);
            return [];
        }
        return data;
    },

    async toggleShoppingItem(id: string, is_checked: boolean) {
        const { error } = await supabase
            .from('shopping_list')
            .update({ is_checked })
            .eq('id', id);
        return !error;
    },

    async deleteShoppingItem(id: string) {
        const { error } = await supabase.from('shopping_list').delete().eq('id', id);
        return !error;
    },

    // --- Recipes ---
    async saveRecipes(recipes: any[]) {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return false;

            // Cleanse data before saving (remove large base64 images if present, etc)
            const sanitized = recipes.map(r => ({
                user_id: user.id,
                recipe_id: r.id,
                recipe_data: r
            }));

            const { error } = await supabase.from('saved_recipes').insert(sanitized);
            if (error) {
                console.error("Error saving recipes:", error);
                return false;
            }
            return true;
        } catch (e) {
            console.error("Db error:", e);
            return false;
        }
    },

    async getSavedRecipes() {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return [];

        const { data, error } = await supabase
            .from('saved_recipes')
            .select('recipe_data')
            .order('created_at', { ascending: false });

        if (error) {
            console.error("Error getting saved recipes:", error);
            return [];
        }
        return data.map(row => row.recipe_data);
    }
};
