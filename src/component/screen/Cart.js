import React, { useEffect } from 'react'
import { StyleSheet, Text, View, Platform, ScrollView, ImageBackground, TouchableOpacity, Image, Dimensions } from 'react-native'
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import AntIcon from 'react-native-vector-icons/AntDesign';
import FaIcon from 'react-native-vector-icons/FontAwesome';
import CustomButton from '../common/CustomButton'
import BottomMenu from '../common/BottomMenu'
import Add from '../common/Add'
import Toast from 'react-native-simple-toast';
import Loader from '../common/Loader'
import { HomeServices } from '../../Services/Home.services';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Title from '../common/Title'

const { width, height } = Dimensions.get('window');

const vw = Dimensions.get('window').width / 100;
const vh = Dimensions.get('window').height / 100;

const homeServices = new HomeServices()
export default function Cart({ navigation }) {
    const [appData, setAppData] = React.useState({});
    const [isLoader, setIasLoader] = React.useState(false);
    const [categoryListItem, setCategoryListItem] = React.useState([])
    const [cartItems, setCartItems] = React.useState(Math.random());
    const [randomNo, setRandomNo] = React.useState(Math.random());
    const [cartData, setCartData] = React.useState([])
    const [totalAmount, setTotalAmount] = React.useState(0);
    const [taxes, setTaxes] = React.useState(100);


    useEffect(() => {
        getAppDatas();
        setIasLoader(true);
    }, []);

    // const btnAction = () => {
    //     navigation.navigate('Home')
    // }

    const getAppDatas = () => {
        homeServices.getAppData().then(
            (data) => {
                setAppData(data)
                getCategoryDetailItem(data)
            },
            (error) => {
                console.log("error.response.status", error);
            }
        );
    }

    const getCategoryDetailItem = (aData) => {
        homeServices.getCategoryDetailItemList().then(
            (data) => {
                setCategoryListItem(data.result.result)
                getCartItems(data.result.result, aData);
            },
            (error) => {
                console.log("error.response.status", error);
            }
        );
    }

    const getCartItems = async (list, aData) => {
        var totalVal = [];
        var tempArr = [];
        var orderData = aData && aData.vendorData && aData.vendorData.orderData && aData.vendorData.orderData.length > 0 ? aData.vendorData.orderData : [];
        if (orderData && orderData.length && orderData.length > 0) {
            list && list.map((item, i) => {
                orderData.map((x, j) => {
                    if (item._id == x.itemId) {
                        console.log(x)
                        if (!x.itemMulti) {
                            item.quantity = x.quantity;
                            tempArr.push(item);
                            totalVal.push(parseInt(x.quantity) * parseInt(x.itemPrice))
                        } else {
                            item.price = x.itemPrice;
                            item.packaging_type = x.itemPackaging;
                            item.quantity = x.quantity;
                            // item.multiPrice = x.itemPrice;
                            // item.multiQuantity = x.quantity;
                            // item.multiPackaging_type = x.itemPackaging;
                            tempArr.push(item);
                            totalVal.push(parseInt(x.quantity) * parseInt(x.itemPrice))
                        }
                    }
                })
            })
            setCartData([...tempArr]);
            setTotalAmount(totalVal.reduce((a, b) => a + b, 0))
            setIasLoader(false);
        } else {
            setIasLoader(false);
            setCartData([])
        }
    }

    const minusClicked = (item) => {
        homeServices.getOrderDetails().then(
            async (data) => {
                var orders = data.vendorData.orderData;
                var itemData = {}
                if (orders.length > 0) {
                    await orders.map((val, i) => {
                        if (item._id == val.itemId) {
                            if (val.quantity == 1) {
                                orders.splice(i, 1);
                                Toast.show('Item removed from the cart', Toast.SHORT);
                            } else {
                                return val.quantity = val.quantity - 1;
                            }
                        }
                    })
                }
                setAppData(data)
                // data.vendorData.orderData = [];
                homeServices.setOrderDetails(data).then(
                    (data) => {
                        console.log(JSON.stringify(data))
                        getAppDatas()
                        setCartItems(Math.random())
                    },
                    (error) => {
                        console.log("error.response.status", error);
                    }
                );
            },
            (error) => {
                console.log("error.response.status", error);
            }
        );
    }


    const plusClicked = (item) => {
        var flag = true;
        homeServices.getOrderDetails().then(
            async (data) => {
                var orders = data.vendorData.orderData;
                var price = item.price;
                var itemData = {}
                if (orders.length > 0) {
                    await orders.map((val) => {
                        if (item._id == val.itemId && val.itemPrice == price) {
                            flag = false;
                            return val.quantity = val.quantity + 1;
                        }
                    })
                    if (flag) {
                        itemData = {
                            itemName: item.name,
                            itemId: item._id,
                            itemPrice: price,
                            itemPackaging: item.packaging_type,
                            itemMulti: item.itemMulti,
                            quantity: 1
                        }
                        orders.push(itemData);
                        Toast.show('Item added to the cart', Toast.SHORT);
                    }
                } else {
                    itemData = {
                        itemName: item.name,
                        itemId: item._id,
                        itemPrice: price,
                        itemPackaging: item.packaging_type,
                        itemMulti: item.itemMulti,
                        quantity: 1
                    }
                    orders.push(itemData);
                    Toast.show('Item added to the cart', Toast.SHORT);
                }
                setAppData(data)
                // data.vendorData.orderData = [];
                homeServices.setOrderDetails(data).then(
                    (data) => {
                        setCartItems(Math.random())
                        getAppDatas()
                        console.log(JSON.stringify(data))
                    },
                    (error) => {
                        console.log("error.response.status", error);
                    }
                );
            },
            (error) => {
                console.log("error.response.status", error);
            }
        );
    }

    const deleteItem = (item) => {
        homeServices.getOrderDetails().then(
            async (data) => {
                var orders = data.vendorData.orderData;
                if (orders.length > 0) {
                    await orders.map((val, i) => {
                        if (item._id == val.itemId) {
                            orders.splice(i, 1);
                            Toast.show('Item removed from the cart', Toast.SHORT);
                        }
                    })
                }
                setAppData(data)
                // data.vendorData.orderData = [];
                homeServices.setOrderDetails(data).then(
                    (data) => {
                        console.log(JSON.stringify(data))
                        getAppDatas()
                        setCartItems(Math.random())
                    },
                    (error) => {
                        console.log("error.response.status", error);
                    }
                );
            },
            (error) => {
                console.log("error.response.status", error);
            }
        );
    }

    const handleCheckout = async () => {
        try {
            const value = await AsyncStorage.getItem('green_chick_chop_access_bearer_token')
            if (value !== null) {
                navigation.navigate('Address', {
                    itemDetail: {
                        totalPrice: totalAmount,
                        appData: appData
                    },
                });
            } else {
                navigation.navigate("Login")
            }
        } catch (e) {
            navigation.navigate("Login")
        }
    }

    const handleClickItemDetail = (item) => {
        navigation.navigate('ProductView', {
            itemDetail: {
                name: item.name,
                packaging_type: item.packaging_type,
                multi_package: item.multi_package ? item.multi_package : [],
                multi_price: item.multi_price ? item.multi_price : [],
                price: item.price,
                _id: item._id,
                image_url: item.image_url[0],
                description: item.description,
                page: "Cart"
            },
        });
    }

    return (
        <View style={styles.main}>
            {isLoader &&
                <Loader />
            }
            <View style={[styles.header, { marginTop: Platform.OS === 'ios' ? vh * 4 : 0 }]}>
                <View style={{ justifyContent: 'center', width: vw * 90 }}>
                    <Title text={"Cart"} titleStyle={styles.titleStyle} titleContainer={styles.titleContainer} />
                    <Text style={{ fontSize: RFPercentage(2), color: '#a0a0a0', fontWeight: "bold" }}>{cartData && cartData.length > 0 ? cartData.length : 0} items</Text>
                </View>
            </View>
            <ScrollView scrollEnabled={true} keyboardShouldPersistTaps={'always'} style={styles.body}>
                <ScrollView horizontal={true}
                    showsHorizontalScrollIndicator={false}
                >
                    {cartData && cartData.length > 0 ? cartData.map((item, i) => {
                        return <View key={item._id} style={{ marginLeft: vw * 6, marginRight: vw * 5 }}>
                            <View style={{ marginTop: vh * 2, marginBottom: vh * 2, flexDirection: 'row', justifyContent: 'center' }}>
                                <TouchableOpacity onPress={() => deleteItem(item)}>
                                    <AntIcon name="delete" style={{ fontSize: 2.5 * vh, color: 'black' }} />
                                </TouchableOpacity>
                            </View>
                            <TouchableOpacity onPress={() => handleClickItemDetail(item)}>
                                <Image
                                    style={{ width: 220, height: 200, borderRadius: 10, resizeMode: 'stretch' }}
                                    source={{ uri: `${item.image_url[0]}` }}
                                    resizeMode="cover"
                                />
                            </TouchableOpacity>
                            <View style={{ marginTop: vh * 1.5, justifyContent: 'center' }}>
                                <View >
                                    <Text style={{ fontWeight: 'bold', fontSize: RFPercentage(2.2), textAlign: 'center' }}>{item.name}</Text>
                                    <Text style={{ color: '#a0a0a0', textAlign: 'center' }}>{item.packaging_type}</Text>
                                </View>
                                <View style={{ justifyContent: 'center', flexDirection: 'row', marginTop: vh * 2 }}>
                                    <Add key={item._id} minusClicked={() => minusClicked(item)} plusClicked={() => plusClicked(item)} items={appData} countPos={0} itemId={item._id} />
                                </View>
                                <View style={{ marginTop: vh * 1 }}>
                                    <Text style={{ fontWeight: 'bold', textAlign: 'center', color: '#a0a0a0' }}>₹ {item.price}</Text>
                                </View>
                            </View>
                        </View>
                    })
                        :
                        <View style={{ height: height, width: width }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: vh * 20 }}>
                                <View style={{ width: 50 * vw }}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                                        <View style={{ width: 150, height: 150, borderRadius: 150 / 2, backgroundColor: '#E4E4E4' }}>
                                            <Image style={{ resizeMode: 'cover', width: '100%', height: '100%' }} source={require('../../assets/pana.png')} resizeMode='cover' />
                                        </View>
                                    </View>
                                    <Text style={{ textAlign: 'center', fontWeight: 'bold', fontSize: RFPercentage(2.8), marginTop: 10 }} >Your cart is empty</Text>
                                    <Text style={{ textAlign: 'center', fontSize: RFPercentage(2), marginTop: 10 }}>Looks like you haven't made your menu yet</Text>
                                </View>
                            </View>
                        </View>
                    }
                </ScrollView>
                {cartData && cartData.length > 0 && <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                    <View style={{ width: vw * 90, height: '100%' }}>
                        <View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: vh * 5 }}>
                                <Text>Item Total</Text>
                                <Text>₹ {totalAmount > 0 ? totalAmount : 0}</Text>
                            </View>
                        </View>
                        {/* <View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
                                <Text>Taxes & Charges</Text>
                                <Text>₹ {taxes}</Text>
                            </View>
                        </View> */}
                        <View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
                                <Text style={{ fontWeight: 'bold', fontSize: RFPercentage(3) }}>Grand Total</Text>
                                <Text style={{ fontWeight: 'bold', fontSize: RFPercentage(3) }}>₹ {totalAmount > 0 ? totalAmount : 0}</Text>
                            </View>
                        </View>
                        <View style={{ marginTop: 20 }}>
                            <CustomButton isIcon={true} price={`${totalAmount}`} icon={<AntIcon name="arrowright" style={{ fontSize: RFPercentage(3), marginRight: 0, color: '#fff' }} />} enabled={true} btnAction={() => handleCheckout()} btnWidth={90} text={"Checkout"} textAlign="left" />
                        </View>
                    </View>
                </View>}
            </ScrollView>
            <View style={{ position: 'absolute', top: height - 115, width: width }}>
                <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                    <View style={styles.footer}>
                        <BottomMenu activeScreen="Cart" cartItems={cartItems} navigation={navigation} />
                    </View>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    main: {
        height: height,
        width: width,
        backgroundColor: '#fff',
        position: 'relative',
    },
    header: {
        width: width,
        height: 60,
        backgroundColor: '#fff',
        borderBottomColor: '#ddd',
        borderBottomWidth: 1,
        justifyContent: 'center',
        padding: 10,
        flexDirection: 'row',
        justifyContent: 'center'
    },
    body: {
        width: width,
    },
    footer: {
        width: vw * 90,
        height: 75,
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    heading: {
        marginTop: 10,
        marginBottom: 10,
        fontSize: RFPercentage(3.5),
        fontWeight: 'bold'
    },
    titleStyle: {
        fontWeight: 'bold'
    }

})
