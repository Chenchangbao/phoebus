import overview from './overview/overview';
import headerCD from './headerCD/headerCD';

import appz from './app/app';
import appProcess from './app/process/appProcess';

import assemblyLineDetail from './assemblyLineDetail/assemblyLineDetail';
import createAssemblyLine from './createAssemblyLine/createAssemblyLine';

import dictItem from './dictItem/dictItem';
import dictItemEdit from './dictItem/editDictItem/editDictItem';

import flowList from './flow/flowList';
import createFlow from './flow/create/createFlow';
import addGroupName from './flow/create/addGroupName/addGroupName';
import taskList from './flow/create/taskList/taskList';

import message from './message/message';

import editFlow from './flow/edit/editFlow';
import detailFlow from './flow/detail/detailFlow';
import flowHistoryDetail from './flow/detail/flowHistoryDetail';
import alertCtrl from './app/alert/alert';

export default app => {
    INCLUDE_ALL_MODULES([overview,headerCD,appz,appProcess,assemblyLineDetail,createAssemblyLine,dictItem,dictItemEdit,flowList,createFlow,addGroupName,taskList,message,editFlow,detailFlow,alertCtrl,flowHistoryDetail], app)
};