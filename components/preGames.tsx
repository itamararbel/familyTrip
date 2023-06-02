import { View, Text, StyleSheet, FlatList, ScrollView, SafeAreaView, Button, TouchableOpacity, Linking } from "react-native";
import { Ionicons } from '@expo/vector-icons'; 

import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParams } from "../App";
import { getAuth } from "firebase/auth";
import * as FileSystem from 'expo-file-system';


export default function PreGames() {
    const [text, setText] = useState("")

    const navigation = useNavigation<NativeStackNavigationProp<RootStackParams>>()
    const auth = getAuth();

    const checkLog = async () => {
        return ((auth.currentUser?.uid))
    }

    useEffect(()=>{
        checkLog().then((resp: any) => {
            resp === undefined ? navigation.navigate('SignIn') : navigation.navigate('PreGames')
        })
        FileSystem.readDirectoryAsync(FileSystem.documentDirectory + "/").then((resp) => {
            if (resp.indexOf("gameInPlay.txt") > 0) {
                setText("יש משחק פתוח  חוזרים אליו...");
                // navigation.navigate('InGame');
            }
        })}
    ,[])
    return (
        
        <ScrollView style={styles.container}>
            {text? <View style={{flex:1, justifyContent:'center',height:'100%'}}><Text style={{flex:1, justifyContent:'center', textAlign:'center', paddingTop:'50%', fontSize:40}}>יש משחק פתוח</Text>
            <TouchableOpacity style={{marginHorizontal:'10%', backgroundColor:"cadetblue", borderRadius:10,width:'80%' , marginTop:15 }} onPress ={()=>navigation.navigate("InGame")}><Text style={[styles.text,{marginBottom:20}]}>המשך משחק</Text></TouchableOpacity>
            <TouchableOpacity style={{marginHorizontal:'10%', backgroundColor:"red", borderRadius:10,width:'80%' , marginTop:15 }} onPress ={()=>navigation.navigate("Games")}><Text style={[styles.text,{marginBottom:20}]}>בחר משחק אחר(המשחק ילך לאיבוד ללא זיכוי)</Text></TouchableOpacity>

            </View>:
            <View>
            <Text style={styles.header}>משחקי ניווט</Text>
            <Text style={styles.text}>זה מוצר הדגל שלנו</Text>
            <Text style={styles.text}>בואו לטייל בכיף כשהילדים נהנים לפתור חידות ולומדים כמה דברים חדשים על המקום בו בחרתם לטייל</Text>
            <Text style={styles.text}>התוכן קצר, קולע ונכתב על ידי מדריכי טיולים. המושגים והשאלות נועדו לפתח שיח, כדי שתוכלו להעשיר את הילדים שלכם כראות עינכם</Text>
            <Text style={styles.text}>עלות כל משחק היא 30 ש"ח למכשיר והכוונה היא שכל משפחה תשתמש במכשיר אחד למשחק עצמו</Text>
            <Text style={styles.text}>בשלב זה לא ניתן לרכוש באופן ישיר משחקים וכדי לשחק אנא צרו קשר בקישור הבא</Text>
            <TouchableOpacity style={{marginHorizontal:'45%'}} onPress ={()=>Linking.openURL('whatsapp://send?phone=+972528139818')}><Ionicons name="md-logo-whatsapp" size={40} color="green" /></TouchableOpacity>
            <Text style={styles.text}>מומלץ לכתוב כמה שעות מראש כדי שבודאות זה לא יעכב אתכם אבל רוב הסיכויים שהמענה יהיה מיידי</Text>
            <Text style={styles.header}>להלן מספר המלצות כדי לעשות את זה מהנה יותר</Text>
            <Text style={styles.listText}>* אם הילדים מתקשים בקריאה בלי ניקוד - הקריאו להם את הטקסטים הארוכים ושהילדים יקראו את השאלות. קריאה ארוכה תתיש אותם ואלו גם מילים שהם לא מכירים </Text>
            <Text style={styles.listText}>* אם יש כמה ילדים תקפידו לקבוע מראש תורות וסדר כדי לשמור על אווירה חיובית</Text>
            <Text style={styles.listText}>* כשמתקשים בפתרון חידה מסויימת יש סמל של גלגל הצלה ויש בו כמה סוגי  עזרות, עדיף להשמש בעזרה או לרמוז לילדים ולא ליצר תסכול</Text>
            <Text style={styles.listText}>* הקצב של המשחק הוא רק שלכם, אם צריך הפסקה קחו הפסקה, אם קצת מאבדים סבלנות אפשר לדלג על להקריא חלקים </Text>
            <TouchableOpacity style={{marginHorizontal:'30%', backgroundColor:"cadetblue", borderRadius:10,width:'40%' }} onPress ={()=>navigation.navigate("Games")}><Text style={[styles.text,{marginBottom:20}]}>המשך</Text></TouchableOpacity>
            <Text></Text>
            </View>}
        </ScrollView>

    )
}

const styles = StyleSheet.create({
    container: {
        width: '90%',
        height: '80%',
        margin: '5%',
        borderColor: 'cadetblue',
        borderWidth: 4,
        borderRadius: 10

    },
    text: {
        textAlign: 'center',
        fontSize: 20,
        margin: 20,
    },
    listText: {
        textAlign: 'center',
        fontSize: 20,
        margin: 20,
        
    },
    header: {
        fontWeight: 'bold',
        color: 'cadetblue',
        textAlign: 'center',
        fontSize: 30,
        margin: 20,
    }
});
