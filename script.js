
// ========================================
// FORMA - STUDENT ID CARD GENERATOR
// Automatic Card Generation + Photo Upload
// ========================================

const studentForm = document.getElementById("studentForm");

const photoInput = document.getElementById("studentPhoto");
const photoPreview = document.getElementById("photoPreview");

const studentGrid = document.querySelector(".student-grid");

let uploadedPhoto = "";

// Preview uploaded photograph
photoInput.addEventListener("change", function () {

    const file = this.files[0];

    if (!file) {
        uploadedPhoto = "";
        photoPreview.textContent = "Photo preview will appear here";
        return;
    }

    if (!file.type.startsWith("image/")) {
        alert("Please upload a valid image.");
        this.value = "";
        uploadedPhoto = "";
        photoPreview.textContent = "Photo preview will appear here";
        return;
    }

    // Limit photo size to 5 MB
    if (file.size > 5 * 1024 * 1024) {
        alert("Image size must be less than 5 MB.");
        this.value = "";
        uploadedPhoto = "";
        photoPreview.textContent = "Photo preview will appear here";
        return;
    }

    const reader = new FileReader();

    reader.onload = function (event) {

        uploadedPhoto = event.target.result;

        photoPreview.replaceChildren();

        const image = document.createElement("img");
        image.src = uploadedPhoto;
        image.alt = "Student photo preview";

        photoPreview.appendChild(image);
    };

    reader.readAsDataURL(file);
});


// Generate student card
studentForm.addEventListener("submit", function (event) {

    event.preventDefault();

    // Get form values
    const name = document.getElementById("studentName").value.trim();
    const roll = document.getElementById("studentRoll").value.trim();
    const course = document.getElementById("studentCourse").value.trim();
    const department = document.getElementById("studentDepartment").value.trim();
    const academicYear = document.getElementById("academicYear").value.trim();
    const semester = document.getElementById("studentSemester").value.trim();

    // Check required fields
    if (!name || !roll || !course || !department || !academicYear) {
        alert("Please fill in all required fields.");
        return;
    }

    // Prevent duplicate student IDs
    const existingCards = document.querySelectorAll(".student-card");

    for (const card of existingCards) {
        if (card.dataset.roll === roll) {
            alert("A student with this ID already exists.");
            return;
        }
    }

    // Create card
    const card = document.createElement("article");
    card.className = "student-card generated-card";
    card.dataset.roll = roll;

    // Card header
    const header = document.createElement("div");
    header.className = "student-card-head";

    const institution = document.createElement("div");
    institution.className = "institution-lockup";

    const emblem = document.createElement("span");
    emblem.className = "small-emblem";
    emblem.textContent = "U";

    const institutionDetails = document.createElement("div");

    const institutionName = document.createElement("b");
    institutionName.textContent = "YOUR INSTITUTION";

    const institutionSubtitle = document.createElement("small");
    institutionSubtitle.textContent = "STUDENT IDENTITY CARD";

    institutionDetails.append(institutionName, institutionSubtitle);
    institution.append(emblem, institutionDetails);

    const serial = document.createElement("span");
    serial.className = "serial";
    serial.textContent = "ID: " + roll;

    header.append(institution, serial);

    // Card main section
    const main = document.createElement("div");
    main.className = "student-card-main";

    const photo = document.createElement("div");
    photo.className = "student-photo";

    if (uploadedPhoto) {
        const image = document.createElement("img");
        image.src = uploadedPhoto;
        image.alt = name + " photograph";
        photo.appendChild(image);
    } else {
        photo.textContent = "NO PHOTO";
    }

    const data = document.createElement("div");
    data.className = "student-data";

    function addField(label, value, heading = false) {
        const wrapper = document.createElement("div");

        const fieldLabel = document.createElement("span");
        fieldLabel.className = "field-label";
        fieldLabel.textContent = label;

        const fieldValue = document.createElement(heading ? "h3" : "p");
        fieldValue.textContent = value || "Not provided";

        wrapper.append(fieldLabel, fieldValue);
        data.appendChild(wrapper);
    }

    addField("STUDENT NAME", name, true);
    addField("STUDENT ID / ROLL NO.", roll);
    addField("COURSE / DEPARTMENT", course + " / " + department);

    main.append(photo, data);

    // Academic information
    const meta = document.createElement("div");
    meta.className = "student-card-meta";

    function addMeta(label, value) {
        const wrapper = document.createElement("div");

        const fieldLabel = document.createElement("span");
        fieldLabel.className = "field-label";
        fieldLabel.textContent = label;

        const fieldValue = document.createElement("b");
        fieldValue.textContent = value || "Not provided";

        wrapper.append(fieldLabel, fieldValue);
        meta.appendChild(wrapper);
    }

    addMeta("ACADEMIC YEAR", academicYear);
    addMeta("YEAR / SEMESTER", semester);

    // Footer
    const footer = document.createElement("div");
    footer.className = "student-card-bottom";

    const authorized = document.createElement("span");
    authorized.textContent = "AUTHORIZED STUDENT";

    const brand = document.createElement("span");
    brand.textContent = "FORMA ◆";

    footer.append(authorized, brand);

    // Card action buttons
    const actions = document.createElement("div");
    actions.className = "card-actions";

    const printButton = document.createElement("button");
    printButton.type = "button";
    printButton.className = "card-action print-button";
    printButton.textContent = "Print ID";

    printButton.addEventListener("click", function () {
        document.querySelectorAll(".student-card")
            .forEach(item => item.classList.remove("print-selected"));

        card.classList.add("print-selected");
        document.body.classList.add("printing-one");

        window.print();
    });

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "card-action delete-button";
    deleteButton.textContent = "Delete";

    deleteButton.addEventListener("click", function () {
        if (confirm("Delete this student ID card?")) {
            card.remove();
        }
    });

    actions.append(printButton, deleteButton);


    // Assemble complete card
    card.append(header, main, meta, footer, actions);

    // Add new card at the beginning
    studentGrid.prepend(card);

    // Reset form and preview
    studentForm.reset();
    uploadedPhoto = "";
    photoPreview.textContent = "Photo preview will appear here";

    alert("Student ID card generated successfully!");

    card.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });
});


// Restore normal page after printing
window.addEventListener("afterprint", function () {
    document.body.classList.remove("printing-one");

    document.querySelectorAll(".student-card")
        .forEach(card => card.classList.remove("print-selected"));
});
