<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import BracketMatch from './BracketMatch.vue';
import FinalCard from './FinalCard.vue';
import MatchPickerModal from './MatchPickerModal.vue';
import { sampleBracketData } from '../data/sampleBracketData';

const BOARD_WIDTH = 430;
const BOARD_HEIGHT = 746;
const MATCH_SLOTS = [
  { key: 'top1', legacyKey: 'top-1', phase: '上半区', round: '1/8 决赛', x: 5, y: 18, width: 96, branchPosition: 'bottom' },
  { key: 'top2', legacyKey: 'top-2', phase: '上半区', round: '1/8 决赛', x: 111, y: 18, width: 96, branchPosition: 'bottom' },
  { key: 'top3', legacyKey: 'top-3', phase: '上半区', round: '1/8 决赛', x: 223, y: 18, width: 96, branchPosition: 'bottom' },
  { key: 'top4', legacyKey: 'top-4', phase: '上半区', round: '1/8 决赛', x: 329, y: 18, width: 96, branchPosition: 'bottom' },
  { key: 'topQuarter1', legacyKey: 'top-q1', phase: '上半区', round: '1/4 决赛', x: 14, y: 91, width: 184, branchPosition: 'bottom', wideTeams: true },
  { key: 'topQuarter2', legacyKey: 'top-q2', phase: '上半区', round: '1/4 决赛', x: 232, y: 91, width: 184, branchPosition: 'bottom', wideTeams: true },
  { key: 'topSemi', legacyKey: 'top-sf', phase: '上半区', round: '半决赛', x: 76, y: 161, width: 278, branchPosition: 'bottom', featured: true },
  { key: 'bottomSemi', legacyKey: 'bottom-sf', phase: '下半区', round: '半决赛', x: 76, y: 391, width: 278, branchPosition: 'top', featured: true },
  { key: 'bottomQuarter1', legacyKey: 'bottom-q1', phase: '下半区', round: '1/4 决赛', x: 14, y: 475, width: 184, branchPosition: 'top', wideTeams: true },
  { key: 'bottomQuarter2', legacyKey: 'bottom-q2', phase: '下半区', round: '1/4 决赛', x: 232, y: 475, width: 184, branchPosition: 'top', wideTeams: true },
  { key: 'bottom1', legacyKey: 'bottom-1', phase: '下半区', round: '1/8 决赛', x: 5, y: 552, width: 96, branchPosition: 'top' },
  { key: 'bottom2', legacyKey: 'bottom-2', phase: '下半区', round: '1/8 决赛', x: 111, y: 552, width: 96, branchPosition: 'top' },
  { key: 'bottom3', legacyKey: 'bottom-3', phase: '下半区', round: '1/8 决赛', x: 223, y: 552, width: 96, branchPosition: 'top' },
  { key: 'bottom4', legacyKey: 'bottom-4', phase: '下半区', round: '1/8 决赛', x: 329, y: 552, width: 96, branchPosition: 'top' },
];
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
    type: [Object, Array],
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
  connectorStyle: {
    type: String,
    default: 'straight',
    validator: (value) => ['straight', 'curve'].includes(value),
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
const normalizedConnectorStyle = computed(() =>
  props.connectorStyle === 'curve' ? 'curve' : 'straight',
);

const isSlotMatch = (match, slot) => {
  const matchKeys = [match.slot, match.position, match.id].filter(Boolean);
  return matchKeys.includes(slot.key) || matchKeys.includes(slot.legacyKey);
};

const getMatchSource = (matches, slot, index) => {
  if (!matches) {
    return null;
  }

  if (Array.isArray(matches)) {
    return matches.find((match) => isSlotMatch(match, slot)) ?? matches[index] ?? null;
  }

  return matches[slot.key] ?? matches[slot.legacyKey] ?? null;
};

const normalizeMatchSource = (match) => ({
  ...match,
  businessId: match.businessId ?? match.id ?? null,
  teamIds: Array.isArray(match.teamIds) ? match.teamIds : [],
  scores: Array.isArray(match.scores) ? match.scores : [],
  winnerId: match.winnerId ?? null,
});

const bracketMatchesWithLayout = computed(() =>
  MATCH_SLOTS
    .map((slot, index) => {
      const sourceMatch = getMatchSource(bracketMatches.value, slot, index);

      if (!sourceMatch) {
        return null;
      }

      const normalizedMatch = normalizeMatchSource(sourceMatch);

      return {
        ...normalizedMatch,
        id: slot.key,
        slot: slot.key,
        phase: slot.phase,
        round: slot.round,
        x: slot.x,
        y: slot.y,
        width: slot.width,
        branchPosition: slot.branchPosition,
        wideTeams: Boolean(slot.wideTeams),
        featured: Boolean(slot.featured),
      };
    })
    .filter(Boolean),
);

const toPublicMatch = (match) => {
  const { id, position, x, y, width, branchPosition, wideTeams, featured, ...publicMatch } = match;
  return publicMatch;
};

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
  emit('select-match', toPublicMatch(match));

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
              v-for="match in bracketMatchesWithLayout"
              :key="match.id"
              :match="match"
              :teams="bracketTeams"
              :disabled="!interactive"
              :default-team-logo="fallbackTeamLogo"
              :connector-style="normalizedConnectorStyle"
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
