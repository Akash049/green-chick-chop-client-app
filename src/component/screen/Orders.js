import React, { useEffect } from 'react'
import { StyleSheet, Text, View, ScrollView,Platform, TouchableOpacity, KeyboardAvoidingView, ImageBackground, Image, Dimensions } from 'react-native'
import FeatherIcon from 'react-native-vector-icons/Feather';
import BottomMenu from '../common/BottomMenu';
import Order from '../common/Order';

import CustomInput from '../common/CustomInput'
import Title from '../common/Title'
import CustomButton from '../common/CustomButton'
import Icon from 'react-native-vector-icons/Ionicons';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { HomeServices } from '../../Services/Home.services';

const { width, height } = Dimensions.get('window');

const vw = Dimensions.get('window').width / 100;
const vh = Dimensions.get('window').height / 100;

const homeServices = new HomeServices()

export default function Orders({ navigation }) {
    const [orderData, setOrderData] = React.useState({});
    useEffect(() => {
        getOrderData();
    }, []);

    const getOrderData = () => {
        homeServices.getOrdersDatas().then(
            (data) => {
                setOrderData(data.result.result);
            },
            (error) => {
                console.log("error.response.status", error);
            }
        );
    }

    const getOrderDate = (val) => {
        var today = new Date(val)
        var month = today.toLocaleString('default', { month: 'short' });
        var date = today.getDate();
        var year = today.getFullYear();


        return date + " " + month.split(" ")[1] + " " + year
    }

    const getDate = (d) => {
        var d = new Date(d);
        var month = parseInt(d.getUTCMonth()) + 1;
        month = `${month}`;
        month = month.length < 2 ? `0${month}` : month;
        return d.getUTCDate() + "-" + month + "-" + d.getUTCFullYear();
    }

    return (
        <View style={styles.main}>
            <View style={[styles.header,{marginTop: Platform.OS === 'ios' ? vh*4 : 0}]}>
                <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
                    <Icon name="chevron-back" style={{ fontSize: RFPercentage(4), color: '#000' }} />
                </TouchableOpacity>
            </View>
            <ScrollView style={styles.body}>
                <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                    <View style={{ width: vw * 90, height: '100%', paddingBottom: 120 }}>
                        <Text style={styles.heading}>Your Orders</Text>
                        {orderData && orderData.length > 0 && orderData.map((item, i) => {
                            return <View style={{ marginBottom: 20 }}>
                                <Text style={styles.dateLabel}>{getOrderDate(item.created_on)}</Text>
                                <View style={styles.orderBox}>
                                    <View>
                                        {item.orderItem && item.orderItem.length > 0 && item.orderItem.map((x, j) => {
                                            return <Order
                                                // img={require('../../assets/ScrollImage.png')}
                                                detail={"250 gm"}
                                                item={x.itemName}
                                                quantity={x.quantity}
                                            // price={200}
                                            />
                                        })}
                                    </View>
                                    <Text style={{ fontWeight: 'bold', textAlign: 'right', paddingRight: 18, marginTop: 5, fontSize: RFPercentage(2.5) }}>₹ {item.payment.amount}</Text>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 15, marginTop: 15, borderTopWidth: 1, borderTopColor: '#ddd' }}>
                                        <View style={{ justifyContent: 'center' }}>
                                            <Text style={styles.notes}>{item.delivery_status.status}</Text>
                                            {/* <Text style={{ color: '#aaa' }}>{getDate(item.delivery_date)}</Text> */}
                                        </View>
                                        <View style={{ justifyContent: 'center' }}>
                                            <Text style={{ color: '#aaa' }}>{getDate(item.delivery_date)}</Text>
                                        </View>
                                        {/* <View style={{ justifyContent: 'center' }}>
                                            <Icon name="chevron-forward" style={{ fontSize: RFPercentage(4), color: '#000' }} />
                                        </View> */}
                                    </View>
                                </View>
                            </View>
                        })}
                    </View>
                </View>
            </ScrollView>
            <View style={{ position: 'absolute', top: height - 115, width: width }}>
                <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                    <View style={styles.footer}>
                        <BottomMenu activeScreen="Profile" navigation={navigation} />
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
        // marginTop: vh * 1.5,
        marginBottom: 20,
        fontSize: RFPercentage(3.5),
        fontWeight: 'bold'
    },
    dateLabel: {
        color: '#aaa',
        marginBottom: 5
    },
    orderBox: {
        borderColor: "#ddd",
        borderWidth: 1,
        borderRadius: 30,
        // padding: 15
    },
    notes: {
        color: "#4cb651",
        fontSize: RFPercentage(2.5)
    }
})
