

document.addEventListener('DOMContentLoaded', function(){
/*
    const anchors = document.getElementsByClassName('menu_link');
    console.log(anchors);
for (let anchor of anchors) {
  anchor.addEventListener('click', function (e) {
    e.preventDefault()
    
    const blockID = anchor.getAttribute('href')
    console.log(blockID);
    console.log(document.querySelector('' + blockID));
    document.querySelector("" + blockID).scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    })
  })
}*/

document.getElementById('menu_link_about').addEventListener('click',function(event){
    event.preventDefault();
    document.getElementById('food_menu').scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      })
})
document.getElementById('menu_link_contacts').addEventListener('click',function(event){
    event.preventDefault();
    document.getElementById('contacts').scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      })
})



console.log('main script is running');


})