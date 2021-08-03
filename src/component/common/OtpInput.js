import React, { useState, useEffect } from 'react';
import { Text, StyleSheet, View, TextInput, ActivityIndicator, TouchableOpacity, Dimensions } from 'react-native'
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import CustomButton from './CustomButton'
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loader from '../common/Loader'
import axios from 'react-native-axios';


const baseUrl = 'https://vendor.greenchickchopindia.com:3000/'
const { width, height } = Dimensions.get('window');

const vw = Dimensions.get('window').width / 100;
const vh = Dimensions.get('window').height / 100;
export default function OtpInput(props) {
    const { otpLength, email, userId, mobile, navigation } = props
    const [inputs, setInputs] = useState([]);
    const [otpText, setOtpText] = useState([]);
    const [isLoader, setIasLoader] = useState(false);

    useEffect(() => {
        // onAction(otpText);
    }, [])

    const submitOtp = () => {
        setIasLoader(true)
        if (otpText.length == otpLength) {
            var ttt = otpText.toString();
            const regex = /,/g;
            var newOtp = ttt.replace(regex, '');
            axios.post(`${baseUrl}chop/user/verify-otp`, {
                email: email,
                mobile: mobile,
                userId: userId,
                otp: newOtp
            })
                .then(async (response) => {
                    if (response.data.success) {
                        setIasLoader(false)
                        try {
                            await AsyncStorage.setItem("green_chick_chop_access_bearer_token", response.data.result.token);
                            navigation.navigate('Home')
                        } catch (e) {
                            navigation.navigate('Login')
                            // saving error
                        }
                    } else {
                        setIasLoader(false)
                        alert(response.data.result.error ? response.data.result.error : "Something went wrong !!!")
                    }
                })
                .catch(function (error) {
                    setIasLoader(false);
                    console.log(error);
                });
        } else {
            alert("Please Enter Valid Otp");
        }
    }

    const onInputFocus = (i) => {
        const prevIndex = i - 1;
        if (prevIndex > -1 && !otpText[prevIndex]) {
            inputs[prevIndex].focus();
            return;
        }
    };

    const onKeyPress = (e, i) => {
        var tempText = otpText;
        if (e.nativeEvent.key === "Backspace") {
            tempText.splice(i, 1);
            setOtpText(tempText);
            if (i !== 0) {
                inputs[i - 1].focus();
            }
        }
    };
    const handleChange = (text, i) => {
        var temp = otpText
        if (text) {
            temp.push(text);
            setOtpText(temp);
            var index = i + 1 < otpLength ? i + 1 : i
            inputs[index].focus();
        }
    }

    return (
        <View>
            <View style={{ width: "100%", flexDirection: 'row', marginBottom: 30, justifyContent: 'space-between' }}>
                {Array.from(Array(otpLength), (e, i) => {
                    return <TextInput
                        ref={(e) => {
                            inputs[i] = e;
                        }}
                        key={i}
                        style={styles.input}
                        autoCompleteType="password"
                        maxLength={1}
                        autoFocus={false}
                        keyboardType={"numeric"}
                        secureTextEntry={true}
                        // Events of TextInput
                        onFocus={() => onInputFocus(i)}
                        onChangeText={text => handleChange(text, i)}
                        onKeyPress={(e) => onKeyPress(e, i)}
                    />
                })}
            </View>
            {isLoader &&
                <View>
                    <ActivityIndicator size="large" style={styles.loader} color="#f04c4c" />
                </View>
            }
            <TouchableOpacity onPress={() => submitOtp()}><Text style={{ textAlign: 'center', fontSize: 20 }}>Submit</Text></TouchableOpacity>
        </View >
    )
}


const styles = StyleSheet.create({
    input: {
        borderColor: '#dedede',
        borderWidth: 1,
        width: 50,
        height: 50,
        textAlign: 'center',
        fontSize: RFPercentage(3),
        color: 'grey'
    }
})
