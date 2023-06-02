import React, { useEffect, useState } from 'react'
import { SafeAreaView, Button, ScrollView, TextInput, StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import { useForm, Controller } from 'react-hook-form'
import TakePic from './takepic';
import * as Location from 'expo-location';
import { Dialog, Portal, RadioButton, Button as ButtonPaper, ActivityIndicator } from 'react-native-paper';
import DateTimePickerModal from "react-native-modal-datetime-picker";
// import LocationPicker from './mapView';
import { Station } from '../model/stationModel';
import { Colors } from 'react-native/Libraries/NewAppScreen';









interface props {
  saveStation: (station: Station) => void,
  closeDialog: () => void
}


export default function AddStation(props: props) {
  const { register, control, handleSubmit, formState: { errors, isValid }, setValue } = useForm<Station>({ mode: 'onBlur' })
  const [answerType, setAnswerType] = useState("text")
  const [date, setDate] = useState("")
  const [isDatePickerVisible, setShow] = useState(true)
  const [location, setLocation] = useState({
    latitude: NaN,
    longitude: NaN,
    accuracy: NaN,
  })
  const [gettingLocation, setGetting] = useState(false)


  const onSubmit = async (dataSubmit: any) => {
    if (!location.latitude){
      alert ("אין מיקום")
      return
    } 
    if (!dataSubmit.image) {
      alert("לא מופיע תמונה")
    } else {
      console.log(dataSubmit)
      dataSubmit.answerType = answerType;
      props.saveStation(dataSubmit);
      props.closeDialog();
    }
  }

  const handleChange = (event: Date) => {
    let regularDate = (event.toISOString().split("T")[0]);
    regularDate = regularDate.split("-")[2] + "/" + regularDate.split("-")[1] + "/" + regularDate.split("-")[0]
    setDate(regularDate)
    setShow(false)
    setValue('answer', regularDate)
  }

  const getLocation = async () => {
    setGetting(true)
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      console.log('Permission to access location was denied');
      return;
    }
    const retry = setTimeout(()=>getLocation,2000);
    await Location.getCurrentPositionAsync({}).then((resp)=>{
      clearTimeout(retry)
      if (resp.coords.accuracy && resp.coords.accuracy<location.accuracy|| Number.isNaN(location.accuracy)){
        setLocation( {latitude: resp.coords.latitude,
          longitude: resp.coords.longitude,
          accuracy: resp.coords.accuracy||NaN})
          setValue('location',{
            latitude: resp.coords.latitude,
            longitude: resp.coords.longitude,
            accuracy: resp.coords.accuracy||NaN
          })
    }}
).catch((err)=>console.log(err))
setGetting(false)  
}

  // const saveLocation = async () => {
  //   const location = await getLocation();
  //   !location && alert("לא ניתן לאתר מיקום")
  //   console.log(location?.coords)
  //   const submitedLocation = {
  //     latitude: location?.coords.latitude || 10,
  //     longitude: location?.coords.longitude || 10,
  //     accuracy: location?.coords.accuracy || 10,
  //   }
  //   setValue('location', submitedLocation)
  // }

  const hideDatePicker = () => { }



  return (
    <ScrollView>
      <Controller
        control={control}
        name="header"
        render={({ field: { onChange, value, onBlur } }) => (
          <TextInput
            style={styles.input}
            placeholder="מה הכותרת של התחנה"
            value={value}
            onBlur={onBlur}
            onChangeText={value => onChange(value)}
          />
        )}
        rules={{
          required: {
            value: true,
            message: 'השדה הזה חובה'
          }
        }}
      />
      {errors.header && <Text>{errors.header.message}</Text>}

      <Controller
        control={control}
        name="description"
        render={({ field: { onChange, value, onBlur } }) => (
          <TextInput
            style={styles.input}
            placeholder="מה השאלה"
            value={value}
            onBlur={onBlur}
            onChangeText={onChange}
          />
        )}
        rules={{
          required: {
            value: true,
            message: 'השדה הזה חובה'
          }
        }}
      />
      {errors.description && <Text>{errors.description.message}</Text>}
      <RadioButton.Group onValueChange={newValue => setAnswerType(newValue)} value={answerType}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-evenly'}}>
          <View style={styles.radio}>
            <Text style={{ fontSize: 15 }}>טקסט</Text>
            <RadioButton value="string" color='cadetblue' />
          </View>
          <View style={styles.radio}>
            <Text style={{ fontSize: 15 }}>אמריקאי</Text>
            <RadioButton value="american" color='cadetblue' />
          </View>
          <View style={styles.radio}>
            <Text style={{ fontSize: 15 }}>מספר</Text>
            <RadioButton value="number" color='cadetblue' />
          </View>
          <View style={styles.radio}>
            <TouchableOpacity onPress={() => setShow(true)}><Text style={{ fontSize: 15 }}>תאריך</Text></TouchableOpacity>
            <RadioButton value="Date" color='cadetblue' />
          </View>
        </View>
      </RadioButton.Group>
{answerType === 'american' && <Text style={{fontSize:20, textAlign:'center'}}>כתוב 4 תשובות מופרדות בפסיקים.הראשונה נכונה.</Text>}
      <Controller
        control={control}
        name="answer"
        render={({ field: { onChange, value, onBlur } }) => (
          answerType === "Date" ? isDatePickerVisible ? <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode="date"
            onConfirm={(event: any) => handleChange(event)}
            onCancel={() => hideDatePicker}
          /> : <Text></Text> :
            <TextInput
              style={styles.input}
              keyboardType={answerType === 'number' ? 'numeric' : 'default'}
              placeholder={answerType === 'american' ? "כתוב 4 תשובות מופרדות בפסיקים.הראשונה נכונה" : "כתוב את התשובה הנכונה"}
              value={value as string}
              onBlur={onBlur}
              onChangeText={value => onChange(value)}
            />
        )}
        // rules={{
        //   required: {
        //     value: true,
        //     message: 'השדה הזה חובה'
        //   }
        // }}
      /><Text>{date}</Text>
      {errors.answer && <Text>{errors.answer.message}</Text>}
      <Controller
        control={control}
        name="afterCorrectAnswer"
        render={({ field: { onChange, value, onBlur } }) => (
          <TextInput
            style={styles.input}
            placeholder="פידבק על תשובה נכונה"
            value={value}
            onBlur={onBlur}
            onChangeText={value => onChange(value)}
          />
        )}
        rules={{
          required: {
            value: true,
            message: 'השדה הזה חובה'
          }
        }}
      />
      {errors.answer && <Text>{errors.answer.message}</Text>}
      <TakePic getPicUri={(args: string) => { setValue('image', args) }}></TakePic>
      {/* <Text>accuracy of location : {gpsAccuracy}</Text> */}


      <Text>{'\n'}</Text>
      {!gettingLocation ? 
      <Button title={location.accuracy ? "רמת הדיוק של המיקום היא " + location.accuracy + " לחשב שוב?" : "קבל מיקום"} color={'gray'} onPress={getLocation}/>
      : <TouchableOpacity style={{flex:1, justifyContent:'center', flexDirection:'row', backgroundColor:'gray'}} onPress={()=>setGetting(false)}>
        <Text style={styles.text}>  לבטל?-בודק את המיקום  </Text><ActivityIndicator animating={true} color={Colors.red800}/>
      </TouchableOpacity>}
      <Text>{'\n'}</Text>

      <Button title='Submit and close' color={'#598f5f'} onPress={handleSubmit(onSubmit)} />
      {/* <Button title='הצג מפה' color={'#598f5f'} onPress={()=>setShowMap(!showMap)} />  */}
      {/* <Portal> */}
      {/* <Dialog visible={showMap} onDismiss={()=>hideDialog} style={{height:'80%'}}> */}
      {/* <SafeAreaView><LocationPicker></LocationPicker></SafeAreaView> */}
      {/* <Dialog.Actions>  */}
      {/* <ButtonPaper onPress={hideDialog}>Cancel</ButtonPaper> */}
      {/* </Dialog.Actions> */}
      {/* </Dialog>
        </Portal> */}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: 'white',
    borderColor: 'black',
    margin: 5,
    marginHorizontal: 30,
    fontSize: 25,
  }, radio: {
    margin:-5,
    marginHorizontal:-20,
    flexDirection: 'row',
    width: '25%',
    // borderColor: 'black',
    // borderWidth:1,
  }, text: {
    textAlign: 'center',
    fontSize: 20,
    backgroundColor:'gray',
    padding:10
  }
})