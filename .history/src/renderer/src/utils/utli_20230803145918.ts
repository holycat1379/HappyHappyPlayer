// 检查是否为日文
export function check_is_jp(text: string) {
  const reg = /[\u0800-\u4e00]+/
  return reg.test(text)
}
