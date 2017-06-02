import {
    Inject
} from 'business/decorator/decorator'

@Inject
class testCtrl {
    constructor($scope,$stateParams, $state,$timeout, $q, $rootScope,$interval,HttpService,DialogService) {
        let vm = $scope;
		
        //分页
        vm.page = 0;
        vm.pageSize = 10;
        vm.appId = 1;
        
        init();
        function init(){
        	SearchTestByPage(vm.page,vm.pageSize);
    	}

        vm.crumbBaseData = [
            { href: "/", title: "首页" },
            { href: "/#/component/nav/horizontal-menu", title: "测试管理" },
            { href: "", title: "测试管理" }
        ];

	    vm.statusList=[
	   	                {"name":"已删除","value":"0"},
		                {"name":"使用中","value":"1"}
	   	               ];
	        
        function SearchTestByPage(page,pageSize){
    		var params= {
            		page: page,
                    pageSize: pageSize,
                    status :vm.status,
                    appId:vm.appId
            }
    		HttpService.post('test/task/search/'+vm.appId,params).then(result => {
   			 	vm.page = result.page;
                vm.pageSize = result.pageSize;
                vm.totalCount=result.totalCount;
                vm.testTaskList = result.data;
        	});
    	}
        
        
        vm.reset=()=>{
            vm.taskName='';
            vm.status='';
            vm.pageIndex=0;
            vm.pageSize=10;
            SearchAppByPage(vm.pageIndex,vm.pageSize);
        }
      
        
        vm.paging1 = (pageArg, pageSizeArg, totalArg) => {
        	SearchTestByPage(pageArg,pageSizeArg);
        	  console.log(pageArg, pageSizeArg, totalArg);
        };

    }
}

export default app => app.controller('testCtrl', testCtrl)


