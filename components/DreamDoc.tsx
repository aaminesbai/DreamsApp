import React, {useState} from 'react';
import {View, Text, ScrollView, StyleSheet} from 'react-native';
import {predefinedCategories} from './categories';

export default function DreamDoc() {
    const [selectedTab, setSelectedTab] = useState(0);

    return (
        <View style={styles.container}>
            <ScrollView
                horizontal
                contentContainerStyle={styles.navbar}
                showsHorizontalScrollIndicator={true}
                maxHeight={60}
            >
                {predefinedCategories.map((tab, index) => (
                    <Text
                        key={index}
                        style={[styles.navbarItem, selectedTab === index && styles.activeNavItem]}
                        onPress={() => setSelectedTab(index)}
                    >
                        {tab.emoji} {tab.name}
                    </Text>
                ))}
            </ScrollView>
            <ScrollView>
                <View style={styles.header}>
                    <Text style={styles.title}>{predefinedCategories[selectedTab].name}</Text>
                </View>

                <Text style={styles.content}>
                    {predefinedCategories[selectedTab].content}
                </Text>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        marginTop: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    navbar: {
        flexDirection: 'row',
        backgroundColor: '#f2f2f2',
        paddingVertical: 10,
        paddingHorizontal: 5,
    },
    navbarItem: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        color: '#888',
    },
    activeNavItem: {
        color: '#2f95dc',
    },
    content: {
        fontSize: 16,
        lineHeight: 24,
        paddingHorizontal: 30,
        paddingVertical: 10,
        marginTop: 10,
    },
});
