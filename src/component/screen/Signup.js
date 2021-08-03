import React, { Component, useState, useEffect } from 'react';
import { StyleSheet,Alert, Text, View, Platform,Modal, TouchableOpacity, ScrollView, ImageBackground, Image, Dimensions } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import FeatherIcon from 'react-native-vector-icons/Feather';
import AntDesignIcon from 'react-native-vector-icons/Feather';
import Loader from '../common/Loader'
import OtpInput from '../common/OtpInput'
import CustomInput from '../common/CustomInput'
import Title from '../common/Title'
import CustomButton from '../common/CustomButton'
import axios from 'react-native-axios';

import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

const { width, height } = Dimensions.get('window');
const baseUrl = 'https://vendor.greenchickchopindia.com:3000/'

const vw = Dimensions.get('window').width / 100;
const vh = Dimensions.get('window').height / 100;


export default function Login({ navigation }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [cPassword, setCpassword] = useState('');
    const [errorMesg, setErrorMesg] = useState('');
    const [isLoader, setIasLoader] = useState(false);
    const [userId, setUserId] = useState('');
    const [modalVisible, setModalVisible] = useState(false);

    const btnAction = () => {
        if (validateName(name)) {
            if (validateEmail(email)) {
                if (validatePhone(phone)) {
                    if (validatePassword(password)) {
                        if (validatecPassword(password, cPassword)) {
                            setIasLoader(true);
                            axios.post(`${baseUrl}chop/user`, {
                                name: name,
                                email: email,
                                mobile: phone,
                                password: password,
                                scope: "CUSTOMER"
                            })
                                .then(async (response) => {
                                    if (response.data.success) {
                                        console.log(response)
                                        setIasLoader(false);
                                        await setUserId(response.data.result.result.userId)
                                        await setModalVisible(true)
                                        // navigation.navigate('Login')
                                    } else {
                                        setIasLoader(false);
                                        setErrorMesg(response.data.result.error ? response.data.result.error : "Something went wrong !!!")
                                    }
                                })
                                .catch(function (error) {
                                    setErrorMesg(error ? error : "Something went wrong !!!")
                                    setIasLoader(false);
                                    console.log(error);
                                });
                        }
                    }
                }
            }
        }
    }

    const resendOtp = async () => {
        axios.post(`${baseUrl}chop/user/retry-otp`, {
            mobile: phone,
        })
            .then(async (response) => {
                if (response.data.success) {
                    alert("OTP is sent to your mobile number")
                } else {
                    alert("Something went wrong !!!")
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    const validate = (val, name) => {
        if (val == "" || val == null) {
            setErrorMesg("Please Enter " + name)
        } else {
            return true;
        }
    }

    const validateName = (val) => {
        if (validate(val, "Name")) {
            var regx = /^[a-zA-Z ]{2,30}$/;
            if (!regx.test(val)) {
                setErrorMesg("Please Enter Valid Name")
            }
            return regx.test(val);
        } else { return false; }
    }
    const validateEmail = (val) => {
        if (validate(val, "Email")) {
            var regx = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            if (!regx.test(val)) {
                setErrorMesg("Please Enter Valid Email")
            }
            return regx.test(val);
        } else { return false; }
    }
    const validatePhone = (val) => {
        if (validate(val, "Phone")) {
            var regx = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
            if (!regx.test(val)) {
                setErrorMesg("Please Enter Valid Phone Number")
            }
            return regx.test(val);
        } else { return false; }
    }
    const validatePassword = (val) => {
        if (validate(val, "Password")) {
            var regx = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;
            if (!regx.test(val)) {
                setErrorMesg("Please Enter Valid Password With One Small, Capital, Numeric and Special Character")
            }
            return regx.test(val);
        } else { return false; }
    }
    const validatecPassword = (pass, cpass) => {
        if (validate(cpass, "Confirm Password")) {
            if (cpass == pass) {
                return true;
            } else {
                setErrorMesg("Password and Confirm Password Doesn't Match")
                return false;
            }
        } else { return false; }
    }

    const onBackPress = () => {
        Alert.alert(
            "Warning !!!",
            "Are you sure want to go back ?",
            [
                {
                    text: "No",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
                { text: "Yes", onPress: () => setModalVisible(!modalVisible) }
            ],
            { cancelable: false }
        );
    }

    return (
        <ScrollView style={styles.main}>
            {isLoader &&
                <Loader />
            }
            <View>
                <Image
                    source={require('../../assets/Signup.png')}
                    style={{
                        width: "100%",
                        // height: vh * 40,
                        maxHeight: vh * 40,
                        resizeMode: 'cover',
                        // position:'relative'
                    }}
                />
            </View>

            <ScrollView style={styles.bottomBox}>
                <View style={styles.bottomScroll}>
                    <View style={styles.inputContainer}>

                        <View style={{ marginBottom: vh * 4 }}>
                            <Title text={"Create an account"} titleStyle={styles.titleStyle} titleContainer={styles.titleContainer} />
                        </View>

                        <CustomInput isIcon={true}
                            Icon={<FeatherIcon name="user" style={{ fontSize: 3 * vh, color: 'grey' }} />}
                            secureTextEntry={false}
                            placeHolder={'Full Name'}
                            inputType={"default"}
                            action={setName} />

                        <CustomInput isIcon={true}
                            Icon={<Icon name="email-outline" style={{ fontSize: 3 * vh, color: 'grey' }} />}
                            secureTextEntry={false}
                            placeHolder={'E-Mail'}
                            autoCapitalize = {'none'}
                            inputType={"default"}
                            action={setEmail} />

                        <CustomInput isIcon={true}
                            Icon={<AntDesignIcon name="phone" style={{ fontSize: 3 * vh, color: 'grey' }} />}
                            secureTextEntry={false}
                            placeHolder={'Phone Number'}
                            inputType={"numeric"}
                            action={setPhone} />

                        <CustomInput isIcon={true}
                            Icon={<FeatherIcon name="lock" style={{ fontSize: 3 * vh, color: 'grey' }} />}
                            secureTextEntry={true}
                            placeHolder={'Password'}
                            inputType={"default"}
                            action={setPassword} />

                        <CustomInput isIcon={true}
                            Icon={<FeatherIcon name="lock" style={{ fontSize: 3 * vh, color: 'grey' }} />}
                            secureTextEntry={true}
                            placeHolder={'Confirm Password'}
                            inputType={"default"}
                            action={setCpassword}
                        />

                        <Text style={{ color: "#f04c4c", alignItems: 'center' }}>{errorMesg}</Text>

                        <View style={{ marginTop: vh * 4 }}>
                            <CustomButton enabled={true} btnAction={btnAction} btnWidth={82} text={"Sign up"} />
                        </View>
                        <View style={{ marginTop: vh * 4 }}>
                            <Text style={{ fontSize: RFPercentage(2.2), color: '#a0a0a0' }}>Already have an account ? </Text>
                            <Text style={{ fontWeight: 'bold', fontSize: RFPercentage(2.2), color: '#494949' }}
                                onPress={() => navigation.navigate('Login')}>Login</Text>
                        </View>

                    </View>
                </View>

                <Modal
                    animationType="slide"
                    transparent={false}
                    visible={modalVisible}
                    onRequestClose={() => {
                        onBackPress();
                    }}
                >
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <Text style={styles.modalText}>Please Enter OTP</Text>
                            <OtpInput navigation={navigation} email={email} userId={userId} mobile={phone} otpLength={4} />
                            <TouchableOpacity
                                onPress={() => {
                                    resendOtp()
                                }}
                            >
                                <Text style={{ color: '#f04c4c', marginTop: 10, textAlign: 'right', width: vw * 80 }}>Resend Otp</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>

            </ScrollView>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    main: {
        backgroundColor: '#fff',
        height: height,
        width: width,
    },
    bottomBox: {
        width: width,
        minHeight: 200,
        marginTop: -40,
        borderTopRightRadius: 40,
        borderTopLeftRadius: 40,
        // position: 'absolute',
        // bottom: 0,
        backgroundColor: '#fff',

    },
    bottomScroll: {
        flexDirection: 'row',
        justifyContent: 'center'
    },
    inputContainer: {
        width: vw * 80,
        paddingTop: vh * 5,
        paddingBottom: vh * 5,
    },
    titleStyle: {
        fontWeight: 'bold',
        fontSize: RFPercentage(3.5)
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
    },
    modalView: {
        margin: 30,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 30,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5
    },
    openButton: {
        backgroundColor: "#F194FF",
        borderRadius: 10,
        padding: 10,
        marginTop: 30,
        elevation: 2
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    },
    modalText: {
        marginBottom: 30,
        textAlign: "center"
    }
})
