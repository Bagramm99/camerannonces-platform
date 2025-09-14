// src/components/common/CategoryCard.tsx
import React from 'react';
import {
    TouchableOpacity,
    Text,
    StyleSheet,
    Dimensions,
    View,
} from 'react-native';

const { width } = Dimensions.get('window');
const cardWidth = (width - 45) / 2; // 2 colonnes avec marges

interface CategoryCardProps {
    category: {
        id: number;
        nom: string;
        emoji: string;
        description: string;
    };
    onPress: () => void;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category, onPress }) => {
    return (
        <TouchableOpacity
            style={styles.card}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <View style={styles.emojiContainer}>
                <Text style={styles.emoji}>{category.emoji}</Text>
            </View>
            <Text style={styles.title} numberOfLines={2}>
                {category.nom}
            </Text>
            <Text style={styles.description} numberOfLines={2}>
                {category.description}
            </Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        width: cardWidth,
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 15,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        alignItems: 'center',
    },
    emojiContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#f0f8ff',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    emoji: {
        fontSize: 24,
    },
    title: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        textAlign: 'center',
        marginBottom: 5,
        lineHeight: 18,
    },
    description: {
        fontSize: 12,
        color: '#666',
        textAlign: 'center',
        lineHeight: 16,
    },
});

export default CategoryCard;