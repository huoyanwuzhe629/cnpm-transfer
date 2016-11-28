function Transfer(transfer, options) {
    this.options = $.extend({}, options || {});
    this.keyMap = this.options.keyMap || { id: 'id', title: 'title', chosen: 'chosen' };
    this.formatedDataSource = this.formatInput(this.options.dataSource);
    this.noContent = this.options.noContent || '请新增选项';

    this.$el = $(transfer);
    this.$el.append(this.getHtml((this.options.titles || ['请选择', '已选择']), (this.options.styles || [])));

    this.$leftListHeader = this.$el.find('.js-left-list .biz-transfer-list-header');
    this.$rightListHeader = this.$el.find('.js-right-list .biz-transfer-list-header');
    this.$leftListBody = this.$el.find('.js-left-list .biz-transfer-list-content');
    this.$rightListBody = this.$el.find('.js-right-list .biz-transfer-list-content');
    this.init();
}

Transfer.prototype = {
    /**
     * 根据keyMap对数据属性值进行处理
     */
    formatInput: function(dataSource) {
        var formatedData = [],
            me = this;
        dataSource = dataSource || [];
        if (dataSource.length) {
            $.each(dataSource, function(index, value) {
                var tmp = {
                    id: '',
                    title: '',
                    chosen: false
                };

                tmp.id = value[me.keyMap.id];
                tmp.title = value[me.keyMap.title];
                if (value[me.keyMap.chosen]) {
                    tmp.chosen = value[me.keyMap.chosen];
                }

                formatedData.push(tmp);
            });
        }
        return formatedData;
    },

    /**
     * 输出时还原数据属性值
     */
    formatOutPut: function(targets, dataSource) {
        var me = this,
            result = [];
        if (targets.length) {
            $.each(targets, function(index, value) {
                var sourceData;
                sourceData = dataSource.filter(function(data) {
                    return data[me.keyMap.id] == value.id;
                })[0];
                if (me.keyMap.chosen) {
                    sourceData[me.keyMap.chosen] = value.chosen;
                }
                result.push(sourceData);
            });
        }
        return result;
    },

    /**
     * html
     */
    getHtml: function(titles, styles) {
        var leftStyle = styles[0] ? 　'width:' + styles[0].width + ';height:' + styles[0].height : '',
            rightStyle = styles[1] ? 　'width:' + styles[1].width + ';height:' + styles[1].height : '',
            html = '<div class="biz-transfer">\
                    <div class="biz-transfer-list js-left-list" style= ' + leftStyle + '>\
                        <div class="biz-transfer-list-header js-left-header">\
                            <input type="checkbox" title=" " id="leftSelectAll" class="js-leftSelectAll"/>\
                            <span>' + titles[0] + '</span>\
                        </div>\
                        <div class="biz-transfer-list-body">\
                            <ul class="biz-transfer-list-content">\
                            </ul>\
                        </div>\
                    </div>\
                    <div class="biz-transfer-operation">\
                        <button class="js-add biz-transfer-button"><span class="icon-right"></span></button>\
                        <button class="js-remove biz-transfer-button"><span class="icon-left"></span></button>\
                    </div>\
                    <div class="biz-transfer-list js-right-list" style=' + rightStyle + '>\
                        <div class="biz-transfer-list-header js-right-header">\
                            <input type="checkbox" title=" " id="rightSelectAll" class="js-rightSelectAll"/>\
                            <span>' + titles[1] + '</span>\
                        </div>\
                        <div class="biz-transfer-list-body">\
                            <ul class="biz-transfer-list-content">\
                            </ul>\
                        </div>\
                    </div>\
                </div>';

        return html;
    },

    /**
     * 初始化
     */
    init: function() {
        this.render();
        this.initEvents();
        this.$el.find('button').bizButton();
    },

    /**
     * 绑定事件
     */
    initEvents: function() {
        this.bindSelect();
        this.bindButton();
    },

    /**
     * 渲染
     */
    render: function() {
        var me = this;
        this.$leftListBody.html('');
        this.$rightListBody.html('');

        if (this.formatedDataSource.length) {
            $.each(this.formatedDataSource, function(index, value) {
                me.$leftListBody.append(
                    '<li class="biz-transfer-list-content-item" key="' + value.id + '" chosen=' + value.chosen + '>\
                            <span>' + value.title + '</span>\
                        </li>'
                );
            });
        } else {
            this.$leftListBody.html('<li class="biz-transfer-list-content-item" style="text-align:center">\
                    <span>' + this.noContent + '</span>\
                </li>');
        }
        if (this.getTargets().length) {
            $.each(this.getTargets(), function(index, value) {
                me.$rightListBody.append(
                    '<li class="biz-transfer-list-content-item" key="' + value.id + '" chosen=' + value.chosen + '>\
                            <span>' + value.title + '</span>\
                        </li>'
                );
            });
        }
        this.createSelect();
    },

    /**
     * 新增左侧框选项
     */
    addItems: function(items) {
        var me = this,
            formatedItems = this.formatInput(items);
        if (formatedItems.length) {
            formatedItems = formatedItems.filter(function(item) {
                var flag = true;
                $.each(me.formatedDataSource, function(index, value) {
                    if (value.id == item.id) {
                        flag = false;
                    }
                })
                return flag;
            });
            me.formatedDataSource = me.formatedDataSource.concat(formatedItems);
            me.options.dataSource = me.options.dataSource.concat(me.formatOutPut(formatedItems, items));
            me.addOption(formatedItems, 'left');
        }
    },

    /**
     * 通过chosen字段获得右侧框对应的数据
     */
    getTargets: function() {
        var me = this;
        return this.formatedDataSource.filter(function(data) {
            return data.chosen;
        })
    },

    /**
     * 获取右侧框选项的id值
     */
    getTargetKeys: function() {
        var $li = this.$rightListBody.find('li'),
            targetKeys = [];

        $.each(this.getSelectedIndex('right'), function(index, value) {
            targetKeys.push($($li[value]).attr('key'));
        });

        return targetKeys;
    },

    /**
     * 每项前面新建checkbox
     */
    createSelect: function() {
        var me = this;
        if (this.formatedDataSource.length) {
            $.each(this.formatedDataSource, function(index, value) {
                $(me.$leftListBody.find('li')[index]).prepend('<input type="checkbox" title="" /> ')
            });
            $.each(this.getTargets(), function(index, value) {
                $(me.$rightListBody.find('li')[index]).prepend('<input type="checkbox" title=""  />')
            });
        }
        this.$el.find(':checkbox').bizCheckbox();
        this.$leftListBody.find('li[chosen=true]').addClass('biz-transfer-disabled');
        this.$leftListBody.find('li[chosen=true]').find(':checkbox').bizCheckbox('disable');
    },

    /**
     * 绑定全选事件
     */
    bindSelect: function() {
        var me = this;
        this.$el.on('click', '.js-left-header .biz-label', function(e) {
            var selected = $(e.target).hasClass('biz-checkbox-checked'),
                $checkbox = me.$leftListBody.find('li[chosen=false]').find(':checkbox');

            if (selected) {
                $checkbox.bizCheckbox('check');
            } else {
                $checkbox.bizCheckbox('uncheck');
            }
        }).on('click', '.js-right-header .biz-label', function(e) {
            var selected = $(e.target).hasClass('biz-checkbox-checked'),
                $checkbox = me.$rightListBody.find(':checkbox');

            if (selected) {
                $checkbox.bizCheckbox('check');
            } else {
                $checkbox.bizCheckbox('uncheck');
            }
        });
    },

    /**
     * 将相应选项移至右边
     */
    moveRight: function(indexList) {
        var me = this,
            addList = [];

        $.each(indexList, function(index, value) {
            var $li = $(me.$leftListBody.find('li')[value]);
            $li.addClass('biz-transfer-disabled')
                .attr('chosen', true).find(':checkbox')
                .bizCheckbox('disable').bizCheckbox('uncheck');

            me.formatedDataSource[value].chosen = true;
            addList.push(me.formatedDataSource[value]);
        });
        me.$el.find('.js-leftSelectAll').bizCheckbox('uncheck');
        me.addOption(addList, 'right');
    },

    /**
     * 将相应选项移至左边
     */
    moveLeft: function(indexList) {
        var me = this,
            $rightLi = [],
            targetKeys = me.getTargetKeys();


        $.each(indexList, function(index, value) {
            var leftIndex = me.findIndexById(me.formatedDataSource, targetKeys[index]),
                $leftLi = $(me.$leftListBody.find('li')[leftIndex]);

            $leftLi.removeClass('biz-transfer-disabled')
                .attr('chosen', false).find(':checkbox')
                .bizCheckbox('enable');
            me.formatedDataSource[leftIndex].chosen = false;

            $rightLi.push(me.$rightListBody.find('li')[value]);
        });

        $($rightLi).remove();
        me.$el.find('.js-rightSelectAll').bizCheckbox('uncheck');
    },

    /**
     * 为按钮绑定事件
     */
    bindButton: function() {
        //添加
        var me = this;

        this.$el.on('click', '.js-add', function(e) {
            var indexList = me.getSelectedIndex('left');
            if (indexList.length > 0) {
                me.moveRight(indexList);

                if (me.options.onChange) {
                    me.options.onChange();
                }
            } else {
                return false;
            }
        });

        //移除
        this.$el.on('click', '.js-remove', function(e) {
            var indexList = me.getSelectedIndex('right');

            if (indexList.length > 0) {
                me.moveLeft(indexList);

                if (me.options.onChange) {
                    me.options.onChange();
                }
            } else {
                return false;
            }
        });
    },

    /**
     * 通过id获取在数据数组中的序号
     */
    findIndexById: function(dataList, id) {
        var idList = [],
            me = this;

        $.each(dataList, function(index, value) {
            idList.push(value.id);
        });

        return $.inArray(parseInt(id, 10), idList);
    },

    /**
     * 右侧框增加选项
     */
    addOption: function(dataList, position) {
        var me = this;
        if (dataList.length > 0) {
            var $liList = [];
            $.each(dataList, function(index, value) {
                var $li = $(
                    '<li class="biz-transfer-list-content-item" key="' + value.id + '"  chosen=' + value.chosen + '>\
                    <input type="checkbox" title="" />\
                    <span>' + value.title + '</span>\
                </li>'
                );
                $liList.push($li[0])
            });
            if (position == 'right') {
                this.$rightListBody.prepend($liList);
            } else {
                this.$leftListBody.append($liList);
            }
            $($liList).find(':checkbox').bizCheckbox();
        }
    },

    /**
     * 获取被选中项的序号
     */
    getSelectedIndex: function(position) {
        var indexList = [],
            me = this;
        if (position == 'left') {
            $.each(this.$leftListBody.find('.biz-checkbox-checked'), function(index, label) {
                indexList.push($.inArray(label, me.$leftListBody.find('.biz-label')));
            });
        } else {
            $.each(this.$rightListBody.find('.biz-checkbox-checked'), function(index, label) {
                indexList.push($.inArray(label, me.$rightListBody.find('.biz-label')));
            });
        }
        return indexList;
    },

    /**
     * 输出右侧框对应的项的值
     */
    getValue: function() {
        var me = this,
            targets = me.getTargets(),
            result = me.formatOutPut(targets, me.options.dataSource);

        return result;
    },

    /**
     * 提供选中相应选项的api
     */
    select: function(idList) {
        var indexList = [],
            me = this;

        $.each(idList, function(index, value) {
            var i = me.findIndexById(me.formatedDataSource, value);
            if (i != '-1' && me.formatedDataSource[i].chosen != true) {
                indexList.push(i);
            }
        });

        me.moveRight(indexList);
    },

    //更新组件数据
    update: function(data) {
        this.options.dataSource = data;
        this.formatedDataSource = this.formatInput(this.options.dataSource);
        this.render();
    }
};

var dataKey = 'bizTransfer';
$.extend($.fn, {
    bizTransfer: function(method, options) {
        var bizTransfer;
        switch (method) {
            case 'add':
                bizTransfer = $(this).data(dataKey);
                if (bizTransfer) {
                    bizTransfer.addItems(options);
                }
                break;

            case 'value':
                bizTransfer = $(this).data(dataKey);
                if (bizTransfer) {
                    return bizTransfer.getValue();
                }
                break;

            case 'select':
                bizTransfer = $(this).data(dataKey);
                if (bizTransfer) {
                    return bizTransfer.select(options);
                }
                break;

            case 'update':
                bizTransfer = $(this).data(dataKey);
                if (bizTransfer) {
                    return bizTransfer.update(options);
                }
                break;

            default:
                if (!$(this).data(dataKey)) {
                    $(this).data(dataKey, new Transfer(this, method));
                }
        }
        return this;
    }
});
