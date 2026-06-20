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

defineEmits(['select']);

const matchTeams = computed(() =>
  props.match.teamIds.map((teamId) => props.teams[teamId]).filter(Boolean),
);

const winnerIndex = computed(() => props.match.teamIds.indexOf(props.match.winnerId));

const branchPosition = computed(() => props.match.branchPosition ?? 'bottom');

const branchViewBox = computed(() => `0 0 ${props.match.width} 26`);

const normalizedConnectorStyle = computed(() =>
  props.connectorStyle === 'curve' ? 'curve' : 'straight',
);

const teamPositionStyle = (index) => {
  if (!props.match.wideTeams) {
    return {};
  }

  const x = index === 0 ? 39 : props.match.width - 39;
  return {
    left: `${x}px`,
  };
};

const createStraightBranchPath = ({
  centerX,
  includeTarget,
  jointY,
  logoX,
  logoY,
  targetY,
}) => {
  const targetSegment = includeTarget ? ` V${targetY}` : '';
  return `M${logoX} ${logoY} V${jointY} H${centerX}${targetSegment}`;
};

const createCurveBranchPath = ({
  centerX,
  includeTarget,
  jointY,
  logoX,
  logoY,
  targetY,
}) => {
  const radius = Math.min(
    8,
    Math.abs(centerX - logoX) / 2,
    Math.abs(jointY - logoY) / 2,
    includeTarget ? Math.abs(targetY - jointY) / 2 : 8,
  );
  const logoBendY = logoY < jointY ? jointY - radius : jointY + radius;
  const logoExitX = logoX < centerX ? logoX + radius : logoX - radius;
  const centerApproachX = logoX < centerX ? centerX - radius : centerX + radius;

  if (!includeTarget) {
    return `M${logoX} ${logoY} V${logoBendY} Q${logoX} ${jointY} ${logoExitX} ${jointY} H${centerX}`;
  }

  const centerExitY = targetY < jointY ? jointY - radius : jointY + radius;
  return [
    `M${logoX} ${logoY}`,
    `V${logoBendY}`,
    `Q${logoX} ${jointY} ${logoExitX} ${jointY}`,
    `H${centerApproachX}`,
    `Q${centerX} ${jointY} ${centerX} ${centerExitY}`,
    `V${targetY}`,
  ].join(' ');
};

const branchPaths = computed(() => {
  const branchStartY = 3;
  const branchEndY = 23;
  const branchJointY = (branchStartY + branchEndY) / 2;
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
  const logoY = branchPosition.value === 'top' ? branchEndY : branchStartY;
  const targetY = branchPosition.value === 'top' ? branchStartY : branchEndY;
  const createBranchPath = normalizedConnectorStyle.value === 'curve'
    ? createCurveBranchPath
    : createStraightBranchPath;

  return {
    leftBase: createBranchPath({
      centerX,
      includeTarget: false,
      jointY: branchJointY,
      logoX: leftLogoX,
      logoY,
      targetY,
    }),
    rightBase: createBranchPath({
      centerX,
      includeTarget: false,
      jointY: branchJointY,
      logoX: rightLogoX,
      logoY,
      targetY,
    }),
    pendingLine: `M${centerX} ${branchJointY} V${targetY}`,
    leftWin: createBranchPath({
      centerX,
      includeTarget: true,
      jointY: branchJointY,
      logoX: leftLogoX,
      logoY,
      targetY,
    }),
    rightWin: createBranchPath({
      centerX,
      includeTarget: true,
      jointY: branchJointY,
      logoX: rightLogoX,
      logoY,
      targetY,
    }),
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
          :default-logo="defaultTeamLogo"
        />
        <span class="team-name">{{ team.name }}</span>
      </span>

      <span class="score-stack" aria-label="比分">
        <span v-for="score in match.scores" :key="score">{{ score }}</span>
      </span>
    </span>

    <svg
      class="match-branch"
      :class="[
        `match-branch--${branchPosition}`,
        `match-branch--${normalizedConnectorStyle}`,
      ]"
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
