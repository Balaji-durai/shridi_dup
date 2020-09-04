import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ViewPropTypes } from 'react-native';
import { Constants, Colors } from '../Styles';
import PropTypes from 'prop-types';
import constants from '../Styles/constants';
import { Button } from 'react-native-elements';

const SOLID = 'solid';
const OUTLINE = 'outline';
const CLEAR = 'clear';

const propTypes = {
    title: PropTypes.string.isRequired,
    type: PropTypes.oneOf([SOLID, OUTLINE, CLEAR]),
    onPress: PropTypes.func,
    disabled: PropTypes.bool,
    loading: PropTypes.bool,
    style: ViewPropTypes.style,
};
  
const defaultProps = {
    type: SOLID,
    onPress: () => {},
    disabled: false,
    style: {},
    loading: false,
};

const PrimaryButton = ({
    /**
     * type can be
     * 1. 'solid'
     * 2. 'outline'
     */
    type,
    /**
     * text to be shown in button
     */
    title,
    /**
     * click listener
     */
    onPress,
    /**
     * set true to disable onPress and custom style
     */
    disabled,
    /**
     * custom style for button
     */
    style,
  }) => {

    const onPress = () => {console.log('the button is clicked,otp is:') };
    return(
        <View style={Styles.ButtonContainer}>
        <TouchableOpacity style={Styles.Button}
                          onPress={onPress} >
            <Text style={Styles.ButtonText}>{title}</Text>
        </TouchableOpacity>
    </View>
    )
}
const Styles= StyleSheet.create({
    ButtonContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
     },
     Button: {
         backgroundColor: Colors.PrimaryColor_2,
         borderRadius: 10,
         height: 45,
         width: constants.buttonWidth,
         justifyContent: 'center',
         alignItems: 'center',
         marginTop: 20,
         flexDirection: 'row'
     },
     ButtonText: {
         color: Colors.white, 
         fontSize: 18 
     },
})

export default PrimaryButton;