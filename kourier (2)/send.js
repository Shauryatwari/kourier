import React, { useState } from 'react';
import { View, Text, TextInput, Button, ProgressBarAndroid, ScrollView, Alert } from 'react-native';
import TcpSocket from 'react-native-tcp-socket';
import * as FileSystem from 'expo-file-system';
import * as DocumentPicker from 'expo-document-picker';

export default function Send() {
    const [ipAddress, setIpAddress] = useState('');
    const [status, setStatus] = useState('');
    const [progress, setProgress] = useState(0);

    const handleSendFile = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({});
            if (result.type === 'cancel') {
                setStatus('File selection canceled.');
                return;
            }

            const fileUri = result.uri;
            const fileName = result.name;
            const fileInfo = await FileSystem.getInfoAsync(fileUri);
            const fileSize = fileInfo.size;

            const socket = TcpSocket.createConnection({ host: ipAddress, port: 1025 }, () => {
                setStatus('Connected to the server.');
                socket.write(fileName); // Send file name
                socket.write(fileSize.toString()); // Send file size

                FileSystem.readAsStringAsync(fileUri, { encoding: FileSystem.EncodingType.Base64 })
                    .then(data => {
                        socket.write(data);
                        setStatus(`Sending file: ${fileName}...`);
                        setProgress(1); // Update the progress bar
                    })
                    .catch(error => {
                        setStatus(`File read error: ${error.message}`);
                    });
            });

            socket.on('data', (data) => {
                setStatus(`Response from server: ${data.toString()}`);
            });

            socket.on('error', (error) => {
                setStatus(`Error: ${error.message}`);
            });

            socket.on('close', () => {
                setStatus('Connection closed.');
            });

        } catch (error) {
            setStatus(`Error: ${error.message}`);
        }
    };

    return (
        <ScrollView>
            <View style={{ padding: 20 }}>
                <TextInput
                    placeholder="Enter Server IP Address"
                    value={ipAddress}
                    onChangeText={setIpAddress}
                    style={{ borderWidth: 1, marginBottom: 10, padding: 5 }}
                />
                <Button title="Send" onPress={handleSendFile} />
                <Text>Status: {status}</Text>
                <ProgressBarAndroid styleAttr="Horizontal" indeterminate={false} progress={progress} />
            </View>
        </ScrollView>
    );
}
