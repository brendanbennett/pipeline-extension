async function fetchText(request_text, tokens) {
    let request_dict = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: { text: request_text, tokens: tokens } }),
    }
    let response = await fetch("https://pipeline-extension-backend-y94hx.ondigitalocean.app/gptj", request_dict);
    return response.text();
}

async function fetchImage(request_text) {
    let request_dict = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: { text: request_text } }),
    }
    let response = await fetch("https://pipeline-extension-backend-y94hx.ondigitalocean.app/dallemega", request_dict);
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

function makeCopied(textDiv) {
    const img = textDiv.querySelector(".copy-div > img");
    const copiedPara = textDiv.querySelector(".copied-text");
    setImgTick(img);
    copiedPara.textContent = "Copied!";
}

function resetCopy(textDiv) {
    const img = textDiv.querySelector(".copy-div > img");
    const copiedPara = textDiv.querySelector(".copied-text");
    setImgCopy(img);
    copiedPara.textContent = "";
}

function copyTextFromPara(textDiv) {
    const para = textDiv.querySelector(".output-text");
    navigator.clipboard.writeText(para.textContent);
    makeCopied(textDiv);
    setTimeout(() => resetCopy(textDiv), 2000);
}

function renderTextOutput(text) {
    let outputSection = document.getElementById("output-section");
    const para = document.createElement("p");
    const lowerBar = document.createElement("div");
    const copyImg = document.createElement("img");
    const textDiv = document.createElement("div");
    const moreButton = document.createElement("button");
    setImgCopy(copyImg);
    copyImg.addEventListener("click", () => copyTextFromPara(textDiv));
    const copyDiv = document.createElement("div");
    copyDiv.className = "copy-div"
    copyDiv.appendChild(copyImg)
    const copiedText = document.createElement("p");
    copiedText.className = "copied-text";
    lowerBar.className = "lower-output-bar";
    moreButton.className = "more-button";
    moreButton.textContent = "More...";
    moreButton.addEventListener("click", () => getMoreText(textDiv));
    lowerBar.appendChild(moreButton);
    lowerBar.appendChild(copyDiv);
    lowerBar.appendChild(copiedText);
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
                response = await fetchText(inputVal, 48);
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

function setImgTick(img) {
    img.src = "./images/tick.png";
}

function setImgCopy(img) {
    img.src = "./images/copy.png";
}

async function getMoreText(parentDiv) {
    const para = parentDiv.querySelector(".output-text");
    const copyDiv = parentDiv.querySelector(".copy-div");
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

    // let outputSection = document.getElementById("output-section");
    // removeAllChildNodes(outputSection);
}

function initialiseDom() {
    onChangeModel();
    loader(false);

    // Mock data
    // renderTextOutput("Among the most mysterious things known to humans is the nature and origin of consciousness. For many, it is impossible to conceive of humans having evolved to have consciousness before their brains evolved, and even less possible");
}

logo.addEventListener("click", () => chrome.tabs.create({url: "https://www.pipeline.ai/"}));
generate.addEventListener("click", () => getInput());
model.addEventListener("change", () => onChangeModel());
document.addEventListener("DOMContentLoaded", () => initialiseDom());