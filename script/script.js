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
    checkboxLabel = document.querySelectorAll('.checkbox-label');

const DATA = {
    DAY_STRING: ['день', 'дня', 'дней'],
    yesString: ['Да', 'Нет'],
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
};

const priceCulc = (elem) => {
    let result = 0,
        index = 0,
        options = [],
        txtSite = '',
        maxDeadlineDay = DATA.deadlineDay[index][1],
        minDeadlineDay = DATA.deadlineDay[index][0];

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
        }
        if (item.value === 'adapt' && item.checked){
            inputs[5].removeAttribute("disabled");
        } else if (item.value === 'adapt' && !item.checked) {
            inputs[5].disabled = 'false';
            inputs[5].checked = false;
        }
        
    } 

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

    result += DATA.price[index];

    renderTextConten(result, txtSite, maxDeadlineDay, minDeadlineDay);

};
const handlerCallBackForm = (event) => {
    const target = event.target;

    if (target.classList.contains('want-faster')) {
        target.checked ? showElem(fastRange) : hideElem(fastRange);
    }
    if (target.classList.contains('calc-handler')) {
        priceCulc(target);
    }
};

startButton.addEventListener('click', () => {
    showElem(mainForm);
    hideElem(firstScreen);
});

endButton.addEventListener('click', () => {
    for (let elem of formCalculate.elements) {
        if (elem.tagName === 'FIELDSET') {
            hideElem(elem);
        }
    }

    showElem(total);
});


formCalculate.addEventListener('change', handlerCallBackForm);