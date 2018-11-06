import * as React from 'react';
import { Subscribe } from 'unstated';

const isObject = (value) => {
  return value && typeof value === 'object' && value.constructor === Object;
}

const connect = ( options: any = {}, config: any = {} ) => {
  if (!isObject(options)) {
    throw new Error('Connect needs an object for containers')
  }

  if (config) {
    // Do awesome things over containers
    // with the config
  }

  let _containers: any = Object.values(options);;
  let keys: string[] = Object.keys(options);

  return Component => props => {
    return (
      <Subscribe to={ _containers }>
        { (...containers) => {
          let inject: any = {};

          for (let index in keys) {
            inject[keys[index]] = containers[index];
          }

          return <Component {...props} containers={ inject } />;
        } }
      </Subscribe>
    )
  }
}

export default connect;