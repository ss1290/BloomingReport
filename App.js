import React, { useEffect } from 'react';
import { StatusBar } from 'react-native';
import { FormProvider } from './src/Context/FormContext';
import AppNavigator from './src/Navigation/AppNavigator';
import Toast from 'react-native-toast-message';
import { getRealm, closeRealm } from './src/Utils/RealmInstance';

export default function App() {
  useEffect(() => {
    const initRealm = async () => {
      try {
        await getRealm();
        console.log('Realm initialized successfully');
      } catch (error) {
        console.error('Failed to initialize Realm:', error);
      }
    };

    initRealm();
    return () => {
      closeRealm();
    };
  }, []);

  return (
    <FormProvider>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <AppNavigator />
      <Toast position={"bottom"} bottomOffset={50}/>
    </FormProvider>
  );
}