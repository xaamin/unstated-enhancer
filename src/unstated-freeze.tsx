import * as React from 'react';
import * as differ from 'deep-object-diff';
import isShallowEqual from 'shallowequal';

const DEFAULT = {
  ownProps: [
    'containers'
  ],
  pure: false
}

const frezze = (selector: (props: any)) => any, options: any = DEFAULT): any => {
    return (Component) => {
      return class SelectorComponent extends React.Component<any, any> {
        selectedProps;

        constructor(props) {
          super(props);

          this.selectedProps = selector(this.props);
        }

        shouldComponentUpdate (nextProps) {
          const nextSelectedProps = selector(nextProps);
          let statesAreEqual = false;

          if (options.pure) {
            statesAreEqual = isShallowEqual(this.selectedProps, nextSelectedProps);
          } else {
            const diff = (differ as any).detailedDiff(nextSelectedProps, this.selectedProps);

            const added = Object.keys(diff.added);
            const deleted = Object.keys(diff.deleted);
            const updated = Object.keys(diff.updated);

            statesAreEqual = !added.length && !deleted.length && !updated.length;
          }

          if (!statesAreEqual) {

            this.selectedProps = nextSelectedProps;
          }

          return true;

        }

        render () {
          const { containers } = this.props;

          return <Component { ...this.selectedProps } />;
        }
      };
    }
  }

  export default frezze;