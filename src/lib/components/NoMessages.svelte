<script>
    export let hidden 
    let display
    $: display = hidden ? "hidden":"flex"
</script>
<div class="nmsg text-white h-[85%] w-full px-4 {display} flex-col items-center justify-center pb-40 absolute">

    <img src="/logo.png" alt="Pihu logo" class="size-40">
    <h2 class="text-xl flex text-center font-[cursive]">Be the first one of the group to send a message</h2>
</div>