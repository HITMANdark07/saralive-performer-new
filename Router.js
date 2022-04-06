// import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import CustomDrawer from './src/components/Drawer';
// import Home from './src/screens/Home';
// import Profile from './src/screens/Profile';
// import Home from './src/screens/Home';
import Main from './src/screens/Main';
import Login from "./src/screens/Login";
import SignUp from './src/screens/SignUp';
// import Cam from './src/screens/Cam';
// import InboxScreen from './src/screens/InboxScreen';
// import ChatScreen from './src/screens/ChatScreen';
// import Profile from './src/screens/Profile';
// import Performer from './src/screens/Performer';
import {LogBox } from 'react-native';
LogBox.ignoreLogs(['Reanimated 2']);
import { connect } from 'react-redux';
import firebase from './src/firebase/config';
import HigherComp from './src/screens/HigherComp';

// import {database } from 'firebase/'
// import AddDoctor from './src/screens/AddDoctor';
// import ManageDoctor from './src/screens/ManageDoctor';
// import Template from './src/screens/Template';
// import Report from './src/screens/Report';
// import ChooseDoctor from './src/screens/ChooseDoctor';
// import FinalPoster from './src/screens/FinalPoster';

const theme1="#5DBCB0";
const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

// function HomeDrawer() {
//   return (
//     <Drawer.Navigator screenOptions={{drawerStyle:{backgroundColor:'transparent'}}} drawerContent={(props) => <CustomDrawer {...props}  /> }>
//         <Drawer.Screen name="Home" component={Home} options={{headerShown:false, unmountOnBlur:true}} />
//         <Drawer.Screen name="OnCam" component={Cam} options={{headerShown:false, unmountOnBlur:true}} />
//         <Drawer.Screen name="Messages" component={InboxScreen} options={{headerShown:false, unmountOnBlur:true}} />
//         <Drawer.Screen name="Me" component={Profile} options={{headerShown:false, unmountOnBlur:true}} />
//         <Drawer.Screen name="Chat" component={ChatScreen} options={{headerShown:false, unmountOnBlur:true}} />
//         <Drawer.Screen name="Performer" component={Performer} options={{headerShown:false, unmountOnBlur:true}} />
//     </Drawer.Navigator>
//   );
// }

// function Logan(){
//     return(
//         <View style={{flex:1}}>
//             <Text>LOGIN NOW</Text>
//         </View>
//     )
// }



const Router = ({currentUser}) => {

    return (
        <NavigationContainer>
            <Stack.Navigator>
                {
                    currentUser ?
                    <>
                    <Stack.Screen name="HomeDrawer" component={HigherComp} options={{headerShown:false, unmountOnBlur:true}} />
                    </>
                    :
                    <>
                    <Stack.Screen name='Main' component={Main} options={{headerShown:false}} />
                    <Stack.Screen name='Login' component={Login} options={{headerShown:false}}  />
                    <Stack.Screen name='SignUp' component={SignUp} options={{headerShown:false}} />
                    </>
                }
            </Stack.Navigator>
        </NavigationContainer>
    )
}
const mapStateToProps = (state) => ({
  currentUser : state.user.currentUser
})
export default connect(mapStateToProps)(Router);
