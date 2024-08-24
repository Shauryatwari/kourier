import React, { useState } from 'react';
import { View, Text, Button, ProgressBarAndroid, ScrollView } from 'react-native';
import { NetworkInfo } from 'react-native-network-info';
import TcpSocket from 'react-native-tcp-socket';
import * as FileSystem from 'expo-file-system';

export default function Receive() {
    const [status, setStatus] = useState('');
    const [progress, setProgress] = useState(0);

    const startServer = () => {
        NetworkInfo.getIPAddress().then(ipAddress => {
            const port = 1025;
            const server = TcpSocket.createServer((socket) => {
                setStatus(`Client connected from ${socket.remoteAddress}:${socket.remotePort}`);
                
                socket.on('data', async (data) => {
                    const fileName = 'received_file';  // Update this based on actual file name logic
                    const filePath = `${FileSystem.documentDirectory}${fileName}`;
                    await FileSystem.writeAsStringAsync(filePath, data.toString(), {
                        encoding: FileSystem.EncodingType.Base64,
                    });
                    
                    setStatus(`Receiving file...`);
                    
                    setProgress((prevProgress) => prevProgress + data.length);
                });

                socket.on('close', () => {
                    setStatus('Client disconnected');
                });

                socket.on('error', (error) => {
                    setStatus(`Error: ${error.message}`);
                });

            }).listen({ port, host: ipAddress }, () => {
                setStatus(`Server is listening on ${ipAddress}:${port}`);
            });
        });
    };

    return (
        <ScrollView>
            <View style={{ padding: 20 }}>
                <Text>Status: {status}</Text>
                <ProgressBarAndroid styleAttr="Horizontal" indeterminate={false} progress={progress} />
                <Button title="Receive" onPress={startServer} />
            </View>
        </ScrollView>
    );
}
