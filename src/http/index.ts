import axios, { AxiosInstance, AxiosResponse, AxiosError, Method, AxiosRequestConfig, ResponseType } from 'axios';
import { message } from 'antd';

declare type QueryParams = { [key: string]: any };

class Http {
    private axiosIns: AxiosInstance;
    private pending: Array<{
        t: string;
        f: () => void;
    }> = [];

    constructor() {
        this.axiosIns = axios.create({
            // baseURL: '',
            timeout: 10000,
        });

        this.axiosIns.interceptors.request.use((config: AxiosRequestConfig) => {
            this.removePending(config);
            config.cancelToken = new axios.CancelToken((c) => {
                this.pending.push({
                    t: `${config.url}&${config.method}`,
                    f: c,
                });
            });
            return Promise.resolve(config);
        });

        this.axiosIns.interceptors.response.use((data: AxiosResponse) => {
            this.removePending(data.config);
            return Promise.resolve(data);
        });
    }

    // 登录 不校验token
    public postValidate(url: string, data?: QueryParams | any[], query?: QueryParams) {
        return this.base('post', url, query, data, {}, true);
    }

    // 获取响应头数据
    public getResponseHeader(
        url: string,
        data?: QueryParams,
        query?: QueryParams,
        errorNoAlter?: boolean,
        responseType?: ResponseType,
        headerArr?: string[] | string | undefined
    ) {
        return this.base('post', url, query, data, {}, false, errorNoAlter, responseType, headerArr);
    }

    public async base(
        method: Method,
        url: string,
        params: QueryParams = {},
        data: any,
        header?: any,
        isLogin?: boolean,
        errorNoAlter?: boolean,
        responseType?: ResponseType,
        headerArr?: string[] | string | undefined
    ) {
        return this.axiosIns
            .request({
                url,
                method,
                data,
                params,
                responseType,
                headers: {
                    ...header,
                },
            })
            .then((res: AxiosResponse) => {
                const status = res.status;
                if (status === 200) {
                    if (res.data.errorCode) {
                        if (!errorNoAlter) {
                            message.info(res?.data?.userMessage || '网络异常，请稍后重试');
                        }
                        return;
                    }
                    if (headerArr) {
                        const obj: any = {};
                        if (Array.isArray(headerArr)) {
                            Array.isArray(headerArr) &&
                                headerArr.forEach((i: string) => {
                                    obj[i] = res?.headers?.[i];
                                });
                        } else {
                            obj[headerArr] = res?.headers?.[headerArr];
                        }
                        return { data: res.data, ...obj };
                    }
                    return res.data || {};
                } else {
                    return Promise.reject(res.data || {});
                }
            })
            .catch((err: AxiosError) => {
                const errData = err.response;
                console.log('111',errData);

            });
    }

    private removePending = (config: AxiosRequestConfig) => {
        for (let p = 0, l = this.pending.length; p < l; p++) {
            const pending = this.pending[p];
            if (pending.t === `${config.url}&${config.method}`) {
                pending.f();
                this.pending.splice(p, 1);
                break;
            }
        }
    };
}

export default new Http();
