import {State} from '@/state'
import {setupDevtoolsPlugin, DevtoolsPluginApi, StateBase} from '@vue/devtools-api'
import {App} from 'vue'
import {createGetStates} from './get-states'
import {genInspectorTree} from './gen-inspector-tree'

export type GetStates = () => Record<string, Omit<StateBase, 'key'>>

export const INSPECTOR_ID = 'com.npmjs.packages.vare'

export const startDevtool = (app: App, states: Record<string, State<any>>) => {
  let _api: DevtoolsPluginApi
  const inspectorId = 'vare-state-tree'
  const getStates = createGetStates(states)

  setupDevtoolsPlugin({
    app,
    label: 'Vare',
    id: INSPECTOR_ID,
    packageName: 'vare',
  }, (api) => {
    _api = api
    api.addInspector({
      id: inspectorId,
      label: 'vare tree inspector',
      icon: 'tab_unselected',
      treeFilterPlaceholder: 'Search for vare...',
    })

    api.on.getInspectorTree((payload) => {
      if (payload.inspectorId !== INSPECTOR_ID) {
        return
      }

      payload.rootNodes = genInspectorTree(states)
    })

    api.on.getInspectorState((payload) => {
      if (payload.inspectorId !== inspectorId) {
        return
      }

      const states = getStates()

      payload.state = {
        state: [{
          key: payload.nodeId,
          ...states[payload.nodeId],
        }],
      }
    })
  })

  const updateTree = () => {
    _api?.sendInspectorTree(inspectorId)
  }

  const updateState = () => {
    _api.sendInspectorState(inspectorId)
  }

  return {
    updateTree,
    updateState,
  }
}
