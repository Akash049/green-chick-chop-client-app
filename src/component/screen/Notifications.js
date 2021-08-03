import React from 'react'
import { StyleSheet, Text, View, ScrollView,Platform, ImageBackground, TouchableOpacity, Image, Dimensions } from 'react-native'
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import AntIcon from 'react-native-vector-icons/AntDesign';
import FaIcon from 'react-native-vector-icons/FontAwesome';
import CustomButton from '../common/CustomButton'
import BottomMenu from '../common/BottomMenu'

import Title from '../common/Title'
import Notification from '../common/Notification'

const { width, height } = Dimensions.get('window');

const vw = Dimensions.get('window').width / 100;
const vh = Dimensions.get('window').height / 100;

export default function Notifications({ navigation }) {
    return (
        <View style={styles.main}>
            <View style={[styles.header,{marginTop: Platform.OS === 'ios' ? vh*4 : 0}]}>
                <View style={{ marginLeft: 10, justifyContent: 'center', height: '100%' }}>
                    <Text style={{ fontSize: RFPercentage(3.3), fontWeight: 'bold' }}>Notifications</Text>
                </View>
            </View>
            <ScrollView style={styles.body}>
                {Array.from(Array(3), (e, i) => {
                    return <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: i == 3 ? 115 : 0 }}>
                        <View style={{ width: vw * 90, height: '100%',marginRight:vw*4 }}>
                            <View style={{ marginTop: 10 }}>
                                <Notification
                                    navigation={navigation}
                                    img={require('../../assets/ScrollImage.png')}
                                    status={
                                        <Text style={{ fontWeight: 'bold', fontSize: RFPercentage(2.2) ,color:'#4a4a4a'}}>Your order is almost here... </Text>
                                    }
                                    mesg={
                                        <Text style={{ fontWeight: 'bold', fontSize: RFPercentage(2.2) ,color:'#4a4a4a'}}>Please pay <Text style={{ fontWeight: 'bold', color: '#f04c4c', fontSize: RFPercentage(2.2),textAlign:'justify' }}> ₹ 490 cash</Text> & collect your order</Text>
                                    }
                                    time={'Today, 6:30 PM'}
                                />
                            </View>
                        </View>
                    </View>
                })}
            </ScrollView>
            <View style={{ position: 'absolute', top:height - 115, width: width }}>
                <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                    <View style={styles.footer}>
                        <BottomMenu activeScreen="Notifications" navigation={navigation} />
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
        marginTop: 10,
        marginBottom: 10,
        fontSize: RFPercentage(3.5),
        fontWeight: 'bold'
    }
})
