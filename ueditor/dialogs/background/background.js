(function () {

    var onlineImage,backupStyle = {};
    //    backupStyle = editor.queryCommandValue('background');
	var htmlObj = $('<div>' + editor.getContent() + ' </div>');
	if( htmlObj.find('.indoorsteambj').size() > 0 ) {
		var style = htmlObj.find('.indoorsteambj:first').attr('style');	
		if(style) {
			style = style.replace('&amp;','&');
			var style_arr = style.split(';');
			for(var i in style_arr) {
				var style_item = style_arr[i].split(':');
				if(style_item.length >= 2) {
					var idx = $.trim(style_item.shift()), val = $.trim(style_item.join(':'));
					
					backupStyle[ idx ] = val; //背景图网址含有“:”
				}
			}
		}
		
		//backupStyle = htmlObj.find('.indoorsteambj:first').get(0).style;
		/*var str = '',idxstr = '';
		for(var i in backupStyle) {
			str += i+':'+backupStyle[i]+';';
			idxstr += i+',';
		}
		alert(idxstr + "====\n" +str);
		alert(backupStyle['background-image']);*/
	}

    window.onload = function () {
        initTabs();
        initColorSelector();
    };

    /* 初始化tab标签 */
    function initTabs(){
        var tabs = $G('tabHeads').children;
        for (var i = 0; i < tabs.length; i++) {
            domUtils.on(tabs[i], "click", function (e) {
                var target = e.target || e.srcElement;
                for (var j = 0; j < tabs.length; j++) {
                    if(tabs[j] == target){
                        tabs[j].className = "focus";
                        var contentId = tabs[j].getAttribute('data-content-id');
                        $G(contentId).style.display = "block";
                        if(contentId == 'imgManager') {
                            initImagePanel();
                        }
                    }else {
                        tabs[j].className = "";
                        $G(tabs[j].getAttribute('data-content-id')).style.display = "none";
                    }
                }
            });
        }
    }

    /* 初始化颜色设置 */
    function initColorSelector () {
        var obj = backupStyle; //editor.queryCommandValue('background');
        if (obj) {
            var color = obj['background-color'],
                repeat = obj['background-repeat'] || 'repeat',
                image = obj['background-image'] || '',
                size = obj['background-size'] || 'auto auto',
                position = obj['background-position'] || 'left top',
                pos = position.split(' '),
                x = parseInt(pos[0]) || 0,
                y = parseInt(pos[1]) || 0;

            //if(repeat == 'no-repeat' && (x || y)) repeat = 'self';

            image = image.match(/url[\s]*\(([^\)]*)\)/);
            image = image ? image[1]:'';
            
         // 默认统计图去掉
			if(image == "http://stat.wx135.com/135editor/styles") { image = ''; }
            
            updateFormState('colored', color, image,position, repeat,size, x, y);
        } else {
            updateFormState();
        }

        var updateHandler = function () {
            updateFormState();
            updateBackground();
        }
        domUtils.on($G('nocolorRadio'), 'click', updateBackground);
        domUtils.on($G('coloredRadio'), 'click', updateHandler);
        domUtils.on($G('url'), 'keyup', function(){
            if($G('url').value && $G('alignment').style.display == "none") {
                utils.each($G('repeatBgType').children, function(item){
                    item.selected = ('repeat' == item.getAttribute('value') ? 'selected':false);
                });
            }
            updateHandler();
        });
        domUtils.on($G('repeatBgType'), 'change', updateHandler);
        domUtils.on($G('alignType'), 'change', updateHandler);
        domUtils.on($G('sizeType'), 'change', updateHandler);
        domUtils.on($G('x'), 'keyup', updateBackground);
        domUtils.on($G('y'), 'keyup', updateBackground);

        initColorPicker();
    }

    /* 初始化颜色选择器 */
    function initColorPicker() {
        var me = editor,
            cp = $G("colorPicker");

        /* 生成颜色选择器ui对象 */
        var popup = new UE.ui.Popup({
            content: new UE.ui.ColorPicker({
                noColorText: me.getLang("clearColor"),
                editor: me,
                onpickcolor: function (t, color) {
                    updateFormState('colored', color);
                    updateBackground();
                    UE.ui.Popup.postHide();
                },
                onpicknocolor: function (t, color) {
                    updateFormState('colored', 'transparent');
                    updateBackground();
                    UE.ui.Popup.postHide();
                }
            }),
            editor: me,
            onhide: function () {
            }
        });

        /* 设置颜色选择器 */
        domUtils.on(cp, "click", function () {
            popup.showAnchor(this);
        });
        domUtils.on(document, 'mousedown', function (evt) {
            var el = evt.target || evt.srcElement;
            UE.ui.Popup.postHide(el);
        });
        domUtils.on(window, 'scroll', function () {
            UE.ui.Popup.postHide();
        });
    }

    /* 初始化在线图片列表 */
    function initImagePanel() {
        onlineImage = onlineImage || new OnlineImage('imageList');
    }

    /* 更新背景色设置面板 */
    function updateFormState (radio, color, url, align,repeat,size, x, y) {
        var nocolorRadio = $G('nocolorRadio'),
            coloredRadio = $G('coloredRadio');

        if(radio) {
            nocolorRadio.checked = (radio == 'colored' ? false:'checked');
            coloredRadio.checked = (radio == 'colored' ? 'checked':false);
        }
        if(color) {
            domUtils.setStyle($G("colorPicker"), "background-color", color);
        }

        if(url && /^\//.test(url)) {
            var a = document.createElement('a');
            a.href = url;
            browser.ie && (a.href = a.href);
            url = browser.ie ? a.href:(a.protocol + '//' + a.host + a.pathname + a.search + a.hash);
        }

        if(url || url === '') {
            $G('url').value = url;
        }
        if(align) {
            utils.each($G('alignType').children, function(item){
                item.selected = (align == item.getAttribute('value') ? 'selected':false);
            });
        }
        if(repeat) {
            utils.each($G('repeatBgType').children, function(item){
                item.selected = (repeat == item.getAttribute('value') ? 'selected':false);
            });
        }
        if(size) {
            utils.each($G('sizeType').children, function(item){
                item.selected = (size == item.getAttribute('value') ? 'selected':false);
            });
        }
        if(x || y) {
            $G('x').value = parseInt(x) || 0;
            $G('y').value = parseInt(y) || 0;
        }

        $G('alignment').style.display = coloredRadio.checked && $G('url').value ? '':'none';
        $G('custom').style.display = coloredRadio.checked && $G('url').value && $G('alignType').value == 'self' ? '':'none';
    }

    /* 更新背景颜色 */
    function updateBackground () {
        if ($G('coloredRadio').checked) {
            var color = domUtils.getStyle($G("colorPicker"), "background-color"),
                bgimg = $G("url").value,
                size = $G("sizeType").value,
                repeat = $G("repeatBgType").value,
                align = $G("alignType").value,
                backgroundObj = {
                    "background-repeat": "no-repeat",
                    "background-position": "center center"
                };
            
            backgroundObj["padding"] = $G("padding").value;
            /*
            background-image: -webkit-linear-gradient(left, rgb(233, 139, 127), rgb(255, 255, 255), rgb(233, 139, 127));
            */

            if (color) backgroundObj["background-color"] = color;
            if (size) backgroundObj["background-size"] = size;
            if (repeat) {  backgroundObj["background-repeat"] = repeat;    }
            
            if (bgimg) {
            	backgroundObj["background-image"] = 'url(' + bgimg + ')';
            }
            else if (color){
            	var gradient = 'rgb(254, 254, 254)';
            	if(parent.getColor){
            		gradient = parent.getColor(color,'lighten','5%');
            		gradient = parent.getColor(gradient,'desaturate','5%');
                }
            	backgroundObj["background-image"] = '-webkit-linear-gradient(left, '+color+','+ gradient +' , '+color+');';
            }
            
            if (align == 'self') {
                backgroundObj["background-position"] = $G("x").value + "px " + $G("y").value + "px";
            }
            else{
            	backgroundObj["background-position"] =  align;
            }

            //editor.execCommand('background', backgroundObj);
            setArticleBackground(backgroundObj);
        } else {
            //editor.execCommand('background', null);
            setArticleBackground(null);
        }
    }
    
    function setArticleBackground(backgroundObj){
    	if(backgroundObj == null) {
    		var html = editor.getContent();
	    	var htmlObj = $('<div>' + html + ' </div>');
    		htmlObj.find('.indoorsteambj').removeAttr('style');
    		
    		//$(editor.selection.document).find('body').css('margin','15px');
    		
    		html = htmlObj.html();
    		editor.undoManger.save();
	    	editor.setContent(html);
	    	editor.undoManger.save(); 
    		return ;
    	}
    	else{
    		var bgStyle = ''
	    	for(var i in backgroundObj) {
	    		bgStyle += i+':'+backgroundObj[i]+';';
	    	}
	    	
	    	var html = editor.getContent();
	    	
	    	var htmlObj = $('<div>' + html + ' </div>');
	    	if( htmlObj.find('.indoorsteambj').size() > 0 ) {
	    		var style = htmlObj.find('.indoorsteambj:first').eq(0).style;
	    		var styleStr = '';
	    		for(var i in style) {
	    			if(! backgroundObj[i] ) {
	    				bgStyle = i+':'+backgroundObj[i]+';' + bgStyle;
	    			}
		    	}
	    		
	    		//htmlObj.find('.indoorsteambj').removeClass('indoorsteambj').removeAttr('style');
	    		htmlObj.find('.indoorsteambj').each(function(){
	    			//$(this).removeClass('indoorsteambj').removeAttr('style');
	    			$(this).replaceWith($(this).html()); //文章中包含indoorsteambj的样式通通去掉，只保留内部的内容。
	    		});
	    		
	    	}
	    	var innerHtml = $.trim( htmlObj.html() );
	    	if(innerHtml == "") { innerHtml = "<p><br/></p>";}
	    	
	    	html = '<section class="indoorsteambj" style="'+bgStyle+'">'+ innerHtml + '</section>';
	    	
	    	editor.undoManger.save();
	    	editor.setContent(html);
	    	editor.undoManger.save();
	    	
	    	//$(editor.selection.document).find('body').css('margin','0px');
    	}
    	
    }


    /* 在线图片 */
    function OnlineImage(target) {
        this.container = utils.isString(target) ? document.getElementById(target) : target;
        this.init();
    }
    OnlineImage.prototype = {
        init: function () {
            this.reset();
            this.initEvents();
        },
        /* 初始化容器 */
        initContainer: function () {
            this.container.innerHTML = '';
            this.list = document.createElement('ul');
            this.clearFloat = document.createElement('li');

            domUtils.addClass(this.list, 'list');
            domUtils.addClass(this.clearFloat, 'clearFloat');

            this.list.id = 'imageListUl';
            this.list.appendChild(this.clearFloat);
            this.container.appendChild(this.list);
        },
        /* 初始化滚动事件,滚动到地步自动拉取数据 */
        initEvents: function () {
            var _this = this;

            /* 滚动拉取图片 */
            domUtils.on($G('imageList'), 'scroll', function(e){
                var panel = this;
                if (panel.scrollHeight - (panel.offsetHeight + panel.scrollTop) < 10) {
                    _this.getImageData();
                }
            });
            /* 选中图片 */
            domUtils.on(this.container, 'click', function (e) {
                var target = e.target || e.srcElement,
                    li = target.parentNode,
                    nodes = $G('imageListUl').childNodes;

                if (li.tagName.toLowerCase() == 'li') {
                    updateFormState('nocolor', null, '');
                    for (var i = 0, node; node = nodes[i++];) {
                        if (node == li && !domUtils.hasClass(node, 'selected')) {
                            domUtils.addClass(node, 'selected');
                            updateFormState('colored', null, li.firstChild.getAttribute("_src"), 'repeat');
                        } else {
                            domUtils.removeClasses(node, 'selected');
                        }
                    }
                    updateBackground();
                }
            });
        },
        /* 初始化第一次的数据 */
        initData: function () {

            /* 拉取数据需要使用的值 */
            this.state = 0;
            this.listSize = editor.getOpt('imageManagerListSize');
            this.listIndex = 0;
            this.listEnd = false;

            /* 第一次拉取数据 */
            this.getImageData();
        },
        /* 重置界面 */
        reset: function() {
            this.initContainer();
            this.initData();
        },
        /* 向后台拉取图片列表数据 */
        getImageData: function () {
            var _this = this;

            if(!_this.listEnd && !this.isLoadingData) {
                this.isLoadingData = true;
                var url = editor.getActionUrl(editor.getOpt('imageManagerActionName')),
                    isJsonp = utils.isCrossDomainUrl(url);
                url += '&type=bg';
                
                ajax.request(url, {
                    'timeout': 100000,
                    'dataType': isJsonp ? 'jsonp':'',
                    'data': utils.extend({
                            start: this.listIndex,
                            size: this.listSize
                        }, editor.queryCommandValue('serverparam')),
                    'method': 'get',
                    'onsuccess': function (r) {
                        try {
                            var json = isJsonp ? r:eval('(' + r.responseText + ')');
                            if (json.state == 'SUCCESS') {
                                _this.pushData(json.list);
                                _this.listIndex = parseInt(json.start) + parseInt(json.list.length);
                                if(_this.listIndex >= json.total) {
                                    _this.listEnd = true;
                                }
                                _this.isLoadingData = false;
                            }
                        } catch (e) {
                            if(r.responseText.indexOf('ue_separate_ue') != -1) {
                                var list = r.responseText.split(r.responseText);
                                _this.pushData(list);
                                _this.listIndex = parseInt(list.length);
                                _this.listEnd = true;
                                _this.isLoadingData = false;
                            }
                        }
                    },
                    'onerror': function () {
                        _this.isLoadingData = false;
                    }
                });
            }
        },
        /* 添加图片到列表界面上 */
        pushData: function (list) {
            var i, item, img, icon, _this = this,
                urlPrefix = editor.getOpt('imageManagerUrlPrefix');
            for (i = 0; i < list.length; i++) {
                if(list[i] && list[i].url) {
                    item = document.createElement('li');
                    img = document.createElement('img');
                    icon = document.createElement('span');

                    domUtils.on(img, 'load', (function(image){
                        return function(){
                            _this.scale(image, image.parentNode.offsetWidth, image.parentNode.offsetHeight);
                        }
                    })(img));
                    img.width = 113;
                    img.setAttribute('src', urlPrefix + list[i].url + (list[i].url.indexOf('?') == -1 ? '?noCache=':'&noCache=') + (+new Date()).toString(36) );
                    img.setAttribute('_src', urlPrefix + list[i].url);
                    domUtils.addClass(icon, 'icon');

                    item.appendChild(img);
                    item.appendChild(icon);
                    this.list.insertBefore(item, this.clearFloat);
                }
            }
        },
        /* 改变图片大小 */
        scale: function (img, w, h, type) {
            var ow = img.width,
                oh = img.height;

            if (type == 'justify') {
                if (ow >= oh) {
                    img.width = w;
                    img.height = h * oh / ow;
                    img.style.marginLeft = '-' + parseInt((img.width - w) / 2) + 'px';
                } else {
                    img.width = w * ow / oh;
                    img.height = h;
                    img.style.marginTop = '-' + parseInt((img.height - h) / 2) + 'px';
                }
            } else {
                if (ow >= oh) {
                    img.width = w * ow / oh;
                    img.height = h;
                    img.style.marginLeft = '-' + parseInt((img.width - w) / 2) + 'px';
                } else {
                    img.width = w;
                    img.height = h * oh / ow;
                    img.style.marginTop = '-' + parseInt((img.height - h) / 2) + 'px';
                }
            }
        },
        getInsertList: function () {
            var i, lis = this.list.children, list = [], align = getAlign();
            for (i = 0; i < lis.length; i++) {
                if (domUtils.hasClass(lis[i], 'selected')) {
                    var img = lis[i].firstChild,
                        src = img.getAttribute('_src');
                    list.push({
                        src: src,
                        _src: src,
                        floatStyle: align
                    });
                }

            }
            return list;
        }
    };

    dialog.onok = function () {
        updateBackground();
        editor.fireEvent('saveScene');
    };
    dialog.oncancel = function () {
        //editor.execCommand('background', backupStyle);
        setArticleBackground(backupStyle);
    };

})();