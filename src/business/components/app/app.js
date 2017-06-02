import {
    Inject
} from 'business/decorator/decorator'

@Inject
class appCtrl {
    constructor($scope,$stateParams, $state,$timeout, $q, $rootScope,$interval,HttpService,DialogService) {
        let vm = $scope;
		
        //分页
        vm.page = 0;
        vm.pageSize = 10;
        
        init();
        function init(){
        	SearchAppByPage(vm.page,vm.pageSize);
    	}

        vm.crumbBaseData = [
            { href: "/", title: "首页" },
            { href: "/#/component/nav/horizontal-menu", title: "应用管理" },
            { href: "", title: "应用管理" }
        ];

   	    vm.statusList=[
   	                {"name":"已删除","value":"0"},
	                {"name":"使用中","value":"1"}
   	               ];
        
        function SearchAppByPage(page,pageSize){
    		var params= {
            		page: page,
                    pageSize: pageSize,
                    status :vm.status,
                    appName:vm.appName
            }
    		HttpService.post('app/search/',params).then(result => {
   			 	vm.page = result.page;
                vm.pageSize = result.pageSize;
                vm.totalCount=result.totalCount;
                vm.appList = result.data;
        	});
    	}
        
        vm.reset=()=>{
            vm.appName='';
            vm.status='';
            vm.pageIndex=0;
            vm.pageSize=10;
            SearchAppByPage(vm.pageIndex,vm.pageSize);
        }
        
        vm.paging1 = (pageArg, pageSizeArg, totalArg) => {
        	SearchAppByPage(pageArg,pageSizeArg);
        	  console.log(pageArg, pageSizeArg, totalArg);
        };

       $scope.showDialog = () => {
            DialogService.modal({
            key: 'dialogDemo',
            url: 'business/components/app/alert/alert.html',
            accept: (result) => {
                console.log(result);
            },
            refuse: (reason) => {
                console.log(reason);
            }
            }, {
            key: 'dialogDemo',
            data: {msg: 'this is data from modalCtrl!'}
            });
        };

   
    }
}

export default app => app.controller('appCtrl', appCtrl)


