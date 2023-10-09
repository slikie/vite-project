import { useState, useRef } from "react";
import {  Input, Button, Progress } from "@nextui-org/react";

const AntiGPTComponent = () => {

  const [isLoading, setIsLoading] = useState(false);
  const [responseData, setResponseData] = useState("");
  const [inputText, setInputText] = useState("");

  const inputRef = useRef(null);


  const handleSubmit = () => {
    setIsLoading(true);
    if (inputRef.current) {
        inputRef.current.blur();
    }
    const jsonData = JSON.stringify({ text: inputText });

    fetch('https://a.2345781.xyz/antigpt', {
      method: 'POST',
      body: jsonData,
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => response.json())
      .then(data => {
        console.log(data);
        setResponseData(data);
        setIsLoading(false);
      })
      .catch(error => {
        console.error(error);
      });
  };

  return (
    <>
      <h2>AntiGPT</h2>

      <Input
        ref={inputRef}
        placeholder="Text to detect"
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
      />

      <Button 
        color="primary"
        icon="search" 
        loading={isLoading}
        onClick={handleSubmit}
      >
        Send to AntiGPT
      </Button>

      {responseData && (
        <>
          <h4>Result</h4>

          <div>
            Authenticity - {responseData.data.isHuman}%
          </div>

          <Progress value={responseData.data.isHuman} />

          <div>
            AI Confidence - {responseData.data.fakePercentage}%
          </div>

          <Progress value={responseData.data.fakePercentage} />

          <div>
            detected_language - {responseData.data.detected_language}
          </div>

          <div>
            aiWords - {responseData.data.aiWords} / {responseData.data.textWords}
          </div>

          {responseData.data.additional_feedback && (
            <div>
              additional_feedback - {responseData.data.additional_feedback}
            </div>
          )}
        </>
      )}
    </>
  );
};

export default AntiGPTComponent;