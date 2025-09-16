export class ObjectId {
  private data: Buffer;
  
  private static counter = Math.floor(Math.random() * 0xffffff); // 3 bytes
  private static random = Buffer.from(
    Array.from({ length: 4 }, () => Math.floor(Math.random() * 256))
  ); // fixed 4 bytes


  constructor(type: number, timestamp: number) {
    const buf = Buffer.alloc(14);

    // type (1 byte)
    buf[0] = type & 0xff;

    // timestamp (6 bytes, big-endian)
    let ms = timestamp;
    for (let i = 5; i >= 0; i--) {
      buf[1 + i] = ms & 0xff;
      ms = Math.floor(ms / 256);
    }

    // random (4 bytes, fixed)
    ObjectId.random.copy(buf, 7);

    // counter (3 bytes, increment each call)
    ObjectId.counter = (ObjectId.counter + 1) & 0xffffff;
    buf[11] = (ObjectId.counter >> 16) & 0xff;
    buf[12] = (ObjectId.counter >> 8) & 0xff;
    buf[13] = ObjectId.counter & 0xff;

    this.data = buf;
  }

  static generate(type?: number): ObjectId {
    return new ObjectId(type ?? 0, Date.now());
  }
  
  toString(encoding?: 'hex' | 'base64'): string {
    return this.data.toString(encoding ?? 'hex');
  }
}