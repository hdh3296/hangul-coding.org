(function (document, window, $) {

    $.ajaxSetup({cache: false});

    var GET = function(경로, 콜백) {
        // IE9에서는 인코딩이 필요하더라
        var 경로 = 경로.split("/").map(encodeURIComponent).join("/");
        return $.get(경로, 콜백);
    };

    var 소스코드표시 = function () {
        $('div[data-source][data-processed!="true"]').each(function(i, 노드) {
            var 블럭 = $(this).attr('data-processed', true);
            var 소스 = 블럭.attr("data-body") || 블럭.text();
            var 언어 = 블럭.attr("data-lang");
            var 파일 = 블럭.attr("data-remote");
            if (!언어 && !!파일) 언어 = 파일.split(".").pop();
            var 마임 = {java:       "text/x-java",
                        json:       "application/json",
                        javascript: "text/javascript",
                        js:         "text/javascript",
                        css:        "text/css",
                        sql:        "text/x-pgsql",
                        clojure:    "text/x-clojure",
                        clj:        "text/x-clojure"};
            var 모드 = 마임[언어] || 언어;
            var 테마 = "neo";
            var 옵션 = {value: 소스, lineNumbers: true,
                        mode: 모드, theme: 테마};
            CodeMirror(function(e) {
                노드.parentNode.replaceChild(e, 노드);
            }, 옵션);
        });
    };

    var 문서변환;

    var 마크다운 = function() {
        var 변환 = new marked.Renderer();

        // 기본 heading처리는 h태그 텍스트가 영문(+숫자)만 잘 처리 되기에,
        // 아래 코드로 별도 처리
        변환.heading = function(텍스트, 레벨) {
            var 링크 = 텍스트.toLowerCase().replace(/[\s]+/g, '-');
            return '<h' + 레벨 + '><a name="' + 링크 +
                '" class="제목-링크" href="#' + 링크 +
                '">#</a>' + 텍스트 + '</h' + 레벨 + '>';
        };

        변환.code = function(코드, 언어, escape) {
            return '<div class="소스" data-source="true" data-lang="' + 언어 +
                '">' + 코드 + '</div>';
        };

        marked.setOptions({
            /* highlight: function(코드) {
                return hljs.highlightAuto(코드).value;
            },*/
            sanitize: true,
            renderer: 변환
        });

        $('div[data-markdown][data-processed!="true"]').each(function() {
            var div = $(this).attr("data-processed", true);
            var 옵션 = div.attr("data-option");
            var 본문 = div.attr("data-body") || div.text();
            div.html(marked(본문, {sanitize: (옵션 != "신뢰")}));
            setTimeout(문서변환, 0);
        });
    };

    var 비동기_로드 = function() {
        $('div[data-remote][data-loaded!="true"]').each(function() {
            var 노드 = $(this).attr("data-loaded", true);
            var 소스 = 노드.attr('data-remote');
            var 타입 = 노드.attr('data-type');
            GET(소스, function(본문) {
                노드.attr("data-body", 본문);
                if (타입 == "마크다운") {
                    노드.attr("data-markdown", true);
                    문서변환();
                } else if (타입 == "소스코드") {
                    노드.attr("data-source", true);
                    소스코드표시();
                }
            });
        });
    };

    문서변환 = function() {
        비동기_로드();
        마크다운();
        소스코드표시();
    };

    $(문서변환);

    $(function 구글분석() {
        var 코드 = 'UA-75606874-1';
        (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
        (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
        m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
        })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

        ga('create', 'UA-75606874-1', 'auto');
        ga('send', 'pageview');
    });

})(document, window, jQuery);
