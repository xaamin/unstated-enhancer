import * as React from 'react';
import * as differ from 'deep-object-diff';
import isShallowEqual from 'shallowequal';

const frezze = (mapProps: (props: any)) => any, options: any = { pure: true }) => {
    return (Component) => {
      return class SelectorComponent extends React.Component<any, any> {
        selectedProps;

        constructor(props) {
          super(props);

          this.selectedProps = mapProps(this.props);
        }

        shouldComponentUpdate (nextProps) {
          const nextSelectedProps = mapProps(nextProps);
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
          const props = {

          }

          return <Component { ...this.selectedProps } containers={ containers } />;
        }
      };
    }
  }

  export default frezze;