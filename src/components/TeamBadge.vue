<script setup>
import { computed, ref, watch } from 'vue';

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
  defaultLogo: {
    type: String,
    default: '',
  },
});

const imageFailed = ref(false);

const logoSrc = computed(() => {
  if (props.team.logo && !imageFailed.value) {
    return props.team.logo;
  }

  return props.defaultLogo;
});

watch(
  () => props.team.logo,
  () => {
    imageFailed.value = false;
  },
);
</script>

<template>
  <span
    class="team-badge"
    :class="[
      `team-badge--${size}`,
      {
        'team-badge--muted': muted,
        'team-badge--image': logoSrc,
      },
    ]"
    aria-hidden="true"
  >
    <img
      v-if="logoSrc"
      :src="logoSrc"
      :alt="team.name"
      loading="eager"
      decoding="async"
      @error="imageFailed = true"
    >
    <span v-else>{{ team.short }}</span>
  </span>
</template>
