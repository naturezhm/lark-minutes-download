import core from './core.js'

let switchDownload = document.getElementById("btn-switchDownload");
let downloadMP4 = document.getElementById("btn-downloadMP4");
// let downloadSrc = document.getElementById("btn-downloadSRC");


core.init(() => {
    // alert(JSON.stringify(core.switchConfig))
    switchDownload.checked = core.switchConfig.enable;
    downloadMP4.checked = core.switchConfig.downloadVideo;
    // downloadSrc.checked = core.switchConfig.downloadSrc;
})



switchDownload.addEventListener("change", () => {
    // alert("选中状态: " + switchDownload.checked)
    core.switchConfig.enable = switchDownload.checked
    core.saveConfig(core.switchConfig)
});

downloadMP4.addEventListener("change", () => {
    // alert("选中状态: " + downloadMP4.checked)
    core.switchConfig.downloadVideo = downloadMP4.checked
    core.saveConfig(core.switchConfig)
});

