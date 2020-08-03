import React from 'react';
import './Input.css'
import send from '../../icons/send.png'
import PropTypes from 'prop-types';


const Input = ({ message, setMessage, sendMessage }) => (
    <form className="form">
        <input
            className="input"
            type="text"
            placeholder="Type a message..."
            value={message}
            onChange={({ target: { value } }) => setMessage(value)}
            onKeyPress={event => event.key === 'Enter' ? sendMessage(event) : null}
        />
        <button className="sendButton" onClick={e => sendMessage(e)}>
            SEND
        </button>
    </form>
);

Input.propTypes = {

};


export default Input;
