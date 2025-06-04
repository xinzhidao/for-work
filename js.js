let totalPrice = 0;
const selectedProducts = {};

function goToOrderPage() {
  let combinedProducts = [];
  let grandTotal = 0;

  for (let i = 1; i <= 12; i++) {
    const productInput = document.getElementById(`selectedProduct${i}`);
    const totalInput = document.getElementById(`total${i}`);

    if (productInput && productInput.value.trim() !== "") {
      combinedProducts.push(productInput.value);
    }

    if (totalInput && totalInput.value) {
      grandTotal += parseFloat(totalInput.value);
    }
  }

  // حفظ في LocalStorage لاستخدامها في admin.html
  localStorage.setItem("selectedProduct", combinedProducts.join(" / "));
  localStorage.setItem("totalPrice", grandTotal.toFixed(2));

  // الانتقال إلى صفحة الطلب
  window.location.href = "order.html";
}


for (let i = 1; i <= 13; i++) {
  const showBtn = document.getElementById(`show-product${i}`);
  const closeBtn = document.getElementById(`close${i}`);
  const box = document.getElementById(`productBox${i}`);

  if (showBtn) showBtn.addEventListener("click", () => box.classList.add("active"));
  if (closeBtn) closeBtn.addEventListener("click", () => box.classList.remove("active"));
}

function selectProduct(name, price, boxId = 1) {
  const savedPrice = localStorage.getItem('price_' + name);
  const finalPrice = savedPrice ? parseFloat(savedPrice) : price;

  const list = document.querySelector(`.productSummaryList[data-box="${boxId}"]`);
  const input = document.getElementById(`selectedProduct${boxId}`);
  const totalInput = document.getElementById(`total${boxId}`);
  const howManyInput = document.getElementById(`Howmany${boxId}`);

  if (!selectedProducts[boxId]) selectedProducts[boxId] = {};
  if (!selectedProducts[boxId][name]) {
    selectedProducts[boxId][name] = { quantity: 1, price: finalPrice };
    const li = createProductElement(name, finalPrice, 1, boxId);
    list.appendChild(li);
  } else {
    selectedProducts[boxId][name].quantity++;
    const quantity = selectedProducts[boxId][name].quantity;
    const li = list.querySelector(`li[data-product="${name}"]`);
    const updatedLi = createProductElement(name, finalPrice, quantity, boxId);
    li.replaceWith(updatedLi);
  }
  totalPrice += finalPrice;
  totalInput.value = totalPrice.toFixed(2);
  input.value = Object.keys(selectedProducts[boxId])
    .map(name => `${name} (x${selectedProducts[boxId][name].quantity})`)
    .join(', ');
  howManyInput.value = finalPrice;
}

function createProductElement(productName, price, quantity, boxId) {
  const li = document.createElement('li');
  li.setAttribute('data-product', productName);
  li.className = "delete-button";
   const deleteBtn = document.createElement('button');

  const productInfo = document.createElement('p');
  const total = price * quantity;
deleteBtn.innerHTML = `<span class="icon">🗑</span> <span class="text">حذف</span>`;


  deleteBtn.onclick = function () {
    totalPrice -= price * quantity;
    delete selectedProducts[boxId][productName];
    li.remove();
    document.getElementById(`total${boxId}`).value = totalPrice.toFixed(2);
    document.getElementById(`selectedProduct${boxId}`).value =
      Object.keys(selectedProducts[boxId])
        .map(name => `${name} (x${selectedProducts[boxId][name].quantity})`)
        .join(', ');
  };

  li.appendChild(productInfo);
  li.appendChild(deleteBtn);
  return li;
}
window.onscroll = function () {
  const btn = document.getElementById("scrollToTopBtn");
  if (window.scrollY > 300) {
    btn.style.display = "block"; // أظهر الزر
  } else {
    btn.style.display = "none"; // أخفِ الزر
  }
};

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}
function updateMainOrderFields(){
  let combinedProducts = [];
  let grandTotal = 0;

  for (let i = 1;i <= 12;i++)
  {
    const productInput = document.getElementById(`selectedProduct${i}`)
 const totalInput = document.getElementById(`total${i}`);
if (productInput && productInput.value.trim() !== "")  
{
  combinedProducts.push(productInput.value);
}
if(totalInput && totalInput.value){
  grandTotal +=parseFloat(totalInput.value);
}
}

const mainProductInput = document.getElementById("selectedProduct")

const mainTotalInput = document.getElementById("total");
if (mainProductInput) mainProductInput.value = combinedProducts.join(" / ")

 if (mainTotalInput) mainTotalInput.value = grandTotal.toFixed(2); 
}
document.addEventListener("DOMContentLoaded", function () {
  document.getElementById('telegramForm').addEventListener('submit', function (e) {
    e.preventDefault();

// ← يتم تحديث المنتجات والسعر هنا فعليًا

    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    const selectedProduct = document.getElementById('selectedProduct').value;
    const total = document.getElementById('total').value;
    const city = document.getElementById('city').value;
    const location = document.getElementById('location').value;
    const locationpoint = document.getElementById('locationpoint').value;
    const message = document.getElementById('message').value;

    const text = `🛍️ Order Request:\n👤 Name: ${name}\n📞 Phone: ${phone}\n📦 Product: ${selectedProduct}\n💵 Total: ${total}\n📍 City: ${city}\n📌 Location: ${location}\n🗺️ Nearest Point: ${locationpoint}\n✉️ Message: ${message}`;

    const workerUrl = 'https://yellow-mountain-2509addeventlistenerfetcheventeven.xinzhidao1.workers.dev/';

    fetch(workerUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text })
    })
    .then(res => res.json())
  .then(data => {
  if (data.ok) {
    document.getElementById('statusMessage').innerText = "";
    document.getElementById('telegramForm').reset();
    document.getElementById('productSummaryList').innerHTML = "";
    totalPrice = 0;
    for (let key in selectedProducts) delete selectedProducts[key];

    // تحديث واجهة المستخدم يدويًا
    document.getElementById("selectedProduct").value = "";
    document.getElementById("total").value = "";
  } else {
    document.getElementById('statusMessage').innerText = "❌ فشل في إرسال الطلب.";
  }
})

    .catch(error => {
      console.error('Error:', error);
      alert("Error: " + error.message);
      document.getElementById('statusMessage').innerText = "❌ حدث خطأ أثناء الإرسال.";
    });
 updateMainOrderFields();  });

});

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      function(position) {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        document.getElementById('location').value = `https://maps.google.com/?q=${lat},${lon}`;
      },
      function(error) {
        alert("تعذر الحصول على الموقع. يرجى التحقق من إعدادات المتصفح.");
      }
    );
  } else {
    alert("المتصفح لا يدعم تحديد الموقع الجغرافي.");
  }
}

const productPrises = {};
firebase.database().ref('products').once('value').then(snapshot => {
  const data = snapshot.val();
  for (const key in data){
    localStorage.setItem('price_' + key, data[key]);
    productPrises[key] = data[key];
    console.log(`loaded ${key}: ${data[key]} $`);
  }
});

function showProductList() {
  const list = document.getElementById('productList');
  list.style.display = list.style.display === 'none' ? 'block' : 'none';
}

function showcity() {
  const list = document.getElementById('showthecity');
  list.style.display = list.style.display === 'none' ? 'block' : 'none';
}

function showthecity(element) {
  const locationc = element.innerText;
  addProductToSelection(locationc, 0);
  document.getElementById('locationc').style.display = 'none';
}

function addPrice(price) {
  const priceinput = document.getElementById('Howmany');
  priceinput.value = price;
  totalPrice += price;
  const totalElement = document.getElementById('total');
  totalElement.value = totalPrice.toFixed(2);
}

async function checkPasswordAndRedirect() {
  const password = prompt("أدخل كلمة المرور:");
  if (!password) return alert("لم يتم إدخال كلمة مرور.");
  const res = await fetch(`https://yellow-mountain-2509addeventlistenerfetcheventeven.xinzhidao1.workers.dev/?password=${encodeURIComponent(password)}`);
  const data = await res.json();

  if (data.ok) {
    window.location.href = "changeprice.html";
  } else {
    alert("كلمة المرور خاطئة.");
  }
}

console.log("JavaScript loaded successfully!");
