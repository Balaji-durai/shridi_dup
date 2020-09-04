import { Dimensions } from 'react-native';
import { windowWidth } from '../Constants/constants';

export default {
    //Screen width and height 
    windowWidth : Dimensions.get('screen').width,
    windowHeight: Dimensions.get('screen').height,
    headerPadding : windowWidth/11,
    buttonWidth : windowWidth/1.2,
    //Primary Fonts 
    fontMedium: 'SlateForOnePlus-Medium',
    fontRegular: 'SlateForOnePlus-Regular',
    fontBold: 'SlateForOnePlus-Bold',
    fontLight: 'SlateForOnePlus-Light',
    fontProximaBold: 'ProximaNova-Bold',
    fontProximaReg: 'ProximaNova-Regular',
    fontGothamMed: 'GothamMedium',
    playIcon: require('../../Images/play.png'),
    previousIcon: require('../../Images/previous.jpg'),
    nextIcon: require('../../Images/next.png'),
    resumeIcon: require('../../Images/resume.jpg'),
}
