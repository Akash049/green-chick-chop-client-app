import React, { Component } from 'react'
import { Text, StyleSheet, Dimensions, View } from 'react-native'
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

export default function Title(props){
    const {text,titleContainer,titleStyle} = props
    return (
      <View style={[styles.title,titleContainer]}>
        <Text style={[styles.text,titleStyle]}>
            {text}
        </Text>
      </View>
    )
}

const styles = StyleSheet.create({
    text:{
        color:'#494949',
        fontSize: RFPercentage(3.5)
    },
    title:{

    }

})