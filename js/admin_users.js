function users_visual(result) {
    console.log(result);
    var content_holder = document.getElementById('users_content');

    document.forms.get_user.onsubmit = function () {
        event.preventDefault();

        var result = {};
        var amountForm = document.forms.get_user;

        for (var i = 0; i < amountForm.elements.length; i++) {
            if (amountForm.elements[i].tagName === 'INPUT') {
                result[amountForm.elements[i].name] = amountForm.elements[i].value;
            }
        }

        var xhr = new XMLHttpRequest();
        xhr.open('POST', '/users/find', true);
        xhr.setRequestHeader("Content-type", "application/json");
        xhr.onreadystatechange = function () {
            if (this.readyState === 4 && this.status === 200) {
                console.log('response', xhr.response);
                content_holder.innerHTML = '';
                headBuilder(JSON.parse(xhr.response))
                tabBuilder(JSON.parse(xhr.response));
            }
        };
        xhr.send(JSON.stringify(result));

    }

    function tabBuilder(arr) {

        arr.forEach(function (userFoundObject) {
            console.log(userFoundObject);
            var line = document.createElement('div');
            line.classList.add('stock_table_line');
            for (item in userFoundObject) {

                var row = document.createElement('div');
                row.classList.add('table_cell');
                var name = document.createElement('p');
                name.innerHTML = userFoundObject[item];
                row.appendChild(name);
                line.appendChild(row);
            }
            var changeStatusButton = document.createElement('button');
            changeStatusButton.value = userFoundObject._id;
            changeStatusButton.onclick = changeStatus;
            changeStatusButton.classList.add('table_cell', 'stock_update_button');
            changeStatusButton.innerText = 'Change status';

            line.appendChild(changeStatusButton);
            content_holder.appendChild(line);
        })
    }
    function headBuilder(arr) {

            var line = document.createElement('div');
            line.classList.add('stock_table_line');
            for (item in arr[0]) {
                var row = document.createElement('div');
                row.classList.add('table_cell');
                var name = document.createElement('p');
                name.classList.add('triangle_top');
                name.innerHTML = item;
                row.appendChild(name);
                line.appendChild(row);
            }
            row = document.createElement('div');
            row.classList.add('table_cell');
            line.appendChild(row);
           
            content_holder.appendChild(line);



    }
    function changeStatus(event){
        // sending the http request with the name of field in DB to change status
        console.log(event.target.value);
        var submission = new Event("submit");
        var obj = {_id : event.target.value}
        var xhr = new XMLHttpRequest();
        xhr.open('post','/users/find_update_status');
        xhr.setRequestHeader("Content-type", "application/json");
        xhr.onreadystatechange = function(){
            if(this.readyState === 4 && this.status === 200){
                //update the search
                console.log(this.responseText);
                document.forms.get_user.dispatchEvent(submission);
            }
        };
        xhr.send(JSON.stringify(obj));        

        

    }

}

