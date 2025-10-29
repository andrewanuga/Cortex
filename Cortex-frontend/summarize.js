import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: "AIzaSyBaiOQF-kbd7g_rCipwC5wttokFuxfzfpU" });

const geminiSummarize = async (prompt) => {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    // "AIzaSyBaiOQF-kbd7g_rCipwC5wttokFuxfzfpU" - API_KEY
  });
  console.log(response.text);
}

const summarize = async () => {
    if ('Summarizer' in self) {
        console.log("Summarizer is available");
        const availability = await Summarizer.availability();
        if (availability === 'downloadable' || availability === 'available') {
            // Summarizer is available, you can use its features here
            console.log("Summarizer is ready to use");
            const summariser = await Summarizer.create({
                type: "key-points",
                expectedInputLanguages: ["en", "ja", "es"],
                outputLanguage: "en",
                expectedContextLanguages: ["en"],
                monitor(m) {
                    console.log(`Summarizer progress: ${m.progress}% - Status: ${m.status}`);
                    m.addEventListener('progress', (event) => {
                        console.log(`Summarizer event progress: ${event.progress}% - Status: ${event.status}`);
                    })
                }
            });

            const longText = document.querySelector('article').innerHTML;
            // FIX: Changed 'summarizer' to 'summariser' to match the variable declaration above
            const stream = summariser.summarizeStreaming(longText, {
                context: 'This article is for users, make it simple and small',
            });
            for await (const chunk of stream) {
                console.log(chunk);
            }

        }
        else if (availability === 'unavailable') {
            console.log("Summarizer is unavailable");
            const userText = ""
            const prompt = `Quickly Summarize in less than 100 words - ${userText}`
            await geminiSummarize(prompt);
        }
    }
    else {
        console.log("Summarizer availability unknown: User device may not support it or insuffient disk space");
    }
    // console.log("Summarizer Function Runs")
}

export default summarize