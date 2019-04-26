import React, { Component } from 'react';
import { logger } from '$Logger';

export const extendComponent = ( WrappedComponent, extensionWrapperApi ) => {
    if ( !WrappedComponent ) throw new Error( 'Must pass a component to wrap.' );

    if ( typeof extensionWrapperApi !== 'function' )
        throw new Error( 'extensionWrapperApi must be an executable function.' );

    const componentClassName = WrappedComponent.name;
    logger.info( `Extending ${componentClassName} via the extensions Api` );

    class Extended extends Component {
        static getDerivedStateFromError( error ) {
            // Update state so the next render will show the fallback UI.
            return { hasError: true, theError: error };
        }

        constructor( props ) {
            super( props );
            this.state = { hasError: false };
            this.EnWrappedComponent = extensionWrapperApi( WrappedComponent );
        }

        render() {
            if ( this.state && this.state.hasError ) {
                const err = this.state.theError;

                // You can render any custom fallback UI
                return (
                    <div>
                        <h2>Something went wrong extending {componentClassName}</h2>
                        <span>
                            {JSON.stringify( err, ['message', 'arguments', 'type', 'name'] )}
                        </span>
                    </div>
                );
            }

            const { EnWrappedComponent } = this;
            return <EnWrappedComponent {...this.props} />;
        }
    }

    // set our wrapped class name to be the standard class name.
    Object.defineProperty( Extended, 'name', {
        value: `Extended${componentClassName}`
    } );

    return Extended;
};
