import * as unstated from 'unstated'

class Middleware {
  private __containers: any
  private __blacklist: string[];

  constructor() {
    this.__containers = {};
    this.__blacklist = [];

    this.bootstrap();
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

  get(name: string) {
    return this.__containers[name]
  }

  print() {
    const style = `color: inherit; font-weight: bold`

    for (const [key, value] of Object.entries(this.__containers)) {
      console.log(`%c ${key} → `, style, value)
    }
  }

  bootstrap() {
      (unstated as any).__SUPER_SECRET_CONTAINER_DEBUG_HOOK__((container: any) => {
        const name = container.name || container.constructor.name

        container.name = name

        this.__containers[name] = container
      })
  }
}

export default Middleware
