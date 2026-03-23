export function mountAppDom() {
  document.body.innerHTML = `
    <select id="userSelect"></select>
    <input id="userAge" />
    <div id="pastPurchasesList"></div>
    <button id="trainModelBtn"></button>
    <button id="runRecommendationBtn" disabled></button>
    <div id="purchasesDiv"></div>
    <div id="purchasesArrow" class="bi-chevron-down"></div>
    <div id="allUsersPurchasesList" style="display: none;"></div>
    <div id="productList"></div>
  `;
}
