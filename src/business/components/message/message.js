import {
    Inject
} from 'business/decorator/decorator';

@Inject
class message {
    constructor($scope, DialogService, $state, $stateParams, HttpService, $filter) {
        let vm = $scope;
		vm.form = {}
        vm.crumbBaseData = [
                            { href: "/", title: "首页" },
                            { href: "", title: "消息中心" }
                            ];
        /***********************事件日志***************************/
        onLoadPage();
		initDate();
        
        function onLoadPage(){
        	HttpService.get('events/').then(d=>{
        		if(null == d.eventDOListRespVO){
        			vm.eventDOListRespVO = null;
        			vm.total = 0;
        			vm.pageSize = 0;
            		vm.page = 0;
        		}else{
	        		vm.eventDOListRespVO = d.eventDOListRespVO.theListData;
	        		vm.total = d.eventDOListRespVO.totalSize;
	        		vm.pageSize = d.eventDOListRespVO.pageSize;
	        		vm.page = d.eventDOListRespVO.currentPage;
        		}
        	});
        	
        	HttpService.get('events/operateType').then(d=>{
        		vm.operateTypeList = d.operateTypeList;
        	});
        	
        	HttpService.get('events/appName').then(d=>{
        		vm.appNameList = d.appNameList;
        	});
        	
        	vm.operateType = '';
        	vm.appName = '';
        	vm.form.operator = '';
        	
        };
        function initDate(){
			vm.dateOption4 = {
				timePicker: true,
				singleDatePicker: false,
				locale:{
					format: 'YYYY-MM-DD HH:mm:ss'
				},
				"timePicker": true,
				"timePicker24Hour": true,
				"timePickerSeconds": true,
				dateLimit: {
					days: 90
				},
				eventHandlers: {
					'apply.daterangepicker': function (ev, picker) {
						var startdate = new Date(ev.model.startDate);
						var enddate = new Date(ev.model.endDate);
						//获取操作记录
						var start=$filter('date')(startdate, 'yyyy-MM-dd HH:mm:ss');
						var end=$filter('date')(enddate, 'yyyy-MM-dd HH:mm:ss');
						getOptions(start,end);
					}
				}
        	};
		};
    
        
        function getOptions(start, end) {
            vm.startTime = start;
            vm.endTime = end;
        }
        
        vm.onChangeSlelectAppName = (appName) => {
        	vm.appName = appName;
		};
		
        vm.onChangeSlelectOperateType = (operateType) => {
			vm.operateType = operateType;
		};
        
        vm.doSearch = () => {
        	var params = {
    			operateType:vm.operateType,
    			appName:vm.appName,
        		operator:vm.form.operator,
        		startTime:vm.startTime,
        		endTime:vm.endTime
        	};
			HttpService.get('events/',params).then(d => {
				if (null == d.eventDOListRespVO) {
					vm.eventDOListRespVO = null;
					vm.total = 0;
					vm.pageSize = 0;
					vm.page = 0;
				} else {
					vm.eventDOListRespVO = d.eventDOListRespVO.theListData;
					vm.total = d.eventDOListRespVO.totalSize;
					vm.pageSize = d.eventDOListRespVO.pageSize;
					vm.page = d.eventDOListRespVO.currentPage;
				}
			});
		};
		
		vm.paging = (pageArg, pageSizeArg, totalArg) => {
			var params = {
	    			operateType:vm.operateType,
	    			appName:vm.appName,
	        		operator:vm.form.operator,
	        		startTime:vm.startTime,
	        		endTime:vm.endTime,
	        		pageNumber:pageArg,
	        		pageSize:pageSizeArg
	        	};
			HttpService.get('events/',params).then(d=>{
				if (null == d.eventDOListRespVO) {
					vm.eventDOListRespVO = null;
					vm.total = 0;
					vm.pageSize = 0;
					vm.page = 0;
				} else {
					vm.eventDOListRespVO = d.eventDOListRespVO.theListData;
					vm.total = d.eventDOListRespVO.totalSize;
					vm.pageSize = d.eventDOListRespVO.pageSize;
					vm.page = d.eventDOListRespVO.currentPage;
				}
        	})
        };
        /***********************事件日志***************************/
        
        /***********************系统通知***************************/
        
        /***********************系统通知***************************/
    }
}

export default app => {
    app.controller('message', message);
};