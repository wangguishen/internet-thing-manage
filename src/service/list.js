/**
 * service层
 * @authors jp
 * @date    2018-04-03
 */

import axios from '@/config/api.js';

export const queryList = params => axios.get('/legal-advice/query_list', params)

/*export const verServer = params => axios.post('/zqi_vercenter/verServer', params)*/

export const verServer = params => axios.post('/iot-frame/vrServer', params)

export const uploadImg = params => axios.post('/zqi_appstore/admin/uploadImg.do', params)

// export const uploadModule = params => axios.get('/zqi_appstore/admin/downDeviceTemplate.do', params)

export const uploadModule = params => axios.get('/zqi_appstore/admin/addDevice.do', params)

export const companyList = params => axios.post('/UAMS/company/do_comp_single_query_bycompanycode', params)

export const companySingle = params => axios.post('/UAMS/company/do_comp_query?pageSize=10000&currentPage=1', params)
