import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import "./Home.css";

export const Home = () => {
  const [inpVal, setInpVal] = useState("");
  const [chat, setChat] = useState(true);
  const ref = useRef(null);
  const [question, setQuestion] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [newmsg, setNewmsg] = useState(false);
  const [icon, setIcon] = useState(false);
  const [loading, setLoading] = useState(".");
  let len = [];
  const getData = async (e) => {
    e.stopPropagation();
    e.preventDefault();
    setQuestion([...question, inpVal]);
    var getUserData = sessionStorage.getItem("data");
    const data = {
      query: getUserData === null ? `${inpVal}` : `${getUserData}${inpVal}`,
      id: "1",
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
        console.log(response);
        sessionStorage.setItem(
          "data",
          getUserData === null
            ? `${inpVal}\n\n${response.data.data}\n\n`
            : `${getUserData} ${inpVal}\n\n${response.data.data}\n\n`
        );
        setAnswers([...answers, response.data.data]);
        len.push(response.data.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  const newmsgLength = () => {
    answers.length > len.length && setNewmsg(true);
  };
  const scrollH = () => {
    chat &&
      ref.current.scrollHeight > ref.current.clientHeight &&
      setIcon(true);
  };
  useEffect(() => {
    ref.current.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: "auto",
    });
    // console.log(ref.current.pageYOffset)
  }, [question]);
  useEffect(() => {
    sessionStorage.setItem("data", "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [window.onbeforeunload]);
  useEffect(() => {
    newmsgLength();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [answers]);
  useEffect(() => {
    scrollH();
  });
  return (
    <div className="main">
      <div className="main_box">
        <div className="heading">
          <img src="image.png" alt="" width="80" height="80" />
          <h1>Chanakya</h1>
        </div>
        <div className="box_tabs">
          <button
            onClick={() => setChat(true)}
            className={chat ? "btn_act" : "btn_dis"}
          >
            Chat
          </button>
          <button
            onClick={() => setChat(false)}
            className={!chat ? "btn_act" : "btn_dis"}
          >
            Recommendation
          </button>
        </div>
        {chat ? (
          <>
            <div className="response">
              {question !== [] ? (
                <div className="slider" ref={ref}>
                  {question.map((item, i) => {
                    return (
                      <div key={i + 1}>
                        <div className="question">{item}</div>
                        {answers?.[i] ? (
                          <div className="answers">{answers?.[i]}</div>
                        ) : (
                          <div className="loading">
                            {setInterval(() => {
                              loading.length > 5
                                ? setLoading(".")
                                : setLoading(loading + ".");
                            }, 1000) && loading}
                          </div>
                        )}
                      </div>
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
            <div className="send">
              <input
                id="inputText"
                placeholder="type your query here"
                type="text"
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    inpVal !== "" && getData(e);
                    document.getElementById("inputText").value = "";
                    setInpVal("");
                    setLoading(".");
                  }
                }}
                onChange={(e) => {
                  setInpVal(e.target.value);
                }}
              />
              <div
                className="send_btn"
                onClick={(e) => {
                  inpVal !== "" && getData(e);
                  document.getElementById("inputText").value = "";
                  setInpVal("");
                  setLoading(".");
                }}
              >
                <img src="send.png" width="20" height="20" alt="" />
              </div>
            </div>
          </>
        ) : (
          <div className="recommend">Please wait for the Next version!</div>
        )}
      </div>
    </div>
  );
};
