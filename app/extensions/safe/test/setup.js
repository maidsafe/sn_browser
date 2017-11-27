import 'babel-polyfill';
import path from 'path';
import i18n from 'i18n';
import ffiLoader from '../ffi/lib';

console.log("RUNNING SETUPPPPPPPPPP");

i18n.configure({
  locales: ['en'],
  directory: path.resolve(__dirname, '../', 'locales'),
  objectNotation: true
});

i18n.setLocale('en');

const init = () => {

  console.log("INIT SETUP RUNNING");
  ffiLoader.load()
    .catch( e=> console.error('????? e here tooooooooooo>>>>>>>>', e));
};

export default init();
