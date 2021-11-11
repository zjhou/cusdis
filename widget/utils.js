function postMessage(event, data = {}) {
  window.parent.postMessage(
    JSON.stringify({
      from: 'cusdis',
      event,
      data,
    }),
  )
}

export {
  postMessage
}
