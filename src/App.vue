<script setup>
import TournamentBracket from './components/TournamentBracket.vue';
import { createBracketData } from './data/createBracketData';

const bracketData = createBracketData();
</script>

<template>
  <TournamentBracket
    :data="bracketData"
    title="2026 世界杯"
    subtitle="淘汰赛对阵"
  />
</template>
