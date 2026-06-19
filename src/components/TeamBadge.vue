<script setup>
import { computed } from 'vue';

const props = defineProps({
  team: {
    type: Object,
    required: true,
  },
  muted: {
    type: Boolean,
    default: false,
  },
  size: {
    type: String,
    default: 'md',
  },
});

const badgeStyle = computed(() => ({
  '--badge-primary': props.team.colors?.[0] ?? '#d33',
  '--badge-secondary': props.team.colors?.[1] ?? '#ffffff',
}));
</script>

<template>
  <span
    class="team-badge"
    :class="[`team-badge--${size}`, { 'team-badge--muted': muted }]"
    :style="badgeStyle"
    aria-hidden="true"
  >
    <span>{{ team.short }}</span>
  </span>
</template>
