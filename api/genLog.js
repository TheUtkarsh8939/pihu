import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  where,
  query,
  addDoc
} from "firebase/firestore";
import "dotenv/config";

import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_KEY);

const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export const config = {
  apiKey: "AIzaSyCfak4fnxSqNWPftplOibWlOdcYWlTq_oQ",
  authDomain: "phiu-830c6.firebaseapp.com",
  projectId: "phiu-830c6",
  storageBucket: "phiu-830c6.appspot.com",
  messagingSenderId: "625937464591",
  appId: "1:625937464591:web:f9a83e546f7c7ea4ed127a",
  measurementId: "G-6V0BRZVL27",
};
export const getCurrentDate = () => {
  const date = new Date();
  return `${date.getDate() - 1} ${date.getMonth() + 1} ${date.getFullYear()}`;
};
const app = initializeApp(config);
const fs = getFirestore(app);
const modelHistory = [
  {
    role: "user",
    parts: [
      {
        text: `
          You are here to work as logbook generator, so 
          you would be given a day's message from a group project chat
          in format of [{"sender":"....", "msg":"...."},{"sender":".....","msg":"...."},....]
          and from that you have to tell what they did in a single line or two,
          but instead of using they as the pronoun to refer to the team use we,
          as you are also a team member. Have a nice day ;)
          `,
      },
    ],
  },
  {
    role: "model",
    parts: [{ text: "Ok" }],
  },
];

export default async (req,res) => {
  let i = 0
  const queries = [
    [query(collection(fs,"alpha"), where("date", "==", getCurrentDate())),"alpha"],
    [query(collection(fs,"bravo"), where("date", "==", getCurrentDate())),"bravo"],
    [query(collection(fs,"charlie"), where("date", "==", getCurrentDate())),"charlie"],
  ];
  
  queries.forEach(async (query) => {

    const snap = await getDocs(query[0]);
    let messages = []
    snap.forEach((doc) => {
        const msg = {
            sender:doc.data().sender,
            msg:doc.data().text
        }
        messages.push(msg)
    });
    console.log(messages)
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const chat = model.startChat({
      history: modelHistory,
      generationConfig: {},
    });
  
    const result = await chat.sendMessage(JSON.stringify(messages));
    const response = await result.response;
    const text = response.text();
    const format = {
        team: query[1],
        date: getCurrentDate(),
        time: Math.floor(new Date() / 1000),
        data:text
    }
    await addDoc(collection(fs,"logbook"),format)
    i++
    if(i>2){
        res.status(200).json("👍")
    }
});

};
