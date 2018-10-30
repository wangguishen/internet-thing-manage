import Vue from 'vue';
import Router from 'vue-router';
Vue.use(Router);

const routes = [
  {
   path: '*',
   component: resolve => require(['@/page/common/404.vue'], resolve)
  },
  {
    path: '/',
    component: resolve => require(['@/page/login.vue'], resolve)
  },
  {
    path: '/login',
    component: resolve => require(['@/page/login.vue'], resolve)
  },
  {
    path: '/home',
    component: resolve => require(['@/page/home.vue'], resolve),
    meta: {
      requireAuth: true
    },
    children: [
      {
        path: '/internet-thing/index',  //物联框架首页
        component: resolve => require(['@/page/internet-thing/index.vue'], resolve),
        meta: {
          requireAuth: true
        }
      },
      {
        path: '/applicationList',  //应用管理 -- 应用列表
        component: resolve => require(['@/page/internet-thing/app-authority/app-manage/application-list.vue'], resolve),
        meta: {
          requireAuth: true
        }
      },
      {
        path: '/addApplication',  //应用管理 -- 新增应用
        component: resolve => require(['@/page/internet-thing/app-authority/app-manage/addApplication.vue'], resolve),
        meta: {
          requireAuth: true
        }
      },
      {
        path: '/applicationDetails',  //应用管理 -- 应用详情
        component: resolve => require(['@/page/internet-thing/app-authority/app-manage/application-details.vue'], resolve),
        meta: {
          requireAuth: true
        }
      },
      {
        path: '/companyGather',  //公司应用 -- 公司列表主页面
        component: resolve => require(['@/page/internet-thing/app-authority/company-app/company-gather.vue'], resolve),
        meta: {
          requireAuth: true
        }
      },
      {
        path: '/companyAdd',  //公司应用 -- 公司新增与公司修改公共页面
        component: resolve => require(['@/page/internet-thing/app-authority/company-app/company-add.vue'], resolve),
        meta: {
          requireAuth: true
        }
      },
      {
        path: '/companyDetails',  //公司应用 -- 当前公司详情页面
        component: resolve => require(['@/page/internet-thing/app-authority/company-app/company-details.vue'], resolve),
        meta: {
          requireAuth: true
        }
      },
      {
        path: '/companyFacility',  //公司应用 -- 公司设备展示页面
        component: resolve => require(['@/page/internet-thing/app-authority/company-app/company-facility.vue'], resolve),
        meta: {
          requireAuth: true
        }
      },
      {
        path: '/companyAppDetails',  //公司应用 -- 公司应用关联页面
        component: resolve => require(['@/page/internet-thing/app-authority/company-app/company-app-details.vue'], resolve),
        meta: {
          requireAuth: true
        }
      },
      {
        path: '/facilityList',  //终端设备 -- 终端设备主页面
        component: resolve => require(['@/page/internet-thing/terminal-manage/terminal-facility/facility-list.vue'], resolve),
        meta: {
          requireAuth: true
        }
      },
      {
        path: '/facilityAdd',  //终端设备 -- 终端设备新增页面
        component: resolve => require(['@/page/internet-thing/terminal-manage/terminal-facility/facility-add.vue'], resolve),
        meta: {
          requireAuth: true
        }
      },
      {
        path: '/facilityBatchenter',  //终端设备 -- 终端设备批量录入
        component: resolve => require(['@/page/internet-thing/terminal-manage/terminal-facility/facility-batchenter.vue'], resolve),
        meta: {
          requireAuth: true
        }
      },
      {
        path: '/terminal-authority/list',  //终端管理- 终端权限展示页面
        component: resolve => require(['@/page/internet-thing/terminal-manage/terminal-authority/list.vue'], resolve),
        meta: {
          requireAuth: true
        }
      },
      {
        path: '/terminal-authority/setting',  //终端管理- 设置页面
        component: resolve => require(['@/page/internet-thing/terminal-manage/terminal-authority/setting.vue'], resolve),
        meta: {
          requireAuth: true
        }
      },
      {
        path: '/calculate/index',  //计算框架首页
        component: resolve => require(['@/page/calculate/index.vue'], resolve),
        meta: {
          requireAuth: true
        }
      },
      {
        path: '/operationSDK',  //SDK首页
        component: resolve => require(['@/page/internet-thing/resource-manage/SDK/operationSDK.vue'], resolve),
        meta: {
          requireAuth: true
        }
      },
      {
        path: '/operationSDKAdd',  //SDK新增
        component: resolve => require(['@/page/internet-thing/resource-manage/SDK/operationSDKAdd.vue'], resolve),
        meta: {
          requireAuth: true
        }
      },
      {
        path: '/operationSDKAmend',  //SDK修改
        component: resolve => require(['@/page/internet-thing/resource-manage/SDK/operationSDKAmend.vue'], resolve),
        meta: {
          requireAuth: true
        }
      },
      {
        path: '/operationSDKDetail',  //SDK详情
        component: resolve => require(['@/page/internet-thing/resource-manage/SDK/operationSDKDetail.vue'], resolve),
        meta: {
          requireAuth: true
        }
      },
      {
        path: '/operationSDKRenew',  //SDK续签
        component: resolve => require(['@/page/internet-thing/resource-manage/SDK/operationSDKRenew.vue'], resolve),
        meta: {
          requireAuth: true
        }
      },
      {
        path: '/operationSDKDistribute',  //SDK分发
        component: resolve => require(['@/page/internet-thing/resource-manage/SDK/operationSDKDistribute.vue'], resolve),
        meta: {
          requireAuth: true
        }
      },
      {
        path: '/operationSDKCheck',  //SDK审核
        component: resolve => require(['@/page/internet-thing/resource-manage/SDK/operationSDKCheck.vue'], resolve),
        meta: {
          requireAuth: true
        }
      },
      {
        path: '/operationServer',  //服务器环境列表
        component: resolve => require(['@/page/internet-thing/resource-manage/Server/operationServer.vue'], resolve),
        meta: {
          requireAuth: true
        }
      },
      {
        path: '/operationServerAdd',  //服务器环境 -- 新增
        component: resolve => require(['@/page/internet-thing/resource-manage/Server/operationServerAdd.vue'], resolve),
        meta: {
          requireAuth: true
        }
      },
      {
        path: '/operationServerDetail',  //服务器环境 -- 详情
        component: resolve => require(['@/page/internet-thing/resource-manage/Server/operationServerDetail.vue'], resolve),
        meta: {
          requireAuth: true
        }
      },
      {
        path: '/operationServerDistribute',  //服务器环境 -- 分发
        component: resolve => require(['@/page/internet-thing/resource-manage/Server/operationServerDistribute.vue'], resolve),
        meta: {
          requireAuth: true
        }
      },
      {
        path: '/operationServerAmend',  //服务器环境 -- 修改
        component: resolve => require(['@/page/internet-thing/resource-manage/Server/operationServerAmend.vue'], resolve),
        meta: {
          requireAuth: true
        }
      },
      {
        path: '/operationAPK',  //安装包列表
        component: resolve => require(['@/page/internet-thing/resource-manage/APK/operationAPK.vue'], resolve),
        meta: {
          requireAuth: true
        }
      },
      {
        path: '/operationAPKAdd',  //安装包 -- 新增
        component: resolve => require(['@/page/internet-thing/resource-manage/APK/operationAPKAdd.vue'], resolve),
        meta: {
          requireAuth: true
        }
      },
      {
        path: '/operationAPKDetail',  //安装包 -- 详情
        component: resolve => require(['@/page/internet-thing/resource-manage/APK/operationAPKDetail.vue'], resolve),
        meta: {
          requireAuth: true
        }
      },
      {
        path: '/operationAPKAmend',  //安装包 -- 修改
        component: resolve => require(['@/page/internet-thing/resource-manage/APK/operationAPKAmend.vue'], resolve),
        meta: {
          requireAuth: true
        }
      },
      {
        path: '/operationAPKDistribute',  //安装包 -- 分发
        component: resolve => require(['@/page/internet-thing/resource-manage/APK/operationAPKDistribute.vue'], resolve),
        meta: {
          requireAuth: true
        }
      },
      {
        path: '/operationAPKTwin',  //安装包 -- 分发列表页
        component: resolve => require(['@/page/internet-thing/resource-manage/APK/operationAPKTwin.vue'], resolve),
        meta: {
          requireAuth: true
        }
      },
      {
        path: '/operationAPKCheck',  //安装包 -- 权限管理
        component: resolve => require(['@/page/internet-thing/resource-manage/APK/operationAPKCheck.vue'], resolve),
        meta: {
          requireAuth: true
        }
      },
      {
        path: '/algorManage',  //算法管理 -- 主页面
        component: resolve => require(['@/page/calculate/algorithm-manage/algorManage.vue'], resolve),
        meta: {
          requireAuth: true
        }
      },
      {
        path: '/algorManageAdd',  //算法管理 -- 新增页面
        component: resolve => require(['@/page/calculate/algorithm-manage/algorManageAdd.vue'], resolve),
        meta: {
          requireAuth: true
        }
      },
      {
        path: '/algorManageDetail',  //算法管理 -- 详情页面
        component: resolve => require(['@/page/calculate/algorithm-manage/algorManageDetail.vue'], resolve),
        meta: {
          requireAuth: true
        }
      },
      {
        path: '/algorManageAmend',  //算法管理 -- 修改页面
        component: resolve => require(['@/page/calculate/algorithm-manage/algorManageAmend.vue'], resolve),
        meta: {
          requireAuth: true
        }
      },
      {
        path: '/algorManageNew',  //算法管理 -- 上传新版页面
        component: resolve => require(['@/page/calculate/algorithm-manage/algorManageNew.vue'], resolve),
        meta: {
          requireAuth: true
        }
      },
      {
        path: '/algorithmOrder',  //算法订购 -- 主页面
        component: resolve => require(['@/page/calculate/algorithm-order/algorithmOrder.vue'], resolve),
        meta: {
          requireAuth: true
        }
      },
      {
        path: '/algorithmSetting',  //算法订购 -- 订购页面
        component: resolve => require(['@/page/calculate/algorithm-order/algorithmSetting.vue'], resolve),
        meta: {
          requireAuth: true
        }
      },
      {
        path: '/applyAudit',  //申请审核
        component: resolve => require(['@/page/calculate/apply-audit/applyAudit.vue'], resolve),
        meta: {
          requireAuth: true
        }
      },
      {
        path: '/applyAuditDetail',  //申请订购详情
        component: resolve => require(['@/page/calculate/apply-audit/applyAuditDetail.vue'], resolve),
        meta: {
          requireAuth: true
        }
      },
      {
        path: '/auditRecord',  //申请纪录
        component: resolve => require(['@/page/calculate/audit-record/auditRecord.vue'], resolve),
        meta: {
          requireAuth: true
        }
      },
      {
        path: '/auditRecordDetail',  //申请纪录详情
        component: resolve => require(['@/page/calculate/audit-record/auditRecordDetail.vue'], resolve),
        meta: {
          requireAuth: true
        }
      },
      {
        path: '/adminList',  //管理员列表
        component: resolve => require(['@/page/empower-manage/admin-manage/adminList.vue'], resolve),
        meta: {
          requireAuth: true
        }
      },
      {
        path: '/addCompAdmin',  //新增公司管理员
        component: resolve => require(['@/page/empower-manage/admin-manage/addCompAdmin.vue'], resolve),
        meta: {
          requireAuth: true
        }
      },
      {
        path: '/addCompAdmin',  //新增公司管理员
        component: resolve => require(['@/page/empower-manage/admin-manage/addCompAdmin.vue'], resolve),
        meta: {
          requireAuth: true
        }
      },
      {
        path: '/compClassChange',  //公司算法类别授权
        component: resolve => require(['@/page/empower-manage/admin-manage/compClassChange.vue'], resolve),
        meta: {
          requireAuth: true
        }
      },
      {
        path: '/classList',  //算法分类列表页
        component: resolve => require(['@/page/calculate/algorithm-class/classList.vue'], resolve),
        meta: {
          requireAuth: true
        }
      },
      {
        path: '/classAdd',  //算法分类新增页
        component: resolve => require(['@/page/calculate/algorithm-class/classAdd.vue'], resolve),
        meta: {
          requireAuth: true
        }
      },
      {
        path: '/classAmend',  //算法分类修改页
        component: resolve => require(['@/page/calculate/algorithm-class/classAmend.vue'], resolve),
        meta: {
          requireAuth: true
        }
      },
      {
        path: '/downRecordList',  //算法下载记录
        component: resolve => require(['@/page/calculate/down-record/downRecordList.vue'], resolve),
        meta: {
          requireAuth: true
        }
      },
      {
        path: '/secretKey',  //秘钥管理页面
        component: resolve => require(['@/page/calculate/secret-key/secretKey.vue'], resolve),
        meta: {
          requireAuth: true
        }
      },
      {
        path: '/secretKeyAudit',  //秘钥审核页面
        component: resolve => require(['@/page/calculate/secret-key-audit/secretKeyAudit.vue'], resolve),
        meta: {
          requireAuth: true
        }
      },
      {
        path: '/secretKeyAuditDetail',  //秘钥审核详情页面
        component: resolve => require(['@/page/calculate/secret-key-audit/secretKeyAuditDetail.vue'], resolve),
        meta: {
          requireAuth: true
        }
      },
      {
        path: '/secretKeyRecord',  //申请记录页面
        component: resolve => require(['@/page/calculate/secret-key-record/secretKeyRecord.vue'], resolve),
        meta: {
          requireAuth: true
        }
      },
      {
        path: '/skrDetail',  //申请记录详情页面
        component: resolve => require(['@/page/calculate/secret-key-record/skrDetail.vue'], resolve),
        meta: {
          requireAuth: true
        }
      },
      {
        path: '/information',  //消息列表页面
        component: resolve => require(['@/page/calculate/information/informationList.vue'], resolve),
        meta: {
          requireAuth: true
        }
      },
      {
        path: '/accreditLab',  //实验室授权
        component: resolve => require(['@/page/calculate/jurisdiction-authorization/accreditLab.vue'], resolve),
        meta: {
          requireAuth: true
        }
      },
      {
        path: '/addLab',  //新增实验室
        component: resolve => require(['@/page/calculate/jurisdiction-authorization/addLab.vue'], resolve),
        meta: {
          requireAuth: true
        }
      },
      {
        path: '/amendLab',  //修改实验室
        component: resolve => require(['@/page/calculate/jurisdiction-authorization/amendLab.vue'], resolve),
        meta: {
          requireAuth: true
        }
      },
      {
        path: '/portShow',  //接口调试展示页面
        component: resolve => require(['@/page/calculate/demo/portShow.vue'], resolve),
        meta: {
          requireAuth: true
        }
      }
    ]
  }
]

const router = new Router({
  routes
});

var localStorage = window.localStorage

router.beforeEach((to, from, next) => {
  var storage = JSON.parse(localStorage.getItem('USER_INFO'))
  console.log(to.query.sessionId)
  if (to.fullPath === '/login' || to.fullPath === '/') {
    if (to.query.sessionId) {
      next({
        path: '/internet-thing/index',
        query: {redirect: to.fullPath}
      })
      return
    }
  }
  if (to.meta.requireAuth) {  // 判断该路由是否需要登录权限
      if (to.query.sessionId) {  // 通过storage判断是否登录
        next()
      } else {
        next({
          path: '/login',
            query: {redirect: to.fullPath}  // 将跳转的路由path作为参数，登录成功后跳转到该路由
        })
      }
    } else {
      next();
    }
})

export default router;