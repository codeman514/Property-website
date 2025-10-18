let selectPropertyType = "Buy";//預設選擇買樓類型
RefreshPropertyData(selectPropertyType);//預設載入刷新買樓物業資料表
//根據選擇物業類型刷新物業資料表
function RefreshPropertyData(type) {
    document.getElementById("data").innerHTML = "";//重置資料表文字
    document.getElementById("buyButton").classList.remove("active");
    document.getElementById("rentButton").classList.remove("active");
    selectPropertyType = type;
    if (type === "Buy") {
        document.getElementById("buyButton").classList.add("active");
    }
    if (type === "Rent") {
        document.getElementById("rentButton").classList.add("active");
    }
    let sql = `SELECT * FROM property WHERE '${type}'= ANY(tag)`;
    fetch("/api/getData", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ query: sql }) })
        .then(response => response.json()).then(data => {
            document.getElementById("data").innerHTML = "";//重置資料表文字
            data.data.forEach(element => {
                let priceText = type === "Buy" ? `售價:$${Number(element.price).toLocaleString()}萬` : `租金:$${Number(element.price).toLocaleString()}元/月`;
                let newCard = document.createElement("div");
                newCard.className = "card w-25";
                newCard.innerHTML =
                    `<div class="ratio ratio-1x1">
                            <img class="object-fit-cover" src = ${element.url} alt = ${element.name}/>
                    </div>
                    <div class="d-flex">
                        <div class="h3 col-md-8">${element.name}</div>
                        <button class="col-md-4" onclick='OpenPropertyBookingTips(${JSON.stringify(element)})'>預約睇樓</button>
                    </div>
                    <div>${priceText}</div>
                    <div>實用:${Number(element.area).toLocaleString()}呎</div>`;
                document.getElementById("data").appendChild(newCard);
            });
        });
}
//開啟後台登入視窗
function OpenManagementLoginTips() {
    document.getElementById("managementLoginTips").classList.remove("d-none");
}
//關閉後台登入視窗
function CloseManagementLoginTips() {
    document.getElementById("managementLoginTips").classList.add("d-none");
}
//後台登入提交登入時
function ManagementLogin() {
    let account = document.getElementById("managementAccount").value;
    let password = document.getElementById("managementPassword").value;
    let sql = `SELECT * FROM management WHERE account='${account}' AND password='${password}'`;
    fetch("/api/getData", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ query: sql }) })
        .then(response => response.json()).then(data => {
            if (data.success === true) {
                window.location.href = "management.html";
            } else {
                alert("帳號或密碼錯誤");
            }
        });
}
function OpenPropertyBookingTips(element) {
    document.getElementById("propertyBookingTips").classList.remove("d-none");
    let priceText = selectPropertyType === "Buy" ? `售價:$${Number(element.price).toLocaleString()}萬` : `租金:$${Number(element.price).toLocaleString()}元/月`;
    document.getElementById("propertyBookingTipsContent").innerHTML =
        `<div class="d-flex justify-content-between">
          <div class="h3 col-auto">${element.name}</div>
          <button class="col-md-2" onclick="ClosePropertyBookinTips()">X</button>
        </div>
        <div class="h-50 ratio">
            <img class="object-fit-cover" src=${element.url} alt=${element.name}/>
        </div>
        <div>${priceText}</div>
        <div>實用:${Number(element.area).toLocaleString()}呎</div>
        <div>請留下聯絡資料</div>
        <span>您的姓氏</span><input type="text" id="customerName">
        <span>聯絡電話</span><input type="text" id="customerPhone">
        <button class="d-block mx-auto" onclick="CustomerDataSend(${element.id})">送出資料</button>`;
}
//關閉後台登入視窗
function ClosePropertyBookinTips() {
    document.getElementById("propertyBookingTips").classList.add("d-none");
}
//客戶在物業預約框送出資料
function CustomerDataSend(propertyId) {
    let customerName = document.getElementById("customerName").value;
    let customerPhone = document.getElementById("customerPhone").value;
    let sql = `INSERT INTO customerContact(name, phone, propertyId) VALUES ("${customerName}", "${customerPhone}", "${propertyId}")`;
    fetch("/api/getData", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ query: sql }) })
        .then(response => response.json()).then(data => {
            if (data.success === true) {
                alert("資料送出成功,我們會盡快與您聯絡");
                CloseManagementLoginTips();
            } else {
                alert("資料送出失敗,請稍後再試");
            }
        });
}
function SearchSubmit(event) {
    event.preventDefault();//防止表單提交後頁面重新整理
    let keyword = document.getElementById("SearchKeyword").value;
    let sql = `SELECT * FROM property WHERE name ILIKE '%${keyword}%' OR EXISTS (SELECT 1 FROM unnest(tag) AS t WHERE t ILIKE '%${keyword}%');`;
    fetch("/api/getData", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ query: sql }) })
        .then(response => response.json()).then(data => {
            document.getElementById("data").innerHTML = "";//重置資料表文字
            data.data.forEach(element => {
                let priceText = selectPropertyType === "Buy" ? `售價:$${Number(element.price).toLocaleString()}萬` : `租金:$${Number(element.price).toLocaleString()}元/月`;
                let newCard = document.createElement("div");
                newCard.className = "card w-25";
                newCard.innerHTML =
                    `<div class="ratio ratio-1x1">
                            <img class="object-fit-cover" src = ${element.url} alt = ${element.name}/>
                    </div>
                    <div class="d-flex">
                        <div class="h3 col-md-8">${element.name}</div>
                        <button class="col-md-4" onclick='OpenPropertyBookingTips(${JSON.stringify(element)})'>預約睇樓</button>
                    </div>
                    <div>${priceText}</div>
                    <div>實用:${Number(element.area).toLocaleString()}呎</div>`;
                document.getElementById("data").appendChild(newCard);
            });
        });
}