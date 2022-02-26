
  // /* FONTS */
  // --ff-primary: 'Spartan', 'Spartan', sans-serif;
    // console.log(themeStyles[0].background);


const themeStyles = [
  {
    theme: 0,
    background: ['hsl(222, 26%, 31%)', 'hsl(223, 31%, 20%)', 'hsl(224, 36%, 15%)' ],
    keysNum: {
      general: 'hsl(30, 25%, 89%)',
      shadow: 'hsl(28, 16%, 65%)',
      hover: 'hsl(30, 25%, 79%)',
    },
    keysReset: {
      general: 'hsl(225, 21%, 49%)',
      shadow: 'hsl(224, 28%, 35%)',
      hover: 'hsl(225, 21%, 29%)',
    },
    keysTotal: {
      general: 'hsl(6, 63%, 50%)',
      shadow: 'hsl(6, 70%, 34%)',
      hover: 'hsl(6, 63%, 30%)',
    },
    text: ['hsl(221, 14%, 31%)', 'hsl(0, 0%, 100%)', 'hsl(0, 0%, 100%)'],
    fontFamily: "'Spartan', 'Spartan', sans-serif",
  },
  {
    theme: 1,
    background: ['hsl(0, 0%, 90%)', 'hsl(0, 5%, 81%)', 'hsl(0, 0%, 93%)' ],
    keysNum: {
      general: 'hsl(45, 7%, 89%)',
      shadow: 'hsl(35, 11%, 61%)',
      hover: 'hsl(45, 7%, 79%)',
    },
    keysReset: {
      general: 'hsl(185, 42%, 37%)',
      shadow: 'hsl(185, 58%, 25%)',
      hover: 'hsl(185, 42%, 27%)',
    },
    keysTotal: {
      general: 'hsl(25, 98%, 40%)',
      shadow: 'hsl(25, 99%, 27%)',
      hover: 'hsl(25, 98%, 30%)',
    },
    text: ['hsl(60, 10%, 19%)', 'hsl(60, 10%, 19%)', 'hsl(0, 0%, 100%)'],
    fontFamily: "'Spartan', 'Spartan', sans-serif",
  },
  {
    theme: 2,
    background: ['hsl(268, 75%, 9%)', 'hsl(268, 85%, 12%)', 'hsl(268, 85%, 12%)' ],
    keysNum: {
      general: 'hsl(268, 47%, 21%)',
      shadow: 'hsl(290, 70%, 36%)',
      hover: 'hsl(268, 47%, 1%)',
    },
    keysReset: {
      general: 'hsl(281, 89%, 26%)',
      shadow: 'hsl(285, 91%, 52%)',
      hover: 'hsl(281, 89%, 6%)',
    },
    keysTotal: {
      general: 'hsl(176, 100%, 44%)',
      shadow: 'hsl(177, 92%, 70%)',
      hover: 'hsl(176, 100%, 24%)',
    },
    text: ['hsl(52, 100%, 62%)', 'hsl(52, 100%, 62%)', 'hsl(0, 0%, 100%)'],
    fontFamily: "'Digital Numbers Regular', 'Spartan', sans-serif",
  },
]

const root = document.querySelector(":root");
/* ***************************************** */
/* ********** DIFFERENT MODES ************** */
/* ***************************************** */
const themes = document.querySelectorAll(".theme-number");
const themeSelector = document.querySelector(".theme-selector");

let themeId = 0;

themes.forEach(theme => {
  theme.addEventListener("click", e => {
    const setThemeId = e.target.dataset.id

    themes.forEach(e => {e.classList.remove("theme-selected")});
    if (setThemeId) {
      e.currentTarget.classList.add("theme-selected");
    }
    
    applyThemes(setThemeId);
  })
})

const applyThemes = theme => {

  const themes = themeStyles[theme];
  
  root.style.setProperty('--clr-background-1', themes.background[0]);
  root.style.setProperty('--clr-background-2', themes.background[1]);
  root.style.setProperty('--clr-background-3', themes.background[2]);

  root.style.setProperty('--clr-key-num', themes.keysNum.general);
  root.style.setProperty('--clr-key-num-shadow', themes.keysNum.shadow);
  root.style.setProperty('--clr-key-num-hover', themes.keysNum.hover);

  root.style.setProperty('--clr-key-reset', themes.keysReset.general);
  root.style.setProperty('--clr-key-reset-shadow', themes.keysReset.shadow);
  root.style.setProperty('--clr-key-reset-hover', themes.keysReset.hover);

  root.style.setProperty('--clr-key-total', themes.keysTotal.general);
  root.style.setProperty('--clr-key-total-shadow', themes.keysTotal.shadow);
  root.style.setProperty('--clr-key-total-hover', themes.keysTotal.hover);
  
  root.style.setProperty('--clr-text-1', themes.text[0]);
  root.style.setProperty('--clr-text-2', themes.text[1]);
  root.style.setProperty('--clr-text-3', themes.text[2]);

  // console.log(themes)
  root.style.setProperty('--ff-primary', themes.fontFamily);

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
let numberCurrent = 0;
let numberTotal = 0;
localStorage.setItem("calcTotal", 0);

const getTotal = () => {
  return localStorage.getItem("calcTotal");
}

/* ****** 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, . ********** */
const AppendNumber = num => {
  if(display.textContent.length <= 10 && displayCalc.textContent.length <= 50) {
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
    numberCurrent = numberCurrent.slice(0, -1);
  }
  if(calcText.length == 0) {
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
    displayCalc.textContent = numberTotal;
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
  signUsedPrev = '';
  signUsedCurrent = '';
  numberCurrent = 0;
  numberTotal = 0;
  localStorage.setItem("calcTotal", 0);
}


window.addEventListener("DOMContentLoaded", e => {
  applyThemes(themeId);
  keys.forEach(key => {
    key.addEventListener("click", e => {
      const btnContents = e.target.dataset.action;
      
      if(!isNaN(btnContents)) { AppendNumber(btnContents); }
      if(btnContents == '.') { AppendDecimal(); }
      
      if(btnContents === '+' || btnContents === '-' || btnContents === '*' || btnContents === '/' ) {
        ApplySign(btnContents);
      }

      if(btnContents == '=') { ApplyEquals(); }
      if(btnContents == 'reset') { ApplyReset(); }
      if(btnContents == 'del') { ApplyDelete(displayCalc.textContent); }
    })
  })
})

