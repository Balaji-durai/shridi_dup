import React, { Component } from 'react';
import { View, StyleSheet, Text, ScrollView, FlatList, AsyncStorage } from 'react-native';
import { Constants, Colors } from '../../Styles';
import { ProfilePic } from '../../Components';
import { Icon, Avatar, Button } from 'react-native-elements';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
//import CardView from 'react-native-cardview';

export default class GratitudeDetailsScreen extends Component {

    constructor(props) {
        super(props) 
        this.state ={
            month: this.props.route.params.month,
            year: this.props.route.params.year,
            //month: 8,
            //year: 2020,
            title: '',                                   //optional title for img
            grtMsg: '',                                   //gratitude msg content
            location: '',
            blogsData: [],
        }
    }
        
    componentDidMount= async() => {
        //console.log('the month details:',this.state.month,'--',this.state.year)
        this.connectApiToGetMonthBlogs();
    }

    //api to store img datas in server including s3 img url
    connectApiToGetMonthBlogs = async () => {
        try { 
            //console.log('you are in upload api')
            await fetch('http://10.0.2.2:3000/gratitude/searchMonth', {
                method: 'POST',
                headers: {
                    'Content-Type' : 'application/json',
                    //  'enctype': 'multipart/form-data' 
                },
                body: JSON.stringify({
                    unique_id: '5f1e9af143c44424b8e0da25',
                    month: this.state.month,
                    year: this.state.year
                })
            })
            .then(res => res.json())
            .then(data =>{
                console.log("the month data from server:",data,'---',!data);
                this.setState({blogsData: data})
            })
        } catch (error) {
            console.log('the catch error',error)
        } 
    }  

    //function to navigate gallery home page
    NAVIGATE_TO_GRATITUDE_HOME = () => {
        this.props.navigation.navigate('Gratitude_Home');
    }

    //function to navigate gallery home page
    NAVIGATE_TO_GRATITUDE_POST = () => {
        this.props.navigation.navigate('Gratitude_Post',{id: "5f3238b868da451f5cefc4d0"});
    }
         
    renderBlogs=( {item} ) => {
        //console.log('the item:',item)
        var d = item.crAt;
        var ds = d.split('T');
        var dr = ds[0].split('-');
        var dt = new Date(ds[0]);
        var weekday = new Array(7);
        weekday[0] = "Sunday";
        weekday[1] = "Monday";
        weekday[2] = "Tuesday";
        weekday[3] = "Wednesday";
        weekday[4] = "Thursday";
        weekday[5] = "Friday";
        weekday[6] = "Saturday";

        var day = weekday[dt.getDay()];
        //convert month in string to num
        const convertMonth = (month) =>{
        var months
        switch(month){   
            case '01':
                months = 'January';
                break;
            case '02':
                months = 'Febuary';
                break;
            case '03':
                months = 'March';
                break;
            case '04':
                months = 'April';
                break;
            case '05':
                months = 'May';
                break;
            case '06':
                months = 'June';
                break;
            case '07':
                months = 'July';
                break;
            case '08':
                months = 'August';
                break;
            case '09':
                months = 'September';
                break;
            case '10':
                months = 'October';
                break;
            case '11':
                months = 'November';
                break;
            case '12':
                months = 'December';
                break;
        }
        return months
        }
        var Month= convertMonth(dr[1]);
        var full_Day = dr[2].concat(' ',Month,' ',dr[0])
        var fullDay = day.concat(', ',full_Day)
        //console.log('the splitted value:',Month,'--',day,'--',dr[0],'--',dr[2],'--',full_Day)
        return (
            <View style={{marginTop: hp('2%'), marginBottom: hp('-1%'),marginHorizontal: hp('0.5%')}}>
                <View style={[Styles.BlogsContainer,{ height: hp('25%')}]}>
                    <Text ellipsizeMode= 'tail' style={[Styles.BlogsText,{height: hp('21%')}]}>{item.content}</Text>
                    <View style={{height: hp('4%'),flexDirection: 'row',justifyContent: 'space-between', alignItems: 'flex-start',paddingHorizontal: hp(2.95),paddingBottom: hp(2.211)}}>
                        <Text style={{fontFamily: Constants.fontLight,color: Colors.SecondaryColor_2,fontSize: hp(1.5),lineHeight: hp(2.655)}}>{fullDay}</Text>
                        <Text style={{fontFamily: Constants.fontRegular,color: Colors.PrimaryColor_1,fontSize: hp(1.5),lineHeight: hp(2.655)}} 
                            onPress={()=> this.props.navigation.navigate('Gratitude_Post',{id: item._id})}>Edit</Text>
                    </View>
                </View>
            </View>
        )
    }

    render () {
        return (
            <View style= {Styles.Container}>
                <View style= {Styles.HeaderContainer}>
                    <Icon name='arrowleft' type='antdesign' size= {30} onPress={this.NAVIGATE_TO_GRATITUDE_HOME} color= {Colors.white}/>
                    <View style={{flexDirection: 'column', justifyContent: 'space-between', paddingTop: hp(2.211), paddingLeft: hp(2.95), width: wp('65%')}}>                    
                        <Text style={Styles.HeaderText}>Gratitude</Text>
                        <Text style={Styles.SubHeaderText}>Share our moments with baba</Text>
                    </View>
                    <ProfilePic />
                </View>
                <View style= {Styles.ContentContainer}>
                    {this.state.blogsData.length>0 ? 
                        (<ScrollView showsVerticalScrollIndicator={false}>
                            <View>
                                <FlatList data={this.state.blogsData}
                                    renderItem= {this.renderBlogs}
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
        flex: 4.30,
        paddingVertical: hp(2.95),
        paddingHorizontal: hp(2.95),
        backgroundColor: Colors.white,
        flexDirection: 'column',
        justifyContent: 'flex-start'
    },
    BlogsContainer: {
        //width: wp('73%'),
        height: hp('12%'),
        top: hp('-2%'),
        borderLeftColor: Colors.PrimaryColor_1,
        borderLeftWidth: hp(0.5),
        borderRightColor: Colors.white,
        borderRightWidth: hp(0.1),
        borderBottomColor: Colors.white,
        borderBottomWidth: hp(0.1),
        borderTopColor:  Colors.ShadowColor_1,
        //borderTopRightRadius: hp('1%'),
        borderTopWidth: hp(0.05),
        //marginRight: hp('2.5%'),
        marginBottom: hp('2%'),
        //marginTop: hp('1.5%'),
        borderRadius: hp('1'),
        backgroundColor: Colors.white,
        elevation: 4
    },
    BlogsText: {
        fontFamily: Constants.fontLight,
        fontSize: hp(1.77),
        lineHeight: hp(2.655),
        color: Colors.SecondaryColor_2,
        padding: hp(2.44),
        flexWrap: 'wrap',
        overflow: 'hidden',
    },
    EmptyContText: {
        fontFamily: Constants.fontMedium,
        fontSize: hp(2.211),
        lineHeight: hp(2.655),
        color: Colors.SecondaryColor_2,
    },
})

/*
<View style={{elevation: 3, backgroundColor: Colors.white, borderRadius: hp('1'), marginBottom: hp('2%'), height: hp('25%')}}>
                <View style={[Styles.BlogsContainer,{ height: hp('25%')}]}>
                    <Text style={[Styles.BlogsText,{height: hp('21%')}]}>{item.content}</Text>
                    <View style={{height: hp('4%'),flexDirection: 'row',justifyContent: 'space-between', alignItems: 'flex-start',paddingHorizontal: hp(2.95),paddingBottom: hp(2.211)}}>
                        <Text style={{fontFamily: Constants.fontLight,color: Colors.SecondaryColor_2,fontSize: hp(1.5),lineHeight: hp(2.655)}}>Tuesday, 12 June 2020</Text>
                        <Text style={{fontFamily: Constants.fontRegular,color: Colors.PrimaryColor_1,fontSize: hp(1.5),lineHeight: hp(2.655)}} >Edit</Text>
                    </View>
                </View>
            </View>

            <View style={[{ height: hp('25%')}]}>
                        <Text style={[Styles.BlogsText,{height: hp('21%')}]}>the india means love.</Text>
                        <View style={{height: hp('4%'),flexDirection: 'row',justifyContent: 'space-between', alignItems: 'flex-start',paddingHorizontal: hp(2.95),paddingBottom: hp(2.211)}}>
                            <Text style={{fontFamily: Constants.fontLight,color: Colors.SecondaryColor_2,fontSize: hp(1.5),lineHeight: hp(2.655)}}>Thursday, 6 June 2020</Text>
                            <Text onPress={this.NAVIGATE_TO_GRATITUDE_POST} style={{fontFamily: Constants.fontRegular,color: Colors.PrimaryColor_1,fontSize: hp(1.5),lineHeight: hp(2.655)}} >Edit</Text>
                        </View>
                    </View>
*/

/*
profilePic: ''

const profilePic= await AsyncStorage.getItem('profilePic');
const parsedData= JSON.parse(profilePic);
this.setState({profilePic: parsedData})

<View style={{ paddingRight: hp(2.95), paddingTop: hp(3.685)}}>
                        {this.state.profilePic.length>0 ?
                            (<Avatar size={60} rounded source={{uri: this.state.profilePic}} />) :
                            (<Avatar size={60} rounded overlayContainerStyle={{backgroundColor: Colors.SecondaryColor_3, borderRadius: hp('100%')}} icon={{ name: 'user', type: 'entypo', color: Colors.white, size: 41}} />)
                        }
                    </View>

*/