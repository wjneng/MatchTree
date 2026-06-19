<script setup>
import { computed, ref } from 'vue';
import BracketMatch from './BracketMatch.vue';
import FinalCard from './FinalCard.vue';
import MatchPickerModal from './MatchPickerModal.vue';
import { sampleBracketData } from '../data/sampleBracketData';

const props = defineProps({
  data: {
    type: Object,
    default: () => sampleBracketData,
  },
  teams: {
    type: Object,
    default: null,
  },
  matches: {
    type: Array,
    default: null,
  },
  finalMatch: {
    type: Object,
    default: null,
  },
  title: {
    type: String,
    default: '淘汰赛对阵',
  },
  subtitle: {
    type: String,
    default: '2025 冠军杯',
  },
  showHeader: {
    type: Boolean,
    default: true,
  },
  interactive: {
    type: Boolean,
    default: true,
  },
  modalEnabled: {
    type: Boolean,
    default: true,
  },
});

const emit = defineEmits(['select-match']);

const activeMatch = ref(null);

const bracketTeams = computed(() => props.teams ?? props.data.teams ?? {});
const bracketMatches = computed(() => props.matches ?? props.data.matches ?? []);
const bracketFinalMatch = computed(() => props.finalMatch ?? props.data.finalMatch ?? {});

const openMatchModal = (match) => {
  emit('select-match', match);

  if (!props.interactive || !props.modalEnabled) {
    return;
  }

  activeMatch.value = match;
};
</script>

<template>
  <main class="bracket-page">
    <section class="bracket-phone" aria-label="淘汰赛对阵图">
      <header v-if="showHeader" class="bracket-header">
        <div>
          <h1>{{ title }}</h1>
          <p>{{ subtitle }}</p>
        </div>
        <strong>{{ bracketFinalMatch.date }}</strong>
      </header>

      <section class="bracket-viewport" aria-label="对阵树">
        <div class="bracket-board">
          <BracketMatch
            v-for="match in bracketMatches"
            :key="match.id"
            :match="match"
            :teams="bracketTeams"
            :disabled="!interactive"
            @select="openMatchModal"
          />

          <FinalCard :final-match="bracketFinalMatch" />
        </div>
      </section>

      <MatchPickerModal
        v-if="activeMatch && interactive && modalEnabled"
        :match="activeMatch"
        :teams="bracketTeams"
        @close="activeMatch = null"
      />
    </section>
  </main>
</template>
