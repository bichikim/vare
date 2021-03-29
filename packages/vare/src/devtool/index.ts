import {State} from '@/state'
import {setupDevtoolsPlugin, DevtoolsPluginApi, StateBase} from '@vue/devtools-api'
import {App} from 'vue'
import {createGetStates} from './get-states'
import {genInspectorTree} from './gen-inspector-tree'
import {isSSR} from '@/is-ssr'

export type GetStates = () => Record<string, Omit<StateBase, 'key'>>

export const DEVTOOL_ID = 'com.npmjs.packages.vare'

export const drop = (array: any[]) => {
  const value = [...array]
  value.shift()
  return value
}

export const startDevtool = (app: App, states: Record<string, State<any>>) => {
  if (process.env.NODE_ENV !== 'development') {
    return
  }

  if (isSSR()) {
    return
  }

  let _api: DevtoolsPluginApi
  const inspectorId = 'vare-state-tree'
  const getStates = createGetStates(states)

  setupDevtoolsPlugin({
    app,
    label: 'Vare',
    id: DEVTOOL_ID,
    packageName: 'vare',
  }, (api) => {
    _api = api
    api.addInspector({
      id: inspectorId,
      label: 'vare tree inspector',
      icon: 'mediation',
      treeFilterPlaceholder: 'Search for Vare',
      stateFilterPlaceholder: 'Search for state',
    })

    api.on.getInspectorTree((payload) => {
      if (payload.app !== app || payload.inspectorId !== inspectorId) {
        return
      }

      payload.rootNodes = genInspectorTree(states)
    })

    api.on.getInspectorState((payload) => {
      if (payload.app !== app || payload.inspectorId !== inspectorId) {
        return
      }

      const states = getStates()

      payload.state = {
        state: [{
          key: payload.nodeId,
          ...states[payload.nodeId],
        }],
        computation: [],
        mutation: [],
        action: [],
      }
    })

    api.on.editInspectorState((payload) => {
      if (payload.app !== app || payload.inspectorId !== inspectorId) {
        return
      }

      const state = states[payload.nodeId]

      if (!state) {
        return
      }

      const path = drop(payload.path)
      const value = payload.state.value

      payload.set(state, path, value)
    })
  })

  const updateTree = () => {
    _api?.sendInspectorTree(inspectorId)
  }

  const updateState = () => {
    _api.sendInspectorState(inspectorId)
  }

  updateTree()

  return {
    updateTree,
    updateState,
  }
}
