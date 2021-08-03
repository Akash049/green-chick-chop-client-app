import React, { useEffect } from 'react'
import { StyleSheet, Text, View, ScrollView, ImageBackground, Platform, TouchableOpacity, Image, Dimensions } from 'react-native'
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import FeatherIcon from 'react-native-vector-icons/Feather';
import Icon from 'react-native-vector-icons/Ionicons';
import { HomeServices } from '../../Services/Home.services';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

const vw = Dimensions.get('window').width / 100;
const vh = Dimensions.get('window').height / 100;

const homeServices = new HomeServices()
export default function BottomMenu({ navigation, action, activeScreen, cartItems }) {
    const [cartValue, setCartValue] = React.useState(0);
    useEffect(() => {
        getAppDatas();
    }, [cartItems]);

    const getAppDatas = async () => {
        await homeServices.getAppData().then(
            (data) => {
                if (data && data.vendorData && data.vendorData.orderData && data.vendorData.orderData.length > 0) {
                    setCartValue(data.vendorData.orderData.length);
                } else {
                    setCartValue(0);
                }
            },
            (error) => {
                console.log("error.response.status", error);
            }
        );
    }

    const getToken = async (screen) => {
        action && action(false)
        try {
            const value = await AsyncStorage.getItem('green_chick_chop_access_bearer_token')
            if (value !== null) {
                navigation.navigate(screen, {
                    refreshPage: {
                        refresh: Math.random()
                    },
                })
            } else {
                navigation.navigate("Login")
            }
        } catch (e) {
            navigation.navigate("Login")
        }
    }


    const handleScreen = (screen) => {
        action && action(false)
        navigation.navigate(screen, {
            refreshPage: {
                refresh: Math.random()
            },
        })
    }
    return (
        <View style={{ justifyContent: 'center' }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <TouchableOpacity onPress={() => handleScreen("Home")}>
                    <View>
                        <FeatherIcon name="shopping-bag" style={{ width: '100%', textAlign: 'center', fontSize: RFPercentage(3), marginRight: 5, color: activeScreen == "Order" ? '#f04c4c' : 'grey' }} />
                        <Text style={{ color: activeScreen == "Order" ? '#f04c4c' : 'grey' }}>Order</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => getToken("Notifications")}>
                    <View>
                        <FeatherIcon name="bell" style={{ width: '100%', textAlign: 'center', fontSize: RFPercentage(3), marginRight: 5, color: activeScreen == "Notifications" ? '#f04c4c' : 'grey' }} />
                        <Text style={{ color: activeScreen == "Notifications" ? '#f04c4c' : 'grey' }}>Notifications</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleScreen("Cart")}>
                    <View style={{ position: 'relative' }}>
                        <Icon name="md-cart-outline" style={{ width: '100%', textAlign: 'center', fontSize: RFPercentage(3), marginRight: 5, color: activeScreen == "Cart" ? '#f04c4c' : 'grey' }} />
                        <Text style={{ color: activeScreen == "Cart" ? '#f04c4c' : 'grey' }}>Cart</Text>
                        {cartValue > 0 && <Text style={styles.notifyText}>{cartValue}</Text>}
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => getToken("Profile")}>
                    <View>
                        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                            <View style={[styles.img, { height: Platform.OS === 'ios' ? 25 : 23, width: Platform.OS === 'ios' ? 25 : 23 }]}>
                                <Image style={{ resizeMode: 'cover', width: '100%', height: '100%' }} source={require('../../assets/default_profile.png')} />
                            </View>
                        </View>
                        <Text style={{ color: activeScreen == "Profile" ? '#f04c4c' : 'grey' }}>Profile</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    img: {
        // height: 23,
        // width: 23,
        borderWidth: 0.2,
        borderColor: '#000',
        padding: 3,
        borderRadius: 28 / 2,
        justifyContent: 'center',
        overflow: 'hidden'
    },
    notifyText: {
        backgroundColor: '#f04c4c',
        textAlign: 'center',
        width: 15,
        height: 15,
        borderRadius: 20 / 2,
        color: '#fff',
        fontSize: RFPercentage(1.5),
        position: 'absolute',
        top: -5,
        right: -5
    }
})
