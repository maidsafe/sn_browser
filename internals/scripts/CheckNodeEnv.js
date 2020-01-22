import chalk from 'chalk';

// eslint-disable-next-line import/no-default-export
export default function CheckNodeEnvironment( expectedEnvironment ) {
    if ( !expectedEnvironment ) {
        throw new Error( '"expectedEnv" not set' );
    }

    if ( process.env.NODE_ENV !== expectedEnvironment ) {
        // eslint-disable-next-line no-console
        console.log(
            chalk.whiteBright.bgRed.bold(
                `"process.env.NODE_ENV" must be "${expectedEnvironment}" to use this webpack config`
            )
        );
        // eslint-disable-next-line unicorn/no-process-exit
        process.exit( 2 );
    }
}
