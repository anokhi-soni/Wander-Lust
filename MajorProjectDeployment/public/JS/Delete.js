let delBtns = document.querySelectorAll(".deleteButton");

for (const delBtn of delBtns) {
    delBtn.addEventListener("click", (event)=>{
        // console.log("BUTTON WAS CLICKED 🎉🎉🎉");
        // let temp = false;
        let permission = prompt("Do you really want to delete this post? (yes/no)");
        if(permission === null || permission.toLowerCase().trim() != "yes"){
            event.preventDefault();
            // temp = true;
        }
        // console.log(temp);
    })
}