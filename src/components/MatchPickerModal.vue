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
});

defineEmits(['close']);

const matchTeams = computed(() =>
  props.match.teamIds.map((teamId) => props.teams[teamId]),
);

const modalRows = computed(() => [
  {
    id: 'first-leg',
    home: matchTeams.value[0],
    away: matchTeams.value[1],
    date: '03/12 04:00',
    score: props.match.scores[0],
  },
  {
    id: 'second-leg',
    home: matchTeams.value[1],
    away: matchTeams.value[0],
    date: '03/18 04:00',
    score: props.match.scores[1],
  },
]);
</script>

<template>
  <div class="modal-layer" role="presentation" @click.self="$emit('close')">
    <section class="match-picker" role="dialog" aria-modal="true" aria-labelledby="match-picker-title">
      <header class="match-picker__header">
        <h2 id="match-picker-title">选择赛事</h2>
        <button class="match-picker__close" type="button" aria-label="关闭" @click="$emit('close')">
          ×
        </button>
      </header>

      <button
        v-for="row in modalRows"
        :key="row.id"
        class="match-picker__row"
        type="button"
      >
        <span class="match-picker__team">
          <TeamBadge :team="row.home" size="md" />
          <span>{{ row.home.name }}</span>
        </span>

        <span class="match-picker__center">
          <time>{{ row.date }}</time>
          <strong>{{ row.score }}</strong>
        </span>

        <span class="match-picker__team">
          <TeamBadge :team="row.away" size="md" />
          <span>{{ row.away.name }}</span>
        </span>

        <span class="match-picker__chevron" aria-hidden="true">›</span>
      </button>
    </section>
  </div>
</template>
