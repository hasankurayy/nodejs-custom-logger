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

## Installation

```bash
npm install express-context-logger
```

## Quick Start

### Option 1: Override Console (Recommended)

```javascript
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
import { ContextLogger } from 'express-context-logger';

const customLogger = new ContextLogger({
  showContext: true,          // Show file context (default: true)
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

// Override with custom logger
customLogger.override();
```

### Restore Original Console

```javascript
import logger from 'express-context-logger';

// Override console
const restore = logger.override();

console.log('This will show context');

// Restore original console
restore();

console.log('This is back to normal console');
```

## API Reference

### Default Logger

```javascript
import logger from 'express-context-logger';

logger.log(...args)     // Green [LOG] output
logger.info(...args)    // Blue [INFO] output  
logger.warn(...args)    // Yellow [WARN] output
logger.error(...args)   // Red [ERROR] output to stderr
logger.debug(...args)   // Magenta [DEBUG] output
logger.override()       // Override console methods, returns restore function
```

### ContextLogger Class

```javascript
import { ContextLogger } from 'express-context-logger';

const logger = new ContextLogger(options);
```

**Options:**
- `showContext: boolean` - Show file context (default: `true`)
- `showTimestamp: boolean` - Show timestamp (default: `false`)  
- `contextColor: string` - Color for context brackets (default: `'yellow'`)
- `colors: object` - Colors for each log level

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
import { ContextLogger } from 'express-context-logger';

const logger = new ContextLogger({ 
  showTimestamp: true 
});
logger.override();

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

## Changelog

### 1.0.0
- Initial release
- File context detection
- Console override functionality
- Configurable colors and options