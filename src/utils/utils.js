// 时间戳转换为时间 fmt转换的时间格式 可自定义
const formatDate = (date, fmt) => {
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1,
      (date.getFullYear() + '').substr(4 - RegExp.$1.length));
  }
  let o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  };
  for (let k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      let str = o[k] + '';
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ?
        str : padLeftZero(str));
    }
  }
  return fmt;
}

const padLeftZero = (str) => {
  return ('00' + str).substr(str.length);
}
// 线上客服
const onlineNew = () => {
  var timer = setInterval(() => {
    if (document.getElementById("chat-application-iframe") && window.frames[0].document.childNodes.length > 0) {
      document.getElementById("chat-application-iframe").setAttribute("style", "display:none !important;");
      clearInterval(timer);
    }
  }, 1000)
}

export default {
  formatDate,
  onlineNew
}
