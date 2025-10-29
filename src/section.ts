import dayjs from 'dayjs'
import type { Dayjs } from 'dayjs'
import type { InputTypeHTMLAttribute } from 'vue'

export const TIME_FORMAT = 'h:mm A'
export const DURATION_FORMAT = 'H:mm'
export const DETAILED_DURATION_FORMAT = 'H:mm:ss'

export enum EditingSection {
  NONE,
  START,
  END,
  DESCRIPTION,
}

export type SerializedWorkSection = {
  start: string
  end?: string
  description: string
}

export class WorkSection {
  start: Dayjs
  end?: Dayjs
  description: string
  editing: EditingSection

  constructor(data?: SerializedWorkSection) {
    if (data) {
      this.start = dayjs(data.start)
      if (data.end) {
        this.end = dayjs(data.end)
      }
      this.description = data.description
    } else {
      this.start = dayjs()
      this.description = ''
    }
    this.editing = EditingSection.NONE
  }

  duration() {
    return dayjs.duration((this.end ?? dayjs()).diff(this.start))
  }

  takeIfActive() {
    return !this.end ? this : null
  }

  serialize(): SerializedWorkSection {
    return {
      start: this.start.toISOString(),
      end: this.end?.toISOString(),
      description: this.description,
    }
  }

  static serializeSectionsToString(sections: WorkSection[]) {
    return JSON.stringify(sections.map((x) => x.serialize()))
  }

  static deserializeSectionsFromString(data: string) {
    return (JSON.parse(data) as SerializedWorkSection[]).map((x) => new WorkSection(x))
  }
}

export type EditableSectionType<V> = {
  valueToString: (value: V) => string
  validateString: (string: string) => boolean
  valueFromString: (string: string) => V
  inputType: InputTypeHTMLAttribute
}

export const TIME_SECTION_TYPE: EditableSectionType<Dayjs> = {
  valueToString: (v) => v.format('HH:mm'),
  validateString: (s) => dayjs(s, 'HH:mm').isBefore(dayjs()),
  valueFromString: (s) => dayjs(s, 'HH:mm'),
  inputType: 'time',
}

export const TEXT_SECTION_TYPE: EditableSectionType<string> = {
  valueToString: (v) => v,
  validateString: () => true,
  valueFromString: (s) => s,
  inputType: 'text',
}
