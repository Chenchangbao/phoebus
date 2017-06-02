let alertCtrl = ($scope, DialogService,$stateParams,ReposService) => {
  let vm = $scope;
  vm.circle = false;
    vm.count=0;
    vm.reloadFlag=true;
  vm.close = () => {
    // way 1:
    DialogService.dismiss(vm.key);

    // or
    DialogService.refuse(vm.key, 'dialog refuse! cancel!');
  };
  vm.commit = () => {  
    DialogService.accept(vm.key, 'dialog accept!');
    //vm.circle = false;

    console.log(vm.circle);
  };
   vm.reload =() =>{
        vm.circle = true;
        vm.reloadFlag=false;
        vm.count++;
        if(vm.count == 3){
           vm.data.message="重试超过3次，请联系管理员处理！"
            vm.circle = false;
        }else{
            //调后台接口失败返回true
            var params = {
                'reposDtoMap': vm.data.reposDto
            }
            ReposService.repeatExeGerritInit(params).then(function (result) {
                vm.reloadFlag=true;
                vm.circle = false;
                if (result) {
                    vm.data.message="执行成功！";
                    vm.reloadFlag=false;
                }else{
                    vm.data.message="初始化gerrit代码评审相关信息失败！";
                }
            });
        }
   }
};

export default app =>app.controller('alertCtrl', alertCtrl)