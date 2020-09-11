// ==UserScript==
// @name         Idle Momentum Automation v0
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       Nokdu
// @match        https://idlemomentum.com/
// @grant        none
// @require      http://code.jquery.com/jquery-latest.js
// ==/UserScript==

(function () {
    'use strict';

    // Your code here...

    $('body').append('<input type="button" value="Start Bot" id="start-bot">')
    $("#start-bot").css("position", "fixed").css("top", 0).css("left", 0);
    $('#start-bot').click(function () { startBot() });
    $('body').append('<input type="button" value="Stop Bot" id="stop-bot">')
    $("#stop-bot").css("position", "fixed").css("top", 0).css("right", 0);
    $('#stop-bot').click(function () { stopBot(); });
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function processMileStones() {
        var jq = $;
        // open footer tab if you have a milestone
        if (jq('#app > div > div > div.game-footer > div.footer-tabs > div:nth-child(1) > div')[0] != undefined) {
            //console.log('probably has a milestone waiting');
            jq('#app > div > div > div.game-footer > div.footer-tabs > div:nth-child(1) > h4').click()
            await sleep(1000);
            if (jq('#app > div > div > div.game-footer > div.panel-container > div:nth-child(1) > div.popup.milestones.large-close.sticky-header > div.header.expand > h2 > button > span') != undefined) {
                //console.log('clicking claim all');
                // clicking claim all
                jq('#app > div > div > div.game-footer > div.panel-container > div:nth-child(1) > div.popup.milestones.large-close.sticky-header > div.header.expand > h2 > button > span').click();
                await sleep(1000);
                // close reward cards
                jq('#close-reward-cards').click();
                await sleep(1000);
                // close MileStone WIndow
                jq('#app > div > div > div.game-footer > div.panel-container > div:nth-child(1) > div.popup.milestones.large-close.sticky-header > div.header.expand > a')[0].click()
            }
        }
    }

    function processMinorPrestige() {
        for (var i = 0; i < 5; ++i) {
            var idx = i + 1;
            var str = '#minor-prestige-' + idx;
            if ($(str) != undefined) {
                $(str).click()
            }
        }
    }

    function processMajorPrestige() {
        if ($('#major-prestige') != undefined) {
            $('#major-prestige').click();
        }
    }

    function clickMaxall() {
        var needsClicking = 0;
        for (var i = 0; i < 5; ++i) {
            var idx = i + 1;
            var str = '#occupation-' + idx + ' > div.occupation-header-info > div.bubble.teal';
            //console.log(str);
            //console.log($(str));
            if ($(str) != undefined) {
                needsClicking = 1;
                break;
            }
        }
        if (needsClicking != 0) {
            //console.log('needs clicking')
            $('#max-all').click();
        }
    }

    function buyFirstOfLast() {
        for (var i = 1; i <= 5; ++i) {
            // loop occupation
            for (var j = 10; j >= 1; +--j) {
                var q = $('#occupation-' + i + ' > div.resources-wrapper > div > div:nth-child(' + j + ') > div > div.flex.mb-2 > div.details.flex-1 > div.info.mb-1.flex > h5')[0];
                if (q != undefined && q.innerHTML < 10) {
                    var q2 = $('#resource-' + i + '-' + j + '-purchase > span')[0];
                    if (q2 != undefined && !q2.innerHTML.trim().startsWith('Can')) {
                        q2.click();
                    }
                }
            }
        }
    }

    var MileStoneTimer, NonAsyncTimers;
    var started = 0;
    function startBot() {
        if (started != 0) return;
        MileStoneTimer = setInterval(async () => {
            await processMileStones();
        }, 5000);
        NonAsyncTimers = setInterval(() => {
            processMajorPrestige();
            processMinorPrestige();
            buyFirstOfLast();
            clickMaxall();
        }, 300);
        started = 1;
    }

    function stopBot() {
        clearInterval(MileStoneTimer);
        clearInterval(NonAsyncTimers);
        started = 0;
    }


})();