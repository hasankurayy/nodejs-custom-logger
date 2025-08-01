import chalk from 'chalk';
import path from 'path';
import { fileURLToPath } from 'url';

const thisFile = fileURLToPath(import.meta.url);

class ContextLogger {
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

  _getCallerFile() {
    const originalPrepareStackTrace = Error.prepareStackTrace;

    try {
      Error.prepareStackTrace = (_, stack) => stack;
      const err = new Error();
      const stack = err.stack;

      for (let i = 2; i < stack.length; i++) {
        const fileNameWithFileProtocol = stack[i].getFileName()
        const fileName = fileURLToPath(fileNameWithFileProtocol)
        if (fileName && fileName !== thisFile) {
          const filepath = fileURLToPath(fileNameWithFileProtocol); // Eğer file: şeklinde gelirse
          return path.relative(process.cwd(), filepath);
        }
      }

      return 'unknown';
    } catch (e) {
      return 'unknown';
    } finally {
      Error.prepareStackTrace = originalPrepareStackTrace;
    }
  }

  _getTimestamp() {
    if (!this.options.showTimestamp) return '';
    return `[${new Date().toISOString()}] `;
  }

  _formatMessage(msg) {
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

  _buildLogMessage(level, args) {
    const context = this._getCallerFile();
    const timestamp = this._getTimestamp();
    const message = args.map(this._formatMessage).join(' ');
    
    const levelColor = this.options.colors[level] || 'white';
    const contextColor = this.options.colors.contextColor || this.options.contextColor;
    
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

  log(...args) {
    const output = this._buildLogMessage('log', args);
    process.stdout.write(`${output}\n`);
  }

  info(...args) {
    const output = this._buildLogMessage('info', args);
    process.stdout.write(`${output}\n`);
  }

  warn(...args) {
    const output = this._buildLogMessage('warn', args);
    process.stdout.write(`${output}\n`);
  }

  error(...args) {
    const output = this._buildLogMessage('error', args);
    process.stderr.write(`${output}\n`);
  }

  debug(...args) {
    const output = this._buildLogMessage('debug', args);
    process.stdout.write(`${output}\n`);
  }

  // Override console methods
  override() {
    console.log = this.log.bind(this);
    console.info = this.info.bind(this);
    console.warn = this.warn.bind(this);
    console.error = this.error.bind(this);
    console.debug = this.debug.bind(this);
  }

  setOptions(options) {
    this.options = this._deepMerge(this.options, options);
    return this;
  }

  _deepMerge(target, source) {
    const result = { ...target };
    
    for (const key in source) {
      if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
        result[key] = this._deepMerge(target[key] || {}, source[key]);
      } else {
        result[key] = source[key];
      }
    }
    
    return result;
  }
}

export default new ContextLogger();