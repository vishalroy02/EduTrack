const content = document.getElementById("content");

// ================= LOGOUT =================

document.getElementById("logoutBtn").onclick = () => {
    localStorage.clear();
    window.location.href = "../login.html";
};

// ================= ADD TEACHER =================

document.getElementById("teacherBtn").onclick = () => {

    content.innerHTML = `
        <h2>Add Teacher</h2>

        <form id="teacherForm" autocomplete="off">

          <input
type="text"
id="teacherName"
placeholder="Enter Teacher Name"
autocomplete="off"
required>

<input
type="email"
id="teacherEmail"
placeholder="Enter Teacher Email"
autocomplete="off"
required>

<input
type="password"
id="teacherPassword"
placeholder="Enter Password"
autocomplete="new-password"
required>

            <button type="submit">
                Add Teacher
            </button>

        </form>
    `;

    document.getElementById("teacherForm").addEventListener("submit", async (e) => {

        e.preventDefault();

        const name = document.getElementById("teacherName").value;
        const email = document.getElementById("teacherEmail").value;
        const password = document.getElementById("teacherPassword").value;

        try {

            const response = await fetch("http://localhost:5000/api/admin/addTeacher", {

                method: "POST",

                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + localStorage.getItem("token")
                },

                body: JSON.stringify({
                    name,
                    email,
                    password
                })

            });

            const data = await response.json();

            alert(data.message);

            if (response.ok) {
                document.getElementById("teacherForm").reset();
            }

        } catch (err) {

            alert("Server Error");

        }

    });

};

// ================= ADD PARENT =================

document.getElementById("parentBtn").onclick = () => {

    content.innerHTML = `
        <h2>Add Parent</h2>

        <form id="parentForm" autocomplete="off">

            <input
type="text"
id="parentName"
placeholder="Enter Parent Name"
autocomplete="off"
required>

<input
type="email"
id="parentEmail"
placeholder="Enter Parent Email"
autocomplete="off"
required>

<input
type="password"
id="parentPassword"
placeholder="Enter Password"
autocomplete="new-password"
required>

            <button type="submit">
                Add Parent
            </button>

        </form>
    `;

    document.getElementById("parentForm").addEventListener("submit", async (e) => {

        e.preventDefault();

        const name = document.getElementById("parentName").value;
        const email = document.getElementById("parentEmail").value;
        const password = document.getElementById("parentPassword").value;

        const response = await fetch("http://localhost:5000/api/admin/addParent", {

            method: "POST",

            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("token")
            },

            body: JSON.stringify({
                name,
                email,
                password
            })

        });

        const data = await response.json();

        alert(data.message);

        if (response.ok) {
            document.getElementById("parentForm").reset();
        }

    });

};

// ================= VIEW TEACHERS =================

document.getElementById("viewTeacherBtn").onclick = async () => {

    try {

        const response = await fetch(
            "http://localhost:5000/api/admin/teachers",
            {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token")
                }
            }
        );

        const teachers = await response.json();

        let html = `
            <h2>Teacher List</h2>

            <table class="teacherTable">

                <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Actions</th>
                </tr>
        `;

      teachers.forEach((teacher)=>{

html+=`

<tr>

<td>${teacher.name}</td>

<td>${teacher.email}</td>

<td>${teacher.role}</td>

<td>

<button
class="editBtn"
onclick="editTeacher('${teacher._id}','${teacher.name}','${teacher.email}')">

Edit

</button>

<button
class="deleteBtn"
onclick="deleteTeacher('${teacher._id}')">

Delete

</button>

</td>

</tr>

`;

});

        html += "</table>";

        content.innerHTML = html;

    } catch (err) {

        alert("Unable to load teachers");

    }

};

// ================= VIEW PARENTS =================

document.getElementById("viewParentBtn").onclick = async () => {

    const response = await fetch(
        "http://localhost:5000/api/admin/parents",
        {
            headers: {
                Authorization: "Bearer " + localStorage.getItem("token")
            }
        }
    );

    const parents = await response.json();

    let html = `
        <h2>Parent List</h2>

        <table class="teacherTable">

            <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Actions</th>
            </tr>
    `;

  parents.forEach(parent => {

    html += `
        <tr>

            <td>${parent.name}</td>

            <td>${parent.email}</td>

            <td>${parent.role}</td>

            <td>

                <button
                class="editBtn"
                onclick="editParent('${parent._id}','${parent.name}','${parent.email}')">

                Edit

                </button>

                <button
                class="deleteBtn"
                onclick="deleteParent('${parent._id}')">

                Delete

                </button>

            </td>

        </tr>
    `;

});

    html += "</table>";

    content.innerHTML = html;

};

// ================= CARD EVENTS =================

document.getElementById("cardTeacher").onclick = () => {
    document.getElementById("teacherBtn").click();
};

document.getElementById("cardParent").onclick = () => {
    document.getElementById("parentBtn").click();
};

document.getElementById("cardViewTeacher").onclick = () => {
    document.getElementById("viewTeacherBtn").click();
};

document.getElementById("cardViewParent").onclick = () => {
    document.getElementById("viewParentBtn").click();
};

// ================= DEFAULT PAGE =================

document.getElementById("teacherBtn").click();

async function deleteTeacher(id){

    if(!confirm("Delete this teacher?")) return;

    const response=await fetch(

    `http://localhost:5000/api/admin/teacher/${id}`,

    {

    method:"DELETE",

    headers:{
    Authorization:"Bearer "+localStorage.getItem("token")
    }

    });

    const data=await response.json();

    alert(data.message);

    document.getElementById("viewTeacherBtn").click();

}
async function editTeacher(id,name,email){

const newName=prompt("Teacher Name",name);

if(newName===null) return;

const newEmail=prompt("Teacher Email",email);

if(newEmail===null) return;

const response=await fetch(

`http://localhost:5000/api/admin/teacher/${id}`,

{

method:"PUT",

headers:{

"Content-Type":"application/json",

Authorization:"Bearer "+localStorage.getItem("token")

},

body:JSON.stringify({

name:newName,

email:newEmail

})

}

);

const data=await response.json();

alert(data.message);

document.getElementById("viewTeacherBtn").click();

}

async function deleteParent(id){

    if(!confirm("Delete this parent?")) return;

    const response = await fetch(

        `http://localhost:5000/api/admin/parent/${id}`,

        {

            method:"DELETE",

            headers:{
                Authorization:"Bearer "+localStorage.getItem("token")
            }

        }

    );

    const data = await response.json();

    alert(data.message);

    document.getElementById("viewParentBtn").click();

}

async function editParent(id,name,email){

    const newName = prompt("Parent Name",name);

    if(newName===null) return;

    const newEmail = prompt("Parent Email",email);

    if(newEmail===null) return;

    const response = await fetch(

        `http://localhost:5000/api/admin/parent/${id}`,

        {

            method:"PUT",

            headers:{

                "Content-Type":"application/json",

                Authorization:"Bearer "+localStorage.getItem("token")

            },

            body:JSON.stringify({

                name:newName,

                email:newEmail

            })

        }

    );

    const data = await response.json();

    alert(data.message);

    document.getElementById("viewParentBtn").click();

}