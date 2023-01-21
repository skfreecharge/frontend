import React, { useEffect, useState } from 'react'
import axios from "axios";
import "./Home.css"

export const Home = () => {
    const [inpVal, setInpVal] = useState("");
    const [resp, setResp] = useState("");
    const [disabled, setDisabled] = useState(false);
    const [chat, setChat]= useState(true);
    const [question, setQuestion] = useState([]);
    const [answers, setAnswers] = useState([]);
    const getData = async(e)=>{
        e.stopPropagation();
        e.preventDefault();
        setQuestion([...question,inpVal])
        var getUserData= sessionStorage.getItem("data")
        const data = {
            "query":getUserData == null ? `${inpVal}`:`${getUserData}${inpVal}`
        }
        var config = {
            method: 'post',
            url: `http://localhost:8080/ai/send`,
            headers: { 
              'Content-Type': 'application/json'
            },
            data : data
          };
          await axios(config)
          .then(function (response) {
            setResp(response.data.data);
            sessionStorage.setItem("data",getUserData == null ? `${inpVal}\n\n${response.data.data}\n\n`:`${getUserData} ${inpVal}\n\n${response.data.data}\n\n`);
            setDisabled(false);
            setAnswers([...answers,response.data.data])
          })
          .catch(function (error) {
            console.log(error);
          });
}

useEffect(()=>{
  sessionStorage.setItem("data","")
},[window.onbeforeunload])
  return (
    <div className='main'>
      <div></div>
      <div className="main_box">
        <div className="heading">
          <img src="image.png" alt="" width="100" height="100" />
          <h1>Chanakya</h1>
        </div>
        <div className="box_tabs">
          <button
            onClick={() => setChat(true)}
            className={chat ?"btn_act" : "btn_dis"}
          >
            Chat
          </button>
          <button
            onClick={() => setChat(false)}
            className={!chat ? "btn_act" : "btn_dis"}
          >
            Recomendation
          </button>
        </div>
        {chat ? (
          <div>
            <div className='response'>
              {
              question !== []? 
              <div className='slider'>
              {
                question.map((item,i)=>{
                  return(
                    <div>
                <div className='question'>{item}</div>
              <div className='answers'>{answers?.[i]}</div>
              </div>
                  )
                })
              }
              </div>
              : "Feel Free to Ask Anything"
              }</div>
            <div className="send">
              <div className='inp'>
              <input
              id="inputText"
                placeholder="type your query here"
                type="text"
                onKeyPress={(e)=>{
                  // setDisabled(true);
                  if(e.key=="Enter"){
                    inpVal !=="" && getData(e);
                    document.getElementById("inputText").value = ""
                    setInpVal("")
                  }
                }}
                onChange={(e) => {
                  setInpVal(e.target.value)}
                }

              />
              </div>
              <div
              className="send_btn"
                onClick={(e) => {
                  setDisabled(true);
                  inpVal!== "" && getData(e);
                  document.getElementById("inputText").value = ""
                  setInpVal("")
                }}
              >
                <img src="paper-plane.png" width="30" height="30" alt="" />
              </div>
            </div>
          </div>
        ) : (
          <div>
            Please wait for the Next version!
          </div>
        )}
      </div>
      <div></div>
    </div>
  )
}
