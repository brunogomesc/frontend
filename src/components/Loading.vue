<template>
  <div class="loading"></div>
</template>

<script>
export default {
    name: "Loading",
}
</script>

<style lang="less" scoped>
    .loading {
        width: 50px;
        height: 50px;
        border: 3px solid @orange-black;
        border-radius: 50%;
        border-top-color: @orange-light;
        animation: spin 1s linear infinite;
        margin: auto;
    }

    @keyframes spin {
        to {
            transform: rotate(360deg);
        }
    }
</style>