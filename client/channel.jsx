const React = require('react');
const { useState, useEffect } = React;
import io from 'socket.io-client';
const { createRoot } = require('react-dom/client');
const helper = require('./helper.js');



const ChatApp = () => {
    const [messages, setMessages] = useState([]);
    const [currentChannel, setCurrentChannel] = useState('general');
    const [messageInput, setMessageInput] = useState('');

    // Establish socket connection
    const socket = io();

    useEffect(() => {
        // Listen for 'chat message' events
        socket.on('chat message', (msg) => {
            setMessages((prevMessages) => [...prevMessages, msg]);
        });

        return () => {
            // Clean up event listener
            socket.off('chat message');
        };
    }, []);

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

        const premium = e.target.querySelector('#premium').value

        if(premium == false)
        {
            helper.sendPost(e.target.action, {premium: true});
        }

        

        return false;
    }
    

    return (
        <div>
            <select
                id="channelSelect"
                onChange={(e) => changeChannel(e.target.value)}
                value={currentChannel}
            >
                <option value="general">General</option>
                <option value="channel1">Workout</option>
               {/* <option value="channel2">DM</option> */}
            </select>
            <div id="messages">
                {messages.map((msg, index) => (
                    <div key={index}>{msg}</div>
                ))}
            </div>
            <form
                id="editForm"
                onSubmit={(e) => {
                    e.preventDefault();
                    sendMessage();
                }}
            >
                <input
                    type="text"
                    id="editBox"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                />
                <button type="submit">Send</button>
            </form>

            <button onClick={handlePremium} id="premium" type='button'>Premium</button>
        </div>
    );
};


const init = () => {
    const root = createRoot(document.getElementById('channel'));
    root.render( <ChatApp /> );
};

window.onload = init;

