/*
 * @Author: Escher1108
 * @Website: https://jkgblog.com
 * @Date: 2020-10-09 19:22:16
 * @LastEditTime: 2020-10-09 19:22:19
 * @LastEditors: Do not edit
 * @FilePath: \BoxA\my.js
 * @Description: 小白学编程
 */
function Time() {
    let titleText = document.querySelector('#titleText')
    var date = new Date();
    year = date.getFullYear();
    month = date.getMonth() + 1;
    day = date.getDate();
    hours = date.getHours();
    minutes = date.getMinutes();
    seconds = date.getSeconds();
    if (minutes < 10) {
      minutes = "0" + minutes;
    }
    titleText.innerText = hours + ":" + minutes;
    currentTime = year + "年" + month + "月" + day + "日 " + hours + ":" + minutes;
  };
  setInterval("Time()", 1000);

  //总函数
  const TOTAL = () => {
    const WARN = document.querySelector('.warning')
    const WARNBOX = document.querySelector('.warning-box')
    const CONTAINER = document.querySelector('.container')
    WARN.classList.add("shower")
    CONTAINER.style.display = 'none'
    document.querySelector('#closedw').onclick = function () {
      document.querySelector('.warning').classList.remove("shower")
      document.querySelector('.container').style.display = 'block'
    }
  }
  //禁止右击
  document.oncontextmenu = function () {
    TOTAL()
    return false;
  }

  //禁止键盘事件
  document.onkeydown = function (e) {
    if (e.keyCode === 123 || e.ctrlKey && e.shiftKey) {
      TOTAL()
      return false
    }
  }

  const REDIRECT = () => {
    var checkStatus;
    var element = new Image();
    // var element = document.createElement('any');
    element.__defineGetter__('id', function () {
      checkStatus = 'on';
    });
    setInterval(function () {
      checkStatus = 'off';
      console.log(element);
      console.clear();
      if (checkStatus == 'on') {
        // alert('你在玩火，再见！')
        window.location.href = 'https://jkgblog.com'
        
      }
    }, 1000)
  }
  REDIRECT()

/*  if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
      alert("禁止访问！");
      window.location.href ="https://jkgblog.com";
    } else if (/(Android)/i.test(navigator.userAgent)) {
    // window.location.href ="https://jkgblog.com";
  } else {
    alert("禁止访问！");
    window.location.href ="https://jkgblog.com";
  };
  */