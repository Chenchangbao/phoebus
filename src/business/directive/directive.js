import './directive.css'
export default app => {
    app.directive('snTree2', ['$timeout', '$document', ($timeout, $document) => {
        return {
            restrict: 'E',
            scope: {
                treeData: '=',
                treeClick: '&'
            },
            template: '<div style="position:relative;"></div>',
            link: (scope, element, attrs) => {
                let vm = scope,
                    $scope = scope

                let tree = {
                    rootNode: element.children('div')[0],
                    treeData: {},
                    treeDataInit: null,
                    treeFoldInit: [{
                        open: 'unfold',
                    }],
                    treeFold: null,
                    treeHoverIndex: 0,
                    treeSearch: [],
                    li: {
                        foldClass: 'fold',
                        unfoldClass: 'unfold',
                        i: {
                            foldClass: 'fa-plus-square-o',
                            unfoldClass: 'fa-minus-square-o',
                        }
                    },
                    folder: {
                        foldClass: 'fa-folder-o',
                        unfoldClass: 'fa-folder-open-o',
                    },
                    file: {
                        icon: 'fa-file-o'
                    }
                }
                vm.tree = tree
                init(vm.treeData)

                vm.$watch('treeData',(newData,oldData)=>{
                    if(JSON.stringify(newData)!==JSON.stringify(oldData))
                    init(newData)
                },true)

                /**
                 * 
                 */
                function init(d, option) {
                    if (d) {
                        tree.treeData = copy(d);
                        tree.treeFold = tree.treeFold ? tree.treeFold : copy(tree.treeFoldInit)
                        if (!tree.treeDataInit)
                            tree.treeDataInit = copy(d)
                    } else {
                        tree.treeData = copy(tree.treeDataInit)
                        tree.treeFold = copy(tree.treeFoldInit)
                    }
                    tree.rootNode.innerHTML = ''

                    traverseJSON(tree.treeData, (e, option) => {
                        e.level = option.level
                        if (e.parent) {
                            e.index = [...e.parent.index, option.index]
                        } else {
                            e.index = [option.index]
                        }
                        if (e.children && e.children.length > 0) {
                            e.children.forEach((el, i) => {
                                el.parentId = e.id
                                el.parent = e
                            })
                        }
                    })
                    traverseJSON(tree.treeData, e => {
                        e.node = addBranch(e, option && {
                            fold: option.fold
                        })
                    })

                    function clickEvent(e) {
                        if (e.target.matches('li>i')) {
                            if (e.target.parentNode.classList.contains(tree.li.foldClass)) {
                                changeNode(e.target.parentNode, 'unfold')
                            } else if (e.target.parentNode.classList.contains(tree.li.unfoldClass)) {
                                changeNode(e.target.parentNode, 'fold')
                            }
                            refreshMoveEvent()
                        }

                        if (e.target.matches('li,span')) {
                            $scope.$emit('sn.controls.tree:selectedNodeChanged', {
                                newNode: e.target.nodeName === 'LI' ? e.target.dataset : e.target.parentElement.dataset
                            })
                            // $scope.$emit('sn.controls.tree:selectedNodeChanged', {
                            //     newNode: {
                            //         name: e.target.dataset.name || e.target.parentElement.dataset.name,
                            //         desc: e.target.dataset.desc || e.target.parentElement.dataset.desc
                            //     }
                            // })
                        }
                    }

                    tree.rootNode.onclick = clickEvent

                    treeInit(option)
                }

                function changeNode(node, option) {
                    let foldStatusNew, foldStatusOld

                    if (option === 'fold') {
                        foldStatusNew = 'foldClass'
                        foldStatusOld = 'unfoldClass'
                    } else if (option === 'unfold') {
                        foldStatusNew = 'unfoldClass'
                        foldStatusOld = 'foldClass'
                    }

                    node.classList.add(tree.li[foldStatusNew])
                    node.classList.remove(tree.li[foldStatusOld]);
                    setTreeFold(JSON.parse(node.dataset.index), option);
                    [].forEach.call(node.children, e => {
                        if (e.classList.contains(tree.li.i.foldClass) ||
                            e.classList.contains(tree.li.i.unfoldClass)) {
                            e.classList.add(tree.li.i[foldStatusNew])
                            e.classList.remove(tree.li.i[foldStatusOld])
                        }
                        if (e.classList.contains(tree.folder.foldClass) ||
                            e.classList.contains(tree.folder.unfoldClass)) {
                            e.classList.add(tree.folder[foldStatusNew])
                            e.classList.remove(tree.folder[foldStatusOld])
                        }
                    })
                }

                function setTreeFold(index, status) {
                    let branch = tree.treeFold
                    index && index.forEach((e, i) => {
                        if (!branch[e]) {
                            branch[e] = {
                                children: []
                            }
                        }
                        if (!branch[e].children) {
                            branch[e].children = []
                        }
                        if (branch && branch[e] && i === index.length - 1) {
                            branch[e].open = status
                        }
                        branch = branch[e].children
                    })
                }

                function resetAllNode() {
                    tree.treeFold = copy(tree.treeFoldInit)
                    traverseJSON(tree.treeData, (e, o) => {
                        changeNode(e.node, getOpenStatus(e.index) ? 'unfold' : 'fold')
                    })
                    refreshMoveEvent()
                    setHover(tree.treeData[0].name)
                    addMoveEvent()
                }

                //搜索节点内容
                function search(name) {
                    name = name && name.trim()
                    if (name === '' || name === undefined) {
                        resetAllNode()
                        return
                    }

                    tree.searchData = copy(tree.treeDataInit)
                    searchNode(tree.searchData, name)
                    tree.searchData = deleteNode(tree.searchData)
                    init(tree.searchData, {
                        fold: 'unfoldClass',
                        search: true,
                        callback() {
                            setHover(name)
                            let firstNode = findFirstNode(tree.searchData, name)
                            firstNode && firstNode.node.scrollIntoView()
                            $scope.$emit('sn.controls.tree:selectedNodeChanged', {
                                newNode: {
                                    orgcode: firstNode && firstNode.orgCode
                                }
                            })
                        }
                    })

                    function findFirstNode(tree, name) {
                        if (tree && tree.length) {
                            for (let i = 0; i < tree.length; i++) {
                                if (tree[i].name && tree[i].name.match(name)) {
                                    return tree[i]
                                } else if (tree[i].children) {
                                    return findFirstNode(tree[i].children, name)
                                }
                            }
                        }
                    }

                    function deleteNode(tree) {
                        if (tree && tree.length) {
                            tree = tree.filter(e => {
                                return !e.deleting
                            })
                            tree.forEach(e => {
                                if (e.children) {
                                    e.children = deleteNode(e.children)
                                }
                            })
                            return tree
                        }
                    }

                    function searchNode(tree, name) {
                        if (tree && tree.length) {
                            return tree.map(e => {
                                if (e.name) {
                                    if (e.children) {
                                        if (searchNode(e.children, name)) {
                                            return e.deleting = true
                                        } else {
                                            return e.deleting = false
                                        }
                                    } else {
                                        if (e.name.match(name))
                                            return e.deleting = false
                                        else
                                            return e.deleting = true
                                    }
                                }
                            }).every(e => {
                                return e === true
                            })
                        }
                    }
                }

                //tree dom 操作
                let li, hover, clickIndex, liHeight = 1000

                function getOpenStatus(index) {
                    let branch = tree.treeFold,
                        result = 'fold'
                    index && index.forEach((e, i) => {
                        if (branch && branch[e] && i === index.length - 1)
                            result = branch[e].open
                        branch = branch && branch[e] && branch[e].children
                    })
                    return result
                }

                function addBranch(nodeTree, option) {
                    var parentNode, ulNode, fold = getOpenStatus(nodeTree.index) + 'Class'

                    if (option && option.fold) {
                        fold = option.fold
                    }
                    if (!nodeTree.parent) {
                        parentNode = tree.rootNode
                    } else {
                        parentNode = nodeTree.parent.node
                    }

                    function create_ul() {
                        var ul = document.createElement('ul')
                        ul.setAttribute('class', 'sn-tree')
                        ul.setAttribute('style', 'position: relative;z-index: 2;list-style:none;')
                        return ul
                    }

                    function create_i(name, option) {
                        let i = document.createElement('i')
                        i.classList.add('fa')
                        i.classList.add(name)
                        if (option === 'transparent') {
                            i.classList.add('transparent')
                        }
                        return i
                    }

                    ulNode = parentNode.children[parentNode.children.length - 1]
                    var ulNode = Array.prototype.find.call(parentNode.children, function (e) {
                        return e.tagName === 'UL'
                    })
                    if (!ulNode) {
                        ulNode = create_ul()
                        parentNode.appendChild(ulNode)
                    }

                    let li = document.createElement('li')

                    li.classList.add(tree.li[fold])
                    Object.keys(nodeTree).forEach(e => {
                        let typeofe = typeof (nodeTree[e])
                        if (typeofe === 'string' || typeofe === 'number') {
                            li.setAttribute('data-' + e, nodeTree[e])
                        }
                    })
                    // li.setAttribute('data-id', nodeTree.id)
                    // li.setAttribute('data-name', nodeTree.name)
                    // li.setAttribute('data-level', nodeTree.level)
                    // li.setAttribute('data-orgCode', nodeTree.orgCode)
                    li.setAttribute('data-index', JSON.stringify(nodeTree.index))
                    if (nodeTree.children && nodeTree.children.length > 0) {
                        let icon1 = create_i(tree.li.i[fold]),
                            icon2 = create_i(tree.folder[fold])
                        li.appendChild(icon1)
                        li.appendChild(icon2)
                    } else {
                        let icon1 = create_i(tree.li.i[fold], 'transparent'),
                            icon2 = create_i(tree.file.icon)
                        li.appendChild(icon1)
                        li.appendChild(icon2)
                    }
                    let span = document.createElement('span')
                    span.textContent = nodeTree.name
                    li.appendChild(span)
                    ulNode.appendChild(li)

                    return li
                }

                function addMoveEvent() {
                    li.forEach((el, i) => {
                        el.onmousemove = function (e) {
                            e.stopImmediatePropagation()
                            hover.style.display = ''
                            hover.style.top = i * liHeight + 'px'
                            tree.treeHoverIndex = i
                            if (+el.dataset.level === 4) {
                                $scope.$apply()
                            } else {
                                $scope.$apply()
                            }
                        }
                        el.onmouseleave = function (e) {
                            clickIndex = -1
                        }
                    })
                }

                function setHover(name) {
                    li = queryli()
                    for (let i = 0; i < li.length; i++) {
                        let r = /^[^\n]+/.exec(li[i].innerText)
                        if (r && r.length) {
                            if (r[0].match(name)) {
                                removeMoveEvent()
                                clickIndex = i
                                hover.style.top = i * liHeight + 'px'
                                return
                            }
                        }
                    }
                }

                function removeMoveEvent() {
                    li.forEach((e, i) => {
                        e.onmousemove = null
                        e.onmouseleave = null
                    })
                }

                function addClickEvent() {
                    li.forEach((el, i) => {
                        el.onclick = function (e) {
                            // e.stopImmediatePropagation()
                            if (e.target === e.currentTarget || e.target.parentElement === e.currentTarget) {
                                if (clickIndex === i) {
                                    addMoveEvent()
                                } else {
                                    removeMoveEvent()
                                    hover.style.display = ''
                                    hover.style.top = i * liHeight + 'px'
                                }
                                clickIndex = i
                                tree.treeHoverIndex = i
                                if (+el.dataset.level === 4) {
                                    $scope.$apply()
                                } else {
                                    $scope.$apply()
                                }
                            }
                        }
                    })
                }

                function removeClickEvent() {
                    li.forEach((e, i) => {
                        e.onclick = null
                    })
                }

                var toggleMoveEvent = (function () {
                    let moveEventStatus = false
                    return function () {
                        if (moveEventStatus) {
                            moveEventStatus = false
                            removeMoveEvent()
                        } else {
                            moveEventStatus = true
                            addMoveEvent()
                        }
                    }
                })();

                var refreshMoveEvent = function () {
                    li = queryli()
                    removeMoveEvent()
                    removeClickEvent()
                    addMoveEvent()
                    addClickEvent()
                }

                /**
                 * @returns {[NodeList]} 页面上显示的所有li节点
                 */
                function queryli() {
                    return document.querySelectorAll("sn-tree2>div>ul.sn-tree>li.fold," +
                        "sn-tree2>div>ul.sn-tree>li.unfold," +
                        "sn-tree2>div>ul.sn-tree>li.unfold>ul.sn-tree>li.fold," +
                        "sn-tree2>div>ul.sn-tree>li.unfold>ul.sn-tree>li.unfold," +
                        "sn-tree2>div>ul.sn-tree>li.unfold>ul.sn-tree>li.unfold>ul.sn-tree>li.fold," +
                        "sn-tree2>div>ul.sn-tree>li.unfold>ul.sn-tree>li.unfold>ul.sn-tree>li.unfold," +
                        "sn-tree2>div>ul.sn-tree>li.unfold>ul.sn-tree>li.unfold>ul.sn-tree>li.unfold>ul.sn-tree>li.fold," +
                        "sn-tree2>div>ul.sn-tree>li.unfold>ul.sn-tree>li.unfold>ul.sn-tree>li.unfold>ul.sn-tree>li.unfold," +
                        "sn-tree2>div>ul.sn-tree>li.unfold>ul.sn-tree>li.unfold>ul.sn-tree>li.unfold>ul.sn-tree>li.unfold>ul.sn-tree>li.fold," +
                        "sn-tree2>div>ul.sn-tree>li.unfold>ul.sn-tree>li.unfold>ul.sn-tree>li.unfold>ul.sn-tree>li.unfold>ul.sn-tree>li.unfold," +
                        "sn-tree2>div>ul.sn-tree>li.unfold>ul.sn-tree>li.unfold>ul.sn-tree>li.unfold>ul.sn-tree>li.unfold>ul.sn-tree>li.unfold>ul.sn-tree>li.fold," +
                        "sn-tree2>div>ul.sn-tree>li.unfold>ul.sn-tree>li.unfold>ul.sn-tree>li.unfold>ul.sn-tree>li.unfold>ul.sn-tree>li.unfold>ul.sn-tree>li.unfold," +
                        "sn-tree2>div>ul.sn-tree>li.unfold>ul.sn-tree>li.unfold>ul.sn-tree>li.unfold>ul.sn-tree>li.unfold>ul.sn-tree>li.unfold>ul.sn-tree>li.unfold>ul.sn-tree>li.fold," +
                        "sn-tree2>div>ul.sn-tree>li.unfold>ul.sn-tree>li.unfold>ul.sn-tree>li.unfold>ul.sn-tree>li.unfold>ul.sn-tree>li.unfold>ul.sn-tree>li.unfold>ul.sn-tree>li.unfold," +
                        "sn-tree2>div>ul.sn-tree>li.unfold>ul.sn-tree>li.unfold>ul.sn-tree>li.unfold>ul.sn-tree>li.unfold>ul.sn-tree>li.unfold>ul.sn-tree>li.unfold>ul.sn-tree>li.unfold>ul.sn-tree>li.fold"
                    );
                }

                function treeInit(option) {
                    option = option ? option : {}
                    $timeout(() => {
                        li = queryli()
                        li.forEach((e) => {
                            if (e.clientHeight < liHeight) {
                                liHeight = e.clientHeight
                            }
                        })
                        let liTop = liHeight * (tree.treeHoverIndex)
                        let tools = angular.element('<div id="sys_tree_hover" style="background-color:#d5ebf8;height:' + liHeight +
                            'px;position: absolute;width: 100%;top: ' + liTop + 'px;pointer-events: none;"></div>');
                        $(element.children('div')[0]).append(tools);
                        // $compile(tools)($scope);
                        hover = document.getElementById("sys_tree_hover")
                        // toggleMoveEvent()
                        if (!option.isSearch)
                            addMoveEvent()
                        addClickEvent()
                        if (option.callback) {
                            option.callback()
                        }
                    })
                }

                /**
                 * @param {{}} t - 遍历JSON节点
                 * @param {function({},{level:number,option:[]})} cb - 遍历JSON节点时的回调
                 */
                function traverseJSON(t, cb) {
                    let level = -1
                    let route = []
                    return (function traverse(t, cb) {
                        level++
                        t.forEach((e, i) => {
                            route.length = level + 1
                            route[level] = i
                            cb(e, {
                                level: level,
                                index: i
                                // route: angular.extend([], route)
                            })
                            if (e.children && e.children.length) {
                                traverse(e.children, cb)
                            }
                        })
                        level--
                    })(t, cb);
                };

                function copy(obj) {
                    return JSON.parse(JSON.stringify(obj))
                }

            }
        }
    }]);
    INCLUDE_ALL_MODULES([], app)
}