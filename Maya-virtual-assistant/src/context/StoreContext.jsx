import React, { createContext, useEffect, useState } from "react";
import run from "../gemini";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
    const [voices, setVoices] = useState([]);
    const [command, setCommand] = useState(false);
    const [answer, setAnswer] = useState(false);

    useEffect(() => {
        const loadVoices = () => {
            let availableVoices = window.speechSynthesis.getVoices();
            setVoices(availableVoices);
            // console.log("Available Voices:", availableVoices.map(v => v.name + " (" + v.lang + ")"));
        };

        window.speechSynthesis.onvoiceschanged = loadVoices;
        loadVoices();
    }, []);

    const speak = (text) => {
        let textSpeak = new SpeechSynthesisUtterance(text);
        textSpeak.volume = 1;
        textSpeak.rate = 0.9;
        textSpeak.pitch = 1;
        textSpeak.lang = "hi-IN";

        let femaleVoice = voices.find(voice =>
            voice.lang === "hi-IN" && (voice.name.includes("Google") || voice.name.includes("Microsoft Heera"))
        );

        if (femaleVoice) {
            textSpeak.voice = femaleVoice;
            console.log("Using Voice:", femaleVoice.name);
        } else {
            console.warn("Female Hindi voice not found, using default.");
            textSpeak.voice = voices.find(voice => voice.lang === "hi-IN") || voices[0];
        }

        window.speechSynthesis.speak(textSpeak);
    };

    const aiResponse = async (prompt) => {
        let response = await run(prompt);
        console.log(response);
        let newResponse = response.replace(/[*_~`^{}[\]<>|\\]/g, "").replace("google", "Kundan Patidar").replace("Google", "Kundan Patidar");
        speak(newResponse);
        setAnswer(true);
        setTimeout(() => {
            setCommand(false)
        }, 5000)
    }

    let speechRecognition = window.speechRecognition || window.webkitSpeechRecognition

    let recognition = new speechRecognition();
    recognition.onresult = ((e) => {
        let currentIndex = e.resultIndex;
        let transcript = e.results[currentIndex][0].transcript;
        takeInstruction(transcript.toLowerCase());
    })

    const takeInstruction = (instruction) => {
        const now = new Date();
        const options = { timeZone: "Asia/Kolkata", hour12: true };
        
        if (instruction.includes("time")) {
            let time = now.toLocaleTimeString("en-IN", options);
            speak(`The current time is ${time}`);
        } 
        else if (instruction.includes("date")) {
            let date = now.toLocaleDateString("en-IN", { 
                timeZone: "Asia/Kolkata", 
                weekday: "long", 
                year: "numeric", 
                month: "long", 
                day: "numeric" 
            });
            speak(`Today's date is ${date}`);
        }
        else if (instruction.includes("open") && instruction.includes("youtube")) {
            window.open("https://www.youtube.com", "_blank");
            speak("Opening Youtube...");
        }
        else {
            aiResponse(instruction);
        }
    
        setTimeout(() => {
            setCommand(false);
        }, 5000);
    };    

    const contextValue = {
        recognition,
        command,
        setCommand,
        answer,
        setAnswer,
    };

    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    );
};

export default StoreContextProvider;
