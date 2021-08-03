import React, { Component, useState, useEffect } from 'react';
import { StyleSheet, Text, BackHandler, View,Platform, ScrollView, KeyboardAvoidingView, ImageBackground, Image, Dimensions } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import FeatherIcon from 'react-native-vector-icons/Feather';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomInput from '../common/CustomInput'
import Loader from '../common/Loader'
import Title from '../common/Title'
import CustomButton from '../common/CustomButton'
import axios from 'react-native-axios';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { TouchableOpacity } from 'react-native-gesture-handler';
import { authServices } from "../../Services/Auth";

const baseUrl = 'https://vendor.greenchickchopindia.com:3000/'
const { width, height } = Dimensions.get('window');

const vw = Dimensions.get('window').width / 100;
const vh = Dimensions.get('window').height / 100;


export default function Login({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoader, setIasLoader] = useState(false);
    const [isOtpSent, setIsOtpSent] = useState(false);
    const [isOtpLogin, setIsOtpLogin] = useState(true);
    const [errorMesg, setErrorMesg] = useState('');
    const [phone, setMobile] = useState('');
    const [otp, setOtp] = useState('');


    useEffect(() => {
    }, []);

    const btnAction = () => {
        navigation.navigate('Signup')
    }

    const login = () => {
        if (validateEmail(email)) {
            setIasLoader(true);
            setErrorMesg("")
            var user = {
                email: email,
                password: password,
            };
            authServices.userLogin(user)
                .then(async (data) => {
                    if (data.success) {
                        setIasLoader(false);
                        if (data && data.result && data.result.result && data.result.result.token) {
                            try {
                                await AsyncStorage.setItem("green_chick_chop_access_bearer_token", data.result.result.token);
                                navigation.navigate('Home')
                            } catch (e) {
                                setErrorMesg("Something went wrong !!! ")
                                // saving error
                            }
                        }
                    } else {
                        setIasLoader(false);
                        setErrorMesg("Email or Password is wrong !!!")
                    }
                })
                .catch(function (error) {
                    setIasLoader(false);
                    console.log(error);
                });
        }
    }

    const otpLogin = () => {
        setIasLoader(true);
        axios.post(`${baseUrl}chop/user/mobile-login`, {
            phoneNumber: phone,
            otp: otp
        })
            .then(async (response) => {
                console.log('@@@ OTP LOGIN RESPONSE ============', response);
                setIasLoader(false);
                if (response.data.success) {
                    if (response.data && response.data.result && response.data.result.result && response.data.result.result.token) {
                        try {
                            await AsyncStorage.setItem("green_chick_chop_access_bearer_token", response.data.result.result.token);
                            navigation.navigate('Home')
                        } catch (e) {
                            setErrorMesg("Something went wrong !!! ")
                            // saving error
                        }
                    } else {
                        setErrorMesg("Something went wrong !!! ")
                    }
                } else {
                    setErrorMesg("Something went wrong !!!")
                }
            })
            .catch(function (error) {
                console.log('@@@ OTP LOGIN ERROR ============', error);
                console.log(error);
            });
    }

    const sendOtp = () => {
        axios.post(`${baseUrl}chop/user/send-otp`, {
            phoneNumber: phone,
        })
            .then(async (response) => {
                if (response.data.success) {
                    setIsOtpSent(true)
                } else {
                    setErrorMesg("Something went wrong !!!")
                }
            })
            .catch(function (error) {
                console.log(error);
            });
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

    const validateEmail = (val) => {
        if (validate(val, "Email")) {
            var regx = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            if (!regx.test(val)) {
                setErrorMesg("Please Enter Valid Email")
            }
            return regx.test(val);
        } else { return false; }
    }

    const validate = (val, name) => {
        if (val == "" || val == null) {
            setErrorMesg("Please Enter " + name)
        } else {
            return true;
        }
    }

    return (
        <KeyboardAwareScrollView style={styles.main}>
            {isLoader &&
                <Loader />
            }
            <View>
                <Image
                    source={require('../../assets/loginImage.png')}
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
                            <Title text={"Welcome"} titleStyle={styles.titleStyle} titleContainer={styles.titleContainer} />
                            <Text style={{ fontSize: RFPercentage(2.4), color: '#494949' }}>Sign in to continue</Text>
                        </View>
                        <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'center', marginBottom: vh * 4 }}>
                            <TouchableOpacity style={{ backgroundColor: isOtpLogin ? '#f04c4c' : '#ddd', padding: 10, borderBottomLeftRadius: 10, borderTopLeftRadius: 10 }} onPress={() => setIsOtpLogin(true)}>
                                <Text style={{ color: isOtpLogin ? '#fff' : '#000' }}>Mobile Login</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={{ backgroundColor: !isOtpLogin ? '#f04c4c' : '#ddd', padding: 10, borderBottomRightRadius: 10, borderTopRightRadius: 10 }} onPress={() => setIsOtpLogin(false)}>
                                <Text style={{ color: !isOtpLogin ? '#fff' : '#000' }}>Email Login</Text>
                            </TouchableOpacity>
                        </View>
                        {isOtpLogin ?
                            <View>
                                <CustomInput isIcon={true}
                                    Icon={<FeatherIcon name="phone" style={{ fontSize: 3 * vh, color: 'grey' }} />}
                                    secureTextEntry={false}
                                    placeHolder={'Enter Mobile Number'}
                                    inputType={"numeric"}
                                    value={phone}
                                    action={setMobile} />
                                {!isOtpSent ?
                                    <View style={{ marginTop: vh * 4 }}>
                                        <CustomButton enabled={true} btnAction={sendOtp} btnWidth={82} text={"Send OTP"} />
                                    </View>
                                    : <>
                                        <CustomInput isIcon={true}
                                            Icon={<FeatherIcon name="phone" style={{ fontSize: 3 * vh, color: 'grey' }} />}
                                            secureTextEntry={false}
                                            placeHolder={'Enter OTP'}
                                            inputType={"numeric"}
                                            value={otp}
                                            action={setOtp} />
                                        <TouchableOpacity
                                            onPress={() => {
                                                resendOtp()
                                            }}
                                        >
                                            <Text style={{ color: '#f04c4c', marginTop: 10, textAlign: 'right', width: vw * 80 }}>Resend Otp</Text>
                                        </TouchableOpacity>
                                        <View style={{ marginTop: vh * 4 }}>
                                            <CustomButton enabled={true} btnAction={otpLogin} btnWidth={82} text={"Login"} />
                                        </View>

                                    </>
                                }
                                <View style={{ marginTop: vh * 4 }}>
                                    <Text style={{ fontSize: RFPercentage(2.2), color: '#a0a0a0' }}>Don't have an account yet ?</Text>
                                    <Text onPress={btnAction} style={{ fontWeight: 'bold', fontSize: RFPercentage(2.2), color: '#494949' }}>Sign Up</Text>
                                </View>

                            </View>
                            : <View>
                                <CustomInput isIcon={true}
                                    Icon={<Icon name="email-outline" style={{ fontSize: 3 * vh, color: 'grey' }} />}
                                    secureTextEntry={false}
                                    placeHolder={'E-mail'}
                                    autoCapitalize={'none'}
                                    value={email}
                                    inputType={"default"}
                                    action={setEmail} />

                                <CustomInput isIcon={true}
                                    Icon={<FeatherIcon name="lock" style={{ fontSize: 3 * vh, color: 'grey' }} />}
                                    secureTextEntry={true}
                                    placeHolder={'Password'}
                                    inputType={"default"}
                                    action={setPassword} />

                                <View style={{ marginLeft: vw * 3.7 }}>
                                    <TouchableOpacity onPress={() => navigation.navigate('ForgetPassword')}>
                                        <Text style={{ fontSize: RFPercentage(2.2), color: '#a0a0a0' }}>
                                            Forgot Password ?
                            </Text>
                                    </TouchableOpacity>
                                </View>
                                {errorMesg != "" && <View style={{ marginLeft: vw * 3.7, marginTop: vh * 2 }}>
                                    <Text style={{ color: "#f04c4c", alignItems: 'center' }}>{errorMesg}</Text>
                                </View>}
                                <View style={{ marginTop: vh * 4 }}>
                                    <CustomButton enabled={true} btnAction={login} btnWidth={82} text={"Log in"} />
                                </View>
                                <View style={{ marginTop: vh * 4 }}>
                                    <Text style={{ fontSize: RFPercentage(2.2), color: '#a0a0a0' }}>Don't have an account yet ?</Text>
                                    <Text onPress={btnAction} style={{ fontWeight: 'bold', fontSize: RFPercentage(2.2), color: '#494949' }}>Sign Up</Text>
                                </View>
                            </View>
                        }
                    </View>
                </View>
            </ScrollView>
        </KeyboardAwareScrollView>
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
        // flexDirection: 'row',
        // justifyContent: 'center'
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
    bottomScroll: {
        flexDirection: 'row',
        justifyContent: 'center'
    },
})
