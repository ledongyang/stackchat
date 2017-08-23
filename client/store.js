const GOT_MESSAGES_FROM_SERVER = 'GOT_MESSAGES_FROM_SERVER';

const initialState = {
  messages: []
}

function reducer (state = initialState, action) {
  switch (action.type){
    case GOT_MESSAGES_FROM_SERVER:
      return Object.assign({}, state, {message: action.message});
    default:
      return state;
  }
}

export const gotMessagesFromServer = function (messages) {
  return {
    type: GOT_MESSAGES_FROM_SERVER, // be sure to use the constant, not a string literal
    messages: messages
  };
};
