import React from 'react'
import Icon from 'react-native-vector-icons/Ionicons';
import Ico from 'react-native-vector-icons/MaterialIcons';
import InputText from '../components/InputText';
import LinearGradient from 'react-native-linear-gradient';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import axios from 'axios';
import { View,Image, Text, ActivityIndicator, StyleSheet, TouchableOpacity, ToastAndroid, ScrollView } from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import Ic from 'react-native-vector-icons/FontAwesome5';
import { API } from '../../api.config';


const theme1 = "#E5E5E5";
const SignUp = ({navigation}) => {

    const [firstName, setFirstName] = React.useState("");
    const [lastName, setLastName] = React.useState("");
    const [email , setEmail] = React.useState("");
    const [phone, setPhone] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [address, setAddress] = React.useState("");
    const [aadhar, setAadhar] = React.useState("");
    const [dob, setdob] = React.useState(new Date());
    const [show , setShow] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [showPass, setShowPass] = React.useState(false);
    const [image, setImage] = React.useState("");
    const [imageText, setImageText] = React.useState("");
    const handleChange = (name, e) => {
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
            case 'password':
                setPassword(e);
                break;
            case 'aadhar':
                setAadhar(e);
                break;
            case 'address':
                setAddress(e);
                break;
            default:
                console.log("none",e);
        }
    }
    const register = () => {
        setLoading(true);
        const formData = new FormData();
        formData.append("f_name",firstName);
        formData.append('l_name', lastName);
        formData.append('email', email);
        formData.append('phone', phone);
        formData.append('password', password);
        formData.append('address',address);
        formData.append('dob',moment(dob).format('YYYY-MM-DD'));
        formData.append('adhaar_no',aadhar);
        if(image) {
            formData.append('image',{
                uri: image.path,
                name: `image.${image.mime.split("/")[1]}`,
                type: image.mime
            });
        }else{
            ToastAndroid.showWithGravity("Please select a image", ToastAndroid.LONG, ToastAndroid.CENTER);
            setLoading(false);
            return;
        }
        console.log(formData);

        axios({
            method:'post',
            url:`${API}/performer_register`,
            data:formData,
        }).then((res) => {
            setLoading(false);
            console.log(res.data);
            if(res.data.responseCode){
                console.log(res.data.responseCode);
                ToastAndroid.showWithGravity(res.data.responseText, ToastAndroid.LONG, ToastAndroid.CENTER);
                setFirstName("");
                setLastName("");
                setPhone("");
                setEmail("");
                setPassword("");
                navigation.navigate('Login');
                // console.log(res.data.user_details);
                // setUser(res.data.user_details);
            }else{
                ToastAndroid.showWithGravity(res.data.responseText, ToastAndroid.LONG, ToastAndroid.CENTER);
                console.log(res.data.responseText)
            }
        }).catch((err) =>{
            console.log("ERROR",err);
            setLoading(false);
        })
        
    }
    const  openGallery = () => {
        ImagePicker.openPicker({mediaType:'photo', cropping:true, includeBase64:true}).then(res => {
            console.log({...res,data:""});
            setImage(res);
        }).catch(err => {
            console.log(err);
        })
    }
    return (
        <View style={{flex:1, backgroundColor:theme1}}>
        <LinearGradient colors={['#BC7BE4', '#10152F']}  style={{flex:1, justifyContent:'center'}} >
        <TouchableOpacity style={{position:'absolute', top:10, padding:10}} onPress={() => {
            navigation.goBack();
        }}>
            <Icon name='chevron-back-outline' color={'#fff'} size={30}/>
        </TouchableOpacity>
            <Text style={{color:'#fff', fontSize:40, marginTop:40, textAlign:'center', fontWeight:'700', fontFamily:'Helvetica'}}>REGISTER</Text>
            <ScrollView showsVerticalScrollIndicator={false} >
                <View style={styles.container}>
                <View style={{flexDirection:'column', justifyContent:'center', alignItems:'center'}}>
                    
                    <InputText name="firstName" icon="person" placeholder="First Name" value={firstName} handleChange={handleChange}  />
                    <InputText name="lastName" icon="person" placeholder="Last Name" value={lastName} handleChange={handleChange}  />
                        {/* <InputText  name="bDate" icon="cake" placeholder="Birth Date (example : 1992-10-10)" handleChange={handleChange} type="numeric"  /> */}
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
                                if(e.nativeEvent && e.nativeEvent.timestamp){
                                    setdob(e.nativeEvent.timestamp);
                                }
                            }}
                    />}
                    <TouchableOpacity style={[styles.input,{borderRadius:0}]} onPress={openGallery}>
                    <Ico name='photo' style={styles.icon} size={30} color="#fff"  />
                    {image ? <Image source={{uri : `data:image/jpeg;base64,${image?.data}`}} style={{alignSelf:'center',width:150, height:150,borderColor:'#fff', borderWidth:1}} />:<Text style={{flex:1, color:'#fff'}}  >select photo</Text>}
                    </TouchableOpacity>
                    <InputText name="email" icon="email" placeholder="Email" value={email} handleChange={handleChange}  />
                    <InputText name="phone" icon="phone" placeholder="Phone" value={phone} handleChange={handleChange} type="numeric"  />
                    <InputText name="password" icon="lock" placeholder="Password" value={password} handleChange={handleChange} password={!showPass}  />
                    <Ic name={showPass ? 'eye-slash':'eye'}
                    onPress={() => setShowPass(st => !st)}
                    style={{position:'absolute', right:15, top:420}}
                    size={30} color='#fff' />
                    <InputText name="aadhar" icon="video-label" placeholder="Aadhar Number" value={aadhar} handleChange={handleChange} type="numeric" />
                    <InputText name="address" icon="person-pin-circle" placeholder="Address" value={address} handleChange={handleChange} />
                </View>
                {
                    loading ?
                    (
                        <View style={{alignSelf:'center'}}>
                            <ActivityIndicator size="large" color={theme1} />
                        </View>
                    )
                    :
                    (
                        <TouchableOpacity onPress={register} >
                            <LinearGradient colors={['#FEDB37', '#FDB931', '#9f7928', '#8A6E2F']} style={styles.button}>
                            <>
                            <Ico name="person-add-alt-1" size={30} color='#fff' style={{marginRight:20}} />
                            <Text style={{fontSize:22, fontWeight:'400', color:'#fff'}}>SIGNUP</Text>
                            </>
                            </LinearGradient>
                        </TouchableOpacity>
                    )
                }
               </View> 
            </ScrollView>
            </LinearGradient>
        </View>
    )
}

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
        marginTop:45,
        marginBottom:20,
        width:'90%',
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

export default (SignUp);
