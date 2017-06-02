let toStateCache, fromStateCache, cssToBeEnableList = []

export default app => {
    app.config(['$stateProvider', '$urlRouterProvider', ($stateProvider, $urlRouterProvider) => {
        mockFn($stateProvider, 'state')
        // $urlRouterProvider.otherwise('/portal');

        let header = 'Header.';
        $urlRouterProvider.otherwise(function ($injector) {
            var $state = $injector.get("$state");
            $state.go(header + 'overview');
        });

        $stateProvider
            .state('Header', {
                abstract: true,
                cssUrl: 'business/components/headerCD/headerCD.css',
                templateUrl: 'business/components/headerCD/headerCD.html',
                controller: 'headerCD'
            })
            .state(header + 'overview', {
                url: '/overview',
                templateUrl: 'business/components/overview/overview.html',
                cssUrl: 'business/components/overview/overview.css',
                controller: 'overview'
            })
            
            .state('Header.app', {
                url: '/app',
                templateUrl: 'business/components/app/app.html',
                cssUrl: 'business/components/app/app.css',
                controller: 'appCtrl'
            })
            
            .state('Header.appProcess', {
                url: '/appProcess',
                templateUrl: 'business/components/app/process/appProcess.html',
                cssUrl: 'business/components/app/process/appProcess.css',
                controller: 'appProcessCtrl'
            })
              .state('Header.AssemblyLineDetail', {
                url: '/assemblyLineDetail',
                templateUrl: 'business/components/assemblyLineDetail/assemblyLineDetail.html',
                cssUrl: 'business/components/assemblyLineDetail/assemblyLineDetail.css',
                controller: 'assemblyLineDetailCtrl'
            })
             .state('Header.CreateAssemblyLine', {
                url: '/createAssemblyLine',
                templateUrl: 'business/components/createAssemblyLine/createAssemblyLine.html',
                cssUrl: 'business/components/createAssemblyLine/createAssemblyLine.css',
                controller: 'createAssemblyLineCtrl'
            })
            .state('Header.dictItem', {
                url: '/dictItem',
                templateUrl: 'business/components/dictItem/dictItem.html',
                cssUrl: 'business/components/dictItem/dictItem.css',
                controller: 'DictItemCtrl'
            })
            .state('Header.flowList', {
                url: '/flowList',
                templateUrl: 'business/components/flow/flowList.html',
                cssUrl: 'business/components/flow/flowList.css',
                controller: 'FlowListCtrl'
            })

            .state('Header.createFlow', {
                url: '/createFlow',
                templateUrl: 'business/components/flow/create/createFlow.html',
                cssUrl: 'business/components/flow/create/createFlow.css',
                controller: 'FlowCreateCtrl'
            })

            .state('Header.message', {
                url: '/message',
                templateUrl: 'business/components/message/message.html',
                cssUrl: 'business/components/message/message.css',
                controller: 'message'
            })

            .state('Header.editFlow', {
                url: '/editFlow/:flowId',
                templateUrl: 'business/components/flow/edit/editFlow.html',
                cssUrl: 'business/components/flow/edit/editFlow.css',
                controller: 'FlowEditCtrl'
            })

            .state('Header.detailFlow', {
                url: '/detailFlow/:flowId',
                templateUrl: 'business/components/flow/detail/detailFlow.html',
                cssUrl: 'business/components/flow/detail/detailFlow.css',
                controller: 'FlowDetailCtrl'
            })
    }]);

    app.run(['$rootScope', 'LoginService', '$window', ($rootScope, LoginService, $window) => {
        document.domain = 'cnsuning.com'
        window.parent.ifr1Init && window.parent.ifr1Init($rootScope, $window, LoginService)
        $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams, options) {
            toStateCache = toState
            fromStateCache = fromState
            // let params = /\/(\d+)$/.exec(location.href)
            // let projectId = params && params[1]
            $rootScope.projectId = toParams.projectId
        })

        //be careful, the time of removing css file is important, or the screen view would be flashing
        $rootScope.$on('$viewContentLoaded', function (event, viewConfig) {
            if (!toStateCache || !fromStateCache) return
            let sameName = getSameStateName(toStateCache, fromStateCache)
            let exceptName = toStateCache.name || ''
            removeCssList(sameName, exceptName)
            for (let i = 0; i < cssToBeEnableList.length; i++) {
                cssToBeEnableList.pop()()
            }
        })
    }])
}

function addResolve(obj) {
    obj.resolve = {
        css: ['$q', '$state', ($q, $state) => {
            var deferred = $q.defer();

            if (obj.cssUrl) {
                let csslink = document.createElement('link')
                csslink.setAttribute('rel', 'stylesheet')
                csslink.setAttribute('type', 'text/css')
                csslink.setAttribute('href', obj.cssUrl)
                csslink.setAttribute('data-name', obj.name)
                csslink.addEventListener('load', e => {
                    let styleSheet = csslink.sheet || csslink.styleSheet;
                    //如果可以在加载css文件的同时disabled，应该可以避免闪烁
                    styleSheet.disabled = true
                    cssToBeEnableList.push((sheet => {
                        return function () {
                            sheet.disabled = false
                        }
                    })(styleSheet))
                    deferred.resolve()
                })
                document.head.appendChild(csslink)
            } else {
                deferred.resolve()
            }

            return deferred.promise;
        }]
    }
    return obj
}

function mockFn(obj, name) {
    let old = obj[name]
    obj[name] = function () {
        arguments[1].name = arguments[0]
        return old.call(obj, arguments[0], addResolve(arguments[1]))
    }
}

/**
 * 
 */
function removeCssList(sameName, exceptFile) {
    if (!sameName.length) return

    let exceptArr = exceptFile.split('.'),
        exceptStr = '',
        exceptName = ''

    if (exceptFile.match('.')) {
        exceptArr.forEach(e => {
            exceptName += exceptName ? '.' + e : e
            exceptStr += ':not([data-name="' + exceptName + '"])'
        })
    }
    let links = document.querySelectorAll('head>link[data-name]' + exceptStr)
    for (let i = 0; i < links.length; i++) {
        let link = links[i]

        if (sameName.length === 0) {
            document.head.removeChild(link)
        } else {
            let name = ''
            let r = sameName.every(e => {
                name += name ? '.' + e : e
                if (name !== link.dataset.name) {
                    return true
                }
            })
            if (r)
                document.head.removeChild(link)
        }
    }
}

/**
 * get the same part between toState.name and fromState.name
 */
function getSameStateName(toState, fromState) {
    let toStateName = toState.name.split('.'),
        fromStateName = fromState.name.split('.'),
        result = []

    for (let i = 0; i < toStateName.length; i++) {
        if (toStateName[i] === fromStateName[i]) {
            result.push(toStateName[i])
        } else
            break
    }
    return result
}