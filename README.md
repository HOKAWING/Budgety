# Budgety
记账的js小项目

<img src="/pic1.png" width="900px" />

app.js
1. 回调函数
        var nodeListForEach = function(nodeList, callback) {
            /*回调好处：
                这个公用方法，在多个程序遍历nodeList时，避免了多次写for循环。
             */
            for (var i = 0; i < nodeList.length; i++) { //nodeList是有length属性的。
                callback(nodeList[i], i);
            }
        };
        
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

2. Event bubble up
        /*
            Event bubbling：The event is first fired on the button,but then it will also be fired on all the parent elements one at a time until the HTML element which is the               root.

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

3. Delete element
        //In JavaScript,we cannot simply delete an element,we can only delete a child.so this is a bit strange.
        el.parentNode.removeChild(el);


素材来自于网站
https://www.udemy.com/the-complete-javascript-course/learn/v4/content
