import React, { Component } from 'react';
import logger from 'logger';

const extendComponent = ( WrappedComponent, extensionWrapperApi ) =>
{

    if( !WrappedComponent ) throw new Error( 'Must pass a component to wrap.');

    if( typeof extensionWrapperApi !== 'function' ) throw new Error( 'extensionWrapperApi must be an executable function.');

    const componentClassName = WrappedComponent.name;
    logger.verbose(`Extending ${componentClassName} via the extensions Api`);

    class Extended extends Component {
        constructor(props) {
            super(props);
            this.EnWrappedComponent = extensionWrapperApi( WrappedComponent );
        }
        render() {
            const { EnWrappedComponent } = this;
            return <EnWrappedComponent {...this.props} />;
      }
    };

    // set our wrapped class name to be the standard class name.
    Object.defineProperty(Extended, "name", { value: `Extended${componentClassName}` });

  return Extended;

}

export default extendComponent;
