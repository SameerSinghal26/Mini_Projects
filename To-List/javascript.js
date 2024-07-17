
let inputbox = document.querySelector('#inputbox');
let list = document.querySelector('#list');
let popup = document.querySelector('#popup');
let close = document.querySelector('#close-popup');

inputbox.addEventListener("keyup",function(event){
    if(event.key == "Enter"){
        if(this.value.trim()!== ""){
            addItem(this.value.trim());
            this.value = "";
        }
        else{
            popup.style.display = 'flex';
        }
    }
})

close.addEventListener('click', function() {
    popup.style.display = 'none';
});

let addItem = (inputbox) => {
    let listItem = document.createElement("li");
    listItem.innerHTML = `${inputbox}<i>`;

    listItem.addEventListener("click",function(){
        this.classList.toggle('done');
    })

    listItem.querySelector("i").addEventListener("click",function(event){
        event.stopPropagation();
        listItem.remove();
    })

    list.appendChild(listItem);
}
