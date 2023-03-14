import React, { useEffect, useState } from 'react'
import { SafeAreaView, Button, ScrollView, TextInput, StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import { useForm, Controller } from 'react-hook-form'
import TakePic from './takepic';
import * as Location from 'expo-location';
import { Dialog, Portal, RadioButton , Button as ButtonPaper} from 'react-native-paper';
import DateTimePickerModal from "react-native-modal-datetime-picker";
// import LocationPicker from './mapView';
import { Station } from '../model/stationModel';









interface props {
  saveStation: (station: Station) => void,
  closeDialog: () => void
}


export default function AddStation(props: props) {
  const { register, control, handleSubmit, formState: { errors, isValid }, setValue } = useForm<Station>({ mode: 'onBlur' })
  const [answerType, setAnswerType] =useState("text")
  const [date, setDate] =useState("")
  const [isDatePickerVisible, setShow]= useState(true)
   const onSubmit = async (dataSubmit: any) => {
    console.log(dataSubmit)
    if (!dataSubmit.image || !dataSubmit.location.latitude) {
      alert("לא מופיע תמונה")
    } else {
      dataSubmit.answerType = answerType;
      props.saveStation(dataSubmit);
      props.closeDialog();
    }
  }

   const handleChange = (event:Date) => {
     let regularDate = (event.toISOString().split("T")[0]);
     regularDate = regularDate.split("-")[2]+"/"+ regularDate.split("-")[1]+"/"+ regularDate.split("-")[0]
     setDate(regularDate)
     setShow(false)
     setValue('answer', regularDate)
   }

  const getLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      console.log('Permission to access location was denied');
      return;
    }
    let location = await Location.getCurrentPositionAsync({});
    return location;
  }

  const saveLocation =async()=>
{
  const location = await getLocation();
    !location && alert("לא ניתן לאתר מיקום")
    console.log(location?.coords)
    const submitedLocation = {
      latitude : location?.coords.latitude||10,
      longitude : location?.coords.longitude||10,
      accuracy : location?.coords.accuracy||10,
    }
    setValue('location',submitedLocation)
}
  
  const hideDatePicker = ()=>{}
  


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
        <View style={{flexDirection: 'row', justifyContent:'space-evenly'}}>        
        <View style={styles.radio}>
          <Text style={{fontSize:20}}>טקסט</Text>
          <RadioButton value="string" color='cadetblue'/>
        </View>
        <View style={styles.radio}>
          <Text style={{fontSize:20}}>מספר</Text>
          <RadioButton value="number" color='cadetblue' />
        </View>
        <View style={styles.radio}>
        <TouchableOpacity onPress={()=>setShow(true)}><Text style={{fontSize:20}}>תאריך</Text></TouchableOpacity>
          <RadioButton value="Date" color='cadetblue'/>
        </View>
        </View>
      </RadioButton.Group>

      <Controller
        control={control}
        name="answer"
        render={({ field: { onChange, value, onBlur } }) => (
          answerType ==="Date"? isDatePickerVisible?  <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="date"
          onConfirm={(event:any)=>handleChange(event)}
          onCancel={()=>hideDatePicker}
        />:<Text></Text>:
          <TextInput
            style={styles.input}
            keyboardType= {answerType==='number'? 'numeric': 'default'}
            placeholder="כתוב פה את התשובה הנכונה"
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
      <TakePic getPicUri={(args: string) => { setValue('image', args), saveLocation() }}></TakePic>
      {/* <Text>accuracy of location : {gpsAccuracy}</Text> */}
      

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
  }, radio:{
    flexDirection: 'row',
    width:'30%',
    // borderColor: 'black',
    // borderWidth:1,
  }
})