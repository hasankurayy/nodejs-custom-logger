import chalk from 'chalk';
import path from 'path';
import { fileURLToPath } from 'url';
import type { LogLevel, ColorName, LoggerOptions, LoggerColors } from './types/logger.js';
import type { CallSite } from './types/callsite.js';

// Re-export types for external use
export type { LogLevel, ColorName, LoggerOptions, LoggerColors } from './types/logger.js';

const thisFile = fileURLToPath(import.meta.url);

class ContextLogger {
  private options: Required<LoggerOptions>;

  constructor() {
    this.options = {
      showTimestamp: false,
      colors: {
        log: 'green',
        warn: 'yellow', 
        error: 'red',
        debug: 'magenta',
        info: 'blue'
      },
      contextColor: 'yellow',
    };
  }

  private _getCallerFile(): string {
    const originalPrepareStackTrace = (Error as any).prepareStackTrace;

    try {
      (Error as any).prepareStackTrace = (_: Error, stack: CallSite[]) => stack;
      const err = new Error();
      const stack = (err as any).stack as CallSite[];

      if (Array.isArray(stack)) {
        for (let i = 2; i < stack.length; i++) {
          const fileNameWithFileProtocol = stack[i].getFileName();
          if (fileNameWithFileProtocol) {
            const fileName = fileURLToPath(fileNameWithFileProtocol);
            if (fileName && fileName !== thisFile) {
              const filepath = fileURLToPath(fileNameWithFileProtocol);
              return path.relative(process.cwd(), filepath);
            }
          }
        }
      }

      return 'unknown';
    } catch (e) {
      return 'unknown';
    } finally {
      (Error as any).prepareStackTrace = originalPrepareStackTrace;
    }
  }

  private _getTimestamp(): string {
    if (!this.options.showTimestamp) return '';
    return `[${new Date().toISOString()}] `;
  }

  private _formatMessage(msg: unknown): string {
    if (typeof msg === 'string') return msg;
    if (msg instanceof Error) {
      return `${msg.message}\n${msg.stack}`;
    }
    try {
      return JSON.stringify(msg, null, 2);
    } catch {
      return String(msg);
    }
  }

  private _buildLogMessage(level: LogLevel, args: unknown[]): string {
    const context = this._getCallerFile();
    const timestamp = this._getTimestamp();
    const message = args.map(arg => this._formatMessage(arg)).join(' ');
    
    const levelColor = this.options.colors[level] || 'white';
    const contextColor = this.options.contextColor;
    
    let output = `${chalk[levelColor](`[${level.toUpperCase()}]`)}`;
    
    if (context) {
      output += ` ${chalk[contextColor](`[${context}]`)}`;
    }
    
    if (timestamp) {
      output += ` ${chalk.gray(timestamp)}`;
    }
    
    output += ` ${chalk[levelColor](message)}`;
    
    return output;
  }

  public log(...args: unknown[]): void {
    const output = this._buildLogMessage('log', args);
    process.stdout.write(`${output}\n`);
  }

  public info(...args: unknown[]): void {
    const output = this._buildLogMessage('info', args);
    process.stdout.write(`${output}\n`);
  }

  public warn(...args: unknown[]): void {
    const output = this._buildLogMessage('warn', args);
    process.stdout.write(`${output}\n`);
  }

  public error(...args: unknown[]): void {
    const output = this._buildLogMessage('error', args);
    process.stderr.write(`${output}\n`);
  }

  public debug(...args: unknown[]): void {
    const output = this._buildLogMessage('debug', args);
    process.stdout.write(`${output}\n`);
  }

  // Override console methods
  public override(): void {
    console.log = this.log.bind(this);
    console.info = this.info.bind(this);
    console.warn = this.warn.bind(this);
    console.error = this.error.bind(this);
    console.debug = this.debug.bind(this);
  }

  public setOptions(options: LoggerOptions): ContextLogger {
    this.options = this._deepMerge(this.options, options);
    return this;
  }

  private _deepMerge<T extends Record<string, any>>(target: T, source: Partial<T>): T {
    const result = { ...target };
    
    for (const key in source) {
      if (source.hasOwnProperty(key)) {
        if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
          result[key] = this._deepMerge(target[key] || {} as any, source[key] as any);
        } else if (source[key] !== undefined) {
          result[key] = source[key] as any;
        }
      }
    }
    
    return result;
  }
}

export default new ContextLogger();