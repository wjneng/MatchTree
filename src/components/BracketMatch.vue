<script setup>
import { computed } from 'vue';
import TeamBadge from './TeamBadge.vue';

const props = defineProps({
  match: {
    type: Object,
    required: true,
  },
  teams: {
    type: Object,
    required: true,
  },
  selected: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});

defineEmits(['select']);

const matchTeams = computed(() =>
  props.match.teamIds.map((teamId) => props.teams[teamId]).filter(Boolean),
);

const winnerIndex = computed(() => props.match.teamIds.indexOf(props.match.winnerId));

const branchPosition = computed(() => (props.match.phase === '下半区' ? 'top' : 'bottom'));

const branchViewBox = computed(() => `0 0 ${props.match.width} 26`);

const teamPositionStyle = (index) => {
  if (!props.match.wideTeams) {
    return {};
  }

  const x = index === 0 ? 39 : props.match.width - 39;
  return {
    left: `${x}px`,
  };
};

const branchPaths = computed(() => {
  const sideColumnWidth = (props.match.width - 40) / 2;
  const leftLogoX = props.match.featured
    ? 30
    : props.match.wideTeams
      ? 39
      : 3 + sideColumnWidth / 2;
  const rightLogoX = props.match.featured || props.match.wideTeams
    ? props.match.width - leftLogoX
    : props.match.width - leftLogoX;
  const centerX = (leftLogoX + rightLogoX) / 2;

  if (branchPosition.value === 'top') {
    return {
      leftBase: `M${leftLogoX} 24 V10 H${centerX}`,
      rightBase: `M${rightLogoX} 24 V10 H${centerX}`,
      pendingLine: `M${centerX} 10 V2`,
      leftWin: `M${leftLogoX} 24 V10 H${centerX} V2`,
      rightWin: `M${rightLogoX} 24 V10 H${centerX} V2`,
    };
  }

  return {
    leftBase: `M${leftLogoX} 2 V16 H${centerX}`,
    rightBase: `M${rightLogoX} 2 V16 H${centerX}`,
    pendingLine: `M${centerX} 16 V24`,
    leftWin: `M${leftLogoX} 2 V16 H${centerX} V24`,
    rightWin: `M${rightLogoX} 2 V16 H${centerX} V24`,
  };
});

const nodeStyle = computed(() => ({
  left: `${props.match.x}px`,
  top: `${props.match.y}px`,
  width: `${props.match.width}px`,
}));
</script>

<template>
  <button
    class="match-node"
    :class="{
      'match-node--featured': match.featured,
      'match-node--selected': selected,
      'match-node--wide-teams': match.wideTeams,
    }"
    :style="nodeStyle"
    type="button"
    :disabled="disabled"
    @click="$emit('select', match)"
  >
    <span class="match-main">
      <span
        v-for="(team, index) in matchTeams"
        :key="team.short"
        class="match-team"
        :class="{ 'match-team--winner': team === teams[match.winnerId] }"
        :style="teamPositionStyle(index)"
      >
        <TeamBadge
          :team="team"
          :size="match.featured ? 'lg' : 'md'"
          :muted="Boolean(match.winnerId && team !== teams[match.winnerId])"
        />
        <span class="team-name">{{ team.name }}</span>
      </span>

      <span class="score-stack" aria-label="比分">
        <span v-for="score in match.scores" :key="score">{{ score }}</span>
      </span>
    </span>

    <svg
      class="match-branch"
      :class="[`match-branch--${branchPosition}`]"
      :viewBox="branchViewBox"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path class="branch-line branch-line--base" :d="branchPaths.leftBase" />
      <path class="branch-line branch-line--base" :d="branchPaths.rightBase" />
      <path
        v-if="winnerIndex === -1"
        class="branch-line branch-line--base"
        :d="branchPaths.pendingLine"
      />
      <path
        v-if="winnerIndex === 0"
        class="branch-line branch-line--winner"
        :d="branchPaths.leftWin"
      />
      <path
        v-if="winnerIndex === 1"
        class="branch-line branch-line--winner"
        :d="branchPaths.rightWin"
      />
    </svg>
  </button>
</template>
