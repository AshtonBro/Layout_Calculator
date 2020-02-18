'use strict';

const startButton = document.querySelector('.start-button'),
    firstScreen = document.querySelector('.first-screen'),
    mainForm = document.querySelector('.main-form'),
    formCalculate = document.querySelector('.form-calculate'),
    endButton = document.querySelector('.end-button'),
    total = document.querySelector('.total'),
    subTotal = document.querySelector('.subtotal');


const showElem = (elem) => {
    elem.style.display = 'block';
};

const hideElem = (elem) => {
    elem.style.display = 'none';
};

const handlerCallBackForm = () => {
    let target = event.target;
    console.log('target: ', target);
};

startButton.addEventListener('click', () => {
 showElem(mainForm);
 hideElem(firstScreen);
});

endButton.addEventListener('click', () => {
    for(let elem of formCalculate.elements){
        if (elem.tagName === 'FIELDSET'){
            hideElem(elem);
        }
    }

    showElem(total);
});


formCalculate.addEventListener('change', handlerCallBackForm);
