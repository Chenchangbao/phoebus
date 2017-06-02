/**
 * Created by 17030515 on 2017/6/1.
 */
import {
    Inject
} from 'business/decorator/decorator'
@Inject
class FlowHistoryDetailCtrl {
    constructor($scope,HttpService,DialogService,$stateParams, $state,$timeout, $q, $rootScope) {
        let vm = $scope;
        vm.initNum = 2;
        init();
        vm.flow={};
        vm.sysList=[];
        function init(){
            HttpService.get('flow/listSystemByLoginUser').then(function (result) {
                vm.sysList = result;
            });

            HttpService.get('flow/log/getDetail/'+vm.data.id).then(function (result) {
                vm.flow=result.flow;
                vm.nodeGroupList=result.nodeGroupList;
                vm.history=result.flowExeLogPO;
                vm.nodeGroupList.splice(0,0,{"groupName":"开始","groupType":0,"flowNodeList":[],"childListNum":0});
                vm.nodeGroupList.push({"groupName":"结束","groupType":-1,"flowNodeList":[],"childListNum":0});
            });
        }

        vm.close = () => {
            // way 1:
            DialogService.dismiss(vm.key);

            // or
            DialogService.refuse(vm.key, 'dialog refuse! cancel!');
        };
    }
}

export default app => app.controller('FlowHistoryDetailCtrl', FlowHistoryDetailCtrl)
