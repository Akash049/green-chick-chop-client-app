import 'react-native-gesture-handler';
import { createSwitchNavigator, createAppContainer } from 'react-navigation'
import { createStackNavigator } from 'react-navigation-stack'
import React, { Component, useEffect } from 'react'
import { View, Text, StatusBar, Dimensions, Image } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import Login from './src/component/screen/Login'
import Signup from './src/component/screen/Signup'
import Home from './src/component/screen/Home'
import ProductView from './src/component/screen/ProductView'
import Cart from './src/component/screen/Cart'
import Notifications from './src/component/screen/Notifications'
import Profile from './src/component/screen/Profile'
import Orders from './src/component/screen/Orders'
import ForgetPassword from './src/component/screen/ForgetPassword'
import Location from './src/component/screen/Location'
import Category from './src/component/screen/Category'
import SearchScreen from './src/component/screen/SearchScreen'
import Address from './src/component/screen/Address'
import { FoodProvider } from "./src/provider/FoodProvider";

import { NavigationContainer } from '@react-navigation/native';
import Index from './src/component/screen/Index';

const { width, height } = Dimensions.get('window');

const vw = Dimensions.get('window').width / 100;
const vh = Dimensions.get('window').height / 100;

// const Main = () => {
//   return (
//     <NavigationContainer>
//       <Index />
//     </NavigationContainer>
//   );
// };

// const ProviderStack = () =>{
//   return(
//     <FoodProvider>
//       <AppStack/>
//     </FoodProvider>
//   )
// }


const AppStack = createStackNavigator(
  {
    Home: Home,
    ProductView: ProductView,
    Cart: Cart,
    Notifications: Notifications,
    Profile: Profile,
    Orders: Orders,
    Location: Location,
    Category: Category,
    Address:Address,
    SearchScreen:SearchScreen,
  },
  {
    defaultNavigationOptions: {
      title: '',
      headerShown: false
    }
  }
);
const AuthStack = createStackNavigator(
  { 
    PublicHome: Home,
    Login: Login, 
    Signup: Signup, 
    ForgetPassword: ForgetPassword 
  },
  {
    defaultNavigationOptions: {
      title: '',
      headerShown: false
    }
  }
);

const navigator = createSwitchNavigator(
  {
    AuthLoading: App,
    App: AppStack,
    Auth: AuthStack,
  },
  {
    initialRouteName: 'AuthLoading',
  }
);


function App({ navigation }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      getToken();
    }, 3000);
    return () => clearTimeout(timer);
  }, []);


  const getToken = async () => {
    try {
      const value = await AsyncStorage.getItem('green_chick_chop_access_bearer_token')
      if (value !== null) {
        navigation.navigate("Home")
      } else {
        navigation.navigate("PublicHome")
      }
    } catch (e) {
      navigation.navigate("PublicHome")
    }
  }


  return (
    <View>
      {/* <StatusBar translucent backgroundColor='transparent' /> */}
      <View style={{ height: height, width: width, position: 'relative' }}>
        <Image
          style={{ height: '100%', width: '100%', resizeMode: 'contain' }}
          source={require('./src/assets/Splash.png')}
        />
      </View>
    </View>
  );
}

export default createAppContainer(navigator);
