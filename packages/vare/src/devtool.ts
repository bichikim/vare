const target: any = typeof window !== 'undefined'
  ? window
  : typeof global !== 'undefined'
    ? global
    : {}

export type StorageName = 'session' | 'local'

export class FakeStorage implements Storage {
  readonly length: number = 0
  clear(): void {
    // empty
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getItem(key: string): string | null {
    return null
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  key(index: number): string | null {
    return null
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  removeItem(key: string): void {
    // empty
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setItem(key: string, value: string): void {
    // empty
  }
}

const fakeStorage = new FakeStorage()

export const getStorage = (name: StorageName): Storage => {
  if (typeof window === 'undefined') {
    return fakeStorage
  }
  return name === 'local' ? localStorage : sessionStorage
}

export const saveStorage = (name: StorageName, key: string, value: any[] | Record<string, any>) => {
  const storage = getStorage(name)
  try {
    const raw = JSON.stringify(value)
    storage.setItem(key, raw)
  } catch {
    return undefined
  }
}

export const readStorage = <T extends any[] | Record<string, any>>(
  name: StorageName,
  key: string,
  failBackValue: any = {},
): T => {
  const storage = getStorage(name)
  try {
    const raw = storage.getItem(key)
    if (raw) {
      return JSON.parse(raw)
    }
    return failBackValue
  } catch {
    return failBackValue
  }
}

export interface DevtoolPayload {
  kind: string
  storeName: string
  name: string
  args?: any[]
  state: any
}

const STORAGE_NAME_DECO = 'devtool:vare'

export class Devtool {
  emit(options: DevtoolPayload) {
    if (process.env.NODE_ENV === 'development') {
      console.log(options)
      const {storeName, kind, name, args = [], state} = options
      const key = `${STORAGE_NAME_DECO}:${storeName}:${kind}:${name}`
      const previous = readStorage<any[]>('session', key, [])
      previous.push({
        args,
        state,
      })
      saveStorage('session', key, previous)
    }
  }

  on() {
    // empty
  }
}

const devtool = new Devtool()

export function _triggerDevToolAction(storeName: string, name: string, args: any[], state: any): void {
  if (process.env.NODE_ENV === 'development') {
    devtool.emit({
      kind: 'action',
      storeName,
      name,
      args,
      state,
    })
  }
}

export function _triggerDevToolMutation(storeName: string, name: string, args: any[], state: any): void {
  if (process.env.NODE_ENV === 'development') {
    devtool.emit({
      kind: 'mutation',
      storeName,
      name,
      args,
      state,
    })
  }
}

export function _triggerDevToolInit(storeName: string, state: any): void {
  if (process.env.NODE_ENV === 'development') {
    setTimeout(() => {
      devtool.emit({
        kind: 'init',
        name: 'init',
        storeName,
        state,
      })
    })
  }
}
