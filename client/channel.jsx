const React = require('react');
const { useState, useEffect } = React;
import io from 'socket.io-client';
const { createRoot } = require('react-dom/client');
const helper = require('./helper.js');



const ChatApp = () => {
    const [messages, setMessages] = useState([]);
    const [currentChannel, setCurrentChannel] = useState('general');
    const [messageInput, setMessageInput] = useState('');
    const [premium, setPremium] = useState(false);
    const [socket, setSocket] = useState(null);

    

    useEffect(() => {
        // Establish socket connection
        const newSocket = io();
        setSocket(newSocket);

        //Clean up socket connection when component is no longer use
        return () => {
            newSocket.disconnect();
        };
    }, []);

    useEffect(() => {
        if(socket) {
        // Listen for 'chat message' events
        socket.on('chat message', (msg) => {
            setMessages((prevMessages) => [...prevMessages, msg]);
        });

            return () => {
            // Clean up event listener when socket changes or unmounts
            socket.off('chat message');
            };
        }
    }, [socket]);

    const sendMessage = () => {
        if (messageInput.trim() !== '') {
            socket.emit('chat message', messageInput);
            setMessageInput('');
        }
    };

    const changeChannel = (channel) => {
        setCurrentChannel(channel);
        setMessages([]);
        socket.emit('room change', channel);
    };

    const handlePremium = (e) => {
        e.preventDefault();
        helper.hideError();
        helper.sendPost('/premium', {premium: true});
        setPremium(true);
        return false;
    };
    

    return (
        <div>
            <select
                id="channelSelect"
                onChange={(e) => changeChannel(e.target.value)}
                value={currentChannel}
            >
                <option value="general">General</option>
                <option value="channel1">Workout</option>
                {premium && <option value="channel2">DM</option>}
                
            </select>
            <input
                    type="text"
                    id="editBox"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                />
            <form
                id="editForm"
                onSubmit={(e) => {
                    e.preventDefault();
                    sendMessage();
                }}
            >
                <button id="messageSend" type="submit">Send</button>
            </form>

            <button onClick={handlePremium} id="premium" type='button'>Premium</button>
            <div id="messages">
                {messages.map((msg, index) => (
                    <div key={index}>{msg}</div>
                ))}
            </div>
        </div>
    );
};


const init = () => {
    const root = createRoot(document.getElementById('channel'));
    root.render( <ChatApp /> );
};

window.onload = init;

