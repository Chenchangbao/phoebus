/**
 * Created by 17030515 on 2017/3/27.
 */
import {
    Inject
} from 'business/decorator/decorator';

@Inject
class TaskListCtrl {
    constructor($scope, HttpService, DialogService, $state, AlertService) {
        let vm = $scope;
        vm.taskTypeList=[];
        vm.pagination = {};
        vm.pagination.page = 1;
        vm.pagination.pageSize = 10;
        vm.pagination.totalCount = 0;
        init();
        function init() {
            HttpService.get('dictItem/queryByTypeCode/1').then(d => {
                //vm.sysList=d.data;
                vm.taskTypeList = d;
            });

            vm.pagination.data=[{"taskId":1,"taskName":"测试任务","createUser":"赵贤成",taskType:"1"},{"taskId":2,"taskName":"测试任务1","createUser":"赵贤成",taskType:"1"}];
            vm.pagination.totalCount = vm.pagination.data.length;
        }
        var selectTaskList=[];
        vm.selectTask = (evt,item)=> {
            if($(evt.currentTarget).prop("checked")){
                selectTaskList.push(item);
            }else {
                angular.forEach(selectTaskList,function (it,idx) {
                    if(it.taskId==item.taskId){
                        selectTaskList.splice(idx,1);
                        return false;
                    }
                })
            }
        }

        vm.close = () => {
            // way 1:
            DialogService.dismiss(vm.key);

            // or
            DialogService.refuse(vm.key, 'dialog refuse! cancel!');
        };

        //提交
        vm.save = () => {
            //参数验证
            vm.data.callback(selectTaskList);
            //取出真实的父scope
            //let parentScope=vm.$parent.data.parentScope;
            //parentScope.createProcess(vm.data.index, vm.group.groupName);
            vm.close();
        };
    }
}
export default app => {
    app.controller('TaskListCtrl', TaskListCtrl);
};