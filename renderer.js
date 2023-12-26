async function loadDocx(docxData) {
    window.main.loadDocxFile(docxData);
}

docxLoadBtn.onclick = function () {
    loadDocx("1.docx");
};

window.addEventListener("message", (event) => {
    if (event.source === window) {
        let docxBlob = event.data;
        docx.renderAsync(docxBlob, document.getElementById("docxViewer"))
            .then(x => console.log("docx: finished"));
    }
});
