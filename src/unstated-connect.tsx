import * as React from 'react';
import { Subscribe } from 'unstated';

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

const connect = ( options: any = {}, mapStateToProps?: (state: any) => any, mapContainersToProps?: (containers: any) => any) => {
  if (!isObject(options)) {
    throw new Error('Connect needs an object with containers')
  }

  let _containers: any = Object.values(options);;

  let inject: any;
  let mappedContainers: any;

  return Component => props => {
    let ConnectedComponenet = Component;

    return (
      <Subscribe to={ _containers }>
        { (...containers) => {

          if (!inject) {
            inject = makeContainers(containers, options);
          }

          if (!mappedContainers && mapContainersToProps) {
            mappedContainers = mapContainersToProps(inject);
          }

          let newProps = {
            ...props
          }

          if (!mapContainersToProps) {
            newProps.containers = inject;
          } else {
            newProps.containers = mappedContainers;
          }

          if (mapStateToProps) {
            let mappedState: any = mapStateToProps(inject);

            newProps = {
              ...mappedState,
              ...newProps
            }
          }

          return <ConnectedComponenet { ...newProps } />;
        } }
      </Subscribe>
    )
  }
}

export default connect;