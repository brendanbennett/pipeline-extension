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

function isLoading() {
    const val = localStorage.getItem("loading");
    return ((val === "1") ? true : false)
}

function loader(boolean) {
    let spinner = document.getElementById("spinner");
    spinner.style.visibility = (boolean ? "visible" : "hidden");
    localStorage.setItem("loading", (boolean ? "1" : "0"));
}

function addTextOutput(text) {
    let outputSection = document.getElementById("output-section");
    const para = document.createElement("p");
    const textDiv = document.createElement("div");
    textDiv.className = "text-div";
    para.textContent = text;
    para.className = "output-text";
    textDiv.appendChild(para);
    outputSection.appendChild(textDiv);
}

function addImageOutput(raw) {
    let outputSection = document.getElementById("output-section");
    const image = document.createElement("img");
    const imageDiv = document.createElement("div");
    imageDiv.className = "imageDiv";
    image.src = "data:image/png;base64," + raw;
    image.className = "output-image";
    imageDiv.appendChild(image);
    outputSection.appendChild(imageDiv);
}

async function getInput() {
    if (!isLoading()) {
        let inputVal = document.getElementById("multilineTextInput").value;
        let model = document.getElementById("model").value;

        if (inputVal.length === 0) {
            inputVal = document.getElementById("multilineTextInput").placeholder;
        }
        let response;
        let response_text;

        loader(true)
        switch (model) {
            case "gptj":
                response = await fetchText(inputVal, 32);
                response_text = inputVal + JSON.parse(response)["result"];
                addTextOutput(response_text);
                break;
            case "dalle-mega":
                response = await fetchImage(inputVal);
                response_text = JSON.parse(response)["result"];
                addImageOutput(response_text);
                break;
            default:
                console.log(`${model} not implemented!`);
        }
        loader(false)
        console.log(response_text);
    }
}

function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

function onChangeModel() {
    let model = document.getElementById("model").value;
    let button = document.getElementById("generate");
    const buttonText = { "gptj": "Generate Text", "dalle-mega": "Generate Image" };
    button.textContent = buttonText[model];

    let outputSection = document.getElementById("output-section");
    removeAllChildNodes(outputSection);
}

function initialiseDom() {
    onChangeModel()
    loader(false)
}

generate.addEventListener("click", () => getInput());
model.addEventListener("change", () => onChangeModel());
document.addEventListener("DOMContentLoaded", () => initialiseDom());