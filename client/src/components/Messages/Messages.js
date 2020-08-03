import React from 'react';
import "./Messages.css"
import Message from './Message/Message'
import ScrollToBottom from 'react-scroll-to-bottom';


const Messages = ({messages,name}) => {
    return (
        <ScrollToBottom className="messages">
            {messages.map((msg,key)=>
                <div key={key}>
                    <Message message={msg} name ={name} />
                </div>
            )}
        </ScrollToBottom>
    );
};


Messages.propTypes = {

};


export default Messages;
