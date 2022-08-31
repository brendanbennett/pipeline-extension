async function fetchText(request_text, tokens) {
    let request_dict = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: { text: request_text, tokens: tokens } }),
    }
    let response = await fetch("http://127.0.0.1:5000/", request_dict);
    return response.text();
}

async function getInput() {
    // Selecting the input element and get its value 
    let inputVal = document.getElementById("multilineTextInput").value;
    if (inputVal.length === 0) {
        inputVal = document.getElementById("multilineTextInput").placeholder;
    }
    let output = document.getElementById("output");
    // Displaying the value

    let response = await fetchText(inputVal, 32);
    response_text = JSON.parse(response)["result"]
    console.log(response_text);
    // response_text = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
    output.textContent = response_text;
}

generate.addEventListener("click", () => getInput());