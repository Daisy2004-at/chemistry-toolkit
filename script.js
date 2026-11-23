
// ======================================
// CHEMTOOLKIT - MAIN JAVASCRIPT
// ======================================

// 1. PAGE NAVIGATION

const navButtons = document.querySelectorAll(".nav-item");
const pages = document.querySelectorAll(".page");
const toolCards = document.querySelectorAll(".tool-card");

const pageTitle = document.getElementById("pageTitle");
const welcomeSection = document.querySelector(".welcome-section");

function openPage(pageId) {

    pages.forEach(page => {
        page.classList.remove("active");
    });

    navButtons.forEach(button => {
        button.classList.remove("active");
    });

    const selectedPage = document.getElementById(pageId);

    if (!selectedPage) return;

    selectedPage.classList.add("active");

    const selectedButton = document.querySelector(
        `.nav-item[data-page="${pageId}"]`
    );

    if (selectedButton) {
        selectedButton.classList.add("active");
    }

    pageTitle.textContent =
        pageId === "dashboard"
            ? "Dashboard"
            : selectedButton
                ? selectedButton.textContent.trim()
                : selectedPage.querySelector("h2").textContent;

    welcomeSection.style.display =
        pageId === "dashboard" ? "block" : "none";
}

// Sidebar navigation

navButtons.forEach(button => {

    button.addEventListener("click", () => {

        const pageId = button.dataset.page;

        openPage(pageId);

    });

});

// Dashboard tool cards

toolCards.forEach(card => {

    card.addEventListener("click", () => {

        const pageId = card.dataset.open;

        if (!pageId) return;

        openPage(pageId);

    });

});

// 2. DARK AND LIGHT THEMES

const themeToggle = document.getElementById("themeToggle");

const savedTheme = localStorage.getItem("chemToolkitTheme");

if (savedTheme === "light") {

    document.body.classList.add("light-theme");

}

function updateThemeButton() {

    themeToggle.textContent =
        document.body.classList.contains("light-theme")
            ? "☀️ Switch to Dark"
            : "🌙 Switch to Light";

}

updateThemeButton();

themeToggle.addEventListener("click", () => {

    document.body.classList.toggle("light-theme");

    const currentTheme =
        document.body.classList.contains("light-theme")
            ? "light"
            : "dark";

    localStorage.setItem("chemToolkitTheme", currentTheme);

    updateThemeButton();

});

// 3. CALCULATION COUNTER

let calculationCount = Number(
    localStorage.getItem("chemCalculations")
) || 0;

const calculationDisplay =
    document.getElementById("calculationCount");

function updateCalculationCounter() {

    calculationDisplay.textContent = calculationCount;

}

function recordCalculation() {

    calculationCount++;

    localStorage.setItem(
        "chemCalculations",
        calculationCount
    );

    updateCalculationCounter();

}

updateCalculationCounter();

// 4. INITIALIZE DASHBOARD

openPage("dashboard");


// ========================================
// CHEMTOOLKIT - CHEMISTRY CALCULATIONS
// ========================================

// FORMAT SCIENTIFIC RESULTS

function formatResult(value) {
    return Number(value.toPrecision(5)).toString();
}


// 1. MOLARITY CALCULATOR
// M = (mass / molar mass) / volume

function calculateMolarity() {

    const mass = Number(document.getElementById("soluteMass").value);
    const molarMass = Number(document.getElementById("molarMass").value);
    const volume = Number(document.getElementById("solutionVolume").value);

    const result = document.getElementById("molarityResult");

    if (
        !Number.isFinite(mass) ||
        !Number.isFinite(molarMass) ||
        !Number.isFinite(volume) ||
        mass <= 0 || molarMass <= 0 || volume <= 0
    ) {
        result.textContent = "Please enter valid positive values in all fields.";
        return;
    }

    const moles = mass / molarMass;
    const molarity = moles / volume;

    result.textContent =
        `Molarity = ${formatResult(molarity)} mol/L`;

    recordCalculation();
}


// 2. NUMBER OF MOLES
// n = mass / molar mass

function calculateMoles() {

    const mass = Number(document.getElementById("molesMass").value);

    const molarMass = Number(document.getElementById("molesMolarMass").value);

    const result = document.getElementById("molesResult");

    if (
        !Number.isFinite(mass) ||
        !Number.isFinite(molarMass) ||
        mass <= 0 || molarMass <= 0
    ) {
        result.textContent = "Please enter valid positive values.";
        return;
    }

    const moles = mass / molarMass;

    result.textContent =
        `Number of moles = ${formatResult(moles)} mol`;

    recordCalculation();
}


// 3. MASS REQUIRED
// Mass = Molarity × Volume × Molar Mass

function calculateRequiredMass() {

    const molarity = Number(document.getElementById("desiredMolarity").value);

    const volume = Number(document.getElementById("desiredVolume").value);

    const molarMass = Number(document.getElementById("desiredMolarMass").value);

    const result = document.getElementById("massResult");

    if (
        !Number.isFinite(molarity) ||
        !Number.isFinite(volume) ||
        !Number.isFinite(molarMass) ||
        molarity <= 0 || volume <= 0 || molarMass <= 0
    ) {
        result.textContent = "Please enter valid positive values.";
        return;
    }

    const mass = molarity * volume * molarMass;

    result.textContent =
        `Mass required = ${formatResult(mass)} g`;

    recordCalculation();
}


// 4. DILUTION CALCULATOR
// M1V1 = M2V2
// V2 = M1V1 / M2

function calculateDilution() {

    const M1 = Number(document.getElementById("initialM").value);

    const V1 = Number(document.getElementById("initialV").value);

    const M2 = Number(document.getElementById("finalM").value);

    const result = document.getElementById("dilutionResult");

    if (
        !Number.isFinite(M1) ||
        !Number.isFinite(V1) ||
        !Number.isFinite(M2) ||
        M1 <= 0 || V1 <= 0 || M2 <= 0
    ) {
        result.textContent = "Please enter valid positive values.";
        return;
    }

    const V2 = (M1 * V1) / M2;

    result.textContent =
        `Final volume (V2) = ${formatResult(V2)} L`;

    recordCalculation();
}

console.log("ChemToolkit Chemistry Calculators Loaded Successfully!");
// ==========================================
// CHEMTOOLKIT - MOLECULAR MASS ENGINE
// ==========================================

// 1. PERIODIC TABLE ATOMIC MASSES

const atomicMasses = {

    H: 1.008,
    He: 4.0026,
    Li: 6.94,
    Be: 9.0122,
    B: 10.81,
    C: 12.011,
    N: 14.007,
    O: 15.999,
    F: 18.998,
    Ne: 20.180,

    Na: 22.990,
    Mg: 24.305,
    Al: 26.982,
    Si: 28.085,
    P: 30.974,
    S: 32.06,
    Cl: 35.45,
    Ar: 39.948,

    K: 39.098,
    Ca: 40.078,
    Sc: 44.956,
    Ti: 47.867,
    V: 50.942,
    Cr: 51.996,
    Mn: 54.938,
    Fe: 55.845,
    Co: 58.933,
    Ni: 58.693,
    Cu: 63.546,
    Zn: 65.38,

    Ga: 69.723,
    Ge: 72.630,
    As: 74.922,
    Se: 78.971,
    Br: 79.904,
    Kr: 83.798,

    Ag: 107.868,
    Cd: 112.414,
    Sn: 118.710,
    I: 126.904,
    Ba: 137.327,

    Pt: 195.084,
    Au: 196.967,
    Hg: 200.592,
    Pb: 207.2
};


// 2. FORMULA PARSER

function parseChemicalFormula(formula) {

    const tokens = formula.match(/[A-Z][a-z]?|\d+|[()]/g);

    if (!tokens || tokens.join("") !== formula) {
        throw new Error("Invalid chemical formula.");
    }

    let position = 0;

    function parseGroup() {

        const elements = {};

        while (position < tokens.length) {

            const token = tokens[position];

            // Handle closing bracket

            if (token === ")") {
                position++;
                return elements;
            }

            // Handle opening bracket

            if (token === "(") {

                position++;

                const nestedGroup = parseGroup();

                if (position >= tokens.length) {
                    throw new Error("Missing closing bracket.");
                }

                const multiplierToken = tokens[position];

                let multiplier = 1;

                if (/^\d+$/.test(multiplierToken)) {

                    multiplier = Number(multiplierToken);

                    if (multiplier < 1 || multiplier > 10000) {
                        throw new Error("Invalid group multiplier.");
                    }

                    position++;

                }

                for (const element in nestedGroup) {

                    elements[element] =
                        (elements[element] || 0) +
                        nestedGroup[element] * multiplier;

                }

                continue;

            }

            // Handle chemical elements

            if (/^[A-Z][a-z]?$/.test(token)) {

                if (!(token in atomicMasses)) {
                    throw new Error(`Unknown element: ${token}`);
                }

                const element = token;

                position++;

                let count = 1;

                if (
                    position < tokens.length &&
                    /^\d+$/.test(tokens[position])
                ) {

                    count = Number(tokens[position]);

                    if (count < 1 || count > 10000) {
                        throw new Error("Invalid element subscript.");
                    }

                    position++;

                }

                elements[element] =
                    (elements[element] || 0) + count;

                continue;

            }

            throw new Error("Invalid formula structure.");

        }

        return elements;

    }

    const composition = parseGroup();

    if (position !== tokens.length) {
        throw new Error("Invalid bracket arrangement.");
    }

    return composition;

}


// 3. MOLECULAR MASS CALCULATOR

function calculateMolecularMass() {

    const formula =
        document.getElementById("chemicalFormula").value.trim();

    const result =
        document.getElementById("molecularResult");

    const breakdown =
        document.getElementById("molecularBreakdown");

    if (!formula) {

        result.textContent = "Please enter a chemical formula.";

        return;

    }

    try {

        const composition = parseChemicalFormula(formula);

        let totalMass = 0;

        let breakdownHTML = "";

        for (const element in composition) {

            const count = composition[element];

            const atomicMass = atomicMasses[element];

            const contribution = count * atomicMass;

            totalMass += contribution;

            breakdownHTML += `

                <div class="molecular-breakdown-row">

                    <span>
                        ${element} (${count})
                    </span>

                    <span>
                        ${atomicMass} × ${count}
                        = ${contribution.toFixed(4)}
                    </span>

                </div>

            `;

        }

        result.textContent =
            `Molecular mass = ${totalMass.toFixed(4)} g/mol`;

        breakdownHTML += `

            <div class="molecular-total">

                Total molecular mass:
                ${totalMass.toFixed(4)} g/mol

            </div>

        `;

        breakdown.innerHTML = breakdownHTML;

        recordCalculation();

    }

    catch (error) {

        result.textContent = error.message;

        breakdown.textContent =
            "Please check your chemical formula.";

    }

}


// 4. EXAMPLE FORMULA LOADER

function loadFormula(formula) {

    document.getElementById("chemicalFormula").value = formula;

    calculateMolecularMass();

}


console.log("Molecular Mass Engine Successfully Loaded!");
// ADVANCED TITRATION CALCULATOR

function calculateTitration() {

    const Va = Number(document.getElementById("analyteVolume").value);
    const Ca = Number(document.getElementById("analyteConcentration").value);

    const Vt = Number(document.getElementById("titrantVolume").value);
    const Ct = Number(document.getElementById("titrantConcentration").value);

    const a = Number(document.getElementById("analyteCoefficient").value);
    const t = Number(document.getElementById("titrantCoefficient").value);

    const mode = document.getElementById("titrationMode").value;

    const result = document.getElementById("titrationResult");
    const working = document.getElementById("titrationWorking");

    result.innerHTML = "";
    working.innerHTML = "";

    // VALIDATION

    if (Va <= 0 || Vt <= 0 || a <= 0 || t <= 0 ||
        !Number.isFinite(Va) || !Number.isFinite(Vt) ||
        !Number.isInteger(a) || !Number.isInteger(t)) {

        result.innerHTML = "Please enter positive volumes and valid positive whole-number reaction coefficients.";
        return;
    }

    let unknownConcentration;

    // ANALYTE CONCENTRATION

    if (mode === "analyte") {

        if (!Number.isFinite(Ct) || Ct <= 0) {
            result.innerHTML = "Enter a valid positive titrant concentration.";
            return;
        }

        unknownConcentration = (a * Ct * Vt) / (t * Va);

        working.innerHTML = `
            <h3>Step-by-Step Working</h3>

            <div class="working-step">
                <strong>Step 1: Write the stoichiometric equation</strong><br>
                Ca × Va / a = Ct × Vt / t
            </div>

            <div class="working-step">
                <strong>Step 2: Rearrange for analyte concentration</strong><br>
                Ca = (a × Ct × Vt) / (t × Va)
            </div>

            <div class="working-step">
                <strong>Step 3: Substitute the values</strong><br>
                Ca = (${a} × ${Ct} × ${Vt}) / (${t} × ${Va})
            </div>

            <div class="working-step">
                <strong>Step 4: Calculate</strong><br>
                Ca = ${unknownConcentration.toFixed(5)} mol/L
            </div>
        `;
    }

    // TITRANT CONCENTRATION

    else {

        if (!Number.isFinite(Ca) || Ca <= 0) {
            result.innerHTML = "Enter a valid positive analyte concentration.";
            return;
        }

        unknownConcentration = (t * Ca * Va) / (a * Vt);

        working.innerHTML = `
            <h3>Step-by-Step Working</h3>

            <div class="working-step">
                <strong>Step 1: Write the stoichiometric equation</strong><br>
                Ca × Va / a = Ct × Vt / t
            </div>

            <div class="working-step">
                <strong>Step 2: Rearrange for titrant concentration</strong><br>
                Ct = (t × Ca × Va) / (a × Vt)
            </div>

            <div class="working-step">
                <strong>Step 3: Substitute the values</strong><br>
                Ct = (${t} × ${Ca} × ${Va}) / (${a} × ${Vt})
            </div>

            <div class="working-step">
                <strong>Step 4: Calculate</strong><br>
                Ct = ${unknownConcentration.toFixed(5)} mol/L
            </div>
        `;
    }

    if (!Number.isFinite(unknownConcentration) || unknownConcentration <= 0) {
        result.innerHTML = "Calculation error. Check your input values.";
        working.innerHTML = "";
        return;
    }

    result.innerHTML = `
        <strong>FINAL RESULT</strong><br>
        ${mode === "analyte" ? "Analyte" : "Titrant"} concentration:<br>
        <strong>${unknownConcentration.toFixed(5)} mol/L</strong>
    `;

    recordCalculation();
}
// CHEMICAL EQUATION BALANCER

function loadEquation(equation) {
    document.getElementById("chemicalEquation").value = equation;
    balanceEquation();
}

function parseBalancerFormula(formula) {

    const tokens = formula.match(/[A-Z][a-z]?|\d+|[()[\]]/g);

    if (!tokens || tokens.join("") !== formula) {
        throw new Error("Invalid chemical formula: " + formula);
    }

    let position = 0;

    function parseGroup(closing = null) {

        const composition = {};

        while (position < tokens.length) {

            const token = tokens[position++];

            if (token === ")" || token === "]") {

                if (token !== closing) {
                    throw new Error("Mismatched brackets in formula.");
                }

                return composition;
            }

            if (token === "(" || token === "[") {

                const expected = token === "(" ? ")" : "]";

                const group = parseGroup(expected);

                const next = tokens[position];

                const multiplier = /^\d+$/.test(next || "")
                    ? Number(tokens[position++])
                    : 1;

                for (const element in group) {
                    composition[element] =
                        (composition[element] || 0) +
                        group[element] * multiplier;
                }

            } else if (/^[A-Z][a-z]?$/.test(token)) {

                const next = tokens[position];

                const count = /^\d+$/.test(next || "")
                    ? Number(tokens[position++])
                    : 1;

                if (count <= 0) {
                    throw new Error("Invalid atom count.");
                }

                composition[token] =
                    (composition[token] || 0) + count;

            } else {
                throw new Error("Unexpected formula token: " + token);
            }
        }

        if (closing !== null) {
            throw new Error("Missing closing bracket.");
        }

        return composition;
    }

    const result = parseGroup();

    if (position !== tokens.length) {
        throw new Error("Invalid formula structure.");
    }

    return result;
}


// GREATEST COMMON DIVISOR

function balancerGCD(a, b) {

    a = Math.abs(a);
    b = Math.abs(b);

    while (b) {
        const temp = b;
        b = a % b;
        a = temp;
    }

    return a;
}


// CONVERT DECIMALS TO WHOLE NUMBERS

function convertToIntegers(values) {

    const tolerance = 1e-8;

    for (let denominator = 1; denominator <= 10000; denominator++) {

        const integers = values.map(value =>
            Math.round(value * denominator)
        );

        if (integers.some(value => value <= 0)) {
            continue;
        }

        if (values.every((value, index) =>
            Math.abs(value - integers[index] / denominator) < tolerance
        )) {

            let divisor = integers.reduce(
                (a, b) => balancerGCD(a, b)
            );

            return integers.map(value => value / divisor);
        }
    }

    throw new Error("Could not obtain reliable whole-number coefficients.");
}


// SOLVE A SYSTEM OF LINEAR EQUATIONS

function solveBalancerSystem(matrix) {

    const rows = matrix.length;
    const cols = matrix[0].length;

    const pivotColumns = [];
    let pivotRow = 0;

    for (let col = 0; col < cols && pivotRow < rows; col++) {

        let selected = pivotRow;

        for (let row = pivotRow + 1; row < rows; row++) {

            if (Math.abs(matrix[row][col]) >
                Math.abs(matrix[selected][col])) {

                selected = row;
            }
        }

        if (Math.abs(matrix[selected][col]) < 1e-10) {
            continue;
        }

        [matrix[pivotRow], matrix[selected]] =
            [matrix[selected], matrix[pivotRow]];

        const divisor = matrix[pivotRow][col];

        for (let j = 0; j < cols; j++) {
            matrix[pivotRow][j] /= divisor;
        }

        for (let row = 0; row < rows; row++) {

            if (row === pivotRow) continue;

            const factor = matrix[row][col];

            for (let j = 0; j < cols; j++) {

                matrix[row][j] -=
                    factor * matrix[pivotRow][j];
            }
        }

        pivotColumns.push(col);
        pivotRow++;
    }

    // Check for inconsistent equations

    for (let row = 0; row < rows; row++) {

        const allZero = matrix[row]
            .slice(0, cols)
            .every(value => Math.abs(value) < 1e-9);

        if (allZero && Math.abs(matrix[row][cols]) > 1e-9) {
            throw new Error("This chemical equation cannot be balanced.");
        }
    }

    // We require exactly one free variable.

    if (cols - pivotColumns.length !== 1) {
        throw new Error(
            "The equation has no unique balancing ratio. Check the reaction."
        );
    }

    const freeColumn = Array.from(
        { length: cols },
        (_, index) => index
    ).find(index => !pivotColumns.includes(index));

    const solution = Array(cols).fill(0);

    solution[freeColumn] = 1;

    for (let row = 0; row < pivotColumns.length; row++) {

        const column = pivotColumns[row];

        solution[column] = -matrix[row][cols];
    }

    if (solution.some(value => value <= 1e-10)) {
        throw new Error("A positive balancing solution was not found.");
    }

    return convertToIntegers(solution);
}


// MAIN BALANCING FUNCTION

function balanceEquation() {

    const input = document.getElementById("chemicalEquation").value.trim();

    const result = document.getElementById("balancerResult");
    const working = document.getElementById("balancerWorking");

    result.innerHTML = "";
    working.innerHTML = "";

    try {

        const sides = input.split(/->|→|=/);

        if (sides.length !== 2) {
            throw new Error("Use one reaction arrow, for example H2 + O2 -> H2O.");
        }

        const reactants = sides[0].split(/\s+\+\s+/).map(x => x.trim());
const products = sides[1].split(/\s+\+\s+/).map(x => x.trim());

        if (
            reactants.length === 0 ||
            products.length === 0 ||
            [...reactants, ...products].some(x => !x)
        ) {
            throw new Error("Please enter valid reactants and products.");
        }

        const compounds = [...reactants, ...products];

        const compositions = compounds.map(parseBalancerFormula);

        const elements = [...new Set(
            compositions.flatMap(comp => Object.keys(comp))
        )];

        const matrix = elements.map(element => {

            return compounds.map((compound, index) => {

                const count = compositions[index][element] || 0;

                return index < reactants.length ? count : -count;

            }).concat(0);

        });

        const coefficients = solveBalancerSystem(matrix);

        const balancedReactants = reactants.map((compound, index) => {

            return (coefficients[index] === 1 ? "" : coefficients[index])
                + compound;

        });

        const balancedProducts = products.map((compound, index) => {

            const coefficient = coefficients[index + reactants.length];

            return (coefficient === 1 ? "" : coefficient) + compound;

        });

        const balancedEquation =
            balancedReactants.join(" + ") +
            " → " +
            balancedProducts.join(" + ");

        result.innerHTML = `
            <strong>BALANCED EQUATION</strong><br>
            <span style="font-size:20px;font-weight:bold;">
                ${balancedEquation}
            </span>
        `;

        // ATOM CONSERVATION VERIFICATION

        let verification = "";

        elements.forEach(element => {

            let left = 0;
            let right = 0;

            compositions.forEach((composition, index) => {

                const count = composition[element] || 0;

                if (index < reactants.length) {
                    left += count * coefficients[index];
                } else {
                    right += count * coefficients[index];
                }

            });

            verification += `
                <div class="working-step">
                    ${element}: Reactants = ${left},
                    Products = ${right}
                    ${left === right ? " ✓ Balanced" : " ✗ Not balanced"}
                </div>
            `;

        });

        working.innerHTML = `
            <h3>Atom Conservation Verification</h3>
            ${verification}
            <div class="working-step">
                <strong>Result:</strong>
                All atoms are conserved.
            </div>
        `;

        recordCalculation();

    } catch (error) {

        result.innerHTML = `
            <strong>Balancing Error</strong><br>
            ${error.message}
        `;

        working.innerHTML = "";
    }
}// ==================================================
// INTERACTIVE PERIODIC TABLE - 118 ELEMENTS
// ==================================================

const periodicElements = [

["H","Hydrogen",1.008,"nonmetal",1,1],
["He","Helium",4.0026,"noble",1,18],
["Li","Lithium",6.94,"alkali",2,1],
["Be","Beryllium",9.0122,"alkaline",2,2],
["B","Boron",10.81,"metalloid",2,13],
["C","Carbon",12.011,"nonmetal",2,14],
["N","Nitrogen",14.007,"nonmetal",2,15],
["O","Oxygen",15.999,"nonmetal",2,16],
["F","Fluorine",18.998,"halogen",2,17],
["Ne","Neon",20.180,"noble",2,18],

["Na","Sodium",22.990,"alkali",3,1],
["Mg","Magnesium",24.305,"alkaline",3,2],
["Al","Aluminium",26.982,"post-transition",3,13],
["Si","Silicon",28.085,"metalloid",3,14],
["P","Phosphorus",30.974,"nonmetal",3,15],
["S","Sulfur",32.06,"nonmetal",3,16],
["Cl","Chlorine",35.45,"halogen",3,17],
["Ar","Argon",39.948,"noble",3,18],

["K","Potassium",39.098,"alkali",4,1],
["Ca","Calcium",40.078,"alkaline",4,2],
["Sc","Scandium",44.956,"transition",4,3],
["Ti","Titanium",47.867,"transition",4,4],
["V","Vanadium",50.942,"transition",4,5],
["Cr","Chromium",51.996,"transition",4,6],
["Mn","Manganese",54.938,"transition",4,7],
["Fe","Iron",55.845,"transition",4,8],
["Co","Cobalt",58.933,"transition",4,9],
["Ni","Nickel",58.693,"transition",4,10],
["Cu","Copper",63.546,"transition",4,11],
["Zn","Zinc",65.38,"transition",4,12],
["Ga","Gallium",69.723,"post-transition",4,13],
["Ge","Germanium",72.630,"metalloid",4,14],
["As","Arsenic",74.922,"metalloid",4,15],
["Se","Selenium",78.971,"nonmetal",4,16],
["Br","Bromine",79.904,"halogen",4,17],
["Kr","Krypton",83.798,"noble",4,18],

["Rb","Rubidium",85.468,"alkali",5,1],
["Sr","Strontium",87.62,"alkaline",5,2],
["Y","Yttrium",88.906,"transition",5,3],
["Zr","Zirconium",91.224,"transition",5,4],
["Nb","Niobium",92.906,"transition",5,5],
["Mo","Molybdenum",95.95,"transition",5,6],
["Tc","Technetium",98,"transition",5,7],
["Ru","Ruthenium",101.07,"transition",5,8],
["Rh","Rhodium",102.906,"transition",5,9],
["Pd","Palladium",106.42,"transition",5,10],
["Ag","Silver",107.868,"transition",5,11],
["Cd","Cadmium",112.414,"transition",5,12],
["In","Indium",114.818,"post-transition",5,13],
["Sn","Tin",118.710,"post-transition",5,14],
["Sb","Antimony",121.760,"metalloid",5,15],
["Te","Tellurium",127.60,"metalloid",5,16],
["I","Iodine",126.904,"halogen",5,17],
["Xe","Xenon",131.293,"noble",5,18],

["Cs","Caesium",132.905,"alkali",6,1],
["Ba","Barium",137.327,"alkaline",6,2],
["La","Lanthanum",138.905,"lanthanoid",6,3],
["Ce","Cerium",140.116,"lanthanoid",6,null],
["Pr","Praseodymium",140.908,"lanthanoid",6,null],
["Nd","Neodymium",144.242,"lanthanoid",6,null],
["Pm","Promethium",145,"lanthanoid",6,null],
["Sm","Samarium",150.36,"lanthanoid",6,null],
["Eu","Europium",151.964,"lanthanoid",6,null],
["Gd","Gadolinium",157.25,"lanthanoid",6,null],
["Tb","Terbium",158.925,"lanthanoid",6,null],
["Dy","Dysprosium",162.500,"lanthanoid",6,null],
["Ho","Holmium",164.930,"lanthanoid",6,null],
["Er","Erbium",167.259,"lanthanoid",6,null],
["Tm","Thulium",168.934,"lanthanoid",6,null],
["Yb","Ytterbium",173.045,"lanthanoid",6,null],
["Lu","Lutetium",174.967,"lanthanoid",6,null],

["Hf","Hafnium",178.49,"transition",6,4],
["Ta","Tantalum",180.948,"transition",6,5],
["W","Tungsten",183.84,"transition",6,6],
["Re","Rhenium",186.207,"transition",6,7],
["Os","Osmium",190.23,"transition",6,8],
["Ir","Iridium",192.217,"transition",6,9],
["Pt","Platinum",195.084,"transition",6,10],
["Au","Gold",196.967,"transition",6,11],
["Hg","Mercury",200.592,"transition",6,12],
["Tl","Thallium",204.38,"post-transition",6,13],
["Pb","Lead",207.2,"post-transition",6,14],
["Bi","Bismuth",208.980,"post-transition",6,15],
["Po","Polonium",209,"post-transition",6,16],
["At","Astatine",210,"halogen",6,17],
["Rn","Radon",222,"noble",6,18],

["Fr","Francium",223,"alkali",7,1],
["Ra","Radium",226,"alkaline",7,2],
["Ac","Actinium",227,"actinoid",7,3],
["Th","Thorium",232.038,"actinoid",7,null],
["Pa","Protactinium",231.036,"actinoid",7,null],
["U","Uranium",238.029,"actinoid",7,null],
["Np","Neptunium",237,"actinoid",7,null],
["Pu","Plutonium",244,"actinoid",7,null],
["Am","Americium",243,"actinoid",7,null],
["Cm","Curium",247,"actinoid",7,null],
["Bk","Berkelium",247,"actinoid",7,null],
["Cf","Californium",251,"actinoid",7,null],
["Es","Einsteinium",252,"actinoid",7,null],
["Fm","Fermium",257,"actinoid",7,null],
["Md","Mendelevium",258,"actinoid",7,null],
["No","Nobelium",259,"actinoid",7,null],
["Lr","Lawrencium",266,"actinoid",7,null],

["Rf","Rutherfordium",267,"transition",7,4],
["Db","Dubnium",268,"transition",7,5],
["Sg","Seaborgium",269,"transition",7,6],
["Bh","Bohrium",270,"transition",7,7],
["Hs","Hassium",277,"transition",7,8],
["Mt","Meitnerium",278,"transition",7,9],
["Ds","Darmstadtium",281,"transition",7,10],
["Rg","Roentgenium",282,"transition",7,11],
["Cn","Copernicium",285,"transition",7,12],
["Nh","Nihonium",286,"post-transition",7,13],
["Fl","Flerovium",289,"post-transition",7,14],
["Mc","Moscovium",290,"post-transition",7,15],
["Lv","Livermorium",293,"post-transition",7,16],
["Ts","Tennessine",294,"halogen",7,17],
["Og","Oganesson",294,"noble",7,18]

];


// DISPLAY THE PERIODIC TABLE

function displayPeriodicTable() {

    const table = document.getElementById("periodicTable");

    if (!table) return;

    table.innerHTML = "";

    periodicElements.forEach((element, index) => {

        const [symbol, name, mass, category, period, group] = element;

        const atomicNumber = index + 1;

        const box = document.createElement("div");

        box.className = `element ${category}`;
        box.dataset.number = atomicNumber;

        if (group === null) {
            const row = period === 6 ? 9 : 10;
            const column = atomicNumber - (period === 6 ? 54 : 86) + 3;

            box.style.gridRow = row;
            box.style.gridColumn = column;

        } else {

            box.style.gridRow = period;
            box.style.gridColumn = group;

        }

        box.innerHTML = `
            <span class="atomic-number">${atomicNumber}</span>
            <span class="symbol">${symbol}</span>
            <span class="element-name">${name}</span>
        `;

        box.addEventListener("click", () => {
            showElementDetails(atomicNumber);
        });

        table.appendChild(box);

    });

}


// SHOW ELEMENT DETAILS

function showElementDetails(atomicNumber) {

    const element = periodicElements[atomicNumber - 1];

    if (!element) return;

    const [symbol, name, mass, category, period, group] = element;

    const details = document.getElementById("elementDetails");

    document.querySelectorAll(".element").forEach(box => {
        box.classList.remove("selected");
    });

    const selected = document.querySelector(
        `.element[data-number="${atomicNumber}"]`
    );

    if (selected) selected.classList.add("selected");

    details.innerHTML = `
        <div class="element-detail-title">
            ${name} (${symbol})
        </div>

        <hr>

        <strong>Atomic Number:</strong> ${atomicNumber}<br>

        <strong>Element Name:</strong> ${name}<br>

        <strong>Symbol:</strong> ${symbol}<br>

        <strong>Relative Atomic Mass:</strong> ${mass}<br>

        <strong>Category:</strong> ${category.replace("-", " ")}<br>

        <strong>Period:</strong> ${period}<br>

        <strong>Group:</strong> ${group ?? "Lanthanide/Actinide series"}<br>
    `;

}


// SEARCH ELEMENTS

function searchElements() {

    const search = document
        .getElementById("elementSearch")
        .value.trim()
        .toLowerCase();

    periodicElements.forEach((element, index) => {

        const [symbol, name] = element;

        const atomicNumber = index + 1;

        const box = document.querySelector(
            `.element[data-number="${atomicNumber}"]`
        );

        const matches =
            symbol.toLowerCase().includes(search) ||
            name.toLowerCase().includes(search) ||
            String(atomicNumber).includes(search);

        box.classList.toggle("hidden", !matches);

    });

}


// INITIALIZE PERIODIC TABLE

displayPeriodicTable();

document
    .getElementById("elementSearch")
    .addEventListener("input", searchElements);
    // =====================================
// NERNST EQUATION CALCULATOR
// =====================================

function calculateNernst() {

    const E0 = parseFloat(document.getElementById("nernstE0").value);
    const n = parseInt(document.getElementById("nernstN").value);
    const Q = parseFloat(document.getElementById("nernstQ").value);
    const tempC = parseFloat(document.getElementById("nernstTemp").value);

    const result = document.getElementById("nernstResult");
    const working = document.getElementById("nernstWorking");

    const R = 8.314462618;
    const F = 96485.33212;
    const T = tempC + 273.15;

    if (
        !Number.isFinite(E0) ||
        !Number.isInteger(n) || n <= 0 ||
        !Number.isFinite(Q) || Q <= 0 ||
        !Number.isFinite(tempC) || T <= 0
    ) {
        result.textContent = "Please enter valid values in all fields.";
        working.innerHTML = "";
        return;
    }

    const E = E0 - (R * T / (n * F)) * Math.log(Q);

    result.innerHTML = `
        Cell Potential (E) = ${E.toFixed(5)} V
    `;

    working.innerHTML = `
        <strong>Nernst Equation:</strong><br>
        E = E° - (RT/nF) ln Q<br><br>

        <strong>Substitution:</strong><br>
        E = ${E0} - 
        (8.31446 × ${T.toFixed(2)}) /
        (${n} × 96485.33) × ln(${Q})<br><br>

        <strong>Final Answer:</strong><br>
        E = ${E.toFixed(5)} V
    `;

    recordCalculation();
}
// =====================================
// STANDARD CELL POTENTIAL CALCULATOR
// =====================================

function calculateCellPotential() {

    const cathode = parseFloat(
        document.getElementById("cathodePotential").value
    );

    const anode = parseFloat(
        document.getElementById("anodePotential").value
    );

    const result = document.getElementById("cellPotentialResult");
    const working = document.getElementById("cellPotentialWorking");

    if (!Number.isFinite(cathode) || !Number.isFinite(anode)) {
        result.textContent = "Please enter valid electrode potentials.";
        working.innerHTML = "";
        return;
    }

    const Ecell = cathode - anode;

    let interpretation = "";

    if (Ecell > 0) {
        interpretation = "The reaction is spontaneous under standard conditions.";
    } else if (Ecell < 0) {
        interpretation = "The reaction is non-spontaneous under standard conditions.";
    } else {
        interpretation = "The system is at equilibrium under standard conditions.";
    }

    result.innerHTML = `
        <strong>Standard Cell Potential:</strong><br>
        E°cell = ${Ecell.toFixed(4)} V
        <br><br>
        ${interpretation}
    `;

    working.innerHTML = `
        <strong>Formula:</strong><br>
        E°cell = E°cathode - E°anode<br><br>

        <strong>Substitution:</strong><br>
        E°cell = ${cathode} - (${anode})<br><br>

        <strong>Answer:</strong><br>
        E°cell = ${Ecell.toFixed(4)} V
    `;

    recordCalculation();
}
// =====================================
// GIBBS FREE ENERGY CALCULATOR
// =====================================

function calculateGibbs() {

    const E = parseFloat(
        document.getElementById("gibbsE").value
    );

    const n = Number(
        document.getElementById("gibbsN").value
    );

    const result = document.getElementById("gibbsResult");
    const working = document.getElementById("gibbsWorking");

    const F = 96485.33212;

    if (
        !Number.isFinite(E) ||
        !Number.isInteger(n) ||
        n <= 0
    ) {
        result.textContent = "Please enter valid values. Number of electrons must be a positive integer.";
        working.innerHTML = "";
        return;
    }

    const deltaG = -n * F * E;
    const deltaGKJ = deltaG / 1000;

    let interpretation = "";

    if (deltaG < 0) {
        interpretation = "The reaction is thermodynamically spontaneous under the specified conditions.";
    } else if (deltaG > 0) {
        interpretation = "The reaction is thermodynamically non-spontaneous under the specified conditions.";
    } else {
        interpretation = "The system is at equilibrium.";
    }

    result.innerHTML = `
        <strong>Gibbs Free Energy:</strong><br>
        ΔG = ${deltaG.toFixed(3)} J/mol<br>
        ΔG = ${deltaGKJ.toFixed(5)} kJ/mol
        <br><br>
        ${interpretation}
    `;

    working.innerHTML = `
        <strong>Formula:</strong><br>
        ΔG = -nFE<br><br>

        <strong>Substitution:</strong><br>
        ΔG = -(${n}) × 96485.33212 × (${E})<br><br>

        <strong>Calculation:</strong><br>
        ΔG = ${deltaG.toFixed(3)} J/mol<br><br>

        <strong>Final Answer:</strong><br>
        ΔG = ${deltaGKJ.toFixed(5)} kJ/mol
    `;

    recordCalculation();
}
// =====================================
// EQUILIBRIUM CONSTANT CALCULATOR
// =====================================

function calculateEquilibrium() {

    const E = parseFloat(
        document.getElementById("equilibriumE").value
    );

    const n = Number(
        document.getElementById("equilibriumN").value
    );

    const tempC = parseFloat(
        document.getElementById("equilibriumTemp").value
    );

    const result = document.getElementById("equilibriumResult");
    const working = document.getElementById("equilibriumWorking");

    const R = 8.314462618;
    const F = 96485.33212;
    const T = tempC + 273.15;

    if (
        !Number.isFinite(E) ||
        !Number.isInteger(n) || n <= 0 ||
        !Number.isFinite(tempC) ||
        T <= 0
    ) {
        result.textContent = "Please enter valid values in all fields.";
        working.innerHTML = "";
        return;
    }

    const lnK = (n * F * E) / (R * T);
    const log10K = lnK / Math.LN10;

    if (log10K > 308 || log10K < -323) {
        result.innerHTML = `
            <strong>log₁₀ K = ${log10K.toFixed(5)}</strong><br>
            K is outside the normal JavaScript numerical range.
        `;

        working.innerHTML = `
            <strong>Formula:</strong><br>
            ln K = nFE° / RT<br><br>

            <strong>Calculated value:</strong><br>
            ln K = ${lnK.toFixed(5)}<br>
            log₁₀ K = ${log10K.toFixed(5)}
        `;

        recordCalculation();
        return;
    }

    const K = Math.exp(lnK);

    result.innerHTML = `
        <strong>Equilibrium Constant:</strong><br>
        K = ${K.toExponential(5)}<br>
        log₁₀ K = ${log10K.toFixed(5)}
    `;

    working.innerHTML = `
        <strong>Formula:</strong><br>
        ln K = nFE° / RT<br><br>

        <strong>Substitution:</strong><br>
        ln K = (${n} × 96485.33212 × ${E}) /
        (8.31446 × ${T.toFixed(2)})<br><br>

        <strong>Calculation:</strong><br>
        ln K = ${lnK.toFixed(5)}<br><br>

        <strong>Final Answer:</strong><br>
        K = ${K.toExponential(5)}
    `;

    recordCalculation();
}
// =====================================
// FARADAY'S LAW OF ELECTROLYSIS
// =====================================

function calculateFaraday() {

    const M = parseFloat(
        document.getElementById("faradayMolarMass").value
    );

    const I = parseFloat(
        document.getElementById("faradayCurrent").value
    );

    const t = parseFloat(
        document.getElementById("faradayTime").value
    );

    const n = Number(
        document.getElementById("faradayN").value
    );

    const result = document.getElementById("faradayResult");
    const working = document.getElementById("faradayWorking");

    const F = 96485.33212;

    if (
        !Number.isFinite(M) || M <= 0 ||
        !Number.isFinite(I) || I < 0 ||
        !Number.isFinite(t) || t < 0 ||
        !Number.isInteger(n) || n <= 0
    ) {
        result.textContent = "Please enter valid values. Molar mass must be positive, while current and time cannot be negative.";
        working.innerHTML = "";
        return;
    }

    const charge = I * t;
    const molesElectrons = charge / F;
    const molesSubstance = molesElectrons / n;
    const mass = (M * I * t) / (n * F);

    result.innerHTML = `
        <strong>Mass Deposited:</strong><br>
        m = ${mass.toFixed(6)} g
        <br><br>
        Charge passed = ${charge.toFixed(3)} C
        <br>
        Moles of substance = ${molesSubstance.toFixed(6)} mol
    `;

    working.innerHTML = `
        <strong>Faraday's First Law:</strong><br>
        m = MIt / nF<br><br>

        <strong>Substitution:</strong><br>
        m = (${M} × ${I} × ${t}) /
        (${n} × 96485.33212)<br><br>

        <strong>Charge:</strong><br>
        Q = It = ${charge.toFixed(3)} C<br><br>

        <strong>Moles of electrons:</strong><br>
        n(e⁻) = Q/F = ${molesElectrons.toFixed(6)} mol<br><br>

        <strong>Moles of substance:</strong><br>
        n(substance) = ${molesSubstance.toFixed(6)} mol<br><br>

        <strong>Final Answer:</strong><br>
        Mass = ${mass.toFixed(6)} g
    `;

    recordCalculation();
}
// =====================================
// ELECTROCHEMICAL CELL BUILDER
// =====================================

// Standard reduction potentials at 25°C

const electrodeDatabase = [
    {
        name: "Magnesium",
        ion: "Mg²⁺",
        metal: "Mg",
        electrons: 2,
        potential: -2.37
    },
    {
        name: "Aluminium",
        ion: "Al³⁺",
        metal: "Al",
        electrons: 3,
        potential: -1.66
    },
    {
        name: "Zinc",
        ion: "Zn²⁺",
        metal: "Zn",
        electrons: 2,
        potential: -0.76
    },
    {
        name: "Iron",
        ion: "Fe²⁺",
        metal: "Fe",
        electrons: 2,
        potential: -0.44
    },
    {
        name: "Cadmium",
        ion: "Cd²⁺",
        metal: "Cd",
        electrons: 2,
        potential: -0.40
    },
    {
        name: "Nickel",
        ion: "Ni²⁺",
        metal: "Ni",
        electrons: 2,
        potential: -0.25
    },
    {
        name: "Tin",
        ion: "Sn²⁺",
        metal: "Sn",
        electrons: 2,
        potential: -0.14
    },
    {
        name: "Lead",
        ion: "Pb²⁺",
        metal: "Pb",
        electrons: 2,
        potential: -0.13
    },
    {
        name: "Hydrogen",
        ion: "H⁺",
        metal: "H₂",
        electrons: 2,
        potential: 0.00
    },
    {
        name: "Copper",
        ion: "Cu²⁺",
        metal: "Cu",
        electrons: 2,
        potential: 0.34
    },
    {
        name: "Silver",
        ion: "Ag⁺",
        metal: "Ag",
        electrons: 1,
        potential: 0.80
    },
    {
        name: "Gold",
        ion: "Au³⁺",
        metal: "Au",
        electrons: 3,
        potential: 1.50
    }
];


// Populate electrode selection menus

function loadElectrodes() {

    const first = document.getElementById("electrodeOne");
    const second = document.getElementById("electrodeTwo");

    if (!first || !second) return;

    electrodeDatabase.forEach((electrode, index) => {

        const optionOne = document.createElement("option");
        optionOne.value = index;
        optionOne.textContent =
            `${electrode.name} (${electrode.potential.toFixed(2)} V)`;

        const optionTwo = optionOne.cloneNode(true);

        first.appendChild(optionOne);
        second.appendChild(optionTwo);

    });
}


// Greatest common divisor

function cellGCD(a, b) {

    return b === 0 ? a : cellGCD(b, a % b);

}


// Lowest common multiple

function cellLCM(a, b) {

    return Math.abs(a * b) / cellGCD(a, b);

}


// Build and analyse an electrochemical cell

function buildElectrochemicalCell() {

    const firstIndex = document.getElementById("electrodeOne").value;
    const secondIndex = document.getElementById("electrodeTwo").value;

    const result = document.getElementById("cellBuilderResult");
    const working = document.getElementById("cellBuilderWorking");

    if (firstIndex === "" || secondIndex === "") {

        result.textContent = "Please select both electrodes.";
        working.innerHTML = "";
        return;

    }

    if (firstIndex === secondIndex) {

        result.textContent = "Please select two different electrodes.";
        working.innerHTML = "";
        return;

    }

    const first = electrodeDatabase[Number(firstIndex)];
    const second = electrodeDatabase[Number(secondIndex)];

    // Higher reduction potential becomes the cathode

    const cathode = first.potential > second.potential ? first : second;
    const anode = first.potential > second.potential ? second : first;

    const Ecell = cathode.potential - anode.potential;

    // Balance electrons between half-reactions

    const electrons = cellLCM(
        anode.electrons,
        cathode.electrons
    );

    const anodeCoefficient = electrons / anode.electrons;
    const cathodeCoefficient = electrons / cathode.electrons;

    // Construct half-reactions

    const oxidation = anodeCoefficient === 1
        ? `${anode.metal} → ${anode.ion} + ${anode.electrons}e⁻`
        : `${anodeCoefficient}${anode.metal} → ${anodeCoefficient}${anode.ion} + ${electrons}e⁻`;

    const reduction = cathodeCoefficient === 1
        ? `${cathode.ion} + ${cathode.electrons}e⁻ → ${cathode.metal}`
        : `${cathodeCoefficient}${cathode.ion} + ${electrons}e⁻ → ${cathodeCoefficient}${cathode.metal}`;

    // Overall reaction

    const overallReaction =
        `${anodeCoefficient}${anode.metal} + ` +
        `${cathodeCoefficient}${cathode.ion} → ` +
        `${anodeCoefficient}${anode.ion} + ` +
        `${cathodeCoefficient}${cathode.metal}`;

    // Cell notation

    const cellNotation =
        `${anode.metal} | ${anode.ion} || ${cathode.ion} | ${cathode.metal}`;

    let spontaneity = Ecell > 0
        ? "Spontaneous under standard conditions."
        : "At equilibrium under standard conditions.";

    result.innerHTML = `
        <strong>STANDARD CELL POTENTIAL</strong><br>
        E°cell = ${Ecell.toFixed(3)} V<br><br>

        <strong>Anode:</strong> ${anode.name}<br>
        <strong>Cathode:</strong> ${cathode.name}<br><br>

        <strong>Electron Flow:</strong><br>
        ${anode.name} → ${cathode.name}<br><br>

        <strong>Cell Notation:</strong><br>
        ${cellNotation}<br><br>

        <strong>Overall Reaction:</strong><br>
        ${overallReaction}<br><br>

        <strong>Reaction Behaviour:</strong><br>
        ${spontaneity}
    `;

    working.innerHTML = `
        <strong>STEP 1: Standard Reduction Potentials</strong><br>
        ${cathode.name} = ${cathode.potential.toFixed(2)} V<br>
        ${anode.name} = ${anode.potential.toFixed(2)} V<br><br>

        <strong>STEP 2: Identify Electrodes</strong><br>
        Higher reduction potential: Cathode (${cathode.name})<br>
        Lower reduction potential: Anode (${anode.name})<br><br>

        <strong>STEP 3: Calculate Cell Potential</strong><br>
        E°cell = E°cathode - E°anode<br>
        E°cell = ${cathode.potential} - (${anode.potential})<br>
        E°cell = ${Ecell.toFixed(3)} V<br><br>

        <strong>STEP 4: Oxidation Half-Reaction</strong><br>
        ${oxidation}<br><br>

        <strong>STEP 5: Reduction Half-Reaction</strong><br>
        ${reduction}<br><br>

        <strong>STEP 6: Overall Reaction</strong><br>
        ${overallReaction}<br><br>

        <strong>STEP 7: Electron Balance</strong><br>
        Electrons transferred = ${electrons}
    `;

    recordCalculation();
}


// Initialize electrode menus

loadElectrodes();

// INTERACTIVE ELECTROCHEMICAL CELL DIAGRAM

const visualCellData = {
    zinc: {
        anode: "Zn",
        anodeIon: "Zn²⁺",
        potential: "1.10 V",
        oxidation: "Zn(s) → Zn²⁺(aq) + 2e⁻",
        reduction: "Cu²⁺(aq) + 2e⁻ → Cu(s)",
        overall: "Zn(s) + Cu²⁺(aq) → Zn²⁺(aq) + Cu(s)",
        notation: "Zn | Zn²⁺ || Cu²⁺ | Cu"
    },

    magnesium: {
        anode: "Mg",
        anodeIon: "Mg²⁺",
        potential: "2.71 V",
        oxidation: "Mg(s) → Mg²⁺(aq) + 2e⁻",
        reduction: "Cu²⁺(aq) + 2e⁻ → Cu(s)",
        overall: "Mg(s) + Cu²⁺(aq) → Mg²⁺(aq) + Cu(s)",
        notation: "Mg | Mg²⁺ || Cu²⁺ | Cu"
    },

    iron: {
        anode: "Fe",
        anodeIon: "Fe²⁺",
        potential: "0.78 V",
        oxidation: "Fe(s) → Fe²⁺(aq) + 2e⁻",
        reduction: "Cu²⁺(aq) + 2e⁻ → Cu(s)",
        overall: "Fe(s) + Cu²⁺(aq) → Fe²⁺(aq) + Cu(s)",
        notation: "Fe | Fe²⁺ || Cu²⁺ | Cu"
    }
};

function updateVisualCell() {

    const selector = document.getElementById("visualCellType");

    if (!selector) return;

    const cell = visualCellData[selector.value];

    if (!cell) return;

    document.getElementById("visualAnodeMetal").textContent =
        cell.anode + " Electrode";

    document.getElementById("visualCathodeMetal").textContent =
        "Cu Electrode";

    document.getElementById("visualAnodeIon").textContent =
        cell.anodeIon + " Solution";

    document.getElementById("visualCathodeIon").textContent =
        "Cu²⁺ Solution";

    document.getElementById("visualAnodeHeading").textContent =
        cell.anode + " ANODE (-)";

    document.getElementById("visualCathodeHeading").textContent =
        "Cu CATHODE (+)";

    const reactionBox = document.querySelector(
        "#electrochemistry .cell-reactions"
    );

    if (reactionBox) {
        reactionBox.innerHTML = `
            <h4>Cell Potential: ${cell.potential}</h4>

            <p><strong>Cell notation:</strong><br>
            ${cell.notation}</p>

            <p><strong>Oxidation at anode:</strong><br>
            ${cell.oxidation}</p>

            <p><strong>Reduction at cathode:</strong><br>
            ${cell.reduction}</p>

            <p><strong>Overall cell reaction:</strong><br>
            ${cell.overall}</p>

            <p><strong>Electron flow:</strong><br>
            ${cell.anode} → Cu</p>
        `;
    }

    console.log("Visual cell updated:", selector.value);
}

// INITIALIZE THE VISUAL CELL

updateVisualCell();

// ELECTROCHEMICAL SERIES DATABASE

const electrochemicalSeries = [
    { metal: "Lithium", symbol: "Li", ion: "Li⁺", potential: -3.04, electrons: 1 },
    { metal: "Potassium", symbol: "K", ion: "K⁺", potential: -2.93, electrons: 1 },
    { metal: "Calcium", symbol: "Ca", ion: "Ca²⁺", potential: -2.87, electrons: 2 },
    { metal: "Sodium", symbol: "Na", ion: "Na⁺", potential: -2.71, electrons: 1 },
    { metal: "Magnesium", symbol: "Mg", ion: "Mg²⁺", potential: -2.37, electrons: 2 },
    { metal: "Aluminium", symbol: "Al", ion: "Al³⁺", potential: -1.66, electrons: 3 },
    { metal: "Manganese", symbol: "Mn", ion: "Mn²⁺", potential: -1.18, electrons: 2 },
    { metal: "Zinc", symbol: "Zn", ion: "Zn²⁺", potential: -0.76, electrons: 2 },
    { metal: "Chromium", symbol: "Cr", ion: "Cr³⁺", potential: -0.74, electrons: 3 },
    { metal: "Iron", symbol: "Fe", ion: "Fe²⁺", potential: -0.44, electrons: 2 },
    { metal: "Cadmium", symbol: "Cd", ion: "Cd²⁺", potential: -0.40, electrons: 2 },
    { metal: "Nickel", symbol: "Ni", ion: "Ni²⁺", potential: -0.25, electrons: 2 },
    { metal: "Tin", symbol: "Sn", ion: "Sn²⁺", potential: -0.14, electrons: 2 },
    { metal: "Lead", symbol: "Pb", ion: "Pb²⁺", potential: -0.13, electrons: 2 },
    { metal: "Hydrogen", symbol: "H", ion: "H⁺", potential: 0.00, electrons: 1 },
    { metal: "Copper", symbol: "Cu", ion: "Cu²⁺", potential: 0.34, electrons: 2 },
    { metal: "Silver", symbol: "Ag", ion: "Ag⁺", potential: 0.80, electrons: 1 },
    { metal: "Mercury", symbol: "Hg", ion: "Hg²⁺", potential: 0.85, electrons: 2 },
    { metal: "Gold", symbol: "Au", ion: "Au³⁺", potential: 1.50, electrons: 3 }
];

// POPULATE ELECTRODE SELECTORS

function loadSeriesElectrodes() {

    const first = document.getElementById("seriesMetalOne");
    const second = document.getElementById("seriesMetalTwo");

    if (!first || !second) return;

    const options = electrochemicalSeries.map((item, index) =>
        `<option value="${index}">${item.metal} (${item.symbol}) — ${item.potential.toFixed(2)} V</option>`
    ).join("");

    first.innerHTML = options;
    second.innerHTML = options;

    first.value = "7";  // Zinc
    second.value = "15"; // Copper

    displayElectrochemicalSeries();
}

// DISPLAY SERIES TABLE

function displayElectrochemicalSeries(searchTerm = "") {

    const container = document.getElementById("seriesTable");

    if (!container) return;

    const filtered = electrochemicalSeries
        .filter(item =>
            item.metal.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.symbol.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .sort((a, b) => b.potential - a.potential);

    container.innerHTML = `
        <table class="series-table">
            <thead>
                <tr>
                    <th>Metal / Element</th>
                    <th>Reduction Half-cell</th>
                    <th>E° (V)</th>
                </tr>
            </thead>
            <tbody>
                ${filtered.map(item => `
                    <tr>
                        <td>${item.metal} (${item.symbol})</td>
                        <td>${item.ion} + ${item.electrons}e⁻ → ${item.symbol}</td>
                        <td class="${item.potential >= 0 ? "series-positive" : "series-negative"}">
                            ${item.potential.toFixed(2)}
                        </td>
                    </tr>
                `).join("")}
            </tbody>
        </table>
    `;
}

// COMPARE TWO ELECTRODES

function compareElectrodes() {

    const firstIndex = Number(
        document.getElementById("seriesMetalOne").value
    );

    const secondIndex = Number(
        document.getElementById("seriesMetalTwo").value
    );

    const result = document.getElementById("seriesResult");
    const working = document.getElementById("seriesWorking");

    const first = electrochemicalSeries[firstIndex];
    const second = electrochemicalSeries[secondIndex];

    if (!first || !second || firstIndex === secondIndex) {
        result.textContent = "Please select two different electrodes.";
        working.innerHTML = "";
        return;
    }

    // Higher reduction potential is the cathode.
    const cathode = first.potential > second.potential ? first : second;
    const anode = first.potential > second.potential ? second : first;

    const cellPotential = cathode.potential - anode.potential;

    result.innerHTML = `
        <h4>Standard Cell Potential: ${cellPotential.toFixed(2)} V</h4>
        <p><strong>Anode:</strong> ${anode.metal}</p>
        <p><strong>Cathode:</strong> ${cathode.metal}</p>
        <p><strong>Electron flow:</strong> ${anode.symbol} → ${cathode.symbol}</p>
        <p><strong>Spontaneity:</strong> ${cellPotential > 0 ? "Spontaneous under standard conditions" : "Non-spontaneous in the forward direction"}</p>
    `;

    working.innerHTML = `
        <h4>Calculation and interpretation</h4>

        <p><strong>1. Anode:</strong> ${anode.metal} has the lower
        standard reduction potential (${anode.potential.toFixed(2)} V),
        so it undergoes oxidation.</p>

        <p><strong>2. Cathode:</strong> ${cathode.metal} has the higher
        standard reduction potential (${cathode.potential.toFixed(2)} V),
        so its reduction reaction occurs.</p>

        <p><strong>3. Cell potential:</strong></p>

        <p>E°cell = E°cathode − E°anode</p>

        <p>E°cell = ${cathode.potential.toFixed(2)} −
        (${anode.potential.toFixed(2)})</p>

        <p>E°cell = ${cellPotential.toFixed(2)} V</p>

        <p><strong>4. Anode oxidation half-reaction:</strong><br>
        ${anode.symbol} → ${anode.ion} + ${anode.electrons}e⁻</p>

        <p><strong>5. Cathode reduction half-reaction:</strong><br>
        ${cathode.ion} + ${cathode.electrons}e⁻ → ${cathode.symbol}</p>

        <p><strong>Note:</strong> This comparison predicts electrode
        roles and cell potential. The half-reactions shown are not
        yet balanced together for electron transfer.</p>
    `;

    recordCalculation();
}

// SEARCH ELECTROCHEMICAL SERIES

const seriesSearchInput = document.getElementById("seriesSearch");

if (seriesSearchInput) {
    seriesSearchInput.addEventListener("input", () => {
        displayElectrochemicalSeries(seriesSearchInput.value);
    });
}

// INITIALIZE EXPLORER

loadSeriesElectrodes();

// ADVANCED REDOX BALANCING ENGINE

function parseRedoxSpecies(formula) {

    formula = formula.replace(/\s/g, "");

    if (formula === "e-" || formula === "e⁻") {
        return { atoms: {}, charge: -1 };
    }

    let charge = 0;

    // Extract explicit charges such as Fe^2+, SO4^2-
    const caretCharge = formula.match(/\^(\d*)([+-])$/);

    if (caretCharge) {
        charge = Number(caretCharge[1] || 1) *
            (caretCharge[2] === "+" ? 1 : -1);

        formula = formula.slice(0, caretCharge.index);
    } else {

        // Extract simple charges such as Fe2+, Fe3+, Cl-
        const simpleCharge = formula.match(/([A-Z][a-z]?)(\d+)([+-])$/);

        if (simpleCharge) {
            charge = Number(simpleCharge[2]) *
                (simpleCharge[3] === "+" ? 1 : -1);

            formula = formula.slice(0, simpleCharge.index) +
                simpleCharge[1];
        } else if (/[+-]$/.test(formula)) {
            charge = formula.endsWith("+") ? 1 : -1;
            formula = formula.slice(0, -1);
        }
    }

    const atoms = {};
    let position = 0;

    function parseGroup() {

        const group = {};

        while (position < formula.length) {

            if (formula[position] === ")") {
                position++;
                return group;
            }

            if (formula[position] === "(") {

                position++;

                const nested = parseGroup();

                const multiplierMatch =
                    formula.slice(position).match(/^\d+/);

                const multiplier = multiplierMatch
                    ? Number(multiplierMatch[0])
                    : 1;

                if (multiplierMatch) {
                    position += multiplierMatch[0].length;
                }

                Object.entries(nested).forEach(([element, count]) => {
                    group[element] =
                        (group[element] || 0) + count * multiplier;
                });

                continue;
            }

            const elementMatch =
                formula.slice(position).match(/^[A-Z][a-z]?/);

            if (!elementMatch) {
                throw new Error("Invalid formula: " + formula);
            }

            const element = elementMatch[0];
            position += element.length;

            const numberMatch =
                formula.slice(position).match(/^\d+/);

            const count = numberMatch
                ? Number(numberMatch[0])
                : 1;

            if (numberMatch) {
                position += numberMatch[0].length;
            }

            group[element] = (group[element] || 0) + count;
        }

        return group;
    }

    const parsedAtoms = parseGroup();

    Object.assign(atoms, parsedAtoms);

    return { atoms, charge };
}

// GAUSSIAN ELIMINATION AND NULLSPACE

function redoxNullspace(matrix) {

    const rows = matrix.length;
    const cols = matrix[0].length;

    const a = matrix.map(row => [...row]);

    const pivots = [];

    let pivotRow = 0;

    for (let col = 0; col < cols; col++) {

        let selected = pivotRow;

        for (let r = pivotRow + 1; r < rows; r++) {
            if (Math.abs(a[r][col]) >
                Math.abs(a[selected][col])) {
                selected = r;
            }
        }

        if (Math.abs(a[selected][col]) < 1e-10) {
            continue;
        }

        [a[pivotRow], a[selected]] =
            [a[selected], a[pivotRow]];

        const divisor = a[pivotRow][col];

        for (let c = col; c < cols; c++) {
            a[pivotRow][c] /= divisor;
        }

        for (let r = 0; r < rows; r++) {

            if (r === pivotRow) continue;

            const factor = a[r][col];

            for (let c = col; c < cols; c++) {
                a[r][c] -= factor * a[pivotRow][c];
            }
        }

        pivots.push(col);
        pivotRow++;
    }

    const freeColumns = [];

    for (let c = 0; c < cols; c++) {
        if (!pivots.includes(c)) {
            freeColumns.push(c);
        }
    }

    if (freeColumns.length !== 1) {
        throw new Error(
            "This reaction has an ambiguous or unsupported balancing system."
        );
    }

    const solution = Array(cols).fill(0);

    const freeColumn = freeColumns[0];

    solution[freeColumn] = 1;

    for (let r = pivots.length - 1; r >= 0; r--) {

        const pivot = pivots[r];

        let sum = 0;

        for (let c = pivot + 1; c < cols; c++) {
            sum += a[r][c] * solution[c];
        }

        solution[pivot] = -sum;
    }

    return solution;
}

// CONVERT DECIMAL COEFFICIENTS TO INTEGERS

function redoxGCD(a, b) {

    a = Math.abs(Math.round(a));
    b = Math.abs(Math.round(b));

    while (b) {
        const remainder = a % b;
        a = b;
        b = remainder;
    }

    return a || 1;
}

function redoxLCM(a, b) {
    return Math.abs(a * b) / redoxGCD(a, b);
}

function redoxIntegerCoefficients(values) {

    const denominator = 1000000;

    const integers = values.map(value =>
        Math.round(value * denominator)
    );

    let divisor = integers[0];

    for (let i = 1; i < integers.length; i++) {
        divisor = redoxGCD(divisor, integers[i]);
    }

    return integers.map(value => value / divisor);
}

// MAIN REDOX BALANCER

function balanceRedoxEquation() {

    const equationInput =
        document.getElementById("redoxEquation").value.trim();

    const medium =
        document.getElementById("redoxMedium").value;

    const result =
        document.getElementById("redoxResult");

    const working =
        document.getElementById("redoxWorking");

    try {

        if (!equationInput.includes("->")) {
            throw new Error("Use -> to separate reactants and products.");
        }

        const sides = equationInput.split("->");

        if (sides.length !== 2) {
            throw new Error("Enter one reaction arrow only.");
        }

        const reactants = sides[0].split("+").map(x => x.trim());
        const products = sides[1].split("+").map(x => x.trim());

        if ([...reactants, ...products].some(x => !x)) {
            throw new Error("Check your reaction formulae.");
        }

        const species = [...reactants, ...products];

        const parsed = species.map(parseRedoxSpecies);

        const auxiliary = medium === "acidic"
            ? ["H2O", "H+"]
            : ["H2O", "OH-"];

        const allSpecies = [
            ...parsed,
            ...auxiliary.map(parseRedoxSpecies)
        ];

        const elements = [
            ...new Set(
                allSpecies.flatMap(item => Object.keys(item.atoms))
            )
        ];

        const matrix = [];

        elements.forEach(element => {

            const row = allSpecies.map((item, index) => {

                let value = item.atoms[element] || 0;

                if (index >= reactants.length) {
                    value *= -1;
                }

                return value;
            });

            matrix.push(row);
        });

        // Charge conservation
        matrix.push(
            allSpecies.map((item, index) =>
                index >= reactants.length
                    ? -item.charge
                    : item.charge
            )
        );

        const solution = redoxNullspace(matrix);

        // Orient coefficients so reactants are positive
        let direction = solution[0] > 0 ? 1 : -1;

        const oriented = solution.map(value => value * direction);

        // Original reactants must be positive
        for (let i = 0; i < reactants.length; i++) {
            if (oriented[i] <= 1e-8) {
                throw new Error(
                    "The equation could not be balanced in the given direction."
                );
            }
        }

        // Original products must be negative in the signed matrix
        for (let i = reactants.length; i < species.length; i++) {
            if (oriented[i] >= -1e-8) {
                throw new Error(
                    "The equation could not be balanced in the given direction."
                );
            }
        }

        const originalCoefficients =
            redoxIntegerCoefficients(
                oriented.slice(0, species.length)
                    .map((value, index) =>
                        index >= reactants.length ? -value : value
                    )
            );

        const auxiliaryCoefficients =
            oriented.slice(species.length).map(value => -value);

        const coefficientMap = new Map();

        species.forEach((formula, index) => {
            coefficientMap.set(
                index,
                originalCoefficients[index]
            );
        });

        const formatSide = (items, offset) =>
            items.map((formula, index) => {
                const coefficient =
                    coefficientMap.get(offset + index);

                return (coefficient === 1 ? "" : coefficient) +
                    formula;
            }).join(" + ");

        let balancedReactants = reactants.map((formula, index) => ({
            formula,
            coefficient: originalCoefficients[index]
        }));

        let balancedProducts = products.map((formula, index) => ({
            formula,
            coefficient: originalCoefficients[reactants.length + index]
        }));

        // Add auxiliary species to the appropriate side
        auxiliary.forEach((formula, index) => {

            const coefficient = auxiliaryCoefficients[index];

            if (Math.abs(coefficient) < 1e-8) return;

            const item = {
                formula,
                coefficient: Math.abs(
                    redoxIntegerCoefficients([coefficient])[0]
                )
            };

            if (coefficient > 0) {
                balancedReactants.push(item);
            } else {
                balancedProducts.push(item);
            }
        });

        function renderItems(items) {
            return items.map(item =>
                (item.coefficient === 1 ? "" : item.coefficient) +
                item.formula
            ).join(" + ");
        }

        const balancedEquation =
            renderItems(balancedReactants) +
            " → " +
            renderItems(balancedProducts);

        // Verify conservation of atoms and charge
        const verification = {};

        elements.forEach(element => {
            let left = 0;
            let right = 0;

            balancedReactants.forEach(item => {
                const data = parseRedoxSpecies(item.formula);
                left += (data.atoms[element] || 0) * item.coefficient;
            });

            balancedProducts.forEach(item => {
                const data = parseRedoxSpecies(item.formula);
                right += (data.atoms[element] || 0) * item.coefficient;
            });

            verification[element] = { left, right };

            if (left !== right) {
                throw new Error(
                    "Atom conservation verification failed for " + element
                );
            }
        });

        let leftCharge = 0;
        let rightCharge = 0;

        balancedReactants.forEach(item => {
            leftCharge += parseRedoxSpecies(item.formula).charge *
                item.coefficient;
        });

        balancedProducts.forEach(item => {
            rightCharge += parseRedoxSpecies(item.formula).charge *
                item.coefficient;
        });

        if (leftCharge !== rightCharge) {
            throw new Error("Electrical charge verification failed.");
        }

        result.innerHTML = `
            <h4>Balanced Redox Equation</h4>
            <p><strong>${balancedEquation}</strong></p>
            <p>Medium: ${medium.toUpperCase()}</p>
            <p>Charge conservation: VERIFIED</p>
            <p>Atom conservation: VERIFIED</p>
        `;

        working.innerHTML = `
            <h4>Verification Report</h4>
            ${Object.entries(verification).map(([element, values]) => `
                <p>${element}: Reactants = ${values.left},
                Products = ${values.right} ✓</p>
            `).join("")}
            <p>Total charge on reactants: ${leftCharge}</p>
            <p>Total charge on products: ${rightCharge}</p>
            <p><strong>Redox balancing verification successful.</strong></p>
        `;

        recordCalculation();

    } catch (error) {

        result.innerHTML = `
            <p>Unable to balance this equation.</p>
            <p>${error.message}</p>
        `;

        working.innerHTML = "";
    }
}

// ADVANCED STOICHIOMETRY CALCULATOR

function calculateStoichiometry() {

    const getValue = id =>
        Number(document.getElementById(id).value);

    const mass1 = getValue("reactantOneMass");
    const molarMass1 = getValue("reactantOneMolarMass");
    const coefficient1 = getValue("reactantOneCoefficient");

    const mass2 = getValue("reactantTwoMass");
    const molarMass2 = getValue("reactantTwoMolarMass");
    const coefficient2 = getValue("reactantTwoCoefficient");

    const productCoefficient = getValue("productCoefficient");
    const productMolarMass = getValue("productMolarMass");

    const actualYieldInput =
        document.getElementById("actualYield").value.trim();

    const actualYield = actualYieldInput === ""
        ? null
        : Number(actualYieldInput);

    const result =
        document.getElementById("stoichiometryResult");

    const working =
        document.getElementById("stoichiometryWorking");

    try {

        // INPUT VALIDATION

        const requiredValues = [
            mass1, molarMass1, coefficient1,
            mass2, molarMass2, coefficient2,
            productCoefficient, productMolarMass
        ];

        if (!requiredValues.every(value =>
            Number.isFinite(value) && value > 0
        )) {
            throw new Error(
                "Enter valid positive values in all required fields."
            );
        }

        if (actualYield !== null &&
            (!Number.isFinite(actualYield) || actualYield < 0)) {
            throw new Error(
                "Actual yield must be a valid non-negative number."
            );
        }

        // STEP 1: CALCULATE INITIAL MOLES

        const moles1 = mass1 / molarMass1;
        const moles2 = mass2 / molarMass2;

        // STEP 2: DETERMINE LIMITING REAGENT

        const ratio1 = moles1 / coefficient1;
        const ratio2 = moles2 / coefficient2;

        const isStoichiometric =
    Math.abs(ratio1 - ratio2) < 1e-10;

const limitingReagent = isStoichiometric
    ? "Neither (stoichiometric mixture)"
    : ratio1 < ratio2
        ? "Reactant 1"
        : "Reactant 2";

        const reactionExtent = Math.min(ratio1, ratio2);

        // STEP 3: CALCULATE THEORETICAL PRODUCT

        const productMoles =
            reactionExtent * productCoefficient;

        const theoreticalYield =
            productMoles * productMolarMass;

        // STEP 4: CALCULATE EXCESS REAGENT

        const remainingMoles1 =
            moles1 - reactionExtent * coefficient1;

        const remainingMoles2 =
            moles2 - reactionExtent * coefficient2;

        const remainingMass1 =
            Math.max(0, remainingMoles1) * molarMass1;

        const remainingMass2 =
            Math.max(0, remainingMoles2) * molarMass2;

        const excessReagent = isStoichiometric
    ? "None"
    : limitingReagent === "Reactant 1"
        ? "Reactant 2"
        : "Reactant 1";

        const excessRemaining = isStoichiometric
    ? 0
    : limitingReagent === "Reactant 1"
        ? remainingMass2
        : remainingMass1;

        // STEP 5: PERCENTAGE YIELD

        let percentageYield = null;

        if (actualYield !== null) {

            if (theoreticalYield <= 0) {
                throw new Error("Theoretical yield must be positive.");
            }

            percentageYield =
                (actualYield / theoreticalYield) * 100;
        }

        // DISPLAY RESULTS

        result.innerHTML = `
            <h4>Stoichiometry Results</h4>

            <p><strong>Limiting reagent:</strong>
            ${limitingReagent}</p>

            <p><strong>Excess reagent:</strong>
            ${excessReagent}</p>

            <p><strong>Excess reagent remaining:</strong>
            ${excessRemaining.toFixed(4)} g</p>

            <p><strong>Theoretical product yield:</strong>
            ${theoreticalYield.toFixed(4)} g</p>

            <p><strong>Product moles:</strong>
            ${productMoles.toFixed(5)} mol</p>

            ${
                percentageYield !== null
                ? `<p><strong>Percentage yield:</strong>
                ${percentageYield.toFixed(2)}%</p>`
                : `<p>Enter actual yield to calculate percentage yield.</p>`
            }
        `;

        // DISPLAY STEP-BY-STEP WORKING

        working.innerHTML = `
            <h4>Detailed Calculations</h4>

            <p><strong>Step 1: Calculate moles of Reactant 1</strong></p>

            <p>n = Mass / Molar mass</p>

            <p>n = ${mass1} / ${molarMass1}</p>

            <p>n = ${moles1.toFixed(5)} mol</p>

            <p><strong>Step 2: Calculate moles of Reactant 2</strong></p>

            <p>n = ${mass2} / ${molarMass2}</p>

            <p>n = ${moles2.toFixed(5)} mol</p>

            <p><strong>Step 3: Determine limiting reagent</strong></p>

            <p>Reactant 1 ratio = ${moles1.toFixed(5)} / ${coefficient1}
            = ${ratio1.toFixed(5)}</p>

            <p>Reactant 2 ratio = ${moles2.toFixed(5)} / ${coefficient2}
            = ${ratio2.toFixed(5)}</p>

            <p>${limitingReagent} is the limiting reagent because
            it has the smaller mole-to-coefficient ratio.</p>

            <p><strong>Step 4: Calculate theoretical product</strong></p>

            <p>Product moles = ${reactionExtent.toFixed(5)}
            × ${productCoefficient}</p>

            <p>Product moles = ${productMoles.toFixed(5)} mol</p>

            <p>Mass = Moles × Molar mass</p>

            <p>Mass = ${productMoles.toFixed(5)}
            × ${productMolarMass}</p>

            <p>Theoretical yield = ${theoreticalYield.toFixed(4)} g</p>

            <p><strong>Step 5: Excess reagent remaining</strong></p>

            <p>${excessReagent} remaining =
            ${excessRemaining.toFixed(4)} g</p>

            ${
                percentageYield !== null
                ? `
                    <p><strong>Step 6: Percentage yield</strong></p>

                    <p>% Yield = (Actual yield / Theoretical yield) × 100</p>

                    <p>% Yield = (${actualYield} / ${theoreticalYield.toFixed(4)}) × 100</p>

                    <p>Percentage yield = ${percentageYield.toFixed(2)}%</p>
                `
                : ""
            }

            <p><strong>Calculation completed successfully.</strong></p>
        `;

        recordCalculation();

    } catch (error) {

        result.innerHTML = `
            <p><strong>Calculation error:</strong></p>
            <p>${error.message}</p>
        `;

        working.innerHTML = "";
    }
}

// ========================================
// ADVANCED GAS LAWS CALCULATOR
// ========================================

const gasLawDefinitions = {
    boyle: {
        name: "Boyle's Law",
        variables: [
            ["P1", "Initial Pressure (atm)"],
            ["V1", "Initial Volume (L)"],
            ["P2", "Final Pressure (atm)"],
            ["V2", "Final Volume (L)"]
        ]
    },
    charles: {
        name: "Charles's Law",
        variables: [
            ["V1", "Initial Volume (L)"],
            ["T1", "Initial Temperature (°C)"],
            ["V2", "Final Volume (L)"],
            ["T2", "Final Temperature (°C)"]
        ]
    },
    gay: {
        name: "Gay-Lussac's Law",
        variables: [
            ["P1", "Initial Pressure (atm)"],
            ["T1", "Initial Temperature (°C)"],
            ["P2", "Final Pressure (atm)"],
            ["T2", "Final Temperature (°C)"]
        ]
    },
    avogadro: {
        name: "Avogadro's Law",
        variables: [
            ["V1", "Initial Volume (L)"],
            ["n1", "Initial Amount (mol)"],
            ["V2", "Final Volume (L)"],
            ["n2", "Final Amount (mol)"]
        ]
    },
    combined: {
        name: "Combined Gas Law",
        variables: [
            ["P1", "Initial Pressure (atm)"],
            ["V1", "Initial Volume (L)"],
            ["T1", "Initial Temperature (°C)"],
            ["P2", "Final Pressure (atm)"],
            ["V2", "Final Volume (L)"],
            ["T2", "Final Temperature (°C)"]
        ]
    },
    ideal: {
        name: "Ideal Gas Law",
        variables: [
            ["P", "Pressure (atm)"],
            ["V", "Volume (L)"],
            ["n", "Amount of Gas (mol)"],
            ["T", "Temperature (°C)"]
        ]
    }
};

const gasConstant = 0.082057;

function getSelectedGasLaw() {
    const selector = document.getElementById("gasLawType");
    const selectedOption =
        selector.options[selector.selectedIndex];

    const value = (
        selector.value + " " + selectedOption.textContent
    ).toLowerCase();

    if (value.includes("boyle")) return "boyle";
    if (value.includes("charles")) return "charles";
    if (value.includes("gay")) return "gay";
    if (value.includes("avogadro")) return "avogadro";
    if (value.includes("combined")) return "combined";
    if (value.includes("ideal")) return "ideal";

    return null;
}

function updateGasLawInputs() {
    const law = getSelectedGasLaw();
    const container = document.getElementById("gasLawInputs");
    const result = document.getElementById("gasLawResult");

    result.textContent = "";

    if (!law) {
        container.innerHTML =
            "<p>Please select a supported gas law.</p>";
        return;
    }

    const variables = gasLawDefinitions[law].variables;

    container.innerHTML = `
        <div style="grid-column:1/-1">
            <label for="gasUnknown">Select unknown variable</label>
            <select id="gasUnknown">
                ${variables.map(([key, label]) =>
                    `<option value="${key}">${label}</option>`
                ).join("")}
            </select>
        </div>

        ${variables.map(([key, label]) => `
            <div>
                <label for="gas_${key}">${label}</label>
                <input
                    type="number"
                    id="gas_${key}"
                    step="any"
                    placeholder="Enter ${key}"
                >
            </div>
        `).join("")}
    `;

    document.getElementById("gasUnknown")
        .addEventListener("change", () => {
            variables.forEach(([key]) => {
                const input = document.getElementById("gas_" + key);
                input.disabled =
                    key === document.getElementById("gasUnknown").value;
                input.value = "";
            });
        });

    document.getElementById("gasUnknown").dispatchEvent(
        new Event("change")
    );
}

function calculateGasLaw() {
    const law = getSelectedGasLaw();
    const result = document.getElementById("gasLawResult");
    const working = document.getElementById("gasLawWorking");

    if (!law) {
        result.textContent = "Please select a valid gas law.";
        return;
    }

    const variables = gasLawDefinitions[law].variables;
    const unknown = document.getElementById("gasUnknown").value;
    const values = {};

    for (const [key, label] of variables) {
        if (key === unknown) continue;

        const input = document.getElementById("gas_" + key);
        const value = Number(input.value);

        if (input.value.trim() === "" || !Number.isFinite(value)) {
            result.textContent = `Enter a valid value for ${label}.`;
            return;
        }

        if (key.startsWith("T")) {
            if (value <= -273.15) {
                result.textContent =
                    "Temperature must be above absolute zero.";
                return;
            }
            values[key] = value + 273.15;
        } else {
            if (value <= 0) {
                result.textContent =
                    `${label} must be greater than zero.`;
                return;
            }
            values[key] = value;
        }
    }

    let answer;

    switch (law) {
        case "boyle":
            answer = unknown === "P1"
                ? values.P2 * values.V2 / values.V1
                : unknown === "V1"
                ? values.P2 * values.V2 / values.P1
                : unknown === "P2"
                ? values.P1 * values.V1 / values.V2
                : values.P1 * values.V1 / values.P2;
            break;

        case "charles":
            answer = unknown === "V1"
                ? values.V2 * values.T1 / values.T2
                : unknown === "T1"
                ? values.V1 * values.T2 / values.V2
                : unknown === "V2"
                ? values.V1 * values.T2 / values.T1
                : values.V2 * values.T1 / values.V1;
            break;

        case "gay":
            answer = unknown === "P1"
                ? values.P2 * values.T1 / values.T2
                : unknown === "T1"
                ? values.P1 * values.T2 / values.P2
                : unknown === "P2"
                ? values.P1 * values.T2 / values.T1
                : values.T2 * values.P1 / values.P2;
            break;

        case "avogadro":
            answer = unknown === "V1"
                ? values.V2 * values.n1 / values.n2
                : unknown === "n1"
                ? values.n2 * values.V1 / values.V2
                : unknown === "V2"
                ? values.V1 * values.n2 / values.n1
                : values.n1 * values.V2 / values.V1;
            break;

        case "combined":
            answer = unknown === "P1"
                ? values.P2 * values.V2 * values.T1 /
                    (values.T2 * values.V1)
                : unknown === "V1"
                ? values.P2 * values.V2 * values.T1 /
                    (values.P1 * values.T2)
                : unknown === "T1"
                ? values.P1 * values.V1 * values.T2 /
                    (values.P2 * values.V2)
                : unknown === "P2"
                ? values.P1 * values.V1 * values.T2 /
                    (values.V2 * values.T1)
                : unknown === "V2"
                ? values.P1 * values.V1 * values.T2 /
                    (values.P2 * values.T1)
                : values.P2 * values.V2 * values.T1 /
                    (values.P1 * values.V1);
            break;

        case "ideal":
            answer = unknown === "P"
                ? values.n * gasConstant * values.T / values.V
                : unknown === "V"
                ? values.n * gasConstant * values.T / values.P
                : unknown === "n"
                ? values.P * values.V / (gasConstant * values.T)
                : values.P * values.V / (values.n * gasConstant);
            break;
    }

    if (!Number.isFinite(answer) || answer <= 0) {
        result.textContent =
            "Calculation failed. Check your input values.";
        return;
    }

    const units = {
        P: "atm",
        P1: "atm",
        P2: "atm",
        V: "L",
        V1: "L",
        V2: "L",
        n: "mol",
        n1: "mol",
        n2: "mol",
        T: "°C",
        T1: "°C",
        T2: "°C"
    };

    const finalAnswer = unknown.startsWith("T")
        ? answer - 273.15
        : answer;

    result.innerHTML = `
        <h3>Calculated Result</h3>
        <strong>${unknown} = ${finalAnswer.toFixed(4)} ${units[unknown]}</strong>
    `;

    working.innerHTML = `
        <h4>${gasLawDefinitions[law].name}</h4>
        <p>Unknown variable: ${unknown}</p>
        <p>Gas constant used for the ideal gas law:
        R = ${gasConstant} L·atm·mol⁻¹·K⁻¹</p>
        <p>Temperatures were converted to Kelvin before calculation.</p>
        <p>Final answer: ${finalAnswer.toFixed(4)} ${units[unknown]}</p>
    `;

    if (typeof recordCalculation === "function") {
        recordCalculation();
    }
}

// Initialize the calculator
document.getElementById("gasLawType")
    .addEventListener("change", updateGasLawInputs);

updateGasLawInputs();

