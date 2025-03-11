const React = require('react'); //Call the React library
const { useState, useEffect } = React; 
//useState allows to add state, state is used to stroe information that can change over time
//useEffect is used to set up a socket connection to the sever and then clean up the connection when user disconnect
import io from 'socket.io-client'; //Call io function from socket.io-client, io is used to create a connection to the server
const { createRoot } = require('react-dom/client'); //createRoot is used to creat a root where React components will be rendered in the HTML doc
const helper = require('./helper.js'); //import the module from helper.js



const ChatApp = () => {
    const [messages, setMessages] = useState([]); //This state variable to holds the current list of messages and update the messages state. useState([]) is empty because there no messages
    const [currentChannel, setCurrentChannel] = useState('general'); //Hold the current room channel the user in, setCurrentChannel updates the room channel status. user starts 'general' room
    const [messageInput, setMessageInput] = useState(''); //Hold the current input message value, setMessageInput updates the messageInput stat. useState('') is the input field with empty string
    const [premium, setPremium] = useState(false); //Hold the current premuim status, setPremium to update status, set inital premium status to be false which mean user does not have premium
    const [socket, setSocket] = useState(null); //Socket connection state, null in this state mean no socket connection

    

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
        if(socket) { //Checks if there socket connection
        // Listen for 'chat message' events
        socket.on('chat message', (msg) => { // msg is an argument fro callback function if 'chat message' event is recieved
            setMessages((prevMessages) => [...prevMessages, msg]); // updates the messages stat by adding the new message to the existing array of messages
            //prevMessages represents the current stat of message array and '...' is used to create a new array with the existing messages plus the new one
        });

            return () => {
            // Clean up event listener when socket changes or unmounts
            socket.off('chat message');
            };
        }
    }, [socket]); //The socket dependency array means that the effect will run when socket variable changes. If it null then set the connection, this effect will run

    //This arrow function's purpose is to send a chat message
    const sendMessage = () => {
        if (messageInput.trim() !== '') { //checks if the message is not empty string otherwise the function won't do anything
            socket.emit('chat message', messageInput); //Sends a message to the server
            setMessageInput(''); //clear the input message after it been sent, so the user can type a new message
        }
    };

    //This function makes the room channel to be change to different room channel
    const changeChannel = (channel) => {
        setCurrentChannel(channel); //Update room channel state
        setMessages([]);//empty the messages when room channels change
        socket.emit('room change', channel); //Emit room change event to the server
    };

    //This function is for upgrading a user to premium status
    const handlePremium = (e) => { //e refers as an event object
        e.preventDefault(); //Prevents default form submission behavior
        helper.hideError(); //call hideError function from helper module to hide any error messages
        helper.sendPost('/premium', {premium: true}); //sends a POST request to the /premium endpoint with data of premim true. This request informs the server to upgrade the user to premium status
        setPremium(true); //Update premium state
        return false; //This is a indication that the function has completed and does not need retake again
    };
    

    return (
        <div>
            <select
                id="channelSelect"
                onChange={(e) => changeChannel(e.target.value)} //onChange calls the changeChannel function to change room channel
                value={currentChannel}
            >
                <option value="general">General</option>
                <option value="workout">Workout</option>
                {premium && <option value="DM">DM</option>}
                
            </select>
            <input
                    type="text"
                    id="editBox"
                    value={messageInput} //Input message value
                    onChange={(e) => setMessageInput(e.target.value)} //Update messageInput state
                />
            <form
                id="editForm"
                onSubmit={(e) => {
                    e.preventDefault(); // Prevent the default form submission behavior
                    sendMessage(); //Call the sendMessage function when 'send' button is pressed
                }}
            >
                <button id="messageSend" type="submit">Send</button>
            </form>

            <button onClick={handlePremium} id="premium" type='button'>Premium</button> 
            <div id="messages">
                {messages.map((msg, index) => ( //Message map iterate over the message array, for each message, it returns a new <div> element
                    <div key={index}>{msg}</div> //key is a unique identifer for each element in the list. It uses to identify which items have change, added or removed
                ))}
            </div>
        </div>
    );
};


const init = () => { // setting up and rendering React application
    const root = createRoot(document.getElementById('channel')); //Retrieves the HTML element with channel element
    root.render( <ChatApp /> );
};

window.onload = init;

