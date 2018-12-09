import * as React from 'react';
import SubscribeGate from './subscribe-gate';

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

const mapCombinedContainersAuto = (config: any = {}, options: any): any => {
  let containers = {};

  let keys: string[] = Object.keys(config);

  keys.forEach((key) => {
    containers[key] = config[key]

    let _keys: string[] = Object.keys(config[key].ctx)

    _keys.forEach((_key) => {
      let name = _key;

      if (options.concatCombinedContainerNames) {
        name = name.charAt(0).toUpperCase() + name.slice(1)
        name = key + name
      }

      containers[name] = config[key].ctx[_key]
    })
  })

  return containers;
}

const connect = (config: any = {}, mapStateToProps?: (state: any) => any, options: any = {}): any => {
  if (!isObject(config) || Object.keys(config).length === 0) {
    throw new Error('Connect needs an object with containers')
  }

  let _containers: any[] = Object.values(config);
  let injected: any;
  let isMapped: boolean = false;
  const mapCombinedContainers: (containers: any, options?: any) => any = typeof options.mapCombinedContainers === 'boolean' ? mapCombinedContainersAuto : options.mapCombinedContainers;
  const loading: React.ReactNode = options.loading;

  return Component => props => {
    return (
      <SubscribeGate to={ _containers } loading={ loading }>
        { (...containers) => {
          let mappedState: any;

          if (!injected) {
            injected = makeContainers(containers, config);
          }

          if (mapCombinedContainers && !isMapped) {
            injected = mapCombinedContainers(injected, options);

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
      </SubscribeGate>
    )
  }
}

export default connect;