// 检查是否为日文
export function check_is_jp(text: string): boolean {
  const reg = /[\u0800-\u4e00]+/
  return reg.test(text)
}
