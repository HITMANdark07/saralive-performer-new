import { View, Text, TouchableOpacity, Image,ScrollView, Dimensions, StyleSheet, ActivityIndicator, ToastAndroid } from 'react-native';
import React from 'react';
import { connect } from 'react-redux';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import Icon from 'react-native-vector-icons/Ionicons';
import InputText from '../components/InputText';
import Ico from 'react-native-vector-icons/MaterialIcons';
import Footer from '../components/Footer';
import axios from 'axios';
import { API } from '../../api.config';
import { setCurrentUser } from '../redux/user/user.action';


const dark= '#10152F';
const windowWidth = Dimensions.get('window').width;
const PerformerUpdate = ({currentUser, setUser, navigation}) => {

    const [img, setImage] = React.useState(currentUser.images[currentUser?.images?.length-1]?.image);
    const [showBu, setShowBu] = React.useState(false);
    // console.log(currentUser);
    const [firstName, setFirstName] = React.useState(currentUser?.f_name);
    const [lastName, setLastName] = React.useState(currentUser?.l_name);
    const [email , setEmail] = React.useState(currentUser?.email);
    const [phone, setPhone] = React.useState(currentUser?.phone);
    const [coins, setCoins] = React.useState(currentUser.coin_per_min);
    // const [password, setPassword] = React.useState("");
    const [address, setAddress] = React.useState(currentUser?.address);
    const [aadhar, setAadhar] = React.useState(currentUser?.adhaar_no);
    const [dob, setdob] = React.useState(new Date(currentUser?.dob));
    const [show , setShow] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const handleChange = (name, e) => {
        setShowBu(true);
        switch(name){
            case 'firstName':
                setFirstName(e);
                break;
            case 'lastName':
                setLastName(e);
                break;
            case 'email':
                setEmail(e);
                break;
            case 'phone':
                setPhone(e);
                break;
            // case 'password':
            //     setPassword(e);
            //     break;
            case 'aadhar':
                setAadhar(e);
                break;
            case 'address':
                setAddress(e);
                break;
            case 'coins':
                setCoins(e);
                break;
            default:
                console.log("none",e);
        }
    }
    const getUserDetails = () => {
        axios({
            method:'POST',
            url:`${API}/performer_details`,
            data:{user_id: currentUser.id}
        }).then((res) =>{
            if(res.data.responseCode){
                setUser(res.data.responseData);
            }
        }).catch((err) => {
            console.log(err);
        })
    }

    const updateit = () => {
        let formData = new FormData();
        formData.append('user_id', currentUser.id);
        formData.append('f_name', firstName);
        formData.append('l_name', lastName);
        formData.append('dob',moment(dob).format('YYYY-MM-DD'));
        formData.append('adhaar_no', aadhar);
        formData.append('address', address);
        formData.append('coin_per_min', coins);
        axios({
            method:'POST',
            url:`${API}/performer_profile_update`,
            data:formData
        }).then((res)=>{
            if(res.data.responseCode){
                ToastAndroid.showWithGravity(res.data.responseText, ToastAndroid.CENTER, ToastAndroid.SHORT);
                setShowBu(false);
                getUserDetails();
            }else{
                ToastAndroid.showWithGravity(res.data.responseText, ToastAndroid.CENTER, ToastAndroid.SHORT);
                setShowBu(false);
            }
        }).catch((err) =>{
            console.log(err);
            setShowBu(false);
        })

    }
  return (
    <View style={{flex:1, backgroundColor:dark}}>
            <View style={{backgroundColor:'#1A224B', borderBottomLeftRadius:50, borderBottomRightRadius:50, marginBottom:20}}>
                <TouchableOpacity style={{padding:5, position:'absolute', margin:10}} onPress={() => navigation.goBack()}>
                    <Icon name="arrow-back" size={30} color="#fff" />
                </TouchableOpacity>
            <Text style={{color:'#fff', fontWeight:'300', alignSelf:'center', letterSpacing:4, fontSize:20,margin:20}}>{currentUser.f_name.toUpperCase()}   {currentUser.l_name.toUpperCase()}</Text>
            </View>
            <View style={{flexDirection:'column'}}>
                <View>
                    <View style={{flexDirection:'column', justifyContent:'center',width:windowWidth-60, margin:30, marginTop:10}}>
                    <Image source={{uri : img ? img : 'https://pbs.twimg.com/profile_images/1280095122923720704/K8IvmzSY_400x400.jpg'}} style={{alignSelf:'center',width:150, height:150, borderRadius:100,borderColor:'#fff', borderWidth:1}} />
                    </View>
                </View>
            </View>
            <ScrollView style={{flexDirection:'column', flex:2, width:windowWidth-40, alignSelf:'center'}} showsVerticalScrollIndicator={false}>
                    <InputText name="firstName" icon="person" placeholder="First Name" value={firstName} handleChange={handleChange}  />
                    <InputText name="lastName" icon="person" placeholder="Last Name" value={lastName} handleChange={handleChange}  />
                    <TouchableOpacity style={styles.input} onPress={() => setShow(true)}>
                            <Ico name='cake' style={styles.icon} size={30} color="#fff"  />
                            <Text style={{flex:1, color:'#fff'}}  >{moment(dob).format('YYYY-MM-DD')}</Text>
                        </TouchableOpacity>
                    {show && <DateTimePicker
                            testID="dateTimePicker"
                            value={dob}
                            mode="date"
                            // is24Hour={true}
                            display="calendar"
                            onChange={(e) => {
                                setShow(false);
                                setShowBu(true);
                                if(e.nativeEvent && e.nativeEvent.timestamp){
                                    setdob(e.nativeEvent.timestamp);
                                }
                            }}
                    />}
                    {/* <InputText name="email" icon="email" placeholder="Email" value={email} handleChange={handleChange}  />
                    <InputText name="phone" icon="phone" placeholder="Phone" value={phone} handleChange={handleChange} type="numeric"  /> */}
                    {/* <InputText name="password" icon="lock" placeholder="Password" value={password} handleChange={handleChange} password={true}  /> */}
                    <InputText name="aadhar" icon="video-label" placeholder="Aadhar Number" value={aadhar} handleChange={handleChange} type="numeric" />
                    <InputText name="coins" icon="flash-on" placeholder="Coins per minute charge" value={coins} handleChange={handleChange} type="numeric" />
                    <InputText name="address" icon="person-pin-circle" placeholder="Address ( Ex: City Country )" value={address} handleChange={handleChange} />

                    {
                        showBu &&
                        (
                            <View>
                    {
                    loading ?
                    (
                        <View style={{alignSelf:'center'}}>
                            <ActivityIndicator size="large" color="#fff" />
                        </View>
                    )
                    :
                    (
                        <TouchableOpacity style={styles.button} onPress={updateit} >
                            <Ico name="update" size={30} color='#fff' style={{marginRight:20}} />
                            <Text style={{fontSize:22, fontWeight:'400', color:'#fff'}}>UPDATE</Text>
                        </TouchableOpacity>
                    )
                    }
                    </View>
                        )
                    }
            </ScrollView>
            
        </View>
  );
};

const styles = StyleSheet.create({
    container:{
        width:'85%',
        marginTop:20,
        justifyContent:'center',
        alignSelf:'center',
        padding:10,
        // fontFamily:iconFont
    },
    icon:{
        padding:6,
        borderRadius:50
    },
    input:{
        flexDirection:'row', 
        // justifyContent:'center', 
        color:'#fff',
        alignItems:'center',
        borderColor:'#fff',
        borderWidth:0.5,
        borderRadius:50,
        marginTop:10, 
        marginBottom:10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,

        elevation: 5,
    },
    button:{
        backgroundColor:'#4BD5CF',
        flexDirection:'row',
        justifyContent:'center',
        marginTop:20,
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
    currentUser: state.user.currentUser
});
const mapDispatchToProps = (dispatch) => ({
    setUser : (user) => dispatch(setCurrentUser(user))
})

export default connect(mapStateToProps, mapDispatchToProps)(PerformerUpdate);
