//parse content to HTML
function parseToHtml(lyricsContent){

    let splitContent = lyricsContent.split('');
    let previousWasSpace =false;
    let previousWasChord = false;
    let previousWasSpecialLine = false;

    for(let i = 0; i<splitContent.length; i++){
        if(splitContent[i] === ' '){
            if(previousWasSpace){
                splitContent[i] = "&nbsp;";
                previousWasSpace = false;
                continue;
            }
            previousWasSpace = true;
        }else{
            previousWasSpace = false;
        }
        if(splitContent[i]==="`"){
            previousWasChord = true;
            splitContent[i] = `<font color='#CHORDCOLOR#'>`;
        }
        if(splitContent[i] ==="_"){
            previousWasSpecialLine = true;
            splitContent[i]= `<font color='#SPECIALCOLOR#'>`
        }
        switch(splitContent[i]){
            case'\n':
                if(previousWasChord){
                    splitContent[i] = `</font><br/>`;
                    previousWasChord = false;
                }
                else if(previousWasSpecialLine){
                    splitContent[i]=`</font><br/>`;
                }
                else{
                    splitContent[i] = `<br/>`;
                }
                
                break;
                case'\t':
                splitContent[i]= "&nbsp; &nbsp; &nbsp;";
                break;
            default:
            splitContent[i];
            
        }
    }
    return splitContent.join('');
}