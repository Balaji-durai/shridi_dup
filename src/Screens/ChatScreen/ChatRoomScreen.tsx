import React, { useState, useEffect, useContext } from 'react';
import { View, StyleSheet, Text, ActivityIndicator, AsyncStorage } from 'react-native';
import { Constants, Colors } from '../../Styles';
import { GiftedChat, Bubble, Send, SystemMessage,  InputToolbar, MessageImage } from 'react-native-gifted-chat';
import { AuthContext } from '../../Theme';
import firestore from '@react-native-firebase/firestore';
import { Icon, Avatar, ListItem } from 'react-native-elements';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
//import CardView from 'react-native-cardview';

const ChatRoomScreen = ({ route,navigation }) => {
    const [messages, setMessages] = useState([
        /**
         * Mock message data
         */
        // example of system message
        /*{
          _id: 0,
          text: 'New room created.',
          createdAt: new Date().getTime(),
          system: true
        },*/
        // example of chat message
        {
          _id: 1,
          text: 'Henlo!',
          createdAt: new Date().getTime(),
          user: {
            _id: 2,
            name: 'Test User'
          }
        },
        {
            _id: 2,
            image: 'https://shridi-sai-maharaj.s3.amazonaws.com/Wed%20Jul%2029%202020%2015%3A02%3A54%20GMT%2B0530%20%28IST%29images%20%286%29.jpeg',
            createdAt: new Date().getTime(),
            user: {
              _id: 2,
              name: 'Test User'
            }
        },
        {
            _id: 3,
            text: 'Poda panni!',
            createdAt: new Date().getTime(),
            user: {
              _id: 1,
              name: 'Balaji'
            }
        }
    ]);
    
    const { userProfile } = route.params
    const { userName } = route.params
    const { chatUserId } =route.params
    const { user, setUser, login } = useContext(AuthContext);
    //const currentUser = user.toJSON();
    //function to navigate gallery home page
    const NAVIGATE_TO_CHAT_HOME = () => {
        navigation.navigate('Chat_List');
    }
 
    useEffect(()=> {
        const userId= AsyncStorage.getItem('userId');
        if(messages.length <= 0) {
            console.log('the messages are empty')
        } else {
            console.log('the messages are not empty',messages.length,'---',userId)
        }
    },[messages])

    const handleButtonPress= async() => {
        const userId= await AsyncStorage.getItem('userId');
        console.log('the user info:',userId,'---',chatUserId)
        var roomName = 'Raja raja chozhan'
        await firestore()
            .collection('THREADS')
            .add({
                name: roomName,
                users: {
                    user_1: userId,
                    user_2: chatUserId
                },
                latestMessage: {
                    text: 'hi da machi',
                    createdAt: new Date().getTime()             
                }
            })
            .then(() => {
                console.log('is room created')
            })
            /*firestore()
            .collection('THREADS')
            .add({
              name: roomName,
              latestMessage: {
                text: 'hi da machi',
                createdAt: new Date().getTime()
              }
            })
            .then(docRef => {
              docRef.collection('MESSAGES').add({
                text: 'vada pangali',
                createdAt: new Date().getTime(),
                system: true
              });
              console.log('inside firestore')
              //navigation.navigate('Home');
            });*/
    }

    function renderBubble(props) {
        return (
          // Step 3: return the component
          <Bubble
            {...props}
            wrapperStyle={{
                right: {
                    // Here is the color change
                    backgroundColor: Colors.PrimaryColor_1,
                    borderRadius: hp('1.5%'),
                    marginRight: wp('1%'),
                    marginTop: hp('-1.2%'),
                    marginBottom: hp('2%')
                },
                left: {
                    backgroundColor: Colors.chatLeftColor,
                    borderRadius: hp('1.5%'),
                    marginRight: wp('1%'),
                    marginTop: hp('-1.2%'),
                    marginBottom: hp('2%')
                }
            }}
            textStyle={{
                right: {
                    fontFamily: Constants.fontGothamMed,
                    color: Colors.white,
                },
                left: {
                    fontFamily: Constants.fontGothamMed,
                    color: '#9095a4'
                },
            }}
            bottomContainerStyle={{
                right: {
                    borderTopRightRadius: hp('1.5%'),
                },
                left: {
                    borderTopLeftRadius: hp('1.5%'),
                },
            }}
            containerToNextStyle={{
                right: {
                    borderBottomRightRadius: hp('1.5%'),
                },
                left: {
                    borderBottomLeftRadius: hp('1.5%'),
                },
            }}
            containerToPreviousStyle={{
                right: {
                    borderTopRightRadius: hp('1.5%'),
                },
                left: {
                    borderTopLeftRadius: hp('1.5%'),
                }
            }}
          />
        );
    }

    const scrollBottomStyle= () => {
        return (
            <View style={Styles.BottomComponentContainer}>
                <Icon name='chevrons-down' type='feather' color={Colors.SecondaryColor_3} />
            </View>
        );
    }

    const renderSend= (props) => {
        return (
            <Send
                {...props}
            >
                <View style={{justifyContent: 'center', top: hp('0.3%')}}>
                    <Icon reverse name='arrow-right' type='entypo' color={Colors.PrimaryColor_2} size={15} reverseColor={Colors.white} />
                </View>
            </Send>
        );
    }
         
    // helper method that is sends a message
    const handleSend = async(newMessage = []) => {
        //const userId= await AsyncStorage.getItem('userFcm_id');
        var roomName= 'RajathiRaja'
        if(messages.length == 0) {
            console.log('the messages in send are empty',)
            firestore()
            .collection('THREADS')
            .add({
                name: roomName,
            })
            .then((data) => {
                console.log('chat was joined in firestore',data)
            })
            /*firestore()
            .collection('THREADS')
            .add({
              name: roomName,
              latestMessage: {
                text: 'hi da machi',
                createdAt: new Date().getTime()
              }
            })
            .then(docRef => {
              docRef.collection('MESSAGES').add({
                text: 'vada pangali'
                createdAt: new Date().getTime(),
                system: true
              });
              console.log('inside firestore')
              //navigation.navigate('Home');
            });*/
        } else {
            console.log('the messages in send are not empty')
        }
        setMessages(GiftedChat.append(messages, newMessage));
    }

    function renderLoading() {
        return (
          <View style={Styles.LoadingContainer}>
            <ActivityIndicator size='large' color={Colors.PrimaryColor_1} />
          </View>
        );
    }

    const renderInputToolbar= (props) => {
        return (
            <InputToolbar {...props} containerStyle={{ borderRadius: 30, backgroundColor: Colors.LightTeal, marginBottom: hp('1%'), marginLeft: 15, marginRight: 15 }}/>
        )
    }

    const renderMessage = (props) => {
        return (
          <SystemMessage
            {...props}
            containerStyle={{
                marginBottom: 15,
            }}
            textStyle={{
                fontSize: 14,
            }}
          />
        )
    }

    const renderMessageImage=(props) => {
        if (props.currentMessage.image) {
          const { containerStyle, wrapperStyle, ...messageImageProps } = props
          if (props.renderMessageImage) {
            return props.renderMessageImage(messageImageProps)
          }
          return (
            <MessageImage
              {...messageImageProps}
              imageStyle={[Styles.ImageCont, messageImageProps.imageStyle]}
            />
          )
        }
        return null
      }

    return (
            <View style= {Styles.Container}>
                <View style= {Styles.HeaderContainer}>
                    <Icon name='arrowleft' type='antdesign' size= {30} onPress={NAVIGATE_TO_CHAT_HOME} color= {Colors.white}/>
                    <View style={{ paddingHorizontal: hp(2.05) }}>
                        {userProfile.length>0 ?
                            (<Avatar size={60} rounded source={{uri: userProfile}} />) :
                            (<Avatar size={60} rounded overlayContainerStyle={{backgroundColor: Colors.SecondaryColor_3, borderRadius: hp('100%')}} icon={{ name: 'user', type: 'entypo', color: Colors.white, size: 41}} />)
                        }
                    </View>
                    <View style={{flexDirection: 'column', justifyContent: 'space-between', paddingLeft: hp(1), width: wp('65%')}}>                    
                        <Text onPress={handleButtonPress} style={Styles.HeaderText}>{userName}</Text>
                        <Text style={Styles.SubHeaderText}>Share our moments with baba</Text>
                    </View>
                </View>
                <View style= {Styles.ContentContainer}>
                    <GiftedChat
                        messages={messages}
                        onSend={newMessage => handleSend(newMessage)}
                        user={{ _id: 1 }}
                        placeholder="what's up?"
                        alwaysShowSend={true}
                        renderSend = {renderSend}
                        renderBubble={renderBubble}
                        renderComposer={renderComposer}
                        textInputStyle={{padding: hp('1%'), lineHeight: hp('2.3%')}}
                        renderAvatar={null}
                        //renderMessageImage={renderMessageImage}
                        //renderMessage={renderMessage}
                        //renderTime= {null}
                        maxComposerHeight={80}
                        renderInputToolbar={renderInputToolbar}
                        scrollToBottom
                        scrollToBottomComponent={scrollBottomStyle}
                        renderLoading={renderLoading}
                    />
                </View>
            </View>
    )
}

export default ChatRoomScreen;

const Styles= StyleSheet.create({
    Container: {
        flex: 1,
    },
    HeaderContainer: {
        flex: 1,
        backgroundColor: Colors.PrimaryColor_1,
        paddingLeft: hp('2.15'),
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    HeaderText: {
        fontFamily: Constants.fontRegular,
        fontWeight: 'bold',
        fontSize: hp(2.95),
        lineHeight: hp(3.75),
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
        flex: 5.10,
        //paddingVertical: hp(2.95),
        //paddingHorizontal: hp(2.95),
        backgroundColor: Colors.white,
        flexDirection: 'column',
        justifyContent: 'flex-start'
    },
    BottomComponentContainer: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    LoadingContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    ImageCont: {
        borderRadius: 3,
        marginLeft: 0,
        marginRight: 0,
    },
})



/*

import React, { Component } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Constants, Colors } from '../../Styles';
import { ProfilePic } from '../../Components';
import { Icon, Avatar, ListItem } from 'react-native-elements';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
//import CardView from 'react-native-cardview';

export default class ChatRoomScreen extends Component {

    constructor(props) {
        super(props) 
        this.state ={
            userName: this.props.route.params.userName,
            userProfile: this.props.route.params.userProfile,
            //month: 8,
            //year: 2020,
            blogsData: []
        }
    }
        
    componentDidMount= async() => {
        //console.log('the month details:',this.state.month,'--',this.state.year)
        console.log('the route values in chat room:',this.state.userName,'---',this.state.userProfile,'---',this.state.userProfile.length)
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
    NAVIGATE_TO_CHAT_HOME = () => {
        this.props.navigation.navigate('Chat_List');
    }
         
    render () {
        return (
            <View style= {Styles.Container}>
                <View style= {Styles.HeaderContainer}>
                    <Icon name='arrowleft' type='antdesign' size= {30} onPress={this.NAVIGATE_TO_CHAT_HOME} color= {Colors.white}/>
                    <View style={{ paddingHorizontal: hp(2.05) }}>
                        {this.state.userProfile.length>0 ?
                            (<Avatar size={60} rounded source={{uri: this.state.userProfile}} />) :
                            (<Avatar size={60} rounded overlayContainerStyle={{backgroundColor: Colors.SecondaryColor_3, borderRadius: hp('100%')}} icon={{ name: 'user', type: 'entypo', color: Colors.white, size: 41}} />)
                        }
                    </View>
                    <View style={{flexDirection: 'column', justifyContent: 'space-between', paddingLeft: hp(1), width: wp('65%')}}>                    
                        <Text style={Styles.HeaderText}>{this.state.userName}</Text>
                        <Text style={Styles.SubHeaderText}>Share our moments with baba</Text>
                    </View>
                </View>
                <View style= {Styles.ContentContainer}>
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
        flex: 1,
        backgroundColor: Colors.PrimaryColor_1,
        paddingLeft: hp('2.45'),
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    HeaderText: {
        fontFamily: Constants.fontRegular,
        fontWeight: 'bold',
        fontSize: hp(2.95),
        lineHeight: hp(3.75),
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
        flex: 5.10,
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


*/