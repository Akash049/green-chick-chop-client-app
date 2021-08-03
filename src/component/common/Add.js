import React, { Component, useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, ImageBackground, TouchableOpacity, Image, Dimensions } from 'react-native'
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import Icon from 'react-native-vector-icons/Ionicons';
import FeatherIcon from 'react-native-vector-icons/Feather';

const { width, height } = Dimensions.get('window');

const vw = Dimensions.get('window').width / 100;
const vh = Dimensions.get('window').height / 100;

export default function Add(props) {
    const {countPos,minusClicked,plusClicked,count,items,itemId,paddingRight} = props;
    const [addData, setAddData] = React.useState({});

    useEffect(() => {
        var flag = true;
        var orderData = items.vendorData && items.vendorData.orderData ? items.vendorData.orderData : [];
        orderData.length > 0 && orderData.map((i)=>{
            if(i.itemId == itemId){
                flag = false;
                setAddData(i);
            }
        })
        if(flag){
            setAddData({})
        }
    }, [items]);
    
    return (
        <View key={itemId} style={{position:'relative'}}>
            {addData.quantity && addData.quantity > 0
                ? <View style={{ flexDirection: 'row' }}>
                    <TouchableOpacity style={styles.minusBtn} onPress={() => minusClicked()}>
                        <FeatherIcon name="minus" style={{ fontSize: RFPercentage(3), color: '#fff' }} />
                    </TouchableOpacity>
                    <Text style={[styles.count,{bottom:countPos?countPos:0,paddingRight:paddingRight?paddingRight:15}]}>{addData.quantity && addData.quantity}</Text>
                    <TouchableOpacity style={styles.added} onPress={() => plusClicked()}>
                        <FeatherIcon name="plus" style={{ fontSize: RFPercentage(3), color: '#fff' }} />
                    </TouchableOpacity>
                </View>
                :
                <View style={{ flexDirection: 'row',overflow:'hidden',zIndex:99999 }}>
                    <View style={styles.addTxt}><Text style={styles.txt}>Add</Text></View>
                    <TouchableOpacity style={styles.addBtn} onPress={() => plusClicked()}>
                        <FeatherIcon name="plus" style={{ fontSize: RFPercentage(3), color: '#fff' }} />
                    </TouchableOpacity>
                </View>
            }
        </View>
    )
}

const styles = StyleSheet.create({
    txt:{
        fontSize: RFPercentage(2),
        color: '#fff',
    },
    addTxt: {
        backgroundColor: '#f36566',
        paddingTop: 5,
        paddingBottom: 5,
        paddingRight: 30,
        paddingLeft: 10,
        borderTopLeftRadius: 10,
        borderBottomLeftRadius: 10,
    },
    addBtn: {
        justifyContent: 'center',
        backgroundColor: '#f04c4c',
        borderTopRightRadius: 10,
        borderBottomRightRadius: 10,
        paddingLeft: 5,
        paddingRight: 5
    },
    minusBtn: {
        justifyContent: 'center',
        backgroundColor: '#f04c4c',
        borderRadius: 10,
        padding: 3,
    },
    added: {
        justifyContent: 'center',
        backgroundColor: '#f04c4c',
        borderRadius: 10,
        padding: 3,
        marginLeft:30
    },
    count: {
        padding: 5,
        // paddingRight:30,
        paddingLeft:15,
        fontSize: RFPercentage(2.5),
        zIndex:-99,
        position:'absolute',
        textAlign:'center',
        width:'100%'
    }
})
