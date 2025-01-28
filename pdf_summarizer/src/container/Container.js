import React, { useEffect, useState } from "react";
import "./Container.css";
import PDFIcon from "./Assets/pdf-svgrepo-com.svg";
import Upload from "./Assets/c8da9327-9355-4a1d-8fd9-c816d6f67672.svg";
import Submit from "./Assets/arrow_upward_24dp_E8EAED_FILL0_wght400_GRAD0_opsz24.svg";
import Delete from "./Assets/delete_24dp_E8EAED_FILL0_wght400_GRAD0_opsz24.svg";
import Copy from './Assets/content_copy_24dp_E8EAED_FILL0_wght400_GRAD0_opsz24.svg';

export default function Container() {
  const [value, setValue] = useState("");
  const [data, setData] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const LOCAL_STORAGE_KEY = "summary";

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);

    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + process.env.REACT_APP_OPENAI_KEY,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: value + `\n\nTl;dr` }],
        temperature: 0.1,
        max_tokens: Math.floor(value.length / 2),
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0.5,
      }),
    };

    fetch("https://api.openai.com/v1/chat/completions", requestOptions)
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        return response.json();
      })
      .then((dt) => {
        const summary = dt.choices[0].message.content;
        const updatedData = [...data, summary];
        setData(updatedData);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedData));
        setSubmitting(false);
      })
      .catch((error) => {
        console.error("Error:", error);
        setSubmitting(false);
      });
  };

  const fetchLocalStorage = () => {
    const result = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (result) setData(JSON.parse(result));
  };

  const handleCopy = (txt, index) => {
    navigator.clipboard.writeText(txt)
      .then(() => {
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 1500);
      })
      .catch((err) => console.log(err));
  };

  const handleDelete = (txt) => {
    const filtered = data.filter((d) => d !== txt);
    setData(filtered);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(filtered));
  };

  useEffect(() => {
    fetchLocalStorage();
  }, []);

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
              placeholder="Enter text to summarize..."
            ></textarea>
          </div>

          {value.length > 0 && (
            <button
              className="submit-btn btn"
              onClick={handleSubmit}
              disabled={submitting}
              aria-label="Submit"
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
            {/* {data.length > 0 && ( */}
              <>
                <h6 className="summary-heading">Summary History</h6>
                {/* {data.map((summary, index) => ( */}
                  <div className="summary-item" >
                    <p className="summary-content">Thousands of graduates applied for the Shell Graduate Program the year I did, with only 15 receiving offers—an acceptance rate of less than 1%. It's highly competitive, but worth trying due to its global opportunities, innovative energy projects, and F100 company benefits.</p>
                    <div className="action-btn">
                      <p className="copy" onClick={() => handleCopy()}>
                        {copiedIndex === false ? (
                          <span>copied</span>
                        ) : (
                          <img src={Copy} alt="Copy Icon" style={{ width: "20px" }} />
                        )}
                      </p>
                      <span onClick={() => handleDelete()}>
                        <img
                          style={{ backgroundColor: "transparent" }}
                          src={Delete}
                          alt="Delete Icon"
                        />
                      </span>
                    </div>
                  </div>
                {/* ))} */}
              </>
            {/* )} */}
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