// Type definitions for the logger
export type LogLevel = 'log' | 'warn' | 'error' | 'debug' | 'info';

export type ColorName = 'black' | 'red' | 'green' | 'yellow' | 'blue' | 'magenta' | 'cyan' | 'white' | 'gray' | 'grey';

export interface LoggerColors {
  log?: ColorName;
  warn?: ColorName;
  error?: ColorName;
  debug?: ColorName;
  info?: ColorName;
}

export interface LoggerOptions {
  showTimestamp?: boolean;
  colors?: LoggerColors;
  contextColor?: ColorName;
}