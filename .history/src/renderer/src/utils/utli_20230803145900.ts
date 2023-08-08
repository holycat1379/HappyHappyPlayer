// 检查是否为日文
function check_is_jp(text) {
  const reg = /[\u0800-\u4e00]+/
  return reg.test(text)
}
