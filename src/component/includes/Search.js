import React, { Component, useState, useRef, useEffect } from 'react';
import { StyleSheet, Text, Alert, View, TextInput, BackHandler, ScrollView, TouchableOpacity, ImageBackground, Image, Dimensions } from 'react-native'
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import Icon from 'react-native-vector-icons/Ionicons';
const { width, height } = Dimensions.get('window');

const vw = Dimensions.get('window').width / 100;
const vh = Dimensions.get('window').height / 100;

export default function Search(props) {

    const { placeholder, handleSearch, setShouldScroll, itemList, navigation } = props;
    const [searchedText, setSearchedText] = useState([]);
    const inputRef = useRef(null);
    const touchRef = useRef(null);
    const [value, setValue] = useState('');
    const [viewDropdown, setViewDropdown] = useState(false);

    useEffect(() => {
        setSearchedText(itemList)
        // if(inputRef.current.isFocused()){
        //     alert(inputRef.current.isFocused())
        // }

        // setSearchedText(itemList);
        const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            backAction
        );
        return () => backHandler.remove();
    }, []);

    const backAction = () => {
        // alert(viewDropdown)
        // return () => backHandler.remove();
    };

    const blurAction = () => {
        setViewDropdown(false)
        setShouldScroll(true)
    }

    const focusAction = () => {
        setShouldScroll(false)
        setSearchedText(itemList)
        setViewDropdown(true)
    }

    const onChangeText = (text) => {
        var temp = itemList;
        var tempArray = [];
        setValue(text);
        setViewDropdown(true);
        temp.map((item, i) => {
            var str = item.name.toLowerCase();
            if (str.search(text.toLowerCase()) !== -1) {
                tempArray.push(item)
            }
        })
        setSearchedText(tempArray)
    }

    const optionClicked = (item) => {
        navigation.navigate('ProductView', {
            itemDetail: {
                name: item.name,
                packaging_type: item.packaging_type,
                multi_package:item.multi_package ? item.multi_package : [],
                multi_price:item.multi_price ? item.multi_price : [],
                price: item.price,
                image_url: item.image_url[0],
                description: item.description,
                page: 'Home'
            },
        });
    }

    return (
        <View keyboardShouldPersistTaps={'always'} style={{ width: '100%', position: 'relative' }}>
            <View style={styles.inputBox}>
                <TextInput
                    ref={inputRef}
                    style={styles.input}
                    placeholder={placeholder}
                    onChangeText={text => onChangeText(text)}
                    value={value}
                    onBlur={() => blurAction()}
                    onFocus={() => focusAction()}
                    returnKeyType="done"
                />
                <View style={{ justifyContent: 'center', position: 'absolute', right: 20, height: '100%', marginTop: 10 }}>
                    <Icon name="search" style={{ fontSize: 4 * vh, color: '#aaa' }} />
                </View>
            </View>
            {viewDropdown &&
                <View style={styles.dropdown}>
                    <ScrollView keyboardShouldPersistTaps={'always'} style={{ flex: 1 }}>
                        <View style={{ width: '100%', backgroundColor: '#fff' }}>
                            {searchedText.map((item, i) => {
                                return (
                                    <TouchableOpacity ref={touchRef} onPress={() => optionClicked(item)} style={styles.touch}>
                                        <Text>{item.name}</Text>
                                    </TouchableOpacity>
                                )
                            })}
                        </View>
                    </ScrollView>
                </View>
            }
        </View>
    )
}

const styles = StyleSheet.create({
    inputBox: {
        padding: 7,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 20,
        flexDirection: 'row',
        position: 'relative',
    },
    input: {
        fontSize: RFPercentage(3),
        borderColor: '#ccc',
        borderRadius: 20,
        width: '100%',
        color: 'grey'
    },
    dropdown: {
        position: 'absolute',
        top: 65,
        zIndex: 9999,
        width: '100%',
        backgroundColor:'#fff',
        flexDirection: 'row',
        justifyContent: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        maxHeight: vh * 40,
    },
    touch: {
        borderBottomWidth: 0.5,
        borderBottomColor: '#ccc',
        padding: 10,
        // backgroundColor:'#ddd'
    }
})
