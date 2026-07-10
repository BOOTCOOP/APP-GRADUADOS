import axios from 'axios'

import authenticate from '@/middlewares/authenticate'
import forceUpdate from '@/middlewares/forceUpdate'
import token from '@/middlewares/token'
import validationManager from '@/middlewares/validationManager'

const api_url = process.env.VUE_APP_API_URL

const axiosIns = axios.create({
  baseURL: api_url,
  withCredentials: true,
})

token(axiosIns)
authenticate(axiosIns)
validationManager(axiosIns)
forceUpdate(axiosIns)

export default axiosIns
