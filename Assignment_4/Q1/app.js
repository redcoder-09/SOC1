function myFunction(){
    const input = document.getElementById("userInput").value;
            
    const num = parseInt(input, 10);
            
    const starPatternElement = document.getElementById("starpattern");
            
    starPatternElement.innerHTML = "";

    if(!isNaN(num) && num>0 && num%2==1){
        let stars="";
        const mid = Math.floor(num / 2);

        for (let i = 0; i <= mid; i++) {
                    const spaces = "&nbsp;".repeat(2*i);
                    const starLine = "*".repeat(num - 2 * i);
                    stars += spaces + starLine + "<br>";
                }

        for (let i = mid - 1; i >= 0; i--) {
                    const spaces = "&nbsp;".repeat(2*i);
                    const starLine = "*".repeat(num - 2 * i);
                    stars += spaces + starLine + "<br>";
                }
        starPatternElement.innerHTML=stars;
     }
    else{
        document.getElementById("userInput").value = "";
        alert("Please enter a valid odd number.");
    }
}