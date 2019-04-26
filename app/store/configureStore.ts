import * as configureStoreDev from './configureStore.dev';
import * as configureStoreProd from './configureStore.prod';

const selectedConfigureStore =
  process.env.NODE_ENV === 'production'
      ? configureStoreProd
      : configureStoreDev;

export const { configureStore } = selectedConfigureStore;
