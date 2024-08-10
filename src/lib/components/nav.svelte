<script lang="ts">
  import { link } from "svelte-spa-router";


  const localTheme = localStorage.getItem("theme");

  let checkbox: boolean = localTheme === "dark" ? true : false;
  export let theme: string | null = localTheme;

  $: theme = !checkbox ? "" : "dark";
  $: localStorage.setItem("theme", theme);
    let dropdown: HTMLDivElement
    let visible = false
    
    
</script>

<header
  class="text-gray-600 sticky dark:bg-black dark:text-white bg-white body-font justify-between items-center flex px-2"
>
  <div class="container h-[60px] mx-auto flex items-center">
    <a
      href="/"
      class="flex title-font font-medium items-center text-black dark:text-white"
    >
      <img src="/logo.png" alt="" class="size-10 rounded-full" />
      <span class="ml-3 text-xl">Pihu</span>
    </a>
  </div>
  <button on:click={() => {visible = !visible;dropdown.style.opacity = visible? "1":"0"}} class="w-10 h-10 flex flex-col justify-evenly">
    <div class="w-full h-1 rounded-2xl bg-black dark:bg-white"></div>
    <div class="w-full h-1 rounded-2xl bg-black dark:bg-white"></div>
    <div class="w-full h-1 rounded-2xl bg-black dark:bg-white"></div>
  </button>
</header>
<div class="rainbow"></div>
<div bind:this={dropdown} class="dropdown h-auto flex text-black dark:text-white flex-col pr-0 gap-[1px] p-[1px] max-w-[250px] w-screen rounded-bl-lg bg-black dark:bg-[linear-gradient(135deg,#f005fc,#7405fc)] right-0 absolute top-[61px]" id="dropdown">
  <div class="h-[60px] grid place-items-center text-2xl w-full dark:bg-black bg-white">
    <a class="flex items-center gap-2" href="/logbook" use:link>
      <img alt="" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAABFElEQVR4nO2YMWrDQBBFp1BuYJGkcpUD2JAihDlEIKR164Au48K+SIhbx3sEJyC2EFYpR10KGxf2GIlIRYiLxCPDoP/hw7KC2X3M/l0QEQRBEKQh9rno+vOr/57Ne4vMFWPt+tQ0wO3HSoJXLxdTX47NAXTeEqGXuHRnltgDCKa+Big6YQ6Avjdf+awATuRk/wTQqMmtA+AT5o4BaK1DAPAGOuCsZ8BZB2CEOMYtxAixIMSCl1jaeo066w+Zsw7A1o8QAyBGiF0rQ8zWf6swAHJ0gP96hKJrEQ0/3+xl8LCVcLKsuxCOl+Vc8U1rHWoKoPKwu5PLUSpXo7Qca9enpgEKP91t5PF+rV43+g0AgiAIon/oAHTSnrssFz1QAAAAAElFTkSuQmCC">
      Logbook
    </a>
  </div>
  <div class="h-[60px] grid place-items-center rounded-bl-lg w-full dark:bg-black bg-white">
    <label class="text-2xl w-full inline-flex justify-around items-center cursor-pointer">
      Theme
      <input
        type="checkbox"
        bind:checked={checkbox}
        value=""
        class="sr-only peer"
      />
      <div
        class="relative w-11 h-6 bg-gray-50 rounded-full peer border-gray-300 border-2 dark:border-0 box-content peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-400 peer-checked:bg-gray-800"
      ></div>
    </label>
  </div>

</div>
<style>
  .rainbow {
    height: 1px;
    width: 100%;
    background: linear-gradient(
      90deg,
      red,
      orange,
      yellow,
      lime,
      green,
      aqua,
      blue,
      purple,
      violet
    );
  }
  .dropdown{
    transition: all 300ms ease-in-out;
    opacity: 0;
  }
</style>
