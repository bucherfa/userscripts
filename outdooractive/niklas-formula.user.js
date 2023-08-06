// ==UserScript==
// @name         Niklas-Formula
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  calculate duration time for hiking
// @author       You
// @match        https://www.outdooractive.com/en/routeplanner/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=outdooractive.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    const wrapperElement = document.createElement('div');
    wrapperElement.style = 'position: absolute; bottom: 1rem; right: 1rem; background: white; display: flex; flex-direction: column; text-align: right;';
    const resultElement = document.createElement('span');
    const buttonElement = document.createElement('button');
    buttonElement.textContent = 'calculate';
    wrapperElement.append(resultElement);
    wrapperElement.append(buttonElement);
    document.body.append(wrapperElement);

    function calculateTime(distance, ascent, descent) {
        const distanceTime = distance / 3; // 1 h Gehzeit  ≙   3 km in der Ebene
        const ascentTime = ascent / 300; // 1 h Gehzeit  ≙  300 hm Aufstieg
        const descentTime = descent / 600; // 1 h Gehzeit  ≙  600 hm Abstieg

        const ascentDescentTimeSum = ascentTime + descentTime;
        console.info('distanceTime:', distanceTime, 'ascentTime:', ascentTime, 'descentTime:', descentTime);
        if (ascentDescentTimeSum < distanceTime) {
            return 0.5 * ascentDescentTimeSum + distanceTime;
        } else {
            return ascentDescentTimeSum + 0.5 * distanceTime;
        }
    }

    buttonElement.addEventListener('click', () => {
        const distanceString = document.querySelector('.oax-teg-length').textContent;
        let distance = parseFloat(distanceString); // in km
        if (!distanceString.includes('km')) {
            distance = distance / 1000;
        }
        const ascent = parseInt(document.querySelector('.oax-teg-ascent').textContent); // in hm (Höhenmetern)
        const descent = parseInt(document.querySelector('.oax-teg-descent').textContent); // in hm
        console.info('distance:', distance, 'ascent:', ascent, 'descent:', descent);
        const time = Math.round(calculateTime(distance, ascent, descent) * 100) / 100;
        resultElement.textContent = `${time} h`;
    });

    // test
    if (calculateTime(12, 600, 900) !== 5.75) {
        console.error('Example calculation not working.');
    }
})();
