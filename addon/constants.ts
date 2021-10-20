export const AnalyticsServiceName = 'analytics';

export interface IAnalyticsService {
  pageViewNote: (trackNote: string) => void;
}

export enum Directions {
  Left = 'left',
  Right = 'right',
  Up = 'up',
  Down = 'down',
}

export type DirectionsX = Directions.Left | Directions.Right;

export enum Dimensions {
  Height = 'height',
  Width = 'width',
}
