// Hooks added here have a bridge allowing communication between the BEX Content Script and the Quasar Application.
// More info: https://quasar.dev/quasar-cli/developing-browser-extensions/content-hooks

export default function attachContentHooks(bridge) {
  // Hook into the bridge to listen for events sent from the client BEX.
  /*
  bridge.on('some.event', event => {
    if (event.data.yourProp) {
      // Access a DOM element from here.
      // Document in this instance is the underlying website the contentScript runs on
      const el = document.getElementById('some-id')
      if (el) {
        el.value = 'Quasar Rocks!'
      }
    }
  })
  */

  // bridge.on('')

  // bridge.on('tick', event => {
  //   const el = document.body
  //   el.style.background = 'green'
  // })

  window.addEventListener('resize', () => {
    bridge.send('change-vare', {foo: 'foo'})
  })

  window.addEventListener('__change_vare__', () => {
    bridge.send('change-vare', {foo: 'foo'})
  })
}

// var foo = new CustomEvent('change-vare')
