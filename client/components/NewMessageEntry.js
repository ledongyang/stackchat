import React, { Component } from 'react';
import store, { writeMessage, gotNewMessageFromServer } from '../store';
import axios from 'axios';
import socket from '../socket';

export default class NewMessageEntry extends Component {
  constructor() {
    super()
    this.state = store.getState()

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    this.unsubscribeFromStore = store.subscribe(() => {
      this.setState(store.getState());
    });
  }

  componentWillUnmount() {
    this.unsubscribeFromStore();
  }

  handleChange(e){
    store.dispatch(writeMessage(e.target.value))
  }

  handleSubmit(e){
    e.preventDefault();
    axios.post('/api/messages', { content: this.state.newMessageEntry,
      channelId: this.props.channelId
     })
     .then(res => res.data)
     .then(message => {
       console.log(message)
       store.dispatch(gotNewMessageFromServer(message));
       socket.emit('new-message', message);
      })
      store.dispatch(writeMessage(''));
  }

  render () {

    return (
      <form id="new-message-form" onSubmit={this.handleSubmit}>
        <div className="input-group input-group-lg">
          <input
            className="form-control"
            type="text"
            name="content"
            value={this.state.newMessageEntry}
            placeholder="Say something nice..."
            onChange={this.handleChange}
          />
          <span className="input-group-btn">
            <button className="btn btn-default" type="submit">Chat!</button>
          </span>
        </div>
      </form>
    );
  }
}
