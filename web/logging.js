/*
 * Build-a-Tree
 * Life on Earth Project (http://sdr.seas.harvard.edu/content/life-earth)
 *
 * Michael S. Horn
 * Northwestern University
 * michael-horn@northwestern.edu
 * Copyright 2011, Michael S. Horn
 *
 * This project was funded by the National Science Foundation (grant 1010889).
 * Any opinions, findings and conclusions or recommendations expressed in this
 * material are those of the author(s) and do not necessarily reflect the views
 * of the National Science Foundation (NSF).
 */
var log_db = null;

function supportsSessionStorage() {
   try {
      return 'localStorage' in window && window['localStorage'] !== null;
   } catch (e) {
      return false;
   }
}


function supportsWebSql() {
   try {
      return 'openDatabase' in window && window['openDatabase'] != null;
   } catch (e) {
      return false;
   }
}


function initLogDatabase() {
   log_db = null;
   
   // Uncomment to enable logging
   
   if (supportsWebSql() && supportsSessionStorage()) {
      log_db = window.openDatabase("RosieLog", "1.0", "interaction log", 5*1024*1024);
   }
   
   if (log_db) {
      log_db.transaction(function (tx) {
         tx.executeSql('CREATE TABLE IF NOT EXISTS rLog (' +
                       'id INTEGER PRIMARY KEY ASC, ' +
                       'user TEXT, ' +
                       'timestamp TEXT, ' +
                       'level TEXT,  ' +
                       'code BLOB);');
      });
   }
   
}


function log(level, code) {
	
   if (log_db) {
      log_db.transaction(function (tx) {
         tx.executeSql("INSERT INTO rlog (user, timestamp , level , code) " +
                    "VALUES (" +
                    "'" + getUserKey() + "', " +
                    "'" + getTimestamp() + "', " +
                    "'" + level  + "', " +
                    "'" + code + "')");
      });
   }
   //alert("log: " + level + code);
}


function truncate () {
   if (log_db) {
      log_db.transaction(function (tx) {
         tx.executeSql("DELETE FROM rlog");
      });
   }
   alert("table truncated");
}

function getMaxUserKey(callback) {
   if (log_db) {
      log_db.transaction(function (tx) {
         tx.executeSql("SELECT MAX(user) as 'user' FROM rlog;", [],
                     callback, null);
      });
   }
   return 0;
}


function getUserKey() {
   var user = null;
   if (supportsSessionStorage()) {
      user = localStorage.getItem("pkey");
   }
   if (user && user.length > 0) {
      return user;
   } else {
      return "00";
   }
}


function getCode(callback) {
   if (log_db) {
      log_db.transaction(function (tx) {
         tx.executeSql("SELECT user as 'user', timestamp as 'timestamp', level as 'level', code as 'code' FROM rlog;", [],
                     callback, null);
      });
   }
   return 0;
}


function getTimestamp() {
   var d = new Date();
   return (d.getFullYear() + "-" +
          (d.getMonth() < 10 ? '0' : '') + d.getMonth() + "-" +
          (d.getDate() < 10 ? '0' : '') + d.getDate() + " " +
          (d.getHours() < 10 ? '0' : '') + d.getHours() + ":" +
          (d.getMinutes() < 10 ? '0' : '') + d.getMinutes() + ":" + 
          (d.getSeconds() < 10 ? '0' : '') + d.getSeconds());
}

/*function getCode() {
   if (log_db) {
      
      db_log.transaction(function (tx) {
         tx.executeSql('SELECT * FROM LOGS', [], function (tx, results) {
            var len = results.rows.length, i;
            msg = "<p>Found rows: " + len + "</p>";
            //document.querySelector('#status').innerHTML +=  msg;
            for (i = 0; i < len; i++){
            alert(results.rows.item(i).log );
            }
         }, null);
      });
      //code
   }
   
   
}

*/