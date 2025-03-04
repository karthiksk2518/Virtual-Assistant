import React, { useContext } from 'react';
import "./App.css";
import maya from "./assets/maya.png";
import speakImg from "./assets/speak.gif";
import aiVoice from "./assets/aiVoice.gif";
import { FaMicrophoneAlt } from "react-icons/fa";
import { StoreContext } from './context/StoreContext';

const App = () => {
  let { recognition, command, setCommand, answer, setAnswer } = useContext(StoreContext);

  return (
    <div className='main'>
      <img src={maya} alt="maya" id="maya" />
      <span>I'm Maya, Your Advanced Virtual Assistant</span>
      {!command ?
        <button
          onClick={() => {
            setCommand(true)
            setAnswer(false)
            recognition.start()
          }}
        >
          Click here <FaMicrophoneAlt />
        </button> 
        : 
        <div className='listening'>
          {!answer ?
            <img src={ speakImg } alt="listen" id='speak'/>
            :
            <img src={ aiVoice } alt="aiVoice" id='ai-voice'/>
          }
        </div>
      }
    </div>
  );
}

export default App;
