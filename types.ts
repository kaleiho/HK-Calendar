export interface Holiday {
  date: string; // YYYY-MM-DD
  name: string;
  isStatutory: boolean;
}

export interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  holiday?: Holiday;
}

export interface AIAnalysisResult {
  quote: string;
  primaryColor: string;
  secondaryColor: string;
}

export enum LayoutMode {
  FULL_BG = 'FULL_BG',
  SPLIT_TOP = 'SPLIT_TOP',
}
