// src/components/listings/FilterModal.tsx
import React, { useState } from 'react';
import {
    Modal,
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    TextInput,
    Switch,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

// Constantes locales (remplace l'import manquant)
const PRODUCT_CONDITIONS = [
    { value: 'NEUF', label: 'Neuf', color: '#00C851' },
    { value: 'TRES_BON', label: 'Très bon état', color: '#2E7D32' },
    { value: 'BON', label: 'Bon état', color: '#FF9800' },
    { value: 'MOYEN', label: 'État moyen', color: '#FF5722' },
    { value: 'A_REPARER', label: 'À réparer', color: '#F44336' },
];

interface FilterModalProps {
    visible: boolean;
    categoryId?: number; // Optionnel
    currentFilters: any;
    onApply: (filters: any) => void;
    onClose: () => void;
}

const FilterModal: React.FC<FilterModalProps> = ({
                                                     visible,
                                                     categoryId: _categoryId, // Préfixe avec underscore pour indiquer qu'il n'est pas utilisé
                                                     currentFilters,
                                                     onApply,
                                                     onClose,
                                                 }) => {
    const [filters, setFilters] = useState({
        prix_min: '',
        prix_max: '',
        etat_produit: '',
        ville: '',
        region: '',
        prix_negociable: false,
        livraison_domicile: false,
        is_urgent: false,
        ...currentFilters
    });

    const handleFilterChange = (key: string, value: any) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const handleApply = () => {
        // Nettoyer les filtres vides
        const cleanFilters = Object.fromEntries(
            Object.entries(filters as Record<string, unknown>).filter(([_, value]) => {
                if (typeof value === 'string') return value.trim() !== '';
                if (typeof value === 'boolean') return value === true;
                return value !== null && value !== undefined;
            })
        );


        onApply(cleanFilters);
    };

    const handleReset = () => {
        setFilters({
            prix_min: '',
            prix_max: '',
            etat_produit: '',
            ville: '',
            region: '',
            prix_negociable: false,
            livraison_domicile: false,
            is_urgent: false,
        });
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            presentationStyle="pageSheet"
        >
            <View style={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                        <Icon name="close" size={24} color="#333" />
                    </TouchableOpacity>
                    <Text style={styles.title}>Filtrer les annonces</Text>
                    <TouchableOpacity onPress={handleReset} style={styles.resetButton}>
                        <Text style={styles.resetText}>Reset</Text>
                    </TouchableOpacity>
                </View>

                <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                    {/* Prix */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>💰 Prix (FCFA)</Text>
                        <View style={styles.priceRow}>
                            <View style={styles.priceInput}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Min"
                                    value={filters.prix_min}
                                    onChangeText={(value) => handleFilterChange('prix_min', value)}
                                    keyboardType="numeric"
                                />
                            </View>
                            <Text style={styles.priceSeparator}>-</Text>
                            <View style={styles.priceInput}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Max"
                                    value={filters.prix_max}
                                    onChangeText={(value) => handleFilterChange('prix_max', value)}
                                    keyboardType="numeric"
                                />
                            </View>
                        </View>
                    </View>

                    {/* État du produit */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>🔧 État du produit</Text>
                        <View style={styles.conditionsGrid}>
                            {PRODUCT_CONDITIONS.map((condition) => (
                                <TouchableOpacity
                                    key={condition.value}
                                    style={[
                                        styles.conditionChip,
                                        filters.etat_produit === condition.value && styles.conditionChipActive
                                    ]}
                                    onPress={() => handleFilterChange('etat_produit',
                                        filters.etat_produit === condition.value ? '' : condition.value
                                    )}
                                >
                                    <View style={[styles.conditionDot, { backgroundColor: condition.color }]} />
                                    <Text style={[
                                        styles.conditionText,
                                        filters.etat_produit === condition.value && styles.conditionTextActive
                                    ]}>
                                        {condition.label}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    {/* Localisation */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>📍 Localisation</Text>
                        <View style={styles.inputContainer}>
                            <TextInput
                                style={styles.input}
                                placeholder="Ville (ex: Douala, Yaoundé...)"
                                value={filters.ville}
                                onChangeText={(value) => handleFilterChange('ville', value)}
                            />
                        </View>
                    </View>

                    {/* Options */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>⚙️ Options</Text>

                        <View style={styles.switchRow}>
                            <Text style={styles.switchLabel}>Prix négociable</Text>
                            <Switch
                                value={filters.prix_negociable}
                                onValueChange={(value) => handleFilterChange('prix_negociable', value)}
                                trackColor={{ false: '#ddd', true: '#0066CC' }}
                            />
                        </View>

                        <View style={styles.switchRow}>
                            <Text style={styles.switchLabel}>Livraison à domicile</Text>
                            <Switch
                                value={filters.livraison_domicile}
                                onValueChange={(value) => handleFilterChange('livraison_domicile', value)}
                                trackColor={{ false: '#ddd', true: '#0066CC' }}
                            />
                        </View>

                        <View style={styles.switchRow}>
                            <Text style={styles.switchLabel}>Annonces urgentes uniquement</Text>
                            <Switch
                                value={filters.is_urgent}
                                onValueChange={(value) => handleFilterChange('is_urgent', value)}
                                trackColor={{ false: '#ddd', true: '#ff4444' }}
                            />
                        </View>
                    </View>
                </ScrollView>

                {/* Footer */}
                <View style={styles.footer}>
                    <TouchableOpacity
                        style={styles.applyButton}
                        onPress={handleApply}
                    >
                        <Icon name="check" size={20} color="#fff" />
                        <Text style={styles.applyButtonText}>Appliquer les filtres</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    closeButton: {
        padding: 5,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    resetButton: {
        padding: 5,
    },
    resetText: {
        color: '#0066CC',
        fontWeight: '600',
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
    },
    section: {
        marginVertical: 20,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 15,
    },
    priceRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    priceInput: {
        flex: 1,
    },
    priceSeparator: {
        marginHorizontal: 10,
        fontSize: 16,
        color: '#666',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontSize: 16,
        backgroundColor: '#f8f9fa',
    },
    inputContainer: {
        marginBottom: 10,
    },
    conditionsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginHorizontal: -5,
    },
    conditionChip: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 20,
        paddingHorizontal: 12,
        paddingVertical: 8,
        margin: 5,
    },
    conditionChipActive: {
        backgroundColor: '#0066CC',
        borderColor: '#0066CC',
    },
    conditionDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: 8,
    },
    conditionText: {
        fontSize: 14,
        color: '#666',
    },
    conditionTextActive: {
        color: '#fff',
        fontWeight: '600',
    },
    switchRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    switchLabel: {
        fontSize: 16,
        color: '#333',
    },
    footer: {
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: '#eee',
    },
    applyButton: {
        backgroundColor: '#0066CC',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 15,
        borderRadius: 10,
    },
    applyButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 8,
    },
});

export default FilterModal;