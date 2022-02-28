/* ***************************************** */
/* ********** DIFFERENT THEMES ************* */
/* ***************************************** */
const themes = document.querySelectorAll(".theme-number");
const themeSelector = document.querySelector(".theme-selector");
const styleTheme = document.querySelector('#style-theme');

if(!localStorage.getItem("themeId")){
  localStorage.setItem("themeId", 0);
}
let themeId = localStorage.getItem("themeId");
const themeCount = themes.length;

themes.forEach(theme => {
  theme.addEventListener("click", e => {
    const setThemeId = e.target.dataset.id;

    themes.forEach(e => {e.classList.remove("theme-selected")});
    if (setThemeId) {
      e.currentTarget.classList.add("theme-selected");
    }
    
    applyThemes(setThemeId);
  })
})

const applyThemes = theme => {
  localStorage.setItem("themeId", theme);
  styleTheme.href = `css/style-theme-${theme}.css`;
  themeSelector.style.transform = `translate(${theme * 2.5}em)`;
}

/* ****************************************** */
/* ****** CALCULATOR FUNCTIONALITY ********** */
/* ****************************************** */
const display = document.querySelector(".display-number");
const displayCalc = document.querySelector(".display-calc");
const keys = document.querySelectorAll(".key");

let isSignApplied = false;
let signUsedPrev = '';
let signUsedCurrent = '';
let isTotalShown = false;
let includesDecimal = false;
let isOverflowed = false;
let numberCurrent = 0;
let numberTotal = 0;
localStorage.setItem("calcTotal", 0);

const getTotal = () => {
  return localStorage.getItem("calcTotal");
}

/* ****** 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, . ********** */
const AppendNumber = num => {
  if(display.textContent.length <= 16 && displayCalc.textContent.length <= 50) {
    if(displayCalc.textContent == "0.") {
      displayCalc.textContent = "0." + num; /*zero with decimal clicked*/
    } else if(displayCalc.textContent == 0) {
      displayCalc.textContent = num; /*zero on screen*/
    } else {
      displayCalc.textContent += num;
    }
    numberCurrent += num;
  }

  isSignApplied = false;
}

/* ****** DECIMALS ********** */
const AppendDecimal = () => {
  if(includesDecimal && numberCurrent != 0) {
    return; /*Don't allow more than 1 decimal in a number*/
  }
  
  if(!includesDecimal && numberCurrent == 0) {
    displayCalc.textContent = "0";
    numberCurrent = "0";
  }
  
  if(!includesDecimal && numberCurrent !== 0) {
    displayCalc.textContent += ".";
    numberCurrent += ".";
  }
  
  includesDecimal = true;
}

/* ****** DELETE ********** */
const ApplyDelete = calcText => {
  if(calcText.length > 1 || calcText != 0) {
    displayCalc.textContent = calcText.slice(0, -1);
    if(isTotalShown) {
      numberCurrent = displayCalc.textContent;
      numberTotal = numberCurrent;
      localStorage.setItem("calcTotal", numberCurrent);
    } else {
      numberCurrent = numberCurrent.slice(0, -1);
    }
  }
  if(calcText.length <= 1) {
    displayCalc.textContent = 0;
    ApplyReset();
  }
}


/* ****** ADD/MINUS/MULTIPLY/DIVIDE ********** */
const ApplySign = sign => {
  numberTotal = getTotal();
  
  /* No sign applied, first time pressed */
  if(!isSignApplied && signUsedCurrent === '') { signFirst(sign); } 

  /* Equals just been clicked */
  if(isTotalShown && displayCalc.textContent === '') { signEquals(sign); } 

  /* Sign applied before, not first time */
  if(!isSignApplied && signUsedCurrent !== '') { signReuse(sign); } 

  /* duplicate click or changed sign */
  if(!isTotalShown && isSignApplied && signUsedCurrent !== '') { signDuplicated(sign); }
}

const signFirst = sign => {
  signUsedCurrent = sign;
  display.textContent = parseFloat(numberCurrent).toLocaleString();
  displayCalc.textContent = display.textContent + sign;
  localStorage.setItem("calcTotal", parseFloat(numberCurrent));
  signUsedPrev = signUsedCurrent;
  signReset();
}

const signEquals = sign => {
  displayCalc.textContent = display.textContent + sign;
  signUsedCurrent = sign;
  signUsedPrev = signUsedCurrent;
  signReset();
}

const signReset = () => {
  isSignApplied = true;
  isTotalShown = false;
  numberCurrent = 0;
  includesDecimal = false;
}

const signReuse = sign => {
  signUsedCurrent = sign;
  displayCalc.textContent += sign;

  if(!isTotalShown) {
    if(signUsedPrev === '+'){numberTotal = parseFloat(numberTotal) + parseFloat(numberCurrent)};
    if(signUsedPrev === '-'){numberTotal = parseFloat(numberTotal) - parseFloat(numberCurrent)};
    if(signUsedPrev === '*'){numberTotal = parseFloat(numberTotal) * parseFloat(numberCurrent)};
    if(signUsedPrev === '/'){numberTotal = parseFloat(numberTotal) / parseFloat(numberCurrent)};
  }

  localStorage.setItem("calcTotal", parseFloat(numberTotal));
  display.textContent = parseFloat(numberTotal).toLocaleString();
  signUsedPrev = signUsedCurrent;
  signReset();
}

const signDuplicated = sign => {
  const displayCalcTrimmed = displayCalc.textContent.slice(0, -1);
  displayCalc.textContent = displayCalcTrimmed + sign;
  signUsedPrev = sign;
}


/* ****** EQUALS ********** */
const ApplyEquals = () => {
  numberTotal = getTotal();
  if(!isSignApplied) {
    if(signUsedPrev === '+'){numberTotal = parseFloat(numberTotal) + parseFloat(numberCurrent)};
    if(signUsedPrev === '-'){numberTotal = parseFloat(numberTotal) - parseFloat(numberCurrent)};
    if(signUsedPrev === '*'){numberTotal = parseFloat(numberTotal) * parseFloat(numberCurrent)};
    if(signUsedPrev === '/'){numberTotal = parseFloat(numberTotal) / parseFloat(numberCurrent)};
    
    display.textContent = numberTotal.toLocaleString();
    if(Math.abs(numberTotal) > 9999999999) {
      display.textContent = 'Overflow';
      displayCalc.textContent = 'Overflow';
      isOverflowed = true;
    }
    else {
      displayCalc.textContent = numberTotal;
    }
    isTotalShown = true;
    localStorage.setItem("calcTotal", parseFloat(numberTotal));
  }
}

const ApplyReset = () => {
  display.textContent = 0;
  displayCalc.textContent = 0;
  isSignApplied = false;
  isTotalShown = false;
  includesDecimal = false;
  isOverflowed = false;
  signUsedPrev = '';
  signUsedCurrent = '';
  numberCurrent = 0;
  numberTotal = 0;
  localStorage.setItem("calcTotal", 0);
}

/* ****************************************** */
/* ********* BUTTON LOGIC EVENTS ************ */
/* ****************************************** */
window.addEventListener("DOMContentLoaded", e => {
  applyThemes(themeId);
  keys.forEach(key => {
    key.addEventListener("click", e => {
      const btnContents = e.target.dataset.action;
      
      if(!isOverflowed) {
        if(!isNaN(btnContents)) { AppendNumber(btnContents); }
        if(btnContents == '.') { AppendDecimal(); }
        if(btnContents === '+' || btnContents === '-' || btnContents === '*' || btnContents === '/' ) {ApplySign(btnContents);}
        if(btnContents == '=') { ApplyEquals(); }
        if(btnContents == 'del') { ApplyDelete(displayCalc.textContent); }
      }
      if(btnContents == 'reset') { ApplyReset(); }
    })
  })
})

/* Repeat the logic for when a user interacts with a keyboard */
document.addEventListener("keypress", e => {
  const key = e.code;
  const keyType = key.slice(0, -1);
  const keyValue = key.slice(-1);

  if(!isOverflowed) {
    if(keyType === 'Digit' || keyType === 'Numpad') {
      if(!isNaN(keyValue)) { AppendNumber(keyValue); }
    }

    if(key === 'NumpadAdd' || key === 'Equal') { ApplySign('+'); }
    if(key === 'Minus' || key === 'NumpadSubtract') { ApplySign('-'); }
    if(key === 'NumpadMultiply' || key === 'KeyM') { ApplySign('*'); }
    if(key === 'NumpadDivide' || key === 'Slash') { ApplySign('/'); }

    if(key === 'Period' || key === 'NumpadDecimal') { AppendDecimal(); }
    if(key === 'Enter' || key === 'NumpadEnter') { ApplyEquals(); }
  }

  /* Reset the display to 0 using the 'R' key */
  if(key === 'KeyR') { ApplyReset(); }

  /* Cycle through the themes using the 'T' key */
  if(key === 'KeyT') {
    themeId = parseInt(localStorage.getItem("themeId"));
    if(localStorage.getItem("themeId") < themeCount-1) {
      localStorage.setItem("themeId", parseInt(themeId)+1);
      themes[localStorage.getItem("themeId")-1].classList.remove("theme-selected");
    } else {
      localStorage.setItem("themeId", 0);
      themes[themeCount-1].classList.remove("theme-selected");
    }
    themeId = parseInt(localStorage.getItem("themeId"));
    themes[themeId].classList.add("theme-selected");
    applyThemes(themeId);
  }
})