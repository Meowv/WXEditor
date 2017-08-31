function launchFullscreen(a) { if (a.requestFullscreen) { a.requestFullscreen() } else { if (a.mozRequestFullScreen) { a.mozRequestFullScreen() } else { if (a.msRequestFullscreen) { a.msRequestFullscreen() } else { if (a.webkitRequestFullscreen) { a.webkitRequestFullScreen() } } } } };

function exitFullscreen() { if (document.exitFullscreen) { document.exitFullscreen() } else { if (document.mozCancelFullScreen) { document.mozCancelFullScreen() } else { if (document.webkitExitFullscreen) { document.webkitExitFullscreen() } } } };

function fullscreenElement() { return document.fullscreenElement || document.webkitCurrentFullScreenElement || document.mozFullScreenElement || null };
/*! Create by qkl QQ:276116565 - 2015-02-04 20:34:31 */
$(function() {
    var a = new ZeroClipboard($(".copywx"));
    $("#mask").size() >= 1 && $("#mask").height($("body").height()), $(".colorshow").on("click", function() { "block" == $("#colorpickerbox").css("display") ? ($("#colorpickerbox").slideUp(), $(".content").height($(".content").height() + 195)) : ($("#colorpickerbox").slideDown(), $(".content").height($(".content").height() - 195)) }), $("#phoneclose").on("click", function() { $("#previewbox").hide() }), $("#phone").on("click", function() { "block" == $("#previewbox").css("display") ? $("#previewbox").hide() : $("#previewbox").show() }), $(window).on("fullscreenchange webkitfullscreenchange mozfullscreenchange", function() { fullscreenElement() || $(".wxeditor").css({ margin: "10px 0 0 0" }) }), $(".fullshowbox").on("click", function() { $(".wxeditor").css({ margin: "50px 0" }), launchFullscreen(document.documentElement) }), $(".fullhidebox").on("click", function() { $("#wxeditortip,#header").show(), exitFullscreen() });
    var b = ["borderTopColor", "borderRightColor", "borderBottomColor", "borderLeftColor"],
        c = [];
    $.each(b, function(a) { c.push(".itembox .wxqq-" + b[a]) }), $("#colorpickerbox").ColorPicker({ flat: !0, color: "#f54242", onChange: function(a, d) { $(".itembox .wxqq-bg").css({ backgroundColor: "#" + d }), $(".itembox .wxqq-color").css({ color: "#" + d }), $.each(c, function(a) { $(c[a]).css(b[a], "#" + d) }) } });
    var d = UE.getEditor("editor", {
        topOffset: 0,
        autoFloatEnabled: !1,
        autoHeightEnabled: !1,
        autotypeset: { removeEmptyline: !0 },
        toolbars: [
            ["source", "undo", "redo", "bold", "italic", "underline", "forecolor", "backcolor", "link", "unlink", "paragraph", "fontfamily", "fontsize", ],
            ["indent", "justifyleft", "justifyright", "justifycenter", "justifyjustify", "rowspacingtop", "rowspacingbottom", "lineheight", "edittip ", "inserttable", "template", 'drafts', "emotion", "map", "insertvideo", "spechars", "searchreplace", "removeformat", "autotypeset", ]
        ],
        autoHeightEnabled: false,
        allowDivTransToP: false,
        autoFloatEnabled: false,
        enableAutoSave: true
    });
    d.addListener("click", function(t, evt) {

        evt = evt || window.event;
        var el = evt.target || evt.srcElement;
        if (el.tagName == "IMG") {
            return;
        }
        if ($(el).parents('.unieditor').size() > 0) {
            el = $(el).parents('.unieditor:first').get(0);
            if (current_active_v3item) {
                current_active_v3item.removeAttr('style');
            }
            current_active_v3item = $(el);
            current_active_v3item.css({
                'border': '1px dotted rgb(255, 68, 1)',
                'padding': '2px'
            });
            clickPop.render();
            var html = clickPop.formatHtml('<nobr class="otf-poptools">' + '<span onclick="$$.select()" stateful>' + '选中</span>' + '<span onclick="$$._remove()" stateful>' + '删除</span>' + '<br/><span onclick="$$._blank()" stateful>' + '后空行</span>' + '<span onclick="$$._preblank()" stateful>' + '前空行</span>' + '</nobr>');
            var content = clickPop.getDom('content');
            content.innerHTML = html;
            clickPop.anchorEl = el;
            clickPop.showAnchor(clickPop.anchorEl);
            var client = new ZeroClipboard($(clickPop.getDom('content')).find('.copy'));
            client.on('ready', function(event) {
                client.on('copy', function(event) {
                    $(clickPop.anchorEl).removeAttr('style');
                    event.clipboardData.setData('text/html', $(clickPop.anchorEl).prop('outerHTML'));
                    clickPop.hide();
                    showSuccessMessage("已成功复制到剪切板");
                });
            });
            var cut_client = new ZeroClipboard($(clickPop.getDom('content')).find('.cut'));
            cut_client.on('ready', function(event) {
                cut_client.on('copy', function(event) {
                    $(clickPop.anchorEl).removeAttr('style');
                    event.clipboardData.setData('text/html', $(clickPop.anchorEl).prop('outerHTML'));
                    clickPop.hide();
                    $(clickPop.anchorEl).remove();
                    showSuccessMessage("已成功剪切到剪切板");
                });
            });
        } else {
            if (current_active_v3item) {
                current_active_v3item.removeAttr('style');
                current_active_v3item = null;
            }
        }
    });
    var clickPop = new baidu.editor.ui.Popup({
        content: "",
        editor: d,
        _remove: function() {
            $(clickPop.anchorEl).remove();
            clickPop.hide();
        },
        _copy: function() {
            $(clickPop.anchorEl).prop('outerHTML');
            clickPop.hide();
        },
        select: function() {
            var range = d.selection.getRange();
            range.selectNode(clickPop.anchorEl);
            range.select();
        },
        _blank: function() {
            $('<p><br/></p>').insertAfter(clickPop.anchorEl);
        },
        _preblank: function() {
            $('<p><br/></p>').insertBefore(clickPop.anchorEl);
        },
        _video: function() {
            d.ui._dialogs['insertvideoDialog'] && d.ui._dialogs['insertvideoDialog'].open();
            d.ui._dialogs['insertvideoDialog'].anchorEl = clickPop.anchorEl;
        },
        className: 'edui-bubble'
    });
    d.ready(function() {
        a.on("copy", function(a) {
            var b = a.clipboardData;
            b.setData("text/html", d.getContent()), alert("恭喜成功复制！粘贴即可！")
        }), d.addListener("contentChange", function() { $("#preview").html(d.getContent()) }), $(".itembox").on("click", function() { d.execCommand("insertHtml", '<section class="unieditor">' + $(this).html() + "</section><br />") })
    }), $(".tabs li a").on("click", function() { $(this).addClass("current").parent().siblings().each(function() { $(this).find("a").removeClass("current") }), $("#" + $(this).attr("tab")).show().siblings().hide() }), $(".itembox img,.itembox audio").each(function() {
        var a = $(this);
        a.attr("src", a.data("src"))
    })
});


var current_active_v3item = null;
// ZeroClipboard.config({ swfPath: 'ZeroClipboard.swf' });
// var client = new ZeroClipboard($('.copy-editor-html'));
// $(function() {
//     $(window).resize(function() {
//         var win_height = $(window).height();

//         // $('#editor,.edui-editor-iframeholder').height(area_height - 16);
//         // $('#styleselect').height(area_height);
//         // $('.content').height(area_height - 110);
//     }).trigger('resize');

// });