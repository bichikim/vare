import {State} from '@/state'
import {setupDevtoolsPlugin, DevtoolsPluginApi, StateBase} from '@vue/devtools-api'
import {App} from 'vue'
import {createGetStates} from './get-states'
import {genInspectorTree} from './gen-inspector-tree'
import {isSSR} from '@/is-ssr'
import {AllKinds, drop, getType, getName, getDescription} from '@/utils'

export type GetStates = () => Record<string, Omit<StateBase, 'key'>>

export const DEVTOOL_ID = 'com.npmjs.packages.vare'

export const startDevtool = (app: App, states: Record<string, State<any>>) => {
  if (isSSR()) {
    return
  }

  let _api: DevtoolsPluginApi
  const inspectorId = 'vare-structure'
  const actionTimelineId = 'vare-action'
  const mutationTimeLineId = 'var-mutation'
  let relationMap: Map<string, AllKinds> = new Map<string, AllKinds>()
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
      label: 'Vare Structure',
      icon: 'mediation',
      treeFilterPlaceholder: 'Search for Vare',
      stateFilterPlaceholder: 'Search for state',
    })

    api.addTimelineLayer({
      id: actionTimelineId,
      label: 'Vare Actions',
      color: 0xf08d49,
    })

    api.addTimelineLayer({
      id: mutationTimeLineId,
      label: 'Vare Mutation',
      color: 0x3eaf7c,
    })

    api.on.getInspectorTree((payload) => {
      if (payload.app !== app || payload.inspectorId !== inspectorId) {
        return
      }

      const {nodes, relationMap: _relationMap} = genInspectorTree(states)
      relationMap = _relationMap

      payload.rootNodes = nodes
    })

    api.on.getInspectorState((payload) => {
      if (payload.app !== app || payload.inspectorId !== inspectorId) {
        return
      }

      const states = getStates()

      const state = states[payload.nodeId]

      if (state) {
        payload.state = {
          state: [{
            key: payload.nodeId,
            ...state,
          }],
        }
        return
      }

      const member = relationMap.get(payload.nodeId)

      const type = getType(member) ?? 'unknown'

      const raw = member?.toString() ?? 'empty'

      const description = getDescription(member)

      payload.state = {
        [type]: [{
          key: getName(member),
          value: {
            _custom: {
              display: description ?? 'none',
              type: 'function',
              tooltip: raw,
            },
          },
          editable: false,
          raw,
        }],
        // WIP
        relate: [{
          key: 'foo',
          editable: false,
          value: {
            _custom: {
              display: 'state WIP',
            },
          },
        }],
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
