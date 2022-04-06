import React from 'react';
import { View, Text,TouchableOpacity, LogBox } from 'react-native';
import {RtcLocalView, RtcRemoteView, VideoRenderMode} from 'react-native-agora';
import { getDatabase, push, ref, set, orderByChild,remove, equalTo,onChildAdded, query, orderByValue, onValue, update } from "firebase/database";
import Icon from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';
import {API} from '../../api.config';
import { connect } from 'react-redux';
import { setData } from '../redux/user/user.action';
LogBox.ignoreLogs([
    'Non-serializable values were found in the navigation state',
]);
const dark = '#10152F';
const VideoCallScreen = ({currentUser,updateCoinData, route}) => {
    const [mic, setMic] = React.useState(false);
    const [peerId, setPeerId] = React.useState(0);
    const [counter, setCounter] = React.useState(0);
    // console.log("Engine",route.params.engine);
    const endCall = () => {
        // route.params.engine?.leaveChannel();
        route.params.engine?.leaveChannel()
        const db = getDatabase();
        const paidRef = ref(db, 'paidcam/'+currentUser.id);
        // const paid = push(paidRef);
        return update(paidRef,{
            status:'pending',//pending, waiting, joined
            person2:"",
            image : "",
            maxtime: 0,
            name : "",
        }).then((res) => {
        }).catch((err) => {
            console.log("ERROR ", err);
        })
    }
    // if(mic){
    //     route.params.engine?.enableLocalAudio();
    // }else{
    //     route.params.engine?.disableAudio();
    // }

    React.useEffect(() => {
        route.params.engine?.joinChannel(null, currentUser.id, null, (Number)(currentUser.id));

        const db = getDatabase();
        const paidRef = ref(db, 'paidcam/'+currentUser.id);
        const sub = onValue(paidRef, (snapshot) => {
            if(snapshot.exists()){
                setPeerId(snapshot.val()?.person2);
                console.log("******************",snapshot.val()?.person2);
            }
        });

        return () => {
            // console.log("HEY UNMOUNTING");
            route.params.engine?.leaveChannel();
            sub;
        }
    },[]);
    


    React.useEffect(() => {
        const db = getDatabase();
        let max = 60000;
        const paidRef = ref(db, 'paidcam/'+currentUser.id);
        onValue(paidRef, (snapshot) => {
            max = snapshot?.val()?.maxtime || 60000;
        }, {onlyOnce:true});
        let count =0;
        let timer = setInterval(() => {
            count+=100;
            if(count>max){
                endCall();
            }
        },100);
        const c = setInterval(() => {
            setCounter((prev) => prev+1);
        },1000);
        return () => {
            clearInterval(timer);
            clearInterval(c);
            let deduct = (Math.ceil(count/60000)*(+(currentUser.coin_per_min)));
            let data = {
                performer_id:currentUser.id,
                customer_id:peerId,
                coin:deduct
            }
            if(data?.customer_id!=0 && data.coin>0){
                updateCoinData(data);
            }
            console.log("deduct",data);
            // axios({
            //     method:'POST',
            //     url:`${API}/customer_coin_deduct`,
            //     data:{
            //         customer_id:peerId,
            //         performer_id: currentUser.id,
            //         coin: deduct
            //     }

            // }).then((res) => {
            //     console.log(res.data);
            // }).catch((err) => {
            //     console.log(err);
            // })
        }
        
    },[peerId])
    return (
        <View style={{flex:1, backgroundColor:dark}}>
            {peerId ? 
            <View style={{flex:0.8}} >
            <RtcRemoteView.SurfaceView
            style={{ flex:1, position:'relative' }}
            uid={peerId}
            channelId={currentUser.id}
            renderMode={VideoRenderMode.Hidden}
            zOrderMediaOverlay={true} />
            </View>
            :
            <Text style={{color:'white', textAlign:'center', fontSize:25, fontWeight:'200'}}>Waiting for Partner...</Text>
            }
            <View style={{ position:'absolute', bottom:10, flex:0.1, right:5,borderRadius:10,overflow:'hidden' ,borderColor:'#fff', borderWidth:2}}>
            <RtcLocalView.SurfaceView
            style={{ height:150, width:100 }}
            channelId={currentUser.id}
            renderMode={VideoRenderMode.Hidden} />
            </View>
            <View style={{position:'absolute',bottom:11,flexDirection:'row', justifyContent:'center'}}>
            {/* <View style={{flex:1, alignItems:'center'}}>
            <TouchableOpacity 
                onPress={() => {
                    setMic((prev) => !prev);
                }}
                style={{
                backgroundColor: mic ? '#3498DB': 'grey',
                bottom:10,
                height: 60,
                width: 60,
                zIndex:20,
                borderRadius: 100,
                alignItems: 'center',
                justifyContent: 'center',
                borderColor: '#fff',
                borderWidth: 2,
                }}>
                {
                    mic ?
                    <Icon name="mic" color="#fff" size={35} />
                    :
                    <Icon name="mic-off" color="#fff" size={35} />
                }
                </TouchableOpacity>
            </View> */}
            <View style={{flex:1, alignItems:'center'}}>
            <View >
                <Text style={{color:'white', fontWeight:'600', marginTop:-60}}>{parseInt((counter/(60)))>9 ? parseInt((counter/(60))) : `0`+parseInt((counter/(60)))}: {parseInt((counter%(60)))>9 ? parseInt((counter%(60))) : `0`+parseInt((counter%(60)))}</Text>
            </View>
            <TouchableOpacity 
                onPress={endCall}
                style={{
                backgroundColor: 'red',
                bottom:10,
                height: 60,
                width: 60,
                borderRadius: 100,
                alignItems: 'center',
                zIndex:20,
                justifyContent: 'center',
                borderColor: '#fff',
                borderWidth: 2,
                }}>
                <Icon name="call-end" color="#fff" size={35} />
                </TouchableOpacity>
            </View>
            </View>
        </View>
    )
}

const mapStateToProps = state => ({
    currentUser: state.user.currentUser
})
const mapDispatchToProps = (dispatch) => ({
    updateCoinData : data => dispatch(setData(data))
})

export default connect(mapStateToProps, mapDispatchToProps)(VideoCallScreen);
