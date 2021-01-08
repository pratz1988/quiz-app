import React, { Component } from "react";
import AvailableQuizzes from './AvailableQuizzes';
import axios from "axios";
import QuizPage from "./QuizPage";
import './Quiz.css'

const base_url = "http://localhost:8080/api";
class Homepage extends Component {
        constructor(props) {
            super(props);
            this.state = {
                onClickedQuiz: false,
                quizzes: [],
                quizData : []
            }
            this.getAllQuizzes = this.getAllQuizzes.bind(this);
            this.getQuizData = this.getQuizData.bind(this);
        }
        componentDidMount() {
            this.getAllQuizzes();
        }

        /** 
         * getting all the available quizzes from server
         */
        async getAllQuizzes() {
            try {
                console.log("in getAllQuizzes-Start");
                const response = await axios(`${base_url}/quizzes`);
                const allQuizzes = response.data;
                this.setState({
                    quizzes: allQuizzes
                })
            } catch(e) {
                console.log("error is .."+ e);
            }
        }
     
        /** 
         * getting data for a specific selected quiz from the server
         */
        async getQuizData(quizId) {
            try {
                console.log("in getQuizData-Start");
                const response = await axios(`${base_url}/quizzes/${quizId}`);
                const eachQuizData = response.data;
                console.log(eachQuizData);
                this.setState({
                    quizData: eachQuizData,
                    onClickedQuiz: true
                })           
                } catch(e) {
                console.log("error in getting specific quizz data..",e);
            }
        }

        render() {           
            const {quizzes, onClickedQuiz, quizData, backButton} = this.state;
            const quizInfo = [quizData].map((quizInfo, index) => (
                                <div key={index}>
                                        <QuizPage {...quizInfo} />
                                </div>  
                            ))

            return (
                <div> 
                    { onClickedQuiz ? (<div> {quizInfo} </div>) : (<div className="allQuizzesDiv"> 
                            <h2 className="allQuizzesTitle"> Quizzes </h2> 
                              { quizzes.map((quiz, index) => {
                                return(
                                <div key={index}> 
                                    { <div className="quizzesDiv"><AvailableQuizzes quiz={quiz} getQuizData={this.getQuizData} 
                                           changeFlagValue={this.changeFlagValue} />
                                      </div> }
                                </div>
                                )})
                              }
                          </div>) 
                    }                         
                </div>
            );
        }
}

export default Homepage;