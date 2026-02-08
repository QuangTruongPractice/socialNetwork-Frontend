import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { HOST_URL } from './Apis';

class WebSocketService {
    constructor() {
        this.client = null;
        this.subscriptions = new Map();
    }

    connect(onConnectCallback) {
        if (this.client && this.client.connected) {
            if (onConnectCallback) onConnectCallback();
            return;
        }

        const socket = new SockJS(`${HOST_URL}/ws`);
        this.client = new Client({
            webSocketFactory: () => socket,

            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
        });

        this.client.onConnect = (frame) => {

            if (onConnectCallback) onConnectCallback();
        };

        this.client.onStompError = (frame) => {
            console.error('Broker reported error: ' + frame.headers['message']);
            console.error('Additional details: ' + frame.body);
        };

        this.client.activate();
    }

    subscribe(destination, callback) {
        if (!this.client || !this.client.connected) {
            console.warn('Cannot subscribe, not connected');
            return;
        }

        if (this.subscriptions.has(destination)) {
            return;
        }

        const subscription = this.client.subscribe(destination, (message) => {
            callback(JSON.parse(message.body));
        });

        this.subscriptions.set(destination, subscription);
        return subscription;
    }

    unsubscribe(destination) {
        const subscription = this.subscriptions.get(destination);
        if (subscription) {
            subscription.unsubscribe();
            this.subscriptions.delete(destination);
        }
    }

    sendMessage(destination, body) {
        if (!this.client || !this.client.connected) {
            console.error('Cannot send message, not connected');
            return;
        }

        this.client.publish({
            destination: destination,
            body: JSON.stringify(body),
        });
    }

    disconnect() {
        if (this.client) {
            this.client.deactivate();
            this.client = null;
            this.subscriptions.clear();
        }
    }
}

const instance = new WebSocketService();
export default instance;
