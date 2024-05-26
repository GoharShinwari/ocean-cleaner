let cleanPointsPerClick = 1;
let cpsInterval;
let cleanPoints = parseFloat(localStorage.getItem('cleanPoints')) || 0;
let perSecond = parseFloat(localStorage.getItem('perSecond')) || 0;
let username = localStorage.getItem('username');

const cleanButton = document.getElementById("clean-button");
const cleanPointsDisplay = document.getElementById("clean-points");
const upgradeButtons = document.querySelectorAll(".upgrade-button");
const shopButtons = document.querySelectorAll(".shop-button");
const perSecondDisplay = document.getElementById("per-second");

function updateCleanPoints() {
    cleanPoints += cleanPointsPerClick;
    cleanPointsDisplay.textContent = cleanPoints.toLocaleString(undefined, { maximumFractionDigits: 2 });
    checkUpgradeVisibility();
    checkShopVisibility();
    saveData();
}

function purchaseUpgrade(button) {
    const baseCost = parseInt(button.getAttribute('data-base-cost'));
    const multiplier = parseFloat(button.getAttribute('data-multiplier'));
    let purchased = parseInt(button.getAttribute('data-purchased'));
    const currentCost = baseCost * Math.pow(multiplier, purchased);

    if (cleanPoints >= currentCost) {
        cleanPoints -= currentCost;
        purchased += 1;
        const newCost = baseCost * Math.pow(multiplier, purchased);
        button.setAttribute('data-purchased', purchased);
        const upgradeName = button.textContent.split('(')[0].trim();
        button.textContent = `${upgradeName} (Cost: ${newCost.toLocaleString(undefined, { maximumFractionDigits: 2 })} CP) (Owned: ${purchased.toLocaleString()})`;
        cleanPointsDisplay.textContent = cleanPoints.toLocaleString(undefined, { maximumFractionDigits: 2 });
        saveData();
        reloadUpgrades();
    }
}

function purchaseCursor(button) {
    const baseCost = parseInt(button.getAttribute('data-base-cost'));
    const multiplier = parseInt(button.getAttribute('data-multiplier'));
    const purchaseId = button.getAttribute('data-upgrade-id');

    if (cleanPoints >= baseCost) {
        cleanPoints -= baseCost;
        cleanPointsPerClick *= multiplier;

        localStorage.setItem(purchaseId, 'true');
        button.style.display = 'none';

        cleanPointsDisplay.textContent = cleanPoints.toLocaleString(undefined, { maximumFractionDigits: 2 });
        saveData();
    }
}


// code this so when upgrades are bought, they only effect their specific cps building.
// 2x for tidal wave will only effect tidal and nothing else
function purchaseBetterUpgrades(button) {
    
}

function checkShopVisibility() {
    shopButtons.forEach(button => {
        const baseCost = parseInt(button.getAttribute('data-base-cost'));
        const threshold = baseCost * 0.3;
        const purchaseId = button.getAttribute('data-upgrade-id');
        const hasBought = localStorage.getItem(purchaseId) === 'true';

        if (cleanPoints >= threshold && !hasBought) {
            button.style.display = 'inline-block';
        } else {
            button.style.display = 'none';
        }
    });
}

function checkUpgradeVisibility() {
    upgradeButtons.forEach(button => {
        const baseCost = parseInt(button.getAttribute('data-base-cost'));
        const threshold = baseCost * 0.3;

        if (cleanPoints >= threshold || parseInt(button.getAttribute('data-purchased')) > 0) {
            button.style.display = 'inline-block';
        } else {
            button.style.display = 'none';
        }
    });
}

function reloadUpgrades() {
    checkUpgradeVisibility();
}

upgradeButtons.forEach(button => {
    button.addEventListener('click', () => {
        purchaseUpgrade(button);
    });
});

shopButtons.forEach(button => {
    button.addEventListener('click', () => {
        purchaseCursor(button);
    });
});

cleanButton.addEventListener('click', updateCleanPoints);

function startCPS() {
    cpsInterval = setInterval(() => {
        let totalCPS = 0;
        upgradeButtons.forEach(button => {
            const baseCPS = parseFloat(button.getAttribute('data-base-cps'));
            const purchased = parseInt(button.getAttribute('data-purchased'));
            totalCPS += baseCPS * purchased;
        });
        cleanPoints += totalCPS;
        perSecond = totalCPS;
        cleanPointsDisplay.textContent = cleanPoints.toLocaleString(undefined, { maximumFractionDigits: 2 });
        perSecondDisplay.textContent = perSecond.toLocaleString(undefined, { maximumFractionDigits: 2 });
        saveData();
        checkUpgradeVisibility();
        checkShopVisibility();
    }, 1000);
}

function saveData() {
    localStorage.setItem('cleanPoints', cleanPoints.toFixed(2));
    localStorage.setItem('perSecond', perSecond.toFixed(2));
    localStorage.setItem('cleanPointsPerClick', cleanPointsPerClick);

    upgradeButtons.forEach(button => {
        const upgradeId = button.getAttribute('data-upgrade-id');
        const purchased = parseInt(button.getAttribute('data-purchased'));
        localStorage.setItem(upgradeId, purchased);
    });

    shopButtons.forEach(button => {
        const purchaseId = button.getAttribute('data-upgrade-id');
        const hasBought = localStorage.getItem(purchaseId) === 'true';
        localStorage.setItem(purchaseId, hasBought);
    });
}

function loadData() {
    cleanPoints = parseFloat(localStorage.getItem('cleanPoints')) || 0;
    perSecond = parseFloat(localStorage.getItem('perSecond')) || 0;
    cleanPointsPerClick = parseFloat(localStorage.getItem('cleanPointsPerClick')) || 1;

    cleanPointsDisplay.textContent = cleanPoints.toLocaleString(undefined, { maximumFractionDigits: 2 });
    perSecondDisplay.textContent = perSecond.toLocaleString(undefined, { maximumFractionDigits: 2 });

    upgradeButtons.forEach(button => {
        const upgradeId = button.getAttribute('data-upgrade-id');
        const purchased = parseInt(localStorage.getItem(upgradeId)) || 0;
        button.setAttribute('data-purchased', purchased);

        const baseCost = parseInt(button.getAttribute('data-base-cost'));
        const multiplier = parseFloat(button.getAttribute('data-multiplier'));
        const currentCost = baseCost * Math.pow(multiplier, purchased);

        const upgradeName = button.textContent.split('(')[0].trim();
        button.textContent = `${upgradeName} (Cost: ${currentCost.toLocaleString(undefined, { maximumFractionDigits: 2 })} CP) (Owned: ${purchased.toLocaleString()})`;
    });

    shopButtons.forEach(button => {
        const purchaseId = button.getAttribute('data-upgrade-id');
        const hasBought = localStorage.getItem(purchaseId) === 'true';
        if (hasBought) {
            button.style.display = 'none';
        }
    });

    checkUpgradeVisibility();
    checkShopVisibility();
}

loadData();
startCPS();
