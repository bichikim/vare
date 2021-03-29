import {setupDevtoolsPlugin, DevtoolsPluginApi} from '@vue/devtools-api'
import {App} from 'vue'

export type GetVare = () => any[]

export const startDevTool = (app: App, getVare: GetVare) => {
  let _api: DevtoolsPluginApi
  const inspectorId = 'vare-state-tree'

  setupDevtoolsPlugin({
    app,
    label: 'Vare',
    id: 'com.npmjs.packages.vare',
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
      if (payload.inspectorId !== inspectorId) {
        return
      }
      payload.rootNodes = []
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
