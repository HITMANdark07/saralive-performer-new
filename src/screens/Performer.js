import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Ico from 'react-native-vector-icons/Octicons';
import Ic from 'react-native-vector-icons/FontAwesome5';
import Icons from 'react-native-vector-icons/Entypo';
import { getDatabase, push, ref, set, orderByChild, equalTo,onChildAdded, query, orderByValue } from "firebase/database";
import { connect } from 'react-redux';

const dark= '#10152F';
const Performer = ({navigation,currentUser}) => {
    function writeUserData(userId, name, email) {
        const db = getDatabase();
        const messagesRef = ref(db, 'messages');
        const newMessage = push(messagesRef);
        set(newMessage,{
            channelId:"1221",
            from:userId,
            to:"data",
            timeStamp: Date.now()
        }).then((res) => {
            console.log(res);
        }).catch((err) => {
            console.log("ERROR ", err);
        })
      }

    React.useEffect(() => {
        const db = getDatabase();
        const messageRef = query(ref(db, 'messages'),orderByChild("channelId"), equalTo("1221"));
        onChildAdded(messageRef,(data) =>{
            console.log(data.val());
        })
        return () => messageRef;
    },[]);
    return (
        <View style={{flex:1, backgroundColor:dark, justifyContent:'space-between'}}>
            <View style={styles.container}>
                <View style={{flex:1}}>
                    <Image source={{uri:'https://pbs.twimg.com/profile_images/1280095122923720704/K8IvmzSY_400x400.jpg'}} style={{flex:1}} />
                </View>
                <View style={styles.contents}>
                    <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                        <View style={{flexDirection:'column',justifyContent:'space-between'}}>
                            <Text style={{color:'#fff', fontSize:18, fontWeight:'700', marginBottom:5}}>Performer Test</Text>
                            <View style={{flexDirection:'row'}}>
                                <View style={{flexDirection:'row', alignItems:'center', backgroundColor:'#FF00FF', paddingLeft:8,paddingRight:8, borderRadius:10}}>
                                    <Icon name="female" color={'#fff'} size={10} style={{marginRight:5}} />
                                    <Text style={{color:'#fff', fontSize:11}}>26</Text>
                                </View>
                                <View style={{backgroundColor:'#A020F0', paddingLeft:8,paddingRight:8, borderRadius:10, marginLeft:10}}>
                                    <Text style={{color:'#fff', fontSize:11}}>India</Text>
                                </View>
                            </View>
                        </View>
                        <View style={{flexDirection:'column', justifyContent:'space-between'}}>
                                <View style={{flexDirection:'row', alignItems:'center', paddingLeft:8,paddingRight:8, borderRadius:10}}>
                                    <Ico name="primitive-dot" color={'#00ff00'} size={10} style={{marginRight:5}} />
                                    <Text style={{color:'#00ff00', fontSize:11}}>Online</Text>
                                </View>
                                <View style={{flexDirection:'row', alignItems:'center', paddingLeft:8,paddingRight:8, borderRadius:10}}>
                                    <Ic name="coins" color={'#FFFF00'} size={15} style={{marginRight:5}} />
                                    <Text style={{color:'#fff', fontSize:13}}>30/min</Text>
                                </View>
                        </View>
                    </View>
                    <View style={{flexDirection:'row', justifyContent:'center'}}>
                        <TouchableOpacity style={styles.button} activeOpacity={0.6} onPress={() => {writeUserData(currentUser.id, currentUser.first_name, currentUser.email_id)}}>
                            <Icons name="message" size={30} color='#fff' style={{marginRight:20}} />
                            <Text style={{fontSize:20, fontWeight:'700', color:'#fff'}}>CHAT</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button} activeOpacity={0.6}>
                            <Icons name="video-camera" size={30} color='#fff' style={{marginRight:20}} />
                            <Text style={{fontSize:20, fontWeight:'700', color:'#fff'}}>Video Call</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
            <View style={{position:'absolute'}}>
            <TouchableOpacity onPress={() => {navigation.navigate('Home');}} style={{margin:20, marginRight:0}}>
                <Icon name='chevron-back-outline' color={'#fff'} size={30}/>
            </TouchableOpacity>
            </View>
        </View>
    )
};

const styles = StyleSheet.create({
    container:{
        flex:1,
        flexDirection:'column',
    },
    contents:{
        flex:1,
        flexDirection:'column',
        justifyContent:'space-between',
        padding:15
    },
    button:{
        backgroundColor:'#4BD5CF',
        flexDirection:'row',
        justifyContent:'center',
        marginTop:45,
        marginBottom:20,
        width:'50%',
        alignSelf:'center',
        borderRadius:50,
        alignItems:'center',
        padding:8,
        margin:5,
        shadowColor: "#fff",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,

        elevation: 5,
    }
})
const mapStateToProps = state => ({
    currentUser : state.user.currentUser
})

export default connect(mapStateToProps)(Performer);
