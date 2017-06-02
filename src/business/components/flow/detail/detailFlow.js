import {
    Inject
} from 'business/decorator/decorator'

@Inject
class FlowDetailCtrl {
    constructor($scope,$stateParams, $state,HttpService,AlertService,DialogService, $q, $rootScope,$interval) {
        let vm = $scope;

        vm.query = {};
        vm.pagination = {};
        vm.pagination.page = 1;
        vm.pagination.pageSize = 10;
        vm.pagination.totalCount = 0;

        $(function () {
            $("[data-toggle='popover']").popover();
        });
        vm.downLoadPro = 0 ;
        vm.initNum = 1;
        vm.statusCode = 1;
        vm.myDate = new Date();
        vm.sysList=[];
        init();
        function init(){
            vm.isFirst = true;
            vm.isSecond = false;
            vm.isThird = false;

            HttpService.get('flow/listSystemByLoginUser').then(function (result) {
                vm.sysList = result;
            });

            HttpService.get('flow/getDetail/'+$stateParams.flowId).then(function (result) {
                vm.flow=result.flow;
                vm.nodeGroupList=result.nodeGroupList;

                vm.query.flowId=vm.flow.id;
                search(1, vm.pagination.pageSize);
            });
        }

        vm.crumbBaseData = [
            { href: "/", title: "首页" },
            { href: "/#/flowList", title: "交付流水线" },
            { href: "", title: "流水线详情" }
        ];

        //vm.processList = [{"name":"开始","childList":[{"name":"Param_1"},{"name":"Param_2"},{"name":"Param_3"}],"childListNum":0},{"name":"阶段1","childList":[{"name":"Example1"},{"name":"Example2"},{"name":"Example3"}],"childListNum":0},{"name":"结束","childList":[],"childListNum":0}];


        vm.change = (d) => {
            if (d === 1) {
                vm.isFirst = true;
                vm.isSecond = false;
                vm.isThird=false;
                vm.initNum = 1;
            }else if (d === 2) {
                vm.isFirst = false;
                vm.isSecond = true;
                vm.isThird=false;
                vm.initNum = 2;
            }else {
                vm.isFirst = false;
                vm.isSecond = false;
                vm.isThird=true;
                vm.initNum = 3;
            }

        }

        vm.executeFlow = ()=> {
            HttpService.get('flow/execute/'+$stateParams.flowId).then(function (result) {
                AlertService.alert({title:"提示",content:"流水线执行中...！"});
            });
        }

        function search(page, pageSize) {
            vm.query.page = page;
            vm.query.pageSize = pageSize;
            HttpService.post("flow/log/search", vm.query).then(function (result) {
                vm.pagination = result;
            });

        }

        vm.paginationSearch = (pageArg, pageSizeArg, totalArg) => {
            search(pageArg, pageSizeArg);
        };

        // 查看任务详情
        vm.showDetail = (id) => {
            DialogService.modal({
                key: 'flowHistoryDetail',
                url: 'business/components/flow/detail/flowHistoryDetail.html',
            }, {
                key: 'flowHistoryDetail',
                data: {
                    msg: 'this is data from modalCtrl!',
                    id: id
                }
            });
        }

        //下载事件
        var timer;
        vm.downLoad = () => {
            var timer = $interval(function(){
                vm.downLoadPro++;
            },10,100);
            timer.then(success);
            function success(){
                vm.statusCode = 2;
            }

        }
    }
}

export default app => app.controller('FlowDetailCtrl', FlowDetailCtrl)