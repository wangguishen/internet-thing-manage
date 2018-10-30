/**
 * 物联框架资源service层
 * @authors jp
 * @date    2018-04-23
 */

import axios from '@/config/api.js'

/*SDK*/
//查询
export const querySdkInfo = params => axios.get('/iot-frame/querySdkInfo', params)
//创建
export const addSdkInfo = params => axios.post('/iot-frame/addSdkInfo', params)
//删除
export const deleteSdkInfo = params => axios.post('/iot-frame/deleteSdkInfo', params)
//修改
export const updateSdkInfo = params => axios.post('/iot-frame/updateSdkInfo', params)
//多条件查询
export const querySdkInfoList = (page, params) => axios.post('/iot-frame/querySdkInfoList' + page, params)
//续签查询
export const queryVisaInfo = params => axios.get('/iot-frame/queryVisaInfo', params)
//续签修改
export const updateVisaInfo = params => axios.post('/iot-frame/updateVisaInfo', params)

/*服务器环境*/
//查询
export const queryServerInfoList = (page, params) => axios.post('/iot-frame/queryServerInfoList' + page, params)
//新增
export const addServerInfo = params => axios.post('/iot-frame/addServerInfo', params)
//查询IP是否重复
export const checkIPExist = params => axios.get('/iot-frame/checkIPExist', params)
//修改
export const updateServerInfo = params => axios.post('/iot-frame/updateServerInfo', params)
//删除
export const deleteServerInfo = params => axios.post('/iot-frame/deleteServerInfo', params)

/*登录页面*/
export const submitLogin = params => axios.post('/iot-frame/login', params)

//验证码测试环境路径
export const ValiCodeUrl = '/iot-frame/createValicode'

/*任务接口*/
//查询任务
export const queryTaskInfo = params => axios.get('/iot-frame/queryTaskInfo', params)
//创建任务
export const addTaskInfo = params => axios.post('/iot-frame/addTaskInfo', params)
//修改任务
export const updateTaskInfo = params => axios.post('/iot-frame/updateTaskInfo', params)
//删除任务
export const deleteTaskInfo = params => axios.post('/iot-frame/deleteTaskInfo', params)
//多条件查询任务
export const queryTaskInfoList = (page, params) => axios.post('/iot-frame/queryTaskInfoList' + page, params)

/*APK*/
//多条查询
export const queryApkInfoAll = (page, params) => axios.post('/iot-frame/queryFileList' + page, params)

/*单条查询*/
export const queryApkInfo = params => axios.get('/iot-frame/findFileById', params)

/*新增*/
export const addAPKInfo = params => axios.post('/iot-frame/addFileInfo', params)

/*修改*/
export const amendAPKInfo = params => axios.post('/iot-frame/updateFileInfo', params)

/*删除*/
export const deleteAPKInfo = params => axios.post('/iot-frame/deleteFileInfo', params)

/*分发列表*/
export const dispatcherAPKListInfo = (page, params) => axios.post('/iot-frame/queryDispatchTask' + page, params)

/*分发*/
export const dispatcherAPKInfo = params => axios.post('/iot-frame/dispatcherFile', params)

/*安装包审核列表接口*/
export const queryFileTask = (page, params) => axios.post('/iot-frame/queryFileTask' + page, params)

/*新增算法*/
export const addAlgorithmInfo = params => axios.post('/iot-frame/addAlgorithmInfo', params)

/*查询算法列表*/
export const queryAlgorithmInfoList = (page, params) => axios.post('/iot-frame/queryAlgorithmInfoList' + page, params)

/*查询算法单个*/
export const queryAlgorithmInfo = id => axios.get('/iot-frame/queryAlgorithmInfo' + id)

/*修改算法*/
export const updateAlgorithmInfo = params => axios.post('/iot-frame/updateAlgorithmInfo', params)

/*删除算法*/
export const deleteAlgorithmInfo = params => axios.post('/iot-frame/deleteAlgorithmInfo', params)

/*算法订购新增*/
export const addOrderRecord = params => axios.post('/iot-frame/addOrderRecord', params)

/*算法订购*/
export const queryOrderRecordList = (page, params) => axios.post('/iot-frame/queryOrderRecordList' + page, params)

/*算法订购列表查询*/
export const queryCompAlgoList = (page, params) => axios.post('/iot-frame/queryCompAlgoList' + page, params)

/*算法申请审核*/
export const approveAlgorithm = params => axios.post('/iot-frame/approveAlgorithm', params)

/*算法纪录查询*/
export const queryCompanyRecord = (page, params) => axios.post('/iot-frame/queryCompanyRecord' + page, params)

/*算法分类新增*/
export const addAlgorithmType = params => axios.post('/iot-frame/addAlgorithmType', params)

/*算法分类查询*/
export const queryAlgorithmTypeList = (page, params) => axios.post('/iot-frame/queryAlgorithmTypeList' + page, params)

/*算法分类修改*/
export const updateAlgorithmType = params => axios.post('/iot-frame/updateAlgorithmType', params)

/* 新增管理员 */
export const addAdmin = params => axios.post('/iot-frame/addAdmin', params)

/* 查询管理员列表 */
export const queryAdminList = (page, params) => axios.post('/iot-frame/queryAdminList' + page, params)

/*删除管理员*/
export const deleteAdmin = params => axios.post('/iot-frame/deleteAdmin', params)

/*查询公司权限列表*/
export const queryCompAuth = (page, params) => axios.post('/iot-frame/queryCompAuth' + page, params)

/*公司授权类别*/
export const algoAuthorization = params => axios.post('/iot-frame/algoAuthorization', params)

/*查询申请纪录*/
export const queryApplicationRecord = (page, params) => axios.post('/iot-frame/queryApplicationRecord' + page, params)

/* 分页查询下载纪录 */
export const queryDownloadRecordList = (page, params) => axios.post('/iot-frame/queryDownloadRecordList' + page, params)

/* 查询秘钥列表接口 */
export const querySecretKeyList = (page, params) => axios.post('/iot-frame/querySecretKeyList' + page, params)

/* 查询秘钥审核接口 */
export const querySecretKeyInfoTask = (page, params) => axios.post('/iot-frame/querySecretKeyInfoTask' + page, params)

/* 查询秘钥审核详情接口 */
export const queryCompanyInfo = params => axios.get('/iot-frame/queryCompanyInfo', params)

/* 重新生成秘钥 */
export const reapplyKey = params => axios.post('/iot-frame/reapplyKey', params)

/* 修改秘钥状态 */
export const updateSecretKeyState = params => axios.post('/iot-frame/updateSecretKeyState', params)

/* 添加秘钥 */
export const addSecretKey = params => axios.post('/iot-frame/addSecretKey', params)

/* 同意秘钥审核 */
export const approveSecretKey = params => axios.post('/iot-frame/approveSecretKey', params)

/* 退出 */
export const loginOut = params => axios.get('/iot-frame/loginOut' + params)

/* 新增实验室 */
export const addLaboratory = params => axios.post('/iot-frame/addLaboratory', params)

/* 单条查询实验室 */
export const queryLaboratory = page => axios.get('/iot-frame/queryLaboratory' + page)

/* 查询实验室 */
export const queryLaboratoryList = (page, params) => axios.post('/iot-frame/queryLaboratoryList' + page, params)

/* 修改实验室 */
export const updateLaboratory = params => axios.post('/iot-frame/updateLaboratory', params)

/* 删除实验室 */
export const deleteLaboratory = params => axios.post('/iot-frame/deleteLaboratory', params)

/* 查询消息发送历史 */
export const queryMessageList = (page, params) => axios.post('/iot-frame/queryMessageList' + page, params)

/* 算法续签接口 */
export const queryRenew = params => axios.post('/iot-frame/renew', params)

/* 企业算法续签记录查询接口 */
export const queryRenewRecord = (page, params) => axios.post('/iot-frame/renewRecord' + page, params)

/* 算法续签审批操作接口 */
export const queryApproveRenew = params => axios.post('/iot-frame/approveRenew', params)

/* 接口配置路径 */
export const addAlgorithmPath = params => axios.post('/iot-frame/addAlgorithmPath', params)