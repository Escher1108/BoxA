const app = new Vue({
    el: '#root',
    data: {
        val: '',
        errStatus: false,
        pld: 'Please enter password',
        api: '',
        url: '',
        time: null,
        serShow: false,
        listShow: false,
        setShow: false,
        disabled: false,
        digLog: false,
        editDig: false,
        current: -1,
        editIndex: -1,
        kindex: -1,
        dwar1: false,
        dwar2: false,
        isZindex: false,
        editText: null,
        optionObj: {
            set: false,
            bookmark: true,
        },
        bookObj: {
            title: '',
            siteLink: ''
        },
        imgArr: [],
        listArr: [
            {
                text: 'Youtube',
                url: "https://www.youtube.com"
            },
            {
                text: 'Github',
                url: "https://www.github.com"
            },
            {
                text: "Telegram",
                url: 'https://web.tel.onl'
            },
            {
                text: 'Twitch',
                url: 'https://twitch.tv'
            },
            {
                text: 'Netflix',
                url: 'https://www.netflix.com'
            },
            {
                text: 'Pixiv',
                url: 'https://www.pixiv.net/'
            },
            // {
            //     text: 'Pornhub',
            //     url: 'https://www.pornhub.com'
            // },
            // {
            //     text: 'MadouClub',
            //     url: 'https://madou.club'
            // },
            // {
            //     text: 'Xvideos',
            //     url: 'https://www.xvideos.com/'
            // }
        ],
        wdArr: [],
        bookArr: [{
            icon: 'https://store.heytapimage.com/cdo-portal/feedback/202209/01/5b2af43d6cdd374437444d1e9cc7c405.png',
            name: '添加书签',
            link: 'https://hideip.network'
        }],
        spArr: [],
        inputCode: '',
        checkCode: '',
        expressValue: '',
        cvs: {
            w: 100,
            h: 35,
            fontSize: 24,
            str: '+-*',
            line: 3
        },
        verify: ''
    },
    created() {
        this.api = Base64.decode('aHR0cHM6Ly9qZXNtb3JhLm5wa24ubmV0L2hpZGVpcC9wYXNzd2Q=');
        let key = this.getCookie('key');
        if (key) {
            this.pld = 'Search here or enter a URL';
            this.disabled = true;
        } else {
            this.pld = 'Please enter password';
            this.disabled = false;
            this.uninstalled();
        }
    },
    mounted() {
        this.url = this.getCookie('searchUrl');
        if (window.localStorage.getItem('alVal') !== this.getCookie('key')) {
            Swal.fire({
                title: 'Welcome!',
                html: `Join the <a style='text-decoration: none;' href="https://t.me/hideipnetwork">Telegram Group</a>`,
                imageUrl: 'https://store.heytapimage.com/cdo-portal/feedback/202207/02/b705611e231f230f2fec150f35221c0b.png',
                imageWidth: 200,
                imageHeight: 200,
                imageAlt: 'Custom image',
                background: '#fff',
                backdrop: `
    rgba(0,0,123,0.4)
    url("https://sweetalert2.github.io/images/nyan-cat.gif")
    left top
    no-repeat
  `
            })
        };

        this.getImgData();
        this.getSpimg();
        this.getCode();
        this.baiduWdApi()


        /***********************/
        if (this.getLocalStronge('set')) {
            this.optionObj = this.getLocalStronge('set')
        } else {
            this.setLocalStronge('set', this.optionObj);
        }

        /**********************/
        if (this.getLocalStronge('book')) {
            this.bookArr = this.getLocalStronge('book')
        } else {
            this.setLocalStronge('book', this.bookArr)
        }

        /*********************/
        const PAGE_CONF_SET = 110
        const PAGE_CONF_GET = 111
        const SW_CONF_RETURN = 112
        const SW_CONF_CHANGE = 113
        const PAGE_READY_CHECK = 200
        const SW_READY = 201
        const sw = navigator.serviceWorker
        sw.addEventListener('message', this.onSwMsg())
        this.sendMsgToSw(PAGE_READY_CHECK)



    },
    methods: {
        isUrl(val) {
            if (/^ http(s ?): \/\//.test(val) || val.toString().includes('.') && val.substr(0, 1) !== ' ') return true;
            return false;
        },
        uninstalled() {
            if (window.navigator && navigator.serviceWorker) {
                navigator.serviceWorker.getRegistrations()
                    .then(function (registrations) {
                        console.log(registrations)
                        for (let registration of registrations) {
                            registration.unregister();
                        }
                    });
            }
        },
        sendMsgToSw(cmd, val) {
            const ctl = sw.controller
            if (!ctl) {
                console.log('ctl is null')
                return
            }
            ctl.postMessage([cmd, val])
        },
        onSwMsg(e) {
            const [cmd, msg] = e.data
            switch (cmd) {
                case SW_CONF_RETURN:
                    conf = msg
                    // showConf()
                    break;

                case SW_CONF_CHANGE:
                    conf = msg
                    // updateSelected()
                    break;

                case SW_READY:
                    console.log('sw ready')
                    // showIcons()
                    sendMsgToSw(PAGE_CONF_GET)
                    break;
            }
        },
        handleHost() { },
        handleShow() {
            this.serShow = !this.serShow;
        },
        async handleCheck(event) {
            const _this = this;
            let key = this.getCookie('key');
            if (key) {
                const text = this.val.trim()
                if (text) {
                    const url = './-----' + text;
                    open(url, '_blank', 'noopener,noreferrer')
                }
            } else {
                this.handleRequest();
            }
        },
        handleRequest() {
            fetch(this.api, {
                method: 'POST',
                cache: 'no-cache',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ passwd: this.val })
            }).then(res => res.json()).then(data => {
                if (data.status == 200) {
                    const pw = Base64.decode(data.data.password);
                    const url = Base64.decode(data.data.url)
                    this.time = data.data.time
                    this.setCookie("key", pw, this.time);
                    this.setCookie("searchUrl", url, this.time);
                    window.localStorage.setItem('alVal', pw)
                    Swal.fire({
                        icon: 'success',
                        title: 'Congratulations!',
                        text: 'You have successfully unlocked,enjoy it!',
                    }).then(res => {
                        if (res.isConfirmed || res.isDismissed) {
                            window.location.reload();
                        }
                    })

                }

                if (data.status == 5101) {
                    this.val = '';
                    this.pld = data.data.msg;
                    this.errStatus = true;
                    setTimeout(() => {
                        this.pld = 'Please enter password'
                        this.errStatus = false
                    }, 2000)
                }
            })
        },
        handleChoose(item, index) {
            const that = this;
            this.val = item.url;
            const arr = ['Pornhub', 'MadouClub', 'Xvideos'];
            if (arr.includes(item.text)) {
                Swal.fire(
                    'About age?',
                    'Are you an adult or 18+ ?',
                    'question'
                ).then(res => {
                    if (res.isConfirmed) {
                        that.handleCheck();
                    } else {
                        that.val = '';
                    }
                })
            } else {
                that.handleCheck();
            }
            setTimeout(() => {
                this.val = ''
            }, 1500)
        },
        checkBlur() {
            if (this.val == '' || this.val == null) {
                setTimeout(() => {
                    this.listShow = false;
                    this.isZindex = false;
                    this.wdArr = this.listArr;
                }, 3000)
            }
        },
        checkFocus() {
            this.listShow = true;
            this.isZindex = true;
        },
        handleInput() {
            this.kindex = -1;
            this.baiduWdApi()
        },
        handleDown() {
            const kArr = this.wdArr;
            if (this.kindex == kArr.length - 1) {
                return this.kindex = kArr.length - 1;
            } else {
                this.kindex++;
                this.val = new Object(kArr[this.kindex]).text;
            }

        },
        handleUp() {
            const kArr = Array.from(new Set(this.wdArr.concat(this.listArr)));
            if (this.kindex < 0) {
                return
            } else {
                this.kindex--;
                this.val = new Object(kArr[this.kindex]).text;
            }
        },
        baiduWdApi() {
            const sugurl = `https://suggestion.baidu.com/su?wd='${this.val}'&p=3&cb=window.baidu.sug`;
            const _this = this;
            window.baidu = {
                sug: function (json) {
                    let arr = json.s;
                    let t = arr.map(e => {
                        return {
                            text: e,
                            url: e
                        }
                    });
                    if (_this.val == '') return _this.wdArr = _this.listArr;
                    if (t.length === 0) {
                        _this.listShow = false;
                    } else {
                        _this.listShow = true;
                        _this.wdArr = t;
                    }

                }
            }
            //动态添加JS脚本
            var script = document.createElement("script");
            script.src = sugurl;
            document.getElementsByTagName("head")[0].appendChild(script);
        },
        addBook(index, item) {
            const arrL = this.bookArr.length - 1;
            let key = this.getCookie('key');
            if (index == arrL && key) {
                this.digLog = true;
            } else {
                this.val = item.link
                this.handleCheck()
            }
        },
        editShow(index) {
            this.editIndex = index;
            this.current = index;
            const arrL = this.bookArr.length - 1;
            if (this.current == arrL) {
                return;
            }
        },
        leave() {
            this.current = -1;
        },
        getFavicon(url) {
            return `https://api.faviconkit.com/${url.replace(/^https?\:\/\//i, "")}`;
        },
        handleAdd() {
            if (this.bookObj.title == '') {
                this.dwar1 = true;
            }
            if (this.bookObj.siteLink == '') {
                this.dwar2 = true;
                return;
            }
            if (!/^(https?:\/\/(([a-zA-Z0-9]+-?)+[a-zA-Z0-9]+\.)+[a-zA-Z]+)(:\d+)?(\/.*)?(\?.*)?(#.*)?$/.test(this.bookObj.siteLink)) {
                this.dwar2 = true;
                return;
            };

            const book = {
                icon: this.getFavicon(this.bookObj.siteLink),
                name: this.bookObj.title,
                link: this.bookObj.siteLink
            }
            if (this.editText == 'edit') {
                this.bookArr.forEach((e, i) => {
                    if (i == this.editIndex) {
                        this.bookArr[i].name = this.bookObj.title;
                        this.bookArr[i].link = this.bookObj.siteLink;
                    }
                })
                this.setLocalStronge('book', this.bookArr);
                this.editText = null;
            } else {
                this.bookArr.unshift(book);
                this.setLocalStronge('book', this.bookArr);
            }
            this.digLog = false;
            this.bookObj = {
                title: '',
                siteLink: ''
            }
        },
        mobifBook(item) {
            this.digLog = true;
            this.editText = 'edit';
            this.bookObj = {
                title: item.name,
                siteLink: item.link
            }
        },
        cancelBook() {
            this.digLog = false;
            this.dwar1 = false;
            this.dwar2 = false;
            this.bookObj = {
                title: '',
                siteLink: ''
            }
        },
        moveBook(val, index) {
            this.bookArr = this.getLocalStronge('book');
            this.bookArr.map((e, i) => {
                if (e.name === val.name) {
                    this.bookArr.splice(i, 1)
                    this.setLocalStronge('book', this.bookArr)
                }
            })
        },
        handleSet() {
            this.setShow = !this.setShow;
        },
        getImgData() {
            fetch(this.api, {
                method: 'POST',
                cache: 'no-cache',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ reqImg: true })
            }).then(res => res.json()).then(data => {
                if (data.status == 200) {
                    const { data: r } = data;
                    this.imgArr = r;
                }
            })
        },
        getSpimg() {
            fetch(this.api, {
                method: 'POST',
                cache: 'no-cache',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ reqSpImg: true })
            }).then(res => res.json()).then(data => {
                if (data.status == 200) {
                    const { data: r } = data
                    this.spArr = r;
                }
            })
        },
        clearText() {
            setTimeout(() => {
                this.verify = '';
                this.inputCode = '';
                this.getCode()
            }, 2500)
        },
        checkMe() {
            // 空、 错误、 正确 三个判断
            const patrn = /^[0-9]*$/;
            if (!patrn.test(this.inputCode)) {
                this.verify = 'Only Number';
                this.clearText();
                return;
            }
            if (this.inputCode) {
                if (eval(this.inputCode) === eval(this.expressValue)) {
                    this.verify = '😀the password is hideip';
                    this.val = 'hideip';
                    this.clearText();
                } else {
                    this.verify = '😢Verification code error';
                    this.clearText();
                }
            } else {
                this.verify = '🤬Null';
                this.clearText();
            }
        },
        rInt(max) {
            return Math.floor(Math.random() * 100000 % max);
        },
        rCode() {
            let a = this.rInt(100);
            let b = this.rInt(10);
            let op = this.cvs.str.charAt(this.rInt(this.cvs.str.length));
            // 表达式
            let code = `${a}${op}${b}=`;
            this.checkCode = code;
            // 表达式的值
            this.expressValue = eval(code.substr(0, code.length - 1));
            return code;
        },
        // 生成随机颜色 rgba格式
        rColor() {
            let a = ((Math.random() * 5 + 5) / 10).toFixed(2);
            return `rgba(${this.rInt(256)}, ${this.rInt(256)}, ${this.rInt(256)}, ${a})`
        },
        // 验证码图片绘制
        drawCode(domCvs) {
            let _this = this;
            // 随机表达式
            let checkCode = this.rCode();
            // 宽设置
            this.cvs.w = 10 + this.cvs.fontSize * this.checkCode.length;

            // 判断是否支持canvas
            if (domCvs !== null && domCvs.getContext && domCvs.getContext('2d')) {
                // 设置显示区域大小
                domCvs.style.width = _this.cvs.w;
                // 设置画板宽高
                domCvs.setAttribute('width', _this.cvs.w);
                domCvs.setAttribute('height', _this.cvs.h);
                // 画笔
                let pen = domCvs.getContext('2d');
                // 背景: 颜色  区域
                pen.fillStyle = '#eee';
                pen.fillRect(0, 0, _this.cvs.w, _this.cvs.h);
                // 水平线位置
                pen.textBaseline = 'middle';   // top middle bottom
                // 内容
                for (let i = 0; i < _this.checkCode.length; i++) {
                    pen.fillStyle = _this.rColor(); // 随机颜色
                    pen.font = `bold ${_this.cvs.fontSize}px 微软雅黑`; // 字体设置
                    // 字符绘制: (字符, X坐标, Y坐标)
                    pen.fillText(checkCode.charAt(i), 10 + _this.cvs.fontSize * i, 17 + _this.rInt(10));
                }
                // 噪音线
                for (let i = 0; i < _this.cvs.line; i++) {
                    // 起点
                    pen.moveTo(_this.rInt(_this.cvs.w) / 2, _this.rInt(_this.cvs.h));
                    // 终点
                    pen.lineTo(_this.rInt(_this.cvs.w), _this.rInt(_this.cvs.h));
                    // 颜色
                    pen.strokeStyle = _this.rColor();
                    // 粗细
                    pen.lineWidth = '2';
                    // 绘制
                    pen.stroke();
                }

            } else {
                this.$message.error('不支持验证码格式，请升级或更换浏览器重试');
            }
        },
        getCode() {
            let domCvs = this.$refs.checkCode;
            this.drawCode(domCvs);
        },
        setWindow() {
            this.optionObj.set = !this.optionObj.set;
            this.setLocalStronge('set', this.optionObj);
        },
        setBook() {
            this.optionObj.bookmark = !this.optionObj.bookmark
            this.setLocalStronge('set', this.optionObj);
        },
        setLocalStronge(key, val) {
            window.localStorage.setItem(key, JSON.stringify(val))
        },
        getLocalStronge(key) {
            return JSON.parse(window.localStorage.getItem(key))
        },
        getCookie(cname) {
            const name = cname + "=";
            const ca = document.cookie.split(';');
            for (let i = 0; i < ca.length; i++) {
                const c = ca[i].trim();
                if (c.indexOf(name) == 0) { return c.substring(name.length, c.length); }
            }
            return "";
        },
        setCookie(name, value, exdays) {
            const d = new Date();
            d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
            const expires = "expires=" + d.toGMTString();
            document.cookie = name + "=" + value + "; " + expires;
        }
    }
})