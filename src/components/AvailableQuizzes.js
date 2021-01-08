import React from "react";
import "./Quiz.css"

export default function AvailableQuizzes (props) {
    console.log("in AvailableQuizzes-Start");
        return (
            <div> 
                <div onClick = {() => {
                    props.getQuizData(props.quiz.id);
                    }} >
                    <h3>{props.quiz.title}</h3>
                </div>
            </div>
        ) 
}

