declare class Queue<ValueType> {
  readonly size: number;
  enqueue(value: ValueType): void;
  dequeue(): ValueType | undefined;
  clear(): void;
  [Symbol.iterator](): IterableIterator<ValueType>;
}

export = Queue;
