import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import "./back.css";
import { Typing } from "./Typing";

export const Home = () => {
  const [inpVal, setInpVal] = useState("");
  const [chat, setChat] = useState(true);
  const ref = useRef(null);
  const [question, setQuestion] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [newmsg, setNewmsg] = useState(false);
  const [icon, setIcon] = useState(false);
  const [mobView, setMobView] = useState(false);
  const [screenSize, getDimension] = useState(window.innerWidth);
  const [icontext, setIContext] = useState([]);
  // const [scrollHeight, getScrollHeight] = useState(ref.current?.scrollTop);
  // const [THeight, getTHeight] = useState(ref.current?.scrollHeight);
  let len = [];
  const getData = async (e) => {
    e.stopPropagation();
    e.preventDefault();
    setQuestion([...question, inpVal]);
    // var getUserData = sessionStorage.getItem("data");
    // const data = {
    //   query: `${inpVal}`,
    //   id: "1",
    // };
    // const data = {
    //   query: getUserData === null ? `${inpVal}` : `${getUserData}${inpVal}`,
    //   id: "1",
    // };
    const data = {
      query: `${inpVal}`,
      // context: getUserData ? `${getUserData}` : "",
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
    console.log(config);
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
  // const newmsgLength = () => {
  //   answers.length > len.length && setNewmsg(true);
  // };
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
  // useEffect(() => {
  //   newmsgLength();
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [answers]);
  const setDimension = () => {
    getDimension(window.innerWidth);
  };
  useEffect(() => {
    window.addEventListener("resize", setDimension);
    screenSize < 550 ? setMobView(true) : setMobView(false);
    return () => {
      window.removeEventListener("resize", setDimension);
    };
  }, [screenSize]);
  // const setHeight = () => {
  //   getScrollHeight(ref.current?.scrollTop);
  // };
  // useEffect(() => {
  //   window.addEventListener("scroll", setHeight);
  //   return () => {
  //     window.removeEventListener("scroll", setHeight);
  //   };
  // });
  // const setTHeight = () => {
  //   getTHeight(ref.current?.scrollHeight);
  // };
  // useEffect(() => {
  //   window.addEventListener("total", setTHeight);
  //   return () => {
  //     window.removeEventListener("total", setTHeight);
  //   };
  // });
  // useEffect(() => {
  //   THeight > scrollHeight + ref.current?.clientHeight
  //     ? setIcon(true)
  //     : setIcon(false);
  // });
  return (
    <>
      {mobView ? ( //mobile
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
      ) : (
        //desktop
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
                                <Typing />
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
                    className="send_btn"
                    onClick={(e) => {
                      inpVal !== "" && getData(e);
                      document.getElementById("inputText").value = "";
                      setInpVal("");
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
      )}
    </>
  );
};
