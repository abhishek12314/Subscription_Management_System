document.getElementById("subscriptionForm").addEventListener("submit", function(e) {
    e.preventDefault();
  
    const serviceName = document.getElementById("serviceName").value.trim();
    const amount = document.getElementById("amount").value;
    const billingDate = document.getElementById("billingDate").value;
    const status = document.getElementById("status").value;
  
    // For now, store in localStorage (later we’ll save in MySQL via backend)
    let subs = JSON.parse(localStorage.getItem("subscriptions")) || [];
    subs.push({ serviceName, amount, billingDate, status });
    localStorage.setItem("subscriptions", JSON.stringify(subs));
  
    alert("Subscription added successfully ✅");
    window.location.href = "dashboard.html"; // Redirect back to dashboard
  });
  