import React, { Component, createRef } from 'react';
import { View, StyleSheet, Text, TextInput, ScrollView, Image,KeyboardAvoidingView, Platform} from 'react-native';
import { Constants, Colors } from '../../Styles';
import { Icon, Avatar, Button } from 'react-native-elements';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import ImagePicker from 'react-native-image-picker';
import { ProfilePic } from '../../Components';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
//import CardView from 'react-native-cardview';
var AWS = require('aws-sdk/dist/aws-sdk-react-native');
import { decode } from "base64-arraybuffer";
import * as fs from 'react-native-fs';

export default class PostScreen extends Component {

    constructor(props) {
        super(props) 
        this.state ={
            title: '',                                   //optional title for img
            location: '',                                //location for img
            tags: '',                                    //tags to specify img later used for search
            image: '',                                   //img from local device
            filePath: '',          
            isImage: false,                              //display image when image is picked otherwise it will show icon to pick images
            currentImage: '',                            
            fileName: '',                                //set fileName with timeStamp for identification
            s3ImgUrl: '',                                //uploaded img Url from s3 
            s3Secret: '',
            s3Access: '',
            s3Bucket: ''
        }
    }
        
        //refs for ux purpose to navigate to next field by click
        ref_input2 = createRef();
        ref_input3 = createRef();
        ref_input4 = createRef();

        //choose file from local device to upload s3
        chooseFile = () => {
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
            ImagePicker.launchImageLibrary(options, response => {
                //console.log('Response = ', response.uri,'----',response.fileName,'---',response.timestamp);
        
                if (response.didCancel) {
                    console.log('User cancelled image picker');
                } else if (response.error) {
                    console.log('ImagePicker Error: ', response.error);
                } else {
                    let source = response;
                    let imgSrc = { uri: response.uri };
                    //console.log('the image data:',response)
                    // You can also display the image using data:
                    // let source = { uri: 'data:image/jpeg;base64,' + response.data };
                    this.setState({
                        filePath: source.uri,                           //set the filePath to display the picked image
                    });
                    this.setState({
                        fileName: source.fileName,                      // set the temporary fileNAme
                    });
                    this.setState({isImage: true})                      //image is picked.so, set true to display the image
                    this.setState({currentImage: imgSrc})
                }
            });
        };

        //upload the selected image to s3 bucket
        uploadImageOnS3 = async () => {
            //console.log('inside aws loop',this.state.filePath,'--',this.state.isImage)
            //connect server to get s3 bucket details
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

            //let contentType = 'image/jpg';
            //let contentDeposition = 'inline;filename="' + this.state.filePath + '"';
            var currentTime = new Date().toString();                                     //get the current time to add fileName
            const base64Content = await fs.readFile(this.state.filePath, "base64");      
            const arrayBuffer = decode(base64Content);
            //params to upload image to s3
            const params = {
                Bucket: this.state.s3Bucket,
                Key: 'Gallery/'+currentTime + this.state.fileName,
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
                    await this.setState({s3ImgUrl: data.Location});
                    await this.connectApiToUploadImg();                    //after uploaded to s3 store details in server               
                    await this.NAVIGATE_TO_GALLERY_HOME();                 // after all navigate to gallery home screen
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
                    console.log('s3 data:',data)
                    this.setState({s3Access: data.accessKeyId});
                    this.setState({s3Secret: data.secretAccessKey});
                    this.setState({s3Bucket: data.Bucket});
                })
            } catch (error) {
               console.log('the catch error',error)
            }
        }

        //api to store img datas in server including s3 img url
        connectApiToUploadImg = async () => {
            try { 
                //console.log('you are in upload api')
                await fetch('http://10.0.2.2:3000/gallery/createpostimage', {
                    method: 'POST',
                    headers: {
                        'Content-Type' : 'application/json',
                        //  'enctype': 'multipart/form-data' 
                    },
                    body: JSON.stringify({
                        unique_id: '5f1e9af143c44424b8e0da25',
                        title: this.state.title,
                        location: this.state.location,
                        url: this.state.s3ImgUrl,
                        tag: this.state.tags,
                    })
                })
                .then(res => res.text())
                .then(data =>{
                  console.log(data)
                })
             } catch (error) {
               console.log('the catch error',error)
            } 
        }  

        //function to navigate gallery home page
        NAVIGATE_TO_GALLERY_HOME = () => {
            this.props.navigation.navigate('Gallery_Home');
        }
         
    render () {
        return (
            <View style= {Styles.Container}>
                <View style= {Styles.HeaderContainer}>
                    <View style={{flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center'}}>
                        <Icon name='arrowleft' type='antdesign'  size= {30} onPress={this.NAVIGATE_TO_GALLERY_HOME} color= {Colors.white}/>
                        <View style={{flexDirection: 'column', width: wp('67%'),justifyContent: 'space-between', paddingTop: hp(2.211), paddingLeft: hp(2.95)}}>                    
                            <Text style={Styles.HeaderText}>Post Image</Text>
                            <Text style={Styles.SubHeaderText}>Upload or click the image</Text>
                        </View>
                        <ProfilePic />
                    </View> 
                </View>
                <View style= {Styles.ContentContainer}>
                    <ScrollView showsVerticalScrollIndicator={false}>
                    <Text style={Styles.ContentHeaderText}>Upload or Capture a photo</Text>
                    <Text style={Styles.ContentSubHeaderText}>Title(optional)</Text>
                    <View style={Styles.TextInputContainer}>
                        <TextInput style={Styles.TextInput}
                            placeholder='Enter Title'
                            placeholderTextColor= {Colors.SecondaryColor_2}
                            autoFocus
                            blurOnSubmit={false}
                            selectionColor={Colors.PrimaryColor_1}
                            onChangeText={text => this.setState({title:text})}
                            value={this.state.title} 
                        />
                    </View>
                    <Text style={Styles.ContentSubHeaderText}>Upload image or video</Text>
                    <View style={Styles.ImageContainer}>
                          {this.state.isImage ?
                           (<Image source={this.state.currentImage} style={{resizeMode:'cover', borderRadius: hp(1.44),width: wp('90%'), height:  Constants.windowHeight/4}} />): 
                           (<View style={{opacity: 0.3}}>
                                <Icon name='image-inverted' type='entypo' style={{ opacity:0.1}} size= {50} onPress={this.chooseFile}/>
                                <Text style={{fontFamily:Constants.fontRegular,lineHeight: hp(1.77),fontSize: hp(1.44), opacity: 0.5}}>(Upload image below 10Mb)</Text>
                            </View>)
                           } 
                    </View>
                    <Text style={Styles.ContentSubHeaderText}>Location</Text>
                    <View style={[Styles.TextInputContainer,{marginTop: hp(0.5)}]}>
                        <TextInput style={Styles.TextInput}
                            placeholder='Example: Chennai'
                            placeholderTextColor= {Colors.SecondaryColor_2}
                            returnKeyType = { "next" }
                            ref = {this.ref_input3}
                            onSubmitEditing={() => this.ref_input4.current.focus()}
                            blurOnSubmit={false}
                            selectionColor={Colors.PrimaryColor_1}
                            onChangeText={text => this.setState({location:text})}
                            value={this.state.location} 
                        />
                    </View>
                    <Text style={Styles.ContentSubHeaderText}>Tags</Text>
                    <View style={[Styles.TextInputContainer,{marginTop: hp(0.5), marginBottom: hp(0.5)}]}>
                        <TextInput style={Styles.TextInput}
                            placeholder='#divine #devotional #baba'
                            placeholderTextColor= {Colors.SecondaryColor_2}
                            returnKeyType = { "go" }
                            ref = {this.ref_input4}
                            blurOnSubmit={false}
                            selectionColor={Colors.PrimaryColor_1}
                            onChangeText={text => this.setState({tags:text})}
                            value={this.state.tags} 
                        />
                    </View>
                    </ScrollView>
                </View>
                <View style={Styles.ButtonContainer}>
                    <Button 
                        title='Post Image' 
                        titleStyle={{fontFamily: Constants.fontRegular,color: Colors.white, lineHeight: hp(2.95), fontSize: hp(2.211)}}
                        //containerStyle={{paddingVertical: hp(2.95)}}
                        onPress={()=> {this.uploadImageOnS3()}}
                        disabledStyle={{backgroundColor: Colors.PrimaryColor_2,}}
                        disabledTitleStyle={{fontFamily: Constants.fontRegular,color: Colors.white, lineHeight: hp(2.95), fontSize: hp(2.211)}}
                        disabled={(!this.state.filePath) || (!this.state.location) || (!this.state.tags)}
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
        /*flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',*/
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
        flex: 5,
        paddingVertical: hp(2.95),
        paddingHorizontal: hp(2.95),
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
    TextInput: {
        height: Constants.windowHeight/16.24, 
        borderColor: Colors.SecondaryColor_1,
        borderWidth: StyleSheet.hairlineWidth, 
        fontFamily: Constants.fontRegular,
        //borderWidth: 2,
        borderRadius: hp(1.434),
        padding: hp(1),
        paddingLeft: hp(2.5),
        opacity: 0.5,
        alignItems: 'center',
    },
    TextInputContainer: {
        marginHorizontal: hp(0.4) ,
        backgroundColor: Colors.white,
        elevation: 3,
        borderRadius: hp(1.434),
    },
    ContentSubHeaderText: {
        fontFamily: Constants.fontMedium,
        fontSize: hp(2.211),
        lineHeight: hp(2.655),
        color: Colors.SecondaryColor_2,
        fontWeight: 'bold',
        //marginVertical: hp(2.25) 
        marginVertical: hp(1.95)
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
    }
})
