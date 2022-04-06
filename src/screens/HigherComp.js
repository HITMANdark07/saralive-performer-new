import React from 'react';
import { View, Text, AppState } from 'react-native';
import RtcEngine, { RtcLocalView, RtcRemoteView, VideoRenderMode } from 'react-native-agora';
import { getDatabase, push, ref, set, orderByChild,remove, equalTo,onChildAdded, query, orderByValue, onValue, update } from "firebase/database";
import requestCameraAndAudioPermission from '../permissions/permission';
import { createDrawerNavigator } from '@react-navigation/drawer';
import CustomDrawer from '../components/Drawer';
import Home from './Home';
import Cam from './Cam';
import { API } from '../../api.config';
import InboxScreen from './InboxScreen';
import Profile from './Profile';
import ChatScreen from './ChatScreen';
import Performer from './Performer';
import CallScreen from './CallScreen';
import { connect } from 'react-redux';
import VideoCallScreen from './VideoCallScreen';
import PerformerUpdate from './PerformerUpdate';
import { setData, setNotification } from '../redux/user/user.action';
import axios from 'axios';
import FollowerList from './FollowerList';
import WithDrawScreen from './WithDrawScreen';



const Drawer = createDrawerNavigator();
const dark = '#10152F';
function HigherComp({currentUser, updateCoinData, coinData,setNoti}) {
    const appId = "bbd961c37a6945318efd2ed41ae214c1";
    const [engine, setEngine] = React.useState(undefined);
    const [peerIds, setPeerIds] = React.useState([]);
    const [joinSucceed, setJoinSucceed] = React.useState(false);
    const [show, setShow] = React.useState(true);
    const [inCall , setInCall] =React.useState("pending");
    const [callingPerson, setCallingPerson] = React.useState({
        name:"New User",
        image:'https://www.focusedu.org/wp-content/uploads/2018/12/circled-user-male-skin-type-1-2.png',
        person2:'0',
    })
    
    // React.useEffect(() => {
        
    // },[coinData, inCall]);
    const createChannel = () => {
        const db = getDatabase();
        const paidRef = ref(db, 'paidcam/'+currentUser.id);
        // const paid = push(paidRef);
        set(paidRef,{
            channelId:currentUser.id,
            person1:currentUser.id,
            name:'',
            image:currentUser.images.length>0 ? currentUser.images[currentUser?.images?.length-1]?.image : '',
            status:'pending',//pending, waiting, joined
            person2:"",
        }).then((res) => {
            // startCall(paid.key,1);
            // setWaiting(true);
        }).catch((err) => {
            console.log("ERROR ", err);
        })
    };
    const deductCoin = () => {
        console.log("DEDUCTION....", coinData.customer_id,coinData.performer_id, coinData.coin );
        axios({
            method:'POST',
            url:`${API}/customer_coin_deduct`,
            data:{
                customer_id:coinData.customer_id,
                performer_id: coinData.performer_id,
                coin: coinData.coin
            }
        }).then((res) => {
            if(res.data.responseCode){
                updateCoinData(null);
            }
        }).catch((err) => {
            console.log(err);
        })
        }
    React.useEffect(() => {
        if(coinData!=null){
            deductCoin();
        }
    },[coinData, inCall]);
    const removeChannel = () => {
        const db = getDatabase();
        const rRef = ref(db, 'paidcam/'+currentUser.id);
        remove(rRef);
        console.log("camref",rRef.key);
    };

    // const updateCoins = (client,performer,coin) => {
    //     console.log(client, performer, coin)
    //     axios({
    //             method:'POST',
    //             url:`${API}/customer_coin_deduct`,
    //             data:{
    //                 customer_id:client,
    //                 performer_id: performer,
    //                 coin: coin
    //             }

    //         }).then((res) => {
    //             console.log(res.data);
    //         }).catch((err) => {
    //             console.log(err);
    //         })
    //     }

    React.useEffect(() => {
        const subs = AppState.addEventListener('change', ()=> {
            if(AppState.currentState==="active"){
                createChannel();
                console.log(AppState.currentState);
            }else{
                removeChannel();
                console.log(AppState.currentState);
            }
        });
        const db = getDatabase();
        const rRef = ref(db, 'paidcam/'+currentUser.id);
        onValue(rRef,(snapshot) => {
            let obj = { status :"pending", person2:"", image:'',name:''};
            obj = snapshot.toJSON();
            if(obj){
                setInCall(obj.status);
                setCallingPerson((prevState) => ({
                    image:obj.image ? obj.image : prevState.image,
                    name: obj.name ? obj.name : prevState.name,
                    person2: obj.person2 ? obj.person2 : prevState.person2
                }));
                console.log("image", obj.person2);
            }
        })
        return () => {
            subs.remove();
        }
    },[]);

    React.useEffect(() => {
        // variable used by cleanup function
        let isSubscribed = true;
        createChannel();
        // create the function
        const createEngine = async () => {
            // console.log("inside engine");
            try {
                if (Platform.OS === 'android') {
                    // Request required permissions from Android
                    await requestCameraAndAudioPermission();
                    setShow(true);
                }
                console.log("inside try");
                const rtcEngine = await RtcEngine.create(appId);
                await rtcEngine.enableVideo();
            

                // need to prevent calls to setEngine after the component has unmounted
                if (isSubscribed) {
                    setEngine(rtcEngine);
                }
            } catch (e) {
                console.log(e);
            }
        }

        // call the function
        if (!engine) createEngine();

        engine?.addListener('Warning', (warn) => {
            console.log('Warning', warn)
        })

        engine?.addListener('Error', (err) => {
            console.log('Error', err)
        })

        engine?.addListener('UserJoined', (uid, elapsed) => {
            console.log('UserJoined', uid, elapsed)
            // If new user
            // setWaiting(false);
            // let tim = setTimeout(() => {
            //     endCall(channel);
            //     joinRandomChannel();
            // },10000)
            // setTm(tim);
            if (peerIds.indexOf(uid) === -1) {
                // Add peer ID to state array
                console.log(uid);
                setPeerIds((prevState) => [...prevState, uid])
            }
        })

        engine?.addListener('UserOffline', (uid, reason) => {
            console.log('UserOffline', uid, reason)
            // Remove peer ID from state array
            // endCall(channel);
            // joinRandomChannel();
            setPeerIds(peerIds.filter(id => id !== uid))
        })

        // If Local user joins RTC channel
        engine?.addListener('JoinChannelSuccess', (channel, uid, elapsed) => {
            console.log('JoinChannelSuccess', channel, uid, elapsed)
            if (isSubscribed) {
                // Set state variable to true
                setJoinSucceed(true)
            }
        })

        return () => {
            console.log(engine)
            isSubscribed = false;
            // timeOut.cancel();
            removeChannel();
            // leaveChannel(channel);
            console.log("*********************************************");
            engine?.removeAllListeners();
            engine?.destroy();
        }

    },
        // will run once on component mount or if engine changes
        [engine]
    );

    React.useEffect(() => {
        const db = getDatabase();
        const mRef = query(ref(db, 'messages'),orderByChild("receiver"), equalTo(currentUser.id));
        return onValue(mRef,(snapshot) => {
            setNoti(true);
        })
    },[]);

    const Waiting = () => (
        <View style={{flex:1, justifyContent:'center', backgroundColor:dark}}>
            <Text style={{color:'#fff', fontSize:22,fontWeight:'300', textAlign:'center'}}>LOADING...</Text>
        </View>
    )

    
    return (
        <Drawer.Navigator screenOptions={{drawerStyle:{backgroundColor:'transparent'}}} drawerContent={(props) => <CustomDrawer {...props}  /> }>
            

            {
                inCall==="pending" && 
                (
                <>
                <Drawer.Screen name="Home" component={Home} options={{headerShown:false, unmountOnBlur:true}} /> 
                {/* <Drawer.Screen name="OnCam" component={Cam} options={{headerShown:false, unmountOnBlur:true}} /> */}
                <Drawer.Screen name="Update" component={PerformerUpdate} options={{headerShown:false, unmountOnBlur:true}} />
                <Drawer.Screen name="Messages" component={InboxScreen} options={{headerShown:false, unmountOnBlur:true}} />
                <Drawer.Screen name="Me" component={Profile} options={{headerShown:false, unmountOnBlur:true}} />
                <Drawer.Screen name="Chat" component={ChatScreen} options={{headerShown:false, unmountOnBlur:true}} />
                <Drawer.Screen name="Performer" component={Performer} options={{headerShown:false, unmountOnBlur:true}} /> 
                <Drawer.Screen name="Followers" component={FollowerList} options={{headerShown:false, unmountOnBlur:true}} /> 
                <Drawer.Screen name="WithDraw" component={WithDrawScreen} options={{headerShown:false, unmountOnBlur:true}} /> 
                </>
                )
            }
            {
                inCall==="waiting" && 
                <Drawer.Screen name="CallScreen" initialParams={{callingPerson:callingPerson}} component={CallScreen} options={{headerShown:false, unmountOnBlur:true}} />
            }
            {
                inCall==="incall" && 
                <Drawer.Screen name="VideoCall" 
                initialParams={{engine:engine, peerIds:peerIds}} component={VideoCallScreen} options={{headerShown:false, unmountOnBlur:false}} />
            }
            
        </Drawer.Navigator>
    )
}

const mapStatetoProps = (state) => ({
    currentUser : state.user.currentUser,
    coinData: state.user.data
});
const mapDispatchToProps = (dispatch) => ({
    updateCoinData : data => dispatch(setData(data)),
    setNoti : data => dispatch(setNotification(data))
})

export default connect(mapStatetoProps, mapDispatchToProps)(HigherComp);
