var budgetController = (function () {
    var Expense = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    };

    Expense.prototype.calcPercentage = function(totalIncome) {
        if (totalIncome > 0) {
            this.percentage = Math.round((this.value / totalIncome) * 100);
        } else {
            this.percentage = -1;
        }
    };

    var Income = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var data = {
        allItems: {
            exp: [],    //存exp对象
            inc: []     //存inc对象
        },
        totals: {
            exp: 0,
            inc: 0
        },
        budget:0,
        percentage: -1
    };

    var calculateTotal = function(type) {
        var sum = 0;
        data.allItems[type].forEach(function (cur) {
            sum += cur.value;
        })
        data.totals[type] = sum;
    };

    return{   //return的这些方法是公有的，上面的是私有的。
        addItem : function(type, des, val){
            var newItem,ID;

            // Create new ID
            if (data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else {
                ID = 0;
            }

            //Create new item based on 'inc' or 'exp' type
            if(type === 'exp'){
                newItem = new Expense(ID,des,val)
            }else if(type === 'inc'){
                newItem = new Income(ID,des,val)
            }

            data.allItems[type].push(newItem);
            return newItem;
        },

        addListItem: function(obj, type) {
            var html, newHtml, element;
            // Create HTML string with placeholder text
            if (type === 'inc') {
                element = DOMstrings.incomeContainer;
                html = '<div class="item clearfix" id="inc-%id%"> <div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            } else if (type === 'exp') {
                element = DOMstrings.expensesContainer;
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }

            // Replace the placeholder text with some actual data
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));

            // Insert the HTML into the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
        },

        deleteItem: function(type, id) {
            var ids, index;
            ids = data.allItems[type].map(function(current) {
                return current.id;
            });
            index = ids.indexOf(id);
            if (index !== -1) {
                data.allItems[type].splice(index, 1);
            }
        },

        calculateBudget: function() {
            //calculate total income and expenses
            calculateTotal('exp');
            calculateTotal('inc');

            //Calculate the budget: income - expenses
            data.budget = data.totals.inc - data.totals.exp;

            //calculate the percentage of income that we spent
            if (data.totals.inc > 0) {
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            } else {
                data.percentage = -1;
            }
        },

        calculatePercentages: function() {
            data.allItems.exp.forEach(function(cur) {
                cur.calcPercentage(data.totals.inc);
            });
        },

        getPercentages: function() {
            var allPerc = data.allItems.exp.map(function(cur) {
                return cur.percentage;
            });
            return allPerc;
        },

        getBudget: function() {     //用来获取内部数据。
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            };
        },

        testing : function () {
            console.log(data);
        }
    }
})();

var UIController = (function () {
        var DOMstrings = {
            inputType: '.add__type',
            inputDescription: '.add__description',
            inputValue: '.add__value',
            inputBtn: '.add__btn',
            incomeContainer: '.income__list',
            expensesContainer: '.expenses__list',
            budgetLabel: '.budget__value',
            incomeLabel: '.budget__income--value',
            expensesLabel: '.budget__expenses--value',
            percentageLabel: '.budget__expenses--percentage',
            container: '.container',
            expensesPercLabel: '.item__percentage',
            dateLabel: '.budget__title--month'
        }

        var formatNumber = function(num, type) {
            var numSplit, int, dec, type;
            num = Math.abs(num);
            num = num.toFixed(2);
            numSplit = num.split('.');
            int = numSplit[0];
            if (int.length > 3) {
                int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3); //input 23510, output 23,510
            }
            dec = numSplit[1];
            return (type === 'exp' ? '-' : '+') + ' ' + int + '.' + dec;
        };

        var nodeListForEach = function(nodeList, callback) {
            /*回调好处：
                这个公用方法，在多个程序遍历nodeList时，避免了多次写for循环。
             */
            for (var i = 0; i < nodeList.length; i++) { //nodeList是有length属性的。
                callback(nodeList[i], i);
            }
        };

        return {
            getInput: function () {
                return {
                    type: document.querySelector(DOMstrings.inputType).value, // Will be either inc or exp
                    description: document.querySelector(DOMstrings.inputDescription).value,
                    value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
                };
            },
            addListItem: function(obj, type) {
                var html, newHtml, element;
                // Create HTML string with placeholder text
                if (type === 'inc') {
                    element = DOMstrings.incomeContainer;
                    html = '<div class="item clearfix" id="inc-%id%"> <div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
                } else if (type === 'exp') {
                    element = DOMstrings.expensesContainer;
                    html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
                }

                // Replace the placeholder text with some actual data
                newHtml = html.replace('%id%', obj.id);
                newHtml = newHtml.replace('%description%', obj.description);
                newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));

                // Insert the HTML into the DOM
                document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
            },

            deleteListItem: function(selectorID) {
                var el = document.getElementById(selectorID);
                //In JavaScript,we cannot simply delete an element,we can only delete a child.so this is a bit strange.
                el.parentNode.removeChild(el);
            },

            clearFields: function() {
                var fields, fieldsArr;
                fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue);
                fieldsArr = Array.prototype.slice.call(fields);
                fieldsArr.forEach(function(current, index, array) {
                    current.value = "";
                });
                fieldsArr[0].focus();
            },

            displayBudget:function(obj){
                var type;
                obj.budget > 0 ? type = 'inc' : type = 'exp';
                document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(obj.budget, type);
                document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(obj.totalInc, 'inc');
                document.querySelector(DOMstrings.expensesLabel).textContent = formatNumber(obj.totalExp, 'exp');
                if (obj.percentage > 0) {
                    document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';
                } else {
                    document.querySelector(DOMstrings.percentageLabel).textContent = '--';
                }
            },

            displayPercentages: function(percentages) {
                //返回nodeList
                var fields = document.querySelectorAll(DOMstrings.expensesPercLabel);
                //调用回调函数
                nodeListForEach(fields, function(current, index) {
                    //这下面会被回调函数调用fields.length次，不用自己写循环了。
                    if (percentages[index] > 0) {
                        current.textContent = percentages[index] + '%';
                    } else {
                        current.textContent = '---';
                    }
                });
            },

            displayMonth: function() {
                var now, months, month, year;
                now = new Date();
                months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
                month = now.getMonth();
                year = now.getFullYear();
                document.querySelector(DOMstrings.dateLabel).textContent = months[month] + ' ' + year;
            },

            changedType: function() {
                var fields = document.querySelectorAll(
                    DOMstrings.inputType + ',' +
                    DOMstrings.inputDescription + ',' +
                    DOMstrings.inputValue);
                nodeListForEach(fields, function(cur) {
                    cur.classList.toggle('red-focus');
                });
                document.querySelector(DOMstrings.inputBtn).classList.toggle('red');
            },

            getDOMstrings: function() {
                return DOMstrings;
            }
        }
    }
)();

var controller = (function (budgetCtrl,UICtrl) {
    var setupEventListeners = function () {
        var DOM = UICtrl.getDOMstrings();

        document.addEventListener('keypress',function (event) {
            if(event.keyCode === 13 || event.which === 13){
                ctrlAddItem();
            }
        })
        document.querySelector(DOM.inputBtn).addEventListener('click',ctrlAddItem);
        /*
            Event bubbling：The event is first fired on the button,but then it will also be fired on all the parent elements one at a time until the HTML element which is the root.

            We can simply attach an event handler to a parent element and wait for the event to bubble up,
            and we can then do whatever we intended to do with our 'target element'.

            Event delegation is to not set up the event handler on the original element that we're interested in,
            but to attach it to a parent element and, basically, catch the event there because it bubbles up.
            We can then act on the element that we're interested in using the 'target element' property.

            There are basically two big use cases for event delegation.
            1. The first case is when we have an element with lots of child elements that we are interested in. In this case, instead of adding an event handler
            to all of these child elements, we simply add it to the parent element, and then determine on which child element the event was fired.
            2. The second use case for event delegation is when we want an event handler attached to an element that is not yet in the DOM when our page is loaded.
         */
        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);

        document.querySelector(DOM.inputType).addEventListener('change', UICtrl.changedType);
    }

    var updateBudget = function() {
        //1.Calculate the budget.
        budgetCtrl.calculateBudget();
        //2.Return a budget.
        var budget = budgetCtrl.getBudget();
        //3.Display the budget on the UI.
        UICtrl.displayBudget(budget);
    }

    var updatePercentages = function() {
        // 1. Calculate percentages
        budgetCtrl.calculatePercentages();
        // 2. Read percentages from the budget controller
        var percentages = budgetCtrl.getPercentages();
        // 3. Update the UI with the new percentages
        UIController.displayPercentages(percentages);
    };

    var ctrlAddItem = function(){
        var input , newItem;
        //1.Get the field input data.
        input = UICtrl.getInput();
        if (input.description !== "" && !isNaN(input.value) && input.value > 0) {
            //2.Add the item to the budget controller.
            newItem = budgetCtrl.addItem(input.type, input.description, input.value);
            //3.Add the item to the UI
            UICtrl.addListItem(newItem, input.type);
            //4.Clear the fields
            UICtrl.clearFields();
            // 5.Calculate and update budget
            updateBudget();
            // 6.Calculate and update percentages
            updatePercentages();
        }
    }

    var ctrlDeleteItem = function(event){
        var itemID, splitID, type, ID;
        //The event.target property,which is exactly the element where the click happened.
        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

        //This is going to be coerced or converted to true if this exists.
        if (itemID) {
            //比如inc-1，exp-3
            splitID = itemID.split('-');
            type = splitID[0];
            ID = parseInt(splitID[1]);

            // 1. delete the item from the data structure
            budgetCtrl.deleteItem(type,ID);
            // 2. Delete the item from the UI
            UIController.deleteListItem(itemID);
            // 3. Update and show the new budget
            updateBudget();
            // 4. Calculate and update percentages
            updatePercentages();
        }
    }

    return{
        init:function () {
            console.log('Application had started.')
            UICtrl.displayMonth();
            UICtrl.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: -1
            });
            setupEventListeners();
        }
    }
})(budgetController,UIController)

controller.init();
