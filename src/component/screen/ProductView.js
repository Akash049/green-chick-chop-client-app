import React, { useEffect } from 'react'
import { StyleSheet, Text, View, Platform, ScrollView, ImageBackground, TouchableOpacity, Image, Dimensions } from 'react-native'
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import Search from '../includes/Search'
import Icon from 'react-native-vector-icons/Ionicons';
import Title from '../common/Title'
import BottomMenu from '../common/BottomMenu'
import Add from '../common/Add'
import FeatherIcon from 'react-native-vector-icons/Feather';
import Loader from '../common/Loader'
import { HomeServices } from '../../Services/Home.services';
import axios from 'react-native-axios';
import Toast from 'react-native-simple-toast';

const { width, height } = Dimensions.get('window');
const baseUrl = 'https://vendor.greenchickchopindia.com:3000/'

const vw = Dimensions.get('window').width / 100;
const vh = Dimensions.get('window').height / 100;

const homeServices = new HomeServices()
export default function ProductView({ navigation }) {
    const [itemDetail, setItemDetail] = React.useState([])
    const [isLoader, setIasLoader] = React.useState(false);
    const [appData, setAppData] = React.useState({});
    const [prevPage, setPrevPage] = React.useState('Home');
    const [cartItems, setCartItems] = React.useState(Math.random());
    const [randomNo, setRandomNo] = React.useState(Math.random());
    const [selectedPackaging, setSelectedPackaging] = React.useState('');
    const [selectedPrice, setSelectedPrice] = React.useState('');
    const [isMulti, setIsMulti] = React.useState(false);

    useEffect(() => {
        setRandomNo(Math.random())
        setIasLoader(true);
        getDataAlert();
        getAppDatas();
    }, [])

    const getAppDatas = () => {
        homeServices.getAppData().then(
            (data) => {
                setAppData(data)
            },
            (error) => {
                console.log("error.response.status", error);
            }
        );
    }

    var getDataAlert = async () => {
        try {
            const value = await navigation.getParam("itemDetail");
            if (value !== null) {
                console.log(value);
                getItemDetail(value._id)
                setItemDetail(value);
                setIasLoader(false);
                setPrevPage(value.page)
                if (value.multi_package && value.multi_package.length > 0) {
                    setSelectedPackaging(value.multi_package[0]);
                    setSelectedPrice(value.multi_price[0]);
                    setIsMulti(true);
                }
            }
        } catch (e) {
            // error reading value
        }
    }

    const getItemDetail = (id) => {
        axios.get(`${baseUrl}chop/item/${id}`)
            .then(async (response) => {
                // debugger
                console.log(response)
                if (response.data.success) {
                }
            })
            .catch(function (error) {
                console.log(error);
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
                var itemData = {}
                if (isMulti) {
                    var price = selectedPrice;
                    var packagingType = selectedPackaging;
                } else {
                    var packagingType = item.packaging_type;
                    var price = item.price;
                }
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
                            itemPackaging: packagingType,
                            itemMulti: isMulti,
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
                        itemPackaging: packagingType,
                        itemMulti: isMulti,
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

    const handleMultipackaging = (item, i) => {
        setSelectedPrice(item.multi_price[i])
        setSelectedPackaging(item.multi_package[i])
    }


    return (
        <View style={styles.main}>
            {isLoader &&
                <Loader />
            }
            <View style={[styles.header, { marginTop: Platform.OS === 'ios' ? vh * 4 : 0 }]}>
                <View style={{ flexDirection: 'row' }}>
                    <TouchableOpacity onPress={() => handlePrevPage(prevPage)}>
                        <Icon name="chevron-back" style={{ fontSize: RFPercentage(4), color: '#000' }} />
                    </TouchableOpacity>
                    <View style={{ justifyContent: 'center' }}>
                        <Text style={{ fontSize: RFPercentage(2.5), fontWeight: 'bold' }}>{prevPage}</Text>
                    </View>
                </View>
            </View>
            <View style={styles.body}>
                <View style={{ position: 'relative' }}>
                    <Image
                        key={itemDetail.image_url}
                        // source={{ uri: itemDetail.image_url }}
                        source={{ uri: `${itemDetail.image_url}` }}
                        style={{ width: width, height: vh * 40, resizeMode: 'cover' }}
                    />
                    {/* <View style={{ position: 'absolute', width: '100%', bottom: 27, zIndex: 9999 }}>
                        <View style={{ justifyContent: 'center', flexDirection: 'row' }}>
                            <Add key={itemDetail._id} minusClicked={() => minusClicked(itemDetail)} plusClicked={() => plusClicked(itemDetail)} items={appData} countPos={-20} itemId={itemDetail._id} />
                        </View>
                    </View> */}
                </View>
                <View style={{ position: 'absolute', width: '100%', top: vh * 32, zIndex: 9999 }}>
                    <View style={{ justifyContent: 'center', flexDirection: 'row' }}>
                        <Add key={itemDetail._id} minusClicked={() => minusClicked(itemDetail)} plusClicked={() => plusClicked(itemDetail)} items={appData} countPos={-20} itemId={itemDetail._id} />
                    </View>
                </View>

                <ScrollView style={styles.bottomBox}>
                    <View style={styles.bottomScroll}>
                        <View style={styles.inputContainer}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <View>
                                    <Title text={itemDetail.name} titleStyle={styles.titleStyle} titleContainer={styles.titleContainer} />
                                    {itemDetail.multi_package && itemDetail.multi_package.length > 0 ? <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                                        {itemDetail.multi_package.map((item, i) => {
                                            return <TouchableOpacity onPress={() => handleMultipackaging(itemDetail, i)} style={[styles.multiPackage, { backgroundColor: selectedPackaging == item ? '#f04c4c' : '#fff' }]}>
                                                <Text style={{ color: selectedPackaging == item ? '#fff' : '#000' }}>{item}</Text>
                                            </TouchableOpacity>
                                        })}
                                    </View>
                                        : <Text>{itemDetail.packaging_type}</Text>

                                    }
                                </View>
                                <View style={{ justifyContent: 'center' }}>
                                    {itemDetail.multi_package && itemDetail.multi_package.length > 0 ? <Text style={{ fontWeight: 'bold', fontSize: RFPercentage(2) }}>₹ {selectedPrice}</Text>
                                        : <Text style={{ fontWeight: 'bold', fontSize: RFPercentage(2) }}>₹ {itemDetail.price}</Text>

                                    }
                                </View>
                            </View>
                            <View style={{ marginTop: 20 }}>
                                <Text style={{ fontWeight: 'bold', fontSize: RFPercentage(2.5) }}>Description</Text>
                                <ScrollView style={{ height: 200 }} showsVerticalScrollIndicator={false}>
                                    <Text style={{ textAlign: 'justify' }}>
                                        {itemDetail.description}
                                    </Text>
                                </ScrollView>
                            </View>
                        </View>
                    </View>
                </ScrollView>

            </View>
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
    bottomBox: {
        width: width,
        // height: vh * 60,
        marginTop: -40,
        borderTopRightRadius: 40,
        borderTopLeftRadius: 40,
        backgroundColor: '#fff',
        position: 'relative'
    },
    inputContainer: {
        width: vw * 80,
        paddingTop: vh * 5,
        paddingBottom: vh * 5,
    },
    titleStyle: {
        fontWeight: 'bold',
        textAlign: 'left',
        fontSize: RFPercentage(3)
    },
    bottomScroll: {
        flexDirection: 'row',
        justifyContent: 'center'
    },
    multiPackage: {
        borderWidth: 1,
        borderColor: '#f04c4c',
        marginRight: 5,
        padding: 5,
        borderRadius: 7
    }
})
