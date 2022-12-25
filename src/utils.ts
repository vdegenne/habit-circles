export async function sleep (ms: number) {
  return new Promise(r => setTimeout(r, ms))
}

export async function goTo (url = '/') {
  window.location.hash = url
}