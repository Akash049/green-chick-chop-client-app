import React from 'react'
import { StyleSheet, Text, View, ScrollView, ImageBackground, TouchableOpacity, Image, Dimensions } from 'react-native'
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import AntIcon from 'react-native-vector-icons/AntDesign';
import FaIcon from 'react-native-vector-icons/FontAwesome';

const { width, height } = Dimensions.get('window');

const vw = Dimensions.get('window').width / 100;
const vh = Dimensions.get('window').height / 100;

export default function Order({ navigation, img, detail, item, price, quantity }) {
    return (
        <View style={{ width: '100%',padding:15,paddingBottom:0 }}>
            <View style={{ flexDirection: 'row' }}>
                <View style={{ justifyContent: 'center', width: '10%' }}>
                    <View style={{ width: 50, height: 50 }}>
                        <Image style={{ width: '100%', height: '100%', resizeMode: 'cover', borderRadius: 50 / 2 }} source={img} />
                    </View>
                </View>
                <View style={{ marginLeft: 30, flexDirection: 'row', justifyContent: 'space-between',width: '80%' }}>
                    <View style={{ justifyContent: 'center' }}>
                        <Text style={{ fontWeight: 'bold', fontSize: RFPercentage(2.5) }}>{item}</Text>
                        {/* <Text>{detail}</Text> */}
                    </View>
                    <View style={{ justifyContent: 'center' }}>
                        <Text style={{ fontSize: RFPercentage(2), color: '#000' }}>
                            <AntIcon name="close" style={{ fontSize: RFPercentage(2), color: '#000' }} />
                            {quantity}
                        </Text>
                    </View>
                    <View style={{ justifyContent: 'center' }}>
                        {/* <Text>₹ {price}</Text> */}
                    </View>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({})
