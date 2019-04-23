import * as unstated from 'unstated'
import ManagerConfig from './support/ManagerConfig';

const __SUPER_SECRET_CONTAINER_DEBUG_HOOK__ = (unstated as any).__SUPER_SECRET_CONTAINER_DEBUG_HOOK__

class Manager {
  private __containers: any

  beauty: boolean

  constructor() {
    this.__containers = {};
    this.beauty = false;
  }

  run() {
    this.__bootstrap();
  }

  config(config: ManagerConfig) {
    for (const [key, value] of  Object.entries(config)) {
      this[key] = value;
    }
  }

  store() {
    const store: any = {}

    for (const [key, value] of Object.entries(this.__containers)) {
      store[key] = (value as any).state
    }

    return store
  }

  all() {
    const containers: any = {}

    for (const [key, value] of Object.entries(this.__containers)) {
      containers[key] = (value as any)
    }

    return containers
  }

  raise(method: string, params: any = {}) {
    for (const container of Object.values(this.__containers)) {
      if ((container as any)[method] && typeof (container as any)[method] === 'function') {
        (container as any)[method](params);
      }
    }
  }

  reset() {
    for (const container of Object.values(this.__containers)) {
      let props: any = {}

      if ((container as any).persist) {
        props._persist_version = (container as any).state._persist_version
      }

      (container as any).state = {
        ...(container as any).__containerInitialState,
        ...props
      };
    }
  }

  get(name: string) {
    return this.__containers[name]
  }

  print() {
    const style = `color: inherit; font-weight: bold`

    for (const [key, value] of Object.entries(this.__containers)) {
      console.log(`%c ${key} → `, style, value)
    }
  }

  __bootstrap() {
    __SUPER_SECRET_CONTAINER_DEBUG_HOOK__((container: any) => {
      let name = container.container || container.constructor.container || container.name || container.constructor.name

      container.__containerInitialState = container.state || container.constructor.state || {}

      if (this.beauty) {
        name = name.replace(/container$/ig, '');
      }

      this.__containers[name] = container
    })
  }
}

export default Manager
