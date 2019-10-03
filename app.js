// contains all the controllers related to javascript

//Budget Controller

var budgetController= (function(){

    //initilizing the expense object
    var Expense= function(id,description,value){
        this.id=id;
        this.description=description;
        this.value=value;
    };

    var Income= function(id,description,value){
        this.id=id;
        this.description=description;
        this.value=value;
    };

    var data={
        allitems:{
            allExpenses:[],
            allIncomes:[]
        },
        totals:{
            expense:0,
            income:0
        }
    };
    

})();



// UI Controller
var UIController= (function(){

    var DomStrings={
        inputType:'.add__type',
        inputDescription:'.add__description',
        inputValue:'.add__value',
        inputBtn:'.add__btn'

    };
    return{
        getInput: function(){

            return{
            //will be either inc for income or exc for expense
            type: document.querySelector(DomStrings.inputType).value,

            //this will contain the description of of income/expense
            description: document.querySelector(DomStrings.inputDescription).value,

            //this will contaain the value  of of income/expense
            value: document.querySelector(DomStrings.inputValue).value
            };

        },

        getDOMStrings: function(){
            return DomStrings;
        }
    };


})();


// the global app controller

var controller= (function(budgetctrl,uictrl){

    var setupEventlisteners=function(){
        var DomStrings= UIController.getDOMStrings();
        document.querySelector(DomStrings.inputBtn).addEventListener('click',controlAddItem);

        document.addEventListener('keypress',function(event){
        //console.log(event);
        if(event.keyCode===13 || event.which===13){
            //alert("Enter key was pressed");
            controlAddItem();
        }

    });


    }

    

    var controlAddItem=(function(){
        //what happens when you click a button

        // 1. Get the data from the input field
        var input= UIController.getInput();
        console.log(input);



        //2. Add the item to the budget controller

        //3. Add the item to the UI as Well

        //4. Calculate the budget

        //5. Display the budget to the UI
        //alert("The function Add item Works");

    });

    return{
        init: function(){
            console.log("the application has started");
            setupEventlisteners();
        }
    }
    

})(budgetController,UIController);

controller.init();