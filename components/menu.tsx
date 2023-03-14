
import { useNavigation } from "@react-navigation/native";
import { View, Text, Button, TouchableOpacity, ScrollView,StyleSheet } from "react-native";
import { RootStackParams } from "../App";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { getAuth } from "firebase/auth";
interface props {
    closeMenu: () => void
}

export default function Menu(props: props) {
    const auth = getAuth()


    const navigation = useNavigation<NativeStackNavigationProp<RootStackParams>>()
    return (
        <ScrollView style={{padding:30, borderColor:'cadetblue', borderWidth:5,borderRadius:25, shadowColor:'black'}}>
            <View style={{backgroundColor:'cadetblue', flex:1, flexDirection:'row-reverse',justifyContent:'space-between', padding:20,borderRadius:25 }}>
            <Text style={{fontSize:20}}>{auth.currentUser?.displayName? "קבוצת " + auth.currentUser?.displayName: ""} </Text><TouchableOpacity onPress={async()=>{await auth.signOut(); navigation.navigate("SignIn");props.closeMenu()}}><Text style={{fontSize:20, textDecorationLine:'underline', color:'brown'}}>צא</Text></TouchableOpacity>
                    </View>
                    <View>
            <TouchableOpacity
                style={styles.menuItem}
                onPress={() => {
                    props.closeMenu()
                    navigation.navigate("Games")
                }}
            ><Text style={{ fontSize: 30, textAlign:'center' }}>משחקים</Text></TouchableOpacity>
            <TouchableOpacity
                style={styles.menuItem}
                onPress={() => {
                    props.closeMenu()
                    navigation.navigate("Riddles")
                }}
            ><Text style={{ fontSize: 30, textAlign:'center' }}>חידות</Text></TouchableOpacity>
            <TouchableOpacity
                style={styles.menuItem}
                onPress={() => {
                    props.closeMenu();
                    navigation.navigate("addGame");
                }
                }
            ><Text style={{ fontSize: 30, textAlign:'center' }}>הוסף משחק חדש</Text></TouchableOpacity>
             <TouchableOpacity
                style={styles.menuItem}
                onPress={() => {
                    props.closeMenu();
                    navigation.navigate("SignUp");
                }
                }
            ><Text style={{ fontSize: 30, textAlign:'center' }}>הרשמה</Text></TouchableOpacity>
             <TouchableOpacity
                style={styles.menuItem}
                onPress={() => {
                    props.closeMenu();
                    navigation.navigate("camera");
                }
                }
            ><Text style={{ fontSize: 30, textAlign:'center' }}>עוד מצלמה</Text></TouchableOpacity>
             <TouchableOpacity
                style={styles.menuItem}
                onPress={() => {
                    props.closeMenu();
                    navigation.navigate("takepic");
                }
                }
            ><Text style={{ fontSize: 30, textAlign:'center' }}>מצלמה ישנה</Text></TouchableOpacity>
            </View>
        </ScrollView>
    )

}

const styles = StyleSheet.create({
    menuItem : {
        borderBottomColor: 'cadetblue',borderBottomWidth:3, margin: 5,
        textAlign:'center',

    },
})
