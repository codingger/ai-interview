import React, { useState, useEffect } from "react";
import axios from "axios";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

function Interview() {
    const [JobTitle, setJobTitle] = useState([]);
    const [question, setquestion] = useState("Question will appear here...");
    const [answer, SetAnswer] = useState("");
    const [reply, setreply] = useState({
        answer: "",
        job_title: "",
    });
    const [feedback, setFeedback] = useState("");
    const [score, setScore] = useState(0);
    const [questionCount, setquestionCount] = useState(1);
    const [history, setHistory] = useState([]);
    const [finalReport, setFinalReport] = useState("");
    useEffect(() => {
        axios.get("http://localhost:3000/users")
            .then((res) => {
                setJobTitle(res.data);
            })
            .catch((err) => {
                console.log(err);
            })
    }, []);
    async function handleClick() {
        try {
            setquestionCount(1);
            const value = { job_title: reply.job_title }
            const result = await axios.post("http://localhost:3000/description", value);
            setquestion(result.data.question);
        } catch (error) {
            console.log(error);
        }
    }
    function handleChange(event) {
        const { name, value } = event.target;
        console.log(reply);
        setreply(prevValue => {
            return {
                ...prevValue,
                [name]: value,
            }
        });
    }
    async function submitAnswer() {
        try {
            const value = {
                question: question,
                answer: reply.answer
            };
            const result = await axios.post("http://localhost:3000/evaluate-answer", value);
            const updatedHistory = [
                ...history,
                {
                    question: question,
                    answer: reply.answer,
                    score: result.data.score,
                    feedback: result.data.feedback
                }
            ];
            setHistory(updatedHistory);
            setScore(result.data.score);
            setFeedback(result.data.feedback);
            if (questionCount < 3) {
                setquestion(result.data.next_question);
                setquestionCount(prev => prev + 1);
            } else {
                const finalResult = await axios.post("http://localhost:3000/final-report", { history: updatedHistory });
                console.log(finalResult.data);
                setFinalReport(finalResult.data.report);
            }
            console.log(history);
            setreply(prev => ({
                ...prev,
                answer: ""
            }));
            console.log(result.data);
        } catch (error) {
            console.log(error);
        }


    }
    return (
        <div>
            <label htmlFor="job_title">Select your job title:</label>
            <select id="job_title" name="job_title" value={reply.job_title} onChange={handleChange}>
                <option value="" disabled>select</option>
                {JobTitle.map((job, index) => (
                    <option key={index} value={job.job_title}>
                        {job.job_title}
                    </option>
                ))}
            </select>
            <button type="submit" onClick={handleClick}>start interview</button>
            <h2>{questionCount}/3</h2>
            <Card variant="outlined">
                <h3>Question:</h3>
                <CardContent>{question}</CardContent>
            </Card>
            <label>Enter your answer here:</label><br />
            <textarea
                placeholder="Your answer"
                rows="6"
                onChange={handleChange}
                value={reply.answer}
                name="answer"
            ></textarea>
            <button type="submit" onClick={submitAnswer}>Submit answer</button><hr />
            <h3>Score: {score}/10</h3>
            <Card variant="outlined">
                <h3>feedback</h3>
                <CardContent>{feedback}</CardContent>
            </Card>
            <Card variant="outlined">
                <h3>Final Report</h3>
                <CardContent>{finalReport}</CardContent>
            </Card>
        </div>
    )
}
export default Interview;