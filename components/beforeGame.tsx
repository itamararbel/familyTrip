import { useRoute } from '@react-navigation/native';
import { View, Text, StyleSheet, FlatList, ScrollView, SafeAreaView, Button, TouchableOpacity, Linking } from "react-native";

import React from "react";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParams } from "../App";

interface props {
    link: string
}



export default function BeforeGame() {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParams>>()
    const route = useRoute<any>();
    const location = route.params?.place
    return (
        <ScrollView style={styles.container}>
            <Text style={styles.header}>איזה כיף מתחילים</Text>
            <Text style={styles.text}>שיהיה לכם טיול מהנה וכיפי</Text>
            <Text style={styles.text}>אם אתם עוד לא שם אז הנה שוב הקישור לתחילת המשחק</Text>
            {location && <TouchableOpacity onPress={() => Linking.openURL(location)}><Text style={{ fontSize: 20, margin: 10, textAlign: 'center', color: 'blue' }}>קישור לנקודת ההתחלה</Text></TouchableOpacity>}
            <Text style={styles.text}>שימו לב לתנועה ושהילדים תמיד קרובים אליכם.</Text>
            <Text style={styles.text}>שימרו על הסביבה ואל תפריעו לשכנים</Text>
            <Text style={styles.text}> אם זה המשחק הראשון שלכם תבדקו בהתחלה את גלגלי ההצלה. אם אתם חושבים שאתם לא בדרך הנכונה לתחנה כדאי לבדוק כמה פעמים את המיקום </Text>
            <Text style={styles.text}>שימו לב שסטיה במיקום המכשיר יכולה להיות של 40 מטר קחו את זה בחשבון</Text>
            <Text style={styles.header}>והכי חשוב, שיהיה בכיף 👨‍👩‍👦‍👦👨‍👩‍👦‍👦</Text>

            <TouchableOpacity style={{ marginHorizontal: '30%', backgroundColor: "cadetblue", borderRadius: 10, width: '40%' }} onPress={() => navigation.navigate("InGame")}><Text style={[styles.text, { marginBottom: 20 }]}>יאללה בואו נתחיל</Text></TouchableOpacity>
            <Text></Text>
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
