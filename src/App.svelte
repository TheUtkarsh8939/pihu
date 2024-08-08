<script>
  import Router from "svelte-spa-router"
  import Login from "./lib/login.svelte"
  import Main from "./lib/main.svelte"
  const routes = {
    "/login": Login,
    "/":  Main,
  }
  if(localStorage.getItem("userData") === undefined|| localStorage.getItem("userData") === ""){
    window.location.href = "/#/login"
  }
</script>
<Router {routes}/>