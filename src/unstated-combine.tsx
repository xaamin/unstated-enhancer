import { Container as UnstatedContainer } from 'unstated';

const combine = (containers: object) => {
  return function ( Container = UnstatedContainer as any ) {
    return class SuperContainer<Context extends object, State extends object> extends Container {
      ctx: Context;
      state: State;

      constructor (...args) {
        super (...args);

        this.state = ({} as State);
        this.ctx = ({} as Context);

        for (let name in containers) {
          const container = new containers[name]();

          container.ctx = this;

          this[name] = container;
          this.state[name] = Object.assign ({}, container.state);
          this.ctx[name] = container;

          const setState = container.setState;

          container.setState = async (...args) => {
            await setState.apply (container, args);

            const state = Object.assign ({}, container.state);

            this.setState ({
              [name]: state
            });
          }
        }
      }
    }
  }
}

export default combine;