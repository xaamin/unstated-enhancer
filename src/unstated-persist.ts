import * as unstated from 'unstated'
import PersistConfig from './support/PersistConfig'
import queue from './support/queue';

const __SUPER_SECRET_CONTAINER_DEBUG_HOOK__ = (unstated as any).__SUPER_SECRET_CONTAINER_DEBUG_HOOK__

let PERSIST_ENABLED: boolean = false;

class Persist {
  private __containers: any
  private key: string
  private prefix: string
  private version: number
  private debounce: number
  private storage: any
  private state: any;
  private persistStatePartial: any

  constructor() {
    this.__containers = {};
    this.state = {};
    this.debounce = 250;
    this.prefix = 'unstated::'
  }

  config(config: PersistConfig) {
    for (const [key, value] of  Object.entries(config)) {
      this[key] = value;
    }

    this.persistStatePartial = {
      _persist_version: this.version,
      __action: 'REHYDRATE'
    }
  }

  async clear() {
    await this.storage.removeItem(this.key);
  }

  containers() {
    return this.__containers;
  }

  start(config?: PersistConfig) {
    if (config) {
      this.config(config);
    }

    PERSIST_ENABLED = true;

    this.key = this.prefix + this.key

    __SUPER_SECRET_CONTAINER_DEBUG_HOOK__((container: any) => {
      const bootstrap = () => this.__bootstrap(container)

      queue(bootstrap);
    })

  }

  __bootstrap(container: any) {
    if (container.persist) {
      let name = container.name || container.constructor.name

      this.__containers[name] = container

      this.rehydrate(container)
    }
  }

  async rehydrate(container: any) {
    const config = container.persist
    const key = config.key;

    const containerDefaultState: any = container.state || {}

    container.hydrated = false;

    try {
      let serialState = await this.storage.getItem(this.key);

      if (serialState !== null) {
        this.state = JSON.parse(serialState)

        let newState = this.state[key];

        // NOTE:
        // No migrations yet, just clear state.
        // Can be added later with similar api to redux-persist.
        if (newState._persist_version !==  this.version) {
          if (process.env.NODE_ENV !== 'production') {
            console.log(`unstated-persist: state version mismatch for ${name}, skipping rehydration`)
          }

          container.setState({
            ...this.persistStatePartial,
            ...containerDefaultState
          })
        } else {
          // State versions match, set state as is
          container.setState({
            ...newState,
            __action: 'REHYDRATE'
          })
        }
      } else {
        container.setState({
          ...this.persistStatePartial,
          ...containerDefaultState
        })
      }
    } catch (err) {
      container.setState({
        ...this.persistStatePartial,
        ...containerDefaultState
      })

      if (process.env.NODE_ENV !== 'production') {
        console.log("unstated-persist: Error during rehydate", err);
      }
    } finally {
      let debounceId: any;

      container.hydrated = true;

      // Dont start PERSIST_ENABLED until rehydration is complete
      container.subscribe(() => {
        if (debounceId) {
          clearTimeout(debounceId);
        }

        debounceId = setTimeout(() => {
          this.state[key] = container.state;

          this.storage
            .setItem(this.key, JSON.stringify(this.state))
            .catch((err) => {
              if (process.env.NODE_ENV !== 'production') {
                console.log("unstated-persist: Error on persist state", err)
              }
            })
        }, this.debounce)
      });
    }
  };
}

export {
  PERSIST_ENABLED
}

export default Persist
