<script lang="ts">
  import Nav from "./components/nav.svelte";
  import SendFirstMessage from "./components/NoMessages.svelte";
  import { initializeApp } from "firebase/app";
  import { config, aiName } from "./config";
  import { scrollSmoothlyToBottom } from "./utility";
  import {
    getFirestore,
    onSnapshot,
    collection,
    setDoc,
    query,
    doc,
  } from "firebase/firestore";
  import { onMount } from "svelte";
  if (
    localStorage.getItem("userData") === undefined ||
    localStorage.getItem("userData") === ""
  ) {
    window.location.href = "/#/login";
  }
  interface userData {
    team: string;
    name: string;
    code: string;
  }
  interface parts {
    text: string;
  }
  interface message {
    role: string;
    parts: parts[];
  }
  let msgBox: HTMLDivElement;

  const app = initializeApp(config);
  const fs = getFirestore(app);
  let theme: string;
  let userDataJson = localStorage.getItem("userData");
  let hidden = false
  userDataJson ||= "{}";
  if (userDataJson == "") {
    window.location.href = "/#/login?";
  }
  const userData: userData = JSON.parse(userDataJson);
  const q = query(collection(fs, userData.team));
  let messages: any[] = [];
  function toCompatibleHistory(messageArr: message[]) {
    let obj: message[] = [];
    let textStr = "";
    messageArr.forEach((message) => {
      console.log("Message Temp str ", textStr);
      if (message.role == "Pihu") {
        if (textStr !== "") {
          obj.push({
            role: "user",
            parts: [{ text: textStr } as parts],
          });
        }
        obj.push({
          role: "model",
          parts: message.parts,
        } as message);
      } else {
        textStr += message.role + " said: " + message.parts[0].text + `     `;
      }
    });

    return { obj, textStr };
  }

  onSnapshot(q, (snap) => {
    msgBox.innerHTML = "";
    messages = [];
    let snapSort: any[] = [];
    snap.forEach((doc) => {
      snapSort.push(doc);
    });

    snapSort.sort((a, b) => parseInt(a.id) - parseInt(b.id));
    snapSort.forEach((doc) => {
      hidden=true
      messages.push({
        role: doc.data().sender,
        parts: [
          {
            text: doc.data().text,
          } as parts,
        ],
      } as message);

      const message = doc.data();
      let single;
      if (
        message.sender != userData.name &&
        !message.sender.startsWith("Pihu")
      ) {
        single = `        <div
          class="borde w-1/2 min-w-20 float-right rounded-3xl mx-7 max-w-60 min-w-32 dark:bg-[linear-gradient(135deg,#f005fc,#7405fc)] bg-black p-[1px] h-auto"
        >
          <div
            class="p-5 msg w-full h-auto dark:bg-black bg-white rounded-3xl dark:text-white"
          >
            <h2 class="text-l font-bold ">${message.sender}
              </h2>
            ${message.text}
          </div>
        </div>`;
      } else if (message.sender.startsWith("Pihu")) {
        single = `        <div
          class="borde w-1/2 min-w-20 float-right rounded-3xl mx-7 max-w-60 min-w-32 dark:bg-[linear-gradient(135deg,#f005fc,#7405fc)] bg-black p-[1px] h-auto"
        >
          <div
            class="p-5 msg w-full h-auto dark:bg-black bg-white rounded-3xl dark:text-white"
          >
            <h2 class="text-l font-bold flex items-center">${message.sender}
              <img src="/logo.png" class="size-5 rounded-full"/>
            </h2>
            ${message.text}
          </div>
        </div>`;
      } else {
        single = `        <div
          class="borde w-1/2 min-w-20 ml-auto float-right rounded-3xl mx-7 max-w-60 min-w-32 dark:bg-[linear-gradient(135deg,#f005fc,#7405fc)] bg-black p-[1px] h-auto"
        >
          <div
            class="p-5 msg w-full h-auto dark:bg-black bg-white rounded-3xl dark:text-white"
          >
            <h2 class="text-lg font-bold">${message.sender}</h2>
            ${message.text}
          </div>
        </div>`;
      }
      msgBox.innerHTML += single;
    });
  });
  let messageText = "";

  const send = async () => {
    const message = messageText;
    messageText = "";
    let username = userData.name;

    const docData = {
      sender: username,
      text: message,
    };
    console.log(messages.length);
    const docRef = doc(fs, userData.team, (messages.length + 1).toString());
    await setDoc(docRef, docData);
    msgBox.scrollTop = msgBox.scrollHeight;
    if (message.toLowerCase().startsWith(aiName.toLowerCase())) {
      const history = toCompatibleHistory(messages);
      console.log(JSON.stringify(history));
      console.log("Message sending to pihu");
      const response = await fetch("/api/ai", {
        headers: {
          "x-prompt": encodeURIComponent(message),
          "x-history": encodeURIComponent(JSON.stringify(history.obj)),
        },
        method: "GET",
      });
      const aiArr = await response.json();
      const ai = aiArr[aiArr.length - 1].parts[0].text;
      const docData = {
        sender: "Pihu ",
        text: ai,
      };
      console.log(messages.length);
      const docRef = doc(fs, userData.team, (messages.length + 1).toString());
      await setDoc(docRef, docData);
      msgBox.scrollTop = msgBox.scrollHeight;
    }
  };
  onMount(() => (msgBox.scrollTop = msgBox.scrollHeight));
</script>

<main class="{theme} h-screen w-screen dark:bg-black">
  <Nav bind:theme />
  <div class="cont h-[calc(100%-61px)]">
    <SendFirstMessage bind:hidden/>

    <div
      bind:this={msgBox}
      id="msgBox"
      class="msgs flex flex-col gap-7 h-[85%] overflow-y-scroll pt-10"
    >
    
    </div>
    <div class="input w-full h-[15%] flex items-center justify-center">
      <div
        class="rounded-3xl p-[1px] h-auto flex items-center justify-center dark:bg-[linear-gradient(135deg,#f005fc,#7405fc)] bg-black max-w-[500px] w-[80%]"
      >
        <input
          type="text"
          placeholder="Type a Message "
          class="pl-2 outline-none dark:text-white typeMsg bg-white dark:bg-black w-full h-10 rounded-3xl"
          bind:value={messageText}
        />
      </div>
      <button class="ml-2" on:click={send}>
        <img
          class=" size-10 rotate-45 hidden dark:block"
          alt="Send"
          src="data:image/png;base64,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"
        />
        <img
          alt="send"
          class="size-7 dark:hidden"
          src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAAEm0lEQVR4nNWaaagVZRjHf6OlZgu2p5Vat0zq2EZGUElFRNBGQVAQQVG3PpzqY2UEQRDVJyOEpA9FRdsxaCOKyrqVtCmYtggtlDdtN1tuVuY98cB/4OFl9nvOnLl/GO6Zmeed933eef7PNhcmNy4GPgHeYZLiNGA10NWxmUmGo4FnnQLj+vsEkwQHAyuAHVr4VuBm4EWdX0/DsYcW/LsW/I8U2h+IgB90fSENxa7AsFvoTuBp4HAn09K976RUoxABlwJfOB68CpyQINtuKj/OBtY6BT4EzsqQ7zSNH2YiLzgFvpFZTckY0yh+mL0/7lzoj8ANwLRAbhdgenCtEfzYD1gmD2SL+RO4E9grQfYIYIMC3vSm8GN34DbgNy3CYsIDwOwU+XMUL7pKQ6YOmh9m61dqV70nWpQxZtgFv7+B4wfND/NE650C7wJLMuRnAA85eTtuHCQ/TgFG3GI+U3yIctKQ9wMlXkoYUws/FioCx55os8zEPE8WTtUOd93xPXBggmxf+WG7+SDwnybZBiwFZhYYe53zYL+6lMTMMkQkN91zfoRJ3b9K6pJ2MoS9pbvdG3gY2KTfdj0JPedHmNSNy6SGSsSSVRq7XV7NgqOdr0kIij3nR1pSd2KJZ5gr/VpjR4HFwNU6/wNYkDG2J/wIk7qPpVQZXAaMafzbMsEhZ5pXZIydcPwIk7pNMisfafMwNeDDCpmnHe/p2lMF1lGJH3M14U494BcR24JWGVgO9byL0te4e/fq+pcpudaE+LGvdm+7Bo7pfBblsUDB0J6zRYEyxhnapB3B9QnzY6Z2fFtQXs6nGs5zz1qrN+y91hbdsznzEBXhR1pSd2xFBSItLjbJx4DdgvvP6d6bBbnWKsKPN5wCozlJXZEA+YxL08OEz9u6Reg5BZ/bLsKP14Mcx5S5TwpllZshhlQE2TN+As5MkFkk7lkAPb/EsztF+XEMcAewMVDqZ+AR4AK5yjQscTnQR8BhCTIzdK+rjSqKqGr8iJX6NFBqq1PKl53DyrHiWGCVYBKWS2ZDwJk8tHqRX7WkVGwy8WHe6FHgSefhbs2Y6EKZ05j6t2XQ7nX9YeZyk1r4cb3RVXpxUca4OeKMyV5bYd5OP+sP626s0wSWP6XBnMVrkltZYZ6oX/WHxxpNcHKGzC3OE1rGUBatOurzUU0yL+X+YjkBqxpPrzhHu9/1+RQtcjylCDoU+FaLWJdRKOWh0+/+1QEu8IXYW7VKXDl29UEmbHs2gh/HaQLrWXlMc+Q2Dp3kksOXBxE/8nCuW5w3t9gUvgIO0vWjXEL6Sgll2nX0r67SJNYVjLHMpTW2+LAuiTkzouQyD506+rtLNcldgZv9S822JBzpPN1bOcpEdfV379ck9j3jcpHa0pRLcsbNl9nFzYc9U+RadfV3V2qi5arDk5rNaZinGr2rdCepVm/XwQ+C/zqw456S4+e63tjqBGU6dfADt6NdZcBlCjAfND93rnqfQXz/iJtsqyoEOo9DnDL2SWFW3d8/RtRYq9IiSurkb3Rv5va6+NEPzHYV6Xhd/Ohn/rbecW/g388nAlPmA7WoSvHjfwQeuXtG9wdPAAAAAElFTkSuQmCC"
        />
      </button>
    </div>
  </div>
</main>
