import React, { useEffect, useMemo, useRef, PureComponent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FlatList, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import Icon from 'react-native-vector-icons/Ionicons'
import { loadChat, addChat, resendChat, removeChat } from "../actions/chats";
import MessageContent from "../components/MessageContent";

class MemoizedMessageContent extends PureComponent {
    render() {
        const { chat, id, receiver, sent, date, readstatus, deleteMessage, resendMessage } = this.props
        return (
            <MessageContent
                chat={chat}
                id={id}
                receiver={receiver}
                sent={sent}
                date={date}
                readstatus={readstatus}
                delete={deleteMessage}
                resend={resendMessage}
            />
        );
    }
}

export default function ChatBody(props) {
    const selected = useSelector((state) => state.chats.selectedChat)
    const dispatch = useDispatch()
    const messagesListRef = useRef(null)

    useEffect(() => {
        dispatch(loadChat())
    }, [dispatch])

    const submitChat = () => {
        dispatch(addChat(props.message, props.name))
        props.setMessage('')
    }

    const resendMessage = (_id, message, name) => {
        dispatch(resendChat(_id, message, name))
        props.setMessage('')
    }

    const memoizedRenderItem = useMemo(() => {
        return ({ item }) => (
            <MemoizedMessageContent
                chat={item.message}
                id={item.sender}
                receiver={item.receiver}
                sent={item.sent}
                date={item.date}
                readstatus={item.readstatus}
                deleteMessage={() => dispatch(removeChat(item._id, props.name))}
                resendMessage={() => resendMessage(item._id, item.message, props.name)}
            />
        );
    }, [dispatch, props.name]);

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS == "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS == "ios" ? 0 : 20}
            enabled={Platform.OS === "ios" ? true : false}
            style={styles.container}
        >
            <View style={{ flexDirection: 'row', backgroundColor: '#317873' }}>
                <TouchableOpacity onPress={props.back}><Icon name="arrow-back-sharp" size={40} color="white" /></TouchableOpacity>
                <Text style={{ fontWeight: 'bold', marginLeft: '35%', fontSize: 25, color: 'white' }}>{props.name}</Text>
            </View>

            <View style={styles.messageList}>
                <FlatList
                    ref={messagesListRef}
                    data={selected}
                    renderItem={memoizedRenderItem}
                    keyExtractor={(item) => item._id}
                    onEndReachedThreshold={0.5}
                    onContentSizeChange={() => messagesListRef.current.scrollToEnd({ animated: false })}
                />
            </View>

            <View style={styles.inputContainer} >
                <TextInput
                    style={styles.input}
                    placeholder="Write a message..."
                    onChangeText={message => props.setMessage(message)}
                    defaultValue={props.message}
                />
                <TouchableOpacity style={styles.button} onPress={submitChat}><Icon name="send" size={30} color="white" /></TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    )
}




const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f2f2f2',
    },
    messageList: {
        flex: 1,
        padding: 16,
        marginBottom: 70
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingBottom: 16,
        position: 'absolute',
        bottom: 0,
        right: 0,
        left: 0,
    },
    input: {
        flex: 1,
        marginRight: 8,
        paddingHorizontal: 10,
        paddingVertical: 8,
        backgroundColor: '#fff',
        borderRadius: 30,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    button: {
        borderRadius: 30,
        width: 50,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: "#00A693",
        height: 50
    }
});