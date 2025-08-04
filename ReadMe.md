# express-context-logger

Beautiful console logger with file context for Node.js applications. Shows exactly which file called the log function, making debugging much easier!

[![npm version](https://badge.fury.io/js/express-context-logger.svg)](https://www.npmjs.com/package/express-context-logger)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Features

- 🎨 **Colorful output** with chalk
- 📁 **File context** - shows which file called the logger
- ⚡ **Easy integration** - override console or use directly
- 🔧 **Configurable** - customize colors, format, and behavior
- 📦 **Zero config** - works out of the box
- 🚀 **Express.js friendly** - perfect for web applications
- 💪 **TypeScript support** - full type safety and IntelliSense

## Installation

```bash
npm install express-context-logger
```

## Quick Start

### Option 1: Override Console (Recommended)

```javascript
// JavaScript
import logger from 'express-context-logger';

// TypeScript
import logger from 'express-context-logger';

// Override console methods
logger.override();

// Now use console.log normally - it will show file context!
console.log('Hello from app.js!');
console.warn('Warning from utils/helper.js');
console.error('Error occurred');
```

Output:
```
[LOG] [app.js] Hello from app.js!
[WARN] [utils/helper.js] Warning from utils/helper.js
[ERROR] [app.js] Error occurred
```

### Option 2: Use Logger Directly

```javascript
// JavaScript
import logger from 'express-context-logger';

// TypeScript  
import logger from 'express-context-logger';

logger.log('Direct usage');
logger.info('Information');
logger.warn('Warning');
logger.error('Error');
logger.debug('Debug info');
```

## Express.js Integration

```javascript
import express from 'express';
import logger from 'express-context-logger';

const app = express();

// Override console at the start of your app
logger.override();

app.get('/', (req, res) => {
  console.log('Route handler called'); // Shows [LOG] [routes/index.js]
  res.json({ message: 'Hello World' });
});

app.listen(3000, () => {
  console.log('Server running on port 3000'); // Shows [LOG] [app.js]
});
```

## Configuration

### Custom Colors and Options

```javascript
import logger from 'express-context-logger';

// Configure the logger with custom options
logger.setOptions({
  showTimestamp: true,        // Show timestamp (default: false)
  contextColor: 'cyan',       // Context bracket color (default: 'yellow')
  colors: {
    log: 'green',
    info: 'blue', 
    warn: 'yellow',
    error: 'red',
    debug: 'magenta'
  }
});

// Override console with configured logger
logger.override();
```

### Chaining Configuration

```javascript
import logger from 'express-context-logger';

// Chain configuration and override
logger.setOptions({
  showTimestamp: true,
  contextColor: 'cyan'
}).override();

console.log('This will show context with timestamp');
```

## API Reference

### Default Logger

```javascript
import logger from 'express-context-logger';

logger.log(...args)           // Green [LOG] output
logger.info(...args)          // Blue [INFO] output  
logger.warn(...args)          // Yellow [WARN] output
logger.error(...args)         // Red [ERROR] output to stderr
logger.debug(...args)         // Magenta [DEBUG] output
logger.override()             // Override console methods
logger.setOptions(options)    // Configure logger options, returns logger instance
```

### Configuration Options

**setOptions(options)** accepts an object with:
- `showTimestamp: boolean` - Show timestamp (default: `false`)  
- `contextColor: ColorName` - Color for context brackets (default: `'yellow'`)
- `colors: LoggerColors` - Colors for each log level

**Available Colors:**
`'black'`, `'red'`, `'green'`, `'yellow'`, `'blue'`, `'magenta'`, `'cyan'`, `'white'`, `'gray'`, `'grey'`

## Examples

### Basic Usage

```javascript
// utils/database.js
import logger from 'express-context-logger';
logger.override();

export function connectDB() {
  console.log('Connecting to database...');  // [LOG] [utils/database.js]
  console.log({ host: 'localhost', port: 5432 });
}
```

### With Timestamps

```javascript
import logger from 'express-context-logger';

logger.setOptions({ 
  showTimestamp: true 
}).override();

console.log('Server started'); 
// Output: [LOG] [app.js] [2024-01-15T10:30:45.123Z] Server started
```

### Error Handling

```javascript
logger.override();

try {
  throw new Error('Database connection failed');
} catch (err) {
  console.error(err); // Shows full error with stack trace and context
}
```

## Requirements

- Node.js >= 16.0.0
- ES Modules support
- TypeScript >= 5.0.0 (if using TypeScript)

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Add tests if needed
5. Commit: `git commit -am 'Add feature'`
6. Push: `git push origin feature-name`
7. Submit a pull request

## License

MIT © [Your Name]

## TypeScript Support

This package is written in TypeScript and provides full type definitions. You get IntelliSense and type checking out of the box.

```typescript
import logger from 'express-context-logger';
import type { LoggerOptions, ColorName } from 'express-context-logger';

const options: LoggerOptions = {
  showTimestamp: true,
  contextColor: 'cyan' as ColorName,
  colors: {
    info: 'blue',
    error: 'red'
  }
};

logger.setOptions(options).override();
```

## Changelog

### 2.0.0
- **BREAKING:** Converted to TypeScript
- **BREAKING:** Removed ContextLogger class export
- **BREAKING:** Removed restore functionality from override()
- Added full TypeScript support with type definitions
- Added setOptions() method for configuration
- Improved project structure with separate type files

### 1.0.0
- Initial release
- File context detection
- Console override functionality
- Configurable colors and options