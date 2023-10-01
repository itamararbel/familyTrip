import { doc, getDoc, getFirestore } from "firebase/firestore";
import fireBase from "../fireBase";

class appTexts {
    home: string | undefined;
    beforeGame: {beforeLink:string,afterLink:string}|undefined;
    preGames : {beforeLink:string,afterLink:string}|undefined;

    constructor() {
        const db = getFirestore(fireBase);
        const docRef = doc(db, "appInfo", "appTexts");
        console.log("texts")
        getDoc(docRef).then((resp) => {
            const data = resp.data()
            if (data) {
                this.home = data.home;
                this.preGames = data.preGames;
                this.beforeGame = data.beforeGame;
            }
        })
    }
}

export default new appTexts()