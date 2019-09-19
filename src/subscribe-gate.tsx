import * as React from 'react'
import { Subscribe, Container } from 'unstated'
import { PERSIST_ENABLED } from './unstated-persist';

const isBootstrapped = (container: Container<any>) => (container as any).hydrated === true || (container as any).persist === undefined || ((container as any).state !== undefined && (container as any).state._persist_version !== undefined);

type SubscribeProps = {
  loading: React.ReactNode,
  to: Container<any>[],
  children(...instances: Container<any>[]): React.ReactNode,
}
export default function SubscribeGate(props: SubscribeProps): any {
  let bootstrapped: boolean = PERSIST_ENABLED ? false : true;

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