import React, { Component, useState, useEffect } from 'react';
import { StyleSheet, Alert, Text, View, ScrollView,Platform, ImageBackground, TouchableOpacity, Image, Dimensions, TextInput } from 'react-native'
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import AntIcon from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import CustomButton from '../common/CustomButton'
import BottomMenu from '../common/BottomMenu'
import Title from '../common/Title'
import CustomInput from '../common/CustomInput'
import ProfileBtn from '../common/ProfileBtn'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { HomeServices } from '../../Services/Home.services';
import Loader from '../common/Loader';
import Toast from 'react-native-simple-toast';

const { width, height } = Dimensions.get('window');
const vw = Dimensions.get('window').width / 100;
const vh = Dimensions.get('window').height / 100;
const homeServices = new HomeServices()
export default function Profile({ navigation }) {
    const [userData, setUserData] = useState({});
    const [isLoader, setIasLoader] = React.useState(false);
    const [isEdit, setIsEdit] = React.useState(false);
    const [name, setName] = React.useState("");
    const [phone, setNumber] = React.useState("");

    useEffect(() => {
        getUserDetails()
        setIasLoader(true)
    }, []);

    const getUserDetails = () => {
        homeServices.getUserDetails().then(async (data) => {
            var response = JSON.parse(data)
            if (response.success) {
                setIasLoader(false)
                setUserData(response.result.result)
                setName(response.result.result.name)
                setNumber(response.result.result.mobile)
            }
        },
            (error) => {
                setIasLoader(false)
                console.log("error.response.status", error);
            }
        );
    }

    const logOut = async () => {
        Alert.alert(
            "Logout",
            "Are you sure want to logout ?",
            [
                {
                    text: "No",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
                { text: "Yes", onPress: () => confirmLogout() }
            ],
            { cancelable: false }
        );
    }

    const confirmLogout = async () => {
        try {
            await AsyncStorage.removeItem('green_chick_chop_access_bearer_token')
            navigation.navigate("Login")
        } catch (e) {
            // remove error
        }
    }

    const openEditor = () => {
        setIsEdit(true);
    }

    const editProfile = () => {
        saveUserData();
        setIsEdit(false);
    }

    const saveUserData = () => {
        setIasLoader(true)
        var data = {
            mobile: phone,
            name: name
        }
        homeServices.updateUserDetails(data).then(async (data) => {
            if (data.success) {
                setIasLoader(false)
                Toast.show(data.result.result, Toast.SHORT);
            }
        },
            (error) => {
                setIasLoader(false)
                console.log("error.response.status", error);
            }
        );
    }

    return (
        <View style={styles.main} keyboardShouldPersistTaps={'always'}>
            {isLoader &&
                <Loader />
            }
            <View style={[styles.header,{marginTop: Platform.OS === 'ios' ? vh*4 : 0}]}>
                <View style={{ marginLeft: 10, justifyContent: 'space-between', height: '100%', flexDirection: 'row' }}>
                    <View>
                        <Text style={{ fontSize: RFPercentage(3.3), fontWeight: 'bold' }}>Profile</Text>
                    </View>
                    <TouchableOpacity onPress={() => openEditor()} style={{ marginTop: vh * 1 }}>
                        <Text style={{ color: '#a0a0a0', fontWeight: 'bold' }}>Edit</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <ScrollView style={styles.body} keyboardShouldPersistTaps={'always'}>
                <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                    <View style={{ width: vw * 90, height: '100%' }}>
                        <View style={{ marginTop: 20, flexDirection: 'row', justifyContent: 'center' }}>
                            <View>
                                <View style={styles.img}>
                                    <Image style={{ resizeMode: 'contain', width: '100%', height: '100%' }} source={require('../../assets/default_profile.png')} />
                                </View>
                                {!isEdit ? <View style={{ marginTop: 10 }}>
                                    <Text style={{ fontWeight: 'bold', fontSize: RFPercentage(2.5), textAlign: 'center' }}>
                                        {
                                            name && name
                                        }
                                    </Text>
                                    <Text style={{ fontSize: RFPercentage(2), textAlign: 'center' }}>{phone && phone}</Text>
                                </View>
                                    : <View>
                                        <TextInput style={{ textAlign: 'center', padding: 0,borderWidth:1,borderColor:'#ddd' }}
                                            secureTextEntry={false}
                                            value={name}
                                            inputType={"default"}
                                            onChangeText={setName} />

                                        <TextInput style={{ textAlign: 'center', padding: 0,borderWidth:1,borderColor:'#ddd' }}
                                            secureTextEntry={false}
                                            value={`${phone}`}
                                            inputType={"numeric"}
                                            onChangeText={setNumber} />
                                        <View>
                                            <TouchableOpacity onPress={() => editProfile()} >
                                                <Text style={{ marginTop: 10, color: '#f04c4c', textAlign: 'center', fontSize: RFPercentage(2.3) }}>Update</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                }
                            </View>
                        </View>
                        <Text style={{ fontWeight: 'bold', fontSize: RFPercentage(2.2) }}>My Account</Text>
                        <View style={{ marginTop: 15 }}>
                            <ProfileBtn
                                icon={<MaterialCommunityIcons name="cube-outline" style={{ fontSize: 3.2 * vh, color: '#f04c4c' }} />}
                                text={"Your Orders"}
                                screen={'Orders'}
                                navigation={navigation}
                            />
                        </View>
                        {/* <View style={{ marginTop: 15 }}>
                            <ProfileBtn
                                icon={<Feather name="credit-card" style={{ fontSize: 3 * vh, color: '#f04c4c' }} />}
                                text={"Payments"}
                                screen={'Order'}
                                navigation={navigation}
                            />
                        </View> */}
                        <View style={{ marginTop: 15 }}>
                            <ProfileBtn
                                icon={<Feather name="book" style={{ fontSize: 3 * vh, color: '#f04c4c' }} />}
                                text={"Address"}
                                screen={'Address'}
                                navigation={navigation}
                            />
                        </View>
                        {/* <View style={{ marginTop: 15 }}>
                            <ProfileBtn
                                icon={<Feather name="settings" style={{ fontSize: 3 * vh, color: '#f04c4c' }} />}
                                text={"Setting"}
                                screen={'Order'}
                                navigation={navigation}
                            />
                        </View> */}

                        <TouchableOpacity onPress={() => logOut()}>
                            <Text style={{ marginTop: 10, color: '#f04c4c', textAlign: 'center', fontSize: RFPercentage(2.3) }}>Logout</Text>
                        </TouchableOpacity>
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
    img: {
        width: 150,
        height: 150,
        borderWidth: 0.5,
        borderColor: '#000',
        padding: 10,
        borderRadius: 150 / 2
    }
})
