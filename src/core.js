console.log('core 加载成功')

// 默认设置，开启视频下载，不开字幕下载
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


const core = {
    version: '1.0.0',

    switchConfig: {
        enable: true,
        downloadVideo: true,
        downloadSrc: false
    },

    init: function (callback) {
        console.log('core 初始化成功')
        console.log('this.switchConfig:', this.switchConfig)
        let _switchConfig = this.switchConfig

        // 异步
        _getFromStorage('switchConfig').then(result => {
            console.log('result:' + JSON.stringify(result))
            if (result == null) {
                return
            }

            if (result.switchConfig.enable != null) {
                _switchConfig.enable = result.switchConfig.enable
            }
            if (result.switchConfig.downloadVideo != null) {
                _switchConfig.downloadVideo = result.switchConfig.downloadVideo
            }
            if (result.switchConfig.downloadSrc != null) {
                _switchConfig.downloadSrc = result.switchConfig.downloadSrc
            }

            console.log('after this.switchConfig:', _switchConfig)

            if (callback) {
                callback()
            }
        })

    },
    saveConfig: config => {
        chrome.storage.sync.set({ 'switchConfig': config }, () => {
            console.log('保存成功')
        })
    }
}

export default core;