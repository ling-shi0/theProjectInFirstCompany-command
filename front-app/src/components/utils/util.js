const isMobile = () => {
  const p = window.navigator.platform
  return p.indexOf('Linux arm') > -1 || p.indexOf('iphone') > -1 || p.indexOf('Linux') > -1 || p.indexOf('iPhone') > -1
}

export default {
  isMobile
}
