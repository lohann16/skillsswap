import React, { useState } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

const ChatScreen = () => {
  const [messages, setMessages] = useState([
    { id: '1', sender: 'You', text: 'Hey, how are you?' },
    { id: '2', sender: 'Partner', text: 'I\'m good, thanks! How about you?' },
    { id: '3', sender: 'You', text: 'I\'m doing well, thanks for asking!' },
  ]);

  const [messageText, setMessageText] = useState('');

  // Function to handle sending a new message
  const handleSendMessage = () => {
    if (messageText.trim()) {
      setMessages([
        ...messages,
        { id: (messages.length + 1).toString(), sender: 'You', text: messageText },
      ]);
      setMessageText(''); // Clear the input field after sending
    }
  };

  // Render each message in the chat
  const renderMessage = ({ item }) => (
    <View
      style={[
        styles.messageBubble,
        item.sender === 'You' ? styles.messageRight : styles.messageLeft,
      ]}
    >
      <Text style={styles.messageText}>{item.text}</Text>
    </View>
  );

  return (
    <View style={styles.chatContainer}>
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        style={styles.messageList}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          value={messageText}
          onChangeText={setMessageText}
          placeholder="Type your message..."
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Styling for the chat screen
const styles = StyleSheet.create({
  chatContainer: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  messageList: {
    flex: 1,
    marginBottom: 10,
  },
  messageBubble: {
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
    maxWidth: '75%',
  },
  messageLeft: {
    backgroundColor: '#e1f5fe',
    alignSelf: 'flex-start',
  },
  messageRight: {
    backgroundColor: '#dcedc8',
    alignSelf: 'flex-end',
  },
  messageText: {
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderColor: '#ccc',
  },
  textInput: {
    flex: 1,
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 12,
    marginRight: 8,
  },
  sendButton: {
    backgroundColor: '#4a90e2',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default ChatScreen;
