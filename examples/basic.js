import logger from '../index.js';

// Override console methods
logger.setOptions({
  showTimestamp: true,
  colors: {
    info: 'red',
  },
  contextColor: 'red'
}).override();

console.log('This is a basic log message');
console.info('This is info');
console.warn('This is a warning');
console.error('This is an error');
console.debug('This is debug info');

// Test with objects
console.log('User data:', { id: 1, name: 'John', active: true });

// Test with arrays
console.log('Numbers:', [1, 2, 3, 4, 5]);

// Test with error objects
try {
  throw new Error('Sample error for testing');
} catch (err) {
  console.error('Caught error:', err);
}