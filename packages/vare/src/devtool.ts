const target: any = typeof window !== 'undefined'
  ? window
  : typeof global !== 'undefined'
    ? global
    : {}
const devtoolHookMock = {
  emit: () => null,
  on: () => null,
}
const devtoolHook = target.__VUE_DEVTOOLS_GLOBAL_HOOK__ ?? devtoolHookMock

export function _triggerDevToolAction(storeName: string, name: string, args: any[], state: any): void {
  if (process.env.NODE_ENV === 'development') {
    devtoolHook.emit(
      'vuex:action',
      {
        type: `${storeName}:${name}`,
      },
      state,
    )
  }
}

export function _triggerDevToolMutation(storeName: string, name: string, args: any[], state: any): void {
  if (process.env.NODE_ENV === 'development') {
    devtoolHook.emit(
      'vuex:mutation',
      {
        type: `${storeName}:${name}`,
      },
      state,
    )
  }
}

export function _triggerDevToolInit(state): void {
  if (process.env.NODE_ENV === 'development') {
    setTimeout(() => {
      devtoolHook.emit(
        'vuex:init',
        {
          state,
          replaceState: function (state) {
            console.log(state)
          },
        },
      )
    })
  }
}
