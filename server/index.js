<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Admin - Blood Bank System</title>
    <style>
        body { font-family: 'Segoe UI', sans-serif; padding: 20px; background: #f4f4f4; }
        .admin-container { max-width: 1000px; margin: auto; background: white; padding: 25px; border-radius: 12px; box-shadow: 0 5px 15px rgba(0,0,0,0.1); }
        h1 { color: #d32f2f; border-bottom: 2px solid #d32f2f; padding-bottom: 10px; text-align: center; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; margin-bottom: 40px; }
        th, td { padding: 12px; border: 1px solid #ddd; text-align: left; }
        th { background-color: #d32f2f; color: white; }
        .btn-delete { background: #ff4444; color: white; border: none; padding: 8px 12px; cursor: pointer; border-radius: 4px; font-weight: bold; }
        .btn-delete:hover { background: #cc0000; }
        nav { text-align: center; margin-bottom: 20px; }
        nav a { color: #0056b3; text-decoration: none; font-weight: bold; margin: 0 10px; }
    </style>
</head>
<body>

    <nav>
        <a href="index.html">← Back to Home</a>
    </nav>

    <div class="admin-container">
        <h1>System Administration</h1>

        <h3>Registered Donors (Supply)</h3>
        <table>
            <thead>
                <tr><th>Name</th><th>Group</th><th>City</th><th>Contact</th><th>Action</th></tr>
            </thead>
            <tbody id="donorTableBody"></tbody>
        </table>

        <h3>Active Requests (Emergency Demand)</h3>
        <table>
            <thead>
                <tr><th>Patient</th><th>Hospital</th><th>Group</th><th>Contact</th></tr>
            </thead>
            <tbody id="requestTableBody"></tbody>
        </table>
    </div>

    <script>
        const API_URL = 'https://blood-bank-api-35b9.onrender.com/api';

        async function loadAdminData() {
            try {
                const res = await fetch(`${API_URL}/admin/data`);
                const data = await res.json();

                // Populate Donors with Delete Capability
                document.getElementById('donorTableBody').innerHTML = data.donors.map(d => `
                    <tr>
                        <td>${d.name}</td>
                        <td>${d.bloodGroup}</td>
                        <td>${d.city}</td>
                        <td>${d.phone}</td>
                        <td><button class="btn-delete" onclick="deleteDonor('${d._id}')">Remove</button></td>
                    </tr>
                `).join('');

                // Populate Requests
                document.getElementById('requestTableBody').innerHTML = data.requests.map(r => `
                    <tr>
                        <td>${r.patientName}</td>
                        <td>${r.hospital}</td>
                        <td>${r.bloodGroup}</td>
                        <td>${r.phone}</td>
                    </tr>
                `).join('');
            } catch (err) { console.error("Admin fetch failed", err); }
        }

        async function deleteDonor(id) {
            if (confirm("Permanently delete this donor record?")) {
                const res = await fetch(`${API_URL}/donors/${id}`, { method: 'DELETE' });
                if (res.ok) {
                    alert("Record deleted.");
                    loadAdminData(); // Refresh tables
                }
            }
        }

        loadAdminData();
    </script>
</body>
</html>