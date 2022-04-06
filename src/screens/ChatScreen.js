import React from 'react';
import { View, Text, StyleSheet,TouchableOpacity, ScrollView, Image,TextInput } from 'react-native';
import { connect } from 'react-redux';
import { API } from '../../api.config';
import Icon from 'react-native-vector-icons/Ionicons';
import Ico from 'react-native-vector-icons/AntDesign';
import Ic from 'react-native-vector-icons/FontAwesome';
import ChatListItem from '../components/ChatListItem';
import Footer from '../components/Footer';
import { getDatabase, push, ref, set, orderByChild, equalTo,onChildAdded, query, orderByValue, onValue, update } from "firebase/database";

const dark= '#10152F';
const ChatScreen = ({navigation, currentUser, route}) => {

    const channelId = route.params.channelId;
    const client = route.params.client;
    const client_name = route.params.client_name;
    const client_image = route.params.client_image;

    const [messages, setMessages] = React.useState([]);
    const [message, setMessage] = React.useState("");

    const scrollRef = React.useRef();
    const init = () => {
        const db = getDatabase();
        const messagesRef = query(
          ref(db, 'messages'),
          orderByChild('channelId'),
          equalTo(channelId),
        );
        onValue(messagesRef, snapShot => {
            const  m =[];
          snapShot.forEach(snap => {
              m.push(snap);
          });
          setMessages(m);
        });
        return messagesRef;
      };
    
      const sendMessage = msg => {
        const db = getDatabase();
        const messageRef = ref(db, 'messages');
        const newMessage = push(messageRef);
        set(newMessage, {
          channelId: channelId,
          sender: currentUser.id,
          receiver: client,
          message: msg,
          timeStamp: Date.now(),
        })
          .then(res => {
            console.log(res);
          })
          .catch(err => {
            console.log('ERROR ', err);
          });
        const clientRef = ref(db,'client/' + client + '/' + channelId,);
        update(clientRef, {
          last_message: msg,
          performer_image:currentUser.images.length>0 ? currentUser.images[currentUser.images.length-1].image : '',
          timeStamp: Date.now(),
        });
        const performerRef = ref(db, 'performer/' + currentUser.id + '/' + channelId);
        update(performerRef, {
          last_message: msg,
          performer_image:currentUser.images.length>0 ? currentUser.images[currentUser.images.length-1].image : '',
          timeStamp: Date.now(),
        });
      };
      React.useEffect(() => {
        init();
      }, []);
    
      const Message = ({msg}) => {
        if (msg.sender == currentUser.id) {
          return (
            <View style={{display: 'flex', flexDirection: 'row-reverse'}}>
              <View
                style={{
                  backgroundColor: '#1A224B',
                  padding: 10,
                  margin: 2,
                  marginRight: 10,
                  borderRadius: 20,
                  borderBottomRightRadius: 0,
                }}>
                <Text style={{color: '#ffffff'}}>{msg.message}</Text>
              </View>
            </View>
          );
        } else {
          return (
            <View style={{display: 'flex', flexDirection: 'row'}}>
              <View
                style={{
                  backgroundColor: '#1A224B',
                  padding: 10,
                  margin: 2,
                  marginLeft: 10,
                  borderRadius: 20,
                  borderBottomLeftRadius: 0,
                }}>
                <Text style={{color: '#ffffff'}}>{msg.message} </Text>
              </View>
            </View>
          );
        }
      };

    return (
        <View style={{flex:1,backgroundColor:dark}}>
            
            <View style={{backgroundColor:'#1A224B', borderBottomLeftRadius:50, borderBottomRightRadius:50, marginBottom:20,flexDirection:'row' }}>
            <TouchableOpacity onPress={() => {navigation.navigate('Messages');}} style={{margin:20, marginRight:0}}>
                <Icon name='chevron-back-outline' color={'#fff'} size={30}/>
            </TouchableOpacity>
            <Image source={{uri:client_image!="" ? client_image : 'https://www.focusedu.org/wp-content/uploads/2018/12/circled-user-male-skin-type-1-2.png'}} style={{height:40, width:40, borderRadius:50, alignSelf:'center'}} />
            <Text style={{color:'#fff', fontWeight:'400', alignSelf:'center', fontSize:18,margin:20, marginLeft:5}}>{client_name}</Text>
            </View>
            <ScrollView style={{flex:1}} ref={scrollRef}
            onContentSizeChange={() => scrollRef.current.scrollToEnd({ animated: true })}>
                <View style={{display: 'flex', flexDirection: 'column'}}>
                    {messages.map((msg,idx) => {
                        const l = JSON.stringify(msg);
                        const m = JSON.parse(l);
                        return(
                            <Message msg={m} key={idx} />
                        )
                    })}
            
                </View>
            </ScrollView>
            <View style={styles.chatFoot}>
                <Ico name="message1" size={28} color='#fff' style={{alignSelf:'center'}} />
                <TextInput placeholderTextColor='#ddd' style={{flex:1, color:'#fff', alignSelf:'center', marginLeft:10}} value={message} autoCapitalize='none'  onChangeText={(e) => setMessage(e)} placeholder="Type Message Here..."  />
                <TouchableOpacity style={{alignSelf:'center'}} onPress={() => {
                    sendMessage(message);
                    setMessage('');
                }}>
                <Ic name="send" size={28} color='#fff'  />
                </TouchableOpacity>
            </View>
        </View>
    )
}
const styles = StyleSheet.create({
    chatFoot:{
        backgroundColor:'#1A224B',
        borderTopLeftRadius:35,
        borderTopRightRadius:35,
        padding:20,
        paddingTop:10,
        flexDirection:'row',
        justifyContent:'space-between'
    }
})

const mapStateToProps = (state) => ({
    currentUser: state.user.currentUser
})

export default connect(mapStateToProps)(ChatScreen)
