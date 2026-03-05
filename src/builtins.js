// Built-in constructors that are always allowed with strictConstructors: true

const BUILTINS = new Set([
  // Fundamental
  'Object', 'Function', 'Boolean', 'Symbol', 'BigInt',

  // Errors
  'Error', 'EvalError', 'RangeError', 'ReferenceError',
  'SyntaxError', 'TypeError', 'URIError', 'AggregateError',

  // Numbers & Math
  'Number', 'Date',

  // Text
  'String', 'RegExp',

  // Indexed collections
  'Array', 'Int8Array', 'Uint8Array', 'Uint8ClampedArray',
  'Int16Array', 'Uint16Array', 'Int32Array', 'Uint32Array',
  'Float32Array', 'Float64Array', 'BigInt64Array', 'BigUint64Array',

  // Keyed collections
  'Map', 'Set', 'WeakMap', 'WeakSet', 'WeakRef',

  // Structured data
  'ArrayBuffer', 'SharedArrayBuffer', 'DataView',

  // Control abstraction
  'Promise', 'GeneratorFunction', 'AsyncFunction',
  'FinalizationRegistry',

  // Reflection
  'Proxy',

  // Internationalization
  'Intl',

  // Node.js built-ins
  'Buffer', 'EventEmitter',
  'Readable', 'Writable', 'Transform', 'Duplex', 'PassThrough',
  'URL', 'URLSearchParams',
  'TextEncoder', 'TextDecoder',
  'Worker',

  // Browser built-ins
  'XMLHttpRequest', 'WebSocket', 'EventSource',
  'FormData', 'Headers', 'Request', 'Response',
  'MutationObserver', 'IntersectionObserver', 'ResizeObserver', 'PerformanceObserver',
  'AbortController', 'AbortSignal',
  'Blob', 'File', 'FileReader',
  'ImageData', 'ImageBitmap',
  'AudioContext', 'OfflineAudioContext',
  'Worker', 'ServiceWorker', 'BroadcastChannel', 'MessageChannel',
]);

module.exports = { BUILTINS };
