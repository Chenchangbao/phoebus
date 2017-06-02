import {
    Inject
} from 'business/decorator/decorator'

@Inject
class appProcessCtrl {
    constructor($scope,$stateParams, $state,$timeout, $q, $rootScope,$interval,HttpService) {
        let vm = $scope;
		
    
        
        init();
        function init(){
        	
        	HttpService.get('app/process/1').then(result => {
                vm.versionList = result.versionList;
        	});





             
    	}

        vm.crumbBaseData = [
            { href: "/", title: "首页" },
            { href: "/#/component/nav/horizontal-menu", title: "应用管理" },
            { href: "", title: "应用管理" }
        ];


       
    		
        
        vm.timeLine = [{"id":5,"createTime":"2017-05-27 10:28:33","year":"2017","month":"05","day":"27","versionId":1,"versionName":"v1.1.0","status":"using","statusDesc":"当前使用版本","envId":1,"envName":"xz_test1","envCnname":"测试成海芹","pkgId":1,"pkgName":"Test-web.war"},{"id":4,"createTime":"2017-05-27 10:25:56","year":"2017","month":"05","day":"27","versionId":15,"versionName":"的点点滴滴","status":"history","statusDesc":"历史版本","envId":1,"envName":"xz_test1","envCnname":"测试成海芹","pkgId":1,"pkgName":"Test-web.war"},{"id":3,"createTime":"2017-05-27 10:24:01","year":"2017","month":"05","day":"27","versionId":3,"versionName":"版本中文test","status":"history","statusDesc":"历史版本","envId":1,"envName":"xz_test1","envCnname":"测试成海芹","pkgId":1,"pkgName":"Test-web.war"},{"id":2,"createTime":"2017-05-27 10:23:03","year":"2017","month":"05","day":"27","versionId":14,"versionName":"测试测试","status":"history","statusDesc":"历史版本","envId":1,"envName":"xz_test1","envCnname":"测试成海芹","pkgId":1,"pkgName":"Test-web.war"},{"id":1,"createTime":"2017-05-27 10:22:48","year":"2017","month":"05","day":"27","versionId":15,"versionName":"的点点滴滴","status":"history","statusDesc":"历史版本","envId":1,"envName":"xz_test1","envCnname":"测试成海芹","pkgId":1,"pkgName":"Test-web.war"}]

    }
}

export default app => app.controller('appProcessCtrl', appProcessCtrl)


