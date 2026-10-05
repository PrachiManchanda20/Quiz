const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { json } = require('stream/consumers');

router.get('/dashboard', (req, res) => {
    const file = fs.readFileSync(path.join(__dirname, '..', 'data', 'quizQues.json'), 'utf8');
    const parseData = JSON.parse(file);

    // console.log("vu", req.query.subjects);
    // console.log("vu", req.query.difficulty);

    const subjects = req.query.subjects;
    const difficulty = req.query.difficulty;

    if (typeof subjects != 'undefined' && subjects) {
        const multiple = [];
        for (let data of parseData) {
            if (data.difficulty == difficulty && data.subject == subjects) {


                multiple.push(data);
                return res.render('quizQue', {
                    quizes: multiple,
                })
            }
        }
    }

    res.render('dashbord', {
        username: req.session.user.username,

    });

})

router.get('/quizQues/:id', (req, res, next) => {
    // console.log(req.params.id);
    const file = fs.readFileSync(path.join(__dirname, '..', 'data', 'quizQues.json'), 'utf8');
    const parseData = JSON.parse(file);

    const oneQues = parseData.find((one) => one.id == req.params.id);
    // // console.log(oneQues);

    // // const totalTime=oneQues.durationMinutes;
    // // const curentTime=10;

    // // let result=[];
    // // let correctAns=0;
    // // let totalMarks= 50;
    // // let marksGained=0;

    // // let startQues=[];

    // // for(let i=0;i<oneQues.questions.length;){
    //     // if(timeCondt==false || result.length==5){
    //     //     res.render('result');
    //     // }
    //     console.log(oneQues.questions[0],oneQues.questions[1],oneQues.questions[2],oneQues.questions[3],oneQues.questions[4]);
    //     const part=oneQues.questions[0];

    //     res.render('qes',{
    //         durationMinutes: oneQues.durationMinutes,
    //         id: oneQues.id,
    //         quest: part,
    //         message: null,
    //         correct: null,
    //         correctAns: null

    // })
    // // if(req.body.option==part.correctAnswer){
    // //     correctAns++;
    // //     marksGained+=5;
    // //     i++;
    // // }
    // // else{
    // //    marksGained-=1;
    // //    render
    // //    i++; 
    // // }
    // // }


    // // res.send(req.params.id);



    res.render('instructions', {
        id: req.params.id,
        instruct1: "Attempt all 5 ques",
        instruct2: "10 marks for each correct answer",
        instruct3: "-1 for every wrong answer",
        timeLimit: oneQues.durationMinutes
    })

})

router.post('/quizQues/:id', (req, res) => {

    const file = fs.readFileSync(path.join(__dirname, '..', 'data', 'quizQues.json'), 'utf8');
    const parseData = JSON.parse(file);

    const oneQues = parseData.find((one) => one.id == req.params.id);

    let part = oneQues.questions[0];

    let i = 0;
    let result = [];
    let correctAns = 0;
    let totalMarks = 50;
    let marksGained = 0;

    console.log("ques id is: ",req.params.id);

    // res.render('qes',{
    //     id: req.params.id,
    //     durationMinutes: oneQues.durationMinutes,

    // })

    const id = 1;
    console.log(req.body.quesNo);
    // let nextId=Number(req.params.quesNo);
    let nextId=id+1;

    if(req.body.submit){
     nextId = nextId + 1;
    //  part = oneQues.questions[nextId-1];
     part = oneQues.questions[nextId-1];

    console.log("next id=",nextId);
    }

    if (Number(req.body.option) == part.correctAnswer) {
        console.log("correct option: ",req.body.option,"type of :", typeof(req.body.option));
        console.log(part.correctAnswer,"type of :", typeof(part.correctAnswer));
        correctAns++;
        marksGained += 10;
        res.render('qes', {
            id: nextId,
            quest: part,
            durationMinutes: oneQues.durationMinutes,
            message: "Correct Answer",
            correct: null,
            correctAns: null
        });

    }

       else if(req.body.option==null || req.body.submit){
        res.render('qes', {
            quesNo: nextId,
            id: req.params.id,
            quest: part,
            durationMinutes: oneQues.durationMinutes,
            message: null,
            correctAns: null,
            correct: part.options[part.correctAnswer]
        });
    }

    else {
        console.log("user ans" ,req.body.option);
        console.log("correct ans",part.correctAnswer);
        marksGained -= 5;
        console.log("Wrong");
        res.render('qes', {
            id:  req.params.id,
            quest: nextId,
            durationMinutes: oneQues.durationMinutes,
            message: "Wrong Answer",
            correctAns: true,
            correct: part.options[part.correctAnswer]
        });

    }
 

    // i++;
    //  part=oneQues.questions[i];
    //  res.render('qes',{
    //         durationMinutes: oneQues.durationMinutes,
    //         id: oneQues.id,
    //         quest: part,
    //         message: null,
    //         correct: null,
    //         correctAns: null

    // })

    // console.log(req.body.option);
    // // res.send(req.params.id);
    // // if(req.body.option==part.correctAnswer){
    // //     correctAns++;
    // //     marksGained+=5;
    // //     i++;
    // // }
    // // else{
    // //    marksGained-=1;
    // //    render
    // //    i++; 
    // // }

})

module.exports = router;