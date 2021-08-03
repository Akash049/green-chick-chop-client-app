import React, { Component, useState, useEffect } from 'react';
import { StyleSheet, Text, View, Alert, TouchableOpacity } from 'react-native'
import { HomeServices } from '../../Services/Home.services';
import AsyncStorage from '@react-native-async-storage/async-storage';

const homeServices = new HomeServices()
export default function LocationItem(props) {

    useEffect(() => {
    }, []);

    const selectedLocation = async () => {
        props.setIasLoader(true)
        var data = await props.fetchDetails(props.place_id)
        var geo = data.geometry.location;
        getCategoryDetailItem(geo);
    }

    const getCategoryDetailItem = (geo) => {
        const payload = {
            lat: geo.lat ? geo.lat : '',
            lng: geo.lng ? geo.lng : ''
        }
        homeServices.getVendorList(payload).then(
            (data) => {
                console.log(data.result.result.length)
                props.setIasLoader(false)
                if (data.result.result.length > 0) {
                    props.setVendorList(data.result.result)
                } else {
                    alert("We are not currently serving at this location");
                }
            },
            (error) => {
                console.log("error.response.status", error);
            }
        );
    }

    return (
        <TouchableOpacity style={styles.main} onPress={() => selectedLocation()}>
            <Text style={styles.text}>{props.description}</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    main: {
        // borderBottomColor:"#000",
        // borderBottomWidth:0.5,
        // backgroundColor:'red'
    },
    text: {
        borderBottomColor: "#000",
        borderBottomWidth: 0.5,
        padding: 10,
        backgroundColor: '#ddd'
    }
})
