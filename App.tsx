import { StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Image, } from 'react-native';
import React, { useState } from 'react';
import { Feather } from "@expo/vector-icons"
import { AntDesign } from '@expo/vector-icons';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
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


export type RootStackParams = {
  Games: any;
  InGame: any;
  addGame: any;
  SignUp: any;
  SignIn: any;
  Riddles: any;
  camera:any;
  takepic:any;
  loading:any;
};
const Stack = createNativeStackNavigator<RootStackParams>();


interface props {
  navigation: any
}

export default function App() {
  const [showMenu, setMenu] = useState(false)
  const [menuWidth, setWidth] = useState(200);
  const auth = getAuth()
  const [isLoggedIn, setLog] = useState(false)
  const [dialogText, setDialogText] = useState("")

  // useEffect( () => {
  //   auth.onAuthStateChanged((user)=>{
  //   user?.displayName? setLog(true):setLog(false)  
  //   })


  //   }
  //    ,[]) 

  const closeMenu = () => {
    setMenu(false)
  }

  const openMenu = () => {
    console.log("openMenu")
    setMenu(true)
  }

  // function openDialog(text: string) {
  //   setDialogText("fdsafds")
  // }
  // async ()=> await Permissions.askAsync(Permissions.CAMERA);



  return (
    <PaperProvider >

      <StatusBar hidden={true} />
      <NavigationContainer  >
        {/* <View style={{direction:'rtl'}}> */}

        <View style={styles.header}>
          {/* <DialogMassage></DialogMassage> */}
          <Image
            source={require('./assets/3play.png')}
            style={{ height: 60, width: 120 }}></Image>
          <Text style={{ fontSize: 30 }}>3play</Text>
        </View>
        <Stack.Navigator initialRouteName='loading' screenOptions={{
          headerShown: false
        }}>
          <Stack.Screen name="Games" component={Games} />
          <Stack.Screen name="InGame" component={InGame} />
          <Stack.Screen name="addGame" component={AddGame} />
          <Stack.Screen name="SignUp" component={SignUp} />
          <Stack.Screen name="SignIn" component={SignIn} />
          <Stack.Screen name="Riddles" component={Riddles} />
          {/* <Stack.Screen name="takepic" component={TakePic} /> */}
          <Stack.Screen name="loading" component={Loading} />
          <Stack.Screen name="camera" component={CameraExample} />
        </Stack.Navigator>
        {/* {showMenu ? <View style={{ width: menuWidth, backgroundColor: 'white', position: 'absolute', bottom: 0, right: 80, padding: 0 }}><Menu closeMenu={closeMenu} /></View> : null} */}
        <TouchableOpacity onPress={() => { showMenu ? closeMenu() : openMenu() }} style={styles.menuButton}>
          {(showMenu ? <AntDesign name="rightcircleo" size={50} color="black" /> : <Feather name="menu" size={50} />)}
        </TouchableOpacity>
        {/* <Portal> */}
          <Dialog visible={showMenu} onDismiss={closeMenu} style={{position:'absolute',bottom:0,right:0}} >
          <Menu closeMenu={closeMenu} />     
               {/* <Dialog.Actions>
              <ButtonPaper onPress={hideDialog}>Cancel</ButtonPaper>
            </Dialog.Actions> */}
          </Dialog>
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
    height: 60,
    backgroundColor: "cadetblue",
    elevation: 24,
    // borderRadius: 10,
    paddingLeft: 20,
    paddingRight: 20,
    // flex:1,
    flexDirection: "row",
    justifyContent: "space-between",
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

  },

});

