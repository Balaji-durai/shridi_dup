import React, { Component } from 'react';
import { View, StyleSheet, Text, ScrollView, Image, FlatList, TouchableWithoutFeedback, TouchableOpacity, PermissionsAndroid, Platform,} from 'react-native';
import { Constants, Colors } from '../../Styles';
import { Icon, Avatar } from 'react-native-elements';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import RNFetchBlob from 'rn-fetch-blob';
import FastImage from 'react-native-fast-image'
import { ProfilePic } from '../../Components';

export default class GalleryDownloadScreen extends Component {

    constructor(props) {
        super(props) 
        this.state ={
            imgUrl: this.props.route.params.imgUrl,               //get the imgUrl to download from route parameter from navigation
            firstImg: '',                                         //img to download
            imgUrlsData: [],                                      // download img data
            allImgUrlsData: [],                                   // remining imgs to shown below download portion
            imgDownloadUrl: '',
            imgDownloadTitle: '',
            imgDownloadViews: '',
            imgDownloadName: '',
            userId: '',
        }
    }

    componentDidMount() {
        this.connectApiForDownloadImg();
        this.connectApiForAllImg();
    }

    //connect the server and get data for img to download
    connectApiForDownloadImg = async () => {
        try { 
            await fetch('http://192.168.1.7:3000/gallery/details', {
                method: 'PUT',
                headers: {
                    'Content-Type' : 'application/json',
                    //  'enctype': 'multipart/form-data' 
                },
                body: JSON.stringify({
                    url: this.state.imgUrl                                //send imgUrl to server to get the img details
                })
            })
            .then(res => res.json())
            .then( data => {
                //set the data in the state imgUrlsData array by setState  
                console.log('the download img data:', this.state.imgUrl,'--',data,"---",data[0].userinfo._id)
                this.setState({imgUrlsData: data}) 
                this.setState({userId: data[0].userinfo._id})
                this.setState({imgDownloadUrl: data[0].url})
                this.setState({imgDownloadTitle: data[0].location})
                this.setState({imgDownloadViews: data[0].views})
                this.setState({imgDownloadName: data[0].userinfo.usNm})
                //this.setState({firstImg: this.state.imgUrlsData[0].url})
                //console.log('the img data from state:',this.state.imgDownloadUrl);
            })
        } catch (error) {
            console.log('the catch error',error)
        } 
    }  

    //connect the server and get data all img urls
    connectApiForAllImg = async () => {
        try { 
            await fetch('http://192.168.1.7:3000/gallery/allimageurl', {
                method: 'GET',
            })
            .then(res => res.json())
            .then( data =>{
                //set the data in the state imgUrlsData array by setState   
                this.setState({allImgUrlsData: data});
                //console.log('the img url from server:',this.state.remainingImgUrls);
            })
        } catch (error) {
           console.log('the catch error',error)
        } 
    } 

    //navigation function for gallery home page
    Navigate_To_GALLERY_HOME =() => {
        this.props.navigation.navigate('Gallery_Home');
    }

    //navigation function for gallery PROFILE page
    Navigate_To_GALLERY_PROFILE =() => {
        this.props.navigation.navigate('Gallery_Profile',{userId: this.state.userId});
    }

    //get Permission to read external storage
    checkPermission = async () => {
    
        //Function to check the platform
        //If iOS the start downloading
        //If Android then ask for runtime permission
        if (Platform.OS === 'ios') {
          this.downloadImage();
        } else {
          try {
            const granted = await PermissionsAndroid.request(
              PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
              //Once user grant the permission start downloading
              console.log('Storage Permission Granted.');
              this.downloadImage();
            } else {
              //If permission denied then show alert 'Storage Permission Not Granted'
              console.log('Storage Permission Not Granted');
            }
          } catch (err) {
            //To handle permission related issue
            console.warn(err);
          }
        }
    };
    
    //download the image and store in external storage
    downloadImage = () => {
        //Main function to download the image
        let date = new Date(); //To add the time suffix in filename
        //Image URL which we want to download
        let image_URL = this.state.imgUrl;
        //Getting the extention of the file
        var ext = this.getExtention(image_URL);
        var extn = '.' + ext[0];
        //Get config and fs from RNFetchBlob
        //config: To pass the downloading related options
        //fs: To get the directory path in which we want our image to download
        const { config, fs } = RNFetchBlob;
        let PictureDir = fs.dirs.PictureDir;
        let options = {
          fileCache: true,
          addAndroidDownloads: {
            //Related to the Android only
            useDownloadManager: true,
            notification: true,
            path:
              PictureDir +
              '/image_' + Math.floor(date.getTime() + date.getSeconds() / 2) + extn,
            description: 'Image',
          },
        };
        config(options)
          .fetch('GET', image_URL)
          .then(res => {
            //Showing alert after successful downloading
            console.log('res -> ', JSON.stringify(res));
          });
    };
    
    //get the extension of image file
    getExtention = filename => {
        //To get the file extension
        return /[.]/.exec(filename) ? /[^.]+$/.exec(filename) : undefined;
    };

    setImage = (item) => {
        this.setState({imgUrlsData: item})
    }

    //function to display all imgs
    renderImgs= ( {item } ) => {
        return (
            <TouchableWithoutFeedback >
                <FastImage source={{uri: item.url}} resizeMode={FastImage.resizeMode.cover} style={[Styles.Images,{marginRight: hp(2),marginVertical: hp(1)}]}/>
            </TouchableWithoutFeedback>
        )
    } 

    render () {
        return (
            <View style= {Styles.Container}>
                <View style= {Styles.HeaderContainer}>
                    <Icon name='arrowleft' type='antdesign'  size= {30} color= {Colors.white} onPress={this.Navigate_To_GALLERY_HOME}/>
                    <View style={{flexDirection: 'column', justifyContent: 'space-between', paddingTop: hp(2.211), paddingLeft: hp(2.95), paddingRight: hp(17.275)}}>                    
                        <Text style={Styles.HeaderText}>Sai Gallery</Text>
                        <Text style={Styles.SubHeaderText}>Exclusive updates</Text>
                    </View>
                    <ProfilePic />
                </View>
                <View style= {Styles.ContentContainer}>
                    <ScrollView> 
                        <Image source={{uri: this.state.imgDownloadUrl}} style={Styles.ImagesContainer}/>
                        <View style={Styles.ContentTextContainer}>
                            <View style={{width: wp('61%'), justifyContent: 'space-around',marginLeft: hp(5.5)}}>
                                <Text style={{fontFamily: Constants.fontMedium,color: Colors.SecondaryColor_2,fontSize: hp(2.655), lineHeight: hp(3.54)}}>{this.state.imgDownloadTitle}</Text>
                               <Text style={{fontFamily: Constants.fontRegular,lineHeight: hp(2.211), marginTop: hp(0.75),fontSize: hp(1.77),color: Colors.SecondaryColor_2}}>Posted by 
                                    <Text onPress={this.Navigate_To_GALLERY_PROFILE} style={{color:Colors.PrimaryColor_2, marginLeft: hp(0.9),fontFamily: Constants.fontRegular,lineHeight: hp(2.211), fontSize: hp(1.77),}}>{this.state.imgDownloadName}</Text>
                                </Text>
                                <View style={{opacity: 0.5, marginTop: hp(0.3), flexDirection: 'row',justifyContent: 'flex-start',}}>
                                    <Icon name='eye' type='antdesign' size= {15} />
                                    <Text style={{marginLeft: hp(1) ,fontFamily: Constants.fontProximaReg, color: Colors.SecondaryColor_2, fontSize: hp(1.77), lineHeight: hp(2.211)}}>{this.state.imgDownloadViews}</Text>
                                </View>
                            </View>
                            <View style={{width: wp('39%'),justifyContent: 'center'}}>
                                <TouchableOpacity onPress={this.checkPermission} style={{backgroundColor: Colors.PrimaryColor_2, width: wp('30%'),height: hp('6%'), borderRadius: hp(1)}}>
                                    <View style={{flexDirection: 'row',justifyContent: 'center', marginTop: hp('1.65%')}}>
                                        <Text style={Styles.ButtonTextContiner}>Download</Text>
                                        <Icon name='download' type='antdesign'  size= {15}  color= {Colors.white} />
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={{flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: hp(2.44)}}>
                                <FlatList data={this.state.allImgUrlsData}
                                    renderItem= {this.renderImgs}
                                    keyExtractor={item => item.url} 
                                    numColumns = {4}
                                    horizontal= {false}
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
        flex: 4.20,
        //marginHorizontal: hp('2.95'),
        //marginVertical: hp(2.11),
        backgroundColor: Colors.white,
    },
    ImagesContainer: {
        //marginVertical: hp(2.95),
        //marginHorizontal: hp(2.11)
        width: wp('100%'), 
        height: hp('45%'),
        borderBottomLeftRadius: hp('2%'),
        borderBottomRightRadius: hp('2%'),
        resizeMode: 'cover',
        borderColor: Colors.white,
        elevation: 20
    },
    Images: {
        width: wp('20.47%'),
        height: hp('11.5%'),
        borderRadius: hp(0.35),
        borderColor: Colors.white,
        elevation: 4
    },
    ContentTextContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: hp(2.55),
        marginHorizontal: hp(2.11)
    },
    ContentText: {
        fontFamily: Constants.fontRegular,
        color: Colors.PrimaryColor_2,
        fontSize: hp(2.211),
        lineHeight: hp(2.95)
    },
    ViewContainer: {
        //marginHorizontal: hp(2.11)
    },
    ViewHeaderText: {
        fontSize: hp(2.655),
        fontFamily: Constants.fontMedium,
        color: Colors.SecondaryColor_2,
        lineHeight: hp(3.54),
        marginBottom: hp(2.11)
    },
    ButtonTextContiner: {
        color: Colors.white,
        fontFamily: Constants.fontProximaReg,
        fontSize: hp(2.211),
        lineHeight: hp(2.95),
        marginRight: hp(0.5)
    }
})
