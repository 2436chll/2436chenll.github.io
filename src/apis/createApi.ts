import axios from 'axios'

/** 服务端返回的基础数据结构 */
declare interface IResponse<T> {
  success: boolean
  msg: string
  data: T
}

let basename = ''

export const commonApi = <T>(url: string, params = {}) => {
  try {
    return new Promise<T | boolean>(async (resolve, reject) => {
      const { data: { success, data, msg } } = await axios.post<IResponse<T>>(
        `${basename}/${url}`,
        params
      )

      resolve(data || success)

      if (!success) {
        Promise.reject(`请求${url}失败:${msg}`)
      }
    })
  } catch (e) {
    Promise.reject(`请求${url}失败:${e}`)
    return false as T
  }
}