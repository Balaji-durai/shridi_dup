import React, { Component } from 'react';
import { View, StyleSheet, Text, ScrollView, FlatList, AsyncStorage } from 'react-native';
import { Constants, Colors } from '../../Styles';
import { ProfilePic } from '../../Components';
import { Icon, Avatar, ListItem } from 'react-native-elements';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
//import CardView from 'react-native-cardview';

export default class ChatListScreen extends Component {

    constructor(props) {
        super(props) 
        this.state ={
            //month: this.props.route.params.month,
            blogsData: []
        }
    }
        
    componentDidMount= async() => {
        this.connectApiToGetChatList();
    }

    //api to store img datas in server including s3 img url
    connectApiToGetChatList = async () => {
        try { 
            //console.log('you are in upload api')
            await fetch('http://10.0.2.2:3000/login-signup/followChat', {
                method: 'POST',
                headers: {
                    'Content-Type' : 'application/json',
                    //  'enctype': 'multipart/form-data' 
                },
                body: JSON.stringify({
                    unique_id: '5f1e9af143c44424b8e0da25',
                })
            })
            .then(res => res.json())
            .then(data =>{
                //console.log("the month data from server:",data,'---',data.match);
                this.setState({blogsData: data.match})
                console.log("the month data from server:",this.state.blogsData);
            })
        } catch (error) {
            console.log('the catch error',error)
        } 
    }  

    //function to navigate gallery home page
    NAVIGATE_TO_GRATITUDE_HOME = () => {
        //this.props.navigation.navigate('Gratitude_Home');
    }

    //render function to display songs in playlist
    renderChatList=( {item} ) => {
        //console.log('the chat list item:',item.usIm,'---',item.usIm.length)
        //console.log('item id:', item)
        return (
            <ListItem 
                leftAvatar={item.usIm.length>0 ?
                                (<Avatar size={'medium'} rounded source={{uri: item.usIm}} />) :
                                (<Avatar size={'medium'} rounded overlayContainerStyle={{backgroundColor: Colors.SecondaryColor_3, borderRadius: hp('100%')}} icon={{ name: 'user', type: 'entypo', color: Colors.white, size: 41}} />)
                            }
                title={item.usNm}
                titleStyle={{fontFamily: Constants.fontMedium, fontWeight: 'bold', fontSize: hp(2.211), lineHeight: hp(2.655)}}
                subtitle={item.usLo}
                subtitleStyle={{fontFamily: Constants.fontRegular, fontSize: hp(1.77), lineHeight: hp(2.655)}}
                bottomDivider= {true}
                onPress={() =>{this.props.navigation.navigate('Chat_Room',{userProfile: item.usIm, userName: item.usNm,chatUserId: item._id})}}
            />
        )
    }
         
    render () {
        return (
            <View style= {Styles.Container}>
                <View style= {Styles.HeaderContainer}>
                    <Icon name='arrowleft' type='antdesign' size= {30} onPress={this.NAVIGATE_TO_GRATITUDE_HOME} color= {Colors.white}/>
                    <View style={{flexDirection: 'column', justifyContent: 'space-between', paddingTop: hp(2.211), paddingLeft: hp(2.95), width: wp('65%')}}>                    
                        <Text style={Styles.HeaderText}>Threads</Text>
                        <Text style={Styles.SubHeaderText}>Communicate with devotees</Text>
                    </View>
                    <ProfilePic />
                </View>
                <View style= {Styles.ContentContainer}>
                    {this.state.blogsData.length>0 ? 
                        (<ScrollView showsVerticalScrollIndicator={false}>
                            <View>
                                <FlatList data={this.state.blogsData}
                                    renderItem= {this.renderChatList}
                                    keyExtractor={item => item._id} 
                                    horizontal= {false}
                                    showsVerticalScrollIndicator={false}
                                />
                        </View>
                        </ScrollView>) :
                        (<View style={{justifyContent: 'center',alignItems: 'center'}}>
                            <Text style={[Styles.EmptyContText]}>No gratitude data on this month.</Text>
                        </View>)
                    }
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
        flex: 4.90,
        //paddingVertical: hp(2.95),
        //paddingHorizontal: hp(2.95),
        backgroundColor: Colors.white,
        flexDirection: 'column',
        justifyContent: 'flex-start'
    },
    EmptyContText: {
        fontFamily: Constants.fontMedium,
        fontSize: hp(2.211),
        lineHeight: hp(2.655),
        color: Colors.SecondaryColor_2,
    },
})
