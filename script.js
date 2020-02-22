'use strict';

const startButton = document.querySelector('.start-button'),
    firstScreen = document.querySelector('.first-screen'),
    mainForm = document.querySelector('.main-form'),
    formCalculate = document.querySelector('.form-calculate'),
    endButton = document.querySelector('.end-button'),
    total = document.querySelector('.total'),
    fastRange = document.querySelector('.fast-range'),
    subTotal = document.querySelector('.subtotal'),
    totalPriceSum = document.querySelector('.total_price__sum'),
    inputs = document.querySelectorAll('.calc-handler'),
    typeSite = document.querySelector('.type-site'),
    maxDedline = document.querySelector('.max-deadline'),
    rangeDeadline = document.querySelector('.range-deadline'),
    deadLineValue = document.querySelector('.deadline-value'),
    checkboxLabel = document.querySelectorAll('.checkbox-label'),
    calcDescription = document.querySelector('.calc-description'),
    labelCheck = document.querySelectorAll('.css-check'),
    totalPrice = document.querySelector('.total_price'),
    cardHead = document.querySelector('.card-head'),
    firstFieldSet = document.querySelector('.first-fieldset');

const DATA = {
    DAY_STRING: ['день', 'дня', 'дней'],
    whichSite: ["landing", "multiPage", "onlineStore"],
    price: [4000, 8000, 26000],
    desktopTemplates: [50, 40, 30],
    adapt: 20,
    mobileTemplates: 15,
    editable: 10,
    metrikaYandex: [500, 1000, 2000],
    analyticsGoogle: [850, 1350, 3000],
    sendOrder: 500,
    deadlineDay: [
        [2, 7],
        [3, 10],
        [7, 14]
    ],
    deadlinePercent: [20, 17, 15]
};

const declOfNum = (n, titles) => {
    return n + ' ' + titles[n % 10 === 1 && n % 100 !== 11 ?
    0 : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? 1 : 2];
};

const showElem = (elem) => {
    elem.style.display = 'block';
};

const hideElem = (elem) => {
    elem.style.display = 'none';
};

const dopOptionsString = () => {
//Подключим Яндекс Метрику, Гугл Аналитику и отправку заявок на почту.
    let str = '';
   
    if(labelCheck[0].checked || labelCheck[1].checked || labelCheck[2].checked){
        str += 'Подключим';
        if (labelCheck[0].checked) {
            str += ' Яндекс Метрику';
            if (labelCheck[1].checked && labelCheck[2].checked) {
                str += ', Гугл Аналитику и отправку заявок на почту.';
                return str;
            }
            if (labelCheck[1].checked || labelCheck[2].checked) {
                str += ' и';
            }
        }
        if(labelCheck[1].checked) {
            str += ' Гугл Аналитику';
            if (labelCheck[2].checked) {
                str += ' и';
            }
        }
        if (labelCheck[2].checked) {
            str += ' отправку заявок на почту';
        }
        str += '.';
    }
    return str;
};

const renderTextConten = (total, txtSite, maxDay, minDay) => {
    totalPriceSum.textContent = total;
    typeSite.textContent = txtSite;
    maxDedline.textContent = declOfNum(maxDay, DATA.DAY_STRING);
    rangeDeadline.min = minDay;
    rangeDeadline.max = maxDay;
    deadLineValue.textContent = declOfNum(rangeDeadline.value, DATA.DAY_STRING);

    checkboxLabel[0].textContent = inputs[3].checked ? 'Да' : 'Нет';
    checkboxLabel[1].textContent = inputs[4].checked ? 'Да' : 'Нет';
    checkboxLabel[2].textContent = inputs[5].checked ? 'Да' : 'Нет';
    checkboxLabel[3].textContent = inputs[6].checked ? 'Да' : 'Нет';

    calcDescription.textContent = `
    Сделаем ${txtSite} ${inputs[4].checked ? 
        ', адаптированный под мобильные устройства и планшеты' : ''}.
        ${inputs[6].checked ? `Установим панель админстратора, 
        чтобы вы могли самостоятельно менять содержание на сайте без разработчика.` : ''}
        ${dopOptionsString()}
    `;
};

const priceCulc = (elem = {}) => {
    let result = 0,
        index = 0,
        options = [],
        txtSite = '',
        maxDeadlineDay = DATA.deadlineDay[index][1],
        minDeadlineDay = DATA.deadlineDay[index][0],
        overPercent = 0;

    if (elem.name === 'whichSite') {
        for (const item of formCalculate.elements) {
            if (item.type === 'checkbox') {
                item.checked = false;
            }
        }
        hideElem(fastRange);
    }

    for (const item of formCalculate.elements) {
        if (item.name === 'whichSite' && item.checked) {
            index = DATA.whichSite.indexOf(item.value);
            txtSite = item.dataset.site;
            maxDeadlineDay = DATA.deadlineDay[index][1];
            minDeadlineDay = DATA.deadlineDay[index][0];
            
        } else if (item.classList.contains('calc-handler') && item.checked) {
            options.push(item.value);
        } else if (item.classList.contains('want-faster') && item.checked){
            const overDay = maxDeadlineDay - rangeDeadline.value;
            overPercent = overDay * (DATA.deadlinePercent[index] / 100);
        }
        if (item.value === 'adapt' && item.checked){
            inputs[5].removeAttribute("disabled");
        } else if (item.value === 'adapt' && !item.checked) {
            inputs[5].disabled = 'false';
            inputs[5].checked = false;
        }
        
    } 

    result += DATA.price[index];

    options.forEach((key) => {
        if (typeof(DATA[key]) === 'number') {
            if (key === 'sendOrder') {
                result += DATA[key];
            } else {
                result += DATA.price[index] * DATA[key] / 100;
            }
        } else {
            if (key === 'desktopTemplates') {
                result += DATA.price[index] * DATA[key][index] / 100;
            } else {
                result += DATA[key][index];
            }
        } 
    });

    result += Math.floor(result * overPercent);

    renderTextConten(result, txtSite, maxDeadlineDay, minDeadlineDay);
};

const handlerCallBackForm = (event) => {
    const target = event.target;

    if (target.classList.contains('want-faster')) {
        target.checked ? showElem(fastRange) : hideElem(fastRange);
        priceCulc(target);
    }
    if (target.classList.contains('calc-handler')) {
        priceCulc(target);
    }
};

const moveBackTotal = () => {
    if (document.documentElement.getBoundingClientRect().bottom > document.documentElement.clientHeight + 200) {
        totalPrice.classList.remove('totalPriceBottom');
        firstFieldSet.after(totalPrice);
        window.removeEventListener('scroll', moveBackTotal);
        window.addEventListener('scroll', moveTotal);
    }
};

const moveTotal = () => {
    if(document.documentElement.getBoundingClientRect().bottom < document.documentElement.clientHeight + 200){
        totalPrice.classList.add('totalPriceBottom');
        endButton.before(totalPrice);
        window.removeEventListener('scroll', moveTotal);
        window.addEventListener('scroll', moveBackTotal);
    }
};

const formSubmin = event => {
    event.preventDefault();
    console.log(event);

    const data = new FormData(event.target);

    fetch('server.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'multipart/form-data'
        },
        body: data,
    }).then(renderResponse).catch(error => console.log(error));
};

const renderResponse = response => {
    if (response.ok) {
        hideElem(total);
        cardHead.textContent = 'Заявка на разработку сайта была отправлена! Мы скоро с вами свяжемся';
    }
};

startButton.addEventListener('click', () => {
    showElem(mainForm);
    hideElem(firstScreen);
    window.addEventListener('scroll', moveTotal);
});

endButton.addEventListener('click', () => {
    for (let elem of formCalculate.elements) {
        if (elem.tagName === 'FIELDSET') {
            hideElem(elem);
        }
    }

    cardHead.textContent = 'Заявка на разработку сайта';

    hideElem(totalPrice);

    showElem(total);
});


formCalculate.addEventListener('change', handlerCallBackForm);

formCalculate.addEventListener('submit', formSubmin);

priceCulc();