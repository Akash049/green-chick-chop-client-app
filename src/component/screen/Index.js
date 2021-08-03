import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Home from './Home'
import ProductView from './ProductView'

const IndexStack = createStackNavigator();

const Index = () => {

    return (
        <IndexStack.Navigator headerMode='none'>
            <IndexStack.Screen name='Home' component={Home} />
            <IndexStack.Screen name='ProductView' component={ProductView} />
        </IndexStack.Navigator>)
}



export default Index;
