<template>
  <img alt="Vue logo" src="@/assets/logo.png" />
  <svg-icon name="help" style="color: red; width: 100px; height: 100px;"></svg-icon>
  <HelloWorld msg="Hello Vue 3 + Vite" />
  <hr />
  <table class="table border text-overflow-ellipsis" style="width: 200px; margin: 0 auto;">
    <tr>
      <th style="flex-grow: 0.5;">序号</th>
      <th>内容</th>
    </tr>
    <tr>
      <td style="flex-grow: 0.5;">1</td>
      <td>你好世界</td>
    </tr>
  </table>
  <hr />
  <router-view />
</template>

<script setup>
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
import HelloWorld from './components/HelloWorld.vue'
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  width: 100%;
  //text-align: center;
  //color: #2c3e50;
  //margin-top: 60px;
}
</style>
