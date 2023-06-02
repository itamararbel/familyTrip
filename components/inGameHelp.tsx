import { StyleSheet, TouchableOpacity } from 'react-native'
import { View,Text} from 'react-native';
import React, { useEffect, useState } from 'react';
import { Station } from '../model/stationModel';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import MyLocation from './MyLocation';
import { Entypo } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';


interface props {
  station : Station;
  goBack :()=>void;
  nextRiddle : (answer:string)=> void;
}



export default function InGameHelp(props:props) {
    const [render, setRender] = useState(true);
    const [helper, setHelper] = useState(0);
    const [text, setText] = useState("");
    const [splitedAnswer, setSplit] = useState<string[]>([])
    const [revealIndexes, setReveal] = useState<number[]>([]);
    const [isRightToLeft, setDirection]= useState(false)


    useEffect(()=>{
      setHelper(0);
      setText("")
      setSplit([]);
      setReveal([])
      setDirection(contains_heb(props.station.answer as string));
    },[props.station])

    const getDistance = () => {
        setText("בודקים...")
        const retry = setTimeout(()=>{getDistance()},2000)
        MyLocation.getDistanceFromLatLonInKm(props.station.location!.latitude, (props.station.location!.longitude)).then((resp: number) => {
          setText("אתה במרחק של" + Math.floor(resp * 1000) + "מ מהתחנה" )
          clearTimeout(retry)
        }).catch(err => {
          setText("לא הצלחנו לאתר את המיקום שלך")
        })
      }
  
  const clues = ()=>{
    if (splitedAnswer.length===0){
    setHelper(3)
    setSplit((props.station.answer as string).split(""));
    }else{
      let  temp = revealIndexes;
      const newNumber = random()
      !Number.isNaN(newNumber) && temp.push(newNumber)
      setReveal(temp);
      console.log(revealIndexes)
      setSplit(splitedAnswer)
      setRender(!render)    
    }
  }
  const random = ():number=>{
    if (revealIndexes.length >=splitedAnswer.length)
    {return(NaN)}
    let reveal = Math.floor(Math.random()*splitedAnswer.length)
    if (revealIndexes.indexOf(reveal)>=0){
      return(random())
    }else{
      return reveal;
    }
  }
  const  contains_heb= (str:string)=> {
    return (/[\u0590-\u05FF]/).test(str);
}
 
  return (
    <View style={styles.container}>
      <Text style={{fontSize:30, marginBottom:7}}>נתקעתם? בחרו עזרה</Text>
      <Text style={{color:'purple',fontSize:15}}>הסגול יגלה לכם את המרחק מהנקודה</Text>
      <Text style={{color:'green',fontSize:15}}>הירוק יחזיר אתכם שאלה אם הלכתם לאיבוד</Text>
      {props.station.answerType!=="american" &&<Text style={{color:'blue',fontSize:15}}>הכחול יגלה לכם חלק מאותיות התשובה</Text>}
      <Text style={{color:'red',fontSize:15,marginBottom:20}}>האדום פשוט יגלה לכם את התשובה</Text>
      <View style={{flexDirection:'row', justifyContent:'space-evenly'}}>
      <TouchableOpacity style={{width:60,height:60,backgroundColor:'purple', borderRadius:20, padding:5}} onPress={()=>{setHelper(1); getDistance()}}><MaterialCommunityIcons name="map-marker-distance" size={50} color="black" /></TouchableOpacity>
      <TouchableOpacity style={{width:60,height:60,backgroundColor:'green', borderRadius:20, padding:5}} onPress={()=>props.goBack()}><Entypo name="back-in-time" size={50} color="black" /></TouchableOpacity>
      {props.station.answerType!=="american" &&<TouchableOpacity style={{width:60,height:60,backgroundColor:'blue', borderRadius:20, padding:5}} onPress={clues}><MaterialIcons name="live-help" size={50} color="black" /></TouchableOpacity>}
      <TouchableOpacity style={{width:60,height:60,backgroundColor:'red', borderRadius:20, padding:5}} onPress={()=>setHelper(2)}><FontAwesome name="life-bouy" size={50} color="black" /></TouchableOpacity>
    </View>
    {helper ===1 && <Text style={{fontSize:20, marginTop:10}}>{text}</Text>}
    {helper ===2 && <View><Text style={{fontSize:20, marginTop:10}}>התשובה היא - {props.station.answerType==="american"? (props.station.answer as string).split(",")[0] :props.station.answer}</Text><TouchableOpacity style={{width:'60%',height:60,backgroundColor:'lightblue', borderRadius:20, padding:5,marginHorizontal:'20%', marginTop:10}} onPress={()=>props.nextRiddle(props.station.answer as string)}><Text style={{fontSize:20, textAlign:'center'}}>עבור לשאלה הבאה</Text></TouchableOpacity></View>}
    {helper ===3 && <View style={{flexDirection:'row', width:'100%',flexWrap:'wrap', marginTop:10,justifyContent:'center', direction:'ltr'}}><Text style={{fontSize:40, marginTop:1, width:'100%', textAlign:'center'}}> לחצו על הכחול שוב כדי להוסיף אות</Text>{splitedAnswer.map((i,index)=><View style={{height:50,width:30, backgroundColor:'blue', margin:2}} key={index+i}>{i===' '?<Text style={{fontSize:40,color:'white', textAlign:'center'}}> - </Text> : <Text style={{textAlign:'center', fontSize:40, color:revealIndexes.indexOf(index)>=0 ? 'white': 'blue'}}>{i}</Text>}</View>)}</View>}
    </View>
  )
}

const styles = StyleSheet.create({
  text: {
   
    fontSize: 30,
  },
  container:{
    
    // width:'100%',
    // flex:1,
    padding:30,
    // backgroundColor:'green',
    // zIndex:3000000
  }

})