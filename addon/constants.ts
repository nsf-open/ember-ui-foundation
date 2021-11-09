export type DirectionsX = Directions.Left | Directions.Right;

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

export enum KeyNames {
  Enter = 'Enter',
  Escape = 'Escape',
  ArrowUp = 'ArrowUp',
  ArrowDown = 'ArrowDown',
  Tab = 'Tab',
  Shift = 'Shift',
}

export enum HeadingLevels {
  H1 = 'h1',
  H2 = 'h2',
  H3 = 'h3',
  H4 = 'h4',
}
