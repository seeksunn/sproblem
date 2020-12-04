    function pickword() {      
      var index = Math.floor(Math.random() * words.length);     
      document.getElementById('userConsole').innerHTML = " ";   
      document.getElementById('target').innerHTML = words[index];
      document.getElementById("continueBtn").style.display = "none";
      document.getElementById("readBtn").style.display = "inline";
      document.getElementById("speakBtn").style.display = "inline";
      document.getElementById("continueBtn").innerHTML = "Next";
      if (words[index]==undefined) {
        document.getElementById('target').innerHTML = " ";
        document.getElementById("readBtn").style.display = "none";
        document.getElementById("speakBtn").style.display = "none";        
        document.getElementById("continueBtn").style.display = "none";
        document.getElementById("completedForm").style.display = "block";
      }
      if (index > -1) {
        words.splice(index, 1);
      }              
    }    

    function ttspeech(){
        var text = document.getElementById("target").innerHTML;        
        window.speechSynthesis.speak(new SpeechSynthesisUtterance(text));
    }

    function speechToText() {
      if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {                       
        document.getElementById("speakBtn").innerHTML = "Listening...";
        document.getElementById("continueBtn").style.display = "none"; 
        document.getElementById("speakBtn").disabled = true;
        var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
        var recognition = new SpeechRecognition();
        recognition.lang = 'en-US';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;
        recognition.onspeechend = function() {
          document.getElementById("userConsole").innerHTML = "กำลังดำเนินการ....";
          recognition.stop();                 
        }
        recognition.onresult = function(event) {                
          var result = event.results[0][0].transcript;
          document.getElementById("speakBtn").innerHTML = "Speak";
          if(result == document.getElementById("target").innerHTML) {
            document.getElementById("userConsole").innerHTML = "คุณออกเสียงถูกต้อง";
            document.getElementById("speakBtn").disabled = false;
            document.getElementById("speakBtn").style.display = "none";                                        
            document.getElementById("continueBtn").style.display = "inline";                       
          } else {
            document.getElementById("userConsole").innerHTML = "คำที่ได้ยิน : "+result+"<br>คุณออกเสียงผิด กรุณาลองใหม่อีกครั้ง";
            document.getElementById("speakBtn").disabled = false;
          }
        }
        recognition.start()            
      } else {
        alert("Your Browser is not support web speech api (see caniuse.com/speech-recognition for more info)")
      }
    }
    function test(){
        alert(ok);
    }