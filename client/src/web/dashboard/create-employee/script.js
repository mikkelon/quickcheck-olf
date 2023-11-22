import { createEmployee } from "../../../datahandler.js";

// opret knap

const submitBtn = document.getElementById("submit");
console.log(submitBtn);
submitBtn.addEventListener("click", async () => {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const passwordRep = document.getElementById("repeatPassword").value;
  if (password !== passwordRep) {
    alert("Password matcher ikke");
  } else {
    const employee = { email, password };
    try {
      await createEmployee(employee);
      alert("Bruger oprettet");
    } catch (error) {
      console.log(error);
      if (error.message == "auth/invalid-password") {
        alert("Password skal være på minimum 6 tegn");
      } else if (error.message == "auth/invalid-email") {
        alert("Email er ikke gyldig");
      } else if (error.message == "auth/email-already-exists") {
        alert("Email er allerede i brug");
      } else {
        alert("Der er sket en fejl");
      }
    }
  }
});

// annuller knap

const cancelBtn = document.getElementById("cancel");
cancelBtn.addEventListener("click", () => {
  document.getElementById("name").value = "";
  document.getElementById("email").value = "";
  document.getElementById("phone").value = "";
  document.getElementById("password").value = "";
  document.getElementById("repeatPassword").value = "";
});
