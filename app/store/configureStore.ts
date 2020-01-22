import * as configureStoreDevelopment from './configureStore.dev';
import * as configureStoreProduction from './configureStore.prod';

const selectedConfigureStore =
  process.env.NODE_ENV === 'production'
      ? configureStoreProduction
      : configureStoreDevelopment;

export const { configureStore } = selectedConfigureStore;
