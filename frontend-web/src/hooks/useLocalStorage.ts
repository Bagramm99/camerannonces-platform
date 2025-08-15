// src/hooks/useLocalStorage.ts
import { useState, useEffect } from 'react';

type SetValue<T> = T | ((val: T) => T);

function useLocalStorage<T>(
    key: string,
    initialValue: T
): [T, (value: SetValue<T>) => void, () => void] {

    // Fonction pour lire la valeur depuis localStorage
    const readValue = (): T => {
        if (typeof window === 'undefined') {
            return initialValue;
        }

        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.warn(`Erreur lecture localStorage key "${key}":`, error);
            return initialValue;
        }
    };

    // État local avec valeur initiale depuis localStorage
    const [storedValue, setStoredValue] = useState<T>(readValue);

    // Fonction pour définir une nouvelle valeur
    const setValue = (value: SetValue<T>) => {
        try {
            // Permettre value d'être une fonction pour la même API que useState
            const valueToStore = value instanceof Function ? value(storedValue) : value;

            // Sauvegarder dans l'état local
            setStoredValue(valueToStore);

            // Sauvegarder dans localStorage
            if (typeof window !== 'undefined') {
                window.localStorage.setItem(key, JSON.stringify(valueToStore));
            }
        } catch (error) {
            console.error(`Erreur sauvegarde localStorage key "${key}":`, error);
        }
    };

    // Fonction pour supprimer la valeur
    const removeValue = () => {
        try {
            setStoredValue(initialValue);
            if (typeof window !== 'undefined') {
                window.localStorage.removeItem(key);
            }
        } catch (error) {
            console.error(`Erreur suppression localStorage key "${key}":`, error);
        }
    };

    // Écouter les changements dans localStorage (pour synchroniser entre onglets)
    useEffect(() => {
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === key && e.newValue !== null) {
                try {
                    setStoredValue(JSON.parse(e.newValue));
                } catch (error) {
                    console.warn(`Erreur parsing storage event pour key "${key}":`, error);
                }
            }
        };

        // Ajouter l'écouteur
        window.addEventListener('storage', handleStorageChange);

        // Nettoyer
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, [key]);

    return [storedValue, setValue, removeValue];
}

export default useLocalStorage;