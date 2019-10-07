// contains all the controllers related to javascript

//Budget Controller

var budgetController= (function(){

    //initilizing the expense object
    var Expense= function(id,description,value){
        this.id=id;
        this.description=description;
        this.value=value;
        this.percentage=-1;
    };
    Expense.prototype.calcPercentage=function(totalincome){

      if(totalincome>0){
        this.percentage= Math.round((this.value/totalincome)*100);
      }
      else{
          this.percentage=-1;
      }

    };

    Expense.prototype.getPercent=function(){
        return this.percentage;

    };

    var Income= function(id,description,value){
        this.id=id;
        this.description=description;
        this.value=value;
    };

    var calculateTotal= function(type){
        var sum=0;
        data.allitems[type].forEach(function(cur){
            sum+=cur.value;

        });
        data.totals[type]=sum;

    };

    var data={
        allitems:{
            //for storing all expense elements
            exp:[],
            //for storing all income elements
            inc:[]
        },
        totals:{
            exp:0,
            inc:0
        },
        budget:0,
        percentage:-1
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

    deleteItem: function(type,id){
        var ids,index;

        ids= data.allitems[type].map(function(current){
            return current.id;

        });

        index= ids.indexOf(id);
        if(index!==-1){
            data.allitems[type].splice(index,1);

        }


    },

    calculateBudget: function(){
    

        //calculate total income and expenses
        calculateTotal('inc');
        calculateTotal('exp');


        //calculate the budget income-expenses
        data.budget= data.totals.inc-data.totals.exp;
        
        //calculate the percentage of income spent on expense
        if(data.totals.inc>0)
        {
          data.percentage= Math.round((data.totals.exp/data.totals.inc)*100);
        }
        else{
            data.percentage=-1;
        }



    },

    calculatePercentages: function(){
        data.allitems.exp.forEach(function(cur)
        {
            cur.calcPercentage(data.totals.inc);


        });

    },

    getPercentages:function(){

        var allPerc = data.allitems.exp.map(function(cur) {
            return cur.getPercent();
        });
        return allPerc;

    },

    getBudget: function(){
        return{
            budget:data.budget,
            totalInc:data.totals.inc,
            totalExp:data.totals.exp,
            percentage:data.percentage
        };

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
        expenseContainer:'.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expenselabel: '.budget__expenses--value',
        percentagelabel:'.budget__expenses--percentage',
        container:'.container',
        expensesPercLabel: '.item__percentage',
        dateLabel: '.budget__title--month'

    };

    var formatNumber=function(num,type){
        var numsplit,integerPart,decimal,sign;

        // + or - for inc or exp
        // decimal representation of numbers
        //comma seperated numbers

        //eg inc 2329-> +2,329.00
        num=Math.abs(num);
        num= num.toFixed(2);

        numsplit= num.split('.');
        //storing integer part
        integerPart=numsplit[0];
        if(integerPart.length>3){
            //if 23456 then 23,456
            integerPart=integerPart.substr(0,integerPart.length-3)+','+integerPart.substr(integerPart.length-3,3);


        }

        //storing decimal part
        decimal=numsplit[1];

        // adiing + or - based on type
        return(type==='exp'?'-':'+')+' '+integerPart+'.'+ decimal;

    };

    var nodeListForEach= function(list,callback){

        for(var i=0;i<list.length;i++){
            callback(list[i],i);
        }

    };
    return{
        getInput: function(){

            return{
            //will be either inc for income or exc for expense
            type: document.querySelector(DomStrings.inputType).value,

            //this will contain the description of of income/expense
            description: document.querySelector(DomStrings.inputDescription).value,

            //this will contaain the value  of of income/expense
            value: parseFloat(document.querySelector(DomStrings.inputValue).value)
            };

        },

        addListItem:function(obj,type){
            var html , newHtml, element;

            //create HTML string from placeholder text

            if(type=== 'inc'){
                element= DomStrings.incomeContainer;
                html= '<div class="item clearfix" id="inc-%id%"> <div class="item__description">%descprition%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';

            }
            else if(type==='exp'){
                element=DomStrings.expenseContainer;
                html='<div class="item clearfix" id="exp-%id"><div class="item__description">%descprition%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';

            }
            
            //replace the placeholder with some actual string
            newHtml= html.replace('%id',obj.id);
            newHtml=newHtml.replace('%descprition%',obj.description);
            newHtml=newHtml.replace('%value%',formatNumber(obj.value,type));
            // if(type==='exp'){
            //     newHtml=newHtml.replace('21%',obj.percentage);
            // }


            //insert the HTML into the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend',newHtml);

        },

        deleteListItem:function(selectorId){
            var el=document.getElementById(selectorId);
            el.parentNode.removeChild(el);



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

        displayBudget: function(obj){

            var type;
            obj.budget>0 ? type='inc':type='exp';

            document.querySelector(DomStrings.budgetLabel).textContent=formatNumber(obj.budget,type);
            document.querySelector(DomStrings.incomeLabel).textContent=formatNumber(obj.totalInc,'inc');
            document.querySelector(DomStrings.expenselabel).textContent=formatNumber(obj.totalExp,'exp');
            
            if(obj.percentage>0){
                document.querySelector(DomStrings.percentagelabel).textContent=obj.percentage + '%';

            }
            else{
                document.querySelector(DomStrings.percentagelabel).textContent=obj.percentage='---';
            }



        },

        displayPercentage:function(percentages){
            var fields=document.querySelectorAll(DomStrings.expensesPercLabel);

            nodeListForEach(fields,function(current,index){
                if(percentages[index]>0){
                    current.textContent=percentages[index]+'%';
                }

                else{
                    current.textContent='---';
                }


            });


        },

        displayMonth: function(){
            var now,year,months;

            now= new Date();
            months=['January','February','March','April','May','June','July','August','September','October','November','December'];
            //extracting month
            month=now.getMonth();

            //extract year
            year= now.getFullYear();

            document.querySelector(DomStrings.dateLabel).textContent=months[month]+' '+ year;


        },

        changedType:function(){
            var fields;
            fields = document.querySelectorAll(
                DomStrings.inputType + ',' +
                DomStrings.inputDescription + ',' +
                DomStrings.inputValue);
            
            nodeListForEach(fields,function(cur){
                cur.classList.toggle('red-focus');

            });
            document.querySelector(DomStrings.inputBtn).classList.toggle('red');



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

        document.querySelector(DomStrings.container).addEventListener('click',controlDeleteItem);

        document.querySelector(DomStrings.inputType).addEventListener('change',UIController.changedType);


    });


    }

    //function for calculating any change/updation of the budget
    var updateBudget= function(){

        //1. Calculate the budget
        budgetController.calculateBudget();

        //2.return the budget
        var budget= budgetController.getBudget();

        //3.Display the budget to the UI
        UIController.displayBudget(budget);

    };

    //function to update percentage
    var updatePercentage= function(){

        //1. calculate percentage
        budgetController.calculatePercentages();


        //2.Read percentages from budget controller
        var per= budgetController.getPercentages();

        //3. update the UI with the new percentages
        UIController.displayPercentage(per);

    }


    var controlAddItem=(function(){
        var input; var newItem;
        //what happens when you click a button

        // 1. Get the data from the input field
        input= UIController.getInput();
        //console.log(input);
        

        if(input.description!="" && !isNaN(input.value) && input.value>0)
        {
        //2. Add the item to the budget controller
        newItem=budgetController.addItem(input.type,input.description,input.value);

        //3. Add the item to the UI as Well
        UIController.addListItem(newItem,input.type);

        //4. clear all the fields
        UIController.clearFields();

        //5. calculate and update Budget
        updateBudget();

        //6. calculte the percentages
        updatePercentage();
        }

       
        //alert("The function Add item Works");

    });

    var controlDeleteItem= (function(event){
        var itemID, splitID, type, ID;

        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

        if(itemID){
            //inc-1
            splitID = itemID.split('-');
            type = splitID[0];
            ID = parseInt(splitID[1]);

            //1. Delete the item from data structure
            budgetController.deleteItem(type,ID);
            //budgetController.testing();

            //2. Delete the item from the UI
            UIController.deleteListItem(itemID);

            //3. Update and show the new  budget
            updateBudget();

            //4. calculte the updated percentages
            updatePercentage();

        }

    });

    return{
        init: function(){
            console.log("the application has started");
            UIController.displayMonth();
            UIController.displayBudget({
                budget:0,
                totalInc:0,
                totalExp:0,
                percentage:-1
            })
            setupEventlisteners();
        }
    }
    

})(budgetController,UIController);

controller.init();