async function fetchText(request_text, tokens) {
    let request_dict = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: { text: request_text, tokens: tokens } }),
    }
    let response = await fetch("http://127.0.0.1:5000/gptj", request_dict);
    return response.text();
}

async function fetchImage(request_text) {
    let request_dict = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: { text: request_text } }),
    }
    let response = await fetch("http://127.0.0.1:5000/dallemega", request_dict);
    return response.text();
}

function loader(boolean) {
    let spinner = document.getElementById("spinner")
    spinner.style.visibility = (boolean ? "visible" : "hidden")
}

async function getInput() {
    // Selecting the input element and get its value 
    let inputVal = document.getElementById("multilineTextInput").value;
    let model = document.getElementById("model").value;

    if (inputVal.length === 0) {
        inputVal = document.getElementById("multilineTextInput").placeholder;
    }
    let outputDiv = document.getElementById("output-div");
    let response;
    let response_text;

    loader(true)
    switch (model) {
        case "gptj":
            response = await fetchText(inputVal, 32);
            response_text = JSON.parse(response)["result"];
            const text = document.createElement("p");
            text.textContent = response_text;
            outputDiv.appendChild(text);
            break;
        case "dalle-mega":
            response = await fetchImage(inputVal);
            response_text = JSON.parse(response)["result"];
            const image = document.createElement("img");
            image.src = "data:image/png;base64," + response_text;
            image.id = "output-image";
            outputDiv.appendChild(image);
            break;
        default:
            console.log(`${model} not implemented!`)
    }
    loader(false)
    console.log(response_text);
}

function changeButtonText() {
    let model = document.getElementById("model").value;
    let button = document.getElementById("generate");
    const buttonText = { "gptj": "Generate Text", "dalle-mega": "Generate Image" };
    button.textContent = buttonText[model];
}

function initialiseDom() {
    changeButtonText()
    loader(false)
}

generate.addEventListener("click", () => getInput());
model.addEventListener("change", () => changeButtonText());
document.addEventListener("DOMContentLoaded", () => initialiseDom());