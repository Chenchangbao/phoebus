import {
    Inject
} from 'business/decorator/decorator';

@Inject
class overview {
    constructor($scope, DialogService,ReposService,$state,$stateParams,HttpService) {
        let vm = $scope;
        init();
        
        
        function init() {
        	var params={
        			appId:1
        	}
            HttpService.get('overview/query/1', params).then(function (result) {
                vm.myWorkItems = result.workItems;
                vm.project=strToJson(result.project);
                vm.app = strToJson(result.app);
                vm.version=strToJson(result.version);
                work();
            });
        	
        	
        }
        
        
        function strToJson(str){ 
        	var json = (new Function("return " + str))(); 
        	return json; 
        	}
       vm.clickShow = 1;
        vm.switchEff = (num)=>{
            vm.clickShow = num; 
        };
        vm.clickNoShow = false;
      // $(".littleRound").style.display="none";
        function work(){
        vm.option1 = {
            title: {
                text: '0',
                subtext: '待处理',
                x: 'center',
                y: 'center',
                itemGap: 20,
                textStyle: {
                    color: 'rgba(30,144,255,0.8)',
                    fontFamily: '微软雅黑',
                    fontSize: 35,
                    fontWeight: 'bolder'
                }
            },
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b}: {c} ({d}%)"
            },
            legend: {
                orient: 'vertical',
                x: 'left',

            },
            series: [
                {
                    name: '访问来源',
                    type: 'pie',
                    selectedMode: 'single',
                    radius: [0, '30%'],

                    label: {
                        normal: {
                            position: 'inner'
                        }
                    },
                    labelLine: {
                        normal: {
                            show: false
                        }
                    },

                },
                {
                    name: '访问来源',
                    type: 'pie',
                    radius: ['40%', '55%'],

                    data: [
                        { value: vm.myWorkItems.pending.requireMents, name: '需求', src: 'www.baidu.com' },
                        { value: vm.myWorkItems.pending.tasks, name: '任务', src: 'www.baidu.com' },
                        { value: vm.myWorkItems.pending.bugs, name: '描述', src: 'www.baidu.com' },
                       
                    ]
                }
            ]
        };
        vm.option1.series[vm.option1.series.length-1].data.forEach((e)=>{
            vm.option1.title.text = parseInt(vm.option1.title.text) + parseInt(e.value);
        });
        var myChart1 = echarts.init(document.getElementById('main1'));
        myChart1.clear();
        myChart1.setOption(vm.option1);
        myChart1.on('click', function (params) {
            let src = params.data.src;
        });

        vm.option2 = {
            title: {
                text: '0',
                subtext: '我关注',
                x: 'center',
                y: 'center',
                itemGap: 20,
                textStyle: {
                    color: 'rgba(30,144,255,0.8)',
                    fontFamily: '微软雅黑',
                    fontSize: 35,
                    fontWeight: 'bolder'
                }
            },
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b}: {c} ({d}%)"
            },
            legend: {
                orient: 'vertical',
                x: 'left',

            },
            series: [
                {
                    name: '访问来源',
                    type: 'pie',
                    selectedMode: 'single',
                    radius: [0, '30%'],

                    label: {
                        normal: {
                            position: 'inner'
                        }
                    },
                    labelLine: {
                        normal: {
                            show: false
                        }
                    },

                },
                {
                    name: '访问来源',
                    type: 'pie',
                    radius: ['40%', '55%'],

                    data: [
                        { value: vm.myWorkItems.focus.requireMents, name: '需求', src: 'www.baidu.com' },
                        { value: vm.myWorkItems.focus.tasks, name: '任务' , src: 'www.baidu.com'},
                        { value: vm.myWorkItems.focus.bugs, name: '缺陷' , src: 'www.baidu.com'},
                    ]
                }
            ]
        };
        vm.option2.series[vm.option1.series.length-1].data.forEach((e)=>{
            vm.option2.title.text = parseInt(vm.option2.title.text) + parseInt(e.value);
        });
        var myChart2 = echarts.init(document.getElementById('main2'));
        myChart2.clear();
        myChart2.setOption(vm.option2);
        myChart2.on('click', function (params) {
            let src = params.data.src;
        });

        vm.option3 = {
            title: {
                text: '0',
                subtext: '我创建',
                x: 'center',
                y: 'center',
                itemGap: 20,
                textStyle: {
                    color: 'rgba(30,144,255,0.8)',
                    fontFamily: '微软雅黑',
                    fontSize: 35,
                    fontWeight: 'bolder'
                }
            },
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b}: {c} ({d}%)"
            },
            legend: {
                orient: 'vertical',
                x: 'left',

            },
            series: [
                {
                    name: '访问来源',
                    type: 'pie',
                    selectedMode: 'single',
                    radius: [0, '30%'],

                    label: {
                        normal: {
                            position: 'inner'
                        }
                    },
                    labelLine: {
                        normal: {
                            show: false
                        }
                    },

                },
                {
                    name: '访问来源',
                    type: 'pie',
                    radius: ['40%', '55%'],

                    data: [
                        { value: vm.myWorkItems.created.requireMents, name: '需求', src: 'www.baidu.com' },
                        { value: vm.myWorkItems.created.tasks, name: '任务' , src: 'www.baidu.com'},
                        { value: vm.myWorkItems.created.bugs, name: '缺陷' , src: 'www.baidu.com'},
                    ]
                }
            ]
        };
        vm.option3.series[vm.option3.series.length-1].data.forEach((e)=>{
            vm.option3.title.text = parseInt(vm.option3.title.text) + parseInt(e.value);
        });
        var myChart3 = echarts.init(document.getElementById('main3'));
        myChart3.clear();
        myChart3.setOption(vm.option3);
        myChart3.on('click', function (params) {
            let src = params.data.src;
        });
        }
        vm.square =[];
        vm.square =[{"num":10,"name":"我的项目","detailIfon":[{"name":"立项中","num":2},{"name":"运行中","num":2},{"name":"已上线","num":2},{"name":"已立项","num":2}]},{"num":10,"name":"我的应用","detailIfon":[{"name":"立项中","num":2},{"name":"运行中","num":2},{"name":"已上线","num":2},{"name":"已立项","num":2}]},{"num":10,"name":"我的版本","detailIfon":[{"name":"立项中","num":2},{"name":"运行中","num":2},{"name":"已上线","num":2},{"name":"已立项","num":2}]}]
        vm.listone = [{"state":"置顶","content":"关于Struts2漏洞紧急通知"},{"state":"置顶","content":"关于Struts2漏洞紧急通知"},{"state":"置顶","content":"关于Struts2漏洞紧急通知"},{"state":"置顶","content":"关于Struts2漏洞紧急通知"}]
    }
}

export default app =>app.controller('overview', overview)

