import { commonApi } from './createApi'
import * as t from './type'

export const getInitDataApi = (params:t.InitDataParams) => commonApi<t.InitData>(
  '',
  params
)