import React from 'react';
import { View, Text, StyleSheet,TouchableOpacity, Image, ImageBackground, ToastAndroid } from 'react-native';
import { connect } from 'react-redux';
import { API } from '../../api.config';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Entypo';
import axios from 'axios';
import Ico from 'react-native-vector-icons/Ionicons';
import Ic from 'react-native-vector-icons/FontAwesome5';
import Footer from '../components/Footer';
import { setCurrentUser } from '../redux/user/user.action';

const dark= '#10152F';
const Profile = ({navigation, currentUser, setUser}) => {

    const [coins, setCoins] = React.useState(0.00);

    const init = () =>{
        axios({
            method:'POST',
            url:`${API}/performer_wallet_balance`,
            data:{performer_id:currentUser.id}
        }).then((res) => {
            if(res.data.responseCode){
                setCoins((+(res.data.responseData)).toFixed(2));
            }else{
                ToastAndroid.showWithGravity("Something went Wrong",ToastAndroid.CENTER, ToastAndroid.SHORT);
            }
        }).catch((err) => {
            console.log(err);
        })
    }
    React.useEffect(() => {
        init();
    },[]);

    const signOut = () => {
        setUser(null);
    }
    // console.log(currentUser);
    return (
        <View style={{flex:1, backgroundColor:dark}}>
            {/* <Text style={{color:'#fff'}}>{JSON.stringify(currentUser)}</Text> */}
            <ImageBackground source={require("../../assets/images/date.jpg")} resizeMode='cover' style={{flex:1}} >
            <View style={{padding:20, flexDirection:'column'}}>
            {
             currentUser && currentUser.images.length>0 ?
             
             (
                <Image source={{uri : currentUser.images[currentUser.images.length-1].image}} style={{width:100, height:100, borderRadius:100,borderColor:'#fff', borderWidth:1}} />
             )
             :
             (
              <View style={{backgroundColor:'#4BD5CF', width:100, height:100, borderRadius:100,borderRadius:50, justifyContent:'center'}}>
                <Ico name="camera" size={50} color="#fff" style={{alignSelf:'center'}}  />
              </View>
             )
           }
                <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                <Text style={{color:'#fff', fontWeight:'700', fontSize:22, marginTop:10}}>{currentUser.f_name} {currentUser.l_name}</Text>
                <TouchableOpacity style={{backgroundColor:'#3498DB', padding:10, borderRadius:20}} onPress={() => {
                    navigation.navigate('Update');
                }}>
                    <Ico name="settings" size={20} color="#fff" />
                </TouchableOpacity>
                </View>
                <View style={{backgroundColor:currentUser.sex==='male' ? '#4169E1':'#FF00FF',justifyContent:'flex-start', width:30, borderRadius:50}}>
                    <Ico name={currentUser.sex ==='male' ? "male":"female"} size={20} color="#fff" style={{padding:5}} />
                </View>
            </View>

           <TouchableOpacity activeOpacity={0.6} onPress={() => {
               navigation.navigate('WithDraw');
           }}>
            <LinearGradient colors={['#A020F0', '#FF00FF']} style={styles.coins} start={{ x: 0, y: 1 }}
                end={{ x: 1, y: 1 }}>
                <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                    <View style={{padding:20}}>
                        <Ic name='coins' color="#FFFF00" size={50} />
                    </View>
                    <View style={{flexDirection:'column', justifyContent:'space-evenly', flex:1, marginTop:10, marginBottom:10}}>
                        <Text style={{color:'#fff', fontSize:20, fontWeight:'800'}}>Coin WithDraw</Text>
                        <Text style={{color:'#fff', fontSize:14, fontWeight:'400'}}>My Coins: {coins} </Text>
                    </View>
                    <View style={{padding:20, justifyContent:'center'}}>
                        <Ic name="chevron-right" size={30} color='#fff' />
                    </View>
                </View>
            </LinearGradient>
            </TouchableOpacity>

            <View style={{flexDirection:'column', padding:20}}>
                {/* <TouchableOpacity activeOpacity={0.4}>
                <View style={{flexDirection:'row', justifyContent:'space-between', margin:10}}>
                    <Text style={{color:'#ddd', fontSize:20, fontWeight:'700'}}>Payment History</Text>
                    <Ic name="history" color="#ddd" size={25} />
                </View>
                </TouchableOpacity> */}

                <TouchableOpacity activeOpacity={0.4} onPress={() => {
                    navigation.navigate('Update');
                }}>
                <View style={{flexDirection:'row', justifyContent:'space-between', margin:10}}>
                    <Text style={{color:'#ddd', fontSize:20, fontWeight:'700'}}>Account Info</Text>
                    <Icon name="info-with-circle" color="#ddd" size={25} />
                </View>
                </TouchableOpacity>

                <TouchableOpacity activeOpacity={0.4} onPress={signOut}>
                <View style={{flexDirection:'row', justifyContent:'space-between', margin:10}}>
                    <Text style={{color:'#ddd', fontSize:20, fontWeight:'700'}}>Sign Out</Text>
                    <Icon name="log-out" color="#ddd" size={25} />
                </View>
                </TouchableOpacity>
            </View>
            </ImageBackground>

            <Footer navigation={navigation} name="me" />
        </View>
    )
}
const styles = StyleSheet.create({
    coins:{
        justifyContent:'center', 
        width:'90%', 
        borderRadius:50, 
        alignSelf:'center',
        shadowColor: "#fff",
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
    currentUser: state.user.currentUser
});
const mapDispatchToProps = (dispatch) => ({
    setUser : user => dispatch(setCurrentUser(user))
})

export default connect(mapStateToProps, mapDispatchToProps)(Profile)
