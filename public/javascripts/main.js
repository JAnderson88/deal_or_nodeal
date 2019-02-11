const reference = [
  0.01, 1, 5, 10, 25, 50, 75, 100, 200, 300, 400, 500, 750, 1000, 5000, 10000, 25000, 50000, 75000, 100000, 200000, 300000, 400000, 500000, 750000, 1000000
];

class App{
  constructor(){
    this.choosenValues = [];
    this.rounds = 0;
    this.setPlayersBox = false;
    this.switch = false;
    this.addClickFunctionality();
    this.game = true;
    console.dir(window);
    console.dir(document);
  }

  chooseBox(e){
    if(this.game){
      this.flipSwitch();
      if(this.setPlayersBox === false){
        const selectionBox = document.querySelector(".selection");
        const instruction = document.querySelector(".instruct");
        selectionBox.innerHTML = `<div>${e.target.dataset.num}</div>`;
        instruction.textContent = `Please choose a box`
        this.removeBox(e.target);
        this.setPlayersBox = true;
        return;
      } else {
        this.rounds++;
      }
      this.retrieveValue();
      this.removeBox(e.target);
      return;
    }
  }

  deal(offer){
    console.log("deal");
    document.querySelector(".dialogue_prompt").innerHTML = `
      <p> Congratulations! You earned ${offer} </p>
    `;
    // document.querySelector(".dialogue_prompt")
  }

  nodeal(e){
    console.log("no deal");
    console.log(e.target.parentNode.parentNode);
    this.game = true;
    if(document.querySelector(".dialogue_prompt")){
      document.querySelector("body").removeChild(e.target.parentNode.parentNode);
    }
  }

  flipSwitch(){
    this.switch = true;
    setTimeout(() => {
      this.switch = false;
    }, 2500);
  }

  removeBox(element){
    element.parentNode.removeChild(element);
  }

  retrieveValue(){
    if(this.game){
      fetch('/sendValue', {
        method: "POST",
        body: JSON.stringify({choosenValues: this.choosenValues}),
        headers: {'content-type': 'application/json' }
      })
      .then(res => res.json())
      .then(data => {
        console.log(`Round: ${this.rounds}`);
        console.log(data.offer);
        if(data.offer !== null){
          this.game = false;

          const prompt = document.createElement("div");
          const top = document.createElement("div");
          const bottom = document.createElement("div");
          const accept = document.createElement("button");
          const reject = document.createElement("button");

          top.textContent = `
          The dealer offers you ${data.offer}!
          Deal? Or No Deal?
          `
          accept.textContent = `Deal`;
          reject.textContent = `No Deal`;

          prompt.classList = "dialogue_prompt";

          accept.addEventListener('click', e => {
            this.deal(data.offer);
          });

          reject.addEventListener('click', e => {
            this.nodeal(e);
          });

          bottom.appendChild(accept);
          bottom.appendChild(reject);
          prompt.appendChild(top);
          prompt.appendChild(bottom);
          document.querySelector("body").appendChild(prompt);
        }
        const instruction = document.querySelector(".instruct");
        instruction.textContent = data.value;
        document.querySelector(`div[data-value="${data.value}"]`).classList.add("deselected");
        this.choosenValues.push(data.value);
        this.choosenValues = this.choosenValues.sort(function(a, b){return a - b});
        if(this.choosenValues.length === 25){
          const finalValue = reference.filter(value => {
            if(!this.choosenValues.includes(value)){
              return true;
            }
          });
          instruction.textContent = `Your earnings are: $${finalValue[0]}!`;
        }
      })
      .catch(error => {
        console.log(error);
      });
    }
  }

  addClickFunctionality(){
    const boxes = document.querySelectorAll(".box");
    boxes.forEach((box)=>{
      box.addEventListener("click", (e)=>{ 
        if(this.switch === false){
          this.chooseBox(e);
        }
      });
    });
    window.addEventListener("scroll", e => {
      console.log(window.scrollY);
      if(window.scrollY < window.innerHeight * 0.13 && document.querySelector("header").classList.contains("scroll")){
        document.querySelector("header").classList.toggle("scroll");
        document.querySelector(".instructionCont").classList.toggle("scroll");
      }
      if(window.scrollY >= window.innerHeight * 0.13 && !document.querySelector("header").classList.contains("scroll")){
        console.log("Ready to move to fix");
        document.querySelector("header").classList.toggle("scroll");
        document.querySelector(".instructionCont").classList.toggle("scroll");
      }
    });
  }
}

(() => {
  const app = new App();
})();