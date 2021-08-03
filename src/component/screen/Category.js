import React, { useEffect } from 'react'
import { StyleSheet, Text, View, ScrollView, Modal, Platform, ImageBackground, ToastAndroid, Image, Dimensions } from 'react-native'
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import Search from '../includes/Search'
import Icon from 'react-native-vector-icons/Ionicons';
import BottomMenu from '../common/BottomMenu';
import Add from '../common/Add'
import { TouchableOpacity } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { HomeServices } from '../../Services/Home.services';
import Loader from '../common/Loader'
import Location from "./Location"
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import Toast from 'react-native-simple-toast';

const { width, height } = Dimensions.get('window');

const vw = Dimensions.get('window').width / 100;
const vh = Dimensions.get('window').height / 100;

const homeServices = new HomeServices()

export default function Category({ navigation }) {

    const [categoryListItem, setCategoryListItem] = React.useState([])
    const [categoryItem, setCategoryItem] = React.useState([])
    const [isLoader, setIasLoader] = React.useState(false);
    const [appData, setAppData] = React.useState({});
    const [cartItems, setCartItems] = React.useState(Math.random());
    const [randomNo, setRandomNo] = React.useState(Math.random());

    useEffect(() => {
        setRandomNo(Math.random())
    }, []);

    useEffect(() => {
        setIasLoader(true);
        getAppDatas()
        getCategoryDetailItem();
    }, []);

    const getAppDatas = async () => {
        await homeServices.getAppData().then(
            (data) => {
                setAppData(data)
            },
            (error) => {
                console.log("error.response.status", error);
            }
        );
    }

    const getCategoryDetailItem = () => {
        homeServices.getCategoryDetailItemList().then(
            async (data) => {
                // alert("data, data", data)
                await setCategoryListItem(data.result.result)
                await getDataAlert(data.result.result);
                // setPaginationDetail(data.data.pagination)
            },
            (error) => {
                console.log("error.response.status", error);
            }
        );
    }

    var getDataAlert = async (list) => {
        try {
            const value = await navigation.getParam("itemDetail");
            if (value !== null) {
                var tempArr = [];
                list && list.map((item, i) => {
                    if (item.item_category.name.toLowerCase() == value.category.toLowerCase()) {
                        tempArr.push(item);
                    }
                })
                setCategoryItem([...tempArr]);
                setIasLoader(false);
            }
        } catch (e) {
            // error reading value
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
                page: "Category"
            },
        });
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
                        if (item._id == val.itemId) {
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
                            itemMulti: false,
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
                        itemMulti: false,
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

    const handlePrevPage = (page) => {
        navigation.navigate(page, {
            refreshPage: {
                refresh: Math.random()
            },
        });
    }

    return (
        <View keyboardShouldPersistTaps={'always'} style={styles.main}>
            {isLoader &&
                <Loader />
            }
            <View style={[styles.header, { marginTop: Platform.OS === 'ios' ? vh * 4 : 0 }]}>
                <View style={{ flexDirection: 'row' }}>
                    <TouchableOpacity onPress={() => handlePrevPage("Home")}>
                        <Icon name="chevron-back" style={{ fontSize: RFPercentage(4), color: '#000' }} />
                    </TouchableOpacity>
                    <View style={{ justifyContent: 'center' }}>
                        <Text style={{ fontSize: RFPercentage(2.5), fontWeight: 'bold' }}>Home</Text>
                    </View>
                </View>
            </View>
            <ScrollView
                showsHorizontalScrollIndicator={false}
            >
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', width: width, padding: 15, justifyContent: 'space-between' }}>

                    {
                        categoryItem.length > 0 &&
                        categoryItem.map((item, i) => {
                            return <>
                                <View key={item._id} style={{ marginTop: 15, width: vw * 45 }}>
                                    <TouchableOpacity
                                        onPress={() => handleClickItemDetail(item)}
                                    >
                                        <View style={{ width: '100%', height: 200 }}>
                                            <Image
                                                style={{ width: '100%', height: '100%', borderRadius: 10, resizeMode: 'stretch' }}
                                                source={{ uri: `${item.image_url[0]}` }}
                                                resizeMode="cover"
                                            />
                                        </View>
                                    </TouchableOpacity>
                                    <View style={{ marginTop: vh * 0.5 }}>
                                        <View>
                                            <Text style={{ fontWeight: 'bold', fontSize: RFPercentage(2.2) }}>{item.name}</Text>
                                            <Text style={{ color: '#a0a0a0' }}>{item.packaging_type}</Text>
                                            <Text style={{ fontWeight: 'bold', }}>₹ {item.price}</Text>
                                        </View>
                                        <View style={{ marginTop: vh * 0.5 }}>
                                            <Add key={item._id} minusClicked={() => minusClicked(item)} plusClicked={() => plusClicked(item)} items={appData} countPos={0} itemId={item._id} />
                                        </View>
                                    </View>
                                </View>
                            </>
                        })
                    }
                </View>

            </ScrollView>
            <View style={{ position: 'absolute', top: height - 115, width: width }}>
                <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                    <View style={styles.footer}>
                        <BottomMenu activeScreen="Order" cartItems={cartItems} navigation={navigation} />
                    </View>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    main: {
        width: width,
        height: '100%',
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
        padding: 10
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
})
