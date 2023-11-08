document.addEventListener("DOMContentLoaded", function() {
    const sourceInput = document.getElementById("source-text");
    const targetInput = document.getElementById("target-text");
    const sourceLang = document.getElementsByName("source-lang");
    const targetLang = document.getElementsByName("target-lang");
    let timeOutId;
    let isLoading = false;

    sourceInput.addEventListener("input", handleTyping);

    function handleTyping() {
        clearTimeout(timeOutId);
        timeOutId = setTimeout(() => {
            translate();
        }, 1000);
    }

    async function translate() {
        if (isLoading || !sourceInput.value.trim()) {
            return;
        }

        isLoading = true;
        const sourceLangChecked = Array.from(sourceLang).find(el => el.checked).value;
        const targetLangChecked = Array.from(targetLang).find(el => el.checked).value;
        targetInput.value = "Traduzindo...";

        const encodedParams = new URLSearchParams();
        encodedParams.append('q', sourceInput.value);
        encodedParams.append('target', targetLangChecked);
        encodedParams.append('source', sourceLangChecked);

        const options = {
            method: 'POST',
            headers: {
                'content-type': 'application/x-www-form-urlencoded',
                'Accept-Encoding': 'application/gzip',
                'X-RapidAPI-Key': '110173bf68mshb8872c8a0e509d9p1b8faejsn311323b48cb5',
                'X-RapidAPI-Host': 'google-translate1.p.rapidapi.com'
            },
            body: encodedParams
        };

        try {
            const response = await fetch('https://google-translate1.p.rapidapi.com/language/translate/v2', options);
            const data = await response.json();
            if (data && data.data && data.data.translations) {
                targetInput.value = data.data.translations[0].translatedText;
            } else {
                throw new Error('Invalid response structure');
            }
        } catch (error) {
            console.error('Translation error:', error);
            targetInput.value = "Erro na tradução. Verifique o console para detalhes.";
        } finally {
            isLoading = false;
        }
    }
});
