interface BaseEntityContract<T> {
  serialize(): Record<string, any>
  merge(data: Partial<T>): T
}

export default BaseEntityContract
