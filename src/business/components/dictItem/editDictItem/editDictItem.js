/**
 * Created by 17030515 on 2017/3/27.
 */
import {
    Inject
} from 'business/decorator/decorator';

@Inject
class DictItemEditCtrl {
    constructor($scope, HttpService, DialogService, $state, AlertService) {
        let vm = $scope;
        vm.typeCodeList = [];
        vm.dictItem={};
        init();
        function init() {
            HttpService.post('dictItem/queryTypeCodeList', {}).then(function (result) {
                vm.typeCodeList = result;
            });
            if(vm.data && vm.data.id){
                HttpService.post('dictItem/get/'+vm.data.id, {}).then(function (result) {
                    debugger;
                    vm.dictItem = result;
                });
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
            if (!vm.dictItemForm.$valid) {
                return;
            }
            //取出真实的父scope
            let parentScope=vm.$parent.data.parentScope;
            var params = vm.dictItem;
            HttpService.post("dictItem/save",params).then(function (result) {
                AlertService.alert({title:"提示",content:"保存数据字典成功！"});
                vm.close();
                parentScope.paginationSearch(1, parentScope.pagination.pageSize);
            });
        };
    }
}
export default app => {
    app.controller('DictItemEditCtrl', DictItemEditCtrl);
};