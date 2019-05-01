import chalk from 'chalk';

// eslint-disable-next-line import/no-default-export
export default function CheckNodeEnv( expectedEnv ) {
    if ( !expectedEnv ) {
        throw new Error( '"expectedEnv" not set' );
    }

    if ( process.env.NODE_ENV !== expectedEnv ) {
        // eslint-disable-next-line no-console
        console.log(
            chalk.whiteBright.bgRed.bold(
                `"process.env.NODE_ENV" must be "${expectedEnv}" to use this webpack config`
            )
        );
        // eslint-disable-next-line unicorn/no-process-exit
        process.exit( 2 );
    }
}
