export class ExecutionCache<TInputs extends Array<unknown>, TOutput> {

  private cache = new Map<string, Promise<TOutput>>();

  constructor(private readonly handler: (...args: TInputs) => Promise<TOutput>) {}

  async fire(key: string, ...args: TInputs): Promise<TOutput> {
    if (!this.cache.has(key)) {
      const promise = this.handler(...args)
        .then((result) => {
          return result;
        })
        .catch((err) => {
          // If handler fails, remove from cache so it can be retried
          this.cache.delete(key);
          throw err;
        });

      this.cache.set(key, promise);
    }

    return this.cache.get(key)!;
  }
}
