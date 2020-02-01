<template>
  <div id="app">
    <CubeCrash/>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import CubeCrash from './components/CubeCrash.vue';

@Component({
  components: {
    CubeCrash,
  },
})
export default class App extends Vue {}
</script>

<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  min-height: 98vh;
  display: flex;
  justify-content: center;
  flex-direction: column;
}
</style>
