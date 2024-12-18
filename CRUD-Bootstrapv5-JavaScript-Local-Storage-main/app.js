// Singleton - Ensures only one instance of UserProfileManager exists
class UserProfileManager {
    constructor() {
        if (UserProfileManager.instance) {
            return UserProfileManager.instance;
        }
        this.userProfiles = this.loadData();
        UserProfileManager.instance = this;
    }

    loadData() {
        return localStorage.getItem('userProfile') 
            ? JSON.parse(localStorage.getItem('userProfile')) 
            : [];
    }

    saveData() {
        localStorage.setItem("userProfile", JSON.stringify(this.userProfiles));
    }

    getAllProfiles() {
        return this.userProfiles;
    }

    addProfile(profile) {
        this.userProfiles.push(profile);
        this.saveData();
    }

    editProfile(index, profile) {
        this.userProfiles[index] = profile;
        this.saveData();
    }

    deleteProfile(index) {
        this.userProfiles.splice(index, 1);
        this.saveData();
    }
}

// Factory - Creates User Objects
class UserFactory {
    static createUser(data) {
        return {
            picture: data.picture || "./image/Profile Icon.webp",
            employeeName: data.employeeName,
            employeeAge: data.employeeAge,
            employeeCity: data.employeeCity,
            employeeEmail: data.employeeEmail,
            employeePhone: data.employeePhone,
            employeePost: data.employeePost,
            startDate: data.startDate,
        };
    }
}

// Prototype - User Prototype for cloning
class UserPrototype {
    constructor(user) {
        this.user = user;
    }

    clone() {
        return { ...this.user };
    }
}

// Adapter - Converts localStorage data to application-friendly format
class DataAdapter {
    static toApplicationFormat(data) {
        return data.map(user => ({
            picture: user.picture,
            employeeName: user.employeeName,
            employeeAge: user.employeeAge,
            employeeCity: user.employeeCity,
            employeeEmail: user.employeeEmail,
            employeePhone: user.employeePhone,
            employeePost: user.employeePost,
            startDate: user.startDate,
        }));
    }
}

// Proxy - Validates data before performing actions
class UserProxy {
    static validateData(user) {
        return user.employeeName && user.employeeEmail && user.employeePhone;
    }
}

// DOM Elements
const form = document.getElementById("myForm"),
    imgInput = document.querySelector(".img"),
    file = document.getElementById("imgInput"),
    userName = document.getElementById("name"),
    age = document.getElementById("age"),
    city = document.getElementById("city"),
    email = document.getElementById("email"),
    phone = document.getElementById("phone"),
    post = document.getElementById("post"),
    sDate = document.getElementById("sDate"),
    submitBtn = document.querySelector(".submit"),
    userInfo = document.getElementById("data"),
    modalTitle = document.querySelector("#userForm .modal-title")
    const newUserBtn = document.querySelector(".newUser");
    newUserBtn.addEventListener('click', () => {
        isEdit = false; // Reset Edit Mode
        form.reset(); // Clear all form fields
        imgInput.src = "./image/Profile Icon.webp"; // Reset the image
        submitBtn.innerText = "Submit"; // Change button text to "Submit"
        modalTitle.innerText = "Fill The Form"; // Change modal title to "Fill The Form"
    });
    
const profileManager = new UserProfileManager();
let isEdit = false, editId;

// Show User Profiles
function showInfo() {
    userInfo.innerHTML = "";
    const profiles = DataAdapter.toApplicationFormat(profileManager.getAllProfiles());
    profiles.forEach((element, index) => {
        userInfo.innerHTML += `
            <tr class="employeeDetails">
                <td>${index + 1}</td>
                <td><img src="${element.picture}" alt="" width="50" height="50"></td>
                <td>${element.employeeName}</td>
                <td>${element.employeeAge}</td>
                <td>${element.employeeCity}</td>
                <td>${element.employeeEmail}</td>
                <td>${element.employeePhone}</td>
                <td>${element.employeePost}</td>
                <td>${element.startDate}</td>
                <td>
                    <button class="btn btn-success" onclick="readInfo(${index})"><i class="bi bi-eye"></i></button>
                    <button class="btn btn-primary" onclick="editInfo(${index})"><i class="bi bi-pencil-square"></i></button>
                    <button class="btn btn-danger" onclick="deleteInfo(${index})"><i class="bi bi-trash"></i></button>
                </td>
            </tr>`;
    });
}
showInfo();



// File Upload
file.onchange = function () {
    if (file.files[0].size < 1000000) { // 1MB
        const reader = new FileReader();
        reader.onload = e => imgInput.src = e.target.result;
        reader.readAsDataURL(file.files[0]);
    } else {
        alert("This file is too large!");
    }
};

// Read Info
function readInfo(index) {
    const profile = profileManager.getAllProfiles()[index];
    const user = new UserPrototype(profile).clone();
    document.querySelector('.showImg').src = user.picture;
    document.querySelector('#showName').value = user.employeeName;
    document.querySelector("#showAge").value = user.employeeAge;
    document.querySelector("#showCity").value = user.employeeCity;
    document.querySelector("#showEmail").value = user.employeeEmail;
    document.querySelector("#showPhone").value = user.employeePhone;
    document.querySelector("#showPost").value = user.employeePost;
    document.querySelector("#showsDate").value = user.startDate;
}

// Edit Info
function editInfo(index) {
    const user = profileManager.getAllProfiles()[index];
    editId = index;
    isEdit = true;
    modalTitle.innerText = "Update The Form";
    submitBtn.innerText = "Update";

    imgInput.src = user.picture;
    userName.value = user.employeeName;
    age.value = user.employeeAge;
    city.value = user.employeeCity;
    email.value = user.employeeEmail;
    phone.value = user.employeePhone;
    post.value = user.employeePost;
    sDate.value = user.startDate;
}

// Delete Info
function deleteInfo(index) {
    if (confirm("Are you sure you want to delete?")) {
        profileManager.deleteProfile(index);
        showInfo();
    }
}

// Add or Update Profile
form.addEventListener('submit', e => {
    e.preventDefault();

    const user = UserFactory.createUser({
        picture: imgInput.src,
        employeeName: userName.value,
        employeeAge: age.value,
        employeeCity: city.value,
        employeeEmail: email.value,
        employeePhone: phone.value,
        employeePost: post.value,
        startDate: sDate.value,
    });

    if (UserProxy.validateData(user)) {
        if (isEdit) {
            profileManager.editProfile(editId, user);
            isEdit = false;
            submitBtn.innerText = "Submit";
            modalTitle.innerText = "Fill The Form";
        } else {
            profileManager.addProfile(user);
        }
        form.reset();
        imgInput.src = "./image/Profile Icon.webp";
        showInfo();
    } else {
        alert("Added Succesfully .");
    }
});


function readInfo(index) {
    const profile = profileManager.getAllProfiles()[index];
    const user = new UserPrototype(profile).clone();

    // Populate modal fields with user data
    document.querySelector('.showImg').src = user.picture; // Update image source
    document.getElementById('showName').value = user.employeeName; // Use .value for input fields
    document.getElementById("showAge").value = user.employeeAge;
    document.getElementById("showCity").value = user.employeeCity;
    document.getElementById("showEmail").value = user.employeeEmail;
    document.getElementById("showPhone").value = user.employeePhone;
    document.getElementById("showPost").value = user.employeePost;
    document.getElementById("showsDate").value = user.startDate;

    // Show the modal
    const viewModal = new bootstrap.Modal(document.getElementById('readData'));
    viewModal.show();
}

function editInfo(index) {
    const user = profileManager.getAllProfiles()[index];
    editId = index;
    isEdit = true;

    modalTitle.innerText = "Update The Form";
    submitBtn.innerText = "Update";

    // Pre-fill form fields with existing data
    imgInput.src = user.picture;
    userName.value = user.employeeName;
    age.value = user.employeeAge;
    city.value = user.employeeCity;
    email.value = user.employeeEmail;
    phone.value = user.employeePhone;
    post.value = user.employeePost;
    sDate.value = user.startDate;

    // Show the form modal
    const formModal = new bootstrap.Modal(document.getElementById('userForm'));
    formModal.show();
}


form.addEventListener('submit', e => {
    e.preventDefault();

    const user = UserFactory.createUser({
        picture: imgInput.src,
        employeeName: userName.value,
        employeeAge: age.value,
        employeeCity: city.value,
        employeeEmail: email.value,
        employeePhone: phone.value,
        employeePost: post.value,
        startDate: sDate.value,
    });

    if (UserProxy.validateData(user)) {
        if (isEdit) {
            profileManager.editProfile(editId, user);
            isEdit = false; // Reset Edit Mode
            submitBtn.innerText = "Submit";
            modalTitle.innerText = "Fill The Form";
        } else {
            profileManager.addProfile(user);
        }
        form.reset();
        imgInput.src = "./image/Profile Icon.webp";

        // Hide form modal and refresh the data
        const formModal = bootstrap.Modal.getInstance(document.getElementById('userForm'));
        formModal.hide();
        showInfo();
    } else {
        alert("Added Succesfully");
    }
});
















