import React, { Component, useState, useEffect } from 'react';
import { StyleSheet, Text, BackHandler, View, ScrollView,Platform, KeyboardAvoidingView, ImageBackground, Image, Dimensions } from 'react-native'
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


export default function ForgetPassword({ navigation }) {
    const [isLoader, setIasLoader] = useState(false);
    const [email, setEmail] = useState('');
    const [errorMesg, setErrorMesg] = useState('');

    const resetPassword = () => {
        if (validateEmail(email)) {
            setIasLoader(true);
            var user = {
                email: email,
            };
            authServices.forgetPassword(user)
                .then(async (data) => {
                    if (data.success) {
                        setIasLoader(false);
                        navigation.navigate('Login')
                    } else {
                        setIasLoader(false);
                        setErrorMesg(data.result.error ? data.result.error : "Something went wrong !!!")
                    }
                })
                .catch(function (error) {
                    setErrorMesg(error ? error : "Something went wrong !!!")
                    setIasLoader(false);
                    console.log(error);
                });
        }
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
        <View style={{ width: width, height: height }}>
            {isLoader &&
                <Loader />
            }
            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                <View style={{ width: 80 * vw, justifyContent: 'center', height: height }}>
                    <Text style={{ marginBottom: 20 }}>Enter your email to get reset password link:</Text>
                    <CustomInput isIcon={true}
                        Icon={<Icon name="email-outline" style={{ fontSize: 3 * vh, color: 'grey' }} />}
                        secureTextEntry={false}
                        placeHolder={'E-mail'}
                        inputType={"default"}
                        autoCapitalize={'none'}
                        action={setEmail} />
                    {errorMesg != "" && <View style={{ marginLeft: vw * 3.7, marginTop: vh * 2 }}>
                        <Text style={{ color: "#f04c4c", alignItems: 'center' }}>{errorMesg}</Text>
                    </View>}
                    <View style={{ marginTop: vh * 4 }}>
                        <CustomButton enabled={true} btnAction={resetPassword} btnWidth={82} text={"Submit"} />
                    </View>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({})
