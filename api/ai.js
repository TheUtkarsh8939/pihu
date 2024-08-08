
import wiki from "wikipedia";
// import puppeteer from "puppeteer-core";
// import Chromium from "@sparticuz/chromium";
import axios from "axios"
// Chromium.setHeadlessMode = true;

import "dotenv/config"

import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_KEY);

const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

//adding headless flag to false
// const googleSearch = async (searchQuery) => {
//   searchQuery = searchQuery.replace(" ", "+");
//   const browser = await puppeteer.launch({
//     args: Chromium.args,
//     defaultViewport: Chromium.defaultViewport,
//     executablePath: await Chromium.executablePath(),
//     headless: Chromium.headless,
//   });

//   // console.log(searchQuery);
//   const page = await browser.newPage();

//   await page.setViewport({ width: 1000, height: 500 });
//   await page.goto("https://www.google.com/search?udm=14&q=" + searchQuery);

//   const searchResultArr = await page.$$(".MjjYud");
//   let resArr = [];

//   for (const elem of searchResultArr) {
//     const link = await elem.$("[jsname=UWckNb]");
//     const title_elem = await link.$("h3 .LC20lb");
//     const url_prop = await link.getProperty("href");
//     const title_prop = await link.getProperty("innerText");
//     const url = await url_prop.jsonValue();
//     const title = await title_prop.jsonValue();
//     resArr.push({ title: title, url: url });
//   }

//   await browser.close();
//   return resArr;
// };
const wikiSearch = async (searchQuery) => {
  const searchResults = await wiki.search(searchQuery);
  // console.log(searchResults)
  return searchResults.results;
};
const wikiSummary = async (page) => {
  
  const link = `https://en.wikipedia.org/api/rest_v1/page/summary/${page}?redirect=false`
  try {
    const result = await axios.get(link)
    return result.data.extract
  } catch (err){
    console.error("Error! Error! Error!")
    throw err

  } 
}
const run = async (history, msg, pointerObj) => {
  // The Gemini 1.5 models are versatile and work with multi-turn conversations (like chat)
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const chat = model.startChat({
    history: history,
    generationConfig: {},
  });

  const result = await chat.sendMessage(msg);
  const response = await result.response;
  const text = response.text();

  let newHistory = history;
  if (text.startsWith("!search")) {
    const query = text.replace("!search ", "");
    // const result = await googleSearch(query);
    // newHistory.push(
    //    {role:"user", parts: [{text: msg}]}
    // )
    // newHistory.push(
    //    {role:"model", parts: [{text:text}]}

    // )

    run(newHistory, JSON.stringify(result));
  } else if (text.startsWith("!wikisearch")) {
  
    const query = text.replace("!wikisearch ", "");
    const result = await wikiSearch(query);
    await run(newHistory, JSON.stringify(result))
    // newHistory.push({role:"model",parts:[{text:text}]})
    // newHistory.push({role:"user", parts:[{text:txt}]})
  } else if (text.startsWith("!wiki")) {
    let qry = text.replace("!wiki ", "");
    qry = qry.replace(" ","_")
    const page = await wikiSummary(qry);
    
    
    const result = page;
    await run(newHistory, JSON.stringify({text:result}))
    // newHistory.push({role:"model",parts:[{text:text}]})
    // newHistory.push({role:"user", parts:[{text: txt}]})
  }
  pointerObj.text = text
  return newHistory;
};

export default async (req,res) => {
  let ptrObj = {}
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Origin", "*");
  console.log("Requested")
  if (req.headers["x-prompt"] === ""|| req.headers["x-prompt"] === undefined){
    res.status(400).json({"err":"header not present"})
    return
  }
  if (req.headers["x-history"] === undefined || req.headers["x-history"] === ""){
    const history = await run(
      [
        {
          role: "user",
          parts: [
            {
              text: `You have been given ability to search google, if you want to search 
              something to get some extra information, just respond with the text \"!search <searchQuery(It can contain spaces)\" and 
              the next prompt given will be the result of the top 12 google web search results in the json format: [{\"title\":\"title of the page\",\"url\":\"url to the page\"},...]\".
               You can also search wikipedia, using two commands: \"!wikisearch <searchQuery>\" which searches wikipedia for pages most appropriate for 
               that query and returns the result 
               in json structure of [{\"ns\":0, \"title\": \"title of the page\", \"pageid\":<id of the page>},...] 
              and the command \"!wiki <page title>\" which will give you that wikipedia page introduction of that page in format {\"text\":\"page summary\"}.
              You are advised to use your memory the most and only use these commands when absolutely neccesarry also use wikipedia before google.
              Remember, the commands you use are not actually visible to the end user, and the response to the command is generated by an automated script and not the end user.
              So when you run any command starting with "!" the command is running using a preprogrammed script, so do not think the end user knows the 
              result of the command. So when given the response to command you ran you have to respond with a reframed result of the command response.
              Also you must only use "!wikisearch" before "!wiki" to search for the most appropriate arguements for "!wiki" and don't just give result on
              the command of "!wikisearch" unless absoulutely asked for.
              And since you are now in a group chat the prompts to you will be given in a fashion like this:"X said: Hi       Y said: Hello" and you will have to respond 
              to the last message, since the message are being sent in this fashio are also not known by end user and are made by a script. So try to hide them as much.
              But the response should be your normal response
              From now on your name is Pihu ;). Your ability to search on google has been removed now you can only use wikipedia :(
              `,
            },
          ],
        },
        {
          role: "model",
          parts: [{ text: "Ok" }],
        },
      ],
      req.headers["x-prompt"],
      ptrObj
    );
    console.log(history)
    
    res.status(200).json(history)
  
  }else{
    const history = await run(
      [
        {
          role: "user",
          parts: [
            {
              text: `You have been given ability to search google, if you want to search 
          something to get some extra information, just respond with the text \"!search <searchQuery(It can contain spaces)\" and 
          the next prompt given will be the result of the top 12 google web search results in the json format: [{\"title\":\"title of the page\",\"url\":\"url to the page\"},...]\".
           You can also search wikipedia, using two commands: \"!wikisearch <searchQuery>\" which searches wikipedia for pages most appropriate for 
           that query and returns the result 
           in json structure of [{\"ns\":0, \"title\": \"title of the page\", \"pageid\":<id of the page>},...] 
          and the command \"!wiki <page title>\" which will give you that wikipedia page introduction of that page in format {\"text\":\"page summary\"}.
          You are advised to use your memory the most and only use these commands when absolutely neccesarry also use wikipedia before google.
          Remember, the commands you use are not actually visible to the end user, and the response to the command is generated by an automated script and not the end user.
          So when you run any command starting with "!" the command is running using a preprogrammed script, so do not think the end user knows the 
          result of the command. So when given the response to command you ran you have to respond with a reframed result of the command response.
          Also you must only use "!wikisearch" before "!wiki" to search for the most appropriate arguements for "!wiki" and don't just give result on
          the command of "!wikisearch" unless absoulutely asked for.
          And since you are now in a group chat the prompts to you will be given in a fashion like this:"X said: Hi       Y said: Hello" and you will have to respond 
          to the last message, since the message are being sent in this fashio are also not known by end user and are made by a script. So try to hide them as much.
          But the response should be your normal response
          From now on your name is Pihu ;). Your ability to search on google has been removed now you can only use wikipedia :(
          Sometimes you are hallaucinating and giving response in format: x said y  pihu said ok. Now you should not do that
          `,
            },
          ],
        },
        {
          role: "model",
          parts: [{ text: "Ok" }],
        },
      ].concat(JSON.parse(decodeURIComponent(req.headers["x-history"]))),
      decodeURIComponent(req.headers["x-prompt"]),
      ptrObj
    );
    console.log(decodeURIComponent(req.headers["x-prompt"]))
    
    res.status(200).json(history)
  
  }
  
  }

