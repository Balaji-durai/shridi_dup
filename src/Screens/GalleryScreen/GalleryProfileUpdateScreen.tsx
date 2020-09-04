import React, { Component, createRef } from 'react';
import { View, StyleSheet, Text, ScrollView, TextInput, Image,TouchableOpacity, TouchableHighlight, ImageBackground} from 'react-native';
import { Constants, Colors } from '../../Styles';
import { Icon, Avatar, Button } from 'react-native-elements';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import ImagePicker from 'react-native-image-picker';
import DropDownPicker from 'react-native-dropdown-picker';
var AWS = require('aws-sdk/dist/aws-sdk-react-native');
import { decode } from "base64-arraybuffer";
import * as fs from 'react-native-fs';

export default class GalleryProfileUpdateScreen extends Component {

    constructor(props) {
        super(props) 
        this.state ={
            profileData: [],
            userId: this.props.route.params.userId,
            coverPic: '',
            profilePic: '',
            prevProfilePic: '',
            prevCoverPic: '',
            isFollowing: false,
            interests: '',
            about: '',
            gender: '',
            getUserName: '',
            setUserName: '',
            location: '',
            coverPath: '',
            profilePath: '',                                     
            profileFileName: '',                                //set fileName with timeStamp for identification
            coverFileName: '',
            nameError: '',
            s3Secret: '',
            s3Access: '',
            s3Bucket: '',
            isCoverImg: false,
            isProfileImg: false,
            aboutLength: 0
        }
    }

    //refs for ux purpose to navigate to next field by click
    ref_input2 = createRef();
    ref_input3 = createRef();
    ref_input4 = createRef();
    ref_input5 = createRef();

    componentDidMount =async ()=> {
        await this.connectApiForProfileCont();
    }

    //connect the server and get data for image container 
    connectApiForProfileCont = async () => {
        //console.log('profile update:',this.state.userId)
        try { 
            await fetch('http://192.168.1.7:3000/login-signup/profile', {
                method: 'POST',
                headers: {
                    'Content-Type' : 'application/json',
                    //  'enctype': 'multipart/form-data' 
                },
                body: JSON.stringify({
                    //id: '5f1e9af143c44424b8e0da25',
                    unique_id: this.state.userId
                })
            })
            .then(res => res.json())
            .then( async data =>{
                //set the data in the state profileData array by setState  
                //console.log('the profile data:',data,'--',data.firstName)
                this.setState({about: data.About})
                this.setState({gender: data.Gender})
                this.setState({location: data.location})
                this.setState({getUserName: data.username})
                this.setState({setUserName: data.username})
                this.setState({interests: data.Interest})
                this.setState({location: data.location})
                if(!!data.profileImage) {
                    this.setState({isProfileImg: true})
                    //console.log('the cover image:',this.state.isCoverImg)
                }
                this.setState({prevProfilePic: data.profileImage})
                if(!!data.coverImage) {
                    this.setState({isCoverImg: true})
                    //console.log('the cover image:',this.state.isCoverImg)
                }
                this.setState({prevCoverPic: data.coverImage})
            })
        } catch (error) {
           console.log('the catch error',error)
        } 
    }  

    //read profile img from local storage
    chooseProfileImg = async () =>{
        console.log('inside imagePicker')
        var options = {
            title: 'Select Image',
            //mediaType: 'video',
            tintColor: Colors.PrimaryColor_1,
            storageOptions: {
                skipBackup: true,
                path: 'video',
            }, 
        };

        //launch gallery to pick images
        await ImagePicker.launchImageLibrary(options, response => {
            //console.log('Response = ', response.uri,'----',response.fileName,'---',response.timestamp);
    
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else {
                let source = response;
                // let source = { uri: 'data:image/jpeg;base64,' + response.data };
                this.setState({
                    profilePath: source.uri,                           //set the filePath to display the picked image
                });
                this.setState({
                    profileFileName: source.fileName,                      // set the temporary fileNAme
                });
                this.setState({isProfileImg: true})
                this.setState({profilePic: response.uri})
                //console.log('the profile changed:',!!this.state.profilePic)
            }
        });
    }

    //read cover img from local storage  
    chooseCoverImg = async () =>{
        console.log('inside imagePicker')
        var options = {
            title: 'Select Image',
            //mediaType: 'video',
            tintColor: Colors.PrimaryColor_1,
            storageOptions: {
                skipBackup: true,
                path: 'video',
            }, 
        };

        //launch gallery to pick images
        await ImagePicker.launchImageLibrary(options, response => {
            //console.log('Response = ', response.uri,'----',response.fileName,'---',response.timestamp);
    
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else {
                let source = response;
                let imgSrc = { uri: response.uri };
                // let source = { uri: 'data:image/jpeg;base64,' + response.data };
                this.setState({
                    coverPath: source.uri,                           //set the filePath to display the picked image
                });
                this.setState({
                    coverFileName: source.fileName,                      // set the temporary fileNAme
                });
                this.setState({isCoverImg: true})
                this.setState({coverPic: imgSrc})
                //console.log('the cover changed:',!!this.state.coverPic ?  this.state.coverPic : this.state.prevCoverPic)
            }
        });
    }

    //upload the selected profile image to s3 bucket
    uploadProfileImageOnS3 = async () => {
        //console.log('inside aws')
        //S3 congiq details
        await this.connectApiToGetS3Details();
        //S3 congiq details
        const s3bucket = new AWS.S3({
            //accessKeyId: 'AKIAVEHR3DJ25VY6HAHO',
            accessKeyId: this.state.s3Access,
            secretAccessKey: this.state.s3Secret,
            //secretAccessKey: '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',
            Bucket: this.state.s3Bucket,
            //region: 'Asia Pacific (Mumbai)' ,
            signatureVersion: 'v4',
        });
        //console.log('s3 bucket data:', this.state.profilePath,'---',this.state.fileName)
        var currentTime = new Date().toString();                                     //get the current time to add fileName
        const base64Content = await fs.readFile(this.state.profilePath, "base64");      
        const arrayBuffer = decode(base64Content);
        
        //params to upload image to s3
        const params = {
            Bucket: this.state.s3Bucket,
            Key: 'UserProfile/'+currentTime + this.state.profileFileName,
            Body: arrayBuffer,
            //ContentDisposition: contentDeposition,
            //ContentType: contentType, 
        };

        //function to upload image to s3
        s3bucket.upload(params, async(err, data) => {
            if (err) {
                console.log('error in callback');
            } else {
                console.log("Response URL : "+ data.Location);
                await this.setState({profilePic: data.Location});
                //if cover image is choosed then upload cover img to s3 bucket else sent data  to server
                if(!!this.state.coverPic) {
                    await this.uploadCoverImageOnS3();
                }else {
                    await this.connectApiToUploadProfile();                    //after uploaded to s3 store details in server               
                }
                    //await this.NAVIGATE_TO_GALLERY_HOME();                 // after all navigate to gallery home screen
            }
        });
    }; 

     //upload the selected cover image to s3 bucket
     uploadCoverImageOnS3 = async () => {
        //console.log('inside aws')
        //S3 congiq details
        await this.connectApiToGetS3Details();
        //S3 congiq details
        const s3bucket = new AWS.S3({
            //accessKeyId: 'AKIAVEHR3DJ25VY6HAHO',
            accessKeyId: this.state.s3Access,
            secretAccessKey: this.state.s3Secret,
            //secretAccessKey: '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',
            Bucket: this.state.s3Bucket,
            //region: 'Asia Pacific (Mumbai)' ,
            signatureVersion: 'v4',
        });
        //console.log('s3 bucket data:', this.state.profilePath,'---',this.state.fileName)
        var currentTime = new Date().toString();                                     //get the current time to add fileName
        const base64Content = await fs.readFile(this.state.coverPath, "base64");      
        const arrayBuffer = decode(base64Content);
        
        //params to upload image to s3
        const params = {
            Bucket: this.state.s3Bucket,
            Key: 'UserProfile/'+currentTime + this.state.coverFileName,
            Body: arrayBuffer,
            //ContentDisposition: contentDeposition,
            //ContentType: contentType, 
        };

        //function to upload image to s3
        s3bucket.upload(params, async(err, data) => {
            if (err) {
                console.log('error in callback');
            } else {
                console.log("Response URL : "+ data.Location);
                await this.setState({coverPic: data.Location});
                await this.connectApiToUploadProfile();                    //after uploaded to s3 store details in server               
                //await this.NAVIGATE_TO_GALLERY_HOME();                 // after all navigate to gallery home screen
            }
        });
    }; 

    //connect server to get s3 bucket details
    connectApiToGetS3Details = async () =>{
        try { 
            await fetch('http://192.168.1.7:3000/key', {
                method: 'GET',
            })
            .then(res => res.json())
            .then( async data =>{
                //console.log('s3 data:',data)
                this.setState({s3Access: data.accessKeyId});
                this.setState({s3Secret: data.secretAccessKey});
                this.setState({s3Bucket: data.Bucket});
            })
        } catch (error) {
           console.log('the catch error',error)
        }
    }

    //sent data to server when button is pressed
    sentDataOnPress= async () => {
        //if profile or cover pic is present upload image to s3 or else just sent old cover and profile img data to server 
        if(!!this.state.profilePic || !!this.state.coverPic) {
            //if profile image is present, upload profile pic to s3 orelse cover pic
            if(!!this.state.profilePic) {
                //inside profile upload to s3 there is cover upload to if cover pic is present
                await this.uploadProfileImageOnS3();
            }else {
                await this.uploadCoverImageOnS3();
            }
        } else {
            await this.connectApiToUploadProfile();
        }
    }

    //api to store img datas in server including s3 img url
    connectApiToUploadProfile = async () => {
        //console.log('inseide server connecting api:')
        //console.log('profile pic to server:',this.state.profilePic,'---',this.state.prevProfilePic,'---',(!!this.state.profilePic ? this.state.prevProfilePic : this.state.profilePic))
        try { 
            await fetch('http://10.0.2.2:3000/login-signup/uploadprofiledetail', {
                method: 'PUT',
                headers: {
                    'Content-Type' : 'application/json',
                    //  'enctype': 'multipart/form-data' 
                },
                body: JSON.stringify({
                    //id: '5f1e9af143c44424b8e0da25',
                    unique_id: this.state.userId,
                    username: this.state.setUserName,
                    gender: this.state.gender,
                    profilePic: !!this.state.profilePic ? this.state.profilePic : this.state.prevProfilePic,
                    coverPic: !!this.state.coverPic ? this.state.coverPic : this.state.prevCoverPic,
                    location: this.state.location,
                    about: this.state.about,
                    interest: this.state.interests,
                })
            })
            .then(res => res.text())
            .then(async (data) =>{
                console.log(data)
                await this.NAVIGATE_TO_GALLERY_HOME();
            })
        } catch (error) {
           console.log('the catch error',error)
        } 
    } 

    //navigation function for gallery home page
    NAVIGATE_TO_GALLERY_HOME =() => {
        this.props.navigation.navigate('Gallery_Home');
    }

    trimInput =() => {
        if (this.state.userName.trim() === "") {
            this.setState({ nameError: " *name is required."});
        } else {
            this.setState({ nameError: null});
        }
    }

    setAboutCont = async(text) => {
       await this.setState({about: text})
    }

    render () {
        return (
            <View style= {Styles.Container}>
                <View style= {Styles.HeaderContainer}>
                    <Icon name='menu' type='entypo'  size= {30} color= {Colors.white}/>
                    <View style={{flexDirection: 'column', justifyContent: 'space-between', paddingTop: hp(2.211), paddingLeft: hp(2.95), paddingRight: hp(17.275)}}>                    
                        <Text style={Styles.HeaderText}>Profile Completion</Text>
                        <Text style={Styles.SubHeaderText}>Add details</Text>
                    </View>
                </View>
                <View style= {Styles.ContentContainer}>
                    <ScrollView>
                        <View style={{justifyContent: 'center', alignItems: 'center',marginTop: hp('3%')}}>
                                {this.state.isProfileImg ?
                                    (!!this.state.profilePic ?  
                                        (<View>
                                            <Avatar rounded containerStyle={{borderColor: Colors.white}} size={hp('15%')} source={{ uri: this.state.profilePic}} />
                                            <Icon name='edit' type='materialicons' size={25} onPress={this.chooseProfileImg} color={Colors.PrimaryColor_2} containerStyle={Styles.IconContainer} />
                                         </View>) :
                                        (<View>
                                            <Avatar rounded containerStyle={{borderColor: Colors.white}} size={hp('15%')} source={{ uri: this.state.prevProfilePic}} />
                                            <Icon name='edit' type='materialicons' size={25} onPress={this.chooseProfileImg} color={Colors.PrimaryColor_2} containerStyle={Styles.IconContainer} />
                                        </View>)
                                    ):
                                    (<Avatar rounded containerStyle={{borderColor: Colors.white}} onPress={this.chooseProfileImg} size={hp('15%')} icon={{name: 'user', type: 'entypo', color: Colors.SecondaryColor_2, size: hp('7%')}} />)
                                }   
                            <Text style={Styles.userNameText}>{this.state.getUserName}</Text>
                        </View>
                        <View style={Styles.InputContainer}>
                            <Text style={Styles.InputTextContainer}>User name</Text>
                            <View style={Styles.TextInputContainer}> 
                                <TextInput style={Styles.TextInput}
                                    placeholder='Your name'
                                    placeholderTextColor= {Colors.SecondaryColor_2}
                                    //autoFocus
                                    returnKeyType = { "next" }
                                    onSubmitEditing={() => this.ref_input2.current.focus()}
                                    blurOnSubmit={false}
                                    clearTextOnFocus= {true}
                                    selectionColor={Colors.SecondaryColor_2}
                                    onChangeText={text => this.setState({setUserName: text})}
                                    value={this.state.setUserName} 
                                />
                            </View>
                            <Text style={Styles.InputTextContainer}>Add location</Text> 
                            <View style={Styles.TextInputContainer}>
                                <TextInput style={Styles.TextInput}
                                    placeholder='Enter your current location'
                                    placeholderTextColor= {Colors.SecondaryColor_2}
                                    returnKeyType = { "next" }
                                    ref={this.ref_input2}
                                    blurOnSubmit={false}
                                    clearTextOnFocus= {true}
                                    selectionColor={Colors.SecondaryColor_2}
                                    onChangeText={text => this.setState({location:text})}
                                    value={this.state.location} 
                                />
                            </View>
                            <Text style={Styles.InputTextContainer}>Add cover image</Text>
                            <View style={Styles.ImageContainer}>
                                {this.state.isCoverImg ? 
                                    (!!this.state.coverPic ? 
                                        (<ImageBackground source={this.state.coverPic} style={{ borderRadius: hp(1.44),width: wp('90%'), height:  Constants.windowHeight/4}}>
                                            <View style={{position: 'relative',top: hp('6.8%'),left: wp('62%'),flexDirection: 'row',justifyContent:'center', alignItems: 'center', height: hp('5%'),width: wp('8%')}}>
                                                <Icon name='close' type='antdesign' size={20} onPress={()=> {this.setState({coverPic: ''});this.setState({isCoverImg: false})}} color={Colors.PrimaryColor_2} containerStyle={Styles.CloseIconContainer} />
                                            </View>
                                        </ImageBackground>) :
                                        (<ImageBackground source={{uri: this.state.prevCoverPic}} style={{ borderRadius: hp(1.44),width: wp('90%'), height:  Constants.windowHeight/4}}>
                                            <View style={{position: 'relative',top: hp('6.8%'),left: wp('62%'),flexDirection: 'row',justifyContent:'center', alignItems: 'center', height: hp('5%'),width: wp('8%')}}>
                                                <Icon name='close' type='antdesign' size={20} onPress={()=> {this.setState({coverPic: ''});this.setState({isCoverImg: false})}} color={Colors.PrimaryColor_2} containerStyle={Styles.CloseIconContainer} />
                                            </View>
                                        </ImageBackground>)
                                    ) : 
                                    (<View style={{opacity: 0.5}}>
                                        <Icon name='image-inverted' type='entypo' style={{ opacity:0.1}} size= {50} onPress={this.chooseCoverImg}/>
                                        <Text style={{fontFamily:Constants.fontRegular,lineHeight: hp(1.77),fontSize: hp(1.44), opacity: 0.5}}>(Upload image below 10Mb)</Text>
                                    </View>)
                                } 
                            </View>
                            <Text style={Styles.InputTextContainer}>Gender</Text> 
                            <View style={Styles.TextInputContainer}>
                                <DropDownPicker
                                    items={[ {label: 'Male', value: 'Male'},{label: 'Female', value: 'Female'}]}
                                    containerStyle={Styles.DropdownContainer}
                                    placeholder= 'Select Gender'
                                    placeholderStyle= {{fontFamily: Constants.fontRegular, opacity: 0.5}}
                                    style={{backgroundColor: '#fafafa'}}
                                    itemStyle={{justifyContent: 'flex-start'}}
                                    dropDownStyle={{backgroundColor: '#fafafa'}}
                                    defaultValue= {this.state.gender}
                                    onChangeItem={item => this.setState({gender: item.value})}
                                />
                            </View>
                            <Text style={Styles.InputTextContainer}>Interests</Text> 
                            <View style={Styles.TextInputContainer}>
                                <TextInput style={Styles.TextInput}
                                    placeholder='Enter your interests'
                                    placeholderTextColor= {Colors.SecondaryColor_2}
                                    returnKeyType = { "next" }
                                    //ref={this.ref_input4}
                                    onSubmitEditing={() => this.ref_input5.current.focus()}
                                    blurOnSubmit={false}
                                    clearTextOnFocus= {true}
                                    selectionColor={Colors.SecondaryColor_2}
                                    onChangeText={text => this.setState({interests:text})}
                                    value={this.state.interests} 
                                />
                            </View>
                            <Text style={Styles.InputTextContainer}>About you</Text> 
                            <View> 
                                <View style={[Styles.TextInputContainer,{height: hp('25%')}]}>
                                    <TextInput style={[Styles.TextInput,{height: hp('25%'), padding: hp('0.5%'),marginBottom: hp(0.6)}]}
                                        placeholder='Enter your interests'
                                        placeholderTextColor= {Colors.SecondaryColor_2}
                                        returnKeyType = { "next" }
                                        ref={this.ref_input5}
                                        blurOnSubmit={false}
                                        clearTextOnFocus= {true}
                                        multiline= {true}
                                        maxLength= {250}
                                        selectionColor={Colors.SecondaryColor_2}
                                        onChangeText={text => {this.setAboutCont(text)}}
                                        value={this.state.about} 
                                    />
                                    <Text style={Styles.CountText}>{this.state.about.length}/250</Text>
                                </View>
                            </View>
                        </View>
                        <View style={Styles.ButtonContainer}>
                            <Button 
                                title='Post Image' 
                                titleStyle={{fontFamily: Constants.fontRegular,color: Colors.white, lineHeight: hp(2.95), fontSize: hp(2.211)}}
                                //containerStyle={{paddingVertical: hp(2.95)}}
                                //onPress={()=> {this.uploadImageOnS3()}}
                                onPress= {()=> {this.sentDataOnPress()}}
                                buttonStyle={{backgroundColor: Colors.PrimaryColor_2, borderRadius: hp(1.475),height: hp(6.637) }} 
                            />
                        </View>
                    </ScrollView>
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
        flex: 0.90,
        backgroundColor: Colors.PrimaryColor_1,
        paddingLeft: hp('2.95%'),
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    HeaderText: {
        fontFamily: Constants.fontProximaBold,
        fontWeight: 'bold',
        fontSize: hp('3.54'),
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
        flex: 4.20,
        //marginHorizontal: hp('2.95'),
        //marginVertical: hp(2.11),
        backgroundColor: Colors.white,
    },
    userNameText: {
        fontFamily: Constants.fontMedium,
        color: Colors.SecondaryColor_2,
        fontSize: hp(2.95),
        lineHeight: hp(3.685),
        marginTop: hp('-2%')
    },
    IconContainer: {
        borderColor: Colors.white, 
        position: 'relative' ,  
        top: hp('-6.2%'), 
        right: hp('-11.3%'),
        borderWidth: hp(0.1),
        backgroundColor: Colors.white, 
        width: wp('7.4%'), 
        height: hp('4.3%'),
        borderRadius: hp(100),
        elevation: 5
    },
    CloseIconContainer: {
        borderColor: Colors.white, 
        position: 'relative' ,  
        top: hp('-6.2%'), 
        right: hp('-11.3%'),
        borderWidth: hp(0.1),
        backgroundColor: Colors.white, 
        width: wp('6%'), 
        height: hp('3.25%'),
        borderRadius: hp(0.3),
        elevation: 5
    },
    InputContainer: {
        marginHorizontal: hp('2.95'),
        marginVertical: hp(2.11),
    },
    InputTextContainer: {
        fontFamily: Constants.fontMedium,
        color: Colors.SecondaryColor_2,
        fontSize: hp(2.211),
        lineHeight: hp(2.655),
        marginVertical: hp(2.11),
    },
    TextInputContainer: {
        marginHorizontal: hp(0.4) ,
        backgroundColor: Colors.white,
        
        elevation: 3,
        borderRadius: hp(1.434),
    },
    CountText: {
        position: 'relative',
        top: hp('-4.5%'),
        right: hp('-44%'),
        fontFamily: Constants.fontRegular,
        color: Colors.SecondaryColor_2,
        opacity: 0.2,
        fontSize: hp(2.211),
        lineHeight: hp(2.655),
    },
    TextInput: {
        height: Constants.windowHeight/16.24, 
        borderColor: Colors.SecondaryColor_1,
        fontFamily: Constants.fontRegular,
        borderWidth: 2,
        borderRadius: hp(1.434),
        padding: hp(1),
        paddingLeft: hp(2.5),
        opacity: 0.5,
        alignItems: 'center', 
        backgroundColor: Colors.white, 
    },
    DropdownContainer: {
        height: Constants.windowHeight/16.24,
        //borderColor: Colors.SecondaryColor_1,
        //borderWidth: 2,
        //fontFamily: Constants.fontRegular,
        borderRadius: hp(1.434),
        //marginVertical: hp(2.11), 
        //backgroundColor: Colors.white,
    },
    DownIcon: {
        position: 'relative',
        left: wp('-10%'),
        zIndex: 1,
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
        borderWidth: hp(0.4),
        marginVertical: hp(2.11),
    }
})

    
/*
<View style={{flexDirection: 'row'}}>
                                <TextInput style={[Styles.TextInput, { width: Constants.windowWidth/2.5}]}
                                    placeholder='Select Gender'
                                    placeholderTextColor= {Colors.SecondaryColor_2}
                                    returnKeyType = { "next" }
                                    ref={this.ref_input3}
                                    onSubmitEditing={() => this.ref_input4.current.focus()}
                                    blurOnSubmit={false}
                                    clearTextOnFocus= {true}
                                    selectionColor={Colors.SecondaryColor_2}
                                    onChangeText={text => this.setState({gender:text})}
                                    value={this.state.gender} 
                                />
                                <Icon name='down' type='antdesign' style={Styles.DownIcon}  size= {20} color= {Colors.black}/>
                            </View>

{!!this.state.nameError && (
                                <Text style={{color: 'red',marginTop: hp('-1%'),marginBottom: hp('1%')}}>{this.state.nameError}</Text>)}

{this.state.isImage? 
                                    (<Avatar rounded containerStyle={{borderColor: Colors.white,elevation: 5}} size={hp('15%')} source={this.state.currentImage} />):
                                    (<Avatar rounded containerStyle={{borderColor: Colors.white,elevation: 5}} size={hp('15%')} source={{ uri: this.state.profilePic}} />)
                                }
accessory={<Icon name='mode-edit' type='material' color={Colors.PrimaryColor_2} underlayColor={Colors.white} />}
*/