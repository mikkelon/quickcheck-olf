import { createEmployee } from "../../../utility/datahandler.js";

// clear fields
const clearFields = () => {
  document.getElementById("name").value = "";
  document.getElementById("email").value = "";
  document.getElementById("password").value = "";
  document.getElementById("repeatPassword").value = "";
};

// opret knap
const submitBtn = document.getElementById("submit");
const alert = document.getElementById("alert");

const toggleLoadingSpinner = () => {
  submitBtn.disabled = !submitBtn.disabled;
  submitBtn.innerHTML = submitBtn.disabled
    ? '<i class="fas fa-spinner fa-pulse fa-lg"></i>'
    : "Opret";
};

submitBtn.addEventListener("click", async () => {
  alert.innerHTML = "";
  toggleLoadingSpinner();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const passwordRep = document.getElementById("repeatPassword").value;
  if (password !== passwordRep) {
    alertMsg("Password matcher ikke", false);
    toggleLoadingSpinner();
  } else {
    const employee = { email, password };
    try {
      await createEmployee(employee);
      alertMsg("Bruger oprettet", true);
      clearFields();
    } catch (error) {
      console.log(error);
      if (error.message == "auth/invalid-password") {
        alertMsg("Password skal være på minimum 6 tegn", false);
      } else if (error.message == "auth/invalid-email") {
        alertMsg("Email er ikke gyldig", false);
      } else if (error.message == "auth/email-already-exists") {
        alertMsg("Email er allerede i brug", false);
      } else {
        alertMsg("Der er sket en fejl", false);
      }
    } finally {
      toggleLoadingSpinner();
    }
  }
});

// annuller knap
const cancelBtn = document.getElementById("cancel");
cancelBtn.addEventListener("click", clearFields);

// alert
const alertMsg = (message, success) => {
  window.scrollTo(0, 0); // scroll to top of page

  alert.innerHTML = `<p>${message}</p>`;

  // remove existing classes
  alert.classList.remove("success");
  alert.classList.remove("error");

  alert.classList.add(success ? "success" : "error");
};
