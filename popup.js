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

function renderTextOutput(text) {
    let outputSection = document.getElementById("output-section");
    const para = document.createElement("p");
    const lowerBar = document.createElement("div");
    const moreButton = document.createElement("button");
    const textDiv = document.createElement("div");
    lowerBar.className = "lower-output-bar";
    moreButton.className = "more-button";
    moreButton.textContent = "More...";
    moreButton.addEventListener("click", () => getMoreText(textDiv));
    lowerBar.appendChild(moreButton);
    textDiv.className = "text-div";
    para.textContent = text;
    para.className = "output-text";
    textDiv.appendChild(para);
    textDiv.appendChild(lowerBar);
    outputSection.appendChild(textDiv);
}

function renderImageOutput(raw) {
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
                renderTextOutput(response_text);
                break;
            case "dalle-mega":
                response = await fetchImage(inputVal);
                response_text = JSON.parse(response)["result"];
                renderImageOutput(response_text);
                break;
            default:
                console.log(`${model} not implemented!`);
        }
        loader(false)
        console.log(response_text);
    }
}

async function getMoreText(parentDiv) {
    const children = parentDiv.children;
    let para;
    for (let i = 0; i < children.length; i++) {
        console.log(children[i].tagName.toLowerCase());
        if (children[i].tagName.toLowerCase() === "p") {
            para = children[i];
            break;
        }
    }
    response = await fetchText(para.textContent, 32);
    response_text = para.textContent + JSON.parse(response)["result"];
    para.textContent = response_text;
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
    onChangeModel();
    loader(false);

    // Mock data
    renderTextOutput("Among the most mysterious things known to humans is the nature and origin of consciousness. For many, it is impossible to conceive of humans having evolved to have consciousness before their brains evolved, and even less possible");
}

generate.addEventListener("click", () => getInput());
model.addEventListener("change", () => onChangeModel());
document.addEventListener("DOMContentLoaded", () => initialiseDom());