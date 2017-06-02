import {
    Inject
} from 'business/decorator/decorator'

@Inject
class createAssemblyLineCtrl {
    constructor($scope,$stateParams, $state,$timeout, $q, $rootScope) {
        let vm = $scope;
        vm.initNum = 1;
        init();
        function init(){
    		 vm.isFirst = false;
             vm.isSecond = true;
             vm.initNum = 2;
    	}

        vm.crumbBaseData = [
            { href: "/", title: "首页" },
            { href: "/#/component/nav/horizontal-menu", title: "交付流水线" },
            { href: "", title: "新增流水线" }
        ];

        vm.processList = [{"name":"开始","childList":[{"name":"Param_1"},{"name":"Param_2"},{"name":"Param_3"}],"childListNum":0},{"name":"结束","childList":[],"childListNum":0}];
        vm.addProcess = (index) => {
               vm.processList.pop();
               vm.processList.splice(index+1,0,{"name":"阶段"+index,"childList":[],"childListNum":0});
               vm.processList.push({"name":"结束","childList":[],"childListNum":0});
        }

        vm.change = (d) => {
            if (d === 1) {
                vm.isFirst = true;
                vm.isSecond = false;
                vm.initNum = 1;
            }
            if (d === 2) {
                vm.isFirst = false;
                vm.isSecond = true;
                vm.initNum = 2;
            }

        }
        //下一步 
        vm.nextStep = () => {
             vm.isFirst = false;
             vm.isSecond = true;
             vm.initNum = 2;
        }
        //上一步 
        vm.previousStep = () => {
                vm.isFirst = true;
                vm.isSecond = false;
                vm.initNum = 1;
        }
        //删除当前任务或参数
        vm.deleteWork = (num, name) => {
             vm.oneprocess = vm.processList.filter(function(e){
                               return e.name == name;
                             });
             vm.oneprocess[0].childList.splice(num,1);
        }
        
        //取消
        vm.cancel = () => {
            $state.go('Header.overview');
        }


    }
}

export default app => app.controller('createAssemblyLineCtrl', createAssemblyLineCtrl)
