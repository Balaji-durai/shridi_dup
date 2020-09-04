import React, { Component } from 'react';
import { View, StyleSheet, Text, ScrollView, FlatList, TouchableWithoutFeedback} from 'react-native';
import { Constants, Colors } from '../../Styles';
import { Icon, Avatar, SearchBar, ListItem } from 'react-native-elements';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import FastImage from 'react-native-fast-image';
import { ProfilePic } from '../../Components';

/*
   @fullView means display pattern which contains diff types of flatlist component 
   @homeView means display pattern like gallery home screen 
*/

export default class GalleryFullScreen extends Component {

    constructor(props) {
        super(props) 
        this.state ={
            search: '',                           //for search
            imgUrlsData: [],                      //array for total image urls
            firstImg: '',                         // for first img url
            secondImg: '',                        // for second img url
            thirdImg: '',                         // for third img url
            xlImgUrl: '',                         // for xl image in gallery view
            //remainingImgUrls: [],
            fullView: false,                      //set full view or home view by total image count
            imgCont1Data: [],                     // array container for 1st flatlist component
            imgCont2Data: [],                     //array container for 2nd flatlist component
            imgCont3Data: [],                     // array container for remaining img urls after splicing
        }
    }

    componentDidMount() {
        this.connectApiForAllImgs();
    }

    //connect the server and get data
    connectApiForAllImgs = async () => {
        try { 
            await fetch('http://192.168.1.7:3000/gallery/allimageurl', {
                method: 'GET',
            })
            .then(res => res.json())
            .then( async data =>{
                this.setGalleryView(data);                               //set the display pattern according to total image count
                //console.log('the img url from server:',this.state.remainingImgUrls);
            })
        } catch (error) {
           console.log('the catch error',error)
         } 
    }  

    //set the gallery view according to total images
    setGalleryView= (data) => {
        //set the data in the state imgUrlsData array by setState and 
            //this setStates are common for both display pattern
            this.setState({imgUrlsData: data}) 
            this.setState({firstImg: this.state.imgUrlsData[0].url})
            this.setState({secondImg: this.state.imgUrlsData[1].url})
            this.setState({thirdImg: this.state.imgUrlsData[2].url})
            // if total imgs are more than 20 set full view else set home view
            if(data.length > 20) { 
                //console.log('inside fullView',data.length,this.state.imgUrlsData)
                var imgCont1= data.splice(3,8)                           //splice the imgs from 3 to 11 index to form imgCont1
                var imgCont2= data.splice(3,8)                           //splice the imgs from 11 to 19 index to form imgCont2
                var xlImg = data.splice(3,1)                             //splice index 20 img to store xlImg 
                var imgCont3= data.slice(4)                              //slice the remaining imgs to display
                //console.log('the data split:',imgCont1,'---',imgCont2,'---',imgCont3,'---',xlImg)
                this.setState({imgCont1Data: imgCont1}) 
                this.setState({imgCont2Data: imgCont2}) 
                this.setState({imgCont3Data: imgCont3})
                this.setState({fullView: true}) 
                this.setState({xlImgUrl: xlImg[0].url})
                //console.log('the data split in state:',this.state.imgCont1Data,'---',this.state.imgCont2Data,'---',this.state.imgCont3Data,'--',this.state.xlImgUrl,'---',this.state.fullView)
            } else {
                console.log('inside normal view')
                var remainingImage= data.slice(3) 
                this.setState({imgCont1Data: remainingImage})
                this.setState({fullView: false})
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
                 tag: this.state.search
             })
           })
           .then(res => res.json())
           .then( async data =>{
             //set the data in the state imgUrlsData array by setState  
             /*console.log('the img data:', data)
             this.setState({imgUrlsData:data}) 
             //this.setState({firstImg: this.state.imgUrlsData[0].url})
             console.log('the img data from state:',this.state.imgUrlsData);*/
             this.setGalleryView(data);                                  //set the gallery display pattern by total image count
           })
         } catch (error) {
           console.log('the catch error',error)
         } 
    }  

    //update the search state when search input value changes
    updateSearch = async (Search) => {
        await this.setState({search: Search });
        this.connectApiForSearch();                                      //call the api for getting img urls by search
    };

    // render function for flatlist which displays the sliced image array
    renderImgs =( {item} )=> {
        return (
            <TouchableWithoutFeedback onPress={()=>this.props.navigation.navigate('Gallery_Download',{imgUrl: item.url})}>
                <FastImage source={{uri: item.url}} resizeMode={FastImage.resizeMode.cover} style={[Styles.Images,{marginRight: hp(2),marginVertical: hp(1)}]}/>
            </TouchableWithoutFeedback>
        )
    } 

    //navigation function for gallery Home page
    Navigate_To_Gallery_Home = () => {
        this.props.navigation.navigate('Gallery_Home');
    }

    //navigation function for gallery post page
    NAVIGATE_TO_GALLERY_POST = () => {
        this.props.navigation.navigate('Gallery_Post');
    }

    render () {
        return (
            <View style= {Styles.Container}>
                <View style= {Styles.HeaderContainer}>
                    <View style={{flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', marginTop: hp('-2.5%')}}>
                        <Icon name='arrowleft' type='antdesign'  size= {30} color= {Colors.white} onPress={this.Navigate_To_Gallery_Home}/>
                        <View style={{flexDirection: 'column', justifyContent: 'space-between', paddingTop: hp(2.211), paddingLeft: hp(2.95), paddingRight: hp(17.275)}}>                    
                            <Text style={Styles.HeaderText}>Sai Gallery</Text>
                            <Text style={Styles.SubHeaderText}>Exclusive updates</Text>
                        </View>
                        <ProfilePic />
                    </View>
                </View>
                <View style= {Styles.ContentContainer}>
                    <ScrollView >
                        <SearchBar
                            placeholder="Search for topics" 
                            platform= 'android'
                            placeholderTextColor= {Colors.SecondaryColor_2}
                            containerStyle={{backgroundColor:Colors.white, marginTop: hp(2.211),marginHorizontal: hp('2.95'),height: hp(7.40),borderRadius: hp(1.44),elevation: 5,borderColor: Colors.white}}
                            inputContainerStyle={{backgroundColor:Colors.white, height: hp(6),borderRadius: hp(1.44)}}
                            onChangeText={this.updateSearch}
                            value={this.state.search}/>
                        <View style={Styles.ImagesContainer}>
                            <View style={{flexDirection: 'row',marginBottom: hp(1)}}>
                                <View>
                                    <TouchableWithoutFeedback onPress={()=>this.props.navigation.navigate('Gallery_Download',{imgUrl: this.state.firstImg})}>
                                        <FastImage source={{uri: this.state.firstImg}} resizeMode={FastImage.resizeMode.cover} style={{width: wp('69.25%'), height: hp('26%'), backgroundColor: Colors.SecondaryColor_2, borderRadius: hp(1.44),borderColor: Colors.white, elevation: 4}}/>
                                    </TouchableWithoutFeedback>
                                </View>
                                <View style={{marginLeft: hp(2),justifyContent: 'space-between'}}>
                                    <TouchableWithoutFeedback onPress={()=>this.props.navigation.navigate('Gallery_Download',{imgUrl: this.state.secondImg})}>
                                        <FastImage source={{uri: this.state.secondImg}} resizeMode={FastImage.resizeMode.cover} style={[Styles.Images]}/>
                                    </TouchableWithoutFeedback>
                                    <TouchableWithoutFeedback onPress={()=>this.props.navigation.navigate('Gallery_Download',{imgUrl: this.state.thirdImg})}>
                                        <FastImage source={{uri: this.state.thirdImg}} resizeMode={FastImage.resizeMode.cover} style={[Styles.Images]}/>  
                                    </TouchableWithoutFeedback>
                                </View>
                            </View>
                            { this.state.fullView ?
                                (<View style= {{flexDirection: 'column'}}>
                                    <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
                                        <FlatList data={this.state.imgCont1Data}
                                            renderItem= {this.renderImgs}
                                            keyExtractor={item => item.url} 
                                            numColumns = {4}
                                            horizontal= {false}
                                        />
                                    </View>
                                    <View style={{flexDirection: 'row'}}>
                                        <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
                                            <FlatList data={this.state.imgCont2Data}
                                                renderItem= {this.renderImgs}
                                                keyExtractor={item => item.url} 
                                                numColumns = {2}
                                                horizontal= {false}
                                            />
                                        </View>
                                        <View style={{marginTop: hp(1.30)}}>
                                            <FastImage source= {{uri: this.state.xlImgUrl}} resizeMode={FastImage.resizeMode.cover} style={{width: wp('45%'),height: hp('51.5%'), backgroundColor: Colors.SecondaryColor_2, borderRadius: hp(1.44),borderColor: Colors.white, elevation: 4}}/>
                                        </View>
                                    </View>
                                    <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
                                        <FlatList data={this.state.imgCont3Data}
                                            renderItem= {this.renderImgs}
                                            keyExtractor={item => item.url} 
                                            numColumns = {4}
                                            horizontal= {false}
                                        />
                                    </View>
                                </View>):
                                (<View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
                                    <FlatList data={this.state.imgCont1Data}
                                        renderItem= {this.renderImgs}
                                        keyExtractor={item => item.url} 
                                        numColumns = {4}
                                        horizontal= {false}
                                    />
                                </View>)
                               }
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
        flex: 5,
        //marginVertical: hp(2.11),
        backgroundColor: Colors.white,
    },
    ImagesContainer: {
        marginVertical: hp(2.95),
        marginHorizontal: hp(2.11),
        backgroundColor: Colors.white,
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
