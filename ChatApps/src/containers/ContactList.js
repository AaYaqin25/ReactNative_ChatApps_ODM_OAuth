import React, { useEffect } from "react";
import { View, FlatList, TouchableOpacity, Text, StyleSheet } from "react-native";
import ContactItem from "../components/ContactItem";
import { useDispatch, useSelector } from "react-redux";
import { request } from "../utils/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { loadContact, removeNotification } from "../actions/contact";
import { selectedChat } from "../actions/chats";

export default function ContactList({ formChat, navigation }) {
    const contacts = useSelector((state) => state.contacts.data);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(loadContact());
    }, [dispatch]);

    const handleSelectContact = (target, _id) => {
        formChat(target);
        dispatch(selectedChat({ target, _id }));
        dispatch(removeNotification(_id));
    };

    const handleLogOut = async () => {
        try {
            await request.get("users/signout");
            await AsyncStorage.removeItem("user");
            request.interceptors.request.use(function (config) {
                config.headers.Authorization = null;

                return config;
            });
            navigation.navigate("FormLogin");
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={contacts}
                renderItem={({ item }) => (
                    <ContactItem
                        id={item._id}
                        count={item.unreadCount}
                        contact={item.username}
                        set={() => handleSelectContact(item.username, item._id)}
                    />
                )}
                keyExtractor={(item) => item._id}
                onEndReachedThreshold={0.5}
            />
            <TouchableOpacity style={styles.button} onPress={handleLogOut}>
                <Text style={styles.buttonText}>Logout</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    button: {
        padding: 20,
        width: "100%",
        backgroundColor: "#00A693",
        borderRadius: 15,
        borderStyle: "solid",
        borderColor: "white",
        borderWidth: 1,
    },
    buttonText: {
        color: "honeydew",
        textAlign: "center",
        fontWeight: "bold",
    },
});
