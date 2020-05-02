

let Country = [];
let count = 0;

const cors = "https://cors-anywhere.herokuapp.com/"

let prev = document.querySelector(".prev");
let next = document.querySelector(".next");
let listPanel= document.querySelector(".panel-group");
let btnHolder= document.querySelector(".btn-holder");

let state={
    
}


let renderItToWindow= async ()=>{

    // render new object instance to the state object
    state.newSearch = new Search();

    // call the API function inside the new object instance inside the state object
    await state.newSearch.Quotee();

    // render it to the console or UI
    renderToUi(state.newSearch.countriesfetch);
}

const buttonGenerator=(page, type) =>
    `
        <div class="container d-flex align-items-center justify-content-center p-2">
            <button class="prev" data-goto=${type==="Prev" ? page - 1: page + 1}>Page ${type==="Prev" ? page - 1 : page + 1}</button>
        </div>
    `;


const renderbtn=(page, countries, resultPerPage)=>{

    const pages= Math.ceil(countries / resultPerPage);

    
    let btnn; 
    
    if(page===1 && pages > 1){
        // show next button
        btnn= buttonGenerator(page, "Next");
    }else if(page < pages){
        // show the next and prev button
        btnn = `
            ${buttonGenerator(page, "Prev")}
            ${buttonGenerator(page, "Next")}
        `
    }else if(page === pages && pages > 1){
         // show the prev button
         btnn= buttonGenerator(page, "Prev");
    }

    btnHolder.insertAdjacentHTML("afterbegin", btnn);

}





const renderToUi= (countriezz, page=1, resultPerPage=10)=>{

    const start= (page - 1) * resultPerPage;
    const end= page * resultPerPage;

    countriezz.slice(start, end).forEach((curr, index) => {
        listPanel.insertAdjacentHTML("beforeend", `
            <div class="panel panel-default">
               <div class="panel-heading" role="tab" id="heading${index}">
                   <h4 class="panel-title">
                        <a role="button" data-toggle="collapse" data-parent="#accordion" href="#collapse${index}" aria-expanded="true" aria-controls="collapse${index}">
                            ${curr.country}
                        </a>
                    </h4>
                </div>
                <div id="collapse${index}" class="panel-collapse collapse in" role="tabpanel" aria-labelledby="heading${index}">
                     <div class="panel-body">
                            <p><label>New Cases: </label>${curr.cases.new}</p>
                            <p><label>Active Cases:  </label>${curr.cases.active}</p>
                            <p><label>Critical Cases:  </label>${curr.cases.critical}</p>
                     </div>
                </div>
             </div>
        `)
    });

    renderbtn(page, countriezz.length, resultPerPage);

}



btnHolder.addEventListener("click", (e)=>{
    let closestbtn= e.target.closest(".prev");
    if(closestbtn){
        const goTo= parseInt(closestbtn.dataset.goto, 10)
        listPanel.innerHTML= "";
        btnHolder.innerHTML= "";
        renderToUi(state.newSearch.countriesfetch, goTo);
    }
})







window.onload=()=>{
     // render APIcall to the window object
    renderItToWindow();
}


class Search {
    constructor(query="") {
        this.query= query;
    }


    async Quotee() {
        try {

            let quotes = await fetch(`${cors}https://covid-193.p.rapidapi.com/statistics`, {
                "method": "GET",
                "headers": {
                    "x-rapidapi-host": "covid-193.p.rapidapi.com",
                    "x-rapidapi-key": "f20975d43fmsh101ff5e89fe0f87p108eb5jsnb24ab6d9261f"
                }
            })

            let QuotesFetch = await quotes.json();
            this.countriesfetch = QuotesFetch.response;

        } catch (e) {
            console.log(e);
        }

    }


    async QueryContries() {
        try {

            let fetchContries = await fetch("https://covid-193.p.rapidapi.com/statistics?country=Nigeria", {
                "method": "GET",
                "headers": {
                    "x-rapidapi-host": "covid-193.p.rapidapi.com",
                    "x-rapidapi-key": "f20975d43fmsh101ff5e89fe0f87p108eb5jsnb24ab6d9261f"
                }
            })

            let QueryContriesinJson = await quotes.json();
            this.countriesfetch = QuotesFetch.response;

        } catch (e) {
            console.log(e);
        }

    }
}











/* we are going to paginate our result from the API

how do we do this: 
first, we create our start, end and variables.. start is for where the pagination will start from, end is where the pagination will end.

we will pass page and resultPerPage as parameters into the renderToUi() function
Page is the amount of pages we want to generate
resultPerPage is the amount of things we want the page to show in the page.. like ie 10 contents of the API per pagination and etc.

we initialize the start variable to 0 then we initialize the end to (page * resultPerPage) so that we get the endpoint of the pagination dynamically
also, we set the resultPerPage to 10 since we want 10 result to show per page 

we then do this
countriezz.splice(start, end);

the splice function bearing our start and end variables will split the API result array from the start variable till the end variable so as to generate the amount of the API result that we will show per page

eg countriezz.splice(0 ,10); will show contents from the API array between 0-9 (10 contents)..
so we can dynamically generate the contents we want the pages to show


we get strt and end dynamically by using the formula

const start= (page-1)*resultPerPage;
const end= page * resultPerPage;\


we then create another variable (pages) that will know the total number of pages..
this  will be gotten by dividing our API result array length by the resultPerPage.. 
now, we will need to round this up to a whole number by using the math function Math.ceil to approximate..

const pages=  Math.ceil(countriezz.length/resultPerPage)

now we want to create the buttons dynamically depending on the number of pages

we will use some if else statement to regulate this

    if(page===1 && pages > 1){
        // show next button
    }else if(page < pages){
        // show the next and prev button
    }else if(page === pages && pages < 1){
         // show the prev button
    }


        we then create a function that dynamically displays the buttons of next and prev based on the variables page and pages

        const buttonGenerator=(page, type)=>{
    `
        <div class="container d-flex align-items-center justify-content-center p-2 data-goto=${type==="prev"? "left": "right"}">
            <button class="prev">${type==="prev"? page - 1: page + 1}</button>
        </div>
    `
}

        we use the ternary operator to generate the page strings or the page image strings and the page numbers written on the buttons
        ${type==="prev"? page - 1: page + 1}
        ${type==="prev"? "left": "right"}

        also we added a data attribute to our html and coupled it with the ternary operator..for further monitoring of the buttons
        data-goto=${type==="prev"? "left": "right"}


        we create a btnn variable that we will use to call this function buttonGenerator(page, type);


        now we will insert this into our DOM

         inserting it in our DOM will be done by using event delegation(event.target) and closedt() function property to locate the closest ancestor
        of an event handler or event parent tag

        after which we parse it ftom a string to a number
        
        btnHolder.addEventListener("click", (e)=>{
        let closestbtn= e.target.closest(".prev");
        console.log(closestbtn);
        if(closestbtn){
            const goTo= parseInt(closestbtn.dataset.goto, 10)
            console.log(goTo);
        }



        lastly we use the goto variable and call it in the renderToUi() function
        renderToUi(state.newSearch.countriesfetch, goTo);

*/