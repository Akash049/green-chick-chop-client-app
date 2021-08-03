/**
 * @format
 */

import { AppRegistry } from 'react-native';
import React, { useEffect } from 'react'
import App from './App';
import { name as appName } from './app.json';
import useGlobalState from "./src/store/useGlobalState"
import Context from "./src/store/context"
import { FoodProvider } from "./src/provider/FoodProvider";

const Main = () => {
    const store = useGlobalState();
    return (
        <Context.Provider value={store}>
            <App />
        </Context.Provider>

    )
}

AppRegistry.registerComponent(appName, () => App);
// AppRegistry.registerComponent(appName, () => (props) => (
//     <FoodProvider>
//         <App {...props} />
//     </FoodProvider>
// ), () => App);

