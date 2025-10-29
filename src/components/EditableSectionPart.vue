<script setup lang="ts" generic="F extends keyof WorkSection">
import { type WorkSection, EditingSection } from '@/section'

withDefaults(
  defineProps<{
    section: WorkSection
    field: F
    editing: EditingSection
    editable?: (x: WorkSection[F]) => boolean
  }>(),
  {
    editable: () => true,
  },
)
</script>

<!-- eslint-disable vue/no-mutating-props -->
<template>
  <template v-if="section.editing !== editing">
    <a v-if="editable(section[field])" class="icon-button" @click="section.editing = editing">📝</a>
    <slot />
  </template>
  <template v-else>
    <div>
      <input type="text" class="wa-size-s" />
      <button class="wa-size-s wa-success">Save</button>
      <button class="wa-size-s wa-danger" @click="section.editing = EditingSection.NONE">
        Cancel
      </button>
    </div>
  </template>
</template>

<style scoped>
.inline-area {
  display: inline;
}
</style>
