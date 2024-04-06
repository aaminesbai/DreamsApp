import React, {useCallback, useEffect, useState} from 'react';
import {Alert, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {ActivityIndicator, Button, Chip, IconButton, List, TextInput} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {predefinedCategories} from './categories';
import {API_KEY} from '@/API_CONFIG';
import {MaterialCommunityIcons} from "@expo/vector-icons";

export default function DreamList() {
    // Déclaration des états
    const [dreams, setDreams] = useState([]);
    const [originalDreams, setOriginalDreams] = useState([]);
    const [selectedDream, setSelectedDream] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [sortByModalVisible, setSortByModalVisible] = useState(false);
    const [sortBy, setSortBy] = useState('Ajout');
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [analysisResult, setAnalysisResult] = useState(null);
    const [loading, setLoading] = useState(false);

    // Fonction pour récupérer les rêves depuis AsyncStorage
    const fetchDreams = useCallback(async () => {
        try {
            const data = await AsyncStorage.getItem('dreamFormDataArray');
            const dreamFormDataArray = data ? JSON.parse(data) : [];
            setDreams(dreamFormDataArray);
            setOriginalDreams([...dreamFormDataArray]);
        } catch (error) {
            console.error('Erreur lors de la récupération des données:', error);
        }
    }, []);

    // Effet pour charger les rêves au montage du composant
    useEffect(() => {
        const fetchData = async () => {
            try {
                await fetchDreams();
            } catch (error) {
                console.error('Erreur lors de la récupération des rêves:', error);
            }
        };
        fetchData();
    }, [fetchDreams]);

    // Effet pour filtrer les rêves en fonction de la catégorie et de la recherche
    useEffect(() => {
        const filterDreams = () => {
            let filteredDreams = [...originalDreams];

            if (selectedCategory) {
                filteredDreams = filteredDreams.filter(dream => dream.categories && dream.categories.includes(selectedCategory));
            }

            if (searchQuery.trim() !== '') {
                const lowerCaseQuery = searchQuery.toLowerCase();
                filteredDreams = filteredDreams.filter(dream => {
                    return (
                        dream.title.toLowerCase().includes(lowerCaseQuery) ||
                        dream.description.toLowerCase().includes(lowerCaseQuery) ||
                        dream.dreamText.toLowerCase().includes(lowerCaseQuery)
                    );
                });
            }

            setDreams(filteredDreams);
        };

        filterDreams();
    }, [searchQuery, selectedCategory, originalDreams]);

    // Fonction pour afficher les détails d'un rêve
    const showDreamDetails = (dream) => {
        setAnalysisResult(null);
        setSelectedDream(dream);
        setModalVisible(true);
    };

    // Fonction pour masquer les détails d'un rêve
    const hideDreamDetails = () => {
        setSelectedDream(null);
        setModalVisible(false);
    };

    // Fonction pour comparer les dates de deux rêves
    const compareDates = (dateString1, dateString2) => {
        const [day1, month1, year1] = dateString1.split('/').map(Number);
        const [day2, month2, year2] = dateString2.split('/').map(Number);

        if (year1 !== year2) {
            return year1 - year2;
        }
        if (month1 !== month2) {
            return month1 - month2;
        }
        return day1 - day2;
    };

    // Fonction pour filtrer les rêves par catégorie et recherche
    const filterDreamsByCategoryAndSearch = (category) => {
        let filteredDreams = originalDreams;

        if (category) {
            filteredDreams = filteredDreams.filter(dream => dream.categories && dream.categories.includes(category));
        }

        if (searchQuery.trim() !== '') {
            const lowerCaseQuery = searchQuery.toLowerCase();
            filteredDreams = filteredDreams.filter(dream => {
                return (
                    dream.title.toLowerCase().includes(lowerCaseQuery) ||
                    dream.description.toLowerCase().includes(lowerCaseQuery) ||
                    dream.dreamText.toLowerCase().includes(lowerCaseQuery)
                );
            });
        }

        setDreams(filteredDreams);
        setSelectedCategory(category);
        setSortBy('Catégorie');
        setSortByModalVisible(false);
    };

    // Fonction pour trier les rêves
    const sortDreams = () => {
        let sortedDreams = [...dreams];
        switch (sortBy) {
            case 'Date croissante':
                sortedDreams.sort((a, b) => compareDates(a.date, b.date));
                break;
            case 'Date décroissante':
                sortedDreams.sort((a, b) => compareDates(b.date, a.date));
                break;
            case 'Catégories':
                break;
            case 'Ajout':
                sortedDreams = [...originalDreams];
                if (selectedCategory) {
                    filterDreamsByCategoryAndSearch(null);
                }
                break;
            default:
                break;
        }
        setDreams(sortedDreams);
        setSortByModalVisible(false);
    };

    // Fonction pour analyser le texte d'un rêve
    const analyzeDreamText = async (dreamText) => {
        try {
            setLoading(true);
            const apiUrl = 'https://api.meaningcloud.com/topics-2.0';
            const language = 'en';
            const apiKey = API_KEY;

            const formdata = new FormData();
            formdata.append('key', apiKey);
            formdata.append('lang', language);
            formdata.append('tt', 'a');
            formdata.append('uw', 'y');
            formdata.append('txt', dreamText);

            const requestOptions = {
                method: 'POST',
                body: formdata,
                redirect: 'follow',
            };

            const response = await fetch(apiUrl, requestOptions);
            const responseData = await response.json();

            console.log('Réponse de l\'API MeaningCloud :', responseData); // Ajout du console log ici

            setAnalysisResult(responseData);
        } catch (error) {
            console.error('Erreur lors de la requête à l\'API MeaningCloud pour analyser le texte du rêve :', error);
        } finally {
            setLoading(false);
        }
    };

    // Fonction pour gérer l'analyse d'un rêve
    const handleDreamAnalysis = async (dream) => {
        await analyzeDreamText(dream.dreamText);
    };

    // Fonction pour supprimer un rêve
    const deleteDream = () => {
        // Afficher une alerte pour demander confirmation
        Alert.alert(
            'Confirmation',
            'Êtes-vous sûr de vouloir supprimer ce rêve ?',
            [
                {
                    text: 'Non',
                    onPress: () => console.log('Annulation de la suppression'),
                    style: 'cancel',
                },
                {
                    text: 'Oui',
                    onPress: () => {
                        // Supprimer le rêve de la liste des rêves
                        const updatedDreams = dreams.filter(dream => dream !== selectedDream);
                        setDreams(updatedDreams);
                        // Rafraîchir la liste des rêves dans AsyncStorage si nécessaire
                        AsyncStorage.setItem('dreamFormDataArray', JSON.stringify(updatedDreams))
                            .then(() => console.log('Rêve supprimé avec succès'))
                            .catch(error => console.error('Erreur lors de la suppression du rêve:', error));
                        Alert.alert(
                            'Notification',
                            'Le rêve a bien été supprimé !',
                            [
                                { text: 'RIP...' }
                            ]
                        );
                        // Rafraîchir la liste des rêves
                        fetchDreams();
                        // Cacher le modal
                        setModalVisible(false);

                    },
                },
            ],
            { cancelable: true }
        );
    };

    // Fonction pour rendre le résultat de l'analyse
    const renderAnalysisResult = () => {
        if (analysisResult !== null) {
            const hasConcepts = analysisResult.concept_list && analysisResult.concept_list.length > 0;
            const hasMoneyExpressions = analysisResult.money_expression_list && analysisResult.money_expression_list.length > 0;
            const hasQuotations = analysisResult.quotation_list && analysisResult.quotation_list.length > 0;

            if (hasConcepts || hasMoneyExpressions || hasQuotations) {
                return (
                    <View>
                        {hasConcepts && (
                            <View>
                                <Text style={styles.analysisTitle}>Concepts clés :</Text>
                                {analysisResult.concept_list.map((concept, index) => (
                                    <Chip key={index} style={styles.analysisChip}>{concept.form}</Chip>
                                ))}
                            </View>
                        )}

                        {hasMoneyExpressions && (
                            <View>
                                <Text style={styles.analysisTitle}>Expressions monétaires :</Text>
                                {analysisResult.money_expression_list.map((expression, index) => (
                                    <Chip key={index} style={styles.analysisChip}>{expression.form}</Chip>
                                ))}
                            </View>
                        )}

                        {hasQuotations && (
                            <View>
                                <Text style={styles.analysisTitle}>Citations :</Text>
                                {analysisResult.quotation_list.map((quotation, index) => (
                                    <Chip key={index} style={styles.analysisChip}>{quotation.form}</Chip>
                                ))}
                            </View>
                        )}
                    </View>
                );
            } else {
                return <Text style={styles.analysisMessage}>Aucun résultat clé trouvé dans le texte du rêve.</Text>;
            }
        } else {
            return null; // Retourne null si aucune analyse n'a été effectuée
        }
    };

    // Rendu du composant

    return (
        <View style={styles.container}>
            <View style={styles.sortByContainer}>
                <Button onPress={() => setSortByModalVisible(true)}>Trier par: {sortBy}</Button>
            </View>

            <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <Button icon="refresh" mode="contained" onPress={fetchDreams}>
                    Rafraîchir
                </Button>
                <TextInput
                    placeholder="Rechercher un rêve"
                    value={searchQuery}
                    onChangeText={(query) => {
                        setSearchQuery(query);
                    }}
                    style={[styles.input, {width: 200, height: 40}]}
                />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <List.Section title="Mes Rêves">
                    {dreams.map((dream, index) => (
                        <List.Item
                            key={index}
                            title={dream.title}
                            description={dream.description}
                            left={props => <List.Icon color="#000" icon="book"/>}
                            onPress={() => showDreamDetails(dream)}
                            right={() => (
                                <View style={styles.rightContent}>
                                    {dream.categories && dream.categories.length > 0 && (
                                        <Text
                                            style={styles.categoryText}>{dream.categories.map(category => predefinedCategories.find(cat => cat.name === category).emoji).join(' ')}</Text>
                                    )}
                                    <Text style={styles.dateText}>{dream.date}</Text>
                                </View>
                            )}
                            style={styles.dreamBox}
                        />
                    ))}
                </List.Section>
            </ScrollView>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={hideDreamDetails}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        {selectedDream && (
                            <>
                                <View style={styles.modalHeader}>
                                    <Text style={styles.modalTitle}>{selectedDream.title} <Text
                                        style={styles.modalDate}>  {selectedDream.date}</Text></Text>
                                    <IconButton
                                        icon="close"
                                        color="#FF0000"
                                        size={24}
                                        onPress={hideDreamDetails}
                                        style={styles.closeButton}
                                    />
                                </View>


                                <ScrollView style={styles.modalTextContainer}>
                                    <View style={styles.modalCategoriesContainer}>
                                        {selectedDream.categories && selectedDream.categories.length > 0 && (
                                            <Text style={styles.modalCategoriesTitle}>Catégories :
                                                <Text
                                                    style={styles.modalCategories}> {selectedDream.categories.join(', ')}</Text>
                                            </Text>
                                        )}
                                    </View>


                                    <View style={styles.modalTagsContainer}>
                                        <View style={styles.modalTags}>
                                            {selectedDream.customTags.map((tag, index) => (
                                                <Chip key={index} style={styles.modalTagChip}>{tag}</Chip>
                                            ))}
                                        </View>
                                    </View>

                                    <Text style={styles.modalDescription}><Text style={styles.modalDescriptionTitre}>Description
                                        :</Text> {selectedDream.description}</Text>
                                    <Text style={styles.modalDreamText}>{selectedDream.dreamText}</Text>

                                    <Button mode="contained" icon={() => <MaterialCommunityIcons name="book-information-variant" size={24} color="white" />}
                                            onPress={() => handleDreamAnalysis(selectedDream)}
                                            style={styles.analyzeButton}>
                                        Analyser
                                    </Button>
                                        <Button mode="contained" icon={() => <MaterialCommunityIcons name="trash-can-outline" size={24} color="white" />}
                                                onPress={deleteDream} style={styles.deleteButton}>
                                            Supprimer
                                        </Button>

                                    {loading && (
                                        <ActivityIndicator animating={true} color="#000"
                                                           style={styles.loadingIndicator}/>
                                    )}
                                    {renderAnalysisResult()}
                                </ScrollView>
                            </>
                        )}
                    </View>
                </View>
            </Modal>

            <Modal
                animationType="slide"
                transparent={true}
                visible={sortByModalVisible}
                onRequestClose={() => setSortByModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.sortByTitle}>Trier par:</Text>
                        <TouchableOpacity style={styles.sortByOption} onPress={() => setSortBy('Ajout')}>
                            <Text>Ajout</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.sortByOption} onPress={() => setSortBy('Date croissante')}>
                            <Text>Date croissante</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.sortByOption} onPress={() => setSortBy('Date décroissante')}>
                            <Text>Date décroissante</Text>
                        </TouchableOpacity>
                        {predefinedCategories.map(category => (
                            <TouchableOpacity key={category.name} style={styles.sortByOption}
                                              onPress={() => filterDreamsByCategoryAndSearch(category.name)}>
                                <Text>{category.name}</Text>
                            </TouchableOpacity>
                        ))}
                        <Button onPress={sortDreams}>Confirmer</Button>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContainer: {
        paddingVertical: 20,
        paddingHorizontal: 20,
    },
    sortByContainer: {
        paddingHorizontal: 16,
        paddingTop: 8,
        alignItems: 'center',
    },
    rightContent: {
        alignItems: 'flex-end',
    },
    categoryText: {
        fontSize: 12,
        marginBottom: 4,
    },
    dateText: {
        fontSize: 12,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 10,
        width: '90%',
        maxWidth: 400,
        maxHeight: '80%',
        padding: 20,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    modalDate: {
        fontSize: 14,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    modalTextContainer: {
        maxHeight: 300,
        marginBottom: 20,
    },
    modalCategoriesContainer: {
        marginBottom: 10,
    },
    modalCategoriesTitle: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    modalCategories: {
        fontSize: 16,
        fontWeight: '400',
    },
    modalTagsContainer: {
        marginBottom: 10,
    },
    modalTags: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 4,
    },
    modalTagChip: {
        marginVertical: 2,
        marginRight: 2,
    },
    modalDescription: {
        fontSize: 16,
        color: '#888',
        marginBottom: 10,
    },
    modalDescriptionTitre: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#888',
    },
    modalDreamText: {
        fontSize: 16,
    },
    dreamBox: {
        width: 300,
    },
    closeButton: {
        right: 10,
    },
    sortByTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    sortByOption: {
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    searchInput: {
        marginBottom: 16,
    },
    analyzeButton: {
        marginTop: 20,
    },
    loadingIndicator: {
        marginTop: 10,
    },
    analysisTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 10,
    },
    analysisChip: {
        marginVertical: 5,
        marginRight: 5,
    },
    analysisMessage: {
        marginTop: 10,
        fontSize: 16,
        color: '#888',
    },
    modalButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    deleteButton: {
        marginTop: 10,
        backgroundColor: '#d9534f',
    },
});
