import React from 'react';
import { TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import { Image } from 'react-native-elements';

export default function ImageButton ({onPress, imageStyle, style, source}) {
    return (
        <TouchableOpacity onPress={onPress} style={style}>
            <Image source={source} style={imageStyle} />
        </TouchableOpacity>
    );
}
  
ImageButton.prototype = {
    source :PropTypes.string.isRequired,
    onPress: PropTypes.func.isRequired,
    style: PropTypes.object,
    imageStyle: PropTypes.object
}

