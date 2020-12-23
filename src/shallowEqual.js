export default function shallowEqual(a, b) {
  if (a === b) return true
  if (typeof a === 'object' && typeof b === 'object') {
    const keys = [...Object.keys(a), ...Object.keys(b)]
    return keys.every((key) => a[key] === b[key])
  }
  return false
}
