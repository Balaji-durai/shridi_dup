import React, { Component } from 'react';
import { View, StyleSheet, Text, ScrollView, Image, FlatList,TouchableOpacity, TouchableHighlight, PermissionsAndroid, Platform,} from 'react-native';
import { Constants, Colors } from '../../Styles';
import { Icon, Avatar } from 'react-native-elements';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import FastImage from 'react-native-fast-image';
import CardView from 'react-native-cardview'

export default class ProfileHomeScreen extends Component {

    constructor(props) {
        super(props) 
        this.state ={
            profileData: [],
            allImgUrlsData: [],
            coverPic: 'https://shridi-sai-maharaj.s3.amazonaws.com/Tue%20Jul%2028%202020%2009%3A51%3A15%20GMT%2B0530%20%28IST%29images%20%282%29.jpeg',
            profilePic: 'https://shridi-sai-maharaj.s3.ap-south-1.amazonaws.com/Tue%20Jul%2028%202020%2009%3A53%3A05%20GMT%2B0530%20%28IST%29images%20%286%29.jpeg',
            totalViews: 67862827,
            totalFollowers: 5677966,
            isFollowing: false,
            userName: 'Arun Prasad',
            location: 'Chennai, TN',
            blogs: ['thank you god for this wonderful life.you are unevitable,incredible and unbelivable.i think the life in earth is real paradise,thank you sai.',
                    'you are unevitable,incredible and unbelivable',
                    'i think the life in earth is real paradise,thank you sai',
                    'thanks baba, for giving me this good mindspace',
                    'thanks for the complete life sai',
                    'i have no fear, when i have your shoulders',
                    'thanks for pain, love, kind, humanity']
        }
    }
    componentDidMount() {
        //this.connectApiToGetProfileInfo();
        this.connectApiForAllImg();
    }

    //connect the server and get data
    connectApiToGetProfileInfo = async () => {
        try { 
          await fetch('http://192.168.1.7:3000/gallery/details', {
             method: 'PUT',
             headers: {
                'Content-Type' : 'application/json',
              //  'enctype': 'multipart/form-data' 
              },
             body: JSON.stringify({
                unique_id: '476tyg84i'
             })
           })
           .then(res => res.json())
           .then( data => {
             //set the data in the state imgUrlsData array by setState  
             console.log('the profile data:', data)
             this.setState({profileData: data}) 
            
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
            .then( async (data) =>{
                //set the data in the state imgUrlsData array by setState 
                var imgUrls = data.splice(0,4)  
                await this.setState({allImgUrlsData: imgUrls});
                console.log('the img url from server:',this.state.allImgUrlsData[2].url);
            })
        } catch (error) {
           console.log('the catch error',error)
        } 
    } 

    //navigation function for gallery home page
    Navigate_To_GALLERY_HOME =() => {
        this.props.navigation.navigate('Gallery_Home');
    }

     //navigation function for gallery full page
    NAVIGATE_TO_GALLERY_FULL = () => {
        this.props.navigation.navigate('Gallery_Full');
    }

    followBtn = () => {
        if(this.state.isFollowing == true) {
            this.setState({isFollowing: false})
        } else {
            this.setState({isFollowing: true})
        }
    }

    renderImgs( {item } ) {
        return (
            <TouchableOpacity>
                <FastImage source={{uri: item.url}} resizeMode={FastImage.resizeMode.cover} style={[Styles.Images,{marginRight: hp(2),marginVertical: hp(1)}]}/>
            </TouchableOpacity>
        )
    } 

    renderblogs( {item} ) {
        return (
            <View style={Styles.BlogsContainer}>
                <Text style={Styles.BlogsText}>{item}</Text>
            </View>
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
                    <View style={{ paddingRight: hp(2.95), paddingTop: hp(3.685)}}>
                        <Avatar size={60} rounded  source={require("../../../Images/saibaba_loginScreen.jpg")} />
                    </View>
                </View>
                <View style= {Styles.ContentContainer}>
                    <ScrollView> 
                        <View style= {Styles.ImagesContainer}>
                            <Image source={{uri: this.state.profilePic}} style={Styles.coverImgContainer}/>
                            <Image source={{uri: this.state.coverPic}} style={Styles.profileImgContainer}/>
                        </View>
                        <View style={Styles.infoContainer}>
                            <View style={[Styles.subInfoContainer,{left: wp('-8%')}]}>
                                <Icon name='eye' type='antdesign' size= {20} />
                                <Text style={Styles.subInfoText}>{this.state.totalViews}</Text>
                            </View>
                            <View style={Styles.subInfoContainer}>
                                <Icon name='users' type='entypo' size= {20} />
                                <Text style={Styles.subInfoText}>{this.state.totalFollowers}</Text>
                            </View>
                        </View>
                        <View style={Styles.profileContainer}>
                            <View style={{flexDirection: 'row'}}>
                                <Text style={Styles.userNameText}>{this.state.userName}</Text>
                                <Icon name='check-circle' type='feather' size= {17} color= {Colors.PrimaryColor_2} style={{marginLeft: hp(0.7),marginTop: hp(0.7)}} />
                            </View>
                            <Text style={Styles.locationText}>{this.state.location}</Text>
                            <TouchableOpacity onPress={this.followBtn} style={{backgroundColor: Colors.PrimaryColor_2, width: wp('35%'),height: hp('6%'), borderRadius: hp(1)}}>
                                {this.state.isFollowing ?
                                    (<View style={{flexDirection: 'row',justifyContent: 'center', marginTop: hp('1.65%')}}>
                                        <Text style={Styles.ButtonTextContiner}>Following</Text>
                                    </View>):
                                   (<View style={{flexDirection: 'row',justifyContent: 'center', marginTop: hp('1.65%')}}>
                                        <Text style={Styles.ButtonTextContiner}>Follow</Text>
                                        <Icon name='plus' type='antdesign'  size= {14} style={{marginTop:hp(0.5)}} color= {Colors.white} />
                                    </View>)}
                            </TouchableOpacity>
                        </View>
                        <View style= {Styles.PostContainer}>
                            <Text style={{color: Colors.SecondaryColor_2,lineHeight: hp(4.20), fontSize: hp(3),fontFamily: Constants.fontMedium }}>Recent Posts</Text>
                            <Text onPress= {this.Navigate_To_GALLERY_Full} style={{alignItems: 'flex-end',color: Colors.PrimaryColor_2,lineHeight: hp(2.95), fontSize: hp(2.211),fontFamily: Constants.fontRegular }}>View more</Text>
                        </View>
                        <View style={{flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: hp(2.44)}}>
                            <FlatList data={this.state.allImgUrlsData}
                                renderItem= {this.renderImgs}
                                keyExtractor={item => item.url} 
                                horizontal= {true}
                            />
                        </View>
                        <View style= {Styles.PostContainer}>
                            <Text style={{color: Colors.SecondaryColor_2,lineHeight: hp(4.20), fontSize: hp(3),fontFamily: Constants.fontMedium }}>Mini Blogs</Text>
                            <Text style={{alignItems: 'flex-end',color: Colors.PrimaryColor_2,lineHeight: hp(2.95), fontSize: hp(2.211),fontFamily: Constants.fontRegular }}>View more</Text>
                        </View>
                        <View style={{marginHorizontal: hp('2.95'), marginBottom: hp('2.11')}}>
                            <FlatList data={this.state.blogs}
                                renderItem= {this.renderblogs}
                                keyExtractor={item => item.id} 
                                horizontal= {true}
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
        width: wp('100%'), 
        height: hp('45%'),
    },
    coverImgContainer: {
        //marginVertical: hp(2.95),
        //marginHorizontal: hp(2.11)
        width: wp('100%'), 
        height: hp('35%'),
        borderBottomLeftRadius: hp('2%'),
        borderBottomRightRadius: hp('2%'),
        resizeMode: 'cover',
        borderColor: Colors.white,
    },
    profileImgContainer: {
        position: 'relative',
        right: wp('-36%'),
        top: hp('-8%'),
        height: hp('14%'), 
        width: wp('23%'), 
        borderRadius: hp('100'),
        zIndex: 1
    },
    Images: {
        width: wp('20.47%'),
        height: hp('11.5%'),
        borderRadius: hp(1),
        borderColor: Colors.white,
        elevation: 4
    },
    profileContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: hp('-5%')
    },
    userNameText: {
        fontFamily: Constants.fontMedium,
        color: Colors.SecondaryColor_3,
        fontSize: hp(2.95), 
        lineHeight: hp(4.12)
    },
    locationText: {
        fontFamily: Constants.fontRegular,
        lineHeight: hp(2.95), 
        marginTop:hp(0.3),
        marginBottom: hp(1.4),
        fontSize: hp(2.211),
        color: Colors.SecondaryColor_3
    },
    ContentText: {
        fontFamily: Constants.fontRegular,
        color: Colors.PrimaryColor_2,
        fontSize: hp(2.211),
        lineHeight: hp(2.95)
    },
    infoContainer: {
        position: 'relative',
        flexDirection: 'row',
        justifyContent: 'space-around',
        top: hp('-7%')
    },
    subInfoContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center', 
        opacity: 0.4
    },
    subInfoText: {
        fontFamily: Constants.fontProximaReg,
        color: Colors.SecondaryColor_2,
        lineHeight: hp(3.54),
        fontSize: hp(2.655),
        paddingLeft: hp('1%')
    },
    PostContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: hp('2.95'),
        marginTop: hp(2.11),
        marginBottom: hp(1)
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
    },
    BlogsContainer: {
        width: wp('70%'),
        height: hp('15%'),
        borderLeftColor: Colors.PrimaryColor_1,
        borderLeftWidth: hp(0.5),
        borderRightColor: Colors.white,
        borderRightWidth: hp(0.1),
        borderBottomColor: Colors.white,
        borderBottomWidth: hp(0.1),
        borderTopColor:  Colors.white,
        borderTopWidth: hp(0.1),
        marginRight: hp('2%'),
        marginBottom: hp('6%'),
        marginTop: hp('1.5%'),
        borderRadius: hp('1'),
        backgroundColor: Colors.white,
        elevation: 5
    },
    BlogsText: {
        fontFamily: Constants.fontLight,
        fontSize: hp(1.77),
        lineHeight: hp(2.655),
        color: Colors.SecondaryColor_2,
        padding: hp(2.44),
        flexWrap: 'wrap',
        overflow: 'hidden',
    }
})

/*
<FlatList data={this.state.allImgUrlsData}
                                renderItem= {this.renderImgs}
                                keyExtractor={item => item.url} 
                                numColumns = {4}
                                horizontal= {false}
                            />

<TouchableOpacity>
                                <FastImage source={{uri: this.state.allImgUrlsData[0].url}} resizeMode={FastImage.resizeMode.cover} style={[Styles.Images,{marginRight: hp(2),marginVertical: hp(1)}]}/>
                            </TouchableOpacity>
                            <TouchableOpacity>
                                <FastImage source={{uri: this.state.allImgUrlsData[1].url}} resizeMode={FastImage.resizeMode.cover} style={[Styles.Images,{marginRight: hp(2),marginVertical: hp(1)}]}/>
                            </TouchableOpacity>
                            <TouchableOpacity>
                                <FastImage source={{uri: this.state.allImgUrlsData[2].url}} resizeMode={FastImage.resizeMode.cover} style={[Styles.Images,{marginRight: hp(2),marginVertical: hp(1)}]}/>
                            </TouchableOpacity>
                            <TouchableOpacity>
                                <FastImage source={{uri: this.state.allImgUrlsData[3].url}} resizeMode={FastImage.resizeMode.cover} style={[Styles.Images,{marginRight: hp(2),marginVertical: hp(1)}]}/>
                            </TouchableOpacity>
*/