import React, { Component } from 'react';
import { View, StyleSheet, Text, ScrollView, FlatList, Image, Platform, YellowBox, PermissionsAndroid,TouchableOpacity, TouchableHighlight,ImageBackground} from 'react-native';
import { Constants, Colors } from '../../Styles';
import { Icon, Avatar, SearchBar, ListItem } from 'react-native-elements';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import FastImage from 'react-native-fast-image'
import RNFetchBlob from 'rn-fetch-blob';

export default class GalleryHomeScreen extends Component {

    constructor(props) {
        super(props) 
        this.state ={
            search: '',
            imgUrlsData: [],
            firstImg: '',
            secondImg: '',
            thirdImg: '',
            remainingImgUrls: [],
            viewsList: []
        }
    }
    componentDidMount() {
        this.connectApi();
        this.connectApiForView();
        YellowBox.ignoreWarnings([
            'VirtualizedLists should never be nested', // TODO: Remove when fixed
        ])
    }

    //connect the server and get data
    connectApi = async () => {
        try { 
          await fetch('http://192.168.1.7:3000/gallery/allimageurl', {
             method: 'GET',
           })
           .then(res => res.json())
           .then( async data =>{
             //set the data in the state imgUrlsData array by setState  
             var remainingImage= data.slice(3) 
             this.setState({imgUrlsData: data}) 
             this.setState({firstImg: this.state.imgUrlsData[0].url})
             this.setState({secondImg: this.state.imgUrlsData[1].url})
             this.setState({thirdImg: this.state.imgUrlsData[2].url})
             this.setState({remainingImgUrls: remainingImage})
             //console.log('the img url from server:',this.state.remainingImgUrls);
           })
         } catch (error) {
           console.log('the catch error',error)
         } 
    }  

    connectApiForView = async () => {
        try { 
          await fetch('http://192.168.1.7:3000/gallery/views', {
             method: 'GET',
           })
           .then(res => res.json())
           .then( async data =>{
             //set the data in the state imgUrlsData array by setState  
             this.setState({viewsList: data})
             //console.log('the views data from server:',data,'--',this.state.viewsList);
           })
         } catch (error) {
           console.log('the catch error',error)
         } 
    }

    updateSearch = (search) => {
        this.setState({ search });
    };

    renderImgs( {item} ) {
        return (
            <TouchableHighlight>
                <FastImage source={{uri: item.url}} resizeMode={FastImage.resizeMode.cover} style={[Styles.Images,{marginRight: hp(2),marginVertical: hp(1)}]}/>
            </TouchableHighlight>
        )
    } 

    NAVIGATE_TO_GALLERY_FULL = () => {
        this.props.navigation.navigate('Gallery_Full');
    }

    NAVIGATE_TO_GALLERY_POST = () => {
        this.props.navigation.navigate('Gallery_Post');
    }

    NAVIGATE_TO_GALLERY_PROFILE({item})  {
        this.props.navigation.navigate('Gallery_Profile',{userName: item.location})
    }

    checkPermission = async () => {
    
        //Function to check the platform
        //If iOS the start downloading
        //If Android then ask for runtime permission
    
        console.log('inside download function')
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
    
    downloadImage = () => {
        //Main function to download the image
        let date = new Date(); //To add the time suffix in filename
        //Image URL which we want to download
        let image_URL =
          'https://raw.githubusercontent.com/AboutReact/sampleresource/master/gift.png';
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
    
    getExtention = filename => {
        //To get the file extension
        return /[.]/.exec(filename) ? /[^.]+$/.exec(filename) : undefined;
    };
    
    

    renderViews( {item} ) {
        let that= this
        return (
           <View style={{flexDirection: 'row', justifyContent: 'flex-start',alignItems: 'center',marginBottom: hp(2.11)}}>
               <View style={{borderRadius: hp(1.44), borderColor: Colors.white, overflow: 'hidden',elevation: 5}}>
                    <ImageBackground source={{uri: item.url}} style={{width: wp('21%'), height: hp('11.5%'), flexDirection: 'row',justifyContent: 'flex-end',alignItems: 'flex-end'}}>
                        <View style={{flexDirection: 'row',justifyContent:'center', alignItems: 'center', height: hp('5%'),width: wp('8%'), backgroundColor: Colors.white}}>
                            <Icon name='staro' type='antdesign' size= {20} color= {Colors.PrimaryColor_2}  />
                        </View>
                    </ImageBackground>
                </View>
                <View style={{marginHorizontal: hp(2.95), marginTop: hp(-2),flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start'}}>
                    <Text style={{fontFamily: Constants.fontProximaBold, color: Colors.SecondaryColor_2, fontSize: hp(2.95), lineHeight: hp(3.54)}} >{item.location}</Text>
                    <Text style={{fontFamily: Constants.fontProximaReg, color: Colors.SecondaryColor_2, fontSize: hp(1.77), lineHeight: hp(2.211)}}>{item.location}</Text>
                    <View style={{opacity: 0.4, marginTop: hp(0.3), flexDirection: 'row',justifyContent: 'flex-start',}}>
                        <Icon name='eye' type='antdesign' size= {15} />
                        <Text style={{marginLeft: hp(1) ,fontFamily: Constants.fontProximaReg, color: Colors.SecondaryColor_2, fontSize: hp(1.77), lineHeight: hp(2.211)}}>45678</Text>
                    </View>
                </View>
                <View style= {{flexDirection: 'row',justifyContent: 'center',alignItems: 'flex-end',marginLeft: wp('37%')}}>
                    <Icon name='download' type='antdesign'  size= {30} onPress={that.checkPermission} color= {Colors.PrimaryColor_2} />
                </View>
           </View>
        )
    }

    render () {
        return (
            <View style= {Styles.Container}>
                <View style= {Styles.HeaderContainer}>
                    <Icon name='arrowleft' type='antdesign'  size= {30} color= {Colors.white} onPress={this.Navigate_To_Med_Player}/>
                    <View style={{flexDirection: 'column', justifyContent: 'space-between', paddingTop: hp(2.211), paddingLeft: hp(2.95), paddingRight: hp(17.275)}}>                    
                        <Text style={Styles.HeaderText}>Sai Gallery</Text>
                        <Text style={Styles.SubHeaderText}>Exclusive updates</Text>
                    </View>
                    <View style={{ paddingRight: hp(2.95), paddingTop: hp(3.685)}}>
                        <Avatar size={60} rounded  source={require("../../../Images/saibaba_loginScreen.jpg")} />
                    </View>
                </View>
                <View style= {Styles.ContentContainer}>
                    <ScrollView>
                        <SearchBar
                            placeholder="Search for topics" 
                            platform= 'android'
                            placeholderTextColor= {Colors.SecondaryColor_2}
                            containerStyle={{backgroundColor:Colors.white, marginHorizontal: hp('2.95'),height: hp(7.40),borderRadius: hp(1.44),elevation: 5,borderColor: Colors.white}}
                            inputContainerStyle={{backgroundColor:Colors.white, height: hp(6),borderRadius: hp(1.44)}}
                            onChangeText={this.updateSearch}
                            value={this.state.search}/>
                        <View style={Styles.ImagesContainer}>
                            <View style={{flexDirection: 'row',marginBottom: hp(1)}}>
                                <View>
                                    <TouchableOpacity>
                                        <FastImage source={{uri: this.state.firstImg}} resizeMode={FastImage.resizeMode.cover} style={{width: wp('69.25%'), height: hp('26%'), backgroundColor: Colors.SecondaryColor_2, borderRadius: hp(1.44),borderColor: Colors.white, elevation: 4}}/>
                                    </TouchableOpacity>
                                </View>
                                <View style={{marginLeft: hp(2),justifyContent: 'space-between'}}>
                                    <TouchableOpacity>
                                        <FastImage source={{uri: this.state.secondImg}} resizeMode={FastImage.resizeMode.cover} style={[Styles.Images]}/>
                                    </TouchableOpacity>
                                    <TouchableOpacity>
                                        <FastImage source={{uri: this.state.thirdImg}} resizeMode={FastImage.resizeMode.cover} style={[Styles.Images]}/>  
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
                                <FlatList data={this.state.remainingImgUrls}
                                    renderItem= {this.renderImgs}
                                    keyExtractor={item => item.id} 
                                    numColumns = {4}
                                    horizontal= {false}
                                />
                            </View>
                            <View style={Styles.ContentTextContainer}>
                                <Text style={Styles.ContentText} onPress={this.NAVIGATE_TO_GALLERY_FULL}>View more</Text>
                            </View>
                            <View style={Styles.ViewContainer}>
                                <Text style={Styles.ViewHeaderText}>Top Views</Text>
                                <FlatList data={this.state.viewsList}
                                    renderItem= {this.renderViews}
                                    keyExtractor={item => item.id} 
                                />
                            </View>
                        </View>    
                    </ScrollView>
                    <View style={Styles.IconContainer}>
                        <Icon name='camera' type='antdesign'  size= {25} color= {Colors.white} onPress={this.NAVIGATE_TO_GALLERY_POST} style={{borderColor: Colors.PrimaryColor_1}}/>
                    </View>
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
        marginVertical: hp(2.11),
        backgroundColor: Colors.white,
    },
    ImagesContainer: {
        marginVertical: hp(2.95),
        marginHorizontal: hp(2.11)
    },
    Images: {
        width: wp('20.75%'),
        height: hp('11.5%'),
        borderRadius: hp(1.44),
        borderColor: Colors.white,
        elevation: 4
    },
    ContentTextContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: hp(2.55)
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
    IconContainer: {
        position: 'absolute',
        right: 20,
        bottom: 15,
        backgroundColor: Colors.PrimaryColor_1, 
        height: hp('10%'), 
        width: wp('17%'), 
        borderRadius: hp('100'),
        elevation: 7,
        justifyContent: 'center',
        alignItems: 'center'
    }
})

/*
<Image source={{uri: this.state.firstImg}} style={{width: wp('68%'), height: hp('25%'),resizeMode: 'cover',borderRadius: hp(1.44)}}/>
<Image source={{uri: this.state.imgUrlsData[0].url}} style={{width: wp('75%'), height: hp('25%'),resizeMode: 'cover'}}/>
    <FlatList data={this.state.remainingImgUrls}
            renderItem= {this.renderItem}
            keyExtractor={item => item.id} 
        />

     <ListItem 
            leftAvatar={(<Avatar size={'large'} source={{uri: item.url}} iconStyle={{borderRadius: hp(1.44)}} />)}
            title={item.location}
            titleStyle={{fontFamily: Constants.fontMedium, fontWeight: 'bold', fontSize: hp(2.211), lineHeight: hp(2.655)}}
            subtitle={item.location}
            subtitleStyle={{fontFamily: Constants.fontRegular, fontSize: hp(1.77), lineHeight: hp(2.655)}}
            rightIcon={(<Icon name='download' type='antdesign'  size= {30} color= {Colors.PrimaryColor_2} />)}
            />
*/