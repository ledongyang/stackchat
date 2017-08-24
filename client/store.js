import { createStore, applyMiddleware } from 'redux';
import loggerMiddleware from 'redux-logger';
import thunkMiddleware from 'redux-thunk';
import axios from 'axios';
import socket from './socket';
// ACTION TYPES
const GOT_MESSAGES_FROM_SERVER = 'GOT_MESSAGES_FROM_SERVER';
const WRITE_MESSAGE = 'WRITE_MESSAGE';
const GOT_NEW_MESSAGE_FROM_SERVER = 'GOT_NEW_MESSAGE_FROM_SERVER';
const WRITE_NAME = 'WRITE_NAME';

// ACTION CREATORS
export function gotMessagesFromServer (messages) {
  return {
    type: GOT_MESSAGES_FROM_SERVER,
    messages
  };
}

export function writeMessage(inputContent) {
  return {
    type: WRITE_MESSAGE,
    newMessageEntry: inputContent
  }
}

export function writeName(name) {
  return {
    type: WRITE_NAME,
    author: name
  }
}

export function gotNewMessageFromServer(message) {
  return {
    type: GOT_NEW_MESSAGE_FROM_SERVER,
    message: message
  }
}

export function fetchMessages () {
  return function thunk (dispatch) {
    return axios.get('/api/messages')
    .then(res => res.data)
    .then(messages => {
      dispatch(gotMessagesFromServer(messages))
  });
  }
}

export function postMessage (newMessage) {
  return function thunk (dispatch) {
    return axios.post('/api/messages', newMessage)
     .then(res => res.data)
     .then(message => {
       console.log(message)
       dispatch(gotNewMessageFromServer(message));
       socket.emit('new-message', message);
       dispatch(writeMessage(''));
       //dispatch(writeName(''));
      })
  }
}

// INITIAL STATE
const initialState = {
  messages: [],
  newMessageEntry: '',
  author: ''
};

// REDUCER
function reducer (state = initialState, action) {
  switch (action.type) {
    case GOT_MESSAGES_FROM_SERVER:
       return Object.assign({}, state, { messages: action.messages });
    case WRITE_MESSAGE:
       return Object.assign({}, state, { newMessageEntry: action.newMessageEntry });
    case GOT_NEW_MESSAGE_FROM_SERVER:
       return Object.assign({}, state, { messages: state.messages.concat(action.message) });
    case WRITE_NAME:
      return Object.assign({}, state, { author: action.author })
    default:
       return state;
  }
}

// STORE
const store = createStore(reducer, applyMiddleware(loggerMiddleware, thunkMiddleware));
export default store;

