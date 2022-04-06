import React, {useRef, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  TextInput,
} from 'react-native';
import {connect} from 'react-redux';
import {API} from '../../api.config';
import Icon from 'react-native-vector-icons/Ionicons';
import Ico from 'react-native-vector-icons/AntDesign';
import Ic from 'react-native-vector-icons/FontAwesome';

const dark = '#10152F';

const UserCard = ({follower}) => {
  console.log(follower);
    return(
        <TouchableOpacity activeOpacity={0.4}>
              <View style={{display:'flex',flexDirection:'row', margin:10, flex:1, backgroundColor:'#1A224B', padding:10, borderRadius:20}}>
                <Image
                    source={{uri: follower.image ?? 'https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_1280.png'}}
                    style={{height: 60, width: 60, borderRadius: 50, alignSelf: 'center'}}
                />
                <View style={{flex:1, justifyContent:'center', flexDirection:'column'}}>
                    <Text style={{color:'#fff', marginLeft:15, fontSize:18}}>{follower.name}</Text>
                    <Text style={{color:'#fff', marginLeft:15,fontSize:12, fontWeight:'300'}}>{follower.email}</Text>
                </View>
              </View>
          </TouchableOpacity>
    )
}

const FollowerList = ({navigation, currentUser, route}) => {

  const [plist, setPlist] = useState(route.params?.followers.length>0 ? route.params?.followers : []);

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
          Follower List
        </Text>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>

          {plist.map((p) => (
              <UserCard key={p.id} follower={p} />
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

export default connect(mapStateToProps)(FollowerList);
