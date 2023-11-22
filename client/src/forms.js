function createFormsContainer(formElements, onSubmit) {
    const formContainer = document.createElement("div");
    formContainer.classList.add("forms-container");

    // const form = document.createElement("form");
    // form.classList.add("form");
    // onSubmit && form.addEventListener("submit", onSubmit);

    formElements.forEach((formElement) => {
        formContainer.appendChild(formElement);
    });

    return formContainer;
}

function createFormElement(labelText, inputType, inputId, inputValue, onChange) {
    const formContainer = document.createElement("div");
    formContainer.classList.add("form-container");
    
    const label = document.createElement("label");
    label.classList.add("forms-label");
    label.textContent = labelText;
    
    const input = document.createElement("input");
    input.classList.add("forms-input");
    input.setAttribute("type", inputType);
    input.setAttribute("id", inputId);
    input.value = inputValue;
    
    formContainer.appendChild(label);
    formContainer.appendChild(input);
    
    onChange && input.addEventListener("change", onChange);
    
    return formContainer;
}

function createDropdownFormElement(
    labelText,
    inputId,
    options,
    optionData,
    selected
) {
    const formContainer = document.createElement("div");
    formContainer.classList.add("form-container");

    const label = document.createElement("label");
    label.classList.add("forms-label");
    label.textContent = labelText;

    let select = document.createElement("select");
    select.classList.add("forms-input");
    select.setAttribute("id", inputId);

    options.forEach((option) => {
        const optionElement = document.createElement("option");
        optionElement.value = option.colorLabel;
        optionElement.textContent = option.colorLabel;

        optionElement.setAttribute(optionData, option.id);

        select.appendChild(optionElement);
    });

    const selectedIndex = options.findIndex(
        (option) => option.id === selected
    );
    select.selectedIndex = selectedIndex;

    formContainer.appendChild(label);
    formContainer.appendChild(select);

    return formContainer;
}

function createTextButton(id, text, onClick, bgColor) {
    const button = document.createElement("button");
    button.classList.add("forms-button");
    button.setAttribute("id", id);
    button.innerHTML = text ?? "";
    button.style.backgroundColor = bgColor ?? "";
    button.addEventListener("click", onClick);

    return button;
}

function createIconButton(id, icon, onClick, bgColor) {
    const button = document.createElement("button");
    button.setAttribute("id", id);
    button.innerHTML = icon ?? "";
    button.addEventListener("click", onClick);
    button.style.backgroundColor = bgColor ?? "";

    return button;
}

export {
    createFormsContainer,
    createFormElement,
    createDropdownFormElement,
    createTextButton,
    createIconButton
};