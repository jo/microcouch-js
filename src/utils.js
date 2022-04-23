
export const makeUuid = () => {
  return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  )
}

const encodeHex = data => Array.from(new Uint8Array(data))
  .map(x => ('00' + x.toString(16)).slice(-2))
  .join('')

export const calculateSha1 = async text => {
  const enc = new TextEncoder()
  const bits = enc.encode(text)
  const data = await crypto.subtle.digest('SHA-1', bits)
  return encodeHex(data)
}

export const base64ToBlob = (data, type) => {
  const raw = atob(data)
  const length = raw.length
  const uInt8Array = new Uint8Array(length)
  for (let i = 0; i < length; ++i) {
    uInt8Array[i] = raw.charCodeAt(i)
  }
  return new Blob([uInt8Array], { type })
}

export const blobToBase64 = blob => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => {
      const dec = `data:${blob.type};base64,`
      const data = reader.result.slice(dec.length)
      resolve(data)
    }
    reader.readAsDataURL(blob)
  })
}

