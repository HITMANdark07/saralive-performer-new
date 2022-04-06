import React from 'react';
import Router from './Router';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import reduxStore  from './src/redux/store';

export default function App() {
  return (
    <Provider store={reduxStore.store}>
      <PersistGate loading={null} persistor={reduxStore.persistor}>
        <Router />
      </PersistGate>
    </Provider>
  );
}
