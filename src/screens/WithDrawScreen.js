import React, {useRef, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
  ActivityIndicator,
  ToastAndroid,
  TextInput,
} from 'react-native';
import {connect} from 'react-redux';
import {API} from '../../api.config';
import Icon from 'react-native-vector-icons/Ionicons';
import Ic from 'react-native-vector-icons/FontAwesome';
import Ico from 'react-native-vector-icons/MaterialIcons';
import InputText from '../components/InputText';
import axios from 'axios';
import moment from 'moment';

const dark = '#10152F';



const windowWidth = Dimensions.get('window').width;







const RequestCard = ({requests}) => {
  console.log(requests);
    return(
        <TouchableOpacity activeOpacity={0.4}>
              <View style={{display:'flex',flexDirection:'row', margin:10, flex:1, backgroundColor:'#1A224B', padding:10, borderRadius:20}}>
                <Image
                    source={{uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR8kIvj19ydPyz9xLz239ld6OLICeVttaGNtw&usqp=CAU'}}
                    style={{height: 60, width: 60, borderRadius: 50, alignSelf: 'center'}}
                />
                <View style={{flex:1, justifyContent:'center', flexDirection:'column'}}>
                    <Text style={{color:'#fff', marginLeft:15, fontSize:18}}>Coins Requseted: {requests.coin}</Text>
                    <Text style={{color:'#fff', marginLeft:15,fontSize:12, fontWeight:'300'}}>Paytm No.: {requests.paytm_no}</Text>
                    <Text style={{color:'#fff', marginLeft:15,fontSize:10, fontWeight:'300'}}>created on: {(requests.created_at.substr(0,10))}</Text>
                </View>
              </View>
          </TouchableOpacity>
    )
}
const WithDrawScreen = ({navigation, currentUser}) => {

  const [paytm, setPaytm] = useState('');
  const [coin, setCoin]  = useState('');
  const [screen , setScreen] = useState('UPI');
  const [requests,setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [accountno, setAccountno] = useState('');
  const [bankName, setBankName] = useState('');
  const [ifsc, setIfsc] = useState('');
  const handleChange = (name, e) => {
    switch(name){
        case 'paytm':
            setPaytm(e);
            break;
        case 'coin':
            setCoin(e);
            break;
        case 'bankName':
            setBankName(e);
            break;
        case 'accountno':
            setAccountno(e);
            break;
        case 'ifsc':
            setIfsc(e);
            break;
        default:
            console.log("none",e);
    }
}

  const updateit = () => {
    setLoading(true);
    let formData = new FormData();
    formData.append('performer_id', currentUser.id);
    formData.append('paytm_no', paytm);
    formData.append('coin', coin);
    axios({
        method:'POST',
        url:`${API}/performer_withdrawl_request`,
        data:formData
    }).then((res)=>{
        if(res.data.responseCode){
            ToastAndroid.showWithGravity(res.data.responseText, ToastAndroid.CENTER, ToastAndroid.SHORT);
            setCoin("");
            setPaytm("");
            init();
        }else{
            ToastAndroid.showWithGravity(res.data.responseText, ToastAndroid.CENTER, ToastAndroid.SHORT);
        }
        setLoading(false);
    }).catch((err) =>{
      ToastAndroid.showWithGravity(err.response?.data?.responseText, ToastAndroid.CENTER, ToastAndroid.SHORT);
      console.log(err);
      setLoading(false);
    })
}

  const init = React.useCallback(() => {
    axios({
      method:'POST',
      url:`${API}/performer_withdrawl_request_list`,
      data:{
        performer_id:currentUser?.id
      }
    }).then((res)=>{
      if(res.data.responseCode){
          setRequests(res.data.responseData)
      }else{
          ToastAndroid.showWithGravity(res.data.responseText, ToastAndroid.CENTER, ToastAndroid.SHORT);
      }
  }).catch((err) =>{
    console.log(err);
  })
  },[]);

  React.useEffect(() => {
    init();
  },[init])

  return (
    <View style={{flex: 1, backgroundColor: dark}}>
      <View
        style={{
          backgroundColor: '#1A224B',
          borderBottomLeftRadius: 50,
          borderBottomRightRadius: 50,
          marginBottom: 20,
          flexDirection: 'row',
        }}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('Me');
          }}
          style={{margin: 20, marginRight: 0}}>
          <Icon name="chevron-back-outline" color={'#fff'} size={30} />
        </TouchableOpacity>
        <Text
          style={{
            color: '#fff',
            fontWeight: '400',
            alignSelf: 'center',
            fontSize: 18,
            margin: 20,
            marginLeft: 5,
          }}>
          Withdraw Request
        </Text>
      </View>

      <View style={{display:'flex', flexDirection:'row', justifyContent:'space-evenly'}}>
        <TouchableOpacity style={{backgroundColor:'green', minWidth:80, borderRadius:10, padding:10,borderColor:'white',borderWidth: screen==='UPI'? 3 :0}}
        onPress={() => setScreen('UPI')}>
        <Text style={{color:'white', fontWeight:'700', fontSize:22, textAlign:'center'}}>UPI</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{backgroundColor:'green', minWidth:80, borderRadius:10, padding:10,borderColor:'white',borderWidth: screen==='BANK' ? 3: 0}}
        onPress={() => setScreen('BANK')}>
        <Text style={{color:'white', fontWeight:'700', fontSize:22,textAlign:'center'}}>BANK</Text>
        </TouchableOpacity>
      </View>
      {screen==='UPI' ? 
      (
        <>
      <View style={{flexDirection:'column', width:windowWidth-40, alignSelf:'center'}}>

        <InputText name="paytm" icon="phone" placeholder="Paytm Number" value={paytm} handleChange={handleChange} type="numeric" />
        <InputText name="coin" icon="money" placeholder="Coins to withdraw" value={coin} handleChange={handleChange} type="numeric" />
        {loading ?
        (
            <View style={{alignSelf:'center'}}>
                <ActivityIndicator size="large" color="#fff" />
            </View>
        )
        :
        (
            <TouchableOpacity style={styles.button} onPress={updateit}>
                <Text style={{fontSize:22, fontWeight:'600', color:'#fff'}}>REQUEST</Text>
            </TouchableOpacity>
        )
        }
      </View>
      <ScrollView style={{flex:2}} showsVerticalScrollIndicator={false}>

          {requests.map((p) => (
              <RequestCard key={p.id} requests={p} />
          ))}

      </ScrollView>
      </>
      ):
    (
      <>
      <View style={{flexDirection:'column', width:windowWidth-40, alignSelf:'center'}}>
        <InputText name="bankName" icon="account-balance" placeholder="Bank Name" value={bankName} handleChange={handleChange} type="text" />
        <InputText name="accountno" icon="account-balance" placeholder="Account Number" value={accountno} handleChange={handleChange} type="numeric" />
        <InputText name="ifsc" icon="account-tree" placeholder="IFSC Code" value={ifsc} handleChange={handleChange} type="text" />
        <InputText name="coin" icon="money" placeholder="Coins to withdraw" value={coin} handleChange={handleChange} type="numeric" />
        {loading ?
        (
            <View style={{alignSelf:'center'}}>
                <ActivityIndicator size="large" color="#fff" />
            </View>
        )
        :
        (
            <TouchableOpacity style={styles.button} >
                <Text style={{fontSize:22, fontWeight:'600', color:'#fff'}}>REQUEST</Text>
            </TouchableOpacity>
        )
        }
      </View>
      {/* <ScrollView style={{flex:2}} showsVerticalScrollIndicator={false}>

          {requests.map((p) => (
              <RequestCard key={p.id} requests={p} />
          ))}

      </ScrollView> */}
      </>
      )}
    </View>
  );
};
const styles = StyleSheet.create({
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
});

const mapStateToProps = state => ({
  currentUser: state.user.currentUser,
});

export default connect(mapStateToProps)(WithDrawScreen);