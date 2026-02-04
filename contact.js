
console.log("TOKEN ON CONTACT LOAD:", localStorage.getItem("access"));
alert("TOKEN ON CONTACT LOAD: " + localStorage.getItem("access"));
document.addEventListener("DOMContentLoaded", loadContacts);
let editingContactId = null;




const API_BASE_URL = "http://192.168.0.130:8000";
const TOKEN = localStorage.getItem("access");
console.log(TOKEN);


if (!TOKEN) {
    window.location.href = "login.html";
}

/* Load contacts */
function loadContacts(e) {
    // e.preventDefault();

    fetch(`${API_BASE_URL}/api/contacts/`, {
        headers: { "Authorization": `Bearer ${TOKEN}` }
    })
        .then(res => res.json())
        .then(data => {
            console.log(data);
            const tbody = document.querySelector("#contactTable tbody");
            tbody.innerHTML = "";


            data.forEach(c => {
                tbody.innerHTML += `
                <tr>
                    <td>${c.first_name} ${c.last_name}</td>
                    <td>${c.email}</td>
                    <td>${c.mobile}</td>
                    <td>${c.comments}</td>
                    <td>
                    <button onclick="editContact(${c.id})">Edit</button>
                    <button onclick="deleteContact(${c.id})">Delete</button>
                    </td>
                </tr>
            `;
            });
            console.log('tbody-->', tbody)
        })
    // .catch(() => logout());
}


//submit:
    document.getElementById("contactform").addEventListener("submit", function (e) {
    e.preventDefault();
    const formData = new FormData(this);

    let url = `${API_BASE_URL}/api/contacts/`;
    let method = "POST";

    if (editingContactId) {
        url = `${API_BASE_URL}/api/contacts/${editingContactId}/`;
        method = "PUT";
    }

    fetch(url, {
        method,
        headers: { "Authorization": `Bearer ${TOKEN}` },
        body: formData
    })
    .then(res => {
        if (!res.ok) throw new Error("Save failed");
        alert(editingContactId ? "Updated successfully" : "Saved successfully");
        this.reset();
        editingContactId = null;
        loadContacts();
    })
    .catch(err => alert(err.message));
});



//edit:
function editContact(id) {
    fetch(`${API_BASE_URL}/api/contacts/${id}/`, {
        headers: { "Authorization": `Bearer ${TOKEN}` }
    })
    .then(res => res.json())
    .then(c => {
        editingContactId = id;

        const form = document.getElementById("contactform");
        form.first_name.value = c.first_name;
        form.last_name.value = c.last_name;
        form.email.value = c.email;
        form.mobile.value = c.mobile;
        form.comments.value = c.comments;

        // Optional UX
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
}

/* Delete contact */
function deleteContact(id) {
    if (!confirm("Delete this contact?")) return;

    fetch(`${API_BASE_URL}/api/contacts/${id}/`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${TOKEN}` }
    }).then(loadContacts);
}

/* Logout */
function logout() {
    localStorage.clear();
    window.location.href = "login.html";
}

//for search:
/*const searchFile = document.querySelector('#btn_search');
// searchFile.addEventListener('input', search);
searchFile.addEventListener('input', debounce(search, 400));


function search() {
    const search_data = searchFile.value.toLowerCase();
    // const rows = document.querySelectorAll('#contactTable tbody tr');

    // console.log("ROWS FOUND:", rows.length);

    // rows.forEach(row => {
    //     const table_data = row.textContent.toLowerCase();

    //     if (table_data.indexOf(search_data) > -1) {
    //         row.style.display = "";
    //     } else {
    //         row.style.display = "none";
    //     }
    // });
    fetch(`${API_BASE_URL}/api/contacts/?search=<value> `, {
        headers: { "Authorization": `Bearer ${TOKEN}` }
    })
        .then(res => res.json())
        .then(data => {
            console.log(data);
        });
}

//debounce
function debounce(func, timeout = 500) {
    let timer;
    return (...args) => {
        timer = setTimeout(() => { func.apply(this, args); }, timeout);
    };
}
*/

const searchFile = document.querySelector('#btn_search');
searchFile.addEventListener('input', debounce(search, 400));

function search() {
    const search_data = searchFile.value.trim();

    // If input is empty, reload all contacts
    if (search_data === "") {
        loadContacts();
        return;
    }

    fetch(`http://192.168.0.130:8000/api/contacts/?search=${encodeURIComponent(search_data)}`, {
        headers: { "Authorization": `Bearer ${TOKEN}` }
    })
        .then(res => res.json())
        .then(data => {
            renderContacts(data);
        });
}

// Proper debounce
function debounce(func, timeout = 500) {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            func.apply(this, args);
        }, timeout);
    };
}

function renderContacts(data) {
    const tbody = document.querySelector("#contactTable tbody");
    tbody.innerHTML = "";

    data.forEach(c => {
        tbody.innerHTML += `
            <tr>
                <td>${c.first_name} ${c.last_name}</td>
                <td>${c.email}</td>
                <td>${c.mobile}</td>
                <td>${c.comments}</td>
                <td><button onclick="deleteContact(${c.id})">Delete</button></td>
            </tr>
        `;
    });
}
