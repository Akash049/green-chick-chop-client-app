import React, { Component } from 'react'
import { Text, Button, StyleSheet, Dimensions, Image, View } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
const { width, height } = Dimensions.get('window');

const vw = Dimensions.get('window').width / 100;
const vh = Dimensions.get('window').height / 100;

export default function CustomButton(props) {
  const { isIcon, icon, price, btnAction, textAlign, text, btnWidth, enabled, alertMesg } = props
  return (
    <View style={styles.btnContainer}>
      <View style={[styles.btn, { width: vw * btnWidth }]}>
        <TouchableOpacity onPress={() => enabled ? btnAction() : null}>
          <Text style={[styles.text, { textAlign: textAlign ? textAlign : 'center' }]} >{text}</Text>
        </TouchableOpacity>
        {price &&
          <Text style={{ color: '#fff', fontSize: RFPercentage(2.5), position: 'absolute', right: 30, padding: 15 }}>₹ {price}</Text>
        }
        {isIcon &&
          <View style={styles.icon}>
            {icon}
            {/* <Image style={{ width: '100%', height: '100%', resizeMode: 'contain' }} source={icon} /> */}
          </View>
        }
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  btnContainer: {
    width: '100%',
    // height:50,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  btn: {
    backgroundColor: '#f04c4c',
    // backgroundColor: 'red',
    borderRadius: 20,
    position: 'relative',
    // flexDirection:'row',
    // justifyContent:'space-between'
  },
  text: {
    color: '#fff',
    padding: 15,
    paddingLeft: 20,
    fontSize: RFPercentage(2.8)
  },
  icon: {
    justifyContent: 'center',
    position: 'absolute',
    // width: vw * 6,
    height: '100%',
    right: 15,
  }
})
