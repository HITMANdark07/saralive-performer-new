import React from 'react';
import { View, Text, StyleSheet,TouchableOpacity, ScrollView, RefreshControl, Image, Dimensions, PermissionsAndroid, ToastAndroid } from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import { connect } from 'react-redux';
import { API } from '../../api.config';
import Icon from 'react-native-vector-icons/Entypo';
import PerformerCard from '../components/PerformerCard';
import Footer from '../components/Footer';
import InputText from '../components/InputText';
import axios from 'axios';
import { setCurrentUser, setData } from '../redux/user/user.action';

const dark= '#10152F';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
  }


const Home = ({navigation, currentUser,coinData,updateCoinData, setUser}) => {
    // const [f_name, setF_name] = React.useState(currentUser.f_name);
    // const [l_name, setL_name] = React.useState(currentUser.l_name);
    const [img, setImage] = React.useState(currentUser.images[currentUser?.images?.length-1]?.image);
    const [upImage, setUpImage] = React.useState(null);
    const [showUpload , setShowUpload] = React.useState(false);
    const [followers, setFollowers] = React.useState([]);
    // const handleChange = (name, e) => {
    //     switch(name){
    //         case 'f_name':
    //             setF_name(e);
    //             break;
    //         case 'l_name':
    //             setL_name(e);
    //             break;
    //         default:
    //             console.log("none",e);
    //     }
    // }

    const requestCameraPermission = async () => {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.CAMERA,
            {
              title: "App Camera Permission",
              message:"App needs access to your camera ",
              buttonNeutral: "Ask Me Later",
              buttonNegative: "Cancel",
              buttonPositive: "OK"
            }
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            return true;
          } else {
            return false
          }
        } catch (err) {
          console.warn(err);
        }
      };
      
    const uploadImage = () => {
        let formData = new FormData();
        formData.append('user_id', currentUser.id);
        formData.append('image', {
            uri: upImage.path,
            name: `image.${upImage.mime.split("/")[1]}`,
            type: upImage.mime
        });
        
        axios({
            method:'POST',
            url:`${API}/performer_profile_image_upload`,
            data:formData
        }).then((res) => {
            if(res.data.responseCode){
                setUser({...currentUser, images: res.data.responseData});
            }
            setShowUpload(false);
        }).catch((err) => {
            console.log(err);
            setShowUpload(false);
        })
    }
    const  openGallery = () => {
        ImagePicker.openPicker({mediaType:'photo', cropping:true, includeBase64:true}).then(res => {
            console.log({...res,data:""});
            setUpImage(res);
            setImage(`data:image/jpeg;base64,${res.data}`);
            setShowUpload(true);
        }).catch(err => {
            console.log(err);
        })
    }
    // console.log(image);
    const openCamera = async() => {
        let granted = await requestCameraPermission();
        if(granted){
            ImagePicker.openCamera({mediaType:'photo', cropping:true, includeBase64:true}).then(res => {
                console.log({...res,data:""});
                setUpImage(res);
                setImage(`data:image/jpeg;base64,${res.data}`);
                setShowUpload(true);
            }).catch(err => {
                console.log(err);
            })
        }else{
            ToastAndroid.showWithGravity("CAMERA PERMISSION DENIED", ToastAndroid.CENTER, ToastAndroid.SHORT);
        }
    }

    const delPhoto = (id) => {
        axios({
            method:'POST',
            url:`${API}/performer_profile_image_delete`,
            data:{
                user_id: currentUser.id,
                image_id: id
            }
        }).then((res) => {
            if(res.data.responseCode && res.data.responseData){
                ToastAndroid.showWithGravity(res.data.responseText, ToastAndroid.CENTER, ToastAndroid.SHORT);
                setUser({...currentUser, images: res.data.responseData});
            }
        }).catch((err) => {
            console.log(err);
        })
    };

    const getFollowers = React.useCallback(() => {
        axios({
            method:'POST',
            url:`${API}/customer_follow_list`,
            data:{performer_id:currentUser.id}
        }).then((res) => {
            if(res.data.responseCode){
                setFollowers(res.data.responseData);
            }
        }).catch((err) => {
            console.log(err);
        })
    },[]);

    React.useEffect(() => {
        getFollowers();
    },[]);
    
    return (
        <View style={{flex:1, backgroundColor:dark}}>
            <View style={{backgroundColor:'#1A224B', borderBottomLeftRadius:50, borderBottomRightRadius:50, marginBottom:20}}>
            <Text style={{color:'#fff', fontWeight:'300', alignSelf:'center', letterSpacing:4, fontSize:20,margin:20}}>{currentUser.f_name.toUpperCase()}   {currentUser.l_name.toUpperCase()}</Text>
            </View>
            {/* <ScrollView  refreshControl={
            <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
            />
            }
            > */}
            <View style={{flexDirection:'column'}}>
                <View>
                    <View style={{flexDirection:'column', justifyContent:'center',width:windowWidth-60, margin:30, marginTop:10}}>
                    <Image source={{uri : img ? img : 'https://pbs.twimg.com/profile_images/1280095122923720704/K8IvmzSY_400x400.jpg'}} style={{alignSelf:'center',width:150, height:150, borderRadius:100,borderColor:'#fff', borderWidth:1}} />
                    <TouchableOpacity activeOpacity={0.5} onPress={() => {
                        navigation.navigate('Followers',{followers});
                    }}>
                    <View style={{alignItems:'center'}}>
                        <Text style={{color:'#fff', fontSize:22}}>{followers.length}</Text>
                        <Text style={{color:'#fff',fontSize:10, fontWeight:'300'}}>FOLLOWERS</Text>
                    </View>
                    </TouchableOpacity>
                        {/* <InputText name="f_name" icon="person" placeholder="First Name" value={f_name} handleChange={handleChange}  />
                        <InputText name="l_name" icon="person" placeholder="Last Name" value={l_name} handleChange={handleChange}  /> */}
                        <TouchableOpacity style={{backgroundColor:'#3498DB', position:'absolute',top:0, left:0, padding:10, borderRadius:20}} onPress={openGallery}>
                        <Icon name="folder-images" size={20} color="#fff" />
                        </TouchableOpacity>
                        <TouchableOpacity style={{backgroundColor:'#3498DB', position:'absolute',top:0, right:0, padding:10, borderRadius:20}} onPress={openCamera}>
                        <Icon name="camera" size={20} color="#fff" />
                        </TouchableOpacity>
                        {
                            showUpload && 
                            (
                                <TouchableOpacity style={styles.button} onPress={uploadImage} >
                                    <Icon name="upload-to-cloud" size={30} color='#fff' style={{marginRight:20}} />
                                    <Text style={{fontSize:22, fontWeight:'400', color:'#fff'}}>UPLOAD</Text>
                                </TouchableOpacity>
                            )
                        }
                    </View>
                </View>
            </View>
            <ScrollView showsVerticalScrollIndicator={false} style={{marginBottom:60}} >
                            {currentUser.images.length>0 ?
                            (
                                <View style={{display:'flex', flexDirection:'row', justifyContent:'center', flexWrap:'wrap', margin:10}}>
                                {
                                    currentUser.images.map((img, idx) => (
                                        <View key={idx} style={{height:230, width:(windowWidth/2)-20, margin:5, borderRadius:5, overflow:'hidden'}}>
                                            <Image source={{uri:img.image}} style={{height:230, width:(windowWidth/2)-20}}  />
                                            <TouchableOpacity style={{backgroundColor:'#ff0000', padding:8, borderRadius:20, position:'absolute', right:0, margin:3}} onPress={() => delPhoto(img.id)}>
                                            <Icon name="trash" size={20} color='#fff' />
                                            </TouchableOpacity>
                                        </View>
                                    ))
                                }
                                </View>
                            )
                            :
                            (
                                <View style={{display:'flex', flexDirection:'row', justifyContent:'center', flexWrap:'wrap'}}>
                                    <Text style={{color:'#fff', fontWeight:'300', alignSelf:'center', letterSpacing:4, fontSize:20}}>Upload Some more Pictures...</Text>
                                </View>
                            )
                            }
                </ScrollView>
            {/* </ScrollView> */}
            <Footer navigation={navigation} name="discover" />
        </View>
    )
}
const styles = StyleSheet.create({
    button:{
        backgroundColor:'#4BD5CF',
        flexDirection:'row',
        justifyContent:'center',
        marginTop:45,
        marginBottom:20,
        width:'50%',
        alignSelf:'center',
        borderRadius:50,
        alignItems:'center',
        padding:8,
        margin:5,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,

        elevation: 5,
    }
})

const mapStateToProps = (state) => ({
    currentUser: state.user.currentUser,
    coinData: state.user.data
});
const mapDispatchToProps = (dispatch) => ({
    setUser : (user) => dispatch(setCurrentUser(user)),
    updateCoinData : data => dispatch(setData(data))
})

export default connect(mapStateToProps, mapDispatchToProps)(Home)
