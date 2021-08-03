import React, { useEffect, useContext } from 'react'
import { StyleSheet, Text, View, ScrollView, TextInput, Modal, Platform, ImageBackground, Image, Dimensions } from 'react-native'
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import Search from '../includes/Search'
import Icon from 'react-native-vector-icons/EvilIcons';
import BottomMenu from '../common/BottomMenu';
import Add from '../common/Add'
import { TouchableOpacity } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { HomeServices } from '../../Services/Home.services';
import Loader from '../common/Loader'
import Location from "./Location"
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import Toast from 'react-native-simple-toast';
import { useFocusEffect } from '@react-navigation/native';
import "../common/Action";
import { update } from '../common/Action';
import { FoodContext } from "../../provider/FoodProvider";
const { width, height } = Dimensions.get('window');

const vw = Dimensions.get('window').width / 100;
const vh = Dimensions.get('window').height / 100;

const homeServices = new HomeServices()

const qualityCheck = [
    {
        id: 1,
        text: "Premium produce, sourced directly from the origin",
        img: require("../../assets/farming.png")
    },
    {
        id: 2,
        text: "Scientifically designed Central Production Unit",
        img: require("../../assets/processinng.png")
    },
    {
        id: 3,
        text: "Compliance to 150 stringent quality checks.",
        img: require("../../assets/check.png")
    },
    {
        id: 4,
        text: "Delivered fresh every day",
        img: require("../../assets/deliver.png")
    },
    {
        id: 5,
        text: "Experience extraordinary cooking",
        img: require("../../assets/cooking.png")
    }
];


export default function Home({ navigation }) {
    const food = useContext(FoodContext);
    const [categoryList, setCategoryList] = React.useState([])
    const [categoryListItem, setCategoryListItem] = React.useState([])
    const [isLoader, setIasLoader] = React.useState(false);
    const [shouldScroll, setShouldScroll] = React.useState(true);
    const [count, setCount] = React.useState(0);
    const [appData, setAppData] = React.useState({});
    const [locationModalVisible, setLocationModalVisible] = React.useState(false);
    const [isNewVendor, setNewVendor] = React.useState(false);
    const [isReady, setReady] = React.useState(false);
    const [cartItems, setCartItems] = React.useState(Math.random());
    const [randomNo, setRandomNo] = React.useState(Math.random());
    const [tempVal, setTempVal] = React.useState("");

    // useFocusEffect(
    //     React.useCallback(() => {
    //     }, [])
    // );

    useEffect(() => {
        setRandomNo(Math.random())
        getDataAlert()
    }, []);

    useEffect(() => {
        getDataAlert()
    }, []);

    useEffect(() => {
        setCartItems(Math.random());
        getAppDataOnNavigation();
    }, [navigation]);

    useEffect(() => {
        getAppDatas();
    }, [isNewVendor, locationModalVisible]);


    var getDataAlert = async () => {
        try {
            const value = await navigation.getParam("refreshPage");
            console.log(value)
            if (value.refresh !== null) {
            }
        } catch (e) {
            // error reading value
        }
    }

    var getAppDataOnNavigation = async () => {
        await homeServices.getAppData().then(
            (data) => {
                setAppData(data)
            },
            (error) => {
                console.log("error.response.status", error);
            }
        );
    }

    const getAppDatas = async () => {
        await homeServices.getAppData().then(
            (data) => {
                if (data && data.vendorData && data.vendorData.location && data.vendorData.location.address) {
                    setReady(true);
                    setIasLoader(true);
                    getAllCategory()
                    getCategoryDetailItem()
                } else {
                    setLocationModalVisible(true);
                }
                setAppData(data)
            },
            (error) => {
                console.log("error.response.status", error);
            }
        );
    }

    const getCategoryDetailItem = () => {
        homeServices.getCategoryDetailItemList().then(
            (data) => {
                // alert("data, data", data)
                setCategoryListItem(data.result.result)
                setIasLoader(false);
                // setPaginationDetail(data.data.pagination)
            },
            (error) => {
                console.log("error.response.status", error);
            }
        );
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
                var price = item.price;
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


    const getAllCategory = () => {
        homeServices.getAllCategoryList().then(
            (data) => {
                setCategoryList(data.result.result)
                // setPaginationDetail(data.data.pagination)
            },
            (error) => {
                console.log("error.response.status", error);
            }
        );
    }

    const handleClickItemDetail = (item) => {
        navigation.navigate('ProductView', {
            itemDetail: {
                _id: item._id,
                name: item.name,
                packaging_type: item.packaging_type,
                multi_package: item.multi_package ? item.multi_package : [],
                multi_price: item.multi_price ? item.multi_price : [],
                price: item.price,
                image_url: item.image_url[0],
                description: item.description,
                page: 'Home'
            },
        });
    }

    const getLocation = () => {
        // navigation.navigate('Location')
        setLocationModalVisible(true);
    }

    const handleCategory = (name) => {
        navigation.navigate('Category', {
            itemDetail: {
                category: name,
            },
        });
    }

    return (
        <View keyboardShouldPersistTaps={'always'} style={styles.main}>
            {isLoader &&
                <Loader />
            }
            <View style={[styles.header, { marginTop: Platform.OS === 'ios' ? vh * 4 : 0 }]}>
                <TouchableOpacity onPress={() => getLocation()}>
                    <View style={{ flexDirection: 'row' }}>
                        <Icon name="location" style={{ fontSize: 5 * vh, color: 'grey' }} />
                        <View style={{ justifyContent: 'center' }}>
                            <Text style={{ fontSize: RFPercentage(2.5) }}>{appData && appData.vendorData && appData.vendorData.location && appData.vendorData.location.address ? appData.vendorData.location.address : "Please select a vendor"}</Text>
                        </View>
                    </View>
                </TouchableOpacity>
            </View>
            {isReady ? <>
                <ScrollView scrollEnabled={shouldScroll} keyboardShouldPersistTaps={'always'} style={styles.body}>
                    <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                        <View style={{ width: vw * 90, height: '100%' }}>
                            <View style={{ marginTop: 20, position: 'relative', zIndex: 9 }}>
                                <TouchableOpacity onPress={() => navigation.navigate("SearchScreen")} style={styles.inputBox}>
                                    <TextInput
                                        placeholder={"Search for food item"}
                                        style={[styles.input, { height: Platform.OS === 'ios' ? 50 : 50 }]}
                                        value = {tempVal}
                                        onFocus={() => navigation.navigate("SearchScreen")}
                                        onChange={setTempVal} 
                                    />
                                    <View style={{ justifyContent: 'center', position: 'absolute', right: 20, height: '100%', marginTop: 10 }}>
                                        <Icon name="search" style={{ fontSize: 4 * vh, color: '#aaa' }} />
                                    </View>
                                </TouchableOpacity>
                            </View>
                            <Text style={styles.heading}>Best Selling</Text>
                        </View>
                    </View>
                    <ScrollView horizontal={true}
                        showsHorizontalScrollIndicator={false}
                    >
                        {
                            categoryListItem.length > 0 &&
                            categoryListItem.map((item, i) => {
                                return <>
                                    {
                                        item.item_tag === "bestselling" &&

                                        <View key={item._id} style={{ marginLeft: vw * 5, marginRight: i == 4 ? vw * 5 : 0, width: vw * 60 }}>
                                            <TouchableOpacity onPress={() => handleClickItemDetail(item)} >
                                                <View style={{ width: '100%', height: 200 }}>
                                                    <Image
                                                        style={{ width: '100%', height: '100%', borderRadius: 10, resizeMode: 'stretch' }}
                                                        source={{ uri: `${item.image_url[0]}` }}
                                                        resizeMode="cover"
                                                    />
                                                </View>
                                            </TouchableOpacity>
                                            <View style={{ flexDirection: 'row', marginTop: vh * 0.5, justifyContent: 'space-between', flexWrap: 'wrap' }}>
                                                <View style={{ width: '55%' }}>
                                                    <Text style={{ fontWeight: 'bold', fontSize: RFPercentage(2.2), flex: 1, flexWrap: 'wrap', width: '100%' }}>{item.name}</Text>
                                                    <Text style={{ color: '#a0a0a0' }}>{item.packaging_type}</Text>
                                                    <Text style={{ fontWeight: 'bold', }}>₹ {item.price}</Text>
                                                </View>
                                                <View style={{ justifyContent: 'center', width: '45%' }}>
                                                    <Add key={item._id} paddingRight={30} minusClicked={() => minusClicked(item)} plusClicked={() => plusClicked(item)} items={appData} countPos={0} itemId={item._id} />
                                                </View>
                                            </View>
                                        </View>
                                    }
                                </>
                            })
                        }
                    </ScrollView>
                    <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                        <View style={{ width: vw * 90, height: '100%' }}>
                            <Text style={{ fontSize: RFPercentage(3.27), fontWeight: 'bold', marginTop: vh * 2 }}>Explore by category</Text>
                            <Text style={{ color: '#a0a0a0' }}>Everything we have.Everything you need</Text>
                        </View>
                    </View>
                    <ScrollView horizontal={true}
                        showsHorizontalScrollIndicator={false}
                    >
                        {
                            categoryList.length > 0 &&
                            categoryList.map((item, i) => {
                                return <>
                                    <TouchableOpacity onPress={() => handleCategory(item.name)}>
                                        <View style={{ marginLeft: vw * 6, marginRight: i == 4 ? vw * 5 : 0 }}>
                                            <View style={{ marginTop: vh * 2 }}>
                                                <Image
                                                    style={{ width: 100, height: 130, borderRadius: 15, resizeMode: 'stretch' }}
                                                    source={{ uri: `${item.image}` }}
                                                    resizeMode="cover"
                                                />
                                            </View>
                                            <View style={{ flexDirection: 'row', marginTop: vh * 0.5, justifyContent: 'space-between' }}>
                                                <View>
                                                    <Text style={{ fontWeight: 'bold', color: '#575757' }}>
                                                        {item.name}
                                                    </Text>
                                                </View>
                                                <View style={{ justifyContent: 'center' }}>

                                                </View>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                </>
                            })
                        }
                    </ScrollView>
                    <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                        <View style={{ width: vw * 90, height: '100%' }}>
                            <Text style={styles.heading}>Quality Check</Text>
                        </View>
                    </View>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 140 }}>
                        {qualityCheck.map((qa, i) => {
                            return <View style={{ marginLeft: vw * 5, marginRight: i == 4 ? vw * 5 : 0 }}>
                                <View style={styles.SquareShapeView} >
                                    <Text style={{ textAlign: 'left' }}>{qa.text}</Text>
                                    <View style={{justifyContent:'flex-end',flexDirection:'row'}}>
                                        <Image
                                            source={qa.img}
                                            style={styles.qaImg}
                                        />
                                    </View>
                                    <View style={styles.number}>
                                        <Text style={{ fontSize: RFPercentage(2), textAlign: 'center', color: '#fff' }}>{i + 1}</Text>
                                    </View>
                                </View>
                            </View>
                        })}
                    </ScrollView>
                </ScrollView>
                <View style={{ position: 'absolute', top: height - 115, width: width }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                        <View style={styles.footer}>
                            <BottomMenu activeScreen="Order" cartItems={cartItems} navigation={navigation} />
                        </View>
                    </View>
                </View>
            </>
                :
                <View style={{ width: width, height: height, justifyContent: 'center' }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                        <TouchableOpacity onPress={() => setLocationModalVisible(true)}>
                            <Text style={{ color: '#f04c4c' }}>Please select a vendor</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            }
            <Modal
                animationType="slide"
                transparent={false}
                visible={locationModalVisible}
                onRequestClose={() => {
                    setLocationModalVisible(false);
                }}
            >
                <Location setNewVendor={setNewVendor} setLocationModalVisible={setLocationModalVisible} />
            </Modal>

        </View >
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
    heading: {
        marginTop: vh * 1.5,
        marginBottom: vh * 1.5,
        fontSize: RFPercentage(3.27),
        fontWeight: 'bold'
    },
    SquareShapeView: {
        width: 150,
        height: 180,
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 10,
        borderWidth: 1,
        borderColor: '#ddd',
        position: 'relative'
    },
    number: {
        position: 'absolute',
        left: 15,
        bottom: 15,
        backgroundColor: '#d0804b',
        // padding: 8,
        height: 25,
        width: 25,
        // flexDirection:'row',
        justifyContent: 'center',
        borderRadius: 50,
    },
    inputBox: {
        padding: 7,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 20,
        flexDirection: 'row',
        position: 'relative',
    },
    input: {
        fontSize: RFPercentage(3),
        borderColor: '#ccc',
        borderRadius: 20,
        width: '100%'
    },
    qaImg: {
        width: '75%',
        height: 100,
    }
})
