// context/CartContext.tsx
"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useSession } from "next-auth/react"; // 👈 Import Session

interface CartItem {
    variantId: number;
    productId: number;
    name: string;
    price: number;
    image: string;
    size: string;
    quantity: number;
    maxStock: number;
}

interface CartContextType {
    items: CartItem[];
    addToCart: (item: CartItem) => void;
    removeFromCart: (variantId: number) => void;
    updateQuantity: (variantId: number, quantity: number) => void;
    cartCount: number;
    cartTotal: number;
    clearCart: () => void; // 👈 Added helper to clear manually if needed
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const { data: session } = useSession(); // 👈 Get current user
    const [items, setItems] = useState<CartItem[]>([]);

    // 1. Determine the Storage Key based on who is logged in
    // If logged in: "cart-user@email.com"
    // If guest: "cart-guest"
    const cartKey = session?.user?.email
        ? `cotton-bloom-cart-${session.user.email}`
        : "cotton-bloom-cart-guest";

    // 2. Load Cart whenever the KEY changes (e.g. User logs in/out)
    useEffect(() => {
        // We add a small delay or check to ensure we don't overwrite user data with empty data during loading
        const savedCart = localStorage.getItem(cartKey);
        if (savedCart) {
            setItems(JSON.parse(savedCart));
        } else {
            setItems([]); // Reset to empty if new user has no saved cart
        }
    }, [cartKey]); // 👈 Re-run this when user changes

    // 3. Save Cart to LocalStorage whenever items change
    useEffect(() => {
        localStorage.setItem(cartKey, JSON.stringify(items));
    }, [items, cartKey]);

    const addToCart = (newItem: CartItem) => {
        setItems((prev) => {
            const existing = prev.find((i) => i.variantId === newItem.variantId);
            if (existing) {
                return prev.map((i) =>
                    i.variantId === newItem.variantId
                        ? { ...i, quantity: Math.min(i.quantity + 1, i.maxStock) }
                        : i
                );
            }
            return [...prev, newItem];
        });
    };

    const updateQuantity = (variantId: number, newQuantity: number) => {
        setItems((prev) =>
            prev.map((i) => {
                if (i.variantId === variantId) {
                    const validQuantity = Math.max(1, Math.min(newQuantity, i.maxStock));
                    return { ...i, quantity: validQuantity };
                }
                return i;
            })
        );
    };

    const removeFromCart = (variantId: number) => {
        setItems((prev) => prev.filter((i) => i.variantId !== variantId));
    };

    const clearCart = () => {
        setItems([]);
        localStorage.removeItem(cartKey);
    };

    const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);
    const cartTotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

    return (
        <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQuantity, cartCount, cartTotal, clearCart }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (!context) throw new Error("useCart must be used within a CartProvider");
    return context;
}