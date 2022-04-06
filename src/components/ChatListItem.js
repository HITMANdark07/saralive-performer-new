import React from 'react'
import { View, Text, Image } from 'react-native'
import moment from 'moment';
// import Icon from 'react-native-vector-icons/Octicons';

function ChatListItem({name, message, time,client_image}) {

    return (
        <View style={{flexDirection:'row', justifyContent:'space-between', padding:10, width:'100%'}}>
            <View >
            <Image source={{uri:client_image!='' ? client_image : 'https://www.focusedu.org/wp-content/uploads/2018/12/circled-user-male-skin-type-1-2.png'}} style={{height:70, width:70, borderRadius:50}} />
            {/* <Icon name="primitive-dot" style={{position:'absolute',bottom:8, left:59}} size={20} color="#00ff00" /> */}
            </View>

            <View style={{flexDirection:'column', justifyContent:'space-evenly', flex:1, paddingLeft:18}}>
                <Text style={{color:'#fff', fontWeight:'700',justifyContent:'flex-start'}}>{name}</Text>
                <Text style={{color:'grey', fontWeight:'400', fontSize:13,justifyContent:'flex-start'}}>{message}</Text>
            </View>

            <View style={{flexDirection:'column', padding:5}}>
                <Text style={{justifyContent:'flex-start', color:'grey'}}>{moment(time).format("HH:mm A")}</Text>
            </View>
        </View>
    )
}
export default ChatListItem;
