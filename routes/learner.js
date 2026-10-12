const { on } = require('cluster');
const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { title } = require('process');

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
                });
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
    console.log(oneQues, "type", typeof(oneQues.id));
    console.log("params check", req.params.id , typeof(req.params.id));

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
        instruct3: "-5 for every wrong answer",
        timeLimit: oneQues.durationMinutes
    })

})

// router.post('/quizQues/:id', (req, res) => {

//     const file = fs.readFileSync(path.join(__dirname, '..', 'data', 'quizQues.json'), 'utf8');
//     const parseData = JSON.parse(file);

//     const oneQues = parseData.find((one) => one.id == req.params.id);

//     if(!oneQues){
//         return res.status(404).send('Quiz not found');
//     }
    

//     // let index = Number(req.body.quesNo );
//     // let score = Number(req.body.score ?? 0);
//     // const part = oneQues.questions[index];

//     // if(!part){
//     //     return res.status(404).send('Question not Found');
//     // }

//     // let result = [];
//     // let correctAns = 0;
//     // let totalMarks = 50;
//     // let marksGained = 0;

//     // console.log("ques id is: ",req.params.id);

//     // res.render('qes',{
//     //     id: req.params.id,
//     //     durationMinutes: oneQues.durationMinutes,

//     // })

//    console.log("the",req.body.quesNo);
//     // let nextId ;
//     const action = req.body.action;

//     if(action === 'start'){
//         return res.render('qes', {
//         id: oneQues.id,
//         quesNo: 0,
//         score: 0,
//         quest: oneQues.questions[0],
//         durationMinutes: oneQues.durationMinutes,
//         message: null,
//         correct: null,
//         // correctAns: null,
//         showNext: false,
//     })
//     }

//     const index = Number(req.body.quesNo);

//     if(index < 0 || index >= oneQues.questions.length){
//         return res.status(400).send('Invalid question number');
//     }

//     const part = oneQues.questions[index];

//     let scoreValue = Number(req.body.score ?? 0);

//      if (!Number.isFinite(scoreValue)) {
//         return res.status(400).send('Invalid score');
//     }

//     if(action === 'next'){
//         const nextId = index + 1;
//         console.log("the");

//         if(nextId >= oneQues.questions.length){
//             return res.render('result',{
//                 score: scoreValue,
//                 totalQuestions: oneQues.questions.length
//             })
//         }
    

//     return res.render('qes',{
//         id: oneQues.id,
//         quesNo: nextId,
//         score: scoreValue,
//         quest: oneQues.questions[nextId],
//         durationMinutes: oneQues.durationMinutes,
//         message: null,
//         correct: null,
//         // correctAns: null,
//         showNext: false,
//     })
//     }


//     // const selectOption = req.body.option;

//     // if(selectOption == undefined){

//     //     return res.status(400).send('Please select a valid option');
        
//     // }

//     if (action == 'submit') {
//         // return res.status(400).send('Invalid action');
    

//     const selectOption = req.body.option;

//     // const isCorrect =  Number(selectOption) === Number(part.correctAnswer);
    
//     if(Number(selectedOption) >= part.options.length){
//          return res.status(400).send('Please select a valid option');
//     }

//     // let message;

//     const isCorrect =  Number(selectOption) === Number(part.correctAnswer);

//     let score = scoreValue;
//     let message;

//     if(isCorrect){
//         message: "Correct Answer";
//         score += 10;

//     }
//     else{
//         message: "Incorrect Answer";
//         score -= 5;
//     }

//     return res.render('qes',{
//         id: oneQues.id,
//         quesNo: index,
//         score: score,
//         quest: part,
//         durationMinutes: oneQues.durationMinutes,
//         message: message,
//         correct: part.options[part.correctAnswer],
//         // correctAns: isCorrect,
//         showNext: true,
//     })
//     }



//     return res.status(404).send(`Invalid action: ${action ?? 'missing action'}`);
//     // const id = 1;
 
//     // let nextId=Number(req.params.quesNo);
//     // let nextId=id+1;

//     // if(req.body.submit){
//     //  nextId = nextId + 1;
//     // //  part = oneQues.questions[nextId-1];
//     //  part = oneQues.questions[nextId-1];

//     // console.log("next id=",nextId);
//     // }

//     // if (Number(req.body.option) == part.correctAnswer) {
//     //     console.log("correct option: ",req.body.option,"type of :", typeof(req.body.option));
//     //     console.log(part.correctAnswer,"type of :", typeof(part.correctAnswer));
//     //     correctAns++;
//     //     marksGained += 10;
//     //     res.render('qes', {
//     //         id: nextId,
//     //         quest: part,
//     //         durationMinutes: oneQues.durationMinutes,
//     //         message: "Correct Answer",
//     //         correct: null,
//     //         correctAns: null
//     //     });
//     // }

//     //    else if(req.body.option==null || req.body.submit){
//     //     res.render('qes', {
//     //         quesNo: nextId,
//     //         id: req.params.id,
//     //         quest: part,
//     //         durationMinutes: oneQues.durationMinutes,
//     //         message: null,
//     //         correctAns: null,
//     //         correct: part.options[part.correctAnswer]
//     //     });
//     // }

//     // else {
//     //     console.log("user ans" ,req.body.option);
//     //     console.log("correct ans",part.correctAnswer);
//     //     marksGained -= 5;
//     //     console.log("Wrong");
//     //     res.render('qes', {
//     //         id:  req.params.id,
//     //         quest: nextId,
//     //         durationMinutes: oneQues.durationMinutes,
//     //         message: "Wrong Answer",
//     //         correctAns: true,
//     //         correct: part.options[part.correctAnswer]
//     //     });
//     // }
 

//     // i++;
//     //  part=oneQues.questions[i];
//     //  res.render('qes',{
//     //         durationMinutes: oneQues.durationMinutes,
//     //         id: oneQues.id,
//     //         quest: part,
//     //         message: null,
//     //         correct: null,
//     //         correctAns: null

//     // })

//     // console.log(req.body.option);
//     // // res.send(req.params.id);
//     // // if(req.body.option==part.correctAnswer){
//     // //     correctAns++;
//     // //     marksGained+=5;
//     // //     i++;
//     // // }
//     // // else{
//     // //    marksGained-=1;
//     // //    render
//     // //    i++; 
//     // // }

// })


// router.post('/quizQues/:id', (req, res) => {
//     try {
//         const file = fs.readFileSync(
//             path.join(__dirname, '..', 'data', 'quizQues.json'),
//             'utf8'
//         );

//         const parseData = JSON.parse(file);

//         const oneQues = parseData.find(
//             quiz => quiz.id === Number(req.params.id)
//         );

//         if (!oneQues) {
//             return res.status(404).send('Quiz not found');
//         }

//         const action = req.body.action;

//         console.log('Action received:', action);
//         console.log('Request body:', req.body);

//         // 1. Start quiz
//         if (action === 'start') {
//             return res.render('qes', {
//                 id: oneQues.id,
//                 quesNo: 0,
//                 score: 0,
//                 quest: oneQues.questions[0],
//                 durationMinutes: oneQues.durationMinutes,
//                 message: null,
//                 correct: null,
//                 showNext: false
//             });
//         }

//         // Validate question number
//         const index = Number(req.body.quesNo);

//         if (
//             !Number.isInteger(index) ||
//             index < 0 ||
//             index >= oneQues.questions.length
//         ) {
//             return res.status(400).send('Invalid question number');
//         }

//         const question = oneQues.questions[index];
//         const scoreValue = Number(req.body.score ?? 0);

//         if (!Number.isFinite(scoreValue)) {
//             return res.status(400).send('Invalid score');
//         }

//         // 2. Move to next question
//         if (action === 'next') {
//             const nextIndex = index + 1;

//             // Quiz completed
//             if (nextIndex >= oneQues.questions.length) {
//                 return res.render('result', {
//                     score: scoreValue,
//                     totalQuestions: oneQues.questions.length
//                 });
//             }

//             return res.render('qes', {
//                 id: oneQues.id,
//                 quesNo: nextIndex,
//                 score: scoreValue,
//                 quest: oneQues.questions[nextIndex],
//                 durationMinutes: oneQues.durationMinutes,
//                 message: null,
//                 correct: null,
//                 showNext: false
//             });
//         }

//         // 3. Submit answer
//         if (action === 'submit') {
//             const selectedOption = req.body.option;

//             if (
//                 typeof selectedOption !== 'string' ||
//                 !/^\d+$/.test(selectedOption) ||
//                 Number(selectedOption) >= question.options.length
//             ) {
//                 return res.status(400).send(
//                     'Please select a valid option'
//                 );
//             }

//             const isCorrect =
//                 Number(selectedOption) ===
//                 Number(question.correctAnswer);

//             let score = scoreValue;
//             let message;

//             if (isCorrect) {
//                 message = 'Correct Answer!';
//                 score += 10;
//             } else {
//                 message = 'Incorrect Answer!';
//                 score -= 5;
//             }

//             return res.render('qes', {
//                 id: oneQues.id,
//                 quesNo: index,
//                 score: score,
//                 quest: question,
//                 durationMinutes: oneQues.durationMinutes,
//                 message: message,
//                 correct: question.options[question.correctAnswer],
//                 showNext: true
//             });
//         }

//         // 4. Invalid or missing action
//         return res.status(400).send(
//             `Invalid action: ${action ?? 'missing action'}`
//         );

//     } catch (error) {
//         console.error(error);
//         return res.status(500).send('Internal Server Error');
//     }
// });


router.post('/quizQues/:id', (req, res) => {
    // try {
    console.log("req.params",req.params.id);

    const file = fs.readFileSync(path.join(__dirname, '..', 'data', 'quizQues.json'), 'utf8');
    const parseData = JSON.parse(file);

        const oneQues = parseData.find(q => q.id === Number(req.params.id));
        if (!oneQues) return res.status(404).send('Quiz not found');

    //     console.log(req.body.quesNo,"yye");
    // console.log(oneQues,"nj");
        let index = req.body.quesNo;

        let question = oneQues.questions[Number(index)];

        // console.log("ocorrcettion is: ", Number(index),);
    
        let score=0;
        let message;
        // console.log("answer is : ", oneQues.questions[Number(index)][oneQues.questions[Number(index)].correctAnswer]);
        if(req.body.option == Number(index)){
                score += 10;
                message = "Correct Answer!";
            }
            else{
                score -= 5;
                message = "Incorrect Answer!";
            }
            console.log('',oneQues.questions[index])
            console.log("ddwd",req.body.option,"this this",req.body.option)
        if(req.body.action === 'submit'){

            return res.render('qes',{
            id: oneQues.id,
            quesNo: Number(index),
            score: score,
            quest: oneQues.questions[index],
            durationMinutes: oneQues.durationMinutes,
            message: message,
            // correct: oneQues.questions[oneQues.correctAnswer],
            correct: question.options[question.correctAnswer],
            // correctAns: null,
            showNext: true,
       })
        }


        if(req.body.action === 'next'){

            let next_Ques_Indx = Number(index) + 1;

            // if(req.body.option == Number(index)){
            //     score += 10;
            //     message = "Correct Answer!";
            // }
            // else{
            //     score -= 5;
            //     message = "Incorrect Answer!";
            // }

            if(next_Ques_Indx >= 5){

                const maxScore = totalQuestions * 10;

                const correctCount = Math.round((score + 5 * 5));
                const wrongCount = 5 - correctCount;
               return res.render('result',{
                id: oneQues.id,
                title: oneQues.title,
                subject: oneQues.subject,
                difficulty: oneQues.difficulty,
                score,
                maxScore,
                totalQuestions: 5,
                correctCount,
                wrongCount,
                percentage : Math.max(0, Math.round((score / maxScore) * 100))               });
            }
            console.log("after Submit ques id is:", next_Ques_Indx);

            return res.render('qes',{
            id: oneQues.id,
            quesNo: next_Ques_Indx,
            score: null,
            quest: oneQues.questions[next_Ques_Indx],
            durationMinutes: oneQues.durationMinutes,
            message: null,
            correct: null,
        // correctAns: null,
            showNext: false,
       })

            }


       return res.render('qes',{
        id: oneQues.id,
        quesNo: 0,
        score: 0,
        quest: oneQues.questions[0],
        durationMinutes: oneQues.durationMinutes,
        message: null,
        correct: null,
        // correctAns: null,
        showNext: false,
       })


});



module.exports = router;