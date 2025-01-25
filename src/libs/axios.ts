import axios from 'axios'

import authenticate from '@/middlewares/authenticate'
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

export default axiosIns
