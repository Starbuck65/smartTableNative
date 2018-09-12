export const TYPES = {
  LOAD_IP : 'smartTable/settings/LOAD_IP'
}

export const actions = {
  loadIp: (ip) => ({ type: TYPES.LOAD_IP, ip })
}
