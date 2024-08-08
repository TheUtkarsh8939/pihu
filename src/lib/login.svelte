<script lang="ts">
  import { initializeApp } from "firebase/app";
  import {getFirestore, getDoc, doc} from "firebase/firestore"
  import {config} from "./config.ts"
  import Nav from "./components/nav.svelte";
  let theme: string

  initializeApp(config)
  let wrong = false
  const fs = getFirestore()
  let code: string  
  async function login(){
    const userRef = doc(fs,"users",code)
    const docSnap = await getDoc(userRef)
    if (!docSnap.exists()){
      wrong = true
    }else{
      wrong=false
      const userData = {
        //@ts-ignore
        name: docSnap.data().name,
        //@ts-ignore
        code: code,
        //@ts-ignore
        team: docSnap.data().teamid
      }
      localStorage.setItem("userData", JSON.stringify(userData))
      window.location.href="/#/"
    }
  }
  
</script>

<main class="{theme} dark:bg-black flex flex-col h-screen m-0 p-0 overflow-x-hidden">
  <Nav bind:theme />
  <div class="absoulute h-screen w-screen flex justify-center items-center">
  <div class="border h-auto w-[300px] max-[320px]:w-[93.75%] p-[1px] bg-black border-none dark:bg-[linear-gradient(135deg,#f005fc,#7405fc)] rounded-xl flex items-center justify-center">
    <div class="form h-[400px] bg-white dark:bg-black flex flex-col items-center w-full rounded-xl dark:text-white">
        <h1 class="text-3xl">Login</h1>
        <h6 style="visibility:{wrong ? "visible":"hidden"}"class="text dark:text-red-500 text-red-600">!!Wrong or Blank Code!!</h6>
        <div class="flex w-full h-[90%] flex-col items-center justify-evenly">
          <div class="p-[1px] rounded-xl bg-black flex dark:bg-[linear-gradient(135deg,#f005fc,#7405fc)] m-0 max-w-72 w-[80%] h-auto">
            <input type="text" placeholder="Your Name?" class="bg-white h-10 w-full dark:bg-black rounded-xl p-1">
          </div>
        <div class="border p-[1px] bg-black border-none h-auto dark:bg-[linear-gradient(135deg,#f005fc,#7405fc)] rounded-xl max-w-72 w-[80%] ">
          <input type="text" placeholder="Your Code?" class="bg-white h-10 w-full dark:bg-black rounded-xl p-1" bind:value={code}>

        </div>
        <div class="border p-[1px] bg-black border-none h-auto dark:bg-[linear-gradient(135deg,#f005fc,#7405fc)] rounded-xl max-w-24 w-24 ">
          <button class="bg-white h-10 w-full dark:bg-black rounded-xl p-1 text-xl" on:click={login}>Login</button>

        </div>
        </div>
      </div>
  </div>

  </div>
</main>
<footer class="{theme} dark:text-gray-400 dark:bg-black body-font">

  <div class="dark:bg-black bg-opacity-75">
    <div class="container items-center mx-auto py-4 px-5 flex flex-wrap flex-col">
      <p class="text-gray-400 text-sm text-center sm:text-left"> Phiu 2024, by ASUPG and TheUtkarsh8939
      </p>
      <span class="flex gap-1">Icons by <a href="https://icons8.com" class="text-gray-300">Icons8</a></span>
          </div>
  </div>
</footer>

