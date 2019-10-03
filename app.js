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
            //for storing all expense elements
            exp:[],
            //for storing all income elements
            inc:[]
        },
        totals:{
            expense:0,
            income:0
        }
    };

    return {
        addItem: function(type,desc,val){
        var newItem;
        var ID,len;

        //create new id
        len= data.allitems[type].length;
        if(len>0){
            ID= data.allitems[type][len-1].id;

        }
        else{
            ID=0;
        }
        

        //create new item based on type 
        if(type==='exp'){
            newItem= new Expense(ID,desc,val);

        }
        else if(type==='inc'){
            newItem= new Income(ID,desc,val);
        }

        //return the new item
        data.allitems[type].push(newItem);
        return newItem;

    },

    testing: function(){
        console.log(data);
    }
};

    

})();



// UI Controller
var UIController= (function(){

    var DomStrings={
        inputType:'.add__type',
        inputDescription:'.add__description',
        inputValue:'.add__value',
        inputBtn:'.add__btn',
        incomeContainer:'.income__list',
        expenseContainer:'.expenses__list'

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

        addListItem:function(obj,type){
            var html , newHtml, element;

            //create HTML string from placeholder text

            if(type=== 'inc'){
                element= DomStrings.incomeContainer;
                html= '<div class="item clearfix" id="income-%id%"> <div class="item__description">%descprition%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';

            }
            else if(type==='exp'){
                element=DomStrings.expenseContainer;
                html='<div class="item clearfix" id="expense-%id"><div class="item__description">%descprition%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';

            }
            
            //replace the placeholder with some actual string
            newHtml= html.replace('%id',obj.id);
            newHtml=newHtml.replace('%descprition%',obj.description);
            newHtml=newHtml.replace('%value%',obj.value);


            //insert the HTML into the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend',newHtml);

        },

        //function to clear the input fields
        clearFields: function(){
            var fields,fieldsArr;

            //the queryselectorall method returns the list and not an array
            //so we need to convert it to array
            fields= document.querySelectorAll(DomStrings.inputDescription+','+DomStrings.inputValue);
            
            //converting the list to array
            fieldsArr= Array.prototype.slice.call(fields);

            //looping through the fields to clear the input fields

            fieldsArr.forEach(function(current,index,array){
                current.value="";
                
            });
            fieldsArr[0].focus();

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
        var input; var newItem;
        //what happens when you click a button

        // 1. Get the data from the input field
        input= UIController.getInput();
        console.log(input);



        //2. Add the item to the budget controller

        newItem=budgetController.addItem(input.type,input.description,input.value);

        //3. Add the item to the UI as Well
        UIController.addListItem(newItem,input.type);

        //4. clear all the fields
        UIController.clearFields();

        //5. Calculate the budget

        //6. Display the budget to the UI
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