// 微信编辑器核心数据

function launchFullscreen(a) { if (a.requestFullscreen) { a.requestFullscreen() } else { if (a.mozRequestFullScreen) { a.mozRequestFullScreen() } else { if (a.msRequestFullscreen) { a.msRequestFullscreen() } else { if (a.webkitRequestFullscreen) { a.webkitRequestFullScreen() } } } } };

function exitFullscreen() { if (document.exitFullscreen) { document.exitFullscreen() } else { if (document.mozCancelFullScreen) { document.mozCancelFullScreen() } else { if (document.webkitExitFullscreen) { document.webkitExitFullscreen() } } } };

function fullscreenElement() { return document.fullscreenElement || document.webkitCurrentFullScreenElement || document.mozFullScreenElement || null };
$(function() {
    $("#phoneclose").on('click', function() { $("#previewbox").hide() });
    $('.clear-editor').click(function() {
        if (confirm('是否确认清空内容，清空后内容将无法恢复')) {
            c.setContent('');
        }
    });

    var client = new ZeroClipboard($('.copy-editor-html'));
    ZeroClipboard.config({
        swfPath: "ueditor/third-party/zeroclipboard/ZeroClipboard.swf"
    });
    client.on('ready', function(event) {
        client.on('copy', function(event) {
            event.clipboardData.setData('text/html', c.getContent());
            event.clipboardData.setData('text/plain', c.getContent());
        });
        client.on('aftercopy', function(event) {
            alert('正文内容已经复制到剪切板，可粘贴（ctrl+v）到微信公众平台编辑器中使用！');
        });
    });
    $("#phone").on('click', function() { if ($("#previewbox").css("display") == "block") { $("#previewbox").hide(); } else { $("#previewbox").show(); } });
    $(window).on('fullscreenchange webkitfullscreenchange mozfullscreenchange', function() { if (!fullscreenElement()) { $('.wxeditor').css({ margin: '0' }); } });
    $('.fullshowbox1').on('click', function() { $('.wxeditor').css({ margin: '50px 0' });
        launchFullscreen(document.documentElement) });
    $('.fullhidebox1').on('click', function() { $('#wxeditortip,#header').show();
        exitFullscreen() });
    var b = ["borderTopColor", "borderRightColor", "borderBottomColor", "borderLeftColor"],
        d = [];
    $.each(b, function(a) { d.push(".itembox .wxqq-" + b[a]) });
    $("#colorpickerbox").ColorPicker({ flat: true, color: "#00bbec", onChange: function(a, e, f) { $(".itembox .wxqq-bg").css({ backgroundColor: "#" + e });
            $(".itembox .wxqq-color").css({ color: "#" + e });
            $.each(d, function(g) { $(d[g]).css(b[g], "#" + e) }) } });
    var c = UE.getEditor("editor", {
        topOffset: 0,
        autoFloatEnabled: false,
        autoHeightEnabled: false,
        autotypeset: { removeEmptyline: true },
        toolbars: [
            ['fullscreen', 'source', '|', 'undo', 'redo', '|',
                'bold', 'italic', 'underline', 'fontborder', 'strikethrough', 'superscript', 'subscript', 'removeformat', 'formatmatch', 'autotypeset', 'blockquote', 'pasteplain', '|', 'forecolor', 'backcolor', 'insertorderedlist', 'insertunorderedlist', 'selectall', 'cleardoc', '|',
                'rowspacingtop', 'rowspacingbottom', 'lineheight', '|', 'fontfamily', 'fontsize', '|',
                'indent', '|',
                'justifyleft', 'justifycenter', 'justifyright', 'justifyjustify', '|', 'touppercase', 'tolowercase', '|',
                'anchor', 'insertimage', 'insertvideo', 'music', 'emotion', '|',
                'horizontal', 'date', 'time', 'spechars', '|',
                'inserttable', 'deletetable', 'insertparagraphbeforetable', 'insertrow', 'deleterow', 'insertcol', 'deletecol', 'mergecells', 'mergeright', 'mergedown', 'splittocells', 'splittorows', 'splittocols', 'charts', '|', 'preview', 'searchreplace', 'drafts'
            ]
        ]
    });
    c.ready(function() { c.addListener('contentChange', function() { $("#preview").html(c.getContent() + '<div><a style="font-size:12px;color:#607fa6" href="http://weixin.sogou.com/gzh?openid=oIWsFt8725gXE_NmUXhnm11I9jJM" target="_blank" id="post-user">阅读原文</a> <em style="color:#8c8c8c;font-style:normal;font-size:12px;">阅读 100000+</em><span class="fr"><a style="font-size:12px;color:#607fa6" href="http://wpa.qq.com/msgrd?v=3&uin=276116565&site=qq&menu=yes" target="_blank">举报</a></span></div>'); });
        $(".itembox").on("click", function(a) { c.execCommand("insertHtml", "<div>" + $(this).html() + "</div><br />") }) });
    $(".tabs li a").on("click", function() { $(this).addClass("current").parent().siblings().each(function() { $(this).find("a").removeClass("current") });
        $("#" + $(this).attr("tab")).show().siblings().hide() })
});

window.onbeforeunload = function(event) {
    (event || window.event).returnValue = "您即将关闭页面，是否确认编辑内容已经复制到微信公众平台后台？";
}