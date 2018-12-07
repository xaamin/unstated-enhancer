import * as React from 'react'
import { Subscribe, Container } from 'unstated'
import { PERSIST_ENABLED } from './unstated-persist';

const isBootstrapped = (container: Container<any>) => (container as any).hydrated === true || !(container as any).persist;

type SubscribeProps = {
  loading: React.ReactNode,
  to: Container<any>[],
  children(...instances: Container<any>[]): React.ReactNode,
}
export default function SubscribeGate(props: SubscribeProps): any {
  let bootstrapped: boolean = PERSIST_ENABLED ? false : true;
  console.log('GATTTTTTTTTTTE', props)
  return (
    <Subscribe {...props}>
      {(...args) => {
        if (!bootstrapped && args.every(isBootstrapped))
          bootstrapped = true;
        if (bootstrapped) {
          return props.children(...args);
        }
        else {
          return props.loading || null
        }
      }}
    </Subscribe>
  );
}