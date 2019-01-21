var budgetController = (function () {
    var Expense = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    };

    var test = function() {
        this.test2();
        this.testtt();
    };

    var test2 = function() {

    };

    return{   //return的这些方法是公有的，上面的是私有的。
        testtt : function(){
            var newItem = new Expense(1,'没有','真没有');
            console.log(newItem.description);
            console.log(newItem.percentage);
        }
    }
})();

var controller = (function (budgetCtrl) {
    budgetController.test();
})(budgetController)
