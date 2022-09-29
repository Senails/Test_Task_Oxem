let monthprise = document.querySelector('#monthprise');
let allprise = document.querySelector('#allprise');
//
let input1 = document.querySelector('#input1');
let polzunok1 = document.querySelector('#polzunok1');
//
let input2 = document.querySelector('#input2');
let polzunok2 = document.querySelector('#polzunok2');
let percent2 = document.querySelector('#percent2');
//
let input3 = document.querySelector('#input3');
let polzunok3 = document.querySelector('#polzunok3');
//
let button = document.querySelector('#button');
//
let inputs = document.querySelectorAll('div.input')
let pols = document.querySelectorAll('div.polzunok')
let nodes = [...inputs, ...pols];

class Form {
    allSum;
    monthSumm;

    constructor(prise, vznos, len) {
        this.price = prise;
        this.vznos = vznos;
        this.len = len;
        this.disable = false;
        this.render = this.render.bind(this);
        this.formEnable();
        this.render();
        window.addEventListener('resize', () => {
            this.render();
        })
    }

    setprice(value) {
        this.price = value;
        this.render();
    }
    setvznos(value) {
        this.vznos = value;
        this.render();
    }
    setlen(value) {
        this.len = value;
        this.render();
    }

    render() {
        this.renderinput1();
        this.renderinput2();
        this.renderinput3();
        this.renderPrises();
    }

    renderinput1() {
        let str1 = '' + this.price;
        input1.value = str1[0] + ' ' + str1.substr(1, 3) + ' ' + str1.substr(4, 3);

        let allweight1 = polzunok1.parentElement.parentElement.parentElement.clientWidth;
        let lenline1 = Math.ceil((this.price - 1000000) / 5000000 * allweight1);
        let line1 = polzunok1.parentElement.parentElement;
        line1.style.width = lenline1 + 'px';
    }
    renderinput2() {
        let str2 = '' + Math.ceil((this.price / 100) * this.vznos);
        let res = getString(str2);
        input2.value = res + ' ₽';
        //percent
        percent2.innerHTML = this.vznos + '%';
        //line2
        let allweight2 = polzunok2.parentElement.parentElement.parentElement.clientWidth;
        let lenline2 = Math.ceil((this.vznos - 10) / 50 * allweight2);
        let line2 = polzunok2.parentElement.parentElement;
        line2.style.width = lenline2 + 'px';
    }
    renderinput3() {
        input3.value = this.len;
        //line
        let allweight3 = polzunok3.parentElement.parentElement.parentElement.clientWidth;
        let lenline3 = Math.ceil((this.len - 1) / 60 * allweight3);
        let line3 = polzunok3.parentElement.parentElement;
        line3.style.width = lenline3 + 'px';
    }

    renderPrises() {
        let initial = (this.vznos * this.price / 100);
        let monthpriseString = (this.price - initial) * ((0.035 * Math.pow((1 + 0.035), this.len)) / (Math.pow((1 + 0.035), this.len) - 1));

        let strMonth = getString(Math.ceil(monthpriseString) + '') + ' ₽';
        let strAll = getString(Math.ceil(this.vznos + monthpriseString * this.len) + '') + ' ₽';

        monthprise.innerHTML = strMonth;
        allprise.innerHTML = strAll;

        this.allSum = strAll;
        this.monthSumm = strMonth;
    }

    formEnable() {
        this.disable = false;
        input1.disabled = false;
        input2.disabled = false;
        input3.disabled = false;

        nodes.forEach((elem) => {
            elem.classList.remove('disabled');
        })
        button.classList.remove('disabled');

        input1.addEventListener('change', inputHandler1);
        input2.addEventListener('change', inputHandler2);
        input3.addEventListener('change', inputHandler3);
    }
    formDisenable() {
        this.disable = true;
        input1.disabled = true;
        input2.disabled = true;
        input3.disabled = true;

        nodes.forEach((elem) => {
            elem.classList.add('disabled');
        })
        button.classList.add('disabled');

        input1.removeEventListener('change', inputHandler1);
        input2.removeEventListener('change', inputHandler2);
        input3.removeEventListener('change', inputHandler3);
    }

    sendToBack() {
        // if (form.disable) {
        //     form.formEnable();
        // } else {
        //     form.formDisenable();
        // }

    }
};
let form = new Form(1000000, 10, 10);


//1
polzunok1.addEventListener('mousedown', rangeMouse(6000000, 1000000, 1, 10000));
polzunok1.addEventListener('touchstart', rangeTuchpad(6000000, 1000000, 1, 10000));
//2
polzunok2.addEventListener('mousedown', rangeMouse(60, 10, 2, 1));
polzunok2.addEventListener('touchstart', rangeTuchpad(60, 10, 2, 1));
//3
polzunok3.addEventListener('mousedown', rangeMouse(60, 1, 3, 1));
polzunok3.addEventListener('touchstart', rangeTuchpad(60, 1, 3, 1));
//button
button.addEventListener('click', sendRequest);
//utils
function rangeMouse(max, min, idinput, ceil) {

    function polz(event) {
        if (form.disable) return;

        document.addEventListener('mousemove', func1);
        document.addEventListener('mouseup', func2);

        let allweight = this.parentElement.parentElement.parentElement.clientWidth;
        let line = this.parentElement.parentElement;
        let weight = line.clientWidth;
        let xstart = event.clientX;

        function func1(e) {
            e.preventDefault();
            let xnow = e.clientX;
            let different = xnow - xstart;
            let newWeight = weight + different;
            if (newWeight <= 0) {
                newWeight = 0
            }
            if (newWeight >= allweight) {
                newWeight = allweight;
            }
            line.style.width = newWeight + 'px';
            let percentres = newWeight / allweight;
            actionresult(percentres, max, min, idinput, ceil)
        }

        function func2(e) {
            e.preventDefault();
            document.removeEventListener('mousemove', func1);
            document.removeEventListener('mouseup', func2);
        }
    }
    return polz;
}

function rangeTuchpad(max, min, idinput, ceil) {

    function polz(event) {
        if (form.disable) return;

        document.addEventListener('touchmove', func1);
        document.addEventListener('touchend', func2);

        let allweight = this.parentElement.parentElement.parentElement.clientWidth;
        let line = this.parentElement.parentElement;
        let weight = line.clientWidth;
        let xstart = event.touches[0].pageX;

        function func1(e) {
            let xnow = e.touches[0].pageX;

            let different = xnow - xstart;
            let newWeight = weight + different;
            if (newWeight <= 0) {
                newWeight = 0
            }
            if (newWeight >= allweight) {
                newWeight = allweight;
            }
            line.style.width = newWeight + 'px';
            let percentres = newWeight / allweight;
            actionresult(percentres, max, min, idinput, ceil)
        }

        function func2(e) {
            document.removeEventListener('touchmove', func1);
            document.removeEventListener('touchend', func2);
        }
    }
    return polz;
}

function actionresult(resultrange, max, min, idinput, ceil) {
    let difference = max - min;
    let res = Math.ceil((min + difference * resultrange) / ceil) * ceil;

    if (idinput === 1) {
        form.setprice(res);
    } else if (idinput === 2) {
        form.setvznos(res);
    } else {
        form.setlen(res)
    }
}

function getString(string) {
    let str = string;
    let arr = [];

    while (true) {
        if (str.length > 3) {
            let sub = str.substr((str.length - 3), 3);
            arr = [sub, ...arr];
            str = str.substr(0, (str.length - 3));
        } else {
            arr = [str, ...arr];
            break;
        }
    }

    let res = arr.join(' ');

    return res;
}

function inputHandler1() {
    let nums = this.value.match(/[0-9]/g);
    let str;

    if (nums != null) {
        str = +nums.join('');
    } else { str = '1000000' }
    let price = +str;

    if (price < 1000000) {
        price = 1000000;
    } else if ((price > 6000000)) {
        price = 6000000;
    }
    form.setprice(price)
}

function inputHandler2() {
    let nums = this.value.match(/[0-9]/g);
    let str;
    if (nums === null) {
        str = form.price * (0.1);
    } else {
        str = +nums.join('');
    }
    let res;
    if (str < form.price * (0.1)) {
        res = 10;
    } else if (str > form.price * (0.6)) {
        res = 60;
    } else {
        res = Math.ceil((str / form.price) * 100)
    }
    form.setvznos(res);
}

function inputHandler3() {
    let nums = this.value.match(/[0-9]/g);
    let str;
    if (nums === null) {
        str = 1;
    } else {
        str = +nums.join('');
    }

    let res;
    if (str <= 0) {
        res = 1;
    } else if (str > 60) {
        res = 60;
    } else {
        res = str;
    }

    form.setlen(res);
}

async function sendRequest() {
    let data = {
        price: this.price,
        initial: this.initial,
        months: this.len,
        allsum: this.allSum,
        monthsumm: this.monthSumm
    }

    let res = await fetch('https://eoj3r7f3r4ef6v4.m.pipedream.net', {
        method: 'post',
        headers: {
            'Content-Type': 'application/json;'
        },
        body: JSON.stringify(data)
    })
    let data1 = await res.json()
    console.log(data1)
}
///