<script setup>
defineProps({
  finalMatch: {
    type: Object,
    required: true,
  },
});
</script>

<template>
  <section class="final-card" aria-label="决赛">
    <div class="final-ribbon">{{ finalMatch.title }}</div>

    <div class="final-body">
      <div class="final-date">{{ finalMatch.date }}</div>

      <div class="final-slots">
        <div class="final-slot">
          <span class="placeholder-crest"></span>
          <span>{{ finalMatch.homeLabel }}</span>
        </div>
        <div class="final-slot">
          <span class="placeholder-crest"></span>
          <span>{{ finalMatch.awayLabel }}</span>
        </div>
      </div>
    </div>
  </section>
</template>
