/**
 * Created by 17030515 on 2017/3/27.
 */
import {
    Inject
} from 'business/decorator/decorator';
import editDictItem from './editDictItem/editDictItem';
@Inject
class DictItemCtrl {
    constructor($scope, HttpService, DialogService, $state, AlertService) {
        let vm = $scope;
        vm.crumbBaseData = [
            {href: "", title: "数据字典管理"}
        ];
        vm.typeCodeList = [];
        vm.query = {};
        vm.pagination = {};
        vm.pagination.page = 1;
        vm.pagination.pageSize = 10;
        vm.pagination.totalCount = 0;
        init();

        function init() {
            HttpService.post('dictItem/queryTypeCodeList', {}).then(function (result) {
                vm.typeCodeList = result;
            });

            search(1, vm.pagination.pageSize);
        }

        function search(page, pageSize) {
            vm.query.page = page;
            vm.query.pageSize = pageSize;
            HttpService.post("dictItem/search", vm.query).then(function (result) {
                vm.pagination = result;
            });

        }

        vm.paginationSearch = (pageArg, pageSizeArg, totalArg) => {
            search(pageArg, pageSizeArg);
        };

        vm.reset = ()=> {
            vm.query = {};
        };

        vm.delete = (id, dictName)=> {
            let parentScope=this.$parent;
            AlertService.confirm({
                title: '删除数据字典确认',
                content: '您确认删除数据字典【' + dictName + '】吗？'
            }).then(() => {
                    HttpService.post("dictItem/delete/" + id).then(function (result) {
                        AlertService.alert({title: "操作成功", content: "删除数据字典成功！"});
                        vm.paginationSearch(1, vm.pagination.pageSize);
                    });
                }, () => {
                }
            );
        };

        vm.refreshCache = (typeCode)=> {
            HttpService.post("dictItem/removeCache/"+typeCode).then(function (result) {
                AlertService.alert({title:"操作成功",content:"刷新缓存成功！"});

            });
        };

        vm.showEdit = (id) => {
            DialogService.modal({
                key: 'editDictItem',
                url: 'business/components/dictItem/editDictItem/editDictItem.html'
            }, {
                key: 'editDictItem',
                data: {
                    msg: 'this is data from modalCtrl!',
                    id : id,
                    //将父scope 传递到编辑Ctrl
                    parentScope:vm
                }
            });
        }
    }
}
export default app => {
    app.controller('DictItemCtrl', DictItemCtrl);
};