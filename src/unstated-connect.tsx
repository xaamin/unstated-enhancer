import * as React from 'react';
import { Subscribe } from 'unstated';
import * as isShallowEqual from 'shallowequal';

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

const wrap = (mapStateToProps: (containers: any) => any, options: any = { pure: true }) => {

  return (Component) => {
    return class SelectorComponent extends React.Component<any, any> {

      selectedProps = mapStateToProps(this.props.containers);

      shouldComponentUpdate () {
        const nextSelectedProps = mapStateToProps(this.props.containers);
        const statesAreEqual = isShallowEqual(this.selectedProps, nextSelectedProps ) ;

        if ( options.pure && statesAreEqual) {
          return false;
        }

        this.selectedProps = nextSelectedProps;

        return true;

      }

      render () {
        return <Component {...this.selectedProps} />;
      }
    }
  }
}


const connect = ( options: any = {}, mapStateToProps?: (state: any) => any, mapContainersToProps?: (containers: any) => any, config: any = undefined) => {
  if (!isObject(options)) {
    throw new Error('Connect needs an object with containers')
  }

  let _containers: any = Object.values(options);;

  let inject: any;
  let mappedContainers: any;

  return Component => props => {
    return (
      <Subscribe to={ _containers }>
        { (...containers) => {
          let ConnectedComponenet = Component;
          let mappedState: any;

          if (!inject) {
            inject = makeContainers(containers, options);
          }

          if (!mappedContainers && mapContainersToProps) {
            mappedContainers = mapContainersToProps(inject);
          }

          if (mapStateToProps) {
            mappedState = mapStateToProps(mappedContainers || inject);
          }

          let newProps = {
            ...props
          }

          if (!mapContainersToProps) {
            newProps.containers = inject;
          } else {
            newProps.containers = mappedContainers;
          }
          
          if (mappedState) {
            newProps = {
              ...mappedState,
              ...newProps
            }
          }

          ConnectedComponenet = <ConnectedComponenet { ...newProps } />;

          if (mappedState) {
            ConnectedComponenet = wrap(mapStateToProps, config)(ConnectedComponenet);
          }

          console.log('CONNECTED', ConnectedComponenet);

          return <ConnectedComponenet { ...newProps } />;
        } }
      </Subscribe>
    )
  }
}

export default connect;