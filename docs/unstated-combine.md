# Unstated combine

Combine multiple containers into one.

This is useful when you want to have a single container but it starts to become too big. This package allows you to refactor it into multiple separate containers that can still be merged back together.

## Install

```sh
npm install --save unstated-enhancers
```

## Usage

It allows to write an app like the following, where there are multiple containers, which can access each other's methods and state, while your components still consume only 1 container.

```tsx
import React from 'react';
import { Subscribe, Container } from 'unstated';
import { combine } from 'unstated-enhancers';

class CounterContainer extends Container {
  state = {
    counter: 123
  }
  get = () => {
    return this.state.counter;
  }
  set = ( counter ) => {
    this.setState ({ counter });
  }
  setMessage = () => {
    this.ctx.message.set ( 'Hello from the CounterContainer' );
  }
  setJoke = () => {
    this.ctx.setJoke ( 'Hello from the CounterContainer' );
  }
}

class MessageContainer extends Container {
  state = {
    message: 'Default message'
  }
  get = () => {
    return this.state.message;
  }
  set = ( message ) => {
    this.setState ({ message });
  }
  setCounter = () => {
    this.ctx.counter.set ( 'Hello from the MessageContainer' );
  }
  setJoke = () => {
    this.ctx.setJoke ( 'Hello from the MessageContainer' );
  }
}

class AppContainer extends Container {
  state = {
    joke: 'Default joke'
  }
  get = () => {
    return this.state.joke;
  }
  setJoke = ( joke ) => {
    this.setState ({ joke });
  }
  setCounter = () => {
    this.ctx.counter.set ( 'Hello from the AppContainer' );
  }
  setMessage = () => {
    this.message.set ( 'Hello from the AppContainer' ); // `.ctx` can be omitted in the parent container
  }
}

const container = combine({
  counter: CounterContainer,
  message: MessageContainer
})(AppContainer)

const App = () => (
  <Subscribe to={[container]}>
    {
      app => (
        <div>
          <h3>Counter</h3>
          <p>{app.counter.get ()}</p>
          <button onClick={() => app.counter.set ( Math.random () )}>Update from CounterContainer</button>
          <button onClick={app.message.setCounter}>Update from MessageContainer</button>
          <button onClick={app.setCounter}>Update from AppContainer</button>
          <h3>Message</h3>
          <p>{app.state.message.message}</p>
          <button onClick={() => app.message.set ( `Now is: ${Date.now()}`)}>Update from MessageCounter</button>
          <button onClick={app.counter.setMessage}>Update from CounterContainer</button>
          <button onClick={app.setMessage}>Update from AppContainer</button>
          <h3>Joke</h3>
          <p>{app.state.joke}</p>
          <button onClick={() => app.setJoke ( `Joke coming in ${Date.now ()}...` )}>Update from AppContainer</button>
          <button onClick={app.counter.setJoke}>Update from CounterContainer</button>
          <button onClick={app.message.setJoke}>Update from MessageContainer</button>
        </div>
      )
    }
  </Subscribe>
);
```