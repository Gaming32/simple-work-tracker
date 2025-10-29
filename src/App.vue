<script setup lang="ts">
import { useDark } from '@vueuse/core'
import dayjs from 'dayjs'
import { last } from 'lodash'
import { computed, ref } from 'vue'
import RepoFooter from './components/RepoFooter.vue'
import { EditingSection, WorkSection, formatMinutes, formatSeconds } from './section'
import EditableSectionPart from './components/EditableSectionPart.vue'

useDark({
  valueDark: 'wa-dark',
})

const intervalOnClock = ref(0)

const sections = ref<WorkSection[]>([])
const onClockSeconds = computed(() => {
  intervalOnClock.value.toString()
  return last(sections.value)?.takeIfActive()?.durationSeconds()
})
const totalWorkedMinutes = computed(() => {
  intervalOnClock.value.toString()
  return sections.value.reduce((a, b) => a + b.durationMinutes(), 0)
})

setInterval(() => {
  if (onClockSeconds.value !== undefined) {
    intervalOnClock.value++
  }
}, 1000)

function clockIn() {
  sections.value.push(new WorkSection())
}

function clockOut() {
  const clockedIn = last(sections.value)?.takeIfActive()
  if (!clockedIn) return
  clockedIn.end = dayjs()
}
</script>

<template>
  <h1>Simple work tracker</h1>

  <div class="app-body">
    <h3>Total worked: {{ formatMinutes(totalWorkedMinutes) }}</h3>
    <button v-if="onClockSeconds === undefined" class="wa-success" @click="clockIn">
      Clock in
    </button>
    <template v-else>
      <h3>Clocked in: {{ formatSeconds(onClockSeconds) }}</h3>
      <button class="wa-danger" @click="clockOut">Clock out</button>
    </template>
    <table class="inline-table wa-hover-rows wa-zebra-rows">
      <thead>
        <tr>
          <th></th>
          <th>Start time</th>
          <th>End time</th>
          <th>Duration</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(section, index) in sections" :key="index">
          <td><a class="icon-button">❌</a></td>
          <td>
            <EditableSectionPart :section="section" field="start" :editing="EditingSection.START">{{
              section.start.format('h:mm A')
            }}</EditableSectionPart>
          </td>
          <td>
            <EditableSectionPart
              :section="section"
              field="end"
              :editing="EditingSection.END"
              :editable="(v) => !!v"
              >{{ section.end?.format('h:mm A') ?? 'Now' }}</EditableSectionPart
            >
          </td>
          <td>{{ formatMinutes(section.durationMinutes()) }}</td>
          <td>
            <EditableSectionPart
              :section="section"
              field="description"
              :editing="EditingSection.DESCRIPTION"
              >{{ section.description }}</EditableSectionPart
            >
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <RepoFooter />
</template>

<style scoped>
.inline-table {
  display: inline-block;
}
</style>
