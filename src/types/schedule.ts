// src/types/schedule.ts

/**
 * Interface for the basic event item passed into the component.
 */
export interface ScheduleItem {
  id: number
  title: string
  startTime: string // e.g., "09:00"
  endTime: string // e.g., "10:30"
  location: string
  [key: string]: any // Allow for other properties like 'location'
  bgcolor?: string
  fgcolor?: string
}

/**
 * Interface for an item after it has been processed by useScheduleLogic.
 */
export interface ScheduledItem extends ScheduleItem {
  startMin: number
  endMin: number
  column: number
  columns: number
  style: {
    top: string
    height: string
    width: string
    left: string
    'z-index': number
  }
}
