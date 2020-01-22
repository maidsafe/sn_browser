#!/usr/bin/env node
const { spawn } = require( 'child_process' );

const environment = process.env.NODE_ENV || 'production';

const isRunningDevelopment = environment.startsWith( 'dev' );

if ( isRunningDevelopment ) {
    spawn( 'yarn', ['run', 'install-mock'], {
        shell: true,
        env: process.env,
        stdio: 'inherit'
    } );
}
