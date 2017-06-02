import {
    Inject
} from 'business/decorator/decorator'

@Inject
class assemblyLineDetailCtrl {
    constructor($scope,$stateParams, $state,$timeout, $q, $rootScope,$interval) {
        let vm = $scope;
		$(function () { 
	$("[data-toggle='popover']").popover();
});
		vm.downLoadPro = 0 ;
        vm.initNum = 1;
		vm.statusCode = 1;
		vm.myDate = new Date();  
		
        init();
        function init(){
    		 vm.isFirst = false;
             vm.isSecond = true;
             vm.initNum = 2;
    	}

        vm.crumbBaseData = [
            { href: "/", title: "首页" },
            { href: "/#/component/nav/horizontal-menu", title: "交付流水线" },
            { href: "", title: "流水线详情" }
        ];

        vm.processList = [{"name":"开始","childList":[{"name":"Param_1"},{"name":"Param_2"},{"name":"Param_3"}],"childListNum":0},{"name":"阶段1","childList":[{"name":"Example1"},{"name":"Example2"},{"name":"Example3"}],"childListNum":0},{"name":"结束","childList":[],"childListNum":0}];


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
        //取消
        vm.cancel = () => {
            $state.go('Header.overview');
        }
		//下载事件
		 var timer
		vm.downLoad = () => {
			var timer = $interval(function(){
				vm.downLoadPro++;
			},10,100);
			timer.then(success);
			function success(){
				vm.statusCode = 2;
			console.log("done");
			}

		}
    }
}

export default app => app.controller('assemblyLineDetailCtrl', assemblyLineDetailCtrl)


