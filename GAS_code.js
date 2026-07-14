/**
 * iBrandQueen 電子報與 LINE 整合系統 - Google Apps Script (GAS) 核心代碼 (安全升級版)
 * 
 * 【使用步驟】：
 * 1. 在您的 Google 雲端硬碟建立一個新的「Google 試算表」。
 * 2. 點擊選單的「擴充功能」->「Apps Script」。
 * 3. 清空裡面的預設代碼，將此檔案的所有內容完整複製並貼上。
 * 4. 點擊存檔（小磁碟圖示），然後執行一遍 `setupSheets` 函數以初始化工作表與預設密碼。
 * 5. 點擊右上角「部署」->「新增部署」。
 * 6. 選取類型為「網頁應用程式 (Web App)」。
 *    - 說明：iBrandQueen Backend
 *    - 誰有權限存取：選取「任何人 (Anyone)」
 * 7. 點擊「部署」，授權 Google 帳號權限後，複製產生的「網頁應用程式網址 (URL)」！
 * 8. 將複製的網址填入 iBrandQueen 網頁的電子報管理後台，即可開始運作。
 * 
 * 💡 如果要串接 LINE 機器人：
 *    - 請將此 GAS 部署網址填入 LINE Developers 官方帳號設定中的「Webhook URL」，並啟用 Webhook 服務。
 */

// ==========================================
// 1. 初始化與工作表設定
// ==========================================

function setupSheets() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // 建立電子信箱訂閱名單工作表
  var emailSheet = ss.getSheetByName("Emails");
  if (!emailSheet) {
    emailSheet = ss.insertSheet("Emails");
    emailSheet.appendRow(["Email", "訂閱時間", "來源管道"]);
    emailSheet.getRange(1, 1, 1, 3).setFontWeight("bold").setBackground("#f3f3f3");
  }
  
  // 建立 LINE 用戶名單工作表
  var lineUserSheet = ss.getSheetByName("LINE_Users");
  if (!lineUserSheet) {
    lineUserSheet = ss.insertSheet("LINE_Users");
    lineUserSheet.appendRow(["User ID", "使用者名稱", "加入時間"]);
    lineUserSheet.getRange(1, 1, 1, 3).setFontWeight("bold").setBackground("#f3f3f3");
  }
  
  // 建立 LINE 群組名單工作表
  var lineGroupSheet = ss.getSheetByName("LINE_Groups");
  if (!lineGroupSheet) {
    lineGroupSheet = ss.insertSheet("LINE_Groups");
    lineGroupSheet.appendRow(["Group ID", "群組名稱/備註", "加入時間"]);
    lineGroupSheet.getRange(1, 1, 1, 3).setFontWeight("bold").setBackground("#f3f3f3");
  }

  // 建立發送與錯誤日誌工作表
  var logSheet = ss.getSheetByName("Logs");
  if (!logSheet) {
    logSheet = ss.insertSheet("Logs");
    logSheet.appendRow(["時間戳記", "類別", "日誌內容"]);
    logSheet.getRange(1, 1, 1, 3).setFontWeight("bold").setBackground("#f3f3f3");
  }

  // 初始化後台管理安全密碼於 Script Properties 中 (避免寫死在 HTML)
  var scriptProperties = PropertiesService.getScriptProperties();
  if (!scriptProperties.getProperty("ADMIN_PASSWORD")) {
    scriptProperties.setProperty("ADMIN_PASSWORD", "admin123"); // 預設密碼為 admin123
  }
  
  Logger.log("工作表與安全密碼初始化成功！");
}

// ==========================================
// 2. 驗證密碼輔助函數
// ==========================================

function verifyAdminPassword(inputPassword) {
  var scriptProperties = PropertiesService.getScriptProperties();
  var storedPassword = scriptProperties.getProperty("ADMIN_PASSWORD") || "admin123";
  return inputPassword === storedPassword;
}

// ==========================================
// 3. HTTP POST 請求接收端 (網頁前端 API 呼叫)
// ==========================================

function doPost(e) {
  var responseData = {};
  
  try {
    // 檢查請求內容是否為空
    if (!e || !e.postData || !e.postData.contents) {
      return createJsonResponse({ error: "No post data received" }, 400);
    }
    
    var rawData = e.postData.contents;
    var jsonPayload;
    
    try {
      jsonPayload = JSON.parse(rawData);
    } catch (parseErr) {
      jsonPayload = e.parameter;
    }
    
    // 【A. 判斷是否為 LINE Webhook 傳入的事件】
    if (jsonPayload.events && Array.isArray(jsonPayload.events)) {
      handleLineWebhook(jsonPayload.events);
      return createJsonResponse({ status: "LINE webhook event processed" });
    }
    
    // 【B. 網頁後台管理 API 的呼叫】
    var action = jsonPayload.action;
    
    // 1. 訂閱信箱動作不需要管理員密碼驗證
    if (action === "subscribeEmail") {
      responseData = addEmailSubscriber(jsonPayload.email, jsonPayload.source || "官網首頁");
      return createJsonResponse(responseData);
    }
    
    // 2. 所有其他的管理後台敏感操作，皆必須進行伺服器端密碼驗證 (資安升級防護)
    var password = jsonPayload.password;
    if (!verifyAdminPassword(password)) {
      return createJsonResponse({ success: false, error: "驗證失敗：後台密碼錯誤，拒絕存取！" }, 401);
    }
    
    // 密碼驗證通過，執行對應功能
    if (action === "getStats") {
      // 獲取目前的訂閱數據統計與名單
      responseData = fetchDashboardStats();
    } 
    else if (action === "sendNewsletter") {
      // 管理者在後台點擊發送電子報
      responseData = processNewsletterDistribution(jsonPayload);
    } 
    else if (action === "changeAdminPassword") {
      // 變更管理員密碼
      var newPassword = jsonPayload.newPassword;
      if (!newPassword || newPassword.trim().length < 6) {
        responseData = { success: false, error: "變更失敗：新密碼長度必須至少為 6 位數！" };
      } else {
        var scriptProperties = PropertiesService.getScriptProperties();
        scriptProperties.setProperty("ADMIN_PASSWORD", newPassword.trim());
        logEvent("Security", "管理員後台密碼已更新。");
        responseData = { success: true, message: "密碼更新成功！" };
      }
    }
    else if (action === "uploadImage") {
      // 上傳本機圖片並儲存到 Google Drive 產生直連
      var fileName = jsonPayload.fileName;
      var fileType = jsonPayload.fileType;
      var base64Data = jsonPayload.base64Data;
      if (!fileName || !fileType || !base64Data) {
        responseData = { success: false, error: "上傳失敗：檔案資料不完整！" };
      } else {
        responseData = saveFileToDrive(fileName, fileType, base64Data);
      }
    }
    else {
      responseData = { error: "Unknown action: " + action };
    }
    
  } catch (error) {
    logEvent("Error", "doPost 執行錯誤: " + error.toString());
    responseData = { error: error.toString() };
  }
  
  return createJsonResponse(responseData);
}

// ==========================================
// 4. 輔助函數：輸出 JSON 回應
// ==========================================

function createJsonResponse(data, statusCode) {
  var output = ContentService.createTextOutput(JSON.stringify(data));
  output.setMimeType(ContentService.MimeType.JSON);
  return output;
}

// ==========================================
// 5. 業務邏輯：寫入電子郵件訂閱
// ==========================================

function addEmailSubscriber(email, source) {
  if (!email || email.indexOf("@") === -1) {
    return { success: false, message: "無效的 Email 格式！" };
  }
  
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("Emails");
  if (!sheet) setupSheets();
  sheet = ss.getSheetByName("Emails");
  
  var data = sheet.getDataRange().getValues();
  var headers = data[0];
  
  // 動態偵測欄位位置
  var emailIdx = -1;
  var dateIdx = -1;
  var sourceIdx = -1;
  
  for (var col = 0; col < headers.length; col++) {
    var headerStr = headers[col].toString().toLowerCase();
    if (headerStr.indexOf("email") > -1 || headerStr.indexOf("信箱") > -1 || headerStr.indexOf("郵件") > -1) {
      emailIdx = col;
    } else if (headerStr.indexOf("時間") > -1 || headerStr.indexOf("date") > -1 || headerStr.indexOf("time") > -1 || headerStr.indexOf("戳記") > -1) {
      dateIdx = col;
    } else if (headerStr.indexOf("來源") > -1 || headerStr.indexOf("source") > -1 || headerStr.indexOf("管道") > -1) {
      sourceIdx = col;
    }
  }
  
  if (emailIdx === -1) emailIdx = 0;
  if (dateIdx === -1) dateIdx = 1;
  if (sourceIdx === -1) sourceIdx = 2;
  
  // 檢查是否重複訂閱
  for (var i = 1; i < data.length; i++) {
    if (data[i][emailIdx] && data[i][emailIdx].toString().toLowerCase() === email.toLowerCase()) {
      return { success: true, message: "此 Email 已經在訂閱清單中。" };
    }
  }
  
  // 根據欄位索引構造要寫入的陣列
  var maxIdx = Math.max(emailIdx, dateIdx, sourceIdx);
  var rowData = new Array(maxIdx + 1);
  for (var k = 0; k <= maxIdx; k++) {
    rowData[k] = "";
  }
  rowData[emailIdx] = email;
  rowData[dateIdx] = new Date();
  rowData[sourceIdx] = source;
  
  sheet.appendRow(rowData);
  logEvent("Info", "新 Email 訂閱: " + email + " (管道: " + source + ")");
  return { success: true, message: "成功加入電子郵件訂閱清單！" };
}

// ==========================================
// 6. 業務邏輯：撈取後台統計數據
// ==========================================

function fetchDashboardStats() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  
  var emailSheet = ss.getSheetByName("Emails");
  var userSheet = ss.getSheetByName("LINE_Users");
  var groupSheet = ss.getSheetByName("LINE_Groups");
  
  var emails = [];
  var lineUsers = [];
  var lineGroups = [];
  
  if (emailSheet) {
    var emailData = emailSheet.getDataRange().getValues();
    if (emailData.length > 0) {
      var headers = emailData[0];
      
      // 動態偵測欄位位置
      var emailIdx = -1;
      var dateIdx = -1;
      var sourceIdx = -1;
      
      for (var col = 0; col < headers.length; col++) {
        var headerStr = headers[col].toString().toLowerCase();
        if (headerStr.indexOf("email") > -1 || headerStr.indexOf("信箱") > -1 || headerStr.indexOf("郵件") > -1) {
          emailIdx = col;
        } else if (headerStr.indexOf("時間") > -1 || headerStr.indexOf("date") > -1 || headerStr.indexOf("time") > -1 || headerStr.indexOf("戳記") > -1) {
          dateIdx = col;
        } else if (headerStr.indexOf("來源") > -1 || headerStr.indexOf("source") > -1 || headerStr.indexOf("管道") > -1) {
          sourceIdx = col;
        }
      }
      
      if (emailIdx === -1) emailIdx = 0;
      if (dateIdx === -1) dateIdx = 1;
      if (sourceIdx === -1) sourceIdx = 2;
      
      for (var i = 1; i < emailData.length; i++) {
        emails.push({
          email: emailData[i][emailIdx],
          date: emailData[i][dateIdx],
          source: emailData[i][sourceIdx]
        });
      }
    }
  }
  
  if (userSheet) {
    var userData = userSheet.getDataRange().getValues();
    for (var j = 1; j < userData.length; j++) {
      lineUsers.push({
        userId: userData[j][0],
        name: userData[j][1] || "未提供名稱",
        date: userData[j][2]
      });
    }
  }
  
  if (groupSheet) {
    var groupData = groupSheet.getDataRange().getValues();
    for (var k = 1; k < groupData.length; k++) {
      lineGroups.push({
        groupId: groupData[k][0],
        name: groupData[k][1] || "LINE 群聊群組",
        date: groupData[k][2]
      });
    }
  }
  
  return {
    success: true,
    emailCount: emails.length,
    lineUserCount: lineUsers.length,
    lineGroupCount: lineGroups.length,
    emails: emails,
    lineUsers: lineUsers,
    lineGroups: lineGroups,
    senderEmail: Session.getEffectiveUser().getEmail()
  };
}

// ==========================================
// 7. 業務邏輯：處理電子報群發 (Gmail + LINE)
// ==========================================

function processNewsletterDistribution(payload) {
  var subject = payload.subject || "iBrandQueen 品牌女王電子報";
  var content = payload.content || "";
  var channels = payload.channels || {}; // e.g., { email: true, lineUser: true, lineGroup: true }
  var lineToken = payload.lineToken; // 可由網頁端後台傳遞過來
  
  var results = {
    emailSent: 0,
    emailFailed: 0,
    lineUserSent: 0,
    lineUserFailed: 0,
    lineGroupSent: 0,
    lineGroupFailed: 0,
    errors: []
  };
  
  var stats = fetchDashboardStats();
  
  // A. 發送 Gmail 電子郵件
  if (channels.email && stats.emails.length > 0) {
    stats.emails.forEach(function(item) {
      try {
        GmailApp.sendEmail(item.email, subject, "", {
          htmlBody: content.replace(/\n/g, "<br>")
        });
        results.emailSent++;
      } catch (err) {
        results.emailFailed++;
        results.errors.push("Email (" + item.email + ") 發送失敗: " + err.toString());
      }
    });
  }
  
  // B. 發送 LINE 訊息
  if (lineToken && (channels.lineUser || channels.lineGroup)) {
    var plainTextContent = content
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<\/p>/gi, "\n")
      .replace(/<[^>]+>/g, ""); // 移除其他 HTML tags
      
    // 發送給單聊用戶
    if (channels.lineUser && stats.lineUsers.length > 0) {
      stats.lineUsers.forEach(function(user) {
        var status = sendLinePushMessage(lineToken, user.userId, plainTextContent);
        if (status.success) {
          results.lineUserSent++;
        } else {
          results.lineUserFailed++;
          results.errors.push("LINE 用戶 (" + user.name + ") 發送失敗: " + status.error);
        }
      });
    }
    
    // 發送給群聊群組
    if (channels.lineGroup && stats.lineGroups.length > 0) {
      stats.lineGroups.forEach(function(group) {
        var status = sendLinePushMessage(lineToken, group.groupId, plainTextContent);
        if (status.success) {
          results.lineGroupSent++;
        } else {
          results.lineGroupFailed++;
          results.errors.push("LINE 群組 (" + group.name + ") 發送失敗: " + status.error);
        }
      });
    }
  } else if ((channels.lineUser || channels.lineGroup) && !lineToken) {
    results.errors.push("未提供 LINE Channel Access Token，無法發送 LINE 訊息！");
  }
  
  // 記錄日誌
  var summary = "電子報發送完畢。Gmail: " + results.emailSent + " 成功 / " + results.emailFailed + " 失敗；" +
                "LINE 用戶: " + results.lineUserSent + " 成功；" +
                "LINE 群組: " + results.lineGroupSent + " 成功。";
  logEvent("Newsletter", summary);
  
  return {
    success: true,
    results: results,
    summary: summary
  };
}

// ==========================================
// 8. LINE Webhook 接收與處理
// ==========================================

function handleLineWebhook(events) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var userSheet = ss.getSheetByName("LINE_Users");
  var groupSheet = ss.getSheetByName("LINE_Groups");
  
  events.forEach(function(event) {
    var source = event.source;
    if (!source) return;
    
    var timestamp = new Date();
    
    // A. 處理群聊 (Group ID) 收集
    if (source.type === "group" && source.groupId) {
      var gId = source.groupId;
      var groupData = groupSheet.getDataRange().getValues();
      var exists = false;
      
      for (var i = 1; i < groupData.length; i++) {
        if (groupData[i][0] === gId) {
          exists = true;
          break;
        }
      }
      
      if (!exists) {
        groupSheet.appendRow([gId, "LINE 群聊 (" + timestamp.toLocaleDateString() + " 加入)", timestamp]);
        logEvent("LINE_Webhook", "偵測到新群組並已記錄: " + gId);
      }
    }
    
    // B. 處理單聊 (User ID) 收集
    if (source.type === "user" && source.userId) {
      var uId = source.userId;
      var userData = userSheet.getDataRange().getValues();
      var uExists = false;
      
      for (var j = 1; j < userData.length; j++) {
        if (userData[j][0] === uId) {
          uExists = true;
          break;
        }
      }
      
      if (!uExists) {
        userSheet.appendRow([uId, "LINE 訂閱者 (" + timestamp.toLocaleDateString() + ")", timestamp]);
        logEvent("LINE_Webhook", "偵測到新用戶並已記錄: " + uId);
      }
    }
  });
}

// ==========================================
// 9. 呼叫 LINE Messaging API 送信
// ==========================================

function sendLinePushMessage(token, toId, text) {
  var url = "https://api.line.me/v2/bot/message/push";
  
  var postData = {
    to: toId,
    messages: [
      {
        type: "text",
        text: text
      }
    ]
  };
  
  var options = {
    method: "post",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + token
    },
    payload: JSON.stringify(postData),
    muteHttpExceptions: true
  };
  
  try {
    var response = UrlFetchApp.fetch(url, options);
    var responseCode = response.getResponseCode();
    var responseText = response.getContentText();
    
    if (responseCode === 200) {
      return { success: true };
    } else {
      return { success: false, error: "HTTP " + responseCode + ": " + responseText };
    }
  } catch (err) {
    return { success: false, error: err.toString() };
  }
}

// ==========================================
// 10. 記錄日誌到試算表
// ==========================================

function logEvent(type, message) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName("Logs");
    if (sheet) {
      sheet.appendRow([new Date(), type, message]);
    }
  } catch (e) {
    Logger.log("寫入日誌失敗: " + e.toString());
  }
}

// ==========================================
// 11. 業務邏輯：上傳本機圖片到 Google 雲端硬碟
// ==========================================

function saveFileToDrive(fileName, fileType, base64Data) {
  try {
    var rawData = Utilities.base64Decode(base64Data);
    var blob = Utilities.newBlob(rawData, fileType, fileName);
    
    // 尋找或建立名為 "iBrandQueen_Assets" 的雲端資料夾
    var folders = DriveApp.getFoldersByName("iBrandQueen_Assets");
    var folder;
    if (folders.hasNext()) {
      folder = folders.next();
    } else {
      folder = DriveApp.createFolder("iBrandQueen_Assets");
    }
    
    // 建立檔案
    var file = folder.createFile(blob);
    
    // 將檔案設定為「任何人只要有連結均可檢視」 (供 Email 中正常顯示圖片)
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    
    var fileId = file.getId();
    // 取得 Google Drive 圖片直連 URL (常用於 html 顯示)
    var downloadUrl = "https://drive.google.com/uc?export=view&id=" + fileId;
    
    logEvent("Info", "圖片上傳雲端成功: " + fileName + " (ID: " + fileId + ")");
    return { success: true, url: downloadUrl };
  } catch (err) {
    Logger.log("上傳發生錯誤: " + err.toString());
    logEvent("Error", "圖片上傳發生錯誤: " + err.toString());
    return { success: false, error: "上傳發生錯誤：" + err.toString() };
  }
}
