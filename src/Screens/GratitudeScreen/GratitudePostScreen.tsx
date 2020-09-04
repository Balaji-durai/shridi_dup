import React, { Component, createRef } from 'react';
import { View, StyleSheet, Text, TextInput, ScrollView, AsyncStorage} from 'react-native';
import { Constants, Colors } from '../../Styles';
import { Icon, Avatar, Button } from 'react-native-elements';
import { ProfilePic } from '../../Components';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
//import CardView from 'react-native-cardview';

export default class GratitudePostScreen extends Component {

    constructor(props) {
        super(props) 
        this.state ={
            id: this.props.route.params.id,
            title: '',                                   //optional title for img
            grtMsg: '',                                   //gratitude msg content
        }
    }

    componentDidMount= async() => {
        //console.log('the id data in state',this.state.id,'---',!!this.state.id,"--",!!this.props.route.params.id)
        if(!!this.state.id) {
            console.log('the id data from edit',this.state.id)
            this.connectApiToGetEditData()
        }
    }
        
    //refs for ux purpose to navigate to next field by click
    ref_input2 = createRef();
    ref_input3 = createRef();
    ref_input4 = createRef();
        
    //api to store img datas in server including s3 img url
    connectApiToGetEditData = async () => {
        console.log('the edit api for gratitude post');
        try { 
            //console.log('you are in upload api')
            await fetch('http://10.0.2.2:3000/gratitude/edit', {
                method: 'PUT',
                headers: {
                    'Content-Type' : 'application/json',
                    //  'enctype': 'multipart/form-data' 
                },
                body: JSON.stringify({
                    id: this.state.id
                })
            })
            .then(res => res.json())
            .then( async data =>{
                console.log("the gratitude from id",data,'---',typeof(data.content),'----',data.content)
                await this.setState({title: data.title})
                await this.setState({grtMsg: data.content})
            })
        } catch (error) {
           console.log('the catch error',error)
        } 
    } 

    //api to store img datas in server including s3 img url
    connectApiToUploadData = async () => {
        try { 
            //console.log('you are in upload api')
            await fetch('http://10.0.2.2:3000/gratitude/createGratitude', {
                method: 'POST',
                headers: {
                    'Content-Type' : 'application/json',
                    //  'enctype': 'multipart/form-data' 
                },
                body: JSON.stringify({
                    unique_id: '5f1e9af143c44424b8e0da25',
                    title: this.state.title,
                    content: this.state.grtMsg,
                })
            })
            .then(res => res.text())
            .then( async data =>{
                console.log(data)
                await this.NAVIGATE_TO_GRATITUDE_HOME()
            })
        } catch (error) {
           console.log('the catch error',error)
        } 
    }  

    //api to store img datas in server including s3 img url
    connectApiToPutEditedData = async () => {
        try { 
            //console.log('you are in upload api')
            await fetch('http://10.0.2.2:3000/gratitude/edited', {
                method: 'PUT',
                headers: {
                    'Content-Type' : 'application/json',
                    //  'enctype': 'multipart/form-data' 
                },
                body: JSON.stringify({
                    id: this.state.id,
                    title: this.state.title,
                    content: this.state.grtMsg,
                })
            })
            .then(res => res.text())
            .then( async data =>{
                console.log(data)
                await this.NAVIGATE_TO_GRATITUDE_HOME()
            })
        } catch (error) {
           console.log('the catch error',error)
        } 
    } 

    //function to navigate gallery home page
    NAVIGATE_TO_GRATITUDE_HOME = () => {
        this.props.navigation.navigate('Gratitude_Home');
    }

    uploadDataToServer =() => {
        if(!!this.state.id) {
            console.log('the id data from edit',this.state.id)
            this.connectApiToPutEditedData()
        } else {
            this.connectApiToUploadData()
        }
    }
         
    render () {
        return (
            <View style= {Styles.Container}>
                <View style= {Styles.HeaderContainer}>
                <Icon name='arrowleft' type='antdesign'  size= {30} onPress={this.NAVIGATE_TO_GRATITUDE_HOME} color= {Colors.white}/>
                    <View style={{flexDirection: 'column', justifyContent: 'space-between', paddingTop: hp(2.211), paddingLeft: hp(2.95), paddingRight: hp(12.275)}}>                    
                        <Text style={Styles.HeaderText}>Gratitude</Text>
                        <Text style={Styles.SubHeaderText}>Share the moments with baba</Text>
                    </View>
                    <ProfilePic />
                </View>
                <View style= {Styles.ContentContainer}>
                    <ScrollView>
                    <Text style={Styles.ContentHeaderText}>Create new gratitude</Text>
                    <Text style={Styles.ContentSubHeaderText}>Title(optional)</Text>
                    <View style={Styles.TextInputContainer}>
                        <TextInput style={[Styles.TextInput]}
                           placeholder='Enter title'
                           placeholderTextColor= {Colors.SecondaryColor_2}
                           returnKeyType = { "next" }
                           ref = {this.ref_input2}
                           onSubmitEditing={() => this.ref_input3.current.focus()}
                           blurOnSubmit={false}
                           selectionColor={Colors.PrimaryColor_1}
                           onChangeText={text => this.setState({title:text})}
                           value={this.state.title} 
                        />
                    </View>
                    <Text style={Styles.ContentSubHeaderText}>Gratitude</Text>
                    <View> 
                        <View style={[Styles.TextInputContainer,{height: hp('25%'),}]}>
                            <TextInput style={[Styles.TextInput,{height: hp('25%')}]}
                                placeholder='Type something'
                                placeholderTextColor= {Colors.SecondaryColor_2}
                                returnKeyType = { "next" }
                                ref={this.ref_input3}
                                caretHidden= {true}
                                blurOnSubmit={false}
                                clearTextOnFocus= {true}
                                multiline= {true}
                                maxLength= {1000}
                                selectionColor={Colors.SecondaryColor_2}
                                onChangeText={text => {this.setState({grtMsg: text})}}
                                value={this.state.grtMsg} 
                            />
                            <Text style={Styles.CountText}>{this.state.grtMsg.length}/1000</Text>
                        </View>
                    </View>
                    <View style={[Styles.TextInputContainer,{marginTop: hp('1%'), elevation: 0}]}>
                    </View>
                    </ScrollView>
                </View>
                <View style={Styles.ButtonContainer}>
                    <Button 
                        title='Save gratitude' 
                        titleStyle={{fontFamily: Constants.fontRegular,color: Colors.white, lineHeight: hp(2.95), fontSize: hp(2.211)}}
                        //containerStyle={{paddingVertical: hp(2.95)}}
                        onPress={()=> {this.uploadDataToServer()}}
                        disabledStyle={{backgroundColor: Colors.PrimaryColor_2,}}
                        disabledTitleStyle={{fontFamily: Constants.fontRegular,color: Colors.white, lineHeight: hp(2.95), fontSize: hp(2.211)}}
                        disabled={(!this.state.grtMsg)}
                        buttonStyle={{backgroundColor: Colors.PrimaryColor_2, borderRadius: hp(1.475),height: hp(6.637) }} 
                    />
                </View>
            </View>
        )
    }
}

const Styles= StyleSheet.create({
    Container: {
        flex: 1,
    },
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
        flex: 4.30,
        paddingVertical: hp(2.95),
        paddingHorizontal: hp(2.85),
        backgroundColor: Colors.white,
        flexDirection: 'column',
        justifyContent: 'flex-start'
    },
    ContentHeaderText: {
        fontFamily: Constants.fontMedium,
        fontSize: hp(2.655),
        lineHeight: hp(3.54),
        color: Colors.SecondaryColor_2,
        fontWeight: 'bold',
    },
    TextInputContainer: {
        marginHorizontal: hp(0.4) ,
        backgroundColor: Colors.white,
        elevation: 3,
        borderRadius: hp(1.434),
    },
    TextInput: {
        height: Constants.windowHeight/16.24, 
        borderColor: Colors.SecondaryColor_1,
        //backgroundColor: Colors.ivory, 
        fontFamily: Constants.fontRegular,
        borderWidth: 2,
        borderRadius: hp(1.434),
        padding: hp(1),
        paddingLeft: hp(2.5),
        opacity: 0.5,
        alignItems: 'center',
    },
    ContentSubHeaderText: {
        fontFamily: Constants.fontMedium,
        fontSize: hp(2.211),
        lineHeight: hp(2.655),
        color: Colors.SecondaryColor_2,
        fontWeight: 'bold',
        marginVertical: hp(2.25) 
    },
    ButtonContainer: {
        flex: 0.30,
        //paddingVertical: hp(2.95),
        paddingHorizontal: hp(2.95),
        backgroundColor: Colors.white,
    },
    ImageContainer: {
        height: Constants.windowHeight/4,
        width: wp('90%'),
        elevation: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: Colors.white,
        borderRadius: hp(1.44),
        borderWidth: hp(0.4)
    },
    CountText: {
        position: 'relative',
        top: hp('-4.5%'),
        right: hp('-41%'),
        width: wp('88%'),
        fontFamily: Constants.fontRegular,
        color: Colors.SecondaryColor_2,
        opacity: 0.2,
        fontSize: hp(2.211),
        lineHeight: hp(2.655),
    },
})

/*
<Text style={Styles.CountText}>{this.state.grtMsg.length}/1000</Text>
*/

/*
<View style={{ paddingRight: hp(2.95), paddingTop: hp(3.685)}}>
                        {this.state.profilePic.length>0 ?
                            (<Avatar size={60} rounded source={{uri: this.state.profilePic}} />) :
                            (<Avatar size={60} rounded overlayContainerStyle={{backgroundColor: Colors.SecondaryColor_3, borderRadius: hp('100%')}} icon={{ name: 'user', type: 'entypo', color: Colors.white, size: 41}} />)
                        }
                    </View>
*/