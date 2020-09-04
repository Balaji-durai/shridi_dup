import Constants from './constants';
import Colors from './Colors'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { ReloadInstructions } from 'react-native/Libraries/NewAppScreen';

export default {
    HeaderContainer: {
        flex: 1.05,
        backgroundColor: Colors.PrimaryColor_1,
        paddingLeft: hp('2.95%'),
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    HeaderText: {
        fontFamily: Constants.fontProximaBold,
        fontWeight: 'bold',
        fontSize: hp('4.45%'),
        color: Colors.white,
        paddingBottom: 7,
    },
    SubHeaderText: {
        fontFamily: Constants.fontProximaReg,
        fontSize: hp('2%'),
        color: Colors.white,
        lineHeight: hp(2.211)
    },
    ContentContainer: {
        flex: 4,
        paddingHorizontal: hp('2.95%'),
    },
}

