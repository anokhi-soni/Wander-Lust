let Switch = document.querySelector("#switchCheckReverse");
        let prices = document.querySelectorAll(".price");
        let pricesAfterGST = document.querySelectorAll(".priceAfterGST");
        Switch.addEventListener("click", ()=>{
            
            for (const price of prices) {
                const Display = window.getComputedStyle(price).display; // when we do price.style.display it only reads the inline styling which are made to the elements, not external style sheet, but this window.getComputedStyle() reads the actual rendered CSS value, including external stylesheets.
                if(Display === "flex"){
                    console.log("made og invisible")
                    price.style.display = "none";
                } else {
                    console.log("made og visible")
                    price.style.display = "flex";
                }
            }

            for (const priceAfterGST of pricesAfterGST) {
                const Display = window.getComputedStyle(priceAfterGST).display;
                if(Display === "none"){
                    priceAfterGST.style.display = "flex";
                    console.log("made taxed visible");
                } else {
                    console.log("made taxed invisible");
                    priceAfterGST.style.display = "none";

                }
            }
        });