import React, {Component} from "react";
import axios from "axios";
import "./Quiz.css"

let base_url = "http://localhost:8080/api/quizzes";
class QuizPage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            graded: false,
            answer: "",
            backToHomePage: false,
            resultData: {},
            answersObj: {answers: {}}
        }
        this.handleSubmit = this.handleSubmit.bind(this);
        this.onValueChange = this.onValueChange.bind(this);
    }

    /** 
     * Handling value changes on all input elements ( for a quiz )
     */
    onValueChange(event) {
        const questionId = event.target.id;
        let answersObj = JSON.parse(JSON.stringify(this.state.answersObj))
        answersObj.answers[questionId] = event.target.value;
        this.setState({   
            answersObj
        });
    }
    
    /** 
     * Handling submit on quiz completion
     */
    async handleSubmit(event) {
        event.preventDefault();
        const id = this.props.id;
        const formInputs = this.state.answersObj;
        //Axios call for post API
        try {
            const response = await axios.post(`${base_url}/${id}/attempt`, formInputs);
            this.setState({
                resultData : response.data,
                graded: true
            })
        } catch(e) {
            console.log(e);
        }
    }

    render() {
        const {resultData,graded} = this.state;
        let totalQuestions, scorePercent, resultValuesArray = [];

        const title = <h2 className="attemptQuizTitle">{this.props.title}</h2>;      
        if(graded) {
            Object.entries(resultData.questions).forEach(([question, result]) => {
                resultValuesArray.push(result);
            })
            totalQuestions =  resultData.correct+resultData.incorrect;
            scorePercent = Math.round((resultData.correct/totalQuestions) * 100);
        }
        
        return( 
            <div className="quizPageDiv">
                <div>{graded ? (<div>{title}<h5>Your score is {scorePercent}% ({resultData.correct}/{totalQuestions} correct)</h5></div>)
                             : (title)}
                </div>
               
                <form onSubmit={this.handleSubmit}>                   
                    <div> {this.props.questions.map((questions, index) => {
                        return( 
                        <div>
                            <div className="questionsDiv" key={index}>
                                {graded ? (<div> {index+1}. {questions.text} {resultValuesArray[index] ? (<span className="correctSpan">Correct</span>) : (<span className="inCorrectSpan">Incorrect</span>)}</div>) 
                                        : (<div>{index+1}. {questions.text}</div>)}
                            </div> 
                            {questions.options.map((option) => {  
                                return (
                                    <div className="radiobuttonsDiv"> 
                                        <label>
                                            <input 
                                            type="radio" 
                                            id={questions.id} 
                                            name={questions.id}  
                                            value={option}        
                                            onChange={this.onValueChange}
                                            /> 
                                            {option}         
                                        </label>
                                    </div> 
                                )})}                                                   
                        </div>
                        )})}          
                    </div>     
                    <button className="formButton" type="submit">SUBMIT</button>      
                 </form>
            </div>
        ) 
    }

}

export default QuizPage;