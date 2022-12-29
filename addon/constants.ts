import type Controller from '@ember/controller';

export type DirectionsX = Directions.Left | Directions.Right;

export type BreadCrumb =
  | string
  | {
      label?: string;
      path?: string;
      model?: unknown | unknown[];
      linkable?: boolean;
      isCurrent?: boolean;
      rewind?: number;
      href?: string;
      target?: '_self' | '_top' | '_blank' | '_parent';
    };

export interface IBreadCrumbController extends Controller {
  breadCrumb?: BreadCrumb;
  breadCrumbs?: BreadCrumb[];
}

export interface ITableColumn {
  propertyName?: string;
  label?: string;
  description?: string;
  colSpan?: number;
  sortOn?: string;
  sortDirection?: string;
  subSortOn?: string;
  subSortDirection?: string;
  filterExactMatch?: boolean;
  filterStartsWith?: boolean;
  filterCaseSensitive?: boolean;
  filterBooleanMap?: [string, string];
}

export enum Directions {
  Left = 'left',
  Right = 'right',
  Up = 'up',
  Down = 'down',
}

export enum Dimensions {
  Height = 'height',
  Width = 'width',
}

export enum ButtonVariants {
  Default = 'default',
  Primary = 'primary',
  Secondary = 'secondary',
  Info = 'info',
  Success = 'success',
  Warning = 'warning',
  Danger = 'danger',
  Link = 'link',
}

export enum PanelVariants {
  Default = 'default',
  Primary = 'primary',
  Secondary = 'secondary',
  Info = 'info',
  Success = 'success',
  Warning = 'warning',
  Danger = 'danger',
}

export enum SizeVariants {
  Small = 'sm',
  Medium = 'md',
  Large = 'lg',
}

export enum HeadingLevels {
  H1 = 'h1',
  H2 = 'h2',
  H3 = 'h3',
  H4 = 'h4',
  H5 = 'h5',
  H6 = 'h6',
}

export enum AlertLevel {
  ERROR = 'danger',
  WARNING = 'warning',
  SUCCESS = 'success',
  INFO = 'secondary',
  MUTED = 'muted',
}

export const AlertLevelAlternates: Record<string, AlertLevel> = {
  error: AlertLevel.ERROR,
  errors: AlertLevel.ERROR,
  alert: AlertLevel.ERROR,
  warnings: AlertLevel.WARNING,
  successes: AlertLevel.SUCCESS,
  info: AlertLevel.INFO,
  information: AlertLevel.INFO,
  informationals: AlertLevel.INFO,
  default: AlertLevel.MUTED,
};

export type AlertLevelKeys =
  | 'danger'
  | 'error'
  | 'errors'
  | 'alert'
  | 'warning'
  | 'warnings'
  | 'success'
  | 'successes'
  | 'secondary'
  | 'info'
  | 'information'
  | 'informationals'
  | 'muted'
  | 'default';

export const AlertLevelOrdering: AlertLevel[] = [
  AlertLevel.ERROR,
  AlertLevel.WARNING,
  AlertLevel.INFO,
  AlertLevel.SUCCESS,
  AlertLevel.MUTED,
];

export type AlertGroupDefinition = {
  singular?: string;
  plural?: string;
  icon?: string;
};

export const AlertGroups: Record<AlertLevel, AlertGroupDefinition> = {
  [AlertLevel.ERROR]: {
    singular: 'ERROR:',
    plural: 'ERRORS:',
    icon: 'fa fa-exclamation-triangle',
  },
  [AlertLevel.WARNING]: {
    singular: 'WARNING:',
    plural: 'WARNINGS:',
    icon: 'fa fa-exclamation-triangle',
  },
  [AlertLevel.SUCCESS]: {
    singular: 'SUCCESS:',
    plural: 'SUCCESS:',
    icon: 'fa fa-check-circle-o',
  },
  [AlertLevel.INFO]: {
    singular: 'INFORMATION:',
    plural: 'INFORMATION:',
    icon: 'fa fa-info-circle',
  },
  [AlertLevel.MUTED]: {},
};

/**
 * Common KeyCodes used for keyboard navigation and selection.
 */
export enum KeyCodes {
  Enter = 'Enter',
  ArrowUp = 'ArrowUp',
  ArrowRight = 'ArrowRight',
  ArrowDown = 'ArrowDown',
  ArrowLeft = 'ArrowLeft',
  Home = 'Home',
  End = 'End',
  Space = 'Space',
  Escape = 'Escape',
  Shift = 'Shift',
  Tab = 'Tab',
}

export enum SortOrder {
  ASC = 'ascending',
  DESC = 'descending',
  NONE = 'none',
}
