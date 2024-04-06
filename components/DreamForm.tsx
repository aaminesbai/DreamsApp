import React, {useState} from 'react';
import {
  Alert,
  Animated,
  Dimensions,
  Keyboard,
  ScrollView,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import {Button, Chip, IconButton, TextInput} from 'react-native-paper';
import {DatePickerInput, fr, registerTranslation} from 'react-native-paper-dates'; // Import du composant DatePickerInput
import AsyncStorage from '@react-native-async-storage/async-storage';
import {predefinedCategories} from './categories';
import * as Notifications from 'expo-notifications';

registerTranslation('fr', fr);

const {width} = Dimensions.get('window');

export default function DreamForm({}) {
    const [dreamText, setDreamText] = useState('');
    const [isLucidDream, setIsLucidDream] = useState(false);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [descriptionLength, setDescriptionLength] = useState(0); // État pour suivre le nombre de caractères dans la description
    const [showNewTagInput, setShowNewTagInput] = useState(false);
    const [customTag, setCustomTag] = useState('');
    const [customTags, setCustomTags] = useState([]);
    const [category, setCategory] = useState(''); // État pour la saisie de la catégorie
    const [selectedCategories, setSelectedCategories] = useState([]); // État pour stocker les catégories sélectionnées
    const [inputDate, setInputDate] = useState(undefined); // État pour stocker la date sélectionnée
    const [notificationOpacity] = useState(new Animated.Value(0)); // Animation de l'opacité pour la notification

    // Fonction pour planifier la notification
    const scheduleNotification = async () => {
        try {

            const now = new Date();
            const scheduledTime = now.getTime() + 60 * 60 * 1000; // 1 heure après l'heure actuelle

            await Notifications.scheduleNotificationAsync({
                content: {
                    title: 'Rappel de rêve',
                    body: 'N\'oubliez pas d\'explorer votre rêve !',
                },
                trigger: {
                    date: scheduledTime,
                },
            });

            console.log('Notification scheduled successfully');
        } catch (error) {
            console.error('Error scheduling notification:', error);
        }
    };

    const handleDreamSubmission = async () => {
        // Vérification des champs obligatoires
        if (!title || !description || !dreamText) {
            Alert.alert('Champs obligatoires', 'Veuillez remplir tous les champs obligatoires (*)');
            return;
        }

        try {
            const existingData = await AsyncStorage.getItem('dreamFormDataArray');
            const formDataArray = existingData ? JSON.parse(existingData) : [];

            // Vérification de la date
            if (!inputDate) {
                Alert.alert('Date obligatoire', 'Veuillez sélectionner une date pour votre rêve');
                return;
            }

            // Ajout de la date au format texte
            const formattedDate = `${inputDate.getDate()}/${inputDate.getMonth() + 1}/${inputDate.getFullYear()}`;

            formDataArray.push({
                title,
                description,
                dreamText,
                categories: selectedCategories,
                customTags,
                date: formattedDate
            });

            await AsyncStorage.setItem('dreamFormDataArray', JSON.stringify(formDataArray));

            // Affichage de l'alerte de succès
            Alert.alert('Rêve soumis avec succès', 'Votre rêve a été enregistré avec succès.');
            await scheduleNotification();
        } catch (error) {
            console.error('Erreur lors de la sauvegarde des données:', error);
        }

        // Réinitialisation des champs après la soumission
        setDreamText('');
        setTitle('');
        setDescription('');
        setCustomTag('');
        setCustomTags([]);
        setCategory('');
        setSelectedCategories([]);
        setInputDate(undefined);
    };

    const addCustomTag = () => {
        if (customTag.trim() !== '') {
            setCustomTags([...customTags, customTag.trim()]);
            setCustomTag('');
        }
    };

    const removeCustomTag = (tagToRemove) => {
        setCustomTags(customTags.filter(tag => tag !== tagToRemove));
    };

    const toggleCategory = (selectedCategory) => {
        if (selectedCategories.includes(selectedCategory)) {
            setSelectedCategories(selectedCategories.filter(category => category !== selectedCategory));
        } else {
            setSelectedCategories([...selectedCategories, selectedCategory]);
        }
    };
    const handleDescriptionChange = (text) => {
        setDescription(text);
        setDescriptionLength(text.length);
    };

    return (
        <ScrollView contentContainerStyle={styles.container} persistentScrollbar={true}
                    showsVerticalScrollIndicator={true}>
            <TouchableWithoutFeedback onPress={() => {
                Keyboard.dismiss()
            }}>
                <View style={styles.container}>
                    <TextInput
                        label="Titre *"
                        value={title}
                        onChangeText={(text) => setTitle(text)}
                        maxLength={30}
                        mode="outlined"
                        style={[styles.input, {width: width * 0.8, alignSelf: 'center'}, styles.textInput]}
                    />
                    <TextInput
                        label={`Description * (${descriptionLength}/60)`}
                        value={description}
                        onChangeText={handleDescriptionChange}
                        maxLength={60}
                        mode="outlined"
                        multiline
                        numberOfLines={2}
                        style={[styles.input, {width: width * 0.8, alignSelf: 'center'}, styles.textInput]}
                    />
                    <TextInput
                        label="Rêve *"
                        value={dreamText}
                        onChangeText={(text) => setDreamText(text)}
                        mode="outlined"
                        multiline
                        numberOfLines={6}
                        style={[styles.input, {width: width * 0.8, height: 200, alignSelf: 'center'}, styles.textInput]}
                    />
                    <DatePickerInput
                        locale="fr"
                        label="Date du rêve"
                        value={inputDate}
                        onChange={(date) => setInputDate(date)}
                        inputMode="start"
                        style={[styles.input, {width: width * 0.5, alignSelf: 'center'}]}
                    />
                    <View style={styles.chipsContainer}>
                        <Text>Catégories prédéfinies:</Text>
                        <View style={styles.chips}>
                            {predefinedCategories.map((category, index) => (
                                <Chip
                                    key={index}
                                    mode="outlined"
                                    selected={selectedCategories.includes(category.name)}
                                    onPress={() => toggleCategory(category.name)}
                                    style={styles.chip}
                                >
                                    {category.emoji} {category.name}
                                </Chip>
                            ))}
                        </View>
                    </View>
                    <View style={styles.inputContainer}>
                        <Text>Étiquettes personnalisées: </Text>
                        <Button onPress={() => setShowNewTagInput(!showNewTagInput)}>
                            {showNewTagInput ? 'Annuler' : 'Nouvelle étiquette'}
                        </Button>
                    </View>
                    <View style={[styles.input, {
                        flexDirection: 'row',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        marginTop: -20
                    }]}>
                        {showNewTagInput && (
                            <View style={styles.inputContainer}>
                                <TextInput
                                    label="Nouvelle étiquette"
                                    value={customTag}
                                    onChangeText={(text) => setCustomTag(text)}
                                    mode="outlined"
                                    style={[styles.input, {flex: 1}]}
                                />
                                <IconButton
                                    icon="plus"
                                    onPress={addCustomTag}
                                    style={{alignSelf: 'center'}}
                                />
                            </View>
                        )}
                    </View>
                    <View style={styles.tagsContainer}>
                        {customTags.map((tag, index) => (
                            <Chip
                                key={index}
                                onPress={() => removeCustomTag(tag)}
                                style={styles.tagChip}
                            >
                                <Text>{tag}</Text>
                                <IconButton
                                    size={16}
                                    icon="close"
                                    onPress={() => removeCustomTag(tag)}
                                    style={{marginVertical: 0, marginHorizontal: 0}}
                                />
                            </Chip>
                        ))}
                    </View>

                    <Button mode="contained" onPress={handleDreamSubmission} style={styles.button}>
                        Soumettre
                    </Button>
                </View>
            </TouchableWithoutFeedback>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
    },
    input: {
        marginBottom: 16,
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
        marginTop: 8,
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    chipsContainer: {
        marginBottom: 10,
    },
    chips: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 8,
    },
    chip: {
        margin: 4,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    tagsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    tagChip: {
        margin: 4,
    },
    button: {
        marginTop: 8,
    },
    textInput: {
        backgroundColor: '#F5F5F5', // Couleur de fond par défaut
    },
});
