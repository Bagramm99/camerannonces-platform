// src/navigation/AppNavigator.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';

// Screens
import HomeScreen from '../screens/main/HomeScreen';
import CategoryScreen from '../screens/listings/CategoryScreen';
import ListingDetailScreen from '../screens/listings/ListingDetailScreen';
import CreateListingScreen from '../screens/listings/CreateListingScreen';
import SearchScreen from '../screens/main/SearchScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import ProfileScreen from '../screens/user/ProfileScreen';
import MyListingsScreen from '../screens/user/MyListingsScreen';
import FavoritesScreen from '../screens/user/FavoritesScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Stack Navigation pour l'authentification
const AuthStack = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
);

// Tab Navigation principale
const MainTabs = () => (
    <Tab.Navigator
        screenOptions={({ route }) => ({
            tabBarIcon: ({color, size }) => {
                let iconName = '';

                switch (route.name) {
                    case 'Accueil':
                        iconName = 'home';
                        break;
                    case 'Recherche':
                        iconName = 'search';
                        break;
                    case 'Publier':
                        iconName = 'add-circle';
                        break;
                    case 'Favoris':
                        iconName = 'favorite';
                        break;
                    case 'Profil':
                        iconName = 'person';
                        break;
                }

                return <Icon name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: '#0066CC',
            tabBarInactiveTintColor: 'gray',
            tabBarStyle: {
                paddingBottom: 5,
                paddingTop: 5,
                height: 60,
            },
            headerStyle: {
                backgroundColor: '#0066CC',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
                fontWeight: 'bold',
            },
        })}
    >
        <Tab.Screen
            name="Accueil"
            component={HomeScreen}
            options={{ title: '🇨🇲 CamerAnnonces' }}
        />
        <Tab.Screen
            name="Recherche"
            component={SearchScreen}
            options={{ title: 'Rechercher' }}
        />
        <Tab.Screen
            name="Publier"
            component={CreateListingScreen}
            options={{ title: 'Publier' }}
        />
        <Tab.Screen
            name="Favoris"
            component={FavoritesScreen}
            options={{ title: 'Mes Favoris' }}
        />
        <Tab.Screen
            name="Profil"
            component={ProfileScreen}
            options={{ title: 'Mon Profil' }}
        />
    </Tab.Navigator>
);

// Stack Navigation principal
const AppNavigator = () => {
    const isLoggedIn = true; // Tu remplaceras par ton state d'authentification

    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                {isLoggedIn ? (
                    <>
                        <Stack.Screen name="MainTabs" component={MainTabs} />
                        <Stack.Screen
                            name="CategoryScreen"
                            component={CategoryScreen}
                            options={({ route }) => ({
                                title: route.params?.categoryName || 'Catégorie',
                                headerShown: true,
                                headerStyle: { backgroundColor: '#0066CC' },
                                headerTintColor: '#fff',
                            })}
                        />
                        <Stack.Screen
                            name="ListingDetail"
                            component={ListingDetailScreen}
                            options={{
                                title: 'Détail Annonce',
                                headerShown: true,
                                headerStyle: { backgroundColor: '#0066CC' },
                                headerTintColor: '#fff',
                            }}
                        />
                        <Stack.Screen
                            name="MyListings"
                            component={MyListingsScreen}
                            options={{
                                title: 'Mes Annonces',
                                headerShown: true,
                                headerStyle: { backgroundColor: '#0066CC' },
                                headerTintColor: '#fff',
                            }}
                        />
                    </>
                ) : (
                    <Stack.Screen name="Auth" component={AuthStack} />
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;