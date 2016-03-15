# EchoTasker
Amazon Echo skill that sends an AutoRemote message to Tasker with your speech. You can also use it to send SMS messages from the Echo with Tasker.

Let me note first that I don't know any programming languages, this type of stuff has always been a hobby and interesting to me. I was reading through the examples Amazon gives you for setting up a skill and around the same time came across and set up the Sonos skill found here: https://github.com/rgraciano/echo-sonos
It's an awesome skill, works great to control your Sonos stuff from the Echo so check it out as well. After setting it up I started reading through his files and just set up a duplicate on my Echo with a different name, then started modifying the code to get a feel for how it worked. So long story short, since I don't have a full grasp of what all the code does there are some pieces of code that I'm sure aren't necessary but I just don't know enough to simplify it since I just modified and copied/pasted from other skills. I'm still reading up on Echo skills and javascript and playing around with things to add in. But it does work well as is.

#Instructions 
Go to developer.amazon.com and create an account.  Once on the home page click on apps and services then click on Alexa.
- Under Alexa Skills Kit click get started. Fill in a name and the invocation name you want to use (I used "Tasker") and a number for version.
- Under endpoint we will use ARN eventually, but we don't yet have this address so just pick http for now and put in a dummy address and we'll come back here later. Click next.
- Under intent schema copy the text from the intents.json file in this repository.
- Under sample utterances copy the text from the utterances.txt file in this repository.
- Click add slot type. For type write PEOPLE, then for values write in all the names you want to be able to text. You could also just do this from tasker but this helps verify you pick a correct name to text.
- Once you're all done click save.

If you haven't already, download the 3 files in the lambda folder of this repository (AlexaSkill.js, index.js, options.js)
- Open options.js in wordpad or some text editor. Get your AutoRemote key from your AutoRemote web page (the goo.gl/xxxxx site). It's the long set of characters after the word key= that will show up in your address bar after you get to your AutoRemote page. Copy that key into the options.js file under ARkey: "PUT_YOUR_AUTOREMOTE_KEY_HERE".
- Go back to developer.amazon.com and get back to your skill (Go to Alexa Skills kit Get started > click on your skill).
- Copy the Application ID into the options.js file under appid: "amzn1.echo-sdk-ams.app.xxxxxxxxx".

Go to aws.amazon.com and sign up for an account. Make sure in the top right it says N. Virginia, that is needed for some reason. On the left under "Compute" click on "lambda".
- Click on create a lambda function
- On the select blueprint screen go to the bottom and click skip
- Enter a name and description. Under lambda function code choose upload a zip file. Zip up only the 3 .js files in this repository (make sure you added your amazon app id and autoremote key to the options.js file).
- Under role on the page click basic execution role. This will have a pop up you'll need to click allow. Leave the rest to the defaults filled in. Then click create lambda function at the bottom.
- On the next page there should be an ARN address at the top right, copy that and we'll paste it in the alexa skill ARN address.
- Click on the event sources. Add event source. Select Alexa Skills kit and submit.
- Now go back to developer.amazon.com and get back to your skill (Go to Alexa Skills kit Get started > click on your skill)
- Paste the ARN address into the endpoint field where we put a dummy address earlier. Select the ARN radio button. Click save.

That should be it!

#Tasker Setup
Now you just need to setup your tasker profiles. I appended "echo" to each basic tasker message and the message as a command (echo=:=message) so in tasker setup a AutoRemote event behavior profile with "echo" as the text. Then for the task use AutoVoice test command and put %arcomm as the text. This will put the message sent from echo into an AutoVoice evaluation. So any AutoVoice profile you already have can be triggered from Echo.

For SMS the Echo will send "text_name=:=message" as the auto remote message. I made an AutoRemote event behavior profile that recognizes the message "text_" using regex. Then link that to a Send SMS task that just says if %armessage matches by regex (contact name) then Send SMS to that contacts number. EndIf. Do if statements for each person you want this to work for. I'm sure there are other ways to filter this like comapre to your contacts but this was a simple method for the few people I will text from the Echo. I didn't want it accidentally texting some random other contact in my phone for a misheard name.

If you look through the index.js file you should be able to see how the autoremote message works and can change what it sends if you like.

#Speech Design
If you look over the utterances file here you can see what you are supposed to say to get it to recognize you want to send a text. If you don't use those utterances it should just send the speech to Tasker.

It's worth reading through the Amazon page here about designing the voice interface so you see what they are looking for:
https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/defining-the-voice-interface

Examples are: "Alexa, tell Tasker to text (Person) (message)"

"Alexa, ask Tasker to send a message to (Person) saying (message)"

"Alexa, tell Tasker to (AutoRemote message)"

Sometimes if you just say Tell Tasker (message) it doesn't capture. It sometimes wants an "ask Tasker for" "tell Tasker to" format.

Also read below information from Amazon. It will explain the variable type we are using to pass the message. I only included samples up to 7 words long. They recommend multiple samples up to the length of the longest set of words you intend to pass. So you may want to add some to the utterances if you are seeing problems passing the messages. It also recommends against using "meaningless placeholder words in the sample phrase just to fill the slot with the right number of words" but I did that and it seems to work fine. Occassionally though I do notice if it doesn't hear me correctly it will pass one of the samples in the utterances as the AutoRemote message.

#From Amazon
https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/alexa-skills-kit-interaction-model-reference

(Just FYI, good read on how it works.)

LITERAL Slot Type Reference

The AMAZON.LITERAL slot type passes the words for the slot value with no conversion. This is primarily provided for compatibility with earlier versions of the Alexa Skills Kit and some very limited cases in which the built-in and custom slot types are not appropriate. For situations in which the slot value can be one of a set of known values, use a custom slot type instead. For information about migrating a skill from AMAZON.LITERAL to a custom type, see Migrating to the Improved Built-in and Custom Slot Types.

When using AMAZON.LITERAL, you must include sample slot values within the curly brackets defining the slot in the utterance:

StatusUpdate    post the update {out at lunch|UpdateText}
Note the following rules and recommendations.

Include samples with different numbers of words for the slot value:

Samples with the minimum number of words you expect for the slot value.
Samples with the maximum number of words for the slot value.
Samples with all varying numbers of words between the minimum and the maximum expected.
These samples should always include only slot values that represent actual phrases the user might say. Do not use meaningless placeholder words in the sample phrase just to fill the slot with the right number of words. Instead, fill the sample slot value with real-world examples of the data you want to collect in the slot.

If you are using the AMAZON.LITERAL type to collect free-form text with wide variations in the number of words that might be in the slot, note the following:

Covering this full range (minimum, maximum, and all in between) will require a very large set of samples. Try to provide several hundred samples or more to address all the variations in slot value words as noted above.
Keep the phrases within slots short enough that users can say the entire phrase without needing to pause.
Lengthy spoken input can lead to lower accuracy experiences, so avoid designing a spoken language interface that requires more than a few words for a slot value. A phrase that a user cannot speak without pausing is too long for a slot value.

For example, the intent for an ability that posts the user’s spoken words to a social media site might have an UpdateText slot that collects the text to post. Values for this slot range from just one word to about nine or ten words. The sample utterances to support this intent should cover a range of words such as the following:

1
2
3
4
5
6
7
StatusUpdate    post the update {arrived|UpdateText}
StatusUpdate    post the update {dinner time|UpdateText}
StatusUpdate    post the update {out at lunch|UpdateText}
 
...(more samples showing phrases with  4-10 words)
 
StatusUpdate    post the update {going to stop by the grocery store this evening|UpdateText}
This set includes sample slot values ranging from one word (“arrived”) to about ten words. This type of sample coverage should provide better recognition.

#Modifications
Something else I did on my echo was make 3 duplicate skills out of this and give them different invocation names. 

For example I named one skill "Jason" and modified the index.js file slightly so that the autoremote message always starts with the send text to Jason command. So now I can say "Alexa, tell Jason that (message)" and it will send a message to Jason. Easier than saying "Alexa, tell Tasker to text Jason (message)". You could also say "Alexa, tell Jason to text (Person) (Message). If you set up a different AutoRemote address for each skill then asking Jason to text would send the text from his phone, then saying "Tell Bridget to text (Person) (Message)" would send the text from her phone. That way multiple users in the house aren't all sending texts coming from one person's phone.
