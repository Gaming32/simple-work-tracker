<script setup lang="ts">
import { useDark } from '@vueuse/core'
import dayjs from 'dayjs'
import { last } from 'lodash'
import { computed, ref } from 'vue'
import RepoFooter from './components/RepoFooter.vue'
import {
  DETAILED_DURATION_FORMAT,
  DURATION_FORMAT,
  EditingSection,
  TEXT_SECTION_TYPE,
  TIME_FORMAT,
  TIME_SECTION_TYPE,
  WorkSection,
} from './section'
import EditableSectionPart from './components/EditableSectionPart.vue'

useDark({
  valueDark: 'wa-dark',
})

const intervalOnClock = ref(0)

const sections = ref<WorkSection[]>([])
const onClock = computed(() => {
  intervalOnClock.value.toString()
  return last(sections.value)?.takeIfActive()?.duration()
})
const totalWorked = computed(() => {
  intervalOnClock.value.toString()
  return sections.value.reduce((a, b) => a.add(b.duration()), dayjs.duration(0))
})

setInterval(() => {
  if (onClock.value !== undefined) {
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
    <div>Total worked: {{ totalWorked.format(DURATION_FORMAT) }}</div>
    <button v-if="onClock === undefined" class="wa-success" @click="clockIn">Clock in</button>
    <template v-else>
      <div>Clocked in: {{ onClock.format(DETAILED_DURATION_FORMAT) }}</div>
      <button class="wa-danger" @click="clockOut">Clock out</button>
    </template>
    <template v-if="sections.length">
      <table class="inline-table wa-hover-rows wa-zebra-rows">
        <thead>
          <tr>
            <th class="centered-horizontally">
              <a class="icon-button" @click="sections = []">❌</a>
            </th>
            <th>Start time</th>
            <th>End time</th>
            <th>Duration</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(section, index) in sections" :key="index">
            <td class="centered-horizontally">
              <a class="icon-button" @click="sections.splice(index, 1)">❌</a>
            </td>
            <td>
              <EditableSectionPart
                :section="section"
                field="start"
                :editing="EditingSection.START"
                :value-from-string="dayjs"
                :input-type="TIME_SECTION_TYPE"
                >{{ section.start.format(TIME_FORMAT) }}</EditableSectionPart
              >
            </td>
            <td>
              <EditableSectionPart
                :section="section"
                field="end"
                :editing="EditingSection.END"
                :value-from-string="dayjs"
                :input-type="TIME_SECTION_TYPE"
                >{{ section.end?.format(TIME_FORMAT) ?? 'Now' }}</EditableSectionPart
              >
            </td>
            <td>{{ section.duration().format(DURATION_FORMAT) }}</td>
            <td>
              <EditableSectionPart
                :section="section"
                field="description"
                :editing="EditingSection.DESCRIPTION"
                :input-type="TEXT_SECTION_TYPE"
                >{{ section.description }}</EditableSectionPart
              >
            </td>
          </tr>
        </tbody>
      </table>
    </template>
  </div>

  <RepoFooter />
</template>

<style scoped>
.inline-table {
  display: inline-block;
}

.centered-horizontally {
  text-align: center;
}
</style>
