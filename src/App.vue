<script setup>
import TournamentBracket from './components/TournamentBracket.vue';
import { createBracketData } from './data/createBracketData';

const bracketData = createBracketData();
</script>

<template>
  <TournamentBracket :data="bracketData" />
</template>
