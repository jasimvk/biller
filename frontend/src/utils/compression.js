import pako from 'pako';

export const CompressionUtil = {
  compress(data) {
    try {
      const stringData = JSON.stringify(data);
      const compressed = pako.deflate(stringData, { to: 'string' });
      return compressed;
    } catch (error) {
      console.error('Compression failed:', error);
      return data;
    }
  },

  decompress(compressedData) {
    try {
      const decompressed = pako.inflate(compressedData, { to: 'string' });
      return JSON.parse(decompressed);
    } catch (error) {
      console.error('Decompression failed:', error);
      return compressedData;
    }
  },

  // Calculate compression ratio for monitoring
  getCompressionRatio(original, compressed) {
    const originalSize = new Blob([JSON.stringify(original)]).size;
    const compressedSize = new Blob([compressed]).size;
    return ((originalSize - compressedSize) / originalSize * 100).toFixed(2);
  }
}; 