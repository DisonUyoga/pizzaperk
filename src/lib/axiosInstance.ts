import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import axios from "axios";
export const BASE_URL = 'https://stripe-payment-ive6.onrender.com'

const axiosInstance: AxiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout: 120000,
  });
  


const request = async function <T>(
  req: AxiosRequestConfig,
): Promise<AxiosResponse<T>> {
  try {
    const response = await axiosInstance(req)
    return response
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e:  any) {
    if (e.response) {
      const {
        status,
        data: { error_message, ...rest },
      } = e.response
      const err = {
        status,
        errorMessage:
          error_message || "Failed to perform request, please try again.",
        ...rest,
      }
      throw err
    } else {
      const errObject = e.toJSON()
      const err = {
        status: errObject.code,
        errorMessage: errObject.message,
        isNetworkError: true,
      }
      throw err
    }
  }
}

export type RequestParameters = {
  url: string
  data?: Object
  params?: object
  method?: string
}
interface ResProps{
  client_secret: string
}
class Request {
  static async get<T>({ url,data, method,params , }: RequestParameters): Promise<AxiosResponse<T>> {
   
    return request({
      method: method || "GET",
      url,
      data,
      params,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }

}

export default Request