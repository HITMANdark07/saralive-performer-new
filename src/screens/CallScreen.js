import React from 'react';
import {View, Text, Image, TouchableOpacity} from 'react-native';
var Sound = require('react-native-sound');
import { getDatabase, push, ref, set, orderByChild,remove, equalTo,onChildAdded, query, orderByValue, onValue, update } from "firebase/database";
import caller from '../../assets/time.mp3';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {connect} from 'react-redux';

const dark = '#10152F';

Sound.setCategory('Playback');

var ding = new Sound(caller, Sound.MAIN_BUNDLE, (error) => {
  if(error){
    console.log('failed to load the sound', error);
    return;
  }
})

const CallScreen = ({currentUser, route}) => {
  const person = route.params.callingPerson;
  console.log(person);
  const acceptCall  = () => {
    const db = getDatabase();
    const paidRef = ref(db, 'paidcam/'+currentUser.id);
    // const paid = push(paidRef);
    update(paidRef,{
        status:'incall',//pending, waiting, joined
    }).then((res) => {
    }).catch((err) => {
        console.log("ERROR ", err);
    })
  }
  const reject = () => {
    const db = getDatabase();
    const paidRef = ref(db, 'paidcam/'+currentUser.id);
    // const paid = push(paidRef);
    update(paidRef,{
        status:'pending',//pending, waiting, joined
    }).then((res) => {
    }).catch((err) => {
        console.log("ERROR ", err);
    })
  }

  React.useEffect(() => {
    ding.setVolume(1);
    ding.setNumberOfLoops(1000);
    ding.play(success => {
      if (success) {
        console.log('successfully finished playing');
      } else {
        console.log('playback failed due to audio decoding errors');
      }});
    return () => {
      ding.release();
      console.log("ding release");
    };
  },[]);
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: dark,
        flexDirection: 'column',
        justifyContent: 'center',
      }}>
      {/* <View style={{overflow:'hidden' , flex:1}}>
                <RtcLocalView.SurfaceView
                style={{flex:1 }}
                channelId={currentUser.id}
                renderMode={VideoRenderMode.Hidden} />
            </View> */}
      <View style={{flex: 1, justifyContent: 'flex-end'}}>
        <Image
          source={{
            uri: person.image,
          }}
          style={{
            height: 200,
            width: 200,
            borderRadius: 200,
            alignSelf: 'center',
            borderColor: '#fff',
            borderWidth: 2,
          }}
        />
      </View>
      <View style={{justifyContent:'center', alignItems:'center'}}>
          <Text style={{color:'#fff', marginTop:20, fontSize:20}}>{person.name} Calling...</Text>
      </View>
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginTop:50,
          marginLeft:50,
          marginRight:50,
          margin: 20,
        }}>
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={acceptCall}
          style={{
            backgroundColor: 'green',
            height: 80,
            width: 80,
            borderRadius: 100,
            alignItems: 'center',
            justifyContent: 'center',
            borderColor: '#fff',
            borderWidth: 2,
          }}>
          <Icon name="call" color="#fff" size={35} />
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={reject}
          style={{
            backgroundColor: 'red',
            height: 80,
            width: 80,
            borderRadius: 100,
            alignItems: 'center',
            justifyContent: 'center',
            borderColor: '#fff',
            borderWidth: 2,
          }}>
          <Icon name="call-end" color="#fff" size={35} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const mapStateToProps = state => ({
  currentUser: state.user.currentUser,
});

export default connect(mapStateToProps)(CallScreen);
