import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Platform, StyleSheet, Alert, View } from 'react-native';
import { Text, Button } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Notifications from 'expo-notifications';

export default function ModalScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const handleReset = async () => {
    try {
      await AsyncStorage.removeItem('dreamFormDataArray');
      Alert.alert('Réinitialisation effectuée', 'Tous les rêves ont été supprimés.');
      console.log('Réinitialisation des rêves!!');
      // Actualiser la liste des rêves après avoir réinitialisé
    } catch (error) {
      console.error('Erreur lors de la réinitialisation:', error);
    }
  };

  // Activer ou désactiver les notifications
  const toggleNotifications = async () => {
    const newState = !notificationsEnabled;
    setNotificationsEnabled(newState);
    // Enregistrer l'état des notifications dans AsyncStorage
    try {
      await AsyncStorage.setItem('notificationsEnabled', JSON.stringify(newState));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde de l\'état des notifications:', error);
    }
    // Afficher une alerte indiquant si les notifications sont activées ou désactivées
    Alert.alert(
        'Notifications',
        newState ? 'Notifications activées' : 'Notifications désactivées',
    );
    console.log('Notif activées:', newState ? 'Oui' : 'Non');
    // Appliquer le gestionnaire de notification personnalisé pour activer ou désactiver les notifications
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: newState,
        shouldPlaySound: newState,
        shouldSetBadge: newState,
        iosDisplayInForeground: newState
      })
    });
    };

  return (
      <View style={styles.container}>
        <Text style={styles.title}>Paramètres</Text>
        <View style={styles.buttonContainer}>
          <Button
              icon={() => <MaterialCommunityIcons name={notificationsEnabled ? "bell" : "bell-off"} size={24} color="white" />}
              mode="contained"
              onPress={toggleNotifications}
              style={styles.button}
              labelStyle={{ color: 'white' }}
          >
            {notificationsEnabled ? "Notifications activées" : "Notifications désactivées"}
          </Button>
        </View>
        <View style={styles.buttonContainer}>
          <Button
              icon={() => <MaterialCommunityIcons name="refresh" size={24} color="white" />}
              mode="contained"
              onPress={handleReset}
              style={[styles.button, styles.resetButton]}
              labelStyle={{ color: 'white' }}
          >
            Réinitialiser les rêves
          </Button>
        </View>
        <Text style={styles.versionText}>Version 1.0.0</Text>
        <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  buttonContainer: {
    marginBottom: 20,
  },
  button: {
    marginHorizontal: 5,
  },
  resetButton: {
    backgroundColor: '#d9534f',
  },
  versionText: {
    marginTop: 20,
    fontSize: 14,
    color: 'gray',
  },
});

