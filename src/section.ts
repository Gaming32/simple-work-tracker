import dayjs from 'dayjs'
import type { Dayjs } from 'dayjs'

export enum EditingSection {
  NONE,
  START,
  END,
  DESCRIPTION,
}

export class WorkSection {
  start: Dayjs
  end?: Dayjs
  description: string
  editing: EditingSection

  constructor(start?: dayjs.ConfigType) {
    this.start = dayjs(start)
    this.description = ''
    this.editing = EditingSection.NONE
  }

  durationMinutes() {
    return (this.end ?? dayjs()).diff(this.start, 'minutes')
  }

  durationSeconds() {
    return (this.end ?? dayjs()).diff(this.start, 'seconds')
  }

  takeIfActive() {
    return !this.end ? this : null
  }
}

export function pad2(x: number) {
  return Math.floor(x).toString().padStart(2, '0')
}

export function formatMinutes(minutes: number) {
  return `${Math.floor(minutes / 60)}:${pad2(minutes % 60)}`
}

export function formatSeconds(seconds: number) {
  return `${Math.floor(seconds / 3600)}:${pad2((seconds / 60) % 60)}:${pad2(seconds % 60)}`
}
