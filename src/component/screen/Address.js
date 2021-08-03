import React, { Component, useState, useEffect } from 'react';
import { StyleSheet, Alert, Text, Platform, View, Modal, TouchableOpacity, ScrollView, ImageBackground, Image, Dimensions } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import FeatherIcon from 'react-native-vector-icons/Feather';
import AntDesignIcon from 'react-native-vector-icons/Feather';
import IonIcon from 'react-native-vector-icons/Ionicons';
import Loader from '../common/Loader'
import OtpInput from '../common/OtpInput'
import CustomInput from '../common/CustomInput'
import Title from '../common/Title'
import CustomButton from '../common/CustomButton'
import axios from 'react-native-axios';
import { HomeServices } from '../../Services/Home.services';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import BottomMenu from '../common/BottomMenu'
import { RadioButton } from 'react-native-paper';

const { width, height } = Dimensions.get('window');

const vw = Dimensions.get('window').width / 100;
const vh = Dimensions.get('window').height / 100;
const baseUrl = 'https://vendor.greenchickchopindia.com:3000/'

const homeServices = new HomeServices()
export default function Address({ navigation }) {
    const [address, setAddress] = React.useState("")
    const [state, setState] = React.useState("")
    const [appData, setAppData] = React.useState({});
    const [isLoader, setIasLoader] = React.useState(false);
    const [city, setCity] = React.useState("")
    const [pincode, setPincode] = React.useState("")
    const [landmark, setLandmark] = React.useState("")
    const [errorMesg, setErrorMesg] = React.useState("")
    const [addresses, setAddresses] = React.useState([])
    const [userData, setUserData] = useState({});
    const [userAddress, setUserAddress] = useState({});
    const [isAddAddress, setIsAddAddress] = useState(true);
    const [timeSlotModal, setTimeSlotModal] = useState(false);
    const [timeSlots, setTimeSlots] = useState([]);
    const [slotTime, setSlotTime] = useState([]);
    const [time, setTime] = useState([]);
    const [date, setDate] = useState([]);
    const [checked, setChecked] = React.useState("")
    const [totalPrice, setTotalPrice] = React.useState(0)
    const [cartItems, setCartItems] = React.useState(Math.random());
    const [isDisabledAddress, setIsDisabledAddress] = React.useState(true);

    useEffect(() => {
        getDataAlert();
        setIasLoader(true);
        getUser();
        getAddress();
    }, []);

    var getDataAlert = async () => {
        try {
            const value = await navigation.getParam("itemDetail");
            if (value !== null) {
                setTotalPrice(value.totalPrice);
                setAppData(value.appData);
                setIsDisabledAddress(false)
            } else {
                setIsDisabledAddress(true)
            }
        } catch (e) {
            // error reading value
        }
    }


    const addAddress = async () => {
        var dataObj = {
            address: address,
            city: city,
            landmark: landmark ? landmark : '',
            pin_code: pincode,
            state: state,
        }
        homeServices.setUserAddress(dataObj).then(
            async (data) => {
                console.log(data)
                if (data.result && data.result.result) {
                    setIsAddAddress(false)
                    setIasLoader(false)
                    getAddress()
                } else {
                    setIasLoader(false)
                }
            },
            (error) => {
                console.log("error.response.status", error);
            }
        );
    }

    const getAddress = () => {
        homeServices.getUserAddress().then(
            async (data) => {
                if (data.result && data.result.result && data.result.result.length && data.result.result.length > 0) {
                    setIsAddAddress(false)
                    setIasLoader(false)
                    setAddresses(data.result.result)
                } else {
                    setIasLoader(false)
                }
            },
            (error) => {
                console.log("error.response.status", error);
            }
        );
    }

    const getUser = () => {
        homeServices.getUserDetails().then(async (data) => {
            var response = JSON.parse(data)
            if (response.success) {
                // setIasLoader(false)
                setUserData(response.result.result)
            }
        },
            (error) => {
                // setIasLoader(false)
                console.log("error.response.status", error);
            }
        );
    }

    const getDate = (d) => {
        var d = new Date(d);
        var month = parseInt(d.getUTCMonth()) + 1;
        month = `${month}`;
        month = month.length < 2 ? `0${month}` : month;
        var date = `${d.getUTCDate()}`;
        date = date.length < 2 ? `0${date}` : date;
        return d.getUTCFullYear() + "-" + month + "-" + date;
    }

    const getCurrentFIveDays = () => {
        var array = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
        var dateArray = [];
        array.map((x, i) => {
            var today = new Date();
            var requiredDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + x)
            dateArray.push(getDate(requiredDate))
        })
        return dateArray;
    }

    const handleAddress = (val) => {
        setUserAddress(val);
        homeServices.getTimeSlot().then(async (data) => {
            // var response = JSON.parse(data)
            if (data) {
                var dates = getCurrentFIveDays();
                data.result.map((item, i) => {
                    item.delivery_date = dates[i];
                })
                setTimeSlots(data.result)

                setTimeSlotModal(true);
            }
        },
            (error) => {
                // setIasLoader(false)
                console.log("error.response.status", error);
            }
        );
    }

    const handleSlotDate = (val) => {
        setDate(val)
        setSlotTime(val.delivery_time_slot);
        setTime({})
        setChecked("")
    }
    function isEmpty(obj) {
        if (obj == null) return true;
        if (obj.length > 0) return false;
        if (obj.length === 0) return true;
        if (typeof obj !== "object") return true;
        for (var key in obj) {
            if (hasOwnProperty.call(obj, key)) return false;
        }
        return true;
    }

    const getTime = (time) => {
        var startTime = correctFormat(time.start_time);
        var endTime = correctFormat(time.end_time);
        return tConvert(startTime) + " TO " + tConvert(endTime)
    }
    function correctFormat(t) {
        t = t.split(":");
        if (t[0].length == 1) {
            t[0] = "0" + t[0];
        }
        return t.join(":");
    }

    function tConvert(t) {
        var time = t.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [t];
        if (time.length > 1) { // If time format correct
            time = time.slice(1);  // Remove full string match value
            time[5] = +time[0] < 12 ? ':AM' : ':PM'; // Set AM/PM
            time[0] = +time[0] % 12 || 12; // Adjust hours
        }
        time = time.join(''); // return adjusted time or original string
        time = time.split(":");
        time = time[0] + " " + time[time.length - 1];
        return time
    }

    const buy = () => {

        var data = {
            itemPayload: appData.vendorData.orderData,
            selectedAddress: { address: userAddress.address, city: userAddress.city, pincode: userAddress.pin_code, state: userAddress.state },
            delieveryDate: date.delivery_date,
            delieveryTime: { startTime: time.start_time, endTime: time.end_time },
            modeOfPayment: checked,
            totalCost: totalPrice
        }
        // console.log(appData.vendorData.location.user_id._id)
        homeServices.buyItem(data, appData.vendorData.location.user_id._id).then(async (data) => {
            // var response = JSON.parse(data)
            if (data.success) {
                alert("Order placed successfully")
                resetOrders()
                setTimeSlotModal(false)
                navigation.navigate("Orders")
            }
        },
            (error) => {
                // setIasLoader(false)
                console.log("error.response.status", error);
            }
        );
    }

    const resetOrders = () => {
        homeServices.getOrderDetails().then(
            async (data) => {
                data.vendorData.orderData = [];
                setAppData(data)
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

    const checkAvailability = (time) => {
        var startTime = time.start_time;
        var selectedDate = new Date(date.delivery_date);
        var today = new Date();
        var n = today.getTime();
        today.setHours(0, 0, 0, 0);
        selectedDate.setHours(0, 0, 0, 0);
        // console.log(today)
        if (Date.parse(selectedDate) > Date.parse(today) || Date.parse(selectedDate) == Date.parse(today)) {
            // console.log("here")
            return false;
        } else {
            return false;
        }
    }

    return (
        <View style={styles.main}>
            {isLoader ? <Loader />
                : <>
                    <View style={[styles.header, { marginTop: Platform.OS === 'ios' ? vh * 4 : 0 }]}>
                        <View style={{ marginLeft: 10, height: '100%', flexDirection: 'row' }}>
                            <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
                                <IonIcon name="chevron-back" style={{ fontSize: RFPercentage(4), color: '#000' }} />
                            </TouchableOpacity>
                            <View>
                                <Text style={{ fontSize: RFPercentage(3.3), fontWeight: 'bold' }}>Address</Text>
                            </View>
                        </View>
                    </View>
                    <ScrollView style={styles.body}>
                        {isAddAddress ?
                            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                                <View style={{ width: vw * 75 }}>
                                    <View style={{ marginBottom: vh * 4 }}>
                                        <Title text={"Add Address"} titleStyle={styles.titleStyle} titleContainer={styles.titleContainer} />
                                    </View>

                                    <CustomInput isIcon={true}
                                        Icon={<FeatherIcon name="user" style={{ fontSize: 3 * vh, color: 'grey' }} />}
                                        secureTextEntry={false}
                                        placeHolder={'Enter Address'}
                                        inputType={"default"}
                                        action={setAddress}
                                    />

                                    <CustomInput isIcon={true}
                                        Icon={<Icon name="email-outline" style={{ fontSize: 3 * vh, color: 'grey' }} />}
                                        secureTextEntry={false}
                                        placeHolder={'State'}
                                        autoCapitalize={'none'}
                                        inputType={"default"}
                                        action={setState}
                                    />

                                    <CustomInput isIcon={true}
                                        Icon={<AntDesignIcon name="phone" style={{ fontSize: 3 * vh, color: 'grey' }} />}
                                        secureTextEntry={false}
                                        placeHolder={'City'}
                                        inputType={"default"}
                                        action={setCity}
                                    />

                                    <CustomInput isIcon={true}
                                        Icon={<FeatherIcon name="lock" style={{ fontSize: 3 * vh, color: 'grey' }} />}
                                        secureTextEntry={false}
                                        placeHolder={'Pin code'}
                                        inputType={"numeric"}
                                        action={setPincode}
                                    />

                                    <CustomInput isIcon={true}
                                        Icon={<FeatherIcon name="lock" style={{ fontSize: 3 * vh, color: 'grey' }} />}
                                        secureTextEntry={false}
                                        placeHolder={'Landmark'}
                                        inputType={"default"}
                                        action={setLandmark}
                                    />

                                    <Text style={{ color: "#f04c4c", alignItems: 'center' }}>{errorMesg}</Text>

                                    <View style={{ marginTop: vh * 4 }}>
                                        <CustomButton enabled={true} btnAction={() => addAddress()} btnWidth={82} text={"Done"} />
                                    </View>
                                </View>
                            </View>
                            : <View style={{ flexDirection: 'row', justifyContent: 'center', paddingBottom: 120 }}>
                                <View style={{ width: vw * 75 }}>{addresses && addresses.map((x) => {
                                    return <TouchableOpacity disabled={isDisabledAddress} onPress={() => handleAddress(x)} style={styles.address}>
                                        <Text>{userData.name}</Text>
                                        <Text>{x.address}</Text>
                                        <Text>{x.state},{x.city}</Text>
                                        <Text>Landmark: {x.landmark}</Text>
                                    </TouchableOpacity>
                                })}
                                    <View style={{ marginTop: 10 }}>
                                        <CustomButton enabled={true} btnAction={() => setIsAddAddress(true)} btnWidth={50} text={"Add"} />
                                    </View>
                                </View>
                            </View>
                        }
                    </ScrollView>
                    <View style={{ position: 'absolute', top: height - 115, width: width }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                            <View style={styles.footer}>
                                <BottomMenu activeScreen="Profile" cartItems={cartItems} navigation={navigation} />
                            </View>
                        </View>
                    </View>
                </>}
            <Modal
                animationType="slide"
                transparent={false}
                visible={timeSlotModal}
                onRequestClose={() => {
                    setTimeSlotModal(false);
                }}
            >
                <ScrollView>
                    <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                        <View style={styles.modalView}>
                            <View style={{ marginTop: 40, flexDirection: 'row', justifyContent: 'space-between' }}>
                                <TouchableOpacity onPress={() => setTimeSlotModal(false)}>
                                    <Icon name="keyboard-backspace" style={{ fontSize: RFPercentage(4), color: '#000' }} />
                                </TouchableOpacity>
                                <Text style={{ fontSize: RFPercentage(3), paddingRight: 20, textAlign: 'center' }}>Choose a delivery time</Text>
                            </View>
                            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                                {timeSlots && timeSlots.length > 0 && timeSlots.map((item, i) => {
                                    return <TouchableOpacity onPress={() => handleSlotDate(item)} style={[styles.timeSlotDate, { backgroundColor: date._id == item._id ? "#f04c4c" : '#fff', }]}>
                                        <Text style={{ width: '100%', textAlign: 'center', color: date._id == item._id ? "#fff" : '#000' }}>{item.delivery_date != '' ? item.delivery_date : 'NA'}</Text>
                                    </TouchableOpacity>
                                })}
                            </View>
                            <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 20 }}>
                                {slotTime && slotTime.length > 0 && slotTime.map((item, i) => {
                                    return <TouchableOpacity disabled={checkAvailability(item)} onPress={() => setTime(item)} style={[styles.timeSlotDate, { backgroundColor: time._id == item._id ? "#f04c4c" : '#fff', }]}>
                                        <Text style={{ width: '100%', textAlign: 'center', color: time._id == item._id ? "#fff" : '#000' }}>{getTime(item)}</Text>
                                    </TouchableOpacity>
                                })}
                            </View>
                            {!isEmpty(time) && <View style={{ marginTop: 20 }}>
                                <Text style={{ fontSize: RFPercentage(3) }}>Payment</Text>
                                <RadioButton.Group >
                                    <View style={{ flexDirection: 'row' }}>
                                        <RadioButton style={{ color: '#000' }} status={checked === 'Cash On Delivery' ? 'checked' : 'unchecked'} value="Cash On Delivery" onPress={() => setChecked('Cash On Delivery')} />
                                        <View style={{ justifyContent: 'center' }}>
                                            <TouchableOpacity onPress={() => setChecked('Cash On Delivery')}>
                                                <Text>Cash On Delivery</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </RadioButton.Group>
                            </View>
                            }
                            {checked != "" &&
                                <View style={{ marginTop: 10, flexDirection: 'row', justifyContent: 'center' }}>
                                    <TouchableOpacity style={styles.btn} onPress={() => buy()}>
                                        <Text style={{ color: '#fff', fontSize: RFPercentage(2.5), padding: 15, textAlign: 'center' }}>Buy</Text>
                                    </TouchableOpacity>
                                </View>
                            }
                        </View>
                    </View>
                </ScrollView>
            </Modal>
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
        // borderBottomWidth: 1,
        padding: 10,
        // flexDirection: 'row',
        // justifyContent: 'center'
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
    address: {
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 10,
        marginBottom: 10
    },
    modalView: {
        // flexDirection: 'row',
        // justifyContent: 'space-between',
        height: '100%',
        width: vw * 90,
        // flexWrap: 'wrap'
    },
    timeSlotDate: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 7,
        padding: 10,
        // width:vw*28,
        marginLeft: 10,
        marginTop: 10
    },
    btn: {
        backgroundColor: '#f04c4c',
        borderRadius: 20,
        width: vw * 50
    },
})
