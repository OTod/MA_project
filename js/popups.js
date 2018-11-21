document.addEventListener('DOMContentLoaded', function(){
    
    //popups manipulation - show/hide/close

    //popup showing function
    function showPopup(classname){
        var popup = document.getElementsByClassName(classname);
        popup[0].style.display = 'block';

    }
    
    //adding event listener to open popup
    var login = document.getElementsByClassName('login_popup');


    var toggleLogin = document.getElementById('log_in_selector');
    toggleLogin.addEventListener('click',function(){
        showPopup('popup_container');
        login[0].style.right = '10%';
    });   

    var registration = document.getElementsByClassName('reg_popup');
    var login = document.getElementsByClassName('login_popup');
    //adding event LIstener to the register button and showing the register popup
    var toggleReg = document.getElementById('registration_button');
    toggleReg.addEventListener('click',function(){
        login[0].style.right = '-30%';
        login[0].classList.add('slide_out');
        registration[0].style.display = 'block';       
    })

    //popup closing function
    function hidePopup(){
        var popup = document.getElementsByClassName('popup_container');
        popup[0].style.display = 'none';
        
        var loginForm = document.forms.login_popup;
        loginForm.reset();
        var regForm = document.forms.reg_form;
        regForm.reset();
        registration[0].style.display = 'none';  
        login[0].classList.remove('slide_out');       

        for (i=0; i<document.forms.length; i++){
            for (j=0; j<document.forms[i].length; j++){
                if(document.forms[i][j].type === 'text' || document.forms[i][j].type === 'password'){
                    document.forms[i][j].classList.remove('passed_validation','not_passed_validation');
                }
            }
        }    
    
    
    }    
    

    //adding closing function to the popup
    var popup_container = document.getElementsByClassName('popup_container');
    popup_container[0].addEventListener('click',function(event){
        if(event.target.className === 'popup_container' || event.target.className === 'popup_close_button'){
            hidePopup();
        }
    })

    //popup input verification and creating the post requests - visuals
    var loginForm = document.forms.login_popup;
    document.forms.reg_form.addEventListener('input',function(event){
        var regExpNames = /^[a-zа-я]{1,}$/i;
        var regExpMail = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
        var regExpPass = /^.{6,}/igm;
        var value = event.target.value;
        function validate(regexp, value){
            if(regexp.test(value)){
                event.target.classList.add('passed_validation');
                event.target.classList.remove('not_passed_validation');
            } else {
                event.target.classList.add('not_passed_validation');
                event.target.classList.remove('passed_validation');
            }
        }
        if(event.target.type ==='text'){
            if (event.target.name === 'login'|| event.target.name === 'surname'||event.target.name === 'name'){      
            validate(regExpNames,value);
            };
            if (event.target.name === 'mail'){
            validate(regExpMail,value);                
            }            
        }
        if (event.target.type === 'password'){
            validate(regExpPass,value);
        }
/*
        var reg_send = document.getElementById('registration_submit_button');
        if (enableSubmit(reg_form)){
            reg_send.type = 'submit';
        } else{
            reg_send.type = 'button';
        }*/
    })

    // blocking the sumbits in case of empty or unproper input
    function enableSubmit(formName){
        var enabled = true;
        for(var i=0; i<formName.elements.length; i++){
            if(formName.elements[i].type === 'text' || formName.elements[i].type === 'password'){
                if (formName.elements[i].classList.contains('not_passed_validation'))
                enabled = false;
            }            
        }
        return enabled;        
    }

    //forming the registration input and request

    document.forms.reg_form.addEventListener('submit',function(event){
        event.preventDefault();
        var data = Array.from(this.elements);
        var outputData = {};
        data.forEach(function(item){
            if(item.type === 'text' || item.type === 'password'){
                outputData[item.name] = item.value;
            }
        })
        outputData.status = 'guest';
        //alert('thenks for the registration!');
        //forming the POST request
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                alert('thanks for the registration!');
            }
          };        
        xhr.open('POST','/register',true);
        xhr.setRequestHeader("Content-type", "application/json");
        xhr.send(JSON.stringify(outputData)); 
        
        hidePopup();
    })



    //function that loads managing page and its styles - unfinished
    /*function gotomanagement(){
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                var oldlink = document.getElementsByTagName("link")[0];
                console.log(oldlink);
                document.body.innerHTML = this.responseText;
                var newlink = document.createElement('link');
                newlink.setAttribute("rel", "stylesheet");
                newlink.setAttribute("type", "text/css");
                newlink.setAttribute("href", '/css/Admin_page_style.css');
                var newscript = document.createElement('script');
                newscript.setAttribute('src','/admin_page.js');
                document.getElementsByTagName("head").item(0).replaceChild(newlink, oldlink);

            }
          };        
        xhr.open('GET','/Administration page.html',true);
        xhr.send(); 
        
        hidePopup();
    }*/
    //forming the logging in procedure and requests
    
    document.forms.login_popup.addEventListener('submit',function(){
        event.preventDefault();
        var data = Array.from(this.elements);
        var outputData = {};
        for (var i = 0; i<data.length; i++){
            if(data[i].type === 'text' || data[i].type === 'password'){
                
                if (data[i].value === ''){
                    alert('please, enter correct');
                    break;
                } else {
                    outputData[data[i].name] = data[i].value;
                }
            }
        }
        console.log(outputData);
        if(Object.keys(outputData).length>1){
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                /*
                var div = document.getElementsByClassName('menu_after');
                console.log(this.response);
                   
                    var resp = JSON.parse(this.response)[0];  
                    text = 'Hello, '+resp.name+' '+resp.surname+'! You can ';
                    
                    var button = document.createElement('a');
                    button.href='./Food_menu.html';
                    //button.addEventListener('click',gotomanagement);
                    button.innerHTML = '<u>Order online!</u>';
                    div[0].appendChild(button);

                    console.log(this.response);
                    hidePopup();
*/
                if(JSON.parse(this.responseText).length){
                    window.location.replace('/');
                } else {
                    alert('Please, enter correct login and password. Dont have one? Use "register".');
                }                
            }
          };        

        xhr.open('POST','/login',true);
        xhr.setRequestHeader("Content-type", "application/json");
        xhr.send(JSON.stringify(outputData)); }
    })
    




function getLogged(){
    var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                var div = document.getElementsByClassName('menu_after');
                if(!!this.response){
                   var resp = JSON.parse(this.response);
                    console.log(this.response);
                    if(resp.status == 'admin'){
                        var text = 'Hello '+resp.name + ' '+resp.surname+'! <a href="/management"><u>   Managing page</u></a>  <big>/</big> <span class="logout_button"><u>Logout</u></span>'; 
                    }else{
                        var text = 'Hello '+resp.name + ' '+resp.surname+'! <a href="/Foodmenu"><u>   Order online</u></a>  <big>/</big> <span class="logout_button"><u>Logout</u></span>';
                    }                   
                    
                    div[0].innerHTML = text; 
                    var logoutButton = document.getElementsByClassName('logout_button');
                    logoutButton[0].addEventListener('click',logout);
                }else{
                    console.log('not logged in');
                    div[0].innerHTML = 'Please, log in to get access to additional functionality.';  
                }    
            }
          };        
        xhr.open('get','/logged',true);
        xhr.setRequestHeader("Content-type", "application/json");
        xhr.send(); 
}

getLogged();

function logout(){
    var xhr = new XMLHttpRequest();
       
        xhr.open('get','/logout',true);
        xhr.setRequestHeader("Content-type", "application/json");
        xhr.send(); 
        window.location.replace('/');
}





})