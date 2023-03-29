import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Icon from 'react-native-vector-icons/Ionicons'

export default function ContactItem(props) {
    return (
        <TouchableOpacity style={styles.container} onPress={props.set}>
            <Text style={styles.name}><Icon name="person-circle" size={20} color="black" />{props.contact}</Text>
            {props.count > 0 && (
                <View style={styles.notification}>
                    <Text style={styles.notificationText}>{props.count}</Text>
                </View>
            )}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 10,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ddd',
        marginBottom: 5
    },
    name: {
        fontWeight: 'bold',
        fontSize: 18,
    },
    notification: {
        backgroundColor: 'red',
        borderRadius: 20,
        paddingHorizontal: 8,
        paddingVertical: 4,
    },
    notificationText: {
        color: '#fff',
        fontSize: 12,
    },
});