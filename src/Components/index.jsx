import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import "./Home.css";
import { Typing } from "./Typing";

export const Home = () => {
  const [inpVal, setInpVal] = useState("");
  const [chat, setChat] = useState(true);
  const ref = useRef(null);
  const [question, setQuestion] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [newmsg, setNewmsg] = useState(false);
  const [icon, setIcon] = useState(false);
//   const [mobView, setMobView] = useState(false);
//   const [screenSize, getDimension] = useState(window.innerWidth);
  const [icontext, setIContext] = useState([]);
  let len = [];
  const getData = async (e) => {
    e.stopPropagation();
    e.preventDefault();
    setQuestion([...question, inpVal]);
    const data = {
      query: `${inpVal}`,
      context: icontext
    };
    var config = {
      method: "post",
      url: `http://chanakya-poc-1435669675.ap-south-1.elb.amazonaws.com/ai/send`,
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };
    await axios(config)
      .then(function (response) {
        let res = response ? response.data.data : "";
        !res.includes("I don't know.") && setIContext([...icontext, response.data.data]);
        sessionStorage.setItem(
          "data",
          !res.includes("Sorry, I cannot answer.")
            ? `${response.data.data} \n\n `
            : ""
        );
        setAnswers([...answers, response.data.data]);
        len.push(response.data.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  useEffect(() => {
    ref.current.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: "auto",
    });
    setNewmsg(false);
  }, [question]);
  useEffect(() => {
    sessionStorage.setItem("data", "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [window.onbeforeunload]);
//   const setDimension = () => {
//     getDimension(window.innerWidth);
//   };
//   useEffect(() => {
//     window.addEventListener("resize", setDimension);
//     screenSize < 550 ? setMobView(true) : setMobView(false);
//     return () => {
//       window.removeEventListener("resize", setDimension);
//     };
//   }, [screenSize]);
  return (
    <div className="mobileMain">
        <div style={{ display: "flex" }}>
          <div className="mobView_header">
            <img src="image.png" alt="" width="45" height="45" />
            <h1>Chanakya</h1>
          </div>
          <div className="mobView_container">
            {question !== [] ? (
              <div className="mobView_slider" ref={ref}>
                {question.map((item, i) => {
                  return (
                    <>
                      <span className="mobView_question_main">
                        <div
                          className="mobView_question"
                          align="right"
                          key={i + 1}
                        >
                          {item}
                        </div>
                      </span>
                      {answers?.[i] ? (
                        <div className="mobView_answers" key={item + i}>
                          {answers?.[i]}
                        </div>
                      ) : (
                        <div className="loading">
                          <Typing />
                        </div>
                      )}
                    </>
                  );
                })}
              </div>
            ) : (
              "Feel Free to Ask Anything"
            )}
            {icon ? (
              newmsg ? (
                <div
                  className="newmsg"
                  onClick={() => {
                    setNewmsg(false);
                    setIcon(false);
                    ref.current.scrollTo({
                      top: document.documentElement.scrollHeight,
                      behavior: "auto",
                    });
                  }}
                >
                  <img src="iconsnew.png" height="30" width="30" alt="" />
                </div>
              ) : (
                <div
                  className="oldmsg"
                  onClick={() => {
                    setNewmsg(false);
                    setIcon(false);
                    ref.current.scrollTo({
                      top: document.documentElement.scrollHeight,
                      behavior: "auto",
                    });
                  }}
                >
                  <img src="icons.png" height="30" width="30" alt="" />
                </div>
              )
            ) : (
              <></>
            )}
          </div>
          <div className="mobView_footer">
            <input
              id="inputText"
              placeholder="type your query here"
              type="text"
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  inpVal !== "" && getData(e);
                  document.getElementById("inputText").value = "";
                  setInpVal("");
                  ref.current.scrollTo({
                    top: document.documentElement.scrollHeight,
                    behavior: "auto",
                  });
                  setNewmsg(false);
                }
              }}
              onChange={(e) => {
                setInpVal(e.target.value);
              }}
            />
            <div
              className="mobView_send_btn"
              onClick={(e) => {
                inpVal !== "" && getData(e);
                document.getElementById("inputText").value = "";
                setInpVal("");
              }}
            >
              <img src="send.png" width="100" height="30" alt="" />
            </div>
          </div>
        </div>
    </div>
  );
};
