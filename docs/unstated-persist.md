## Unstated Persist

Adds persistence to your `unstated` containers

### Usage
Usage is simple, all you need is to pass a configuration object to the start function of persist. You must use the `connect` function from `unstated-enhancers` who actually takes care of the async load of the state showing up a loader while is busy loading the state from persistence.

In the root of your app, import unstated-enhancers`:

```js
import { Persist } from 'unstated-enhancers'
import LocalForage from 'localforage'

const options = {
    key: 'root',
    version: 1.0,
    storage: LocalForage,
    debounce: 250
}

Persist.start(options);

// ... Yor component code as always
```

To persist the state iof your containers you must provide a `persist` key inside the container class definition.

```js

type CounterState = {
  count: number
};

class CounterContainer extends PersistContainer<CounterState> {
  persist = {
    key: 'counter'
  }
 // ...
}
```

### Options

#### key

Type: `string`
<br>
Key used to storing the state

#### version

Type: `number`

#### debounce

Type: `number`
<br>
Default: `200`

Time after the state must be persisted after the first state change was happen.

##### storage

Type: `any`

Storage engine. It could be `localForage` for web apps, `AsyncStorage` for mobile apps.