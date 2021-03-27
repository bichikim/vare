const EVENT_NAME = '__change_vare__'

export const logDevtool = (detail) => {
  if (window) {
    const event = new CustomEvent(EVENT_NAME, {detail})
    window.dispatchEvent(event)
  }
}
