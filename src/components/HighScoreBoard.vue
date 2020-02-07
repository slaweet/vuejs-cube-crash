<template>
  <div class="highScores" v-show="scores.lenght !== 0">
    <h3>High Scores</h3>
    <table>
      <tr><th>Rank</th><th>Score</th></tr>
    <tr v-for="(score, i) in scores"
      :class="score === currentScore ? 'currentScore' : ''"
      :key="i">
      <td>{{i + 1}}.</td><td>{{score}}</td>
    </tr>
    </table>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({ })
export default class HighScoreBoard extends Vue {
  @Prop() scores:number[];

  @Prop() currentScore:number;
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.highScores {
  text-align: left;
  margin: 20px;
  padding: 0 20px;
  display: inline-block;
  position: relative;
}

.currentScore {
  font-weight: bold;
}

.currentScore td:first-child::before {
  position: absolute;
  left: -5px;
  content: '--> '
}

table {
  width: 100%;

  tr {
    border-top: 1px solid gray;
  }
}
</style>
