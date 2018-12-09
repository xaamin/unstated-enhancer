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
            <button onClick={ () => counter.increment() }>+</button>
            <br />
            <br />
            <span>From counter state { counter.state.count }</span>
            <br />
            <span>From mapped state to props { this.props.count }</span>
            <br />
            <br />
          </div>
          <div>
            <h4>Message</h4>
            <button onClick={ () => message.change('Updated') }>Update</button>
            <button onClick={ () => message.random() }>Random</button>
            <br />
            <br />
            <span>From message state { message.state.message }</span>
            <br />
            <span>From mapped state to props { this.props.message }</span>
            <br />
            <br />
          </div>
        </section>
      </div>
    );
  }
}

const containers = {
  counter: CounterContainer,
  message: MessageContainer
};

const mapStateToProps = (containers) => {
  return {
    count: containers.counter.state.count,
    message: containers.message.state.message,
  }
}

const options = {
  mapCombinedContainers: true,
  concatCombinedContainerNames: true
}

export default connect(containers, mapStateToProps, options)(App);
```

## API

### containers
Type: `object`

Object list of containers to be connected with the component

```js
...

const containers = {
  counter: CounterContainer,
  message: MessageContainer
};

...
```

### mapStateToProps
Type: `Function`

Function who maps containers state to component props

```js
...

const mapStateToProps = (containers) => {
  return {
    count: containers.counter.state.count,
    message: containers.message.state.message,
  }
}

...
```

### options

**mapCombinedContainers**

Type: `boolean|Function`

If a combined contaners is passed and this is setting to true it extracts the combined containers. You can provide your own `mapCombinedContainers` function if you want.

```
const mapCombinedContainers = (containers) => {
  return {
    list: containers.route.list,
    upsert: containers.route.upsert,
    info: containers.route.info
  }
}
```

**concatCombinedContainerNames**

Type: `boolean`
<br>
Default: `false`

When multiple combined containers is passed to the connect function setting this option to true avoids containers name collision