// ==UserScript==
// @name         jakdojadeNotifications
// @namespace    *.jakdojade.pl
// @version      0.1
// @description  jakdojade.pl desktop notifications
// @author       Damian Kęska
// @match        *.jakdojade.pl/*
// @grant        none
// @require      http://code.jquery.com/jquery-latest.js
// ==/UserScript==

window.jakdojade_userScripts_lastTimerData = '';
window.jakdojade_userScripts_lastTimerValue = 0;

window.jakdojade_userScripts_checkTimer = function ()
{
    if (!document.getElementsByTagName('title').length)
        return false;
    
    currentTitle = document.getElementsByTagName('title')[0].innerHTML;
    
    if (window.jakdojade_userScripts_lastTimerData != currentTitle)
    {
        window.jakdojade_userScripts_lastTimerData = currentTitle;
        
        if (currentTitle.indexOf('do odjazdu') > 0 || currentTitle.indexOf('do wyjścia') > 0)
        {
            re = /([0-9]+) min/g; 
            tmp = re.exec(currentTitle);
            time = 0;

            if (tmp)
            {
                time = (tmp[1] * 60);
            } else {
                re = /([0-9]+) do /g; 
                tmp = re.exec(currentTitle);

                if (tmp)
                {
                    time = (tmp[1] * 60).split(':');
                    time = ((time[0] * 3600) + (time[1] + 60));
                }
            }
            
            console.log('[jakdojade-notify] Time to leave: ' + time);

            maxNotificationInterval = 60;
            diff = (window.jakdojade_userScripts_lastTimerValue - time);
            
            // if switching to other connection
            if (diff < 0)
            {
                window.jakdojade_userScripts_lastTimerValue = time;
                diff = 0;
            }

            if (time >= 3600) // 1h
                maxNotificationInterval = 900; // 15 minutes
            else if (time >= 2400) // 40 min
                maxNotificationInterval = 600;
            else if (time >= 600) // 10 min
                maxNotificationInterval = 300;
            
            maxNotificationInterval -= 1;
            console.log('[jakdojade-notify] Diff: ' + diff);
            console.log('[jakdojade-notify] maxNotificationInterval: ' + maxNotificationInterval);

            if (diff > maxNotificationInterval || !window.jakdojade_userScripts_lastTimerValue)
            {
                window.jakdojade_userScripts_lastTimerValue = time;
                
                // notification title: bus/train name + destination bus stop
                if (jQuery('.tripHeaderSelected .GOQMLGODT').length)
                {
                    console.log('[jakdojade-notify] It\'s possible to fetch additional informations');
                    
                    notificationTitle = 'Wyjście na linię ' +jQuery('.tripHeaderSelected .GOQMLGODT').html();
                    
                    if (jQuery(jQuery('.gwt-SuggestBox')[1]).length)
                    {
                        notificationTitle += ', cel końcowy podróży: ' +jQuery(jQuery('.gwt-SuggestBox')[1]).val();
                    }
                }
                
                console.log('[jakdojade-notify] Sending a notification');
                
                sendNotification(notificationTitle, currentTitle);
            }
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

jQuery(document).ready(function () { 
    window.jakdojade_userScripts_checkTimer();
});
window.setInterval(window.jakdojade_userScripts_checkTimer, 10000);
