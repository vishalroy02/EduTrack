const role = localStorage.getItem("role");

const userId = localStorage.getItem("userId");

const name = localStorage.getItem("name");

const welcomeText = document.getElementById("welcomeText");

const roleContent = document.getElementById("roleContent");




if (role !== "student") {
    document.querySelector(".cards").style.display = "none";
}


// ================= STUDENT DASHBOARD =================
if (role === "student") {

  welcomeText.innerHTML = "";

  fetch(`https://edutrack-m2ls.onrender.com/api/student/${userId}`)
    .then((res) => res.json())
    .then((data) => {
      // Save data for PDF
      window.studentData = data;

      // Dashboard Cards
      const attendanceCard =
        document.getElementById("attendanceCard");

      const marksCard =
        document.getElementById("marksCard");

      const noticeCard =
        document.getElementById("noticeCard");


      // Attendance %
    const totalAttendance = data.attendanceSummary.total;

const presentAttendance = data.attendanceSummary.present;

const absentAttendance = data.attendanceSummary.absent;

const attendancePercent = data.attendanceSummary.percentage;

      attendanceCard.innerHTML =
        `${attendancePercent}%`;


      // Total Marks
     const totalMarks = data.marks.reduce(
    (sum, item) => sum + Number(item.marks),
    0
);

const maxMarks = data.marks.length * 100;

marksCard.innerHTML = `${totalMarks} / ${maxMarks}`;


      // Notices Count
      noticeCard.innerHTML =
        data.notices.length;



      // Attendance HTML
    let attendanceHTML = "";

data.recentAttendance
.sort((a,b)=>new Date(b.date)-new Date(a.date))
.forEach(item=>{

attendanceHTML += `

<tr>

<td>${new Date(item.date).toLocaleDateString("en-GB")}</td>

<td>

${
item.status==="present"
?
"✅ Present"
:
"❌ Absent"
}

</td>

</tr>

`;

});


      // Marks HTML
    let marksHTML = "";

data.marks.forEach((item) => {
    marksHTML += `
        <tr>
            <td>${item.subject}</td>
            <td>${item.marks}</td>
        </tr>
    `;
});


      // Notices HTML
     let noticesHTML = "";

data.notices
.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
.slice(0, 4)
.forEach((item) => {

    noticesHTML += `

   <div class="notice-card">
    <div class="notice-header">
        <h4>📢 ${item.title}</h4>

        <span class="notice-date">
            📅 ${new Date(item.createdAt).toLocaleDateString("en-GB")}
        </span>
    </div>

    <p>${item.message}</p>
</div>

    `;

});


const student = data.student;

const studentProfile = `
<div class="profile-card">

<h3>Student Profile</h3>

${
student.photo
?
`<img
src="https://edutrack-m2ls.onrender.com/uploads/${student.photo}"
width="120"
height="120"
style="border-radius:50%;object-fit:cover;margin-bottom:15px;"
>`
:
`<div class="default-avatar">
${student.name ? student.name.charAt(0).toUpperCase() : "U"}
</div>`
}

<p><b>Name:</b> ${student.name}</p>

<p><b>Email:</b> ${student.email}</p>

<p><b>Roll No:</b> ${student.rollNo || "Not Added"}</p>

<p><b>Department:</b> ${student.department || "Not Added"}</p>

<p><b>Semester:</b> ${student.semester || "Not Added"}</p>

<p><b>Phone:</b> ${student.phone || "Not Added"}</p>

<button onclick="openEditProfile()">
    ✏ Edit Profile
</button>

</div>
`;
      // Final Student Dashboard
      roleContent.innerHTML = `
      
        <div class="role-box">

          <h2>🎓 Student Dashboard</h2>

<div class="dashboard-info">
    <h3>👋 Welcome ${name}!</h3>

    <p>
        Manage your academic information from one place. Here you can view your
        profile, check attendance, monitor your marks, stay updated with the
        latest notices, download your result PDF, and update your personal
        details whenever required.
    </p>
</div>

${studentProfile}
          <button onclick="downloadResultPDF()">
        📄 Download Result PDF
    </button>


          <h3>Attendance</h3>

<div class="attendance-summary">

<p><b>Total Classes:</b> ${totalAttendance}</p>

<p><b>Present:</b> ${presentAttendance}</p>

<p><b>Absent:</b> ${absentAttendance}</p>

<p><b>Attendance:</b> ${attendancePercent}%</p>

</div>

<h3>📅 Recent Attendance</h3>

<table
border="1"
cellpadding="10"
cellspacing="0"
width="100%"
>

<tr>

<th>Date</th>

<th>Status</th>

</tr>

${attendanceHTML}

</table>

<br>

<button onclick="viewAttendanceHistory()">

📋 View Full Attendance

</button>





       <h3>📚 Marks</h3>

<table class="marks-table">
    <thead>
        <tr>
            <th>Subject</th>
            <th>Marks</th>
        </tr>
    </thead>

    <tbody>
        ${marksHTML}
    </tbody>
</table>


          <h3>📢 Latest Notices</h3>

${noticesHTML}
        </div>

      `;

    });
}



// ================= TEACHER DASHBOARD =================
else if (role === "teacher") {

  welcomeText.innerHTML = "";

  roleContent.innerHTML = `
  
    <div class="role-box">

      <h2>👨‍🏫 Teacher Dashboard</h2>

<div class="dashboard-info">

    <h3>👋 Welcome ${name}!</h3>

    <p>
        Manage student records efficiently from a single dashboard.
        Search students, view student details, record attendance,
        upload marks and publish important notices to ensure smooth
        academic management.
    </p>

</div>

<div class="teacher-card">

<h3>🔍 Search Student</h3>

<input
    type="text"
    id="searchStudent"
    placeholder="Search by Name or Roll No"
>

<div class="teacher-buttons">

<button onclick="searchStudent()">
Search
</button>

<button onclick="viewStudents()">
View All Students
</button>

</div>

<div id="studentsList"></div>

</div>


      <!-- Attendance -->
      <div class="teacher-card">

<h3>📅 Add Attendance</h3>

<div class="attendance-row">

<input
type="text"
id="studentRollNo"
placeholder="Enter Roll Number"
>

<select id="attendanceStatus">

<option value="present">Present</option>

<option value="absent">Absent</option>

</select>

</div>

<button onclick="addAttendance()">
Submit Attendance
</button>

</div>


      <!-- Marks -->
     <div class="teacher-card">

<h3>📝 Add Marks</h3>

<div class="marks-search">

    <input
        type="text"
        id="marksRollNo"
        placeholder="Enter Roll Number"
    >

    <button onclick="fetchStudentDetails()">
        🔍 Find
    </button>

</div>

<div id="studentInfoCard" style="display:none;"></div>

<input
type="text"
id="subject"
placeholder="Subject"
>

<input
type="number"
id="marks"
placeholder="Marks"
>

<button onclick="addMarks()">
Submit Marks
</button>

</div>


      <!-- Notice -->
     <div class="teacher-card">

<h3>📢 Add Notice</h3>

<input
type="text"
id="noticeTitle"
placeholder="Notice Title"
>

<input
type="text"
id="noticeMessage"
placeholder="Notice Message"
>

<button onclick="addNotice()">
Post Notice
</button>

</div>

  `;
}



// ================= PARENT DASHBOARD =================
else if (role === "parent") {

 welcomeText.innerHTML = "";

  roleContent.innerHTML = `
  
    <div class="role-box">

      <h2>👨‍👩‍👧 Parent Dashboard</h2>

<div class="dashboard-info">

    <h3>👋 Welcome ${name}!</h3>

    <p>
        Track your child's academic progress with ease.
        Enter your child's roll number to view attendance,
        academic performance, latest notices and download
        the academic report whenever required.
    </p>

</div>

<input
        type="text"
        id="parentStudentId"
        placeholder="Enter Child Roll Number"
      >

      <button onclick="loadParentData()">
        View Child Data
      </button>

      <div id="parentData"></div>

    </div>

  `;
}



// ================= LOAD PARENT DATA =================
async function loadParentData() {

    const rollNo = document.getElementById("parentStudentId").value.trim();

if (!rollNo) {
    alert("Enter Child Roll Number");
    return;
}

const response = await fetch(
    `https://edutrack-m2ls.onrender.com/api/student/roll/${rollNo}`
);

const data = await response.json();

if (!response.ok) {
    alert(data.message);
    return;
}

console.log(data);

    // PDF ke liye
    window.studentData = data;
    
    const student = data.student;

    localStorage.setItem("selectedStudentRollNo", student.rollNo);

    // Attendance Summary
   const totalAttendance = data.attendanceSummary.total;

const presentAttendance = data.attendanceSummary.present;

const absentAttendance = data.attendanceSummary.absent;

const attendancePercent = data.attendanceSummary.percentage;

    // Marks
    let totalMarks = 0;
    let marksHTML = "";

    data.marks.forEach(item => {

        totalMarks += Number(item.marks);

        let grade = "";
        let result = "";

        if (item.marks >= 90) grade = "O";
        else if (item.marks >= 80) grade = "E";
        else if (item.marks >= 70) grade = "A";
        else if (item.marks >= 60) grade = "B";
        else if (item.marks >= 50) grade = "C";
        else if (item.marks >= 40) grade = "D";
        else grade = "F";

        result = item.marks >= 40 ? "PASS" : "FAIL";

        marksHTML += `
        <tr>
            <td>${item.subject}</td>
            <td>${item.marks}</td>
            <td>${grade}</td>
            <td>${result}</td>
        </tr>
        `;
    });

    const average =
        data.marks.length > 0
        ? (totalMarks / data.marks.length).toFixed(2)
        : 0;

    // Overall Result
    const overallResult =
        data.marks.every(item => item.marks >= 40)
        ? "PASS"
        : "FAIL";

        // Recent Attendance
let attendanceHTML = "";

data.recentAttendance
.sort((a,b)=>new Date(b.date)-new Date(a.date))
.forEach(item=>{

    attendanceHTML += `
    <tr>
        <td>${new Date(item.date).toLocaleDateString("en-GB")}</td>
        <td>${item.status === "present" ? "✅ Present" : "❌ Absent"}</td>
    </tr>
    `;

});

    // Notices
    let noticesHTML = "";

    data.notices.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
.slice(0, 4).forEach(item => {

        noticesHTML += `

        <div class="notice-card">

            <div class="notice-header">

                <h4>📢 ${item.title}</h4>

                <span class="notice-date">
                    📅 ${new Date(item.createdAt).toLocaleDateString("en-GB")}
                </span>

            </div>

            <p>${item.message}</p>

        </div>

        `;
    });

    document.getElementById("parentData").innerHTML = `

<div class="role-box">

<h2>Child Details</h2>

<div class="profile-card">

${student.photo
? `<img src="https://edutrack-m2ls.onrender.com/uploads/${student.photo}"
width="120"
height="120"
style="border-radius:50%;object-fit:cover;margin-bottom:15px;">`
: `<img src="https://via.placeholder.com/120"
width="120"
height="120"
style="border-radius:50%;margin-bottom:15px;">`
}

<p><b>Name:</b> ${student.name}</p>

<p><b>Email:</b> ${student.email}</p>

<p><b>Roll No:</b> ${student.rollNo || "-"}</p>

<p><b>Department:</b> ${student.department || "-"}</p>

<p><b>Semester:</b> ${student.semester || "-"}</p>

<p><b>Phone:</b> ${student.phone || "-"}</p>

</div>

<button onclick="downloadResultPDF()">
📄 Download Result PDF
</button>

<h3>Attendance Summary</h3>

<div class="attendance-summary">

<p><b>Total Classes:</b> ${totalAttendance}</p>

<p><b>Present:</b> ${presentAttendance}</p>

<p><b>Absent:</b> ${absentAttendance}</p>

<p><b>Attendance:</b> ${attendancePercent}%</p>

</div>

<h3>📅 Recent Attendance</h3>

<table border="1" cellpadding="10" cellspacing="0" width="100%">

<tr>
    <th>Date</th>
    <th>Status</th>
</tr>

${attendanceHTML}

</table>

<br>

<button onclick="viewAttendanceHistory()">
📋 View Full Attendance
</button>

<br><br>

<h3>Marks</h3>

<table border="1" cellpadding="10" cellspacing="0" width="100%">

<tr>

<th>Subject</th>
<th>Marks</th>
<th>Grade</th>
<th>Result</th>

</tr>

${marksHTML}

</table>

<br>

<p><b>Average Marks:</b> ${average}</p>

<p><b>Overall Result:</b> ${overallResult}</p>

<h3>📢 Latest Notices</h3>

${noticesHTML}

</div>

`;

}



// ================= ADD ATTENDANCE =================
async function addAttendance() {

  const rollNo =
document.getElementById("studentRollNo").value;

  const status =
    document.getElementById("attendanceStatus").value;

  const response = await fetch(
    "https://edutrack-m2ls.onrender.com/api/teacher/attendance",
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        rollNo,
        status,
      }),
    }
  );

  const data = await response.json();

  alert(data.message);
  document.getElementById("studentRollNo").value="";

document.getElementById("attendanceStatus").value="present";
}



// ================= ADD MARKS =================
async function addMarks() {

    const rollNo = document
        .getElementById("marksRollNo")
        .value
        .trim();

    const subject = document
        .getElementById("subject")
        .value
        .trim();

    const marks = document
        .getElementById("marks")
        .value
        .trim();

    if (!rollNo || !subject || !marks) {

        alert("Please fill all fields.");

        return;

    }

    const response = await fetch(
        "https://edutrack-m2ls.onrender.com/api/teacher/marks",
        {

            method: "POST",

            headers: {

                "Content-Type": "application/json"

            },

            body: JSON.stringify({

                rollNo,

                subject,

                marks

            })

        }
    );

    const data = await response.json();

    // Subject already exists
    if (data.update) {

        const confirmUpdate = confirm(
            `Marks for "${subject}" already exist.\n\nDo you want to update them?`
        );

        if (!confirmUpdate) return;

        const updateResponse = await fetch(
            "https://edutrack-m2ls.onrender.com/api/teacher/marks",
            {

                method: "PUT",

                headers: {

                    "Content-Type": "application/json"

                },

                body: JSON.stringify({

                    rollNo,

                    subject,

                    marks

                })

            }
        );

        const updateData = await updateResponse.json();

        alert(updateData.message);

    }

    else {

        alert(data.message);

    }

    // Clear Fields
    document.getElementById("subject").value = "";
    document.getElementById("marks").value = "";

}

async function fetchStudentDetails() {

    const rollNo = document
        .getElementById("marksRollNo")
        .value
        .trim();

    if (!rollNo) {

        document.getElementById("studentInfoCard").style.display="none";
        return;

    }

    try{

        const response = await fetch(
            `https://edutrack-m2ls.onrender.com/api/teacher/student/${rollNo}`
        );

        const data = await response.json();

        if(!response.ok){

            document.getElementById("studentInfoCard").innerHTML=`
                <div class="student-info error">
                    ❌ Student Not Found
                </div>
            `;

            document.getElementById("studentInfoCard").style.display="block";

            return;

        }

    document.getElementById("studentInfoCard").innerHTML = `

<div class="student-info">

<h4>🎓 Student Information</h4>

<hr>

<p>👤 <b>Name :</b> ${data.name}</p>

<p>🏢 <b>Department :</b> ${data.department || "-"}</p>

<p>🎓 <b>Semester :</b> ${data.semester || "-"}</p>

</div>

`;

        document.getElementById("studentInfoCard").style.display="block";

    }

    catch(err){

        console.log(err);

    }

}



// ================= ADD NOTICE =================
async function addNotice() {

  const title =
    document.getElementById("noticeTitle").value;

  const message =
    document.getElementById("noticeMessage").value;

  const response = await fetch(
    "https://edutrack-m2ls.onrender.com/api/teacher/notice",
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        title,
        message,
      }),
    }
  );

  const data = await response.json();

  alert(data.message);
}



// ================= LOGOUT =================
function logout() {

  localStorage.removeItem("token");

  localStorage.removeItem("role");

  localStorage.removeItem("userId");

  window.location.href = "../login.html";
}

function goDashboard() {
    location.reload();
}
// ================= VIEW ALL STUDENTS =================

async function viewStudents() {

  try {

    const response = await fetch(
      "https://edutrack-m2ls.onrender.com/api/teacher/students"
    );

    const students = await response.json();

    // Store students globally for search
    window.allStudents = students;

    displayStudents(students,"All Students");

  } catch (error) {

    alert("Unable to load students.");

    console.log(error);

  }

}



// ================= DISPLAY STUDENTS =================

function displayStudents(students,title="Students"){

  let html = `

    <h2>${title}</h2>

    <table border="1" cellpadding="10" cellspacing="0" width="100%">

    <tr>
    <th>Name</th>
    <th>Department</th>
    <th>Roll No</th>
    <th>Semester</th>
    <th>Action</th>
</tr>

  `;

  students.forEach(student => {

    html += `

      <tr>

  <td>${student.name}</td>

<td>${student.department || "-"}</td>

<td>${student.rollNo || "-"}</td>

<td>${student.semester || "-"}</td>

<td>
    <button onclick="deleteStudent('${student._id}')">
        Delete
    </button>
</td>

      </tr>

    `;

  });

  html += "</table>";

  document.getElementById("studentsList").innerHTML = html;

}



// ================= SEARCH STUDENT =================

async function searchStudent() {

    const keyword = document
        .getElementById("searchStudent")
        .value
        .trim();

    if (keyword === "") {

        alert("Please enter Name or Roll No");
        return;

    }

    try {

        const response = await fetch(
            `https://edutrack-m2ls.onrender.com/api/teacher/search/${keyword}`
        );

        const students = await response.json();

        if(students.length===0){

            document.getElementById("studentsList").innerHTML=`
                <h3>No Student Found</h3>
            `;

            return;

        }

        displayStudents(students,"Search Result");

    } catch (error) {

        console.log(error);

    }

}



// ================= DELETE STUDENT =================

async function deleteStudent(id) {

  const confirmDelete = confirm(
    "Are you sure you want to delete this student?"
  );

  if (!confirmDelete) return;

  try {

    const response = await fetch(

      `https://edutrack-m2ls.onrender.com/api/teacher/students/${id}`,

      {
        method: "DELETE"
      }

    );

    const data = await response.json();

    alert(data.message);

    viewStudents();

  } catch (error) {

    alert("Unable to delete student.");

    console.log(error);

  }

}
// ================= EDIT STUDENT =================

async function editStudent(id, name, rollNo, department,semester, phone) {

  const newName = prompt("Enter Name", name);
  if (newName === null) return;

  const newRoll = prompt("Enter Roll No", rollNo);
  if (newRoll === null) return;

  const newDepartment = prompt("Enter Department", department);
if (newDepartment === null) return;

const newSemester = prompt("Enter Semester", semester);
if (newSemester === null) return;

  const newPhone = prompt("Enter Phone", phone);
  if (newPhone === null) return;

  const response = await fetch(
    `https://edutrack-m2ls.onrender.com/api/teacher/students/${id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: newName,
        rollNo: newRoll,
        department: newDepartment,
        semester: newSemester,
        phone: newPhone,
      }),
    }
  );

  

  const data = await response.json();

  alert(data.message);

  viewStudents();
}

// ================= DOWNLOAD RESULT PDF =================

function downloadResultPDF() {

    const { jsPDF } = window.jspdf;

    const doc = new jsPDF();

    const data = window.studentData;
    const student = data.student;

   // ===== Header =====
doc.setFillColor(25, 118, 210);
doc.rect(0, 0, 210, 30, "F");

doc.setTextColor(255, 255, 255);
doc.setFont("helvetica", "bold");
doc.setFontSize(20);

doc.text("EDUTRACK ERP", 105, 12, {
    align: "center"
});

doc.setFontSize(11);

doc.text("College Student Academic Report", 105, 21, {
    align: "center"
});

doc.setTextColor(0, 0, 0);

let y = 45;



    // ===== Student Details =====

// Box
doc.setDrawColor(180);
doc.roundedRect(15, y, 180, 55, 3, 3);

// Heading
doc.setFontSize(14);
doc.setFont("helvetica", "bold");
doc.text("Student Details", 20, y + 8);
// Photo Border
doc.setDrawColor(150);
doc.rect(155, y + 8, 28, 35);

// Normal Font
doc.setFontSize(11);
doc.setFont("helvetica", "normal");

doc.text(`Name : ${student.name}`, 20, y + 18);

doc.text(`Roll No : ${student.rollNo || "-"}`, 95, y + 18);

doc.text(`Email : ${student.email}`, 20, y + 28);

doc.text(`Department : ${student.department || "-"}`, 20, y + 38);

doc.text(`Semester : ${student.semester || "-"}`, 95, y + 38);

doc.text(`Phone : ${student.phone || "-"}`, 20, y + 48);

if (student.photo) {

    const img = new Image();

    img.crossOrigin = "Anonymous";

    img.src = `https://edutrack-m2ls.onrender.com/uploads/${student.photo}`;

    doc.addImage(img, "JPEG", 155, y + 8, 28, 35);

}

y += 65;

  // ===== Marks Table =====

doc.setFontSize(14);
doc.setFont("helvetica", "bold");
doc.text("Semester Marks", 15, y);

y += 8;

let total = 0;

const tableData = [];

data.marks.forEach((item) => {

    total += Number(item.marks);

    let grade = "";
let result = "";

if (item.marks >= 90)
    grade = "O";
else if (item.marks >= 80)
    grade = "E";
else if (item.marks >= 70)
    grade = "A";
else if (item.marks >= 60)
    grade = "B";
else if (item.marks >= 50)
    grade = "C";
else if (item.marks >= 40)
    grade = "D";
else
    grade = "F";

result = item.marks >= 40 ? "PASS" : "FAIL";

    tableData.push([
        item.subject,
        item.marks,
        grade,
        result
    ]);

});

doc.autoTable({

    startY: y,

    head: [[
        "Subject",
        "Marks",
        "Grade",
        "Result"
    ]],

    body: tableData,

    theme: "grid",

    headStyles: {
        fillColor: [25,118,210],
        halign: "center"
    },

    styles: {
        halign: "center"
    }

});

y = doc.lastAutoTable.finalY + 10;

    const percentage =
(total / (data.marks.length * 100) * 100).toFixed(2);
const overallResult =
data.marks.every(item => item.marks >= 40)
? "PASS"
: "FAIL";
let overallGrade = "";

if (percentage >= 90)
    overallGrade = "O";
else if (percentage >= 80)
    overallGrade = "E";
else if (percentage >= 70)
    overallGrade = "A";
else if (percentage >= 60)
    overallGrade = "B";
else if (percentage >= 50)
    overallGrade = "C";
else if (percentage >= 40)
    overallGrade = "D";
else
    overallGrade = "F";
const maxMarks = data.marks.length * 100;


doc.setFont("helvetica", "bold");
doc.setFontSize(11);

// Row 1
doc.text(`Total Subjects : ${data.marks.length}`, 20, y);
doc.text(`Maximum Marks : ${maxMarks}`, 110, y);

// Row 2
doc.text(`Obtained Marks : ${total}`, 20, y + 10);
doc.text(`Percentage : ${percentage}%`, 110, y + 10);

// Row 3
doc.text(`Overall Grade : ${overallGrade}`, 20, y + 20);
doc.text(`Overall Result : ${overallResult}`, 110, y + 20);

y += 35;

    // ===== Attendance Summary =====

const totalAttendance = data.attendanceSummary.total;

const presentAttendance = data.attendanceSummary.present;

const absentAttendance = data.attendanceSummary.absent;

const percent = data.attendanceSummary.percentage;

// Box
doc.setDrawColor(180);
doc.roundedRect(15, y, 180, 40, 3, 3);

// Heading
doc.setFontSize(14);
doc.setFont("helvetica", "bold");
doc.text("Attendance Summary", 20, y + 8);

doc.setFontSize(11);
doc.setFont("helvetica", "normal");

doc.text(`Total Classes : ${totalAttendance}`, 20, y + 18);

doc.text(`Present : ${presentAttendance}`, 110, y + 18);

doc.text(`Absent : ${absentAttendance}`, 20, y + 30);

doc.text(`Attendance : ${percent}%`, 110, y + 30);

y += 50;



// Generated On
doc.setFont("helvetica", "italic");
doc.setFontSize(10);

const generatedDate = new Date().toLocaleDateString("en-GB");

doc.text(
    `Generated On : ${generatedDate}`,
    20,
    y
);

// Line
y += 8;

doc.setDrawColor(200);
doc.line(15, y, 195, y);

// Footer
y += 8;

doc.setFont("helvetica", "bold");
doc.setFontSize(10);

doc.text(
    "Generated by EduTrack ERP",
    105,
    y,
    { align: "center" }
);
    doc.save("EduTrack_Result.pdf");
}

let selectedStudentId = "";




function openEditProfile(){

    const student = window.studentData.student;

    document.getElementById("editName").value = student.name || "";

    document.getElementById("editEmail").value = student.email || "";

    document.getElementById("editRoll").value = student.rollNo || "";

    document.getElementById("editDepartment").value =
     student.department || "";

    document.getElementById("editSemester").value =
     student.semester || "";

    document.getElementById("editPhone").value = student.phone || "";

    document.getElementById("editProfileModal").style.display = "flex";

}

function closeEditProfile() {

    document.getElementById("editProfileModal").style.display = "none";

}

async function saveProfile() {

    try {
        const profileResponse = await fetch(
            `https://edutrack-m2ls.onrender.com/api/student/update/${userId}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
               body: JSON.stringify({
    name: document.getElementById("editName").value,
    email: document.getElementById("editEmail").value,
    rollNo: document.getElementById("editRoll").value,
    department: document.getElementById("editDepartment").value,
    semester: document.getElementById("editSemester").value,
    phone: document.getElementById("editPhone").value
})
            }
        );

        const profileData = await profileResponse.json();

        if (!profileResponse.ok) {
            alert(profileData.message);
            return;
        }

        
        const photoInput = document.getElementById("editPhoto");

        if (photoInput.files.length > 0) {

            const formData = new FormData();
            formData.append("photo", photoInput.files[0]);

            const photoResponse = await fetch(
                `https://edutrack-m2ls.onrender.com/api/student/photo/${userId}`,
                {
                    method: "POST",
                    body: formData
                }
            );

            const photoData = await photoResponse.json();

            if (!photoResponse.ok) {
                alert(photoData.message);
                return;
            }
        }

        alert("Profile Updated Successfully");

        closeEditProfile();

        location.reload();

    } catch (error) {

        console.log(error);

        alert("Something went wrong.");

    }

}

function viewAttendanceHistory(){

    window.location.href="attendance.html";

}
