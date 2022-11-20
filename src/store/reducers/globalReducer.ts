// import { Action, GlobalState } from 'types';
// import { defaultGlobalState } from 'utils/constant';
// import console from 'utils/console';

interface Action {
    type: string;
    data: any;
}

// 登录
interface UserState {
    flag?: string;
    menus?: any[];
    name?: string;
    userId?: string;
    token?: string;
    roleCodes?: any;
    phone?: string | number;
}

// 共有
interface ICommomQuery {
    page?: number;
    limit?: number;
    startTime?: any;
    endTime?: any;
}

// 分级管理
interface Classification extends ICommomQuery {
    enterpriseName?: string;
    userName?: string; // 客户成功经理
    level?: string; // 客户评级（A\B\C\D\E\F）
    expired?: string; // 是否有服务到期
    keywords?: string;

    // 工单
    pageW?: number;
    limitW?: number;
    statusIdW?: string; // 状态
}

// 页面访问日志
interface PlatformJournal extends ICommomQuery {
    username: string; // 操作用户
}

// 角色管理
interface RoleManage extends ICommomQuery {
    currentRole: string; // 当前角色
    roleId: string; // 当前角色ID
    keyword: string;
}

// 定制软件客户端管理
interface CustomizedClientManage {
    page?: number;
    limit?: number;
    fuzzyWords?: string;
    customizedKey?: string;
}

// 直播审核中心
interface AuditLiveManage {
    page?: number;
    limit?: number;
    startTime?: string;
    endTime?: string;
    // ordertime?: string;
    securityLevel?: string; // 直播客户分级 下拉选项 // q1隐藏
    reviewStatus?: string; // 审核状态 下拉选项 // q1隐藏
}

interface LiveManage extends ICommomQuery {
    enterpriseId?: string;
    confNo?: string; // 直播云会议号
}

interface SysUpdate {
    auditEndTime: string;
    page?: number;
    limit?: number;
    startTime?: string | number;
    endTime?: string | number;
    auditStartTime?: string | number;
    showStatus?: string;
    name?: string;
}

export interface GlobalState {
    login?: boolean;
    securityKey?: string;
    host?: string;
    name?: string;
    user?: UserState;
    classification?: Classification;
    platformJournal?: PlatformJournal;
    roleManage?: RoleManage;
    customizedClientManage?: CustomizedClientManage;
    auditLiveManage?: AuditLiveManage;
    liveManage?: LiveManage;
    sysUpdate?: SysUpdate;
}

const defaultGlobalState: GlobalState = {
    login: false,
    securityKey: '',
    host: '',
    name: '',
    user: undefined,
    classification: undefined,
    roleManage: undefined,
};

export const initialGlobalState: GlobalState = Object.assign({}, defaultGlobalState);

export const globalReducer = (state: typeof initialGlobalState, action: Action) => {
    if (!action.type && !action.data) {
        return { ...state };
    }
    switch (action.type) {
        case 'init':
        case 'update':
            return { ...state, ...action.data };
        case 'updateUser':
            if (action.data) {
                return { ...state, user: action.data };
            } else {
                const stateClone = Object.assign({}, state);
                delete stateClone.user;
                return stateClone;
            }
        case 'global_clearUser':
            const cloneState = { ...state };
            delete cloneState.user;
            return { ...cloneState, ...action.data };
        default:
            return state;
    }
};
