import React, { Component } from 'react';
import store, { writeName } from '../store';


export default class NameEntry extends Component {
  constructor() {
    super()
    this.state = store.getState();
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
    store.dispatch(writeName(e.target.value));
  }

  handleSubmit(e){
    e.preventDefault();
  }

  render() {
    return(<form className="form-inline" onSubmit={this.handleSubmit}>
    <label htmlFor="name">Your name:</label>
    <input
      type="text"
      name="name"
      placeholder="Enter your name"
      className="form-control"
      value={this.state.author}
      onChange={this.handleChange}
    />
  </form>)
  }
}
