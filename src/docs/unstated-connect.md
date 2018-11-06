# Unstated connect

A redux like `connect` for `unstated`

## Installation

```bash
npm install --save unstated-enhancers
```

## Usage

```jsx
// @flow
import React, { Component } from 'react';
import { Container } from 'unstated';
import { connect } from 'unstated-enhancers';

type CounterState = {
  count: number
};

class CounterContainer extends Container<CounterState> {
  state = {
    count: 0
  };

  name = 'Counter';

  increment() {
    this.setState({
      count: this.state.count + 1,
      __action: 'INCREMENT'
    });
  }

  decrement() {
    this.setState({
      count: this.state.count - 1,
      __action: 'DECREMENT'
    });
  }
}

type MessageState = {
  message: string
};

class MessageContainer extends Container<MessageState> {
  state = {
    message: 'Not defined'
  };

  name = 'Messages';

  change(message) {
    this.setState({
      message: message,
      __action: 'MESSAGE_CHANGE'
    });
  }

  random() {
    this.setState({
      message: 'Random ' + Math.random(),
      __action: 'MESSAGE_RANDOM'
    });
  }
}

class App extends Component {
  render() {
    // Get access to named containers
    const { counter, message } = this.props.containers;

    return (
      <div>
        <header>
          <h1>App</h1>
        </header>
        <section>
          <div>
            <h4>Counter</h4>
            <button onClick={ () => counter.decrement() }>-</button>
            <span>{ counter.state.count }</span>
            <button onClick={ () => counter.increment() }>+</button>
          </div>
          <div>
            <h4>Message</h4>
            <button onClick={ () => message.change('Updated') }>Update</button>
            <span>{ message.state.message }</span>
            <button onClick={ () => message.random() }>Random</button>
          </div>
        </section>
      </div>
    );
  }
}

export default connect({
  counter: CounterContainer,
  message: MessageContainer
})(App);
```