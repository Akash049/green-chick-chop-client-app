import React, { useEffect } from 'react'
import { StyleSheet, Text, View } from 'react-native'

const FoodContext = React.createContext();

const FoodProvider = (props) => {
    const [quantity, setQuantity] = React.useState(0);

    return (
        <FoodContext.Provider
            value={{
                quantity,
                setQuantity
            }}>
            {props.children}
        </FoodContext.Provider>
    )
}

export{FoodProvider,FoodContext};
