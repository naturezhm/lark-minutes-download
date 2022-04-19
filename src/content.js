console.log('content js 插件加载成功!')

// 默认设置，开启视频下载，不开字幕下载
var switchConfig = {
    enable: true,
    downloadVideo: true,
    downloadSrc: false
}


function _getCookies(domain, cname) {
    // var result;
    // chrome.cookies.get({ "url": domain, "name": name }, function (cookie) {
    //     result = cookie.value;
    // });

    // return result;
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i].trim();
        if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
    }
    return "";
}

var getCrcToken = () => {
    return _getCookies("supermonkey.feishu.cn", "bv_csrf_token")
}

var downloadSRC = id => {
    console.log("开始下载字幕: " + id)
    if (id == null || id == "") {
        return
    }
    // iframe的方式去下载
    var ddz = document.querySelector("body > div.document-drop-zone")
    if (ddz == null) {
        ddz = document.createElement("div")
        ddz.className = "document-drop-zone"
        ddz.style.display = "none"
        document.body.appendChild(ddz)
    }

    ddz.innerHTML = ''

    var iframe = document.createElement("iframe");
    iframe.src = 'https://supermonkey.feishu.cn/minutes/' + id + '#dld'

    ddz.appendChild(iframe)
}

var downloadMP4 = id => {
    console.log("开始下载视频: " + id)
    if (id == null || id == "") {
        return
    }
    var timestamp = new Date().getTime()

    // https://supermonkey.feishu.cn/minutes/api/base-info?language=zh_cn&is_open_m_m=true&object_token=function%20pop()%20{%20[native%20code]%20}&_t=1650038666681
    //普通get请求
    http.get({
        url: 'https://supermonkey.feishu.cn/minutes/api/base-info?language=zh_cn&is_open_m_m=true&object_token=' + id + '&_t=' + timestamp,
        headers: { "bv_csrf_token": getCrcToken() },
    }, (err, result) => {
        // 这里对结果进行处理
        console.log('err:', err)
        console.log('result:', result)

        if (result == null || result.data == null || result.code != 0) {
            return
        }

        // https://internal-api-drive-stream.feishu.cn/space/api/box/stream/download/all/boxcnLKBJXPkeIg9C5RCH8MsCjd
        window.open(result.data.video_url)
    });
}


var downloadSelected = e => {
    console.log(e)

    // 遍历全部的选中元素
    var _selected = document.querySelectorAll("#app > div > div > div.mm-content-outside > div.mm-content > div.list-table.batch-select > div > .meeting-list-item-selected > a")

    console.log(_selected)

    var items = [];

    if (_selected != null && _selected.length > 0) {
        _selected.forEach(function (item) {
            items.push(item.href.replace("https://supermonkey.feishu.cn/minutes/", ""))
        })
    }

    if (items.length <= 0) {
        return
    }

    var item = items.pop()
    downloadMP4(item)
    // downloadSRC(item)

    setInterval(() => {
        if (items.length <= 0) {
            clearInterval(this)
            return
        }

        // 每过5s 开始下载一个文件
        var item = items.pop()
        downloadMP4(item)
        // downloadSRC(item)
    }, 5000)

}


var insertDownloadBtn = () => {
    // 插入下载按钮
    var mld = document.querySelector("#app > div > div > div.mm-content-outside > div.mm-content > div.meeting-list-delete")

    if (mld == null || mld.querySelector("#download-btn") != null) {
        return
    }

    mld.insertAdjacentHTML('beforeend', '<button type="button" id="download-btn" class="ud__button ud__button--outlined ud__button--outlined-primary ud__button--size-md restore-btn">下载</button>');

    mld.querySelector("#download-btn").addEventListener("click", downloadSelected)
}


var initMain = () => {
    console.log('初始化主页面')

    // 插入下载按钮
    var rb = document.querySelector("#app > div > div > div.mm-content-outside > div.mm-content > div.page-title > div.right-buttons")

    rb.insertAdjacentHTML('afterbegin', '<button type="button" id="right-buttons-download-btn" class="ud__button ud__button--outlined ud__button--outlined-primary ud__button--size-md restore-btn">下载</button>')

    rb.querySelector("#right-buttons-download-btn").addEventListener("click", downloadSelected)


    setInterval(insertDownloadBtn, 300);
}

var _downloadSRC = () => {
    var id = window.location.href.replace("https://supermonkey.feishu.cn/minutes/", "")

    console.log('_downloadSRC id:', id)

    var timestamp = new Date().getTime()

    // -H 'referer: https://supermonkey.feishu.cn/minutes/obcn3rtw1f1y7xx59yt8fwnz' \

    //post请求
    http.post({
        url: 'https://supermonkey.feishu.cn/minutes/api/export?_t=' + timestamp,
        headers: { "bv_csrf_token": getCrcToken() },
        data: 'add_speaker=true&add_timestamp=true&format=3&is_fluent=false&language=zh_cn&object_token=' + id + '&translate_lang=default', timeout: 1000
    }, (err, result) => {
        // 这里对结果进行处理
        console.log('err:', err)
        console.log('result:', result)
    })


}

var initDownloadSRCPage = () => {
    console.log('初始化下载src页面')

    // 延时2s开始下载src
    setTimeout(_downloadSRC, 2000)
}


async function _getFromStorage(key) {
    return await new Promise((resolve, reject) => {
        chrome.storage.sync.get([key], function (result) {
            if (result[key] === undefined) {
                reject();
            } else {
                console.log('read result:', result)
                resolve(result);
            }
        });
    });
}


var init = () => {

    _getFromStorage('switchConfig').then(result => {
        if (result != null && result.switchConfig != null) {
            switchConfig = result.switchConfig;
        }

        if (!switchConfig.enable) {
            console.log('未开启, 退出初始化')
            return
        }

        var uri = window.location.pathname
        console.log('url:', uri)

        if (uri.match("/minutes/me") != null) {
            initMain()
        } else if (uri.match("/minutes/[A-Za-z0-9]+$") != null && window.location.hash == '#dld' && switchConfig.downloadSrc) {
            initDownloadSRCPage()
        }
    })
}


// 延时添加下载按钮
setTimeout(init, 2000)