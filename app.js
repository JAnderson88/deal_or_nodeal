const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();

const choices = [
  0.01, 1, 5, 10, 25, 50, 75, 100, 200, 300, 400, 500, 750, 1000, 5000, 10000, 25000, 50000, 75000, 100000, 200000, 300000, 400000, 500000, 750000, 1000000
];

const offers = [22,17,15,13,11,10,9,8,7,6,5,4,3,2];

function getAverage(data){
  return data.reduce((acc, curr, index)=>{
    if(index === data.length-1){
      return ((acc + curr)/index + 1);
    }
    return acc + curr;
  });
}
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('index');
});

app.post('/sendValue', (req, res) => {
  const temp = choices.filter(value => {
    if(!req.body.choosenValues.includes(value)){
      return true;
    }
  });
  const random = Math.floor(Math.random() * temp.length);
  const avaiableChoices = [...temp.slice(0, random), ...temp.slice(random+1, temp.length)];
  const choice = temp[random];
  let offer = null;
  if(offers.includes(choices.length - req.body.choosenValues.length)){
    const round = choices.length - req.body.choosenValues.length;
    const offerNum = (round === 22) ? 1 :
                     (round === 17) ? 2 :
                     (round === 15) ? 3 :
                     (round === 13) ? 4 :
                     (round === 11) ? 5 :
                     (round === 10) ? 6 :
                     (round === 9) ? 7 :
                     (round === 8) ? 8 :
                     (round === 7) ? 9 :
                     (round === 6) ? 10 :
                     (round === 5) ? 11 :
                     (round === 4) ? 12 :
                     (round === 3) ? 13 : 14;
    console.log(`Round ${offerNum}`);
    //mid point/average
    const avg = Math.floor(getAverage(avaiableChoices));
    const propLow = avaiableChoices.filter(value => value <= avg).length;
    const propHigh = avaiableChoices.filter(value => value > avg).length;
    const perctLow = (propLow / (choices.length - req.body.choosenValues.length));
    const perctHigh = (propHigh / (choices.length - req.body.choosenValues.length));
    //lowEnd/HighEnd (medians)
    const left = Math.floor(avg * (1 - perctLow));
    const right = Math.floor(avg * (1 + perctHigh));
    //lowEnd midpoint
    const leftPropLow = avaiableChoices.filter(value => value <= left).length;
    const leftPropHigh = avaiableChoices.filter(value => value > left).length;
    const rightPropLow = avaiableChoices.filter(value => value <= right).length;
    const rightPropHigh = avaiableChoices.filter(value => value > right).length;
    //highEnd midpoint
    const leftPerctLow = (leftPropLow / (choices.length - req.body.choosenValues.length));
    const leftPerctHigh = (leftPropHigh / (choices.length - req.body.choosenValues.length));
    const rightPerctLow = (rightPropLow / (choices.length - req.body.choosenValues.length));
    const rightPerctHigh = (rightPropHigh / (choices.length - req.body.choosenValues.length));
    //lowEnd left side
    const leftLowEnd = Math.floor(left * (1 - leftPerctLow));
    //lowEnd right side
    const leftHighEnd = Math.floor(left * (1 + leftPerctHigh));
    //highEnd left side
    const rightLowEnd = Math.floor(right * (1 - rightPerctLow));
    //highEnd right side
    const rightLowHigh = Math.floor(right * (1 + rightPerctHigh));
    //possibility area
    const posArea = Math.abs(rightLowEnd - leftHighEnd);
    //possibility segments
    const posSegments = posArea / 100;
    //position choice
    const position = Math.ceil(Math.random() * 100);
    //round scalar
    const rScalar = ((choices.length - req.body.choosenValues.length)/25);
    //initial offer 
    const initOffer = Math.trunc((leftHighEnd <= rightLowEnd) ? leftHighEnd : rightLowEnd + (1 + ((posSegments * position) * rScalar)));
    console.log(`Inital Offer: ${initOffer}`);
    //rounded offer 
    if(initOffer.toString().length === 3 && initOffer.toString.charAt(0) === "."){
      offer = 1;
    } else if(initOffer.toString().length === 3){
      offer = `${initOffer.toString().substring(0, 1)}00`;
    } else if(initOffer.toString().length === 4){
      offer = `${initOffer.toString().substring(0, 2)}00`;
    } else if(initOffer.toString().length === 5){
      offer = `${initOffer.toString().substring(0, 3)}00`;
    } else if(initOffer.toString().length === 6){
      offer = `${initOffer.toString().substring(0, 3)}000`;
    }
    console.log(`Average: ${avg}`);
    console.log(`Choices that are lower than the average: ${propLow}`);
    console.log(`Choices that are higher than the average: ${propHigh}`);
    console.log(`Lowest percentage rate to the average: ${perctLow}`);
    console.log(`Highest percentage rate to the average: ${perctHigh}`);
    console.log(`Lowest offer: $${left}`);
    console.log(`Highest offer: $${right}`);
    console.log(leftLowEnd, leftHighEnd, rightLowEnd, rightLowHigh);
    console.log(`The possibility area: ${posArea}`);
    console.log(`The possibility segments: ${posSegments}`);
    console.log(`Choosen position: ${position}`);
    // console.log(`Initial Offer: ${initOffer}`);
    console.log(`Rounded Offer: ${offer}`);
  }
  res.send({
    value: choice,
    offer
  });
});

app.listen(3000, () => console.log('app listening on port 3000!'));