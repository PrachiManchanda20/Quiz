const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { json } = require('stream/consumers');

router.get('/dashboard', (req, res) => {
    const file = fs.readFileSync(path.join(__dirname, '..', 'data', 'quizQues.json'), 'utf8');
    const parseData = JSON.parse(file);

    console.log("vu", req.query.subjects);
    console.log("vu", req.query.difficulty);

    const subjects = req.query.subjects;
    const difficulty = req.query.difficulty;
    
    if (typeof subjects != 'undefined' && subjects) {
        const multiple=[];
        for (let data of parseData) {
            if (data.difficulty == difficulty) {

                
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
router.get('/quizQues/:id',(req,res,next)=>{
    console.log(req.params.id);
    const file=fs.readFileSync(path.join(__dirname,'..','data','quizQues.json'),'utf8');
    const parseData=JSON.parse(file);

    const oneQues=parseData.find((one)=>one.id==req.params.id);
    console.log(oneQues);

    const totalTime=oneQues.durationMinutes;
    const curentTime=10;

    let result=[];
    let correctAns=0;
    let totalMarks= 50;
    let marksGained=0;

    let startQues=[];
    // for(let ques of oneQues){
    for(let i=1;i<=oneQues.questions.length;){
        if(timeCondt==false || result.length==5){
            res.render('result');
        }
        
        // startQues.push(ques.questions.id);
        // const part=ques.questions.find((op)=>op.id==i);
        const part=oneQues.questions[i].find((op)=>op.id==i)
        console.log(oneQues.questions[i]);

        res.render('ques',{
            quest: part,

        // durationMinutes: durationMinutes,
        // questions: oneQues,
    })
    if(req.body.option==part.correctAnswer){
        correctAns++;
        marksGained+=5;
        i++;
    }
    else{
       marksGained-=1;
       render
       i++; 
    }
    }

    
    res.send(req.params.id);

})

// router.get('/dashboard/:subject/:difficulty',(req,res,next)=>{

//     console.log("url",req.params.subject);
//     console.log(req.params.difficulty);

// })
// router.post('/dashboard/difficulty:',(req,res)=>{
//    res.render('n')//start krna h
// })
module.exports = router;