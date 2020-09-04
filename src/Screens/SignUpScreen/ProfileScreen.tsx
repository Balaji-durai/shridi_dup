import React, { useState, useRef } from 'react';
import { View, StyleSheet, Text, TextInput, Keyboard, TouchableOpacity, Platform, StatusBar } from 'react-native';
import { Constants, Colors } from '../../Styles';
import { Icon } from 'react-native-elements';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Progress from 'react-native-progress';

const ProfileScreen = ({ navigation }) => {
    const [Firstname, onChangeFirstName] = useState('');                  //firstname
    const [Lastname, onChangeLastName] = useState('');                    //for lastname
    const [DobBirth, onChangeDobBirth] = useState('');                    //for dob
    const [Email, onChangeEmail] = useState('');                          //for email
    const [BtnAction, setBtnAction] = useState(false);
    const [date, setDate] = useState(new Date(1598051730000));            //for default timing in dob
    const [mode, setMode] = useState('date');                             
    const [show, setShow] = useState(false);                              //for dob modal
    //refs to navigate next field when finish
    const ref_input2 = useRef();
    const ref_input3 = useRef();
    const ref_input4 = useRef();

    //function to convert and store dob data in state
    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
       // setShow(Platform.OS === 'ios');
        const s =currentDate.toString();
        const str= s.split(' ');
        const month=str[1];
        const Month= convertMonth(month);
        console.log('ths splited date is',str[1],str[2],str[3],Month)
        const Date =Month + '-'+ str[1] + '-'+ str[2];
        setShow(false);
        setDate(currentDate);
        onChangeDobBirth(Date);
    };

    //convert month in string to num
    const convertMonth= (month) =>{
        var months
        switch(month){   
            case 'Jan':
                months = '01';
                break;
            case 'Feb':
                months ='02';
                break;
            case 'Mar':
                months = '03';
                break;
            case 'Apr':
                months = '04';
                break;
            case 'May':
                months ='05';
                break;
            case 'Jun':
                months ='06';
                break;
            case 'Jul':
                months ='07';
                break;
            case 'Aug':
                months ='08';
                break;
            case 'Sep':
                months ='09';
                break;
            case 'Oct':
                months ='10';
                break;
            case 'Nov':
                months ='11';
                break;
            case 'Dec':
                months ='12';
                break;
        }
        return months

    }

    const showDatepicker = () => {
        showMode('date');
    };

    const showMode = (currentMode) => {
        setShow(true);
        setMode(currentMode);
    };

    //function for navigate to mobile screen with datas 
    const onPress = () => {
        console.log('the button is clicked',Firstname,"is",Lastname,'to',DobBirth,'by',Email);
        navigation.navigate("MobileNo",{Name: Firstname + ' ' + Lastname, DobBirth: DobBirth, Email: Email});
    };


    return (
        <View style={Styles.Container} >
            <StatusBar hidden= {true} />
            <View style={Styles.HeaderContainer}>
                <Text style={Styles.HeaderText}>Hello Arun!</Text>
            </View>
            <Progress.Bar progress={0.33} color={Colors.PrimaryColor_2}  borderRadius={0} borderWidth={0} width={Constants.windowWidth}/>
            <View style={Styles.ContentContainer}>
                <Text style={Styles.ContentText}>Setup your profile</Text>
                <TextInput style={Styles.TextInput}
                           placeholder='First Name'
                           placeholderTextColor= {Colors.SecondaryColor_2}
                           autoFocus
                           returnKeyType = { "next" }
                           onSubmitEditing={() => ref_input2.current.focus()}
                           blurOnSubmit={false}
                           selectionColor={Colors.PrimaryColor_1}
                           onChangeText={text => onChangeFirstName(text)}
                           value={Firstname} 
                />
                <TextInput style={Styles.TextInput}
                           placeholder='Last Name'
                           returnKeyType="next"
                           onSubmitEditing={() => ref_input3.current.focus()}
                           ref={ref_input2}
                           placeholderTextColor= {Colors.SecondaryColor_2}
                           onChangeText={text => onChangeLastName(text)}
                           value={Lastname}
                />
                <Text style={Styles.ContentText}>Date of birth</Text>
                <View style={Styles.DOBContainer}>
                <TextInput style={[Styles.TextInput,{width: Constants.windowWidth/2.5, marginLeft: -Constants.windowWidth/2.65}]}
                           placeholder='DOB Select'
                           returnKeyType="next"
                           onSubmitEditing={() => ref_input4.current.focus()}
                           ref={ref_input3}
                           placeholderTextColor= {Colors.SecondaryColor_2}
                           onChangeText={text => onChangeDobBirth(text)}
                           inlineImagePadding= {20}
                           value={DobBirth} 
                />
                    <Icon name='calendar' 
                          type='antdesign' 
                          onPress={showDatepicker} 
                          size = {20}
                          style={{marginTop: 20, marginLeft: 30}}
                          color= {Colors.SecondaryColor_1}/>
                </View>
                <Text style={Styles.ContentText}>Email</Text>
                <TextInput style={Styles.TextInput}
                           placeholder='Email address'
                           ref={ref_input4}
                           keyboardType='email-address'
                           onChangeText={text => onChangeEmail(text)}
                           value={Email}
                />
            </View>
            <View style={Styles.ButtonContainer}>
                <TouchableOpacity style={Styles.Button}
                                  onPress={onPress} 
                                  disabled= {(!Lastname) || (!Firstname) || (!DobBirth) || (!Email)}>
                    <Text style={Styles.ButtonText}>Continue</Text>
                    <Icon name='arrow-right-circle' type='feather' size= {20} color= {Colors.white} style={{marginLeft: 20, marginRight: 10}}/>
                </TouchableOpacity>
            </View>
            {show && (
                <DateTimePicker
                testID="dateTimePicker"
                value={new Date()}
                mode="date"
                display="calendar"
                onChange={onChange}
                textColor={Colors.PrimaryColor_1}
                minimumDate={new Date(1900, 0, 1)}
                maximumDate={new Date(2035, 10, 20)}
                />
            )}
        </View>
    )
}

const Styles = StyleSheet.create({
    Container: {
        flex: 1,
    },
    HeaderContainer: {
        flex: 1.05,
        backgroundColor: Colors.PrimaryColor_1,
        justifyContent: 'flex-end',
    },
    HeaderText: {
        color: Colors.white,
        fontSize: 25,
        fontWeight: 'bold',
        fontFamily: Constants.fontMedium,
        marginLeft: Constants.headerPadding,
        marginBottom: 15
    },
    TextInput: {
        height: Constants.windowHeight/16.24,
        width: Constants.buttonWidth, 
        borderColor: Colors.SecondaryColor_1, 
        fontFamily: Constants.fontRegular,
        borderWidth: 2,
        borderRadius: 10,
        paddingLeft: 15,
        opacity: 0.5,
        alignItems: 'center',
    },
    ContentContainer: {
        flex: 4,
        justifyContent: 'space-around',
        marginTop: 20, 
        alignItems:"center", 
    },
    ContentText: {
        fontSize: 15,
        fontWeight: 'bold',
        alignSelf: 'flex-start',
        fontFamily: Constants.fontMedium,
        lineHeight: 20,
        marginLeft: Constants.headerPadding,
        opacity: 0.8
    },
    DOBContainer: {
        flexDirection: 'row',
        borderColor: '#000',
        paddingBottom: 10,
    },
    ButtonContainer: {
       flex: 1,
       justifyContent: 'center',
       alignItems: 'center',
       marginBottom: 5,
    },
    IconContainer: {
        position: 'absolute',
        top: 13,
        left: -33
    },
    Button: {
        backgroundColor: Colors.PrimaryColor_2,
        borderRadius: 10,
        height: 45,
        width: Constants.buttonWidth,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
        flexDirection: 'row'
    },
    ButtonText: {
        color: Colors.white, 
        fontSize: 15,
        fontFamily: Constants.fontRegular,
    },
})

export default ProfileScreen;