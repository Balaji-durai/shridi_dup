import React, { Component, createRef } from 'react';
import { View, StyleSheet, Text, FlatList, AsyncStorage } from 'react-native';
import { Constants, Colors } from '../../Styles';
import { Icon, Avatar, Button } from 'react-native-elements';
import { ProfilePic } from '../../Components';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import DateTimePicker from '@react-native-community/datetimepicker';
import { TouchableOpacity } from 'react-native-gesture-handler';
//import CardView from 'react-native-cardview';

export default class GratitudeHomeScreen extends Component {

    constructor(props) {
        super(props) 
        this.state ={
            date: '08.08.2020',
            curMonth: 0,
            curYear: 0,
            curDate: 0,
            showCalender: false,
            isContPresent: true,
            secondBlogsData: [],
            firstBlogsData: [],
            isFirstBlogsPresent: false,
            isSecondBlogsPresent: true,
            monthsData: ["January","February","March","April","May","June","July","August","September","October","November","December"]
        }
    }

    componentDidMount= async () => {
        //console.log('the date:',this.state.date);
        await this.getCurDate();
        //await this.getCurrentMonth();
        //await this.connectApiToGetFirstBlogsData();
        await this.connectApiToGetMonthBlogs();
    }

    //function to convert and store dte data in state
    onChangeDate = async (selectedDate) => {
        console.log('selected date from calender',selectedDate,"--",this.state.date)
        var currentDate = selectedDate || this.state.date;
        console.log('on change date',currentDate,'--',!!currentDate.nativeEvent)
        //console.log('the date:',this.state.date,'--',currentDate.nativeEvent.timestamp)
        //setShow(Platform.OS === 'ios');
        if(!!currentDate.nativeEvent) {
            var current= new Date(currentDate.nativeEvent.timestamp);
            const s =current.toString();                               
            const str= s.split(' ');
            const month=str[1];
            const Month= this.convertMonth(month);
            //this.setState({firstBlogsData: []})
            console.log('ths splited date is',str[1],str[2],str[3],'--',Month,'--',str[2] != undefined)
            const curDate =str[2] + '.'+ Month + '.'+ str[3];
            if(str[2] != undefined) {
                this.setState({showCalender: false})
                console.log('the calender value:', this.state.showCalender)
                this.setState({date: curDate})
            }
            await this.setState({curDate: str[2]})
            await this.setState({curMonth: Month})
            await this.setState({curYear: str[3]})
            await this.connectApiToGetFirstBlogsData();
        } 
    };

    //set current date
    getCurDate = async () => {
        var current= new Date();
        const s =current.toString();
        const str= s.split(' ');
        const month=str[1];
        const Month= this.convertMonth(month);
        //console.log('ths splited date is',str[1],str[2],str[3],'--',Month,'--',str[1] != undefined)
        const curDate =str[2] + '.'+ Month + '.'+ str[3];
        //console.log('the current date:',curDate)
        await this.setState({date: curDate})
        await this.setState({curDate: str[2]})
        await this.setState({curMonth: Month})
        await this.setState({curYear: str[3]})
        await this.connectApiToGetFirstBlogsData();
        //console.log('the date state:',this.state.curDate,'--',this.state.curMonth,'---',this.state.curYear,'---',this.state.date)
    };

    //convert month in string to num
    convertMonth= (month) =>{
        var months
        switch(month){   
            case 'Jan':
                months = '01';
                break;
            case 'Feb':
                months ='02';
                break;
            case 'Mar':
                months = '03';
                break;
            case 'Apr':
                months = '04';
                break;
            case 'May':
                months ='05';
                break;
            case 'Jun':
                months ='06';
                break;
            case 'Jul':
                months ='07';
                break;
            case 'Aug':
                months ='08';
                break;
            case 'Sep':
                months ='09';
                break;
            case 'Oct':
                months ='10';
                break;
            case 'Nov':
                months ='11';
                break;
            case 'Dec':
                months ='12';
                break;
        }
        return months

    }
        
    //refs for ux purpose to navigate to next field by click
    ref_input2 = createRef();
    ref_input3 = createRef();
    ref_input4 = createRef();

    showDatePicker = () => {
        this.setState({showCalender: true})
    }

    //api to store img datas in server including s3 img url
    connectApiToGetFirstBlogsData = async () => {
        //console.log('the current date in state:',this.state.curDate,"---",this.state.curMonth,'---',this.state.curYear)
        try { 
            //console.log('you are in upload api')
            await fetch('http://10.0.2.2:3000/gratitude/searchDate', {
                method: 'POST',
                headers: {
                    'Content-Type' : 'application/json',
                    //  'enctype': 'multipart/form-data' 
                },
                body: JSON.stringify({
                    unique_id: '5f1e9af143c44424b8e0da25',
                    day: this.state.curDate,
                    month: this.state.curMonth,
                    year: this.state.curYear
                })
            })
            .then(res => res.json())
            .then(data =>{
                //this.setState({firstBlogsData: [this.state.firstBlogsData,data]})
                //console.log('the gratitude all content data:',data,'---',data.length,"---",typeof(data))
                //console.log('the date data:',data,'---',data.dateSearch,"---",data.content)
                this.setState({isContPresent: data.content})
                if(data.dateSearch.length == 0){
                    this.setState({isFirstBlogsPresent: true}) 
                } else {
                    this.setState({isFirstBlogsPresent: false})
                }
                this.setState({firstBlogsData: data.dateSearch})
                //console.log('the fistBlogsData:',this.state.firstBlogsData,"--",this.state.firstBlogsData.length)
            })
        } catch (error) {
            console.log('the catch error',error)
        } 
    }  

    //api to store img datas in server including s3 img url
    connectApiToGetMonthBlogs = async () => {
        try { 
            //console.log('you are in upload api')
            await fetch('http://10.0.2.2:3000/gratitude/searchMonthLimit', {
                method: 'POST',
                headers: {
                    'Content-Type' : 'application/json',
                    //  'enctype': 'multipart/form-data' 
                },
                body: JSON.stringify({
                    unique_id: '5f1e9af143c44424b8e0da25',
                    month: this.state.curMonth,
                    //month: 7,
                    year: this.state.curYear
                })
            })
            .then(res => res.json())
            .then(data =>{
                console.log("the month data from server:",data);
                if(data.length == 0){
                    this.setState({isSecondBlogsPresent: false}) 
                } else {
                    this.setState({isSecondBlogsPresent: true})
                }
                this.setState({secondBlogsData: data})
            })
        } catch (error) {
            console.log('the catch error',error)
        } 
    }

    //function to navigate gratitude post page
    NAVIGATE_TO_GRATITUDE_POST = () => {
        //console.log('clicked post icon')
        this.props.navigation.navigate('Gratitude_Post',{id: ''});
    }

    //function to navigate gallery home page
    NAVIGATE_TO_GRATITUDE_DETAILS = () => {
        //console.log('the data to details page:',this.state.curMonth,'---',this.state.curYear);
        this.props.navigation.navigate('Gratitude_Details',{month: this.state.curMonth,year: this.state.curYear});
    }

    renderSecondblogs( {item} ) {
        return (
            <View style={{marginHorizontal: hp('1%'), marginRight: hp('-1%'), marginVertical: hp('0.5%')}}>
                <View style={Styles.BlogsContainer}>
                    <TouchableOpacity onPress={()=> this.NAVIGATE_TO_GRATITUDE_POST}>
                        <Text style={Styles.BlogsText}>{item.content}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    renderMonthsblogs=( {item} ) => {
         //convert month in string to num
        const convertMonth= (month) =>{
            var months
            switch(month){   
                case 'January':
                    months = '01';
                    break;
                case 'February':
                    months ='02';
                    break;
                case 'March':
                    months = '03';
                    break;
                case 'April':
                    months = '04';
                    break;
                case 'May':
                    months ='05';
                    break;
                case 'June':
                    months ='06';
                    break;
                case 'July':
                    months ='07';
                    break;
                case 'August':
                    months ='08';
                    break;
                case 'September':
                    months ='09';
                    break;
                case 'October':
                    months ='10';
                    break;
                case 'November':
                    months ='11';
                    break;
                case 'December':
                    months ='12';
                    break;
            }
            return months
        }
        //console.log('the data to details page:',item,'---',this.state.curYear);
        return (
            <View style={{marginHorizontal: hp('1%'), marginVertical: hp('0.5%')}}>
                <View style={Styles.BlogsMonthContainer}>
                    <TouchableOpacity onPress={()=> this.props.navigation.navigate('Gratitude_Details',{month: convertMonth(item),year: this.state.curYear})}>
                        <Text style={Styles.BlogsMonthText}>{item}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    renderFirstBlogs= ( {item} ) => {
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
        //console.log('the every item:',item)
        //console.log('the splitted value:',Month,'--',day,'--',dr[0],'--',dr[2],'--',full_Day)
        return (
            <View style={{marginTop: hp('1.1%')}}>
                <View style={[Styles.BlogsContainer,{ height: hp('25%')}]}>
                    <Text style={[Styles.BlogsText,{height: hp('21%')}]}>{item.content}</Text>
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
                    <View style={{flexDirection: 'row',justifyContent: 'flex-start',marginTop: hp('1%'),alignItems:'center'}}>
                        <Icon name='arrowleft' type='antdesign' iconStyle={{marginTop: hp('0.3%')}} size= {30} color= {Colors.white}/>
                        <View style={{flexDirection: 'column', width: wp('70%'),justifyContent: 'space-between', paddingTop: hp(2.211), paddingLeft: hp(2.95)}}>                    
                            <Text style={Styles.HeaderText}>Gratitude</Text>
                            <Text style={Styles.SubHeaderText}>Share life moments with baba</Text>
                        </View>
                        <ProfilePic />
                    </View>
                </View>
                <View style={Styles.DateContainer}>
                    <Text style={Styles.DateText} onPress={this.showDatePicker}>Today's Date:</Text>
                    <Text style={[Styles.DateText,{fontFamily: Constants.fontBold, paddingLeft: hp(1)}]} onPress={this.showDatePicker}>{this.state.date}</Text>
                </View>
                <View style= {Styles.ContentContainer}>
                    <View>
                        {this.state.isFirstBlogsPresent ? 
                            (<View style={{height: hp('25%'),justifyContent: 'center',alignItems: 'center'}}>
                                <Text style={[Styles.EmptyContText,{top: hp('-5%')}]}>No gratitude data on this date.</Text>
                            </View>): 
                            (<View>
                                <FlatList data={this.state.firstBlogsData}
                                    renderItem= {this.renderFirstBlogs}
                                    keyExtractor={item => item._id} 
                                    horizontal= {true}
                                    showsHorizontalScrollIndicator= {false}
                                />
                            </View>)
                        }
                    </View>
                    <View style= {Styles.HeaderYearContainer}>
                        <Text style={{color: Colors.SecondaryColor_2,lineHeight: hp(4.20), fontSize: hp(3),fontFamily: Constants.fontMedium }}>Earlier this month</Text>
                        {this.state.isSecondBlogsPresent &&
                            <Text onPress={this.NAVIGATE_TO_GRATITUDE_DETAILS} style={{alignItems: 'flex-end',alignSelf: 'flex-end',color: Colors.PrimaryColor_2,lineHeight: hp(2.95), fontSize: hp(2.211),fontFamily: Constants.fontRegular }}>View all</Text>
                        }
                    </View>
                        {this.state.isSecondBlogsPresent ?
                            (<View style={{top: hp('-7%'), marginLeft: hp('-1%'),marginBottom: hp('2.11')}}>
                                <FlatList data={this.state.secondBlogsData}
                                    renderItem= {this.renderSecondblogs}
                                    keyExtractor={item => item.crAt} 
                                    horizontal= {true}
                                    showsHorizontalScrollIndicator= {false}
                                />
                            </View>)
                            : 
                            (<View style={{height: hp('20%'),justifyContent: 'center',alignItems: 'center'}}>
                                <Text style={[Styles.EmptyContText,{top: hp('-12%')}]}>No gratitude data on this month.</Text>
                            </View>)
                        }
                    <View style= {[Styles.HeaderYearContainer,{top: hp('-18%')}]}>
                        <Text style={{color: Colors.SecondaryColor_2,lineHeight: hp(4.20), fontSize: hp(3),fontFamily: Constants.fontMedium }}>Earlier this year</Text>
                    </View>
                    <View style={{top: hp('-16.5%'), marginLeft: hp('-1%'), marginBottom: hp('2.11')}}>
                        <FlatList data={this.state.monthsData}
                            renderItem= {this.renderMonthsblogs}
                            keyExtractor={item => item.id} 
                            horizontal= {true}
                            showsHorizontalScrollIndicator= {false}
                        />
                    </View>
                    <View style={Styles.IconContainer}>
                        <Icon name='edit' type='materialicons' size= {25} color= {Colors.white} onPress={this.NAVIGATE_TO_GRATITUDE_POST} style={{borderColor: Colors.PrimaryColor_1}}/>
                    </View>
                </View>
                {this.state.showCalender && (
                    <DateTimePicker
                        testID="dateTimePicker"
                        value={new Date()}
                        mode="date"
                        display="calendar"
                        onChange={this.onChangeDate}
                        textColor={Colors.PrimaryColor_1}
                        minimumDate={new Date(2020, 0, 1)}
                        maximumDate={new Date(2035, 10, 20)}
                    />
                )}
            </View>
        )
    }
}

const Styles= StyleSheet.create({
    Container: {
        flex: 1,
        backgroundColor: Colors.white
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
        lineHeight: hp(2.211),
        paddingTop: hp('-0.35%')
    },
    ContentContainer: {
        flex: 4.30,
        //paddingVertical: hp(2.95),
        paddingHorizontal: hp(2.95),
        backgroundColor: Colors.white,
        flexDirection: 'column',
        justifyContent: 'flex-start'
    },
    DateContainer: {
        width: wp('50%'),
        height: hp('5%'),
        borderRadius: hp('5%'),
        elevation: 4,
        position: 'relative',
        top: hp('-3%'),
        left: wp('25%'),
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.white,
        zIndex: 1
    },
    DateText: {
        fontFamily: Constants.fontRegular,
        fontSize: hp(1.77),
        lineHeight: hp(2.211),
        color: Colors.SecondaryColor_2
    },
    BlogsContainer: {
        width: wp('73%'),
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
        marginRight: hp('2.5%'),
        marginBottom: hp('6%'),
        marginTop: hp('1.5%'),
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
    BlogsMonthContainer: {
        width: wp('30%'),
        height: hp('5%'),
        top: hp('-2%'),
        //borderColor: Colors.ShadowColor_1,
        borderLeftColor: Colors.white,
        borderLeftWidth: hp(0.5),
        borderRightColor: Colors.white,
        borderRightWidth: hp(0.1),
        borderBottomColor: Colors.white,
        borderBottomWidth: hp(0.1),
        borderTopColor:  Colors.ShadowColor_1,
        //borderTopRightRadius: hp('4%'),
        borderTopWidth: hp(0.05),
        justifyContent: 'center',
        alignItems: 'center',
        //marginRight: hp('2.3%'),
        marginBottom: hp('6%'),
        marginTop: hp('1.5%'),
        borderRadius: hp('1'),
        backgroundColor: Colors.white,
        elevation: 3
    },
    EmptyContText: {
        fontFamily: Constants.fontMedium,
        fontSize: hp(2.211),
        lineHeight: hp(2.655),
        color: Colors.SecondaryColor_2,
    },
    BlogsMonthText: {
        fontFamily: Constants.fontMedium,
        fontSize: hp(1.77),
        lineHeight: hp(2.211),
        color: Colors.SecondaryColor_2,
        padding: hp(2.44),
    },
    HeaderYearContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        top: hp('-8.5%'),
        marginTop: hp(2.11),
        marginBottom: hp(1)
    },
    IconContainer: {
        position: 'absolute',
        right: 20,
        bottom: 16,
        backgroundColor: Colors.PrimaryColor_1, 
        height: hp('8.5%'), 
        width: wp('14.3%'), 
        borderRadius: hp('100'),
        elevation: 7,
        justifyContent: 'center',
        alignItems: 'center'
    }
})

/*
<Text style={{alignItems: 'flex-end',alignSelf: 'flex-end',color: Colors.PrimaryColor_2,lineHeight: hp(2.95), fontSize: hp(2.211),fontFamily: Constants.fontRegular }}>View all</Text>
<View style= {Styles.ContentContainer}>
                    <View>
                        {this.state.isFirstBlogsPresent ? 
                            (<View style={{height: hp('25%'),justifyContent: 'center',alignItems: 'center'}}>
                                <Text style={[Styles.EmptyContText,{top: hp('-5%')}]}>No gratitude data on this date.</Text>
                            </View>): 
                            (<FlatList data={this.state.firstBlogsData}
                                renderItem= {this.renderFirstBlogs}
                                keyExtractor={item => item._id} 
                                horizontal= {true}
                                showsHorizontalScrollIndicator= {false}
                            />)
                        }
                    </View>
                    <View style= {Styles.HeaderYearContainer}>
                        <Text style={{color: Colors.SecondaryColor_2,lineHeight: hp(4.20), fontSize: hp(3),fontFamily: Constants.fontMedium }}>Earlier this month</Text>
                        {this.state.isSecondBlogsPresent &&
                            <Text onPress={this.NAVIGATE_TO_GRATITUDE_DETAILS} style={{alignItems: 'flex-end',alignSelf: 'flex-end',color: Colors.PrimaryColor_2,lineHeight: hp(2.95), fontSize: hp(2.211),fontFamily: Constants.fontRegular }}>View all</Text>
                        }
                    </View>
                    {this.state.isSecondBlogsPresent ?
                        (<View style={{top: hp('-7.5%'),marginBottom: hp('2.11')}}>
                            <FlatList data={this.state.secondBlogsData}
                            renderItem= {this.renderblogs}
                            keyExtractor={item => item.crAt} 
                            horizontal= {true}
                            showsHorizontalScrollIndicator= {false}
                            />
                        </View>)
                        : 
                        (<View style={{height: hp('20%'),justifyContent: 'center',alignItems: 'center'}}>
                            <Text style={[Styles.EmptyContText,{top: hp('-12%')}]}>No gratitude data on this month.</Text>
                        </View>)
                    }
                    <View style= {[Styles.HeaderYearContainer,{top: hp('-18%')}]}>
                        <Text style={{color: Colors.SecondaryColor_2,lineHeight: hp(4.20), fontSize: hp(3),fontFamily: Constants.fontMedium }}>Earlier this year</Text>
                        <Text style={{alignItems: 'flex-end',alignSelf: 'flex-end',color: Colors.PrimaryColor_2,lineHeight: hp(2.95), fontSize: hp(2.211),fontFamily: Constants.fontRegular }}>View all</Text>
                    </View>
                    <View style={{top: hp('-16.5%'),marginBottom: hp('2.11')}}>
                        <FlatList data={this.state.monthsData}
                            renderItem= {this.renderMonthsblogs}
                            keyExtractor={item => item.id} 
                            horizontal= {true}
                            showsHorizontalScrollIndicator= {false}
                        />
                    </View>
                    <View style={Styles.IconContainer}>
                        <Icon name='edit' type='materialicons' size= {25} color= {Colors.white} onPress={this.NAVIGATE_TO_GRATITUDE_POST} style={{borderColor: Colors.PrimaryColor_1}}/>
                    </View>
                </View>

*/



    //get current month and year
    /*getCurrentMonth = async () => {
        var d = new Date();
        var mon = await d.getMonth();
        var mont= await mon + 1;
        var year= await d.getFullYear();
        await this.setState({curMonth: mont})
        await this.setState({curYear: year})
        //console.log("the current year:",this.state.month,'---',this.state.year,'---',mont,'---',year,'--',typeof(mont),'---',typeof(year))
    }*/


/*
<View style={{ paddingRight: hp(2.95),  paddingTop: hp(3.685)}}>
                            <Avatar size={60} rounded  source={{uri: this.state.profilePic}} />
                        </View>
*/