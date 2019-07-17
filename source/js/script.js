var mainNavigationToggle = document.querySelector(".main-navigation__toggle");
var goodsWeekOrder = document.querySelector(".goods-week__order");
var modalCart = document.querySelector(".modal-cart");
var modalOverlay = document.querySelector(".modal-overlay");
var productBuy = document.querySelectorAll(".product__buy");
var productionOrder = document.querySelector(".production__order");

//Functions for traversing all required classes --
function removeClass(selector, Class) {
    var el = document.querySelectorAll(selector);
    for (var i = 0; i < el.length; i++) {
        el[i].classList.remove(Class);
    }
}

function addClass(selector, Class) {
    var el = document.querySelectorAll(selector);
    for (var i = 0; i < el.length; i++) {
        el[i].classList.add(Class);
    }
}

//--Functions for traversing all required classes

//Remove modifier --nojs --
removeClass(".main-navigation__toggle", "main-navigation__toggle--nojs");
removeClass(".menu-list__item", "menu-list__item--nojs");
//--Remove modifier --nojs

mainNavigationToggle.addEventListener("click", function (event) {
    if (mainNavigationToggle.classList.contains("main-navigation__toggle--closed")) {
        removeClass(".main-navigation__toggle", "main-navigation__toggle--closed");
        addClass(".main-navigation__toggle", "main-navigation__toggle--opened");
        removeClass(".menu-list__item", "menu-list__item--closed");
    }
    else {
        removeClass(".main-navigation__toggle", "main-navigation__toggle--opened");
        addClass(".main-navigation__toggle", "main-navigation__toggle--closed");
        addClass(".menu-list__item", "menu-list__item--closed");
    }
});

if (goodsWeekOrder) {
    goodsWeekOrder.addEventListener("click", function (event) {
        event.preventDefault();
        modalCart.classList.remove("modal-cart--closed");
        modalOverlay.classList.remove("modal-overlay--closed");
        modalCart.classList.remove("climb");
        modalCart.classList.add("subsidence");
    });
}

if (productBuy) {
    for (var i = 0; i < productBuy.length; i++) {
        productBuy[i].addEventListener("click", function (event) {
            event.preventDefault();
            modalCart.classList.remove("modal-cart--closed");
            modalOverlay.classList.remove("modal-overlay--closed");
            modalCart.classList.remove("climb");
            modalCart.classList.add("subsidence");
        });
    }
}

if (productionOrder) {
    productionOrder.addEventListener("click", function (event) {
        event.preventDefault();
        modalCart.classList.remove("modal-cart--closed");
        modalOverlay.classList.remove("modal-overlay--closed");
        modalCart.classList.remove("climb");
        modalCart.classList.add("subsidence");
    });
}

if (modalOverlay) {
    modalOverlay.addEventListener("click", function (event) {
        event.preventDefault();
        modalCart.classList.add("climb");
        modalCart.classList.remove("subsidence");
        modalCart.classList.remove("shake");
        modalOverlay.classList.add("modal-overlay--closed");
    });
}

window.addEventListener("keydown", function (event) {
    if (!modalOverlay.classList.contains("modal-overlay--closed") && event.keyCode === 27) {
        modalCart.classList.add("climb");
        modalCart.classList.remove("subsidence");
        modalCart.classList.remove("shake");
        modalOverlay.classList.add("modal-overlay--closed");
    }
});
