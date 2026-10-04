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
            if (data.difficulty == difficulty && data.subject==subjects) {

                
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
    // console.log(oneQues);

    const totalTime=oneQues.durationMinutes;
    const curentTime=10;

    let result=[];
    let correctAns=0;
    let totalMarks= 50;
    let marksGained=0;

    let startQues=[];
    
    for(let i=1;i<=oneQues.questions.length;){
        // if(timeCondt==false || result.length==5){
        //     res.render('result');
        // }
        console.log(oneQues.questions[0],oneQues.questions[1],oneQues.questions[2],oneQues.questions[3],oneQues.questions[4]);
        const part=oneQues.questions[i].find((op)=>op.id==i)

        

        res.render('ques',{
            quest: part,

    })
    // if(req.body.option==part.correctAnswer){
    //     correctAns++;
    //     marksGained+=5;
    //     i++;
    // }
    // else{
    //    marksGained-=1;
    //    render
    //    i++; 
    // }
    }

    
    res.send(req.params.id);

})

router.post('/quizQues/:id',(req,res,next)=>{

    console.log(req.body);
    res.send(req.params.id);
    // if(req.body.option==part.correctAnswer){
    //     correctAns++;
    //     marksGained+=5;
    //     i++;
    // }
    // else{
    //    marksGained-=1;
    //    render
    //    i++; 
    // }

})

module.exports = router;