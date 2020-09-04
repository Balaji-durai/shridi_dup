import React, { Component, useState, useEffect } from 'react';
import { View, StyleSheet, Text, ScrollView, FlatList, Image, AsyncStorage, Platform, YellowBox, PermissionsAndroid, TouchableWithoutFeedback, TouchableOpacity, TouchableHighlight, ImageBackground} from 'react-native';
import { Constants, Colors } from '../../Styles';
import { Icon, Avatar, SearchBar, ListItem } from 'react-native-elements';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import FastImage from 'react-native-fast-image'
import RNFetchBlob from 'rn-fetch-blob';
import { ProfilePic } from '../../Components';

export default class GalleryHomeScreen extends Component {

    constructor(props) {
        super(props) 
        this.state ={
            search: '',                           // for search
            imgUrlsData: [],                      // array for total image urls
            firstImg: '',                         // for first img url
            secondImg: '',                        // for second img url
            thirdImg: '',                         // for third img url
            remainingImgUrls: [],                 // for sliced img url to show in flatlist
            viewsList: [],                        // array for top list img datas
            imgOwnerNm: '',
            starData: [],                         // array for star setting data
            totalViewData: [],
            starValue: false,
            isSearchContPresent: true,
            unique_id: ''
        }
    }

    componentDidMount= async() => {
        const userId= await AsyncStorage.getItem('userId');
        await this.setState({unique_id: userId})
        this.connectApiForImgCont();
        this.connectApiForView();
        this.connectApiForStar();
        YellowBox.ignoreWarnings([
            'VirtualizedLists should never be nested', // TODO: Remove when fixed
        ])
    }

    //connect the server and get data for image container 
    connectApiForImgCont = async () => {
        try { 
            await fetch('http://192.168.1.7:3000/gallery/imagelimit', {
                method: 'GET',
            })
            .then(res => res.json())
            .then( async data =>{
                //set the data in the state imgUrlsData array by setState  
                //
                
                console.log('imageUrl:',data)
                this.setImgStateValues(data);
            })
        } catch (error) {
           console.log('the catch error',error)
        } 
    }  

    //api for getting top views section data
    connectApiForView = async () => {
        try { 
            await fetch('http://192.168.1.7:3000/gallery/views', {
                method: 'GET',
            })
            .then(res => res.json())
            .then( async data =>{
                //set the data in the state imgUrlsData array by setState  
                //console.log('the top views:',data)
                this.setState({viewsList: data})                                  // store ths data in viewsList array so we can use it in flatlist
                //console.log('the views data from server:',data,'--',this.state.viewsList,'--',this.state.viewsList[0].userinfo.fsNm);
            })
        } catch (error) {
           console.log('the catch error',error)
        } 
    }

    //api for geting star related datas,get the data by unique id
    connectApiForStar = async () => {
        try { 
            await fetch('http://192.168.1.7:3000/gallery/like', {
                method: 'POST',
                headers: {
                    'Content-Type' : 'application/json',
                     //  'enctype': 'multipart/form-data' 
                },
                body: JSON.stringify({
                    //unique_id: "5f1e9af143c44424b8e0da25"
                    unique_id: this.state.unique_id                             
                })
            })
           .then(res => res.json())
           .then( async data =>{
                //set the data in the state imgUrlsData array by setState  
                //console.log('the top views:',data,'--',data[0].userinfo)
                this.setState({starData: data})
                var i;
                //add the user liked imgs key value pair to viewsList
                for(i=0; i<this.state.viewsList.length; i++) {
                    var obj = this.state.viewsList[i];
                    obj['userFav'] = this.state.starData;
                    //console.log('the new value:',this.state.viewsList[i]);
                }
                this.setState({totalViewData: this.state.viewsList})
                console.log('the total views data from server:',this.state.totalViewData);
           })
        } catch (error) {
            console.log('the catch error',error)
        } 
    }

    //api for search images by tags
    connectApiForSearch = async () => {
        console.log('ths search data:',this.state.search)
        try { 
            await fetch('http://192.168.1.7:3000/gallery/search', {
                method: 'POST',
                headers: {
                    'Content-Type' : 'application/json',
                    //  'enctype': 'multipart/form-data' 
                },
                body: JSON.stringify({
                    tag: this.state.search                                // pass the tag in body
                })
            })
           .then(res => res.json())
           .then( async data =>{
                console.log('the search data:',data)
                if(data.length == 0){
                    this.setState({isSearchContPresent: false })
                } else {
                    await this.removeImgStateValues();                             // remove img state values otherwise it shows previous value img values loaded during render when img count is less than 11
                    await this.setImgStateValues(data);                            // set the image values
                }
           })
         } catch (error) {
           console.log('the catch error',error)
         } 
    }  

    //remove the state values otherwise if img count is less than 11 it will show previous state 
    removeImgStateValues= () => {
        this.setState({imgUrlsData: []}) 
        this.setState({firstImg: ''})
        this.setState({secondImg: ''})
        this.setState({thirdImg: ''})
        this.setState({remainingImgUrls: []})
    }

    //set the state value by the img structure pattern
    setImgStateValues= (data) => {
        this.setState({isSearchContPresent: true })
        this.setState({imgUrlsData: data})                              //store total data from api  
        var remainingImage= data.slice(3)                               // slice the data from index 3 so we can use it in thse flatlist
        this.setState({firstImg: this.state.imgUrlsData[0].url})        // store the firstImg url in state 
        this.setState({secondImg: this.state.imgUrlsData[1].url})
        this.setState({thirdImg: this.state.imgUrlsData[2].url})
        this.setState({remainingImgUrls: remainingImage})                // store the sliced image url in array
         //console.log('the img url from server:',this.state.remainingImgUrls);
    }

    //update the search state when search input value changes
    updateSearch = async (Search) => {
        console.log('the search length:',Search.length)
        if(Search.length != 0) {
            await this.setState({search: Search });
            this.connectApiForSearch();                                      //call the api for getting img urls by search
        }
    };

    // render function for flatlist which displays the sliced image array
    renderImgs= ( {item} )=>{
        return (
            <TouchableWithoutFeedback onPress={()=>this.props.navigation.navigate('Gallery_Download',{imgUrl: item.url})}>
                <FastImage source={{uri: item.url}} resizeMode={FastImage.resizeMode.cover} style={[Styles.Images,{marginRight: hp(2),marginVertical: hp(1)}]}/>
            </TouchableWithoutFeedback>
        )
    } 

    //navigation function for gallery full page
    NAVIGATE_TO_GALLERY_FULL = () => {
        this.props.navigation.navigate('Gallery_Full');
    }

    //navigation function for gallery post page
    NAVIGATE_TO_GALLERY_POST = () => {
        this.props.navigation.navigate('Gallery_Post');
    }

    //navigation function for gallery download page with imgUrl which is to be download
    NAVIGATE_TO_GALLERY_DOWNLOAD = (item) => {
        console.log('irukken')
        this.props.navigation.navigate('Gallery_Download',{imgUrl: item.url});
    }

    //navigation function for profile page
    NAVIGATE_TO_GALLERY_PROFILE({item})  {
        this.props.navigation.navigate('Gallery_Profile',{userName: item.location})
    }

    //render function for top views flatlist from viewsList array state
    renderViews= ( {item} ) => {
        let that= this
        var starVal= false;                                        //set initial star value as unlike
        //console.log('the starData', item.userFav,'--',item.url)   
        var arr= item.userFav;                                     //array contain user favourite images
        var isStar,i

        //find user favourite contain current img url
        for(i= 0;arr.length> i;i++) {
            if(arr[i]==item.url) {
                isStar= arr[i]
            }
        }

        //set star value according to if user favourite array contain current img url
        if(isStar == item.url) {
            starVal = true;
        } else {
            starVal = false;
        }
        
        const setStar = () => {
            //console.log('inside onPress',starVal)
            if(starVal == true){
                starVal = false;
                console.log('inside true con',starVal)
            }else {
                starVal = true;
                console.log('inside false con',starVal)
            }
        }
        //console.log('star',starVal)
        //get the android permission
        const checkPermission = async () => {
            //Function to check the platform
            //If iOS the start downloading
            //If Android then ask for runtime permission
            if (Platform.OS === 'ios') {
              downloadImage();
            } else {
                try {
                    const granted = await PermissionsAndroid.request(
                        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                    );
                    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                        //Once user grant the permission start downloading
                        console.log('Storage Permission Granted.');
                        downloadImage();
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
        
        //download the image and write it in external file storage
        const downloadImage = () => {
            //Main function to download the image
            let date = new Date(); //To add the time suffix in filename
            //Image URL which we want to download
            let image_URL = item.url;
            //Getting the extention of the file
            var ext = getExtention(image_URL);
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
        
        //get extension of the file
        const getExtention = filename => {
            //To get the file extension
            return /[.]/.exec(filename) ? /[^.]+$/.exec(filename) : undefined;
        };

        return (
           <View style={{flexDirection: 'row', justifyContent: 'flex-start',alignItems: 'center',marginBottom: hp(2.11)}}>
               <View style={{borderRadius: hp(1.44), borderColor: Colors.white, overflow: 'hidden',elevation: 5}}>
                    <ImageBackground source={{uri: item.url}} style={{width: wp('21%'), height: hp('11.5%'), flexDirection: 'row',justifyContent: 'flex-end',alignItems: 'flex-end'}}>
                        <View style={{flexDirection: 'row',justifyContent:'center', alignItems: 'center', height: hp('5%'),width: wp('8%'), backgroundColor: Colors.white}}>
                            {starVal? 
                            (<Icon name='star' type='antdesign' size= {20} color= {Colors.PrimaryColor_2} onPress={setStar} />) :
                            (<Icon name='staro' type='antdesign' size= {20} color= {Colors.PrimaryColor_2} onPress={setStar} />)}
                        </View>
                    </ImageBackground>
                </View>
                <View style={{marginHorizontal: hp(2.95), width: wp('50%'),marginTop: hp(-2),flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start'}}>
                    <Text style={{fontFamily: Constants.fontProximaBold, color: Colors.SecondaryColor_2, fontSize: hp(2.95), lineHeight: hp(3.54)}} 
                        onPress={() =>this.props.navigation.navigate('Gallery_Profile',{userId: item.userinfo._id})} >{item.userinfo.usNm}</Text>
                    <Text style={{fontFamily: Constants.fontProximaReg, textTransform: 'capitalize',color: Colors.SecondaryColor_2, fontSize: hp(1.77), lineHeight: hp(2.211)}}>{item.location}</Text>
                    <View style={{opacity: 0.4, marginTop: hp(0.3), flexDirection: 'row',justifyContent: 'flex-start',}}>
                        <Icon name='eye' type='antdesign' size= {15} />
                        <Text style={{marginLeft: hp(1) ,fontFamily: Constants.fontProximaReg, color: Colors.SecondaryColor_2, fontSize: hp(1.77), lineHeight: hp(2.211)}}>{item.views}</Text>
                    </View>
                </View>
                <View style= {{flexDirection: 'row',justifyContent: 'flex-end',alignItems: 'flex-end',marginRight: wp('10%')}}>
                    <Icon name='download' type='antdesign'  size= {30} onPress={checkPermission} color= {Colors.PrimaryColor_2} />
                </View>
           </View>
        )
    }

    render () {
        return (
            <View style= {Styles.Container}>
                <View style= {Styles.HeaderContainer}>
                    <View style={{flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', marginTop: hp('-2.5%')}}>
                        <Icon name='arrowleft' type='antdesign'  size= {30} color= {Colors.white} onPress={this.Navigate_To_Med_Player}/>
                        <View style={{flexDirection: 'column', justifyContent: 'space-between', paddingTop: hp(2.211), paddingLeft: hp(2.95), paddingRight: hp(17.275)}}>                    
                            <Text style={Styles.HeaderText}>Sai Gallery</Text>
                            <Text style={Styles.SubHeaderText}>Exclusive updates</Text>
                        </View>
                        <ProfilePic />
                    </View>
                </View>
                <View style= {Styles.ContentContainer}>
                    <ScrollView>
                        <SearchBar
                            placeholder="Search for topics" 
                            platform= 'android'
                            placeholderTextColor= {Colors.SecondaryColor_2}
                            containerStyle={{backgroundColor:Colors.white, marginTop: hp(2.211), marginHorizontal: hp('2.95'),height: hp(7.40),borderRadius: hp(1.44),elevation: 5,borderColor: Colors.white}}
                            inputContainerStyle={{backgroundColor:Colors.white, height: hp(6),borderRadius: hp(1.44)}}
                            onChangeText={this.updateSearch}
                            onCancel= {this.connectApiForImgCont}
                            onClear= {this.connectApiForImgCont}
                            value={this.state.search}/>
                        <View style={Styles.ImagesContainer}>
                            {this.state.isSearchContPresent ?
                            (<View>
                                <View style={{flexDirection: 'row',marginBottom: hp(1)}}>
                                    <View>
                                        <TouchableWithoutFeedback onPress={()=> {this.props.navigation.navigate('Gallery_Download',{imgUrl: this.state.firstImg})}}>
                                            <FastImage source={{uri: this.state.firstImg}} resizeMode={FastImage.resizeMode.cover} style={{width: wp('69.25%'), height: hp('26%'), borderRadius: hp(1.44),borderColor: Colors.white, elevation: 4}}/>
                                        </TouchableWithoutFeedback>
                                    </View>
                                    <View style={{marginLeft: hp(2),justifyContent: 'space-between'}}>
                                        <TouchableWithoutFeedback onPress={()=> {this.props.navigation.navigate('Gallery_Download',{imgUrl: this.state.secondImg})}}>
                                            <FastImage source={{uri: this.state.secondImg}} resizeMode={FastImage.resizeMode.cover} style={[Styles.Images]}/>
                                        </TouchableWithoutFeedback>
                                        <TouchableWithoutFeedback onPress={()=> {this.props.navigation.navigate('Gallery_Download',{imgUrl: this.state.thirdImg})}}>
                                            <FastImage source={{uri: this.state.thirdImg}} resizeMode={FastImage.resizeMode.cover} style={[Styles.Images]}/>  
                                        </TouchableWithoutFeedback>
                                    </View>
                                </View>
                                <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
                                    <FlatList data={this.state.remainingImgUrls}
                                        renderItem= {this.renderImgs}
                                        keyExtractor={item => item.url} 
                                        numColumns = {4}
                                        horizontal= {false}
                                    />
                                </View>
                            </View>) :
                            (<View style={{height: hp('15%'),justifyContent: 'center',alignItems: 'center'}}>
                                <Text style={[Styles.EmptyContText,{top: hp('1%')}]}>No posts on this search</Text>
                            </View>) 
                            }
                            <View style={Styles.ContentTextContainer}>
                                <Text style={Styles.ContentText} onPress={this.NAVIGATE_TO_GALLERY_FULL}>View more</Text>
                            </View>
                            <View style={Styles.ViewContainer}>
                                <Text style={Styles.ViewHeaderText}>Top Views</Text>
                                <FlatList data={this.state.totalViewData}
                                    renderItem= {this.renderViews}
                                    keyExtractor={item => item.url} 
                                />
                            </View>
                        </View>    
                    </ScrollView>
                    <View style={Styles.IconContainer}>
                        <Icon name='camera' type='antdesign' size= {25} color= {Colors.white} onPress={this.NAVIGATE_TO_GALLERY_POST} style={{borderColor: Colors.PrimaryColor_1}}/>
                    </View>
                </View>
            </View>
        )
    }
}

/*class ViewsComp extends Component{
    constructor(props) {
        super(props) 
        this.state ={
            starVal: 'true'
        }
    }

    componentDidMount = () => {
    var arr= item.userFav;                                     //array contain user favourite images
    var isStar,i

    //find user favourite contain current img url
    for(i= 0;arr.length> i;i++) {
        if(arr[i]==item.url) {
            isStar= arr[i]
        }
    }

    //set star value according to if user favourite array contain current img url
    if(isStar == item.url) {
        this.state.starVal = true;
    } else {
        this.state.starVal = false;
    }
    }
    
    const setStar = () => {
        //console.log('inside onPress',starVal)
        if(starVal == true){
            starVal = false;
            console.log('inside true con',starVal)
        }else {
            starVal = true;
            console.log('inside false con',starVal)
        }
    }
    //console.log('star',starVal)
    //get the android permission
    const checkPermission = async () => {
        //Function to check the platform
        //If iOS the start downloading
        //If Android then ask for runtime permission
        if (Platform.OS === 'ios') {
          downloadImage();
        } else {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                );
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    //Once user grant the permission start downloading
                    console.log('Storage Permission Granted.');
                    downloadImage();
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
    
    //download the image and write it in external file storage
    const downloadImage = () => {
        //Main function to download the image
        let date = new Date(); //To add the time suffix in filename
        //Image URL which we want to download
        let image_URL = item.url;
        //Getting the extention of the file
        var ext = getExtention(image_URL);
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
    
    //get extension of the file
    const getExtention = filename => {
        //To get the file extension
        return /[.]/.exec(filename) ? /[^.]+$/.exec(filename) : undefined;
    };

    return (
       <View style={{flexDirection: 'row', justifyContent: 'flex-start',alignItems: 'center',marginBottom: hp(2.11)}}>
           <View style={{borderRadius: hp(1.44), borderColor: Colors.white, overflow: 'hidden',elevation: 5}}>
                <ImageBackground source={{uri: item.url}} style={{width: wp('21%'), height: hp('11.5%'), flexDirection: 'row',justifyContent: 'flex-end',alignItems: 'flex-end'}}>
                    <View style={{flexDirection: 'row',justifyContent:'center', alignItems: 'center', height: hp('5%'),width: wp('8%'), backgroundColor: Colors.white}}>
                        {starVal? 
                        (<Icon name='star' type='antdesign' size= {20} color= {Colors.PrimaryColor_2} onPress={setStar} />) :
                        (<Icon name='staro' type='antdesign' size= {20} color= {Colors.PrimaryColor_2} onPress={setStar} />)}
                    </View>
                </ImageBackground>
            </View>
            <View style={{marginHorizontal: hp(2.95), width: wp('50%'),marginTop: hp(-2),flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start'}}>
                <Text style={{fontFamily: Constants.fontProximaBold, color: Colors.SecondaryColor_2, fontSize: hp(2.95), lineHeight: hp(3.54)}} 
                    onPress={() =>this.props.navigation.navigate('Gallery_Profile',{userId: item.userinfo._id})} >{item.userinfo.usNm}</Text>
                <Text style={{fontFamily: Constants.fontProximaReg, textTransform: 'capitalize',color: Colors.SecondaryColor_2, fontSize: hp(1.77), lineHeight: hp(2.211)}}>{item.location}</Text>
                <View style={{opacity: 0.4, marginTop: hp(0.3), flexDirection: 'row',justifyContent: 'flex-start',}}>
                    <Icon name='eye' type='antdesign' size= {15} />
                    <Text style={{marginLeft: hp(1) ,fontFamily: Constants.fontProximaReg, color: Colors.SecondaryColor_2, fontSize: hp(1.77), lineHeight: hp(2.211)}}>{item.views}</Text>
                </View>
            </View>
            <View style= {{flexDirection: 'row',justifyContent: 'flex-end',alignItems: 'flex-end',marginRight: wp('10%')}}>
                <Icon name='download' type='antdesign'  size= {30} onPress={checkPermission} color= {Colors.PrimaryColor_2} />
            </View>
       </View>
    )
}*/

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
        flex: 4.90,
        //marginHorizontal: hp('2.95'),
        //marginVertical: hp(2.11),
        backgroundColor: Colors.white,
    },
    ImagesContainer: {
        marginVertical: hp(2.95),
        marginHorizontal: hp(2.11),
        backgroundColor: Colors.white
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
        marginVertical: hp(2.55),
        backgroundColor: Colors.white
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
    },
    EmptyContText: {
        fontFamily: Constants.fontMedium,
        fontSize: hp(2.211),
        lineHeight: hp(2.655),
        color: Colors.SecondaryColor_2,
    },
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

             [{"_id": "5f2a901b155743666e54ab73", "location": "Bangalore, India", "url": "https://shridi-sai-maharaj.s3.ap-south-1.amazonaws.com/Tue%20Jul%2028%202020%2009%3A54%3A07%20GMT%2B0530%20%28IST%29images%20%285%29.jpeg", "userFav": ["https://shridi-sai-maharaj.s3.ap-south-1.amazonaws.com/Tue%20Jul%2028%202020%2009%3A54%3A07%20GMT%2B0530%20%28IST%29images%20%289%29.jpeg", "https://shridi-sai-maharaj.s3.amazonaws.com/Wed%20Jul%2029%202020%2015%3A02%3A54%20GMT%2B0530%20%28IST%29images%20%286%29.jpeg"], "userinfo": {"_id": "5f1e9af143c44424b8e0da25", "usNm": "Anandha Krishnan"}, "views": 112}, {"_id": "5f2a8fed155743666e54ab47", "location": "Wild", "url": "https://shridi-sai-maharaj.s3.amazonaws.com/Wed%20Jul%2029%202020%2015%3A02%3A54%20GMT%2B0530%20%28IST%29images%20%286%29.jpeg", "userFav": ["https://shridi-sai-maharaj.s3.ap-south-1.amazonaws.com/Tue%20Jul%2028%202020%2009%3A54%3A07%20GMT%2B0530%20%28IST%29images%20%289%29.jpeg", "https://shridi-sai-maharaj.s3.amazonaws.com/Wed%20Jul%2029%202020%2015%3A02%3A54%20GMT%2B0530%20%28IST%29images%20%286%29.jpeg"], "userinfo": {"_id": "5f2d0c7a155743666e54dae7", "usNm": "Balaji A.S"}, "views": 72}, {"_id": "5f2aa605155743666e54adbe", "location": "Bangalore, India", "url": "https://shridi-sai-maharaj.s3.amazonaws.com/Tue%20Jul%2028%202020%2009%3A36%3A03%20GMT%2B0530%20%28IST%29images%20%283%29.jpeg", "userFav": ["https://shridi-sai-maharaj.s3.ap-south-1.amazonaws.com/Tue%20Jul%2028%202020%2009%3A54%3A07%20GMT%2B0530%20%28IST%29images%20%289%29.jpeg", "https://shridi-sai-maharaj.s3.amazonaws.com/Wed%20Jul%2029%202020%2015%3A02%3A54%20GMT%2B0530%20%28IST%29images%20%286%29.jpeg"], "userinfo": {"_id": "5f1e9af143c44424b8e0da25", "usNm": "Anandha Krishnan"}, "views": 59}]
*/