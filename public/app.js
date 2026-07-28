let globalInvoices = [];
let portalPassword = "";

async function login() {
    const pwd = document.getElementById("password-input").value;
    const errorEl = document.getElementById("login-error");
    errorEl.innerText = "";

    const res = await fetch("/api/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: pwd }),
    });

    const data = await res.json();

    if (!res.ok) {
        errorEl.innerText = data.error || "Login failed";
        return;
    }

    portalPassword = pwd;
    globalInvoices = data.invoices;

    document.getElementById("login-card").classList.add("hidden");
    document.getElementById("portal-dashboard").classList.remove("hidden");

    renderTable(globalInvoices);
}

function renderTable(invoices) {
    const tbody = document.getElementById("invoice-rows");
    tbody.innerHTML = "";

    invoices.forEach((inv, index) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
      <td>${inv.date}</td>
      <td><strong>${inv.customer.name}</strong><br><small>${inv.customer.email}</small></td>
      <td><code>${inv.customer.personalCode}</code></td>
      <td>${inv.amount} ${inv.currency}</td>
      <td>
        <button onclick="downloadPdf(${index})">PDF</button>
        <button onclick="sendEmail(${index})">Email</button>
      </td>
    `;
        tbody.appendChild(tr);
    });
}

function filterInvoices() {
    const query = document.getElementById("search-input").value.toLowerCase();
    const filtered = globalInvoices.filter(
        (inv) =>
            inv.customer.name.toLowerCase().includes(query) ||
            inv.customer.personalCode.toLowerCase().includes(query),
    );
    renderTable(filtered);
}

function downloadPdf(index) {
    const inv = globalInvoices[index];
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("INVOICE / RĒĶINS", 140, 20);
    doc.setFontSize(10);
    doc.text(`Date: ${inv.date}`, 140, 28);

    doc.setFontSize(12);
    doc.text(`Customer: ${inv.customer.name}`, 20, 50);
    doc.text(`Personal Code: ${inv.customer.personalCode}`, 20, 60);
    doc.text(`Service: ${inv.service}`, 20, 70);
    doc.text(`Total Paid: ${inv.amount} ${inv.currency}`, 20, 80);

    doc.save(`${inv.invoiceNumber}.pdf`);
}

async function sendEmail(index) {
    const inv = globalInvoices[index];
    if (!confirm(`Send invoice email to ${inv.customer.email}?`)) return;

    const res = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: portalPassword, invoice: inv }),
    });

    const data = await res.json();
    alert(data.message || data.error);
}
