import { View, Text, StyleSheet, FlatList, ScrollView, SafeAreaView, Button } from "react-native";
import { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParams } from "../App";
import React from "react";
import { deleteDoc, doc, getDoc, getFirestore } from "firebase/firestore";
import fireBase from "../fireBase";
import { Colors } from "react-native/Libraries/NewAppScreen";
import { Dialog, Portal } from "react-native-paper";


export default function UserInfo() {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParams>>()
    const auth = getAuth()
    const db = getFirestore(fireBase);
    const [user, setUser] = useState<any>();
    const [visible, setVisible] = useState(false)
    


    useEffect(() => {
        getUserInfo()

    }, [])

    const getUserInfo = async () => {
        const uid = auth.currentUser?.uid;
        const docRef = doc(db, "users", uid!);
        const docSnap = await getDoc(docRef);
        let data = docSnap.data();
        if (data) { data.registeredDate = new Date(data.timeStamp.seconds * 1000).toISOString().split("T")[0] }
        setUser(data)
        console.log(data)
    }
    const deleteAccount = () => {
        const uid = auth.currentUser?.uid;
        deleteDoc(doc(db, "users", uid!));
        auth.currentUser?.delete().then(() => {
            console.log("user deleted");
            navigation.navigate("SignIn")
        }).catch((err) => console.log(err))
    }
    return (
        <View style={styles.container}>
            <Portal>
                <Dialog visible={visible} onDismiss={() => setVisible(false)}>
                    <Text style={styles.header}>זהירות!! - המחיקה היא סופית ולא ניתן לשחזר פרטים</Text>
                    <Text style={styles.header}>האם אתה בטוח שאתה רוצה למחוק לצמיתות את פרטי המשתמש</Text>
                    <Dialog.Actions>
                        <Button onPress={() => setVisible(false)} title="ביטול" color='green' />
                        <Button onPress={deleteAccount} title="מחק לצמיתות" color='orangered' />
                    </Dialog.Actions>
                </Dialog>
            </Portal>
            <Text style={styles.header}>פרטי המשתמש שלך:</Text>
            {user && user.name &&
                <ScrollView>
                    <Text style={styles.text}>שם המשתמש : {user.name}</Text>
                    <Text style={styles.text}>קרדיט : {user.credit}</Text>
                    <Text style={styles.text}>כתובת : {user.address}</Text>
                    <Text style={styles.text}>מייל: {user.userMail}</Text>
                    <Text style={styles.text}>טלפון : {user.phoneNumber}</Text>
                    <Text style={styles.text}> תאריך רישום : {user.registeredDate}</Text>
                    {user.gamesPlayed &&
                        <Text style={styles.text}> משחקים ששוחקו  : {user.gamesPlayed.length}</Text>}
                    {user.gamesPlayed &&
                        <SafeAreaView>
                            <FlatList
                                style={{}}
                                data={user.gamesPlayed}
                                renderItem={({ item }) => <Text style={styles.listText}> שוחק: {item.name} ב: {new Date(item.date).toISOString().split("T")[0]}</Text>
                                }
                            /></SafeAreaView>
                    }
                    <Button title="מחק חשבון משתמש" onPress={() => { setVisible(true) }} color="orangered" />
                </ScrollView>}
        </View>

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
        margin: 0,
    },
    header: {
        fontWeight: 'bold',
        color: 'cadetblue',
        textAlign: 'center',
        fontSize: 30,
        margin: 20,
    }
});
