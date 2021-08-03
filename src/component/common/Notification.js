import React from 'react'
import { StyleSheet, Text, View, ScrollView, ImageBackground, TouchableOpacity, Image, Dimensions } from 'react-native'
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import AntIcon from 'react-native-vector-icons/AntDesign';
import FaIcon from 'react-native-vector-icons/FontAwesome';

const { width, height } = Dimensions.get('window');

const vw = Dimensions.get('window').width / 100;
const vh = Dimensions.get('window').height / 100;

export default function Notification({ navigation, img, status, mesg, time }) {
    return (
        <View style={{ width: '100%' }}>
            <View style={{ flexDirection: 'row' }}>
                <View style={{ justifyContent: 'center' }}>
                    <View style={{ width: 50, height: 50 }}>
                        <Image style={{ width: '100%', height: '100%', resizeMode: 'cover', borderRadius: 50 / 2 }} source={img} />
                    </View>
                </View>
                <View style={{ marginLeft: 20 }}>
                    <Text>{status}</Text>
                    <Text>{mesg}</Text>
                    <Text>{time}</Text>
                </View>
            </View>
            <View style={{justifyContent:'center',flexDirection:'row'}}>
                <View style={{ borderBottomWidth: 1,width:'85%', borderBottomColor: '#ddd', paddingBottom: 20 }}></View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({})
