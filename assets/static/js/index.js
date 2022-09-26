(function () {
    function potentiallyBuggyCode() {
        ConsoleBan.init({
            redirect: 'https://www.fbi.gov/'
        })
    }
    setInterval(function () {
        potentiallyBuggyCode()
    }, 1000)

    document.oncontextmenu = function () {
        return false;
    }

    document.onkeydown = function (e) {
        if (e.shiftKey && e.ctrlKey && e.keyCode === 73) {
            return false
        } else if (e.shiftKey && e.ctrlKey && e.keyCode === 74) {
            return false
        } else if (e.ctrlKey && e.keyCode === 83) {
            return false
        }

        if (e.keyCode === 123) {
            return false
        }
    }

    // function isPc() {
    //     if (window.navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i)) {
    //         return false;
    //     } else {
    //         return true;
    //     }
    // }

    // if (!isPc()) {
    //     window.location.href = 'https://www.google.com'
    // }
})()