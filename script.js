// Get report list container
let reportList = document.getElementById("reportList");

// Apply dark mode immediately when page loads
if (localStorage.getItem("darkMode") === "enabled") {
    document.body.classList.add("dark-mode");
}

// Display all reports
function displayReports() {
    if (!reportList) return;

    reportList.innerHTML = "";

    let reports = JSON.parse(localStorage.getItem("reports")) || [];

    // Update Counter
    let counter = document.getElementById("reportCount");
    if (counter) {
        counter.innerText = "Total Reports: " + reports.length;
    }

    reports.forEach(function(report, index) {

        let div = document.createElement("div");

        div.innerHTML = `
        <p>
            <strong>Name:</strong> ${report.name} <br>
            <strong>Email:</strong> ${report.email} <br>
            <strong>Message:</strong> ${report.message} <br>
            <strong>Submitted:</strong> ${report.time} <br>

            <strong>Status:</strong>
            <span class="status-badge ${report.status.replace(' ', '-')}">
                ${report.status}
            </span>

            <br><br>

            <select onchange="changeStatus(${index}, this.value)">
                <option value="Pending" ${report.status === "Pending" ? "selected" : ""}>Pending</option>
                <option value="Under Review" ${report.status === "Under Review" ? "selected" : ""}>Under Review</option>
                <option value="Resolved" ${report.status === "Resolved" ? "selected" : ""}>Resolved</option>
            </select>
        </p>

        ${report.image ? `<img src="${report.image}" width="200"><br>` : ""}

        <button onclick="deleteReport(${index})">Delete</button>
        <hr>
        `;

        reportList.appendChild(div);
    });
}

// Delete single report
function deleteReport(index) {
    let reports = JSON.parse(localStorage.getItem("reports")) || [];
    reports.splice(index, 1);
    localStorage.setItem("reports", JSON.stringify(reports));
    displayReports();
}

// Clear all reports
function clearAllReports() {
    if (confirm("Are you sure you want to delete all reports?")) {
        localStorage.removeItem("reports");
        displayReports();
    }
}

// Change status
function changeStatus(index, newStatus) {
    let reports = JSON.parse(localStorage.getItem("reports")) || [];
    reports[index].status = newStatus;
    localStorage.setItem("reports", JSON.stringify(reports));
    displayReports();
}

// Search reports
function searchReports() {
    let input = document.getElementById("searchInput").value.toLowerCase();
    let reports = JSON.parse(localStorage.getItem("reports")) || [];

    reportList.innerHTML = "";

    reports.forEach(function(report, index) {

        let text = (report.name + report.email + report.message).toLowerCase();

        if (text.includes(input)) {

            let div = document.createElement("div");

            div.innerHTML = `
            <p>
                <strong>Name:</strong> ${report.name} <br>
                <strong>Email:</strong> ${report.email} <br>
                <strong>Message:</strong> ${report.message} <br>
                <strong>Submitted:</strong> ${report.time} <br>

                <strong>Status:</strong>
                <span class="status-badge ${report.status.replace(' ', '-')}">
                    ${report.status}
                </span>

                <br><br>

                <select onchange="changeStatus(${index}, this.value)">
                    <option value="Pending" ${report.status === "Pending" ? "selected" : ""}>Pending</option>
                    <option value="Under Review" ${report.status === "Under Review" ? "selected" : ""}>Under Review</option>
                    <option value="Resolved" ${report.status === "Resolved" ? "selected" : ""}>Resolved</option>
                </select>
            </p>

            ${report.image ? `<img src="${report.image}" width="200"><br>` : ""}

            <button onclick="deleteReport(${index})">Delete</button>
            <hr>
            `;

            reportList.appendChild(div);
        }
    });
}

// Toggle Dark Mode
function toggleDarkMode() {
    document.body.classList.toggle("dark-mode");

    let btn = document.getElementById("darkModeBtn");

    if (document.body.classList.contains("dark-mode")) {
        localStorage.setItem("darkMode", "enabled");
        if (btn) btn.innerText = "☀ Light Mode";
    } else {
        localStorage.setItem("darkMode", "disabled");
        if (btn) btn.innerText = "🌙 Dark Mode";
    }
}

// Form Submit
let form = document.querySelector("form");

if (form) {
    form.addEventListener("submit", function(event) {

        event.preventDefault();

        let name = document.querySelector("input[type='text']").value;
        let email = document.querySelector("input[type='email']").value;
        let message = document.querySelector("textarea").value;
        let fileInput = document.getElementById("evidence");

        if (name === "" || email === "" || message === "") {
            alert("Please fill all fields!");
            return;
        }

        let reader = new FileReader();

        reader.onload = function() {

            let report = {
                name: name,
                email: email,
                message: message,
                image: reader.result || "",
                time: new Date().toLocaleString(),
                status: "Pending"
            };

            let reports = JSON.parse(localStorage.getItem("reports")) || [];

            reports.push(report);

            localStorage.setItem("reports", JSON.stringify(reports));

            form.reset();

            displayReports();
        };

        if (fileInput && fileInput.files[0]) {
            reader.readAsDataURL(fileInput.files[0]);
        } else {
            reader.onload();
        }

    });
}

// Load reports on page load
displayReports();