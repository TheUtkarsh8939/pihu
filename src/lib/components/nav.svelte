<script lang="ts">

  const localTheme = localStorage.getItem("theme");

  let checkbox: boolean = localTheme === "dark" ? true : false;
  export let theme: string | null = localTheme;

  $: theme = !checkbox ? "" : "dark";
  $: localStorage.setItem("theme", theme);
</script>

<header
  class="text-gray-600 sticky dark:bg-black dark:text-white bg-white body-font justify-between flex px-2"
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
  <label class="inline-flex items-center cursor-pointer">
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
</header>
<div class="rainbow"></div>

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
</style>
