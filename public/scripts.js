document.addEventListener('DOMContentLoaded', function() {
    const orderForm = document.getElementById('orderForm');
    const customerInput = document.getElementById('customer');
    const addressInput = document.getElementById('address');
    const ordersDiv = document.getElementById('orders');

    // โหลดคำสั่งซื้อจาก API
    function loadOrders() {
        fetch('/orders')
            .then(response => response.json())
            .then(orders => {
                ordersDiv.innerHTML = '';
                orders.forEach(order => {
                    const orderElement = document.createElement('div');
                    orderElement.innerHTML = `<strong>${order.customer}</strong><br>${order.address}<br>Status: ${order.status}<br><br>`;
                    ordersDiv.appendChild(orderElement);
                });
            });
    }

    // เมื่อฟอร์มถูกส่ง
    orderForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const newOrder = {
            customer: customerInput.value,
            address: addressInput.value
        };

        fetch('/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newOrder)
        })
        .then(response => response.json())
        .then(() => {
            customerInput.value = '';
            addressInput.value = '';
            loadOrders();  // รีเฟรชคำสั่งซื้อ
        });
    });

    loadOrders();  // โหลดคำสั่งซื้อเมื่อโหลดหน้าเว็บ
});
