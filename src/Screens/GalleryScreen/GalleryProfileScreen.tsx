import React, { Component } from 'react';
import { View, StyleSheet, Text, ScrollView, Image, FlatList,TouchableOpacity, TouchableHighlight, PermissionsAndroid, Platform,} from 'react-native';
import { Constants, Colors } from '../../Styles';
import { Icon, Avatar } from 'react-native-elements';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import FastImage from 'react-native-fast-image';
import { ProfilePic } from '../../Components';

export default class GalleryProfileScreen extends Component {

    constructor(props) {
        super(props) 
        this.state ={
            userId: this.props.route.params.userId,
            profileData: [],
            allImgUrlsData: [],
            coverPic: ' ',
            profilePic: ' ',
            totalViews: 5697888,
            totalFollowers: 5677966,
            //unique_id1: '5f2d0c7a155743666e54d567',
            unique_id1: '5f1e9af143c44424b8e0da25',
            Views: '',
            Followers: '',
            isFollowing: true,
            isEdit: false,
            userName: '',
            location: '',
            /*blogs: ['thank you god for this wonderful life.you are unevitable,incredible and unbelivable.i think the life in earth is real paradise,thank you sai.',
                    'you are unevitable,incredible and unbelivable',
                    'i think the life in earth is real paradise,thank you sai',
                    'thanks baba, for giving me this good mindspace',
                    'thanks for the complete life sai',
                    'i have no fear, when i have your shoulders',
                    'thanks for pain, love, kind, humanity']*/
            blogs: []
        }
    }
    componentDidMount= async() =>{
        if(this.state.userId == this.state.unique_id1){
            this.setState({isEdit: true})
        }
        console.log('the userId from download section:', this.state.userId)
        await this.connectApiToGetProfileInfo();
        //await this.connectApiToGetFollow();
        //await this.connectApiForAllImg();
        await this.numberWithCommas(this.state.totalViews);
        await this.numberWithCommasForFollowers(this.state.totalFollowers);
    }

    //connect the server and get data
    connectApiToGetProfileInfo = async () => {
        //console.log('userId:',this.state.userId)
        try { 
            await fetch('http://192.168.1.7:3000/login-signup/profileHome', {
                method: 'POST',
                headers: {
                    'Content-Type' : 'application/json',
                    //  'enctype': 'multipart/form-data' 
                },
                body: JSON.stringify({
                    unique_id: this.state.userId,
                    //unique_id: '5f1e9af143c44424b8e0da25',
                    unique_id1: this.state.unique_id1,
                })
            })
            .then(res => res.json())
            .then( data => {
                //set the data in the state imgUrlsData array by setState 
                //console.log('the profile data:', data.followCount[0],'--',data.postImage.splice(0,4),'---',data.follow,'--',data.gratitudes) 
                //console.log(data,'---',this.state.userId)
                console.log('isFollowing',data.follow,typeof(data.follow))
                this.setState({profileData: data}) 
                this.setState({userName: data.userDetails[0].usNm })
                this.setState({coverPic: data.userDetails[0].usCoIm})
                this.setState({isFollowing: data.follow})
                this.setState({profilePic: data.userDetails[0].usIm})
                this.setState({location: data.userDetails[0].usLo})
                this.setState({totalViews: data.totalViews[0].totalViews})
                this.setState({totalFollowers: data.followCount[0].numberOfFollows})
                var imgUrls= data.postImage.splice(0,4)
                this.setState({allImgUrlsData: imgUrls})
                this.setState({blogs: data.gratitudes})
                //console.log('the profile data:', this.state.isFollowing,typeof(this.state.isFollowing))
            })
        } catch (error) {
           console.log('the catch error',error)
        } 
    }  

    //connect the server and get data
    connectApiToGetFollow = async () => {
        console.log('the follow data to the server',this.state.isFollowing,typeof(this.state.isFollowing))
        try { 
            await fetch('http://192.168.1.7:3000/login-signup/follow', {
                method: 'PUT',
                headers: {
                    'Content-Type' : 'application/json',
                    //  'enctype': 'multipart/form-data' 
                },
                body: JSON.stringify({
                    unique_id: this.state.userId,
                    unique_id1: this.state.unique_id1,
                    //unique_id: '5f1e9af143c44424b8e0da25',
                    follow: this.state.isFollowing,
                })
            })
            .then(res => res.json())
            .then( data => {
                //set the data in the state imgUrlsData array by setState 
                //console.log('the follow data:', data)   
            })
        } catch (error) {
           console.log('the catch error',error)
        } 
    } 

    //connect the server and get data all img urls
    /*connectApiForAllImg = async () => {
        try { 
            await fetch('http://192.168.1.7:3000/gallery/imagelimit', {
                method: 'GET',
            }
            .then(res => res.json())
            .then( async (data) =>{
                //set the data in the state imgUrlsData array by setState 
                var imgUrls = data.splice(0,4)  
                await this.setState({allImgUrlsData: imgUrls});
            })
        } catch (error) {
           console.log('the catch error',error)
        } 
    }*/ 

    //navigation function for gallery home page
    Navigate_To_GALLERY_HOME =() => {
        this.props.navigation.navigate('Gallery_Home');
    }

     //navigation function for gallery full page
    NAVIGATE_TO_GALLERY_FULL = () => {
        this.props.navigation.navigate('Gallery_Full');
    }

    numberWithCommas= (x) => {
        x=String(x).toString();
        var afterPoint = '';
        if(x.indexOf('.') > 0)
            afterPoint = x.substring(x.indexOf('.'),x.length);
            x = Math.floor(x);
            x=x.toString();
            var lastThree = x.substring(x.length-3);
            var otherNumbers = x.substring(0,x.length-3);
        if(otherNumbers != '')
            lastThree = ',' + lastThree;
            var comNo= otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree + afterPoint;
            this.setState({Views: comNo})
    }
    
    numberWithCommasForFollowers= (x) => {
        x=String(x).toString();
        var afterPoint = '';
        if(x.indexOf('.') > 0)
            afterPoint = x.substring(x.indexOf('.'),x.length);
            x = Math.floor(x);
            x=x.toString();
            var lastThree = x.substring(x.length-3);
            var otherNumbers = x.substring(0,x.length-3);
        if(otherNumbers != '')
            lastThree = ',' + lastThree;
            var comNo= otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree + afterPoint;
            this.setState({Followers: comNo})
    }

    followBtn = async() => {
            await this.setState({isFollowing: true})
            console.log('the following data:',this.state.isFollowing)
            await this.connectApiToGetFollow();
    }

    unFollowBtn = async() => {
            await this.setState({isFollowing: false})
            console.log('the following data:',this.state.isFollowing)
            await this.connectApiToGetFollow();
    }

    editBtn = () => {
        this.props.navigation.navigate('Gallery_Profile_Update',{userId: this.state.unique_id1});
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
                <Text style={Styles.BlogsText}>{item.content}</Text>
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
                    <ProfilePic />
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
                                <Text style={Styles.subInfoText}>{this.state.Views}</Text>
                            </View>
                            <View style={Styles.subInfoContainer}>
                                <Icon name='users' type='entypo' size= {20} />
                                <Text style={Styles.subInfoText}>{this.state.Followers}</Text>
                            </View>
                        </View>
                        <View style={Styles.profileContainer}>
                            <View style={{flexDirection: 'row'}}>
                                <Text style={Styles.userNameText}>{this.state.userName}</Text>
                                <Icon name='check-circle' type='feather' size= {17} color= {Colors.PrimaryColor_2} style={{marginLeft: hp(0.7),marginTop: hp(0.7)}} />
                            </View>
                            <Text style={Styles.locationText}>{this.state.location}</Text>
                                {this.state.isEdit ? 
                                    (<TouchableOpacity onPress={this.editBtn} style={{backgroundColor: Colors.PrimaryColor_2, width: wp('35%'),height: hp('6%'), borderRadius: hp(1)}}>
                                        <View style={{flexDirection: 'row',justifyContent: 'center', marginTop: hp('1.65%')}}>
                                            <Text style={Styles.ButtonTextContiner}>Edit</Text>
                                        </View>
                                    </TouchableOpacity>) :
                                    (this.state.isFollowing ?
                                        (<TouchableOpacity onPress={this.unFollowBtn} style={{backgroundColor: Colors.PrimaryColor_2, width: wp('35%'),height: hp('6%'), borderRadius: hp(1)}}>
                                            <View style={{flexDirection: 'row',justifyContent: 'center', marginTop: hp('1.65%')}}>
                                                <Text style={Styles.ButtonTextContiner}>UnFollow</Text>
                                            </View>
                                        </TouchableOpacity>):
                                        (<TouchableOpacity onPress={this.followBtn} style={{backgroundColor: Colors.PrimaryColor_2, width: wp('35%'),height: hp('6%'), borderRadius: hp(1)}}>
                                            <View style={{flexDirection: 'row',justifyContent: 'center', marginTop: hp('1.65%')}}>
                                                <Text style={Styles.ButtonTextContiner}>Follow</Text>
                                                <Icon name='plus' type='antdesign'  size= {14} style={{marginTop:hp(0.5)}} color= {Colors.white} />
                                            </View>
                                        </TouchableOpacity>)
                                    )}
                        </View>
                        <View style= {Styles.PostContainer}>
                            <Text style={{color: Colors.SecondaryColor_2,lineHeight: hp(4.20), fontSize: hp(3),fontFamily: Constants.fontMedium }}>Recent Posts</Text>
                            <Text onPress= {this.NAVIGATE_TO_GALLERY_FULL} style={{alignItems: 'flex-end',color: Colors.PrimaryColor_2,lineHeight: hp(2.95), fontSize: hp(2.211),fontFamily: Constants.fontRegular }}>View more</Text>
                        </View>
                        <View style={{flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: hp(2.44)}}>
                            <FlatList data={this.state.allImgUrlsData}
                                renderItem= {this.renderImgs}
                                keyExtractor={item => item.url} 
                                horizontal= {true}
                                showsHorizontalScrollIndicator= {false}
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
                                showsHorizontalScrollIndicator= {false}
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
        width: wp('20.40%'),
        height: hp('11.46%'),
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