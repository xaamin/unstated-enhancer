import * as React from 'react';
import { Subscribe } from 'unstated';
import frezze from './unstated-freeze';

const isObject = (value) => {
  return value && typeof value === 'object' && value.constructor === Object;
}

const makeContainers = (containers: any, config: any): any => {
  let keys: string[] = Object.keys(config);
  let inject = {};

  for (let index in keys) {
    inject[keys[index]] = containers[index];
  }

  return inject;
}

const connect = (config: any = {}, mapStateToProps?: (state: any) => any, mapContainersToProps?: (containers: any) => any) => {
  if (!isObject(config)) {
    throw new Error('Connect needs an object with containers')
  }

  let _containers: any[] = Object.values(config);
  let injected: any;
  let isMapped: boolean = false;

  return Component => props => {
    return (
      <Subscribe to={ _containers }>
        { (...containers) => {
          let mappedState: any = props;

          if (!injected) {
            injected = makeContainers(containers, config);
          }

          if (mapContainersToProps && !isMapped) {
            injected = mapContainersToProps(injected);

            isMapped = true;
          }

          if (mapStateToProps) {
            mappedState = mapStateToProps(injected);
          }

          let newProps = props;

          if (mappedState) {
            newProps = {
              ...props,
              ...mappedState
            };
          }

          return <Component {...newProps} containers={ injected } />;
        } }
      </Subscribe>
    )
  }
}

export default connect;