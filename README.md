## Unstated tools and enhancers

### Install

```bash
npm install --save unstated-enhancers

# or

yarn install --save unstated-enhancers
```

### Manager

Global containers manager

```js
import { Manager } from 'unstated-enhancers';

Manager.run();
```

Then in other places simple call your containers using the container class name

```js
import { Manager } from 'unstated-enhancers';

// ...
    Manager.get('CounterContainer').increment();
// ...
```

### Logger

Redux like logger with redux dev tools integration

[Docs](https://github.com/xaamin/unstated-enhancers/blob/master/docs/unstated-logger.md)

### connect

Connect containers to components easily

Heavily inspired by [unstated-connect](https://github.com/goncy/unstated-connect)

[Docs](https://github.com/xaamin/unstated-enhancers/blob/master/docs/unstated-connect.md)

### Combine containers

Combine multiple containers into one and make them communicate with each other.

Base code from [unstated-compose](https://github.com/fabiospampinato/unstated-compose) but with no child and parent class inheritance.

[Docs](https://github.com/xaamin/unstated-enhancers/blob/master/docs/unstated-combine.md)