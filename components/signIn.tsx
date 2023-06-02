import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import app from "../fireBase";
import { doc, getDoc, getFirestore } from 'firebase/firestore';
import UserModel from '../model/userAuth';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { RootStackParams } from '../App';
import { Button } from 'react-native';


export default function SignIn() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [googleUid, setGoogleUid] = useState("");
    const db = getFirestore(app)
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParams>>()
    const auth = getAuth();
    const [modalText,setText] = useState("")
                
    useEffect(() => {
           console.log( 'auth:'+auth.currentUser?.uid)
            
              }, [])

    const handleSignIn = async () => {
        let user: UserModel = {
            userMail: email,
            password: password,
            uuid: ''
        }
        try {
            signInWithEmailAndPassword(auth, user.userMail, user.password as string).then(() => {
                let uid = auth.currentUser?.uid || "";
                const docRef = doc(db, "users", uid);
                getDoc(docRef).then((resp) => {
                    setText("איזה כיף שחזרתם  " + resp.data()!.name)
                    resp.data()!.disclaimerApproved ? navigation.navigate("home"): navigation.navigate("disclaimer")
                })
            }).catch((err) => {
                console.log(err)
                setText("שם המשתמש או הסיסמה לא נכונים")
            })
        } catch (err) {
            alert(err)
        }
        console.log(googleUid)
    }


    // const googleSignIn = async () => {
    //     console.log("i am in")
    //     try {
    //         const auth =  getAuth();
    //         const provider =  new GoogleAuthProvider();
    //         const user = (await signInWithPopup(auth, provider)).user
    //         setGoogleUid(user.uid);

    //     } catch (err) {
    //         console.log(err)
    //         alert("can't sign up with google")
    //     }
    // }



    if (!googleUid) {
        return (
            <View style={styles.container}>
                <Text style={styles.heading}>כניסה</Text>
                <TextInput
                    style={styles.input}
                    placeholder='Email'
                    placeholderTextColor='#9C9C9C'
                    keyboardType='email-address'
                    autoCapitalize='none'
                    onChangeText={setEmail}
                />
                <TextInput
                    style={styles.input}
                    placeholder='Password'
                    placeholderTextColor='#9C9C9C'
                    secureTextEntry={true}
                    onChangeText={setPassword}
                />
                <TouchableOpacity style={styles.button} onPress={handleSignIn}>
                    <Text style={styles.buttonText}>כניסה</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("SignUp")}>
                    <Text style={styles.buttonText}>עדיין לא רשום? הירשם - זה בחינם😁</Text>
                </TouchableOpacity>
                {/* <TouchableOpacity style={styles.googleButton} onPress={googleSignIn}>
        <FontAwesome name='google' size={24} color='red' />
        <Text style={styles.buttonText} > Sign Up with Google</Text>
      </TouchableOpacity> */}
       <Modal animationType="slide" transparent={true} visible={modalText? true:false}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>{modalText}</Text>
              <Button onPress={()=>setText("")} title="בסדר" color={'cadetblue'}/>
            </View>
          </View>
        </Modal>
            </View>

        )
    }
}



const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        // backgroundColor: 'black',
    },
    heading: {

        fontSize: 24,
        fontWeight: 'bold',
        marginVertical: 50,
        color: 'cadetblue',
        borderBottomColor: 'cadetblue',
        borderBottomWidth: 2,
    },
    input: {
        width: '80%',
        height: 50,
        padding: 10,
        borderWidth: 1,
        borderColor: '#9C9C9C',
        borderRadius: 5,
        marginBottom: 20,
        color: 'black',
        fontSize: 15
    },
    button: {
        width: '80%',
        height: 50,
        backgroundColor: 'cadetblue',
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    googleButton: {
        flexDirection: 'row',
        width: '80%',
        height: 50,
        borderColor: '#ce0000',
        borderWidth: 6,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    }, centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      },
      modalView: {
        padding:20,
        width: '90%',
        height: 100,
        backgroundColor: 'white',
        borderRadius: 5,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
      },
      
      modalText: {
        marginBottom: 15,
        textAlign: 'center',
      },
});

