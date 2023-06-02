import { StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Image, } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { Feather } from "@expo/vector-icons"
import { AntDesign } from '@expo/vector-icons';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp, createNativeStackNavigator } from '@react-navigation/native-stack';
import Menu from './components/menu';
import InGame from './components/InGame';
import Games from './components/Games';
import AddGame from './components/addGame';
import { Dialog, Provider as PaperProvider, Portal, Button as ButtonPaper } from 'react-native-paper';
import SignUp from './components/SignUp';
import { getAuth } from "firebase/auth";
import SignIn from './components/signIn';
import Riddles from './components/riddles';
import CameraExample from './components/altenativePicture';
import TakePic from './components/takepic';
import Loading from './components/Loading';
import AddStation from './components/addStation';
import GamesToEdit from './components/gamesToEdit';
import Home from './components/home';
import UserInfo from './components/UserInfo';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import Disclaimer from './components/disclaimer';
import PreGames from './components/preGames';
import BeforeGame from './components/beforeGame';
import GamesSuggestions from './components/gamesSuggestions';
import Recommendations from './components/recomendations';
import { LinearGradient } from 'expo-linear-gradient';


SplashScreen.preventAutoHideAsync();


export type RootStackParams = {
  Games: any;
  InGame: any;
  addGame: any;
  SignUp: any;
  SignIn: any;
  Riddles: any;
  camera: any;
  takepic: any;
  loading: any;
  editGame: any;
  home: any;
  userInfo: any;
  disclaimer:any;
  PreGames:any;
  beforeGame:any;
  gamesSuggestions:any
  Recommendations:any
};
const Stack = createNativeStackNavigator<RootStackParams>();


export default function App() {
  const [showMenu, setMenu] = useState(false)
  const [menuButton, setMenuButton]= useState(true);
  const [disclaimerV, setDisclaimerV]= useState(true);

  const auth = getAuth()
  auth.onAuthStateChanged(()=>{
    auth.currentUser?.displayName? setMenuButton(true):setMenuButton(false) 
  })
  // const navigation = useNavigation<NativeStackNavigationProp<RootStackParams>>()

  const [fontsLoaded] = useFonts({
    'Inter-Black': require('./assets/fonts/dorianclm-book-webfont.ttf'),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);
  if (!fontsLoaded) {
    return null;
  }


  const closeMenu = () => {
    setMenu(false)
  }

  const openMenu = () => {
    console.log("openMenu")
    setMenu(true)
  }


  return (
    <PaperProvider >

      <StatusBar hidden={true} />
      <NavigationContainer  >
        {/* <View style={{direction:'rtl'}}> */}
        <LinearGradient
        // Background Linear Gradient
        colors={['cadetblue', 'slategrey','aliceblue']}
        locations={[0.8,0.7,1]}
        style={[styles.header,styles.shadowProp]}
       onLayout={onLayoutRootView}>

      

        {/* <View style={[styles.header,styles.shadowProp]
         } onLayout={onLayoutRootView}> */}
          {/* <DialogMassage></DialogMassage> */}
          <Image
            source={require('./assets/3play.png')}
            style={{ height: 60, width: 120, paddingBottom: 50 }}></Image>
          <Text style={{ fontSize: 40, fontFamily: 'Inter-Black' }}>צובחוץ</Text>
        {/* </View> */}
        </LinearGradient>
        <Stack.Navigator initialRouteName='loading' screenOptions={{
          headerShown: false
        }}>
          <Stack.Screen name="Games" component={Games} />
          <Stack.Screen name="InGame" component={InGame} />
          <Stack.Screen name="addGame" component={AddGame} />
          <Stack.Screen name="SignUp" component={SignUp} />
          <Stack.Screen name="SignIn" component={SignIn} />
          <Stack.Screen name="Riddles" component={Riddles} />
          {/* <Stack.Screen name="takepic" component={TakePic } /> */}
          <Stack.Screen name="loading" component={Loading} />
          <Stack.Screen name="camera" component={CameraExample} />
          <Stack.Screen name="editGame" component={GamesToEdit} />
          <Stack.Screen name="home" component={Home} />
          <Stack.Screen name="userInfo" component={UserInfo} />
          <Stack.Screen name="PreGames" component={PreGames} />
          <Stack.Screen name="beforeGame" component={BeforeGame} />
          <Stack.Screen name="gamesSuggestions" component={GamesSuggestions} />
          <Stack.Screen name="Recommendations" component={Recommendations} />
          <Stack.Screen name="disclaimer">{()=><Disclaimer isMenu={bool=>{setDisclaimerV(bool);console.log(bool)}}/>}</Stack.Screen>  
        </Stack.Navigator>
       
        <Dialog visible={showMenu} onDismiss={closeMenu} style={{ position: 'absolute', bottom: 0, right: 0 }} >
          <Menu closeMenu={closeMenu} />
        </Dialog>
        {menuButton&&disclaimerV&&<TouchableOpacity onPress={() => { showMenu ? closeMenu() : openMenu()}} style={styles.menuButton}>
          {(showMenu ? <AntDesign name="rightcircleo" size={50} color="black" /> : <Feather name="menu" size={50} />)}
        </TouchableOpacity>}
        {/* </Portal>       */}
      </NavigationContainer>
    </PaperProvider>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'cadetblue',
    alignItems: 'center',
    justifyContent: 'center',
    width: 500,
  },
  header: {
    // width:"100%",
    top: 0,
    padding: 10,
    height: 70,
    // backgroundColor: "cadetblue",
    elevation: 24,
    // borderRadius: 10,
    paddingLeft: 20,
    paddingRight: 20,
    // flex:1,
    flexDirection: "row",
    justifyContent: "space-between",
    shadowColor: 'red',
    shadowOffset: {
      width: 1,
      height: 1,
    },
    // marginHorizontal:10,


  },
  card: {
    marginTop: 30,

    width: '100%',
    borderColor: 'black solid 1px',
    // backgroundColor: 'black',
    // fontWeight: '800',
  },
  text: {
    textAlign: 'center',
    color: 'blue'
  },
  menuButton: {
    position: 'absolute',
    bottom: '1%',
    left: '1%',
    backgroundColor: 'cadetblue',
    borderRadius: 20,
    shadowColor: 'red',


  },
  shadowProp: {
    shadowColor: '#171717',
    shadowOffset: {width: -2, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  alwaysred: {
    backgroundColor: 'red',
    height: 100,
    width: 100,
},

});

