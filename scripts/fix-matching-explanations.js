import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const ROOT = process.cwd();
const filePath = join(ROOT, 'public/data/a1/a1-matching-common-verbs.json');
const data = JSON.parse(readFileSync(filePath, 'utf-8'));

const explanations = {
  "go": "\"I <go> to school every day.\" — Used for movement to a place.",
  "come": "\"Please <come> here.\" — Used for movement toward the speaker.",
  "eat": "\"I <eat> breakfast at 8 AM.\" — The act of consuming food.",
  "drink": "\"I <drink> water every morning.\" — The act of consuming liquids.",
  "sleep": "\"I <sleep> eight hours every night.\" — To rest with eyes closed.",
  "walk": "\"I <walk> to the park after lunch.\" — To move on foot at a normal pace.",
  "run": "\"She <runs> in the park every morning.\" — To move on foot quickly.",
  "read": "\"I <read> a book before bed.\" — To look at and understand written words.",
  "write": "\"He <writes> emails at work.\" — To put words on paper or a screen.",
  "speak": "\"She <speaks> three languages.\" — To use your voice to say words.",
  "listen": "\"<Listen> to the teacher, please.\" — To pay attention to sounds or words.",
  "see": "\"I can <see> the mountains from here.\" — To perceive with your eyes.",
  "look": "\"<Look> at this photo!\" — To direct your eyes at something intentionally.",
  "watch": "\"We <watch> TV in the evening.\" — To look at something for a period of time.",
  "play": "\"The children <play> in the garden.\" — To do an activity for fun.",
  "work": "\"I <work> from Monday to Friday.\" — To do a job or task.",
  "study": "\"She <studies> English at school.\" — To learn about a subject.",
  "learn": "\"I want to <learn> to cook.\" — To gain knowledge or a new skill.",
  "teach": "\"He <teaches> math to children.\" — To give knowledge to someone.",
  "help": "\"Can you <help> me, please?\" — To assist someone.",
  "open": "\"Please <open> the window.\" — To make something not closed.",
  "close": "\"<Close> the door, please.\" — To make something shut.",
  "start": "\"Classes <start> at 9 AM.\" — To begin something.",
  "finish": "\"I <finish> work at 5 PM.\" — To complete or end something.",
  "buy": "\"I <buy> groceries on Saturdays.\" — To get something by paying money.",
  "sell": "\"They <sell> fresh fruit at the market.\" — To give something in exchange for money.",
  "give": "\"I <give> her a present for her birthday.\" — To hand something to someone.",
  "take": "\"<Take> your umbrella, it's raining.\" — To get or carry something.",
  "make": "\"She <makes> dinner every evening.\" — To create or produce something.",
  "do": "\"I <do> my homework after school.\" — To perform an action or task.",
  "have": "\"I <have> two brothers.\" — To possess or own something.",
  "be": "\"I <am> happy today.\" — To exist or describe a state.",
  "like": "\"I <like> chocolate ice cream.\" — To enjoy something.",
  "love": "\"I <love> my family.\" — To have a very strong positive feeling.",
  "want": "\"I <want> a glass of water.\" — To desire or wish for something.",
  "need": "\"I <need> a new notebook.\" — To require something.",
  "know": "\"I <know> the answer.\" — To have information or be familiar with something.",
  "think": "\"I <think> it's a good idea.\" — To use your mind to form opinions.",
  "feel": "\"I <feel> tired today.\" — To experience an emotion or physical sensation.",
  "live": "\"I <live> in a small town.\" — To have your home in a place.",
};

let fixed = 0;
for (const item of data) {
  if (!item.explanation && explanations[item.left]) {
    item.explanation = explanations[item.left];
    fixed++;
  }
}

writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n');
console.log(`Fixed: ${fixed}/40 items`);
