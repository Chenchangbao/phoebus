export default app => {
    app.filter('operation_mapping', function () {
        return function (operation) {
            if (operation == 'start') {
                return "启动";
            }
            if (operation == 'restart') {
                return "重启";
            }
            if (operation == 'refresh') {
                return "刷新";
            }
            if (operation == 'stop') {
                return "停止";
            }
            return "无效操作";
        }
    })
    app.filter('protected_branch', function () {
        return function (is_protected) {
            if (is_protected == '1') {
                return "保护分支";
            }
            return "常规分支";
        }
    })
    app.filter('pullrequest_status', function () {
        return function (status) {
            if (status == '1') {
                return "待评审";
            }
            if (status == '2') {
                return "待审批";
            }
            if (status == '3') {
                return "评审不通过";
            }
            if (status == '0') {
                return "已关闭";
            }
            return "已合并";
        }
    })
    app.filter('codeReviewFilter', function () {
        return function (status) {
            if (status == '10') {
                return "使用gerrit进行代码评审";
            }
            if (status == '0') {
                return "无代码评审";
            }
            if (status == '11') {
                return "使用reviewboard进行代码评审";
            }
            return "未知状态";
        }
    })
    app.filter('gitVisibilityLevelFilter', function () {
        return function (status) {
            if (status == '0') {
                return "私有";
            }
            if (status == '10') {
                return "内部";
            }
            if (status == '20') {
                return "公开";
            }
            return "未知状态";
        }
    })
};