// ==UserScript==
// @name         jakdojadeNotifications
// @namespace    *.jakdojade.pl
// @version      0.1
// @description  jakdojade.pl desktop notifications
// @author       Damian Kęska
// @match        *.jakdojade.pl/*
// @grant        none
// ==/UserScript==

window.jakdojade_userScripts_lastTimerValue = '';

window.jakdojade_userScripts_checkTimer = function ()
{
    if (!document.getElementsByTagName('title').length)
        return false;
    
    currentTitle = document.getElementsByTagName('title')[0].innerHTML;
    
    if (window.jakdojade_userScripts_lastTimerValue != currentTitle)
    {
        window.jakdojade_userScripts_lastTimerValue = currentTitle;
        
        tmp = currentTitle.match(/([0-9]+) minut/g);
        
        if (tmp)
        {
        } else {
            tmp = currentTitle.match(/[0-9]{2}:[0-9]{2}/i);
        }
        
        if (currentTitle.indexOf('do odjazdu') > 0)
        {
            sendNotification('jakdojade.pl', currentTitle);
        }
    }
}


function sendNotification(title, message) 
{
    if (!Notification) 
    {
        alert('Please us a modern version of Chrome, Firefox, Opera or Firefox.');
        return;
    }

    if (Notification.permission !== "granted")
        Notification.requestPermission();

    var notification = new Notification(title, {
        icon: 'http://wroclaw.jakdojade.pl/img/favicon.ico',
        body: message
    });


  //notification.onclick = function () {
  //  window.open("");
  //}
}

window.setInterval('window.jakdojade_userScripts_checkTimer();', 15000);
