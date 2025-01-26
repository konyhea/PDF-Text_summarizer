import React, { useState } from "react";
import "./Container.css";
import OpenAI from "./Assets/openai-2.svg";
import PDFIcon from "./Assets/pdf-svgrepo-com.svg";
import Upload from "./Assets/c8da9327-9355-4a1d-8fd9-c816d6f67672.svg";
import Submit from "./Assets/arrow_upward_24dp_E8EAED_FILL0_wght400_GRAD0_opsz24.svg";

export default function Container() {
  const [value, setValue] = useState(""); // Default to an empty string
  const [data, setData] = useState([]); // Store summaries in an array
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    setSubmitting(true);
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + String(process.env.REACT_APP_OPENAI_KEY),
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo", // or 'gpt-4' based on your API key
        messages: [
          {
            role: "user",
            content: value + `\n\nTl;dr`, // Prompt for summarization
          },
        ],
        temperature: 0.1,
        max_tokens: Math.floor(value.length / 2), // Reasonable max tokens
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0.5,
      }),
    };

    fetch("https://api.openai.com/v1/chat/completions", requestOptions)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((dt) => {
        const summary = dt.choices[0].message.content; // Access the response
        setData((prevData) => [...prevData, summary]); // Append to history
        setSubmitting(false);
      })
      .catch((error) => {
        console.error("Error:", error);
        setSubmitting(false);
      });
  };

  return (
    <div>
      <section className="body-container">
        <section className="heading">
          <div className="heading">
            <img style={{ width: "50px" }} src={PDFIcon} alt="PDF Icon" />
            <h5>PDF/Text Summarizer</h5>
            <p>Start by entering your text or uploading your document.</p>
          </div>
        </section>

        <section className="textarea">
          <div className="textarea-container">
            <textarea
              className="textarea-box"
              onChange={(e) => setValue(e.target.value)}
              value={value}
            ></textarea>
          </div>

          {value.length > 0 && (
            <button
              className="submit-btn btn"
              onClick={handleSubmit}
              disabled={submitting}
            >
              {submitting ? (
                <p className="loading-state">Please wait ...</p>
              ) : (
                <>
                  <img style={{ width: "20px" }} src={Submit} alt="Submit" />
                  Submit
                </>
              )}
            </button>
          )}
        </section>

        <section className="summary-history">
          <div className="history">
            {data.length > 0 && (
              <>
                <p>Summary History</p>
                {data.map((summary, index) => (
                  <div key={index} className="summary-item">
                    <p>{summary}</p>
                  </div>
                ))}
              </>
            )}
          </div>
        </section>

        <div className="upload-btn">
          <button className="btn">
            <img src={Upload} alt="Upload Icon" />
            Upload
          </button>
        </div>
      </section>
    </div>
  );
}
