<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import BracketMatch from './BracketMatch.vue';
import FinalCard from './FinalCard.vue';
import MatchPickerModal from './MatchPickerModal.vue';
import { sampleBracketData } from '../data/sampleBracketData';

const BOARD_WIDTH = 430;
const BOARD_HEIGHT = 746;
const DEFAULT_TEAM_LOGO = `data:image/svg+xml,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <path fill="#f7f8fb" stroke="#cfd4dd" stroke-width="4" d="M32 4 52 12v17c0 14-8 24-20 31C20 53 12 43 12 29V12L32 4Z"/>
  <path fill="#e52c25" d="M32 13 43 18v10c0 8-4 15-11 20-7-5-11-12-11-20V18l11-5Z"/>
  <path fill="#ffffff" d="M24 27h16v5H24zM29 21h6v22h-6z"/>
</svg>
`)}`;

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
    default: '2026 世界杯',
  },
  subtitle: {
    type: String,
    default: '淘汰赛对阵',
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
  defaultTeamLogo: {
    type: String,
    default: '',
  },
});

const emit = defineEmits(['select-match']);

const activeMatch = ref(null);
const bracketViewport = ref(null);
const boardScale = ref(1);

let resizeObserver = null;

const bracketTeams = computed(() => props.teams ?? props.data.teams ?? {});
const bracketMatches = computed(() => props.matches ?? props.data.matches ?? []);
const bracketFinalMatch = computed(() => props.finalMatch ?? props.data.finalMatch ?? {});
const fallbackTeamLogo = computed(() => props.defaultTeamLogo || DEFAULT_TEAM_LOGO);

const updateBoardScale = () => {
  const viewportWidth = bracketViewport.value?.clientWidth || BOARD_WIDTH;
  boardScale.value = Math.min(1, viewportWidth / BOARD_WIDTH);
};

const scaledBoardStyle = computed(() => ({
  width: `${BOARD_WIDTH * boardScale.value}px`,
  height: `${BOARD_HEIGHT * boardScale.value}px`,
}));

const boardTransformStyle = computed(() => ({
  transform: `scale(${boardScale.value})`,
}));

onMounted(() => {
  updateBoardScale();

  if (typeof ResizeObserver === 'undefined') {
    window.addEventListener('resize', updateBoardScale);
    return;
  }

  resizeObserver = new ResizeObserver(updateBoardScale);

  if (bracketViewport.value) {
    resizeObserver.observe(bracketViewport.value);
  }
});

onBeforeUnmount(() => {
  resizeObserver?.disconnect();
  window.removeEventListener('resize', updateBoardScale);
});

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

      <section ref="bracketViewport" class="bracket-viewport" aria-label="对阵树">
        <div class="bracket-scale" :style="scaledBoardStyle">
          <div class="bracket-board" :style="boardTransformStyle">
            <BracketMatch
              v-for="match in bracketMatches"
              :key="match.id"
              :match="match"
              :teams="bracketTeams"
              :disabled="!interactive"
              :default-team-logo="fallbackTeamLogo"
              @select="openMatchModal"
            />

            <FinalCard :final-match="bracketFinalMatch" />
          </div>
        </div>
      </section>

      <MatchPickerModal
        v-if="activeMatch && interactive && modalEnabled"
        :match="activeMatch"
        :teams="bracketTeams"
        :default-team-logo="fallbackTeamLogo"
        @close="activeMatch = null"
      />
    </section>
  </main>
</template>
