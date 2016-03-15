# EchoTasker
Amazon Echo skill that sends an AutoRemote message to Tasker with your speech. You can also use it to send SMS messages from the Echo with Tasker.

Let me note first that I don't know any programming languages, this type of stuff has always been a hobby and interesting to me. I was reading through the examples Amazon gives you for setting up a skill and around the same time came across and set up the Sonos skill found here: https://github.com/rgraciano/echo-sonos
It's an awesome skill, works great to control your Sonos stuff from the Echo so check it out as well. After setting it up I started reading through his files and just set up a duplicate on my Echo with a different name, then started modifying the code to get a feel for how it worked. So long story short, since I don't have a full grasp of what all the code does there are some lines that I'm sure aren't necessary but I just don't know enough to simplify it since I just modified and copied/pasted from other skills. I'm still reading up on Echo skills and javascript and have more I'd like to add to this as I get time. But it does work well as is. Anyone who actually knows what they are doing please feel free to clean this up a bit and help me learn something by explaining what you did or why it works that way.

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
- Enter a name and description. Under lambda function code choose upload a zip file. Zip up the 3 files in the lambda folder of this repository (make sure you added your amazon app id and autoremote key to the options.js file).
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
