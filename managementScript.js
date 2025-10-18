//載入並顯示客戶聯絡資料
let sql = `SELECT "customerContact"."id", "customerContact"."name" AS "customerName", "customerContact"."phone", "property"."name" AS "propertyName"
FROM "customerContact" JOIN property ON "customerContact"."propertyId" = property.id`;
fetch("/api/getData", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ query: sql }) })
    .then(response => response.json()).then(data => {
        document.getElementById("customerContactData").innerHTML = "";//重置客戶聯絡資料表文字
        data.data.forEach(element => {
            let newCustomerData = document.createElement("div");
            newCustomerData.className = "d-flex";
            newCustomerData.innerHTML =
                `<div class="col-md-1">編號:${element.id}</div>
                    <div class="col-md-3">客戶姓氏:${element.customerName}</div>
                    <div class="col-md-3">聯絡電話:${element.phone}</div>
                    <div class="col-md-5">預約樓盤:${element.propertyName}</div>`;
            document.getElementById("customerContactData").appendChild(newCustomerData);
        });
    });