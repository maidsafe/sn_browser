import path from 'path';
import i18n from 'i18n';
// import logger from 'logger';
export default {
    i18n : () =>
    {
        i18n.configure( {
            locales        : ['en'],
            directory      : path.resolve( __dirname, '../../', 'locales' ),
            objectNotation : true //,
            // logWarnFn( msg )
            // {
            //     console.warn( 'warn', msg );
            // }
        } );
        i18n.setLocale( 'en' );
    }
};
