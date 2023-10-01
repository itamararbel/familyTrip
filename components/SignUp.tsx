import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Modal, Button, ActivityIndicator } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { getAuth, createUserWithEmailAndPassword, updateProfile, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import app from "../fireBase";
import { doc, getFirestore, serverTimestamp, setDoc } from 'firebase/firestore';
import UserModel from '../model/userAuth';
import { Controller, useForm } from 'react-hook-form';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { RootStackParams } from '../App';



export default function SignUp() {
  const [modalText,setText] = useState("")
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [googleUid,setGoogleUid]= useState("");
  const { control, handleSubmit, formState: { errors, isValid }, setValue } = useForm<UserModel>({ mode: 'onBlur' });
  const db = getFirestore(app)
  const auth = getAuth();
  const [loading,setLoading] = useState(false)



  
  const handleSignUp = async () => {
    setLoading(true)
    let user:UserModel = {
        userMail: email,
        password: password,
        uuid: ''
    }
    let creds
    user.timeStamp = serverTimestamp();
    if (email.length<6||!email.includes('@')||!email.includes('.')){
      setText("האימייל לא תקין")
      setLoading(false)
      return
    }
    if (password.length<6){
      setLoading(false)
      setText("הסיסמה חייבת להיות לפחות עם 6 ספרות")
      return
    }
    try {
        if (!googleUid) {
          console.log("1")
            creds = await createUserWithEmailAndPassword(auth, user.userMail, user.password as string)
            console.log("there" + creds.user.uid);
            user.password = "";
           setGoogleUid(creds.user.uid)
           setLoading(false)

        }
        else {
          console.log("2")
          setLoading(false)

            await setDoc(doc(db, "users", googleUid), user);
        }
    } catch (err:any) {
      console.log("3")
      setText("המייל קיים או לא תקין")
      setLoading(false)


    }
    console.log("there" + googleUid)
}
const navigation = useNavigation<NativeStackNavigationProp<RootStackParams>>()

const addUserDetails = async (formData:UserModel)=>{
  setLoading(true)

    auth.currentUser &&
    updateProfile(auth.currentUser, {
        displayName: formData.name,
    })
    formData.userMail=email;
    formData.timeStamp = serverTimestamp()
    setDoc(doc(db, "users", googleUid), formData).then(()=>navigation.navigate("disclaimer"));
    setLoading(false)

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

if (!googleUid){
  return (
    <View style={styles.container}>
      <Modal animationType="slide" transparent={true} visible={modalText? true:false}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>{modalText}</Text>
              <Button onPress={()=>setText("")} title="בסדר" color={'cadetblue'}/>
            </View>
          </View>
        </Modal>
      <Text style={styles.heading}>הרשמה</Text>
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
      <TouchableOpacity style={styles.button} onPress={handleSignUp}>
        {loading?<ActivityIndicator animating={true} color={'black'} />:<Text style={styles.buttonText}>המשך הרשמה</Text>}
      </TouchableOpacity>
      <TouchableOpacity style={styles.button}  onPress={()=>navigation.navigate("SignIn")}>
                    <Text style={styles.buttonText}>כבר רשום? עבור לכניסה</Text>
                </TouchableOpacity>
      {/* <TouchableOpacity style={styles.googleButton} onPress={googleSignIn}>
        <FontAwesome name='google' size={24} color='red' />
        <Text style={styles.buttonText} > Sign Up with Google</Text>
      </TouchableOpacity> */}
    </View>
  )}
  if(googleUid){
    return(
        <View style={styles.container}>
                  <Text style={styles.heading}>כמה פרטים אחרונים...</Text>

      <Controller
        control={control}
        name="name"
        render={({ field: { onChange, value, onBlur } }) => (
          <TextInput
            style={styles.input}
            placeholder="בחרו כינוי מגניב לקבוצה/משפחה "
            value={value}
            onBlur={onBlur}
            onChangeText={value => onChange(value)}
          />
        )}
        rules={{
          required: {
            value: true,
            message: 'יש למלא את השדה הזה'
          }
        }}
      />
      {errors.name && <Text style={{color:"red"}}>{errors.name.message}</Text>}

      <Controller
        control={control}
        name="address"
        render={({ field: { onChange, value, onBlur } }) => (
          <TextInput
            style={styles.input}
            placeholder="באיזה איזור אתם גרים"
            value={value}
            onBlur={onBlur}
            onChangeText={value => onChange(value)}
          />
        )}
        rules={{
          required: {
            value: true,
            message: 'יש למלא את השדה הזה'
          }
        }}
      />
      {errors.address && <Text style={{color:"red"}}>{errors.address.message}</Text>}
      <Controller
        control={control}
        name="phoneNumber"
        render={({ field: { onChange, value, onBlur } }) => (
          <TextInput
            style={styles.input}
            placeholder="אנא רשום את מספר הטלפון-ספרות בלבד"
            value={value}
            onBlur={onBlur}
            onChangeText={value => onChange(value)}
            keyboardType='numeric'
          />
        )}
        rules={{
          required: {
            value: true,
            message: 'יש למלא את השדה הזה'
          }
        }}
      />
      {errors.phoneNumber && <Text style={{color:"red"}}>{errors.phoneNumber.message}</Text>}
      <TouchableOpacity style={styles.button} onPress={handleSubmit(addUserDetails)}>
        {loading?<ActivityIndicator animating={true} color={'black'} />:<Text style={styles.buttonText}>סיים רישום</Text>}
      </TouchableOpacity>
      
      </View>

    )}}
  


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
    color:'cadetblue',
    borderBottomColor:'cadetblue',
    borderBottomWidth:2,
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
    fontSize:15
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
    borderWidth:6,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
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
  }, centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

