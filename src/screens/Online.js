import React, {useRef, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import {connect} from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import { getDatabase, onValue, ref,orderByChild,query, equalTo,set } from 'firebase/database';
import sha256 from 'crypto-js/sha256';
import { useSelector } from 'react-redux';
const dark = '#10152F';


const Card = ({customer:{name, profile_image, user_id},navigation}) => {

    const performer = useSelector(state => state.user.currentUser);
    
    const hash = sha256(performer.email+user_id).words[0];

    function createChatChannel() {
        const db = getDatabase();
        const clientRef = ref(db, 'client/'+user_id+"/"+hash);
        set(clientRef,{
            channelId:hash,
            client:user_id,
            performer_name:performer.f_name+" "+performer.l_name,
            client_name:name,
            performer_image:performer.images.length>0 ? performer.images[performer.images.length-1].image : '',
            client_image:profile_image,
            performer:performer.id,
            last_message:'...',
            timeStamp: Date.now()
        }).then((res) => {
            navigation.navigate('Chat',{channelId:hash, client:user_id,client_name:name,client_image:profile_image ? profile_image: ""});
        }).catch((err) => {
            console.log("ERROR ", err);
        })
    
        const performerRef = ref(db, 'performer/'+performer.id+"/"+hash);
        set(performerRef,{
            channelId:hash,
            client:user_id,
            performer_name:performer.f_name+" "+performer.l_name,
            client_name:name,
            performer_image:performer.images.length>0 ? performer.images[performer.images.length-1].image : '',
            client_image:profile_image,
            performer:performer.id,
            last_message:'...',
            timeStamp: Date.now()
        }).then((res) => {
            console.log(res);
        }).catch((err) => {
            console.log("ERROR ", err);
        })
        }
    function goToChat(){
        const db = getDatabase();
        const onCamRef = query(ref(db, 'client/'+user_id),orderByChild("channelId"), equalTo(hash));
        onValue(onCamRef,(snapshot) => {
            if(snapshot.exists()){
                navigation.navigate('Chat',{channelId:hash, client:user_id,client_name:name,client_image:profile_image ? profile_image: ""});
            }else{
                createChatChannel();
            }
        },{
            onlyOnce:true
        })
    }
    return(
        <TouchableOpacity activeOpacity={0.4} onPress={goToChat}>
        <View style={{flexDirection:'row', justifyContent:'space-between', padding:10, width:'100%'}}>
            <View >
            <Image source={{uri:profile_image ? profile_image : 'https://www.focusedu.org/wp-content/uploads/2018/12/circled-user-male-skin-type-1-2.png'}} style={{height:70, width:70, borderRadius:50}} />
            {/* <Icon name="primitive-dot" style={{position:'absolute',bottom:8, left:59}} size={20} color="#00ff00" /> */}
            </View>

            <View style={{flexDirection:'column', justifyContent:'space-evenly', flex:1, paddingLeft:18}}>
                <Text style={{color:'#fff', fontWeight:'700',justifyContent:'flex-start'}}>{name}</Text>
                <Text style={{color:'#00ff00', fontWeight:'400', fontSize:13,justifyContent:'flex-start'}}>Online</Text>
            </View>
        </View>
        </TouchableOpacity>
    )
}

const Online = ({navigation, currentUser}) => {

    const [users, setUsers] = React.useState({});
  React.useEffect(() => {
    const db = getDatabase();
    const customersRef = ref(db,'customers');
    return onValue(customersRef, (snapShot) => {
        if(snapShot.val()){
            setUsers(JSON.parse(JSON.stringify(snapShot.val())));
        }
    })
  },[]);

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
          Online Clients
        </Text>
      </View>
      <ScrollView style={{flex:2}} showsVerticalScrollIndicator={false}>

        {
          Object.keys(users).length===0 &&
          <View>
              <Text style={{textAlign:'center', color:'#fff', fontSize:22, fontWeight:'300'}}>No one is Online...</Text>
          </View>
        }
        {Object.keys(users).map((key) => (
            <Card key={key} customer={users[key]} navigation={navigation} />
        ))}

      </ScrollView>
    </View>
  );
};
const styles = StyleSheet.create({

});

const mapStateToProps = state => ({
  currentUser: state.user.currentUser,
});

export default connect(mapStateToProps)(Online);