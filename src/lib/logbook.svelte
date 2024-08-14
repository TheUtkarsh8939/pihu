<script lang="ts">
    import Nav from "./components/nav.svelte"
    import { config } from "./config";
    import { initializeApp } from "firebase/app";
    import { getFirestore,collection,query,where,getDocs } from "firebase/firestore";
    let theme = ""
    let data: any[] = []
    initializeApp(config)
    const fs = getFirestore()
    const q = query(collection(fs,"logbook"),where("team","==","alpha"));
    getDocs(q).then(snap=>{
        snap.forEach(doc=>data = [...data,{time:doc.data().time,data:doc.data().data,date:doc.data().date.replaceAll(" ","/")}])
        data.sort((a,b)=>{
            return a.time-b.time
        })
    });
    $:console.log(data)
        
    
</script>
<main class="{theme}">
<Nav bind:theme></Nav>
<div class="flex overflow-y-scroll overflow-x-hidden w-screen flex-col text-black dark:text-white bg-white dark:bg-black h-[calc(90vh-61px)]">
    <div class="row flex w-screen dark:border-b-white border-b-black border-b-[2px]">
        <span class="text-bold text-2xl w-1/4 text-center">Date</span>
        <div class="bg-black dark:bg-white h-full w-[2px]"></div>
        <span class="text-bold text-2xl text-center w-3/4">Title</span>
        
    </div>
    {#each data as doc}
    <div class="row flex w-screen dark:border-b-white border-b-black border-b-[1px] h-auto">
        <span class="text-bold min-md:text-xl text-[4vw] flex items-center justify-center w-1/4 text-center">{doc.date}</span>
        <div class="bg-black dark:bg-white h-full w-[1px]"></div>
        <span class="text-bold text-xl h-auto text-center w-3/4 flex flex-wrap text-pretty">{doc.data}</span>
        
    </div>
    {/each}
</div>

<footer class="{theme} dark:text-gray-400 h-[10vh] dark:bg-black body-font">

    <div class="dark:bg-black bg-opacity-75">
      <div class="container items-center mx-auto py-4 px-5 flex flex-wrap flex-col">
        <p class="text-gray-400 text-sm text-center sm:text-left"> Phiu 2024, by ASUPG and TheUtkarsh8939
        </p>
        <span class="flex gap-1">Icons by <a href="https://icons8.com" class="text-gray-300">Icons8</a></span>
            </div>
    </div>
  </footer>
</main>