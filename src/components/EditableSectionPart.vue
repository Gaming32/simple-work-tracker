<!-- eslint-disable vue/no-mutating-props -->
<script setup lang="ts" generic="F extends keyof WorkSection">
import { EditingSection, WorkSection, type EditableSectionType } from '@/section'
import { ref } from 'vue'

const props = defineProps<{
  section: WorkSection
  field: F
  editing: EditingSection
  inputType: EditableSectionType<NonNullable<WorkSection[F]>>
}>()

const newValue = ref('')

function startEdit() {
  const oldValue = props.section[props.field]
  if (oldValue === undefined) {
    console.error('startEdit called when oldValue was undefined')
    return
  }
  newValue.value = props.inputType.valueToString(oldValue)
  props.section.editing = props.editing
}

function endEdit() {
  props.section[props.field] = props.inputType.valueFromString(newValue.value)
  forceEndEdit()
}

function forceEndEdit() {
  props.section.editing = EditingSection.NONE
}
</script>

<template>
  <div v-if="section.editing !== editing">
    <a v-if="section[field] !== undefined" class="icon-button" @click="startEdit">📝</a>
    <slot />
  </div>
  <div v-else class="gapped-controls">
    <input
      :type="inputType.inputType"
      class="wa-size-s small-input"
      v-model="newValue"
      @keyup.enter="endEdit"
      @keyup.escape="forceEndEdit"
    />
    <button
      class="wa-size-s wa-success"
      :disabled="!inputType.validateString(newValue)"
      @click="endEdit"
    >
      Save
    </button>
    <button class="wa-size-s wa-danger" @click="forceEndEdit">Cancel</button>
  </div>
</template>

<style scoped>
.gapped-controls {
  display: flex;
  gap: 0.5em;
}

.small-input {
  max-width: 225px;
}
</style>
