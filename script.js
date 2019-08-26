var images = [];
var imageNames = [];
var labels = [];
var recognition;
var img = document.getElementById('img');
var label_div = document.getElementById('label_div');
var imageNameDiv = document.getElementById('imageNameDiv');

var index = 0;
var interim_span = document.getElementById('inter');
var interim_transcript;
var final_transcript = '';

function saveImages(input) 
{
    console.log('Saving image...');
    if (input.files && input.files[0]) 
    {
        for(var i=0;i<input.files.length;i++)imageNames.push(input.files[i].name)
        var reader = new FileReader();
        reader.onload = function (e) 
        {
            images.push(e.target.result);
            console.log('Image saved');
            if(images.length == input.files.length)startLabelling();
            else reader.readAsDataURL(input.files[++index]);
        }
        reader.readAsDataURL(input.files[0]);
    }    
}

function startLabelling()
{
    if (!('webkitSpeechRecognition' in window)&&!('SpeechRecognition' in window)) return;
    
    recognition = new webkitSpeechRecognition();
    recognition.onresult = onresult;
    recognition.onend = onend;
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    document.body.onkeypress = redoLastImage;
    index = 0;
    startRec();
    label_div.innerHTML="Recording please say aloud the label to each image. Press the 'b' key to go back to relabel the previous image.";

}

function startRec()
{   
    console.log("index: " + index.toString());
    img.setAttribute('src',images[index]);
    console.log("Recording Started");
    final_transcript = '';
    recognition.start();
}

function onresult(event) {
    interim_transcript = '';

    for (var i = event.resultIndex; i < event.results.length; ++i) {
      if (event.results[i].isFinal) {
        final_transcript += event.results[i][0].transcript;
      } else {
        interim_transcript += event.results[i][0].transcript;
      }
    }
    interim_span.innerHTML = interim_transcript;
  };

  function onend()
  {
    labels[index] = final_transcript;
    console.log("Recording ended");
    console.log('final transcript: ' + final_transcript);
    if(final_transcript=="") startRec();
    else if(++index < images.length)
        startRec();
    else
        {label_div.innerHTML=labels; imageNameDiv.innerHTML = imageNames;}
  }


  function redoLastImage(e)
  {
      if(e.key != "b" || index <1)return;
      console.log("Redoing last image");
      --index;
      img.setAttribute('src',images[index]);
  }