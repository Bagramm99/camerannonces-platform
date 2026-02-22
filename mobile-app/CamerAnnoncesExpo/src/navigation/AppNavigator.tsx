// src/navigation/AppNavigator.tsx
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { View, ActivityIndicator, Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useAuth } from '../contexts/AuthContext';

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
import EditProfileScreen from '../screens/user/EditProfileScreen';
import NotificationsScreen from '../screens/user/NotificationsScreen';
import SettingsScreen from '../screens/user/SettingsScreen';
import HelpScreen from '../screens/user/HelpScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Stack Navigation pour l'authentification
const AuthStack = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
);

// Tab Navigation principale avec SafeArea pour Expo
const MainTabs = () => {
    const insets = useSafeAreaInsets();

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ color, size }) => {
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
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    elevation: 0,
                    backgroundColor: '#ffffff',
                    borderTopWidth: 1,
                    borderTopColor: '#e0e0e0',
                    height: 60 + insets.bottom,
                    paddingBottom: Math.max(insets.bottom, 5),
                    paddingTop: 8,
                    paddingHorizontal: 5,
                },
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: '500',
                    marginBottom: Math.max(insets.bottom - 20, 0),
                },
                headerStyle: {
                    backgroundColor: '#0066CC',
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                    fontWeight: 'bold',
                },
                tabBarHideOnKeyboard: true,
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
};

// Stack Navigation principal avec SafeAreaProvider pour Expo
const AppNavigator = () => {
    const { isAuthenticated, loading } = useAuth();

    // Loading Screen während Auth-Check
    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
                <ActivityIndicator size="large" color="#0066CC" />
                <Text style={{ marginTop: 10, fontSize: 16, color: '#666' }}>
                    Chargement...
                </Text>
            </View>
        );
    }

    return (
        <SafeAreaProvider>
            <View style={{ flex: 1 }}>
                <Stack.Navigator screenOptions={{ headerShown: false }}>
                    {isAuthenticated ? (
                        <>
                            <Stack.Screen name="MainTabs" component={MainTabs} />

                            {/* Screens de listings */}
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

                            {/* Screens utilisateur */}
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
                            <Stack.Screen
                                name="EditProfile"
                                component={EditProfileScreen}
                                options={{
                                    title: 'Modifier le Profil',
                                    headerShown: true,
                                    headerStyle: { backgroundColor: '#0066CC' },
                                    headerTintColor: '#fff',
                                }}
                            />
                            <Stack.Screen
                                name="Notifications"
                                component={NotificationsScreen}
                                options={{
                                    title: 'Notifications',
                                    headerShown: true,
                                    headerStyle: { backgroundColor: '#0066CC' },
                                    headerTintColor: '#fff',
                                }}
                            />
                            <Stack.Screen
                                name="Settings"
                                component={SettingsScreen}
                                options={{
                                    title: 'Paramètres',
                                    headerShown: true,
                                    headerStyle: { backgroundColor: '#0066CC' },
                                    headerTintColor: '#fff',
                                }}
                            />
                            <Stack.Screen
                                name="Help"
                                component={HelpScreen}
                                options={{
                                    title: 'Aide & Support',
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
            </View>
        </SafeAreaProvider>
    );
};

export default AppNavigator;