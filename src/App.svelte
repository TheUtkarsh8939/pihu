<script>
  import Router from "svelte-spa-router"
  import Login from "./lib/login.svelte"
  import Main from "./lib/main.svelte"
  import Logbook from "./lib/logbook.svelte"
  const routes = {
    "/login": Login,
    "/logbook":Logbook,
    "/":  Main,
  }
  if(localStorage.getItem("userData") === undefined|| localStorage.getItem("userData") === ""){
    window.location.href = "/#/login"
  }
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js')
    .then(() => {
        console.log('Service Worker registered successfully.');
    })
    .catch(error => {
        console.error('Service Worker registration failed:', error);
    });
}
</script>
<Router {routes}/>