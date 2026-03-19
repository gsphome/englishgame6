import { writeFileSync, readFileSync } from 'fs';
import { join } from 'path';

// ============================================================
// GENERATOR: 26 new learning modules across all CEFR levels
// ============================================================

const DATA_DIR = 'public/data';

function writeJSON(filePath, data) {
  writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n');
  console.log(`✅ Created: ${filePath}`);
}

// ============================================================
// A1 MODULES (+5)
// ============================================================

// 1. A1 Reading: Phrasal Verbs in Context
const a1ReadingPhrasalVerbs = {
  title: "Phrasal Verbs in Everyday Life",
  estimatedReadingTime: 6,
  learningObjectives: [
    "Understand basic phrasal verbs in context",
    "Learn how phrasal verbs are used in daily conversations",
    "Recognize common phrasal verbs in simple stories",
    "Build confidence using phrasal verbs naturally"
  ],
  sections: [
    {
      id: "intro",
      title: "What Are Phrasal Verbs?",
      type: "introduction",
      content: "Phrasal verbs are very common in English. They are verbs with a small word after them, like 'get up', 'look for', or 'turn on'. The small word changes the meaning of the verb. For example, 'look' means to see, but 'look for' means to search. Let's see how people use phrasal verbs every day."
    },
    {
      id: "morning-routine",
      title: "A Morning Routine",
      type: "theory",
      content: "Every morning, Tom wakes up at 7 o'clock. He gets up slowly and turns on the light. He puts on his clothes and goes downstairs. He sits down at the table and picks up his phone to check messages. Then he goes out to catch the bus.\n\nNotice the phrasal verbs:\n• Wake up - stop sleeping\n• Get up - leave the bed\n• Turn on - start a machine or light\n• Put on - wear clothes\n• Sit down - take a seat\n• Pick up - take something with your hand\n• Go out - leave the house"
    },
    {
      id: "at-school",
      title: "At School",
      type: "theory",
      content: "At school, the teacher says: 'Please sit down and take out your books.' The students look at the board. When they don't understand, they ask the teacher: 'Can you slow down, please?' At the end of class, the teacher says: 'Please hand in your homework and clean up your desk.'\n\nPhrasal verbs at school:\n• Take out - remove from a bag\n• Look at - direct your eyes to something\n• Slow down - go less fast\n• Hand in - give to the teacher\n• Clean up - make tidy"
    },
    {
      id: "examples",
      title: "More Examples",
      type: "examples",
      content: "Example 1: 'I need to find out what time the movie starts.' (find out = discover)\n\nExample 2: 'Can you turn off the TV? It's too loud.' (turn off = stop a machine)\n\nExample 3: 'She always comes back home at 5 PM.' (come back = return)\n\nExample 4: 'Let's go on with the lesson.' (go on = continue)"
    },
    {
      id: "summary",
      title: "Key Takeaways",
      type: "summary",
      content: "Remember:\n• Phrasal verbs = verb + small word (up, down, on, off, out, in)\n• They are very common in everyday English\n• The small word changes the meaning of the verb\n• Practice using them in simple sentences\n• You already know many: wake up, sit down, turn on!"
    }
  ],
  keyVocabulary: [
    { term: "wake up", definition: "To stop sleeping", example: "I wake up at 7 every morning.", pronunciation: "/weɪk ʌp/" },
    { term: "get up", definition: "To leave the bed and stand", example: "She gets up early on weekdays.", pronunciation: "/ɡet ʌp/" },
    { term: "turn on", definition: "To start a machine or light", example: "Please turn on the light.", pronunciation: "/tɜːrn ɒn/" },
    { term: "turn off", definition: "To stop a machine or light", example: "Turn off the TV before bed.", pronunciation: "/tɜːrn ɒf/" },
    { term: "put on", definition: "To wear clothes", example: "Put on your jacket, it's cold.", pronunciation: "/pʊt ɒn/" },
    { term: "pick up", definition: "To take something with your hand", example: "Pick up your bag from the floor.", pronunciation: "/pɪk ʌp/" },
    { term: "find out", definition: "To discover information", example: "I need to find out the answer.", pronunciation: "/faɪnd aʊt/" },
    { term: "come back", definition: "To return to a place", example: "Come back home before dark.", pronunciation: "/kʌm bæk/" }
  ],
  grammarPoints: [
    {
      rule: "Phrasal Verb Structure",
      explanation: "A phrasal verb is a verb + particle (preposition or adverb). The particle changes the meaning.",
      examples: ["look + up = search for information", "turn + on = start", "get + up = rise from bed"],
      commonMistakes: ["Forgetting the particle: 'I woke at 7' should be 'I woke up at 7'"]
    }
  ]
};

// 2. A1 Reading: Idioms in Context
const a1ReadingIdioms = {
  title: "Common Idioms in Daily Life",
  estimatedReadingTime: 6,
  learningObjectives: [
    "Understand what idioms are",
    "Learn basic idioms used in everyday conversations",
    "Recognize idioms in simple stories",
    "Use basic idioms in context"
  ],
  sections: [
    {
      id: "intro",
      title: "What Are Idioms?",
      type: "introduction",
      content: "Idioms are special phrases in English. The words together have a different meaning from each word alone. For example, 'a piece of cake' doesn't mean real cake — it means something is very easy! Idioms make English fun and colorful."
    },
    {
      id: "easy-idioms",
      title: "Easy Idioms for Beginners",
      type: "theory",
      content: "Here are some idioms you can use every day:\n\n• A piece of cake - Something very easy. 'The test was a piece of cake!'\n• Break a leg - Good luck! 'You have a test tomorrow? Break a leg!'\n• Hit the books - Start studying. 'I need to hit the books tonight.'\n• Under the weather - Feeling sick. 'I'm under the weather today.'\n• It's raining cats and dogs - It's raining very hard. 'Take an umbrella, it's raining cats and dogs!'"
    },
    {
      id: "story",
      title: "A Story with Idioms",
      type: "theory",
      content: "Maria has a big test tomorrow. She needs to hit the books all evening. Her friend calls and says: 'Break a leg tomorrow!' Maria studies hard. The next day, the test is a piece of cake! She is very happy. But after school, she feels under the weather, so she goes home early. Outside, it's raining cats and dogs, so she takes a taxi.\n\nCan you find all five idioms in the story?"
    },
    {
      id: "examples",
      title: "More Idiom Examples",
      type: "examples",
      content: "Example 1: 'Let's call it a day.' (= Let's stop working for today)\n\nExample 2: 'She has a sweet tooth.' (= She loves sweet food)\n\nExample 3: 'He's feeling blue.' (= He's feeling sad)\n\nExample 4: 'Keep an eye on your bag.' (= Watch your bag carefully)"
    },
    {
      id: "summary",
      title: "Key Takeaways",
      type: "summary",
      content: "Remember:\n• Idioms have a special meaning different from the individual words\n• They are very common in everyday English\n• Start with easy idioms and practice using them\n• Context helps you understand new idioms\n• Don't translate idioms word by word!"
    }
  ],
  keyVocabulary: [
    { term: "a piece of cake", definition: "Something very easy", example: "This homework is a piece of cake!", pronunciation: "/ə piːs əv keɪk/" },
    { term: "break a leg", definition: "Good luck!", example: "Break a leg at your interview!", pronunciation: "/breɪk ə leɡ/" },
    { term: "hit the books", definition: "Start studying", example: "I need to hit the books for my exam.", pronunciation: "/hɪt ðə bʊks/" },
    { term: "under the weather", definition: "Feeling sick or unwell", example: "I'm a bit under the weather today.", pronunciation: "/ˈʌndər ðə ˈweðər/" },
    { term: "call it a day", definition: "Stop working for today", example: "It's late, let's call it a day.", pronunciation: "/kɔːl ɪt ə deɪ/" },
    { term: "keep an eye on", definition: "Watch carefully", example: "Keep an eye on the children.", pronunciation: "/kiːp ən aɪ ɒn/" }
  ],
  grammarPoints: [
    {
      rule: "Using Idioms in Sentences",
      explanation: "Idioms work like regular phrases in sentences. You can use them with different subjects and tenses.",
      examples: ["The test was a piece of cake. (past)", "This will be a piece of cake. (future)", "She always hits the books before exams. (present)"],
      commonMistakes: ["Changing words in the idiom: 'a piece of pie' is wrong — say 'a piece of cake'"]
    }
  ]
};

// 3. A1 Flashcard: Daily Life Vocab (reinforcing orphaned terms)
const a1FlashcardDailyLifeVocab = [
  { front: "Have breakfast", back: "Desayunar", ipa: "/hæv ˈbrekfəst/", example: "I have breakfast at 8 AM.", example_es: "Desayuno a las 8 AM." },
  { front: "Come home", back: "Llegar a casa", ipa: "/kʌm hoʊm/", example: "I come home after work.", example_es: "Llego a casa después del trabajo." },
  { front: "Directions", back: "Direcciones / Indicaciones", ipa: "/dəˈrekʃənz/", example: "Can you give me directions to the park?", example_es: "¿Puedes darme indicaciones para llegar al parque?" },
  { front: "Have lunch", back: "Almorzar", ipa: "/hæv lʌntʃ/", example: "We have lunch at noon.", example_es: "Almorzamos al mediodía." },
  { front: "Have dinner", back: "Cenar", ipa: "/hæv ˈdɪnər/", example: "They have dinner at 7 PM.", example_es: "Cenan a las 7 PM." },
  { front: "Go to bed", back: "Ir a la cama", ipa: "/ɡoʊ tə bed/", example: "I go to bed at 10 PM.", example_es: "Me voy a la cama a las 10 PM." },
  { front: "Take a shower", back: "Ducharse", ipa: "/teɪk ə ˈʃaʊər/", example: "I take a shower every morning.", example_es: "Me ducho todas las mañanas." },
  { front: "Brush teeth", back: "Cepillarse los dientes", ipa: "/brʌʃ tiːθ/", example: "Brush your teeth before bed.", example_es: "Cepíllate los dientes antes de dormir." },
  { front: "Get dressed", back: "Vestirse", ipa: "/ɡet drest/", example: "I get dressed quickly in the morning.", example_es: "Me visto rápido por la mañana." },
  { front: "Go shopping", back: "Ir de compras", ipa: "/ɡoʊ ˈʃɑːpɪŋ/", example: "We go shopping on Saturdays.", example_es: "Vamos de compras los sábados." },
  { front: "Do homework", back: "Hacer la tarea", ipa: "/duː ˈhoʊmwɜːrk/", example: "She does homework after school.", example_es: "Ella hace la tarea después de la escuela." },
  { front: "Watch TV", back: "Ver televisión", ipa: "/wɑːtʃ tiː viː/", example: "We watch TV in the evening.", example_es: "Vemos televisión por la noche." },
  { front: "Listen to music", back: "Escuchar música", ipa: "/ˈlɪsən tə ˈmjuːzɪk/", example: "I listen to music on the bus.", example_es: "Escucho música en el autobús." },
  { front: "Play sports", back: "Hacer deporte", ipa: "/pleɪ spɔːrts/", example: "He plays sports after school.", example_es: "Él hace deporte después de la escuela." },
  { front: "Cook dinner", back: "Cocinar la cena", ipa: "/kʊk ˈdɪnər/", example: "My mom cooks dinner every day.", example_es: "Mi mamá cocina la cena todos los días." },
  { front: "Clean the house", back: "Limpiar la casa", ipa: "/kliːn ðə haʊs/", example: "We clean the house on weekends.", example_es: "Limpiamos la casa los fines de semana." },
  { front: "Walk the dog", back: "Pasear al perro", ipa: "/wɔːk ðə dɔːɡ/", example: "I walk the dog every morning.", example_es: "Paseo al perro todas las mañanas." },
  { front: "Read a book", back: "Leer un libro", ipa: "/riːd ə bʊk/", example: "She reads a book before bed.", example_es: "Ella lee un libro antes de dormir." },
  { front: "Go for a walk", back: "Ir a caminar", ipa: "/ɡoʊ fɔːr ə wɔːk/", example: "Let's go for a walk in the park.", example_es: "Vamos a caminar por el parque." },
  { front: "Take the bus", back: "Tomar el autobús", ipa: "/teɪk ðə bʌs/", example: "I take the bus to school.", example_es: "Tomo el autobús a la escuela." }
];

// 4. A1 Quiz: Daily Life Vocab
const a1QuizDailyLifeVocab = [
  { question: "What does <have breakfast> mean?", options: ["Eat the morning meal", "Cook lunch", "Go to a restaurant", "Buy food"], correct: "Eat the morning meal", explanation: "<Have breakfast> means to eat the first meal of the day, in the morning." },
  { question: "If you <come home>, you...", options: ["return to your house", "leave your house", "buy a house", "clean your house"], correct: "return to your house", explanation: "<Come home> means to return to the place where you live." },
  { question: "You need <directions> when you...", options: ["don't know the way", "are hungry", "feel tired", "want to sleep"], correct: "don't know the way", explanation: "<Directions> are instructions that tell you how to get to a place." },
  { question: "What do you do when you <go to bed>?", options: ["Sleep", "Eat", "Study", "Play"], correct: "Sleep", explanation: "<Go to bed> means to go to your bed to sleep." },
  { question: "When do people usually <have dinner>?", options: ["In the evening", "In the morning", "At midnight", "At noon"], correct: "In the evening", explanation: "<Have dinner> means to eat the evening meal, usually between 6 and 9 PM." },
  { question: "What does <take a shower> mean?", options: ["Wash your body with water", "Go swimming", "Drink water", "Clean the bathroom"], correct: "Wash your body with water", explanation: "<Take a shower> means to wash yourself under running water." },
  { question: "You <brush your teeth> with a...", options: ["toothbrush", "comb", "towel", "spoon"], correct: "toothbrush", explanation: "We use a toothbrush and toothpaste to <brush our teeth>." },
  { question: "What does <get dressed> mean?", options: ["Put on clothes", "Take off clothes", "Buy clothes", "Wash clothes"], correct: "Put on clothes", explanation: "<Get dressed> means to put on your clothes." },
  { question: "Where do you <go shopping>?", options: ["At a store or mall", "At school", "At the park", "At the hospital"], correct: "At a store or mall", explanation: "We <go shopping> at stores, malls, or markets to buy things." },
  { question: "Students <do homework>...", options: ["after school", "during breakfast", "while sleeping", "at the cinema"], correct: "after school", explanation: "Students usually <do homework> after school at home." },
  { question: "What does <watch TV> mean?", options: ["Look at television programs", "Listen to the radio", "Read a newspaper", "Play video games"], correct: "Look at television programs", explanation: "<Watch TV> means to look at programs on television." },
  { question: "You <listen to music> with your...", options: ["ears", "eyes", "hands", "nose"], correct: "ears", explanation: "We use our ears to <listen to music>." },
  { question: "What does <play sports> mean?", options: ["Do physical activities like football or tennis", "Watch sports on TV", "Read about sports", "Talk about sports"], correct: "Do physical activities like football or tennis", explanation: "<Play sports> means to participate in physical activities and games." },
  { question: "Who usually <cooks dinner> at home?", options: ["A family member", "The teacher", "The doctor", "The bus driver"], correct: "A family member", explanation: "Usually a parent or family member <cooks dinner> at home." },
  { question: "What does <clean the house> mean?", options: ["Make the house tidy and neat", "Build a new house", "Paint the house", "Sell the house"], correct: "Make the house tidy and neat", explanation: "<Clean the house> means to tidy up, sweep, and make everything neat." },
  { question: "You <walk the dog> in the...", options: ["park or street", "kitchen", "bedroom", "bathroom"], correct: "park or street", explanation: "People <walk the dog> outside, usually in the park or on the street." },
  { question: "What does <read a book> mean?", options: ["Look at and understand written words", "Write a story", "Draw pictures", "Watch a movie"], correct: "Look at and understand written words", explanation: "<Read a book> means to look at the pages and understand the written text." },
  { question: "When you <go for a walk>, you...", options: ["walk outside for exercise or fun", "drive a car", "ride a bicycle", "take a taxi"], correct: "walk outside for exercise or fun", explanation: "<Go for a walk> means to walk outside, usually for exercise or pleasure." },
  { question: "You <take the bus> to...", options: ["travel to a place", "buy a bus", "drive a bus", "wash a bus"], correct: "travel to a place", explanation: "<Take the bus> means to use the bus as transportation to go somewhere." },
  { question: "What does <have lunch> mean?", options: ["Eat the midday meal", "Skip a meal", "Cook breakfast", "Order dinner"], correct: "Eat the midday meal", explanation: "<Have lunch> means to eat the meal in the middle of the day, usually around noon." }
];

// 5. A1 Completion: Everyday Expressions
const a1CompletionEverydayExpressions = [
  { sentence: "I ______ breakfast at 8 o'clock every morning.", correct: "have", explanation: "We use <have breakfast> to talk about eating the morning meal.", tip: "Complete with the verb for eating meals" },
  { sentence: "After work, I ______ home at 6 PM.", correct: "come", explanation: "We use <come home> to talk about returning to our house.", tip: "Complete with the verb for returning" },
  { sentence: "Excuse me, can you give me ______ to the train station?", correct: "directions", explanation: "<Directions> are instructions that tell you how to get somewhere.", tip: "Complete with the word for route instructions" },
  { sentence: "I always ______ up early on weekdays.", correct: "wake", explanation: "We use <wake up> to mean stopping sleep.", tip: "Complete with the phrasal verb for stopping sleep" },
  { sentence: "She ______ on her coat because it's cold outside.", correct: "puts", explanation: "We use <put on> to mean wearing clothes. With she, add <s>.", tip: "Complete with the phrasal verb for wearing" },
  { sentence: "Please ______ down. The class is starting.", correct: "sit", explanation: "We use <sit down> to mean taking a seat.", tip: "Complete with the phrasal verb for taking a seat" },
  { sentence: "Can you ______ on the light? It's dark in here.", correct: "turn", explanation: "We use <turn on> to start a light or machine.", tip: "Complete with the phrasal verb for starting a device" },
  { sentence: "I need to ______ out what time the bus leaves.", correct: "find", explanation: "We use <find out> to mean discovering information.", tip: "Complete with the phrasal verb for discovering" },
  { sentence: "Don't forget to ______ off the TV before bed.", correct: "turn", explanation: "We use <turn off> to stop a machine or device.", tip: "Complete with the phrasal verb for stopping a device" },
  { sentence: "He ______ up his bag and left the room.", correct: "picked", explanation: "We use <pick up> to mean taking something with your hand. <Picked> is the past tense.", tip: "Complete with the past tense of the phrasal verb for grabbing" },
  { sentence: "The exam was a ______ of cake!", correct: "piece", explanation: "The idiom <a piece of cake> means something very easy.", tip: "Complete the idiom that means 'very easy'" },
  { sentence: "I'm feeling a bit under the ______ today.", correct: "weather", explanation: "The idiom <under the weather> means feeling sick or unwell.", tip: "Complete the idiom that means 'feeling sick'" },
  { sentence: "It's late. Let's ______ it a day.", correct: "call", explanation: "The idiom <call it a day> means to stop working for today.", tip: "Complete the idiom that means 'stop for today'" },
  { sentence: "______ a leg at your performance tonight!", correct: "Break", explanation: "The idiom <break a leg> means 'good luck'.", tip: "Complete the idiom that means 'good luck'" },
  { sentence: "I need to hit the ______ for my test tomorrow.", correct: "books", explanation: "The idiom <hit the books> means to start studying.", tip: "Complete the idiom that means 'start studying'" },
  { sentence: "Keep an ______ on your little brother, please.", correct: "eye", explanation: "The idiom <keep an eye on> means to watch carefully.", tip: "Complete the idiom that means 'watch carefully'" },
  { sentence: "I ______ to bed at 10 PM every night.", correct: "go", explanation: "We use <go to bed> to talk about going to sleep.", tip: "Complete with the verb for the bedtime routine" },
  { sentence: "She ______ a shower before breakfast.", correct: "takes", explanation: "We use <take a shower> to mean washing yourself. With she, use <takes>.", tip: "Complete with the verb for washing" },
  { sentence: "We ______ for a walk in the park every Sunday.", correct: "go", explanation: "We use <go for a walk> to mean walking outside for pleasure.", tip: "Complete with the verb for walking outside" },
  { sentence: "I ______ the bus to school every day.", correct: "take", explanation: "We use <take the bus> to mean using the bus for transportation.", tip: "Complete with the verb for using transportation" }
];

writeJSON(join(DATA_DIR, 'a1', 'a1-reading-phrasal-verbs.json'), a1ReadingPhrasalVerbs);
writeJSON(join(DATA_DIR, 'a1', 'a1-reading-idioms.json'), a1ReadingIdioms);
writeJSON(join(DATA_DIR, 'a1', 'a1-flashcard-daily-life-vocab.json'), a1FlashcardDailyLifeVocab);
writeJSON(join(DATA_DIR, 'a1', 'a1-quiz-daily-life-vocab.json'), a1QuizDailyLifeVocab);
writeJSON(join(DATA_DIR, 'a1', 'a1-completion-everyday-expressions.json'), a1CompletionEverydayExpressions);

console.log('\n--- A1: 5 files created ---\n');

// ============================================================
// A2 MODULES (+5)
// ============================================================

// 1. A2 Reading: Phrasal Verbs in Context
const a2ReadingPhrasalVerbs = {
  title: "Phrasal Verbs in Daily Situations",
  estimatedReadingTime: 8,
  learningObjectives: [
    "Learn phrasal verbs used in common daily situations",
    "Understand phrasal verbs in short stories and dialogues",
    "Practice recognizing separable and inseparable phrasal verbs",
    "Build vocabulary for talking about routines and activities"
  ],
  sections: [
    {
      id: "intro",
      title: "Phrasal Verbs Around Us",
      type: "introduction",
      content: "Phrasal verbs are everywhere in English! When you talk to friends, watch movies, or read messages, you hear phrasal verbs all the time. At the A2 level, you can learn more phrasal verbs to talk about your daily life, work, and hobbies. Let's explore some common ones in real situations."
    },
    {
      id: "at-work",
      title: "At Work",
      type: "theory",
      content: "Sarah works in an office. Every morning, she logs in to her computer and checks her emails. She often has to deal with problems from customers. When she finishes a task, she moves on to the next one. Sometimes her boss asks her to fill in a form or look into a complaint.\n\nWork phrasal verbs:\n• Log in - enter a computer system\n• Deal with - handle a problem\n• Move on - go to the next thing\n• Fill in - complete a form\n• Look into - investigate something"
    },
    {
      id: "shopping",
      title: "Going Shopping",
      type: "theory",
      content: "At the store, you try on clothes before you buy them. If something is too expensive, you put it back. When you find something you like, you pick it out. At the checkout, you pay for your items and the cashier wraps them up.\n\nShopping phrasal verbs:\n• Try on - test clothes by wearing them\n• Put back - return something to its place\n• Pick out - choose something\n• Pay for - give money for something\n• Wrap up - cover in paper"
    },
    {
      id: "examples",
      title: "Conversation Examples",
      type: "examples",
      content: "Example 1: 'I need to drop off this package at the post office.' (drop off = deliver)\n\nExample 2: 'Can you look after my cat this weekend?' (look after = take care of)\n\nExample 3: 'We ran out of milk. Can you buy some?' (run out of = have no more)\n\nExample 4: 'I'm looking forward to the holiday!' (look forward to = feel excited about)"
    },
    {
      id: "summary",
      title: "Key Takeaways",
      type: "summary",
      content: "Remember:\n• Phrasal verbs are used in every situation: work, shopping, home\n• Some phrasal verbs can be separated: 'pick it out' or 'pick out a shirt'\n• Three-word phrasal verbs like 'look forward to' cannot be separated\n• Practice by using phrasal verbs when you describe your day\n• Read and listen to English to find new phrasal verbs naturally"
    }
  ],
  keyVocabulary: [
    { term: "deal with", definition: "To handle or manage a problem", example: "I have to deal with many emails every day.", pronunciation: "/diːl wɪð/" },
    { term: "fill in", definition: "To complete a form or document", example: "Please fill in this application form.", pronunciation: "/fɪl ɪn/" },
    { term: "look into", definition: "To investigate or examine", example: "The manager will look into the problem.", pronunciation: "/lʊk ˈɪntuː/" },
    { term: "try on", definition: "To test clothes by wearing them", example: "Can I try on this dress?", pronunciation: "/traɪ ɒn/" },
    { term: "drop off", definition: "To deliver or leave something somewhere", example: "I'll drop off the books at the library.", pronunciation: "/drɒp ɒf/" },
    { term: "look after", definition: "To take care of someone or something", example: "She looks after her younger brother.", pronunciation: "/lʊk ˈɑːftər/" },
    { term: "run out of", definition: "To have no more of something", example: "We ran out of sugar.", pronunciation: "/rʌn aʊt əv/" },
    { term: "look forward to", definition: "To feel excited about something in the future", example: "I'm looking forward to the weekend.", pronunciation: "/lʊk ˈfɔːrwərd tuː/" }
  ],
  grammarPoints: [
    {
      rule: "Separable vs Inseparable Phrasal Verbs",
      explanation: "Some phrasal verbs can be separated by an object: 'pick out a shirt' or 'pick a shirt out'. Others cannot be separated: 'look after the baby' (NOT 'look the baby after').",
      examples: ["Try on the jacket / Try the jacket on (separable)", "Look after the children (inseparable)", "Fill in the form / Fill the form in (separable)"],
      commonMistakes: ["Separating inseparable verbs: 'look the baby after' — Wrong! Say 'look after the baby'"]
    }
  ]
};

// 2. A2 Reading: Idioms in Context
const a2ReadingIdioms = {
  title: "Idioms for Everyday Conversations",
  estimatedReadingTime: 8,
  learningObjectives: [
    "Learn idioms commonly used in everyday conversations",
    "Understand idioms through stories and dialogues",
    "Practice using idioms in the correct context",
    "Expand your knowledge of figurative language"
  ],
  sections: [
    {
      id: "intro",
      title: "Why Learn Idioms?",
      type: "introduction",
      content: "Native English speakers use idioms all the time. If you understand idioms, you can follow conversations better and sound more natural. At the A2 level, you can learn idioms about feelings, time, and common situations. These idioms will help you in daily conversations."
    },
    {
      id: "feelings-idioms",
      title: "Idioms About Feelings",
      type: "theory",
      content: "English has many idioms to describe how we feel:\n\n• On cloud nine - Very happy. 'She passed her exam and she's on cloud nine!'\n• Down in the dumps - Very sad. 'He lost his job and he's down in the dumps.'\n• Butterflies in my stomach - Nervous. 'I have butterflies in my stomach before the interview.'\n• Over the moon - Extremely happy. 'They're over the moon about the new baby.'\n• Sick and tired - Very annoyed. 'I'm sick and tired of this rain!'"
    },
    {
      id: "time-idioms",
      title: "Idioms About Time",
      type: "theory",
      content: "Time idioms are very useful:\n\n• In the nick of time - Just before it's too late. 'We arrived at the airport in the nick of time.'\n• Once in a blue moon - Very rarely. 'I eat fast food once in a blue moon.'\n• Around the clock - All day and night. 'The hospital works around the clock.'\n• Better late than never - It's good you came, even if late. 'You're here! Better late than never.'\n• Time flies - Time passes quickly. 'Time flies when you're having fun!'"
    },
    {
      id: "examples",
      title: "Idioms in Conversations",
      type: "examples",
      content: "Example 1: A: 'How was your holiday?' B: 'Amazing! I was on cloud nine the whole time.'\n\nExample 2: A: 'Do you often go to the cinema?' B: 'Once in a blue moon. I prefer watching movies at home.'\n\nExample 3: A: 'Sorry I'm late!' B: 'Better late than never! Come in.'\n\nExample 4: A: 'I can't believe it's December already!' B: 'I know! Time flies!'"
    },
    {
      id: "summary",
      title: "Key Takeaways",
      type: "summary",
      content: "Remember:\n• Idioms about feelings help you express emotions naturally\n• Time idioms are used in everyday conversations\n• Learn idioms in context, not just as definitions\n• Practice using one new idiom each day\n• Listen for idioms in movies and songs"
    }
  ],
  keyVocabulary: [
    { term: "on cloud nine", definition: "Extremely happy", example: "I got the job! I'm on cloud nine!", pronunciation: "/ɒn klaʊd naɪn/" },
    { term: "down in the dumps", definition: "Feeling very sad", example: "She's been down in the dumps since her cat died.", pronunciation: "/daʊn ɪn ðə dʌmps/" },
    { term: "once in a blue moon", definition: "Very rarely", example: "We go to that restaurant once in a blue moon.", pronunciation: "/wʌns ɪn ə bluː muːn/" },
    { term: "time flies", definition: "Time passes very quickly", example: "Time flies when you're having fun.", pronunciation: "/taɪm flaɪz/" },
    { term: "in the nick of time", definition: "Just before it's too late", example: "The firefighters arrived in the nick of time.", pronunciation: "/ɪn ðə nɪk əv taɪm/" },
    { term: "better late than never", definition: "It's better to arrive late than not at all", example: "You finally finished! Better late than never.", pronunciation: "/ˈbetər leɪt ðæn ˈnevər/" }
  ],
  grammarPoints: [
    {
      rule: "Idioms and Tenses",
      explanation: "Most idioms can be used in different tenses. The key words stay the same, but the verb can change.",
      examples: ["I'm on cloud nine. (present)", "She was on cloud nine. (past)", "He'll be on cloud nine. (future)"],
      commonMistakes: ["Mixing up similar idioms: 'on cloud seven' — Wrong! Say 'on cloud nine'"]
    }
  ]
};

// 3. A2 Flashcard: Culture & Health Vocab (reinforcing orphaned terms)
const a2FlashcardCultureHealthVocab = [
  { front: "Custom", back: "Costumbre", ipa: "/ˈkʌstəm/", example: "It's a custom to shake hands when you meet someone.", example_es: "Es costumbre dar la mano cuando conoces a alguien." },
  { front: "Etiquette", back: "Etiqueta / Protocolo", ipa: "/ˈetɪket/", example: "Table etiquette is important at formal dinners.", example_es: "La etiqueta en la mesa es importante en cenas formales." },
  { front: "Celebrate", back: "Celebrar", ipa: "/ˈselɪbreɪt/", example: "We celebrate Christmas with our family.", example_es: "Celebramos la Navidad con nuestra familia." },
  { front: "Host", back: "Anfitrión / Organizar", ipa: "/hoʊst/", example: "She will host the party at her house.", example_es: "Ella organizará la fiesta en su casa." },
  { front: "Prescription", back: "Receta médica", ipa: "/prɪˈskrɪpʃən/", example: "The doctor gave me a prescription for antibiotics.", example_es: "El doctor me dio una receta para antibióticos." },
  { front: "Fever", back: "Fiebre", ipa: "/ˈfiːvər/", example: "She has a high fever and needs to rest.", example_es: "Ella tiene fiebre alta y necesita descansar." },
  { front: "Check-up", back: "Revisión médica", ipa: "/ˈtʃekʌp/", example: "I have a check-up at the doctor's next week.", example_es: "Tengo una revisión médica la próxima semana." },
  { front: "Browser", back: "Navegador", ipa: "/ˈbraʊzər/", example: "I use Chrome as my web browser.", example_es: "Uso Chrome como mi navegador web." },
  { front: "Wi-Fi", back: "Wi-Fi / Internet inalámbrico", ipa: "/ˈwaɪfaɪ/", example: "Is there free Wi-Fi in this café?", example_es: "¿Hay Wi-Fi gratis en este café?" },
  { front: "Tradition", back: "Tradición", ipa: "/trəˈdɪʃən/", example: "It's a tradition to eat turkey on Thanksgiving.", example_es: "Es tradición comer pavo en Acción de Gracias." },
  { front: "Festival", back: "Festival", ipa: "/ˈfestɪvəl/", example: "The music festival is in July.", example_es: "El festival de música es en julio." },
  { front: "Symptom", back: "Síntoma", ipa: "/ˈsɪmptəm/", example: "A cough is a common symptom of a cold.", example_es: "La tos es un síntoma común del resfriado." },
  { front: "Medicine", back: "Medicina / Medicamento", ipa: "/ˈmedɪsɪn/", example: "Take this medicine three times a day.", example_es: "Toma este medicamento tres veces al día." },
  { front: "Appointment", back: "Cita", ipa: "/əˈpɔɪntmənt/", example: "I have a doctor's appointment at 3 PM.", example_es: "Tengo una cita con el doctor a las 3 PM." },
  { front: "Download", back: "Descargar", ipa: "/ˈdaʊnloʊd/", example: "You can download the app for free.", example_es: "Puedes descargar la aplicación gratis." },
  { front: "Password", back: "Contraseña", ipa: "/ˈpæswɜːrd/", example: "Don't share your password with anyone.", example_es: "No compartas tu contraseña con nadie." },
  { front: "Upload", back: "Subir / Cargar", ipa: "/ˈʌploʊd/", example: "I need to upload my photos to the cloud.", example_es: "Necesito subir mis fotos a la nube." },
  { front: "Ceremony", back: "Ceremonia", ipa: "/ˈserɪmoʊni/", example: "The wedding ceremony was beautiful.", example_es: "La ceremonia de boda fue hermosa." },
  { front: "Allergy", back: "Alergia", ipa: "/ˈælɜːrdʒi/", example: "He has an allergy to peanuts.", example_es: "Él tiene alergia a los cacahuetes." },
  { front: "Website", back: "Sitio web", ipa: "/ˈwebsaɪt/", example: "Visit our website for more information.", example_es: "Visita nuestro sitio web para más información." }
];

// 4. A2 Quiz: Culture & Health Vocab
const a2QuizCultureHealthVocab = [
  { question: "A <custom> is...", options: ["a traditional way of doing things", "a type of clothing", "a kind of food", "a musical instrument"], correct: "a traditional way of doing things", explanation: "A <custom> is a traditional practice or behavior in a culture." },
  { question: "What is <etiquette>?", options: ["Rules of polite behavior", "A type of sport", "A cooking method", "A musical style"], correct: "Rules of polite behavior", explanation: "<Etiquette> refers to the rules and conventions of polite behavior in society." },
  { question: "When you <celebrate>, you...", options: ["have a party or special event for something good", "feel sad about something", "go to work", "clean the house"], correct: "have a party or special event for something good", explanation: "To <celebrate> means to do something special to mark a happy occasion." },
  { question: "A <host> is someone who...", options: ["organizes and welcomes guests", "cleans the house", "cooks the food", "delivers packages"], correct: "organizes and welcomes guests", explanation: "A <host> is the person who organizes an event and welcomes guests." },
  { question: "You need a <prescription> to...", options: ["buy certain medicines", "enter a building", "travel abroad", "open a bank account"], correct: "buy certain medicines", explanation: "A <prescription> is a doctor's written order for medicine." },
  { question: "If you have a <fever>, your body temperature is...", options: ["higher than normal", "lower than normal", "exactly normal", "changing constantly"], correct: "higher than normal", explanation: "A <fever> means your body temperature is above the normal 37°C / 98.6°F." },
  { question: "A <check-up> is...", options: ["a routine medical examination", "a type of payment", "a sports competition", "a school test"], correct: "a routine medical examination", explanation: "A <check-up> is a regular visit to the doctor to make sure you are healthy." },
  { question: "A <browser> is used to...", options: ["access websites on the internet", "make phone calls", "send text messages", "take photographs"], correct: "access websites on the internet", explanation: "A <browser> is software like Chrome or Firefox used to view websites." },
  { question: "You need <Wi-Fi> to...", options: ["connect to the internet wirelessly", "charge your phone", "make a phone call", "listen to the radio"], correct: "connect to the internet wirelessly", explanation: "<Wi-Fi> is a wireless technology that allows devices to connect to the internet." },
  { question: "A <tradition> is...", options: ["something people do for many years as part of their culture", "a new invention", "a type of technology", "a kind of medicine"], correct: "something people do for many years as part of their culture", explanation: "A <tradition> is a custom or belief passed down through generations." },
  { question: "A <symptom> is...", options: ["a sign that you are sick", "a type of medicine", "a doctor's tool", "a hospital room"], correct: "a sign that you are sick", explanation: "A <symptom> is a physical sign that indicates illness, like a cough or fever." },
  { question: "You take <medicine> when you...", options: ["are sick and need to get better", "are hungry", "want to exercise", "need to study"], correct: "are sick and need to get better", explanation: "<Medicine> is a substance used to treat illness and help you recover." },
  { question: "An <appointment> is...", options: ["a scheduled meeting at a specific time", "a surprise visit", "a random event", "a type of holiday"], correct: "a scheduled meeting at a specific time", explanation: "An <appointment> is a planned meeting, often with a doctor or professional." },
  { question: "To <download> means to...", options: ["transfer files from the internet to your device", "delete files from your device", "send files to someone", "print a document"], correct: "transfer files from the internet to your device", explanation: "To <download> means to copy data from the internet to your computer or phone." },
  { question: "A <password> is used to...", options: ["protect your accounts and information", "remember your name", "find your phone", "pay for things"], correct: "protect your accounts and information", explanation: "A <password> is a secret word or phrase used to access protected accounts." },
  { question: "To <upload> means to...", options: ["send files from your device to the internet", "download files", "delete files", "copy files to a USB"], correct: "send files from your device to the internet", explanation: "To <upload> means to transfer files from your device to a website or cloud." },
  { question: "A <ceremony> is...", options: ["a formal event with special traditions", "a casual meeting", "a daily routine", "a type of exercise"], correct: "a formal event with special traditions", explanation: "A <ceremony> is a formal event, like a wedding or graduation." },
  { question: "If you have an <allergy>, you...", options: ["react badly to certain things like food or pollen", "feel very happy", "are very hungry", "need glasses"], correct: "react badly to certain things like food or pollen", explanation: "An <allergy> is a negative physical reaction to certain substances." },
  { question: "A <website> is...", options: ["a page or group of pages on the internet", "a type of book", "a TV channel", "a radio station"], correct: "a page or group of pages on the internet", explanation: "A <website> is a collection of web pages accessible through the internet." },
  { question: "A <festival> is...", options: ["a special event with music, food, or cultural activities", "a regular workday", "a type of school", "a kind of transport"], correct: "a special event with music, food, or cultural activities", explanation: "A <festival> is an organized event celebrating something, often with entertainment." }
];

// 5. A2 Completion: Reading Vocab Reinforcement
const a2CompletionReadingVocab = [
  { sentence: "In many countries, it's a ______ to remove your shoes before entering a house.", correct: "custom", explanation: "A <custom> is a traditional way of doing things in a culture.", tip: "Complete with the word for a traditional practice" },
  { sentence: "Good table ______ includes not talking with your mouth full.", correct: "etiquette", explanation: "<Etiquette> refers to the rules of polite behavior.", tip: "Complete with the word for polite behavior rules" },
  { sentence: "We ______ my grandmother's birthday with a big party.", correct: "celebrate", explanation: "To <celebrate> means to do something special for a happy occasion.", tip: "Complete with the verb for marking a special occasion" },
  { sentence: "She will ______ the dinner party at her apartment.", correct: "host", explanation: "To <host> means to organize an event and welcome guests.", tip: "Complete with the verb for organizing an event" },
  { sentence: "The doctor wrote a ______ for some antibiotics.", correct: "prescription", explanation: "A <prescription> is a doctor's written order for medicine.", tip: "Complete with the word for a doctor's medicine order" },
  { sentence: "He stayed home because he had a high ______.", correct: "fever", explanation: "A <fever> is when your body temperature is higher than normal.", tip: "Complete with the word for high body temperature" },
  { sentence: "I have a dental ______ next Monday.", correct: "check-up", explanation: "A <check-up> is a routine examination by a doctor or dentist.", tip: "Complete with the word for a routine medical visit" },
  { sentence: "Which web ______ do you use? Chrome or Firefox?", correct: "browser", explanation: "A <browser> is software used to access websites on the internet.", tip: "Complete with the word for internet viewing software" },
  { sentence: "The hotel has free ______ for all guests.", correct: "Wi-Fi", explanation: "<Wi-Fi> is wireless internet access.", tip: "Complete with the word for wireless internet" },
  { sentence: "Eating grapes at midnight is a Spanish New Year ______.", correct: "tradition", explanation: "A <tradition> is a custom passed down through generations.", tip: "Complete with the word for a long-standing custom" },
  { sentence: "A headache can be a ______ of stress.", correct: "symptom", explanation: "A <symptom> is a sign that indicates a health problem.", tip: "Complete with the word for a sign of illness" },
  { sentence: "Take this ______ twice a day after meals.", correct: "medicine", explanation: "<Medicine> is a substance used to treat illness.", tip: "Complete with the word for treatment substance" },
  { sentence: "I made an ______ with the dentist for Friday.", correct: "appointment", explanation: "An <appointment> is a scheduled meeting at a specific time.", tip: "Complete with the word for a scheduled meeting" },
  { sentence: "You can ______ the app from the App Store.", correct: "download", explanation: "To <download> means to transfer files from the internet to your device.", tip: "Complete with the verb for getting files from the internet" },
  { sentence: "Your ______ must have at least 8 characters.", correct: "password", explanation: "A <password> is a secret code used to protect your accounts.", tip: "Complete with the word for a secret access code" },
  { sentence: "I need to ______ these photos to my social media.", correct: "upload", explanation: "To <upload> means to send files from your device to the internet.", tip: "Complete with the verb for sending files to the internet" },
  { sentence: "The graduation ______ was very emotional.", correct: "ceremony", explanation: "A <ceremony> is a formal event with special traditions.", tip: "Complete with the word for a formal event" },
  { sentence: "She can't eat peanuts because she has an ______.", correct: "allergy", explanation: "An <allergy> is a negative reaction to certain substances.", tip: "Complete with the word for a negative reaction to substances" },
  { sentence: "Visit our ______ for more information about the course.", correct: "website", explanation: "A <website> is a collection of pages on the internet.", tip: "Complete with the word for internet pages" },
  { sentence: "The summer music ______ attracts thousands of visitors.", correct: "festival", explanation: "A <festival> is an organized celebration event.", tip: "Complete with the word for a celebration event" }
];

writeJSON(join(DATA_DIR, 'a2', 'a2-reading-phrasal-verbs.json'), a2ReadingPhrasalVerbs);
writeJSON(join(DATA_DIR, 'a2', 'a2-reading-idioms.json'), a2ReadingIdioms);
writeJSON(join(DATA_DIR, 'a2', 'a2-flashcard-culture-health-vocab.json'), a2FlashcardCultureHealthVocab);
writeJSON(join(DATA_DIR, 'a2', 'a2-quiz-culture-health-vocab.json'), a2QuizCultureHealthVocab);
writeJSON(join(DATA_DIR, 'a2', 'a2-completion-reading-vocab.json'), a2CompletionReadingVocab);

console.log('--- A2: 5 files created ---\n');

// ============================================================
// B1 MODULES (+5)
// ============================================================

// 1. B1 Reading: Phrasal Verbs in Context
const b1ReadingPhrasalVerbs = {
  title: "Phrasal Verbs in Professional and Social Life",
  estimatedReadingTime: 10,
  learningObjectives: [
    "Master phrasal verbs used in professional environments",
    "Understand phrasal verbs in social and informal contexts",
    "Learn to distinguish between literal and figurative meanings",
    "Practice using phrasal verbs in complex sentences"
  ],
  sections: [
    {
      id: "intro",
      title: "Phrasal Verbs at the Intermediate Level",
      type: "introduction",
      content: "At the B1 level, you need phrasal verbs for more complex situations — at work, in social life, and when discussing plans. Many phrasal verbs have multiple meanings depending on context. Understanding these will make your English sound much more natural and fluent."
    },
    {
      id: "workplace",
      title: "In the Workplace",
      type: "theory",
      content: "Modern workplaces are full of phrasal verbs. Here's a typical day:\n\nThe team needs to come up with a new marketing strategy. The manager asks everyone to think it over before the meeting. During the meeting, they bring up several ideas and talk them through. Some ideas are turned down, but they end up choosing a creative approach. The deadline is coming up, so they need to get on with the work quickly.\n\nWorkplace phrasal verbs:\n• Come up with - create/invent an idea\n• Think over - consider carefully\n• Bring up - mention a topic\n• Talk through - discuss in detail\n• Turn down - reject\n• End up - finally arrive at a result\n• Come up - approach (in time)\n• Get on with - continue doing"
    },
    {
      id: "social-life",
      title: "Social Situations",
      type: "theory",
      content: "Phrasal verbs are essential in social English:\n\nI was supposed to meet my friend, but she called off our plans because she wasn't feeling well. I decided to hang out with other friends instead. We ended up going to a new restaurant. The food was amazing — it really lived up to the reviews. We caught up on each other's news and had a great time.\n\nSocial phrasal verbs:\n• Call off - cancel\n• Hang out - spend time casually\n• Live up to - meet expectations\n• Catch up - exchange recent news\n• Get along with - have a good relationship\n• Fall out with - have an argument and stop being friends"
    },
    {
      id: "examples",
      title: "Multiple Meanings",
      type: "examples",
      content: "Many phrasal verbs have more than one meaning:\n\nExample 1: 'Pick up' — a) 'Pick up the phone' (answer) b) 'Pick up a language' (learn informally) c) 'Pick up someone' (collect by car)\n\nExample 2: 'Take off' — a) 'The plane took off' (left the ground) b) 'Take off your coat' (remove) c) 'Her career took off' (became successful)\n\nExample 3: 'Work out' — a) 'I work out at the gym' (exercise) b) 'Things worked out well' (had a good result) c) 'Work out the answer' (calculate)"
    },
    {
      id: "summary",
      title: "Key Takeaways",
      type: "summary",
      content: "Remember:\n• Context determines the meaning of phrasal verbs with multiple definitions\n• Professional English uses many phrasal verbs — learn them for career growth\n• Social phrasal verbs make you sound natural in conversations\n• Practice by reading articles and noting phrasal verbs you find\n• Try to use at least one new phrasal verb each day in conversation"
    }
  ],
  keyVocabulary: [
    { term: "come up with", definition: "To think of an idea or plan", example: "We need to come up with a solution.", pronunciation: "/kʌm ʌp wɪð/" },
    { term: "think over", definition: "To consider something carefully", example: "Let me think it over before I decide.", pronunciation: "/θɪŋk ˈoʊvər/" },
    { term: "bring up", definition: "To mention a topic in conversation", example: "She brought up an interesting point.", pronunciation: "/brɪŋ ʌp/" },
    { term: "turn down", definition: "To reject an offer or request", example: "He turned down the job offer.", pronunciation: "/tɜːrn daʊn/" },
    { term: "call off", definition: "To cancel an event or arrangement", example: "They called off the meeting.", pronunciation: "/kɔːl ɒf/" },
    { term: "catch up", definition: "To exchange recent news with someone", example: "Let's meet for coffee and catch up.", pronunciation: "/kætʃ ʌp/" },
    { term: "live up to", definition: "To meet expectations or standards", example: "The movie didn't live up to the hype.", pronunciation: "/lɪv ʌp tuː/" },
    { term: "get on with", definition: "To continue doing something", example: "Let's get on with the project.", pronunciation: "/ɡet ɒn wɪð/" }
  ],
  grammarPoints: [
    {
      rule: "Phrasal Verbs with Multiple Meanings",
      explanation: "Many common phrasal verbs have 2-3 different meanings. The context of the sentence tells you which meaning is intended.",
      examples: ["The plane took off. (= left the ground)", "She took off her shoes. (= removed)", "His business really took off. (= became successful)"],
      commonMistakes: ["Using the wrong meaning in context: 'I need to work out the gym' — Wrong! Say 'I need to work out at the gym'"]
    }
  ]
};

// 2. B1 Reading: Idioms in Context
const b1ReadingIdioms = {
  title: "Idioms in Work, Education, and Social Life",
  estimatedReadingTime: 10,
  learningObjectives: [
    "Learn idioms used in professional and educational settings",
    "Understand idioms about success, failure, and effort",
    "Practice recognizing idioms in longer texts",
    "Use idioms appropriately in intermediate-level conversations"
  ],
  sections: [
    {
      id: "intro",
      title: "Idioms for Intermediate Learners",
      type: "introduction",
      content: "At the B1 level, you encounter idioms in more complex situations — at work, in education, and in social discussions. These idioms help you express ideas about effort, success, challenges, and relationships. Mastering them will significantly improve your fluency."
    },
    {
      id: "work-idioms",
      title: "Idioms at Work",
      type: "theory",
      content: "The business world is full of idioms:\n\n• Get the ball rolling - Start something. 'Let's get the ball rolling on this project.'\n• Think outside the box - Be creative. 'We need to think outside the box to solve this.'\n• Go the extra mile - Do more than expected. 'She always goes the extra mile for her clients.'\n• Cut corners - Do something cheaply or quickly, sacrificing quality. 'Don't cut corners on safety.'\n• Back to square one - Start again from the beginning. 'The plan failed, so we're back to square one.'\n• On the same page - In agreement. 'Let's make sure we're all on the same page.'"
    },
    {
      id: "education-idioms",
      title: "Idioms in Education",
      type: "theory",
      content: "Students and teachers use many idioms:\n\n• Learn the ropes - Learn how to do something new. 'It took me a semester to learn the ropes at university.'\n• Pass with flying colors - Pass easily with excellent results. 'She passed the exam with flying colors.'\n• Burn the midnight oil - Study or work very late. 'I burned the midnight oil to finish my thesis.'\n• A steep learning curve - Something difficult to learn at first. 'Programming has a steep learning curve.'\n• Hit the nail on the head - Say exactly the right thing. 'Your analysis hit the nail on the head.'"
    },
    {
      id: "examples",
      title: "Idioms in Context",
      type: "examples",
      content: "Example 1: 'The new curriculum is challenging, but the students are learning the ropes quickly.' (curriculum = plan of study)\n\nExample 2: 'After three semesters of hard work, she graduated with flying colors and got a scholarship for her tuition.' (tuition = university fees)\n\nExample 3: 'The renewable energy project hit a wall, but the team didn't give up. They went back to square one and came up with a better plan.'\n\nExample 4: 'The influencer's viral post about cyberbullying really hit the nail on the head.'"
    },
    {
      id: "summary",
      title: "Key Takeaways",
      type: "summary",
      content: "Remember:\n• Work idioms help you sound professional in meetings and emails\n• Education idioms are useful for discussing academic experiences\n• Many idioms use visual images — picture them to remember better\n• Practice using idioms in the right context\n• Don't overuse idioms — one or two per conversation is natural"
    }
  ],
  keyVocabulary: [
    { term: "get the ball rolling", definition: "To start an activity or process", example: "Let's get the ball rolling on the new project.", pronunciation: "/ɡet ðə bɔːl ˈroʊlɪŋ/" },
    { term: "think outside the box", definition: "To think creatively and differently", example: "We need to think outside the box.", pronunciation: "/θɪŋk aʊtˈsaɪd ðə bɒks/" },
    { term: "go the extra mile", definition: "To make more effort than expected", example: "Good employees go the extra mile.", pronunciation: "/ɡoʊ ðə ˈekstrə maɪl/" },
    { term: "back to square one", definition: "Return to the beginning after failure", example: "The experiment failed — back to square one.", pronunciation: "/bæk tə skwer wʌn/" },
    { term: "pass with flying colors", definition: "To succeed easily and impressively", example: "He passed the test with flying colors.", pronunciation: "/pæs wɪð ˈflaɪɪŋ ˈkʌlərz/" },
    { term: "burn the midnight oil", definition: "To work or study very late at night", example: "Students burn the midnight oil before exams.", pronunciation: "/bɜːrn ðə ˈmɪdnaɪt ɔɪl/" },
    { term: "hit the nail on the head", definition: "To describe exactly what is causing a situation", example: "Your comment hit the nail on the head.", pronunciation: "/hɪt ðə neɪl ɒn ðə hed/" },
    { term: "learn the ropes", definition: "To learn how a particular task or job is done", example: "It takes time to learn the ropes.", pronunciation: "/lɜːrn ðə roʊps/" }
  ],
  grammarPoints: [
    {
      rule: "Idioms in Formal vs Informal Contexts",
      explanation: "Some idioms are appropriate for both formal and informal situations, while others are more casual. 'Think outside the box' works in a business meeting, but 'hit the books' is more casual.",
      examples: ["Formal: 'Let's get the ball rolling on this initiative.'", "Informal: 'I need to hit the books tonight.'", "Both: 'She passed with flying colors.'"],
      commonMistakes: ["Using very casual idioms in formal writing: 'The CEO needs to hit the books' sounds odd in a report"]
    }
  ]
};

// 3. B1 Flashcard: Reading Vocab (reinforcing orphaned terms)
const b1FlashcardReadingVocab = [
  { front: "Curriculum", back: "Plan de estudios", ipa: "/kəˈrɪkjələm/", example: "The school updated its curriculum this year.", example_es: "La escuela actualizó su plan de estudios este año." },
  { front: "Graduate", back: "Graduarse / Graduado", ipa: "/ˈɡrædʒuːeɪt/", example: "She will graduate from university next June.", example_es: "Ella se graduará de la universidad en junio." },
  { front: "Tuition", back: "Matrícula / Colegiatura", ipa: "/tuːˈɪʃən/", example: "University tuition is very expensive.", example_es: "La matrícula universitaria es muy cara." },
  { front: "Semester", back: "Semestre", ipa: "/sɪˈmestər/", example: "The first semester starts in September.", example_es: "El primer semestre empieza en septiembre." },
  { front: "Renewable energy", back: "Energía renovable", ipa: "/rɪˈnjuːəbəl ˈenərdʒi/", example: "Solar power is a type of renewable energy.", example_es: "La energía solar es un tipo de energía renovable." },
  { front: "Carbon footprint", back: "Huella de carbono", ipa: "/ˈkɑːrbən ˈfʊtprɪnt/", example: "We should reduce our carbon footprint.", example_es: "Deberíamos reducir nuestra huella de carbono." },
  { front: "Emissions", back: "Emisiones", ipa: "/ɪˈmɪʃənz/", example: "The factory reduced its carbon emissions.", example_es: "La fábrica redujo sus emisiones de carbono." },
  { front: "Influencer", back: "Influencer / Persona influyente", ipa: "/ˈɪnfluːənsər/", example: "She's a popular social media influencer.", example_es: "Ella es una influencer popular en redes sociales." },
  { front: "Viral", back: "Viral", ipa: "/ˈvaɪrəl/", example: "The video went viral overnight.", example_es: "El video se hizo viral de la noche a la mañana." },
  { front: "Engagement", back: "Interacción / Compromiso", ipa: "/ɪnˈɡeɪdʒmənt/", example: "The post had high engagement on social media.", example_es: "La publicación tuvo alta interacción en redes sociales." },
  { front: "Hashtag", back: "Hashtag / Etiqueta", ipa: "/ˈhæʃtæɡ/", example: "Use a hashtag to make your post easier to find.", example_es: "Usa un hashtag para que tu publicación sea más fácil de encontrar." },
  { front: "Cyberbullying", back: "Ciberacoso", ipa: "/ˈsaɪbərˌbʊliɪŋ/", example: "Schools are working to prevent cyberbullying.", example_es: "Las escuelas trabajan para prevenir el ciberacoso." },
  { front: "Scholarship", back: "Beca", ipa: "/ˈskɒlərʃɪp/", example: "She won a scholarship to study abroad.", example_es: "Ella ganó una beca para estudiar en el extranjero." },
  { front: "Sustainability", back: "Sostenibilidad", ipa: "/səˌsteɪnəˈbɪləti/", example: "Sustainability is important for the future.", example_es: "La sostenibilidad es importante para el futuro." },
  { front: "Pollution", back: "Contaminación", ipa: "/pəˈluːʃən/", example: "Air pollution is a serious problem in big cities.", example_es: "La contaminación del aire es un problema serio en las grandes ciudades." },
  { front: "Algorithm", back: "Algoritmo", ipa: "/ˈælɡərɪðəm/", example: "Social media algorithms decide what you see.", example_es: "Los algoritmos de redes sociales deciden lo que ves." },
  { front: "Content creator", back: "Creador de contenido", ipa: "/ˈkɒntent kriˈeɪtər/", example: "He works as a content creator on YouTube.", example_es: "Él trabaja como creador de contenido en YouTube." },
  { front: "Climate change", back: "Cambio climático", ipa: "/ˈklaɪmət tʃeɪndʒ/", example: "Climate change affects everyone on the planet.", example_es: "El cambio climático afecta a todos en el planeta." },
  { front: "Degree", back: "Título universitario", ipa: "/dɪˈɡriː/", example: "She has a degree in engineering.", example_es: "Ella tiene un título en ingeniería." },
  { front: "Recycle", back: "Reciclar", ipa: "/riːˈsaɪkəl/", example: "We should recycle plastic and paper.", example_es: "Deberíamos reciclar plástico y papel." }
];

// 4. B1 Quiz: Reading Vocab
const b1QuizReadingVocab = [
  { question: "A <curriculum> is...", options: ["a plan of subjects taught at a school", "a type of exam", "a school building", "a teacher's salary"], correct: "a plan of subjects taught at a school", explanation: "A <curriculum> is the set of courses and content taught at a school or university." },
  { question: "When you <graduate>, you...", options: ["complete your studies and receive a degree", "start a new course", "fail an exam", "change schools"], correct: "complete your studies and receive a degree", explanation: "To <graduate> means to successfully finish a course of study." },
  { question: "<Tuition> refers to...", options: ["the money paid for education", "the school uniform", "the textbooks", "the school bus"], correct: "the money paid for education", explanation: "<Tuition> is the fee charged for instruction at a school or university." },
  { question: "A <semester> is...", options: ["half of an academic year", "a full academic year", "a single class", "a type of exam"], correct: "half of an academic year", explanation: "A <semester> is one of the two periods that divide the academic year." },
  { question: "<Renewable energy> comes from...", options: ["sources that won't run out, like sun and wind", "coal and oil", "nuclear power only", "natural gas"], correct: "sources that won't run out, like sun and wind", explanation: "<Renewable energy> comes from natural sources that are constantly replenished." },
  { question: "Your <carbon footprint> measures...", options: ["the amount of CO2 you produce", "the size of your shoes", "how far you walk", "your weight"], correct: "the amount of CO2 you produce", explanation: "Your <carbon footprint> is the total amount of greenhouse gases you produce." },
  { question: "<Emissions> are...", options: ["gases released into the atmosphere", "types of energy", "recycling methods", "weather patterns"], correct: "gases released into the atmosphere", explanation: "<Emissions> are substances, especially gases, released into the air." },
  { question: "An <influencer> is someone who...", options: ["has many followers and affects people's opinions online", "works in a factory", "teaches at a university", "writes for a newspaper"], correct: "has many followers and affects people's opinions online", explanation: "An <influencer> is a person with a large social media following who can affect others' decisions." },
  { question: "When something goes <viral>, it...", options: ["spreads very quickly on the internet", "becomes very expensive", "disappears from the internet", "becomes illegal"], correct: "spreads very quickly on the internet", explanation: "When content goes <viral>, it is shared rapidly by many people online." },
  { question: "<Engagement> on social media means...", options: ["likes, comments, and shares on a post", "the number of friends you have", "the time you spend online", "the cost of advertising"], correct: "likes, comments, and shares on a post", explanation: "<Engagement> measures how much people interact with content through likes, comments, and shares." },
  { question: "A <hashtag> is used to...", options: ["categorize content on social media", "send private messages", "block other users", "delete posts"], correct: "categorize content on social media", explanation: "A <hashtag> (#) is used to label and find content about specific topics." },
  { question: "<Cyberbullying> is...", options: ["bullying that happens online", "a computer virus", "a type of video game", "online shopping"], correct: "bullying that happens online", explanation: "<Cyberbullying> is the use of technology to harass, threaten, or embarrass someone." },
  { question: "A <scholarship> is...", options: ["money given to a student to help pay for education", "a type of exam", "a school subject", "a student's grade"], correct: "money given to a student to help pay for education", explanation: "A <scholarship> is financial aid awarded to students based on merit or need." },
  { question: "<Sustainability> means...", options: ["using resources without harming the future", "making things faster", "spending more money", "building bigger cities"], correct: "using resources without harming the future", explanation: "<Sustainability> is the practice of using resources responsibly for future generations." },
  { question: "<Pollution> is...", options: ["harmful substances in the environment", "clean air", "recycled materials", "natural resources"], correct: "harmful substances in the environment", explanation: "<Pollution> is the presence of harmful substances that damage the environment." },
  { question: "An <algorithm> is...", options: ["a set of rules a computer follows to solve problems", "a type of social media", "a computer screen", "an internet connection"], correct: "a set of rules a computer follows to solve problems", explanation: "An <algorithm> is a process or set of rules followed by a computer to perform calculations." },
  { question: "A <content creator> is someone who...", options: ["makes videos, articles, or posts for the internet", "repairs computers", "sells phones", "designs websites only"], correct: "makes videos, articles, or posts for the internet", explanation: "A <content creator> produces digital content like videos, blogs, or social media posts." },
  { question: "<Climate change> refers to...", options: ["long-term changes in global temperatures and weather", "daily weather forecasts", "seasonal changes", "local temperature"], correct: "long-term changes in global temperatures and weather", explanation: "<Climate change> refers to significant, long-term shifts in global climate patterns." },
  { question: "A university <degree> is...", options: ["a qualification awarded after completing studies", "a type of exam", "a school subject", "a student ID card"], correct: "a qualification awarded after completing studies", explanation: "A <degree> is an academic qualification given by a university after completing a program." },
  { question: "To <recycle> means to...", options: ["convert waste into reusable material", "throw things away", "buy new products", "burn garbage"], correct: "convert waste into reusable material", explanation: "To <recycle> means to process used materials so they can be used again." }
];

// 5. B1 Matching: Reading Vocab
const b1MatchingReadingVocab = [
  { left: "curriculum", right: "plan de estudios", explanation: "A curriculum is the set of courses and content taught at a school" },
  { left: "graduate", right: "graduarse", explanation: "To graduate means to complete studies and receive a qualification" },
  { left: "tuition", right: "matrícula universitaria", explanation: "Tuition is the fee paid for education" },
  { left: "semester", right: "semestre", explanation: "A semester is half of an academic year" },
  { left: "renewable energy", right: "energía renovable", explanation: "Energy from sources that won't run out, like solar and wind" },
  { left: "carbon footprint", right: "huella de carbono", explanation: "The total amount of greenhouse gases produced by a person or activity" },
  { left: "emissions", right: "emisiones", explanation: "Gases or substances released into the atmosphere" },
  { left: "influencer", right: "persona influyente en redes", explanation: "Someone with many followers who affects opinions online" },
  { left: "viral", right: "viral", explanation: "Content that spreads very quickly on the internet" },
  { left: "engagement", right: "interacción en redes", explanation: "The level of interaction (likes, comments, shares) on social media" },
  { left: "hashtag", right: "etiqueta (#)", explanation: "A word or phrase preceded by # used to categorize content" },
  { left: "cyberbullying", right: "ciberacoso", explanation: "Bullying that takes place online or through digital devices" },
  { left: "scholarship", right: "beca", explanation: "Financial aid given to students for their education" },
  { left: "sustainability", right: "sostenibilidad", explanation: "Using resources responsibly to protect the future" },
  { left: "pollution", right: "contaminación", explanation: "Harmful substances that damage the environment" },
  { left: "algorithm", right: "algoritmo", explanation: "A set of rules a computer follows to solve problems" },
  { left: "climate change", right: "cambio climático", explanation: "Long-term shifts in global temperatures and weather patterns" },
  { left: "degree", right: "título universitario", explanation: "An academic qualification from a university" },
  { left: "recycle", right: "reciclar", explanation: "To process waste materials for reuse" },
  { left: "content creator", right: "creador de contenido", explanation: "Someone who produces digital content for online platforms" }
];

writeJSON(join(DATA_DIR, 'b1', 'b1-reading-phrasal-verbs.json'), b1ReadingPhrasalVerbs);
writeJSON(join(DATA_DIR, 'b1', 'b1-reading-idioms.json'), b1ReadingIdioms);
writeJSON(join(DATA_DIR, 'b1', 'b1-flashcard-reading-vocab.json'), b1FlashcardReadingVocab);
writeJSON(join(DATA_DIR, 'b1', 'b1-quiz-reading-vocab.json'), b1QuizReadingVocab);
writeJSON(join(DATA_DIR, 'b1', 'b1-matching-reading-vocab.json'), b1MatchingReadingVocab);

console.log('--- B1: 5 files created ---\n');

// ============================================================
// B2 MODULES (+3)
// ============================================================

// 1. B2 Reading: Phrasal Verbs in Context
const b2ReadingPhrasalVerbs = {
  title: "Phrasal Verbs in Professional and Academic Discourse",
  estimatedReadingTime: 12,
  learningObjectives: [
    "Master phrasal verbs used in professional and academic contexts",
    "Understand nuanced meanings and register differences",
    "Learn phrasal verbs for argumentation and critical discussion",
    "Practice using phrasal verbs in formal and informal writing"
  ],
  sections: [
    {
      id: "intro",
      title: "Advanced Phrasal Verbs",
      type: "introduction",
      content: "At the B2 level, phrasal verbs become more nuanced. The same verb can carry different connotations depending on context. You'll encounter them in business reports, academic discussions, and sophisticated conversations. Mastering these will elevate your English from competent to impressive."
    },
    {
      id: "business-context",
      title: "In Business and Innovation",
      type: "theory",
      content: "The startup world relies heavily on phrasal verbs:\n\nThe founders set out to disrupt the traditional market. They drew up a business plan and reached out to investors. After several pitches, one investor bought into their vision. The company scaled up quickly, but they had to iron out several technical issues. When a competitor tried to muscle in on their market, they doubled down on innovation.\n\nBusiness phrasal verbs:\n• Set out - begin with a specific intention\n• Draw up - create a formal document\n• Reach out - contact someone\n• Buy into - believe in or invest in an idea\n• Scale up - increase in size or scope\n• Iron out - resolve problems\n• Muscle in on - force entry into a market\n• Double down on - increase commitment to something"
    },
    {
      id: "academic-context",
      title: "In Academic Discussion",
      type: "theory",
      content: "Academic English also uses phrasal verbs, though often in more formal ways:\n\nThe researcher set about examining the data systematically. Her findings pointed to a significant disparity in outcomes. Critics weighed in with alternative interpretations, but her methodology held up under scrutiny. The study touched on issues of systemic inequality and called for further investigation.\n\nAcademic phrasal verbs:\n• Set about - begin doing something methodically\n• Point to - indicate or suggest\n• Weigh in - contribute an opinion\n• Hold up - remain valid under examination\n• Touch on - briefly discuss\n• Call for - demand or require"
    },
    {
      id: "examples",
      title: "Register and Nuance",
      type: "examples",
      content: "Example 1: Formal: 'The committee ruled out the proposal.' Informal: 'We ruled out going to the beach.'\n\nExample 2: Formal: 'The report accounts for regional variations.' Informal: 'That accounts for why he was late.'\n\nExample 3: Formal: 'The initiative seeks to phase out fossil fuels.' Informal: 'They're phasing out the old menu.'\n\nExample 4: Formal: 'The findings bear out the hypothesis.' Informal: 'The evidence bears out what I said.'"
    },
    {
      id: "summary",
      title: "Key Takeaways",
      type: "summary",
      content: "Remember:\n• B2 phrasal verbs often carry subtle differences in meaning\n• The same phrasal verb can work in both formal and informal registers\n• Business English is rich in phrasal verbs — essential for professional growth\n• Academic phrasal verbs help you discuss research and ideas\n• Pay attention to collocations: which nouns typically follow each phrasal verb"
    }
  ],
  keyVocabulary: [
    { term: "set out", definition: "To begin a journey or task with a specific purpose", example: "They set out to change the industry.", pronunciation: "/set aʊt/" },
    { term: "draw up", definition: "To prepare a formal document or plan", example: "The lawyer drew up the contract.", pronunciation: "/drɔː ʌp/" },
    { term: "buy into", definition: "To believe in an idea or invest in something", example: "Investors bought into the vision.", pronunciation: "/baɪ ˈɪntuː/" },
    { term: "scale up", definition: "To increase the size or scope of something", example: "The company scaled up production.", pronunciation: "/skeɪl ʌp/" },
    { term: "iron out", definition: "To resolve problems or difficulties", example: "We need to iron out the details.", pronunciation: "/ˈaɪərn aʊt/" },
    { term: "weigh in", definition: "To contribute an opinion to a discussion", example: "Several experts weighed in on the debate.", pronunciation: "/weɪ ɪn/" },
    { term: "hold up", definition: "To remain valid under scrutiny", example: "The theory holds up under examination.", pronunciation: "/hoʊld ʌp/" },
    { term: "phase out", definition: "To gradually stop using something", example: "The government plans to phase out coal.", pronunciation: "/feɪz aʊt/" }
  ],
  grammarPoints: [
    {
      rule: "Phrasal Verbs in Formal Writing",
      explanation: "While phrasal verbs are often considered informal, many are perfectly acceptable in formal writing. The key is choosing the right one for the context.",
      examples: ["Formal: 'The study set out to examine...' (acceptable)", "Formal: 'The findings point to...' (acceptable)", "Too informal for academic writing: 'The researchers messed up the data.'"],
      commonMistakes: ["Avoiding all phrasal verbs in formal writing — many are appropriate and natural"]
    }
  ]
};

// 2. B2 Reading: Idioms in Context
const b2ReadingIdioms = {
  title: "Idioms in Professional and Global Contexts",
  estimatedReadingTime: 12,
  learningObjectives: [
    "Learn idioms used in business, innovation, and global discussions",
    "Understand cultural context behind common idioms",
    "Practice using idioms in professional communication",
    "Recognize idioms in news articles and reports"
  ],
  sections: [
    {
      id: "intro",
      title: "Professional Idioms",
      type: "introduction",
      content: "At the B2 level, idioms become tools for sophisticated communication. In business meetings, negotiations, and professional writing, the right idiom can make your point memorable and impactful. These idioms are commonly used in international business and media."
    },
    {
      id: "business-idioms",
      title: "Business and Innovation Idioms",
      type: "theory",
      content: "The business world has its own idiom vocabulary:\n\n• The bottom line - The most important fact. 'The bottom line is we need more funding.'\n• A game changer - Something that completely changes the situation. 'AI is a game changer for healthcare.'\n• Ahead of the curve - More advanced than others. 'Companies that iterate quickly stay ahead of the curve.'\n• Move the goalposts - Change the rules unfairly. 'The client keeps moving the goalposts.'\n• A level playing field - Fair conditions for everyone. 'We need a level playing field for all businesses.'\n• Get traction - Start to gain momentum. 'The new product is finally getting traction in the market.'"
    },
    {
      id: "global-idioms",
      title: "Idioms for Global Issues",
      type: "theory",
      content: "When discussing global challenges, these idioms are useful:\n\n• The tip of the iceberg - Only a small visible part of a larger problem. 'The reported cases are just the tip of the iceberg.'\n• A double-edged sword - Something with both advantages and disadvantages. 'Social media is a double-edged sword for accountability.'\n• Turn a blind eye - Deliberately ignore something. 'We can't turn a blind eye to humanitarian crises.'\n• The elephant in the room - An obvious problem nobody wants to discuss. 'Climate change is the elephant in the room.'\n• A slippery slope - A course of action likely to lead to worse things. 'Reducing oversight is a slippery slope.'"
    },
    {
      id: "examples",
      title: "Idioms in Professional Contexts",
      type: "examples",
      content: "Example 1: 'The startup gained traction after its initiative for accountability went viral.'\n\nExample 2: 'The disparity in wages is just the tip of the iceberg — systemic issues run much deeper.'\n\nExample 3: 'The new policy is a game changer, but critics say it's a double-edged sword.'\n\nExample 4: 'We need to stay ahead of the curve and iterate on our approach before competitors disrupt the market.'"
    },
    {
      id: "summary",
      title: "Key Takeaways",
      type: "summary",
      content: "Remember:\n• Business idioms make you sound confident in professional settings\n• Global issue idioms help you discuss complex topics effectively\n• Use idioms sparingly in formal reports — they work best in presentations and discussions\n• Many idioms have equivalents in other languages — use that to remember them\n• Practice by reading business news and identifying idioms"
    }
  ],
  keyVocabulary: [
    { term: "the bottom line", definition: "The most important fact or result", example: "The bottom line is we need to cut costs.", pronunciation: "/ðə ˈbɒtəm laɪn/" },
    { term: "a game changer", definition: "Something that completely changes a situation", example: "This technology is a real game changer.", pronunciation: "/ə ɡeɪm ˈtʃeɪndʒər/" },
    { term: "ahead of the curve", definition: "More advanced or progressive than others", example: "Their research is ahead of the curve.", pronunciation: "/əˈhed əv ðə kɜːrv/" },
    { term: "the tip of the iceberg", definition: "A small visible part of a much larger problem", example: "These complaints are the tip of the iceberg.", pronunciation: "/ðə tɪp əv ðə ˈaɪsbɜːrɡ/" },
    { term: "a double-edged sword", definition: "Something with both positive and negative effects", example: "Fame is a double-edged sword.", pronunciation: "/ə ˈdʌbəl edʒd sɔːrd/" },
    { term: "the elephant in the room", definition: "An obvious problem that nobody wants to discuss", example: "Inequality is the elephant in the room.", pronunciation: "/ðə ˈelɪfənt ɪn ðə ruːm/" }
  ],
  grammarPoints: [
    {
      rule: "Idioms with Articles",
      explanation: "Many idioms require specific articles (a, the) that cannot be changed. 'The bottom line' always uses 'the', while 'a game changer' uses 'a'.",
      examples: ["THE bottom line (always 'the')", "A game changer (always 'a')", "THE tip of THE iceberg (always 'the')"],
      commonMistakes: ["Changing the article: 'a bottom line' or 'the game changer' — these change the meaning"]
    }
  ]
};

// 3. B2 Flashcard: Reading Vocab (reinforcing orphaned terms)
const b2FlashcardReadingVocab = [
  { front: "Disparity", back: "Disparidad / Desigualdad", ipa: "/dɪˈspærəti/", example: "There is a growing disparity between rich and poor.", example_es: "Hay una creciente disparidad entre ricos y pobres." },
  { front: "Disproportionate", back: "Desproporcionado", ipa: "/ˌdɪsprəˈpɔːrʃənət/", example: "The punishment was disproportionate to the crime.", example_es: "El castigo fue desproporcionado respecto al crimen." },
  { front: "Systemic", back: "Sistémico", ipa: "/sɪˈstemɪk/", example: "Systemic racism affects many institutions.", example_es: "El racismo sistémico afecta a muchas instituciones." },
  { front: "Humanitarian", back: "Humanitario", ipa: "/hjuːˌmænɪˈteriən/", example: "The organization provides humanitarian aid.", example_es: "La organización proporciona ayuda humanitaria." },
  { front: "Disrupt", back: "Disrumpir / Alterar", ipa: "/dɪsˈrʌpt/", example: "New technology can disrupt entire industries.", example_es: "La nueva tecnología puede disrumpir industrias enteras." },
  { front: "Traction", back: "Tracción / Impulso", ipa: "/ˈtrækʃən/", example: "The idea is gaining traction among investors.", example_es: "La idea está ganando impulso entre los inversores." },
  { front: "Iterate", back: "Iterar / Repetir mejorando", ipa: "/ˈɪtəreɪt/", example: "We need to iterate on the design based on feedback.", example_es: "Necesitamos iterar en el diseño basándonos en la retroalimentación." },
  { front: "Initiative", back: "Iniciativa", ipa: "/ɪˈnɪʃətɪv/", example: "The government launched a new health initiative.", example_es: "El gobierno lanzó una nueva iniciativa de salud." },
  { front: "Accountability", back: "Responsabilidad / Rendición de cuentas", ipa: "/əˌkaʊntəˈbɪləti/", example: "There must be accountability for these decisions.", example_es: "Debe haber rendición de cuentas por estas decisiones." },
  { front: "Stakeholder", back: "Parte interesada", ipa: "/ˈsteɪkhoʊldər/", example: "All stakeholders were consulted before the decision.", example_es: "Todas las partes interesadas fueron consultadas antes de la decisión." },
  { front: "Leverage", back: "Apalancamiento / Aprovechar", ipa: "/ˈlevərɪdʒ/", example: "We can leverage technology to improve efficiency.", example_es: "Podemos aprovechar la tecnología para mejorar la eficiencia." },
  { front: "Benchmark", back: "Punto de referencia", ipa: "/ˈbentʃmɑːrk/", example: "This study sets a new benchmark for research.", example_es: "Este estudio establece un nuevo punto de referencia para la investigación." },
  { front: "Scalable", back: "Escalable", ipa: "/ˈskeɪləbəl/", example: "The business model must be scalable.", example_es: "El modelo de negocio debe ser escalable." },
  { front: "Paradigm", back: "Paradigma", ipa: "/ˈpærədaɪm/", example: "This represents a paradigm shift in education.", example_es: "Esto representa un cambio de paradigma en la educación." },
  { front: "Resilience", back: "Resiliencia", ipa: "/rɪˈzɪliəns/", example: "The community showed great resilience after the disaster.", example_es: "La comunidad mostró gran resiliencia después del desastre." },
  { front: "Transparency", back: "Transparencia", ipa: "/trænsˈpærənsi/", example: "Transparency in government builds public trust.", example_es: "La transparencia en el gobierno genera confianza pública." },
  { front: "Feasible", back: "Factible / Viable", ipa: "/ˈfiːzəbəl/", example: "Is this plan financially feasible?", example_es: "¿Es este plan financieramente viable?" },
  { front: "Mitigate", back: "Mitigar", ipa: "/ˈmɪtɪɡeɪt/", example: "We must mitigate the risks of climate change.", example_es: "Debemos mitigar los riesgos del cambio climático." },
  { front: "Advocate", back: "Abogar / Defensor", ipa: "/ˈædvəkeɪt/", example: "She advocates for equal rights.", example_es: "Ella aboga por la igualdad de derechos." },
  { front: "Sustainable", back: "Sostenible", ipa: "/səˈsteɪnəbəl/", example: "We need sustainable solutions for energy.", example_es: "Necesitamos soluciones sostenibles para la energía." }
];

writeJSON(join(DATA_DIR, 'b2', 'b2-reading-phrasal-verbs.json'), b2ReadingPhrasalVerbs);
writeJSON(join(DATA_DIR, 'b2', 'b2-reading-idioms.json'), b2ReadingIdioms);
writeJSON(join(DATA_DIR, 'b2', 'b2-flashcard-reading-vocab.json'), b2FlashcardReadingVocab);

console.log('--- B2: 3 files created ---\n');

// ============================================================
// C1 MODULES (+3)
// ============================================================

// 1. C1 Reading: Phrasal Verbs & Idioms Combined
const c1ReadingPhrasalVerbsIdioms = {
  title: "Phrasal Verbs and Idioms in Academic and Professional Discourse",
  estimatedReadingTime: 15,
  learningObjectives: [
    "Master sophisticated phrasal verbs in academic writing",
    "Understand idioms used in professional and intellectual discourse",
    "Analyze the interplay between figurative language and register",
    "Use phrasal verbs and idioms with precision in advanced contexts"
  ],
  sections: [
    {
      id: "intro",
      title: "Language at the C1 Level",
      type: "introduction",
      content: "At the C1 level, your command of phrasal verbs and idioms should be nuanced and precise. You need to understand not just what these expressions mean, but when and how to deploy them effectively. Academic papers, professional presentations, and intellectual debates all require a sophisticated grasp of figurative language."
    },
    {
      id: "academic-discourse",
      title: "Phrasal Verbs in Academic Writing",
      type: "theory",
      content: "Academic discourse employs phrasal verbs more than many learners realize:\n\nThe researcher set forth a compelling argument that interrogated prevailing assumptions. Her work built on earlier studies but broke away from conventional epistemology. She delved into the lacuna in existing literature and brought to light several overlooked factors. Her conclusions touched upon ethnocentrism in research methodology and called into question the universality of Western frameworks.\n\nAcademic phrasal verbs:\n• Set forth - present formally\n• Build on - use as a foundation\n• Break away from - depart from tradition\n• Delve into - investigate deeply\n• Bring to light - reveal or discover\n• Touch upon - briefly address\n• Call into question - challenge the validity of"
    },
    {
      id: "professional-idioms",
      title: "Idioms in Professional Leadership",
      type: "theory",
      content: "Leadership and management discourse is rich with idioms:\n\n• Raise the bar - Set higher standards. 'The new CEO raised the bar for corporate accountability.'\n• Weather the storm - Survive a difficult period. 'The company weathered the storm of the recession.'\n• Move the needle - Make a significant impact. 'This initiative will move the needle on diversity.'\n• Read the room - Understand the mood of a group. 'A good leader knows how to read the room.'\n• Throw someone under the bus - Blame someone unfairly. 'He threw his colleague under the bus to save himself.'\n• Have skin in the game - Have a personal stake in the outcome. 'Investors with skin in the game make better decisions.'"
    },
    {
      id: "examples",
      title: "Sophisticated Usage",
      type: "examples",
      content: "Example 1: 'The study delved into the intersectionality of race and class, bringing to light a preeminent concern in contemporary sociology.'\n\nExample 2: 'The CEO's cosmopolitanism helped the company break away from a parochial worldview and recalibrate its global strategy.'\n\nExample 3: 'Critics called into question the epistemological foundations of the research, arguing it essentialized complex cultural phenomena.'\n\nExample 4: 'The seismic shift in policy raised the bar for accountability across the entire sector.'"
    },
    {
      id: "register-analysis",
      title: "Register and Appropriateness",
      type: "theory",
      content: "Understanding register is crucial at C1:\n\nFormal academic: 'The findings call into question previous assumptions.' (appropriate)\nInformal equivalent: 'The findings blow holes in what we thought.' (too casual for papers)\n\nFormal professional: 'We need to raise the bar on quality.' (appropriate in meetings)\nToo casual: 'We need to step up our game.' (acceptable but less professional)\n\nThe key is matching your language to your audience and purpose. In a board meeting, 'move the needle' is perfect. In an academic paper, 'yield significant results' is more appropriate."
    },
    {
      id: "summary",
      title: "Key Takeaways",
      type: "summary",
      content: "Remember:\n• C1 phrasal verbs carry precise academic and professional meanings\n• Idioms at this level are tools for persuasion and impact\n• Register awareness is essential — match your language to the context\n• Many academic phrasal verbs have Latin-origin synonyms for very formal writing\n• Practice by reading academic journals and professional publications"
    }
  ],
  keyVocabulary: [
    { term: "set forth", definition: "To present or state something formally", example: "The author set forth a new theory.", pronunciation: "/set fɔːrθ/" },
    { term: "delve into", definition: "To investigate or research something deeply", example: "The study delves into cultural identity.", pronunciation: "/delv ˈɪntuː/" },
    { term: "call into question", definition: "To challenge the truth or validity of something", example: "New evidence calls the theory into question.", pronunciation: "/kɔːl ˈɪntuː ˈkwestʃən/" },
    { term: "bring to light", definition: "To reveal or make known something hidden", example: "The investigation brought corruption to light.", pronunciation: "/brɪŋ tə laɪt/" },
    { term: "raise the bar", definition: "To set a higher standard", example: "This innovation raises the bar for the industry.", pronunciation: "/reɪz ðə bɑːr/" },
    { term: "move the needle", definition: "To make a noticeable difference or impact", example: "Will this policy move the needle on inequality?", pronunciation: "/muːv ðə ˈniːdəl/" },
    { term: "weather the storm", definition: "To survive a difficult period successfully", example: "The organization weathered the financial storm.", pronunciation: "/ˈweðər ðə stɔːrm/" },
    { term: "read the room", definition: "To understand the mood or feelings of a group", example: "A skilled negotiator can read the room.", pronunciation: "/riːd ðə ruːm/" }
  ],
  grammarPoints: [
    {
      rule: "Phrasal Verbs vs Latin-Origin Equivalents",
      explanation: "In very formal academic writing, phrasal verbs sometimes have more formal single-word equivalents derived from Latin or French. Both are correct, but the choice affects register.",
      examples: ["set forth = propound/present", "delve into = investigate/examine", "bring to light = reveal/uncover", "call into question = challenge/dispute"],
      commonMistakes: ["Always replacing phrasal verbs with formal equivalents — this can make writing sound stilted and unnatural"]
    }
  ]
};

// 2. C1 Flashcard: Reading Vocab (reinforcing orphaned terms)
const c1FlashcardReadingVocab = [
  { front: "Interrogate", back: "Interrogar / Cuestionar críticamente", ipa: "/ɪnˈterəɡeɪt/", example: "The paper interrogates assumptions about cultural identity.", example_es: "El artículo cuestiona críticamente las suposiciones sobre identidad cultural." },
  { front: "Lacuna", back: "Laguna / Vacío", ipa: "/ləˈkjuːnə/", example: "There is a significant lacuna in the existing research.", example_es: "Hay una laguna significativa en la investigación existente." },
  { front: "Epistemology", back: "Epistemología", ipa: "/ɪˌpɪstəˈmɒlədʒi/", example: "Epistemology examines the nature of knowledge.", example_es: "La epistemología examina la naturaleza del conocimiento." },
  { front: "Ethnocentrism", back: "Etnocentrismo", ipa: "/ˌeθnoʊˈsentrɪzəm/", example: "Ethnocentrism can bias research conclusions.", example_es: "El etnocentrismo puede sesgar las conclusiones de la investigación." },
  { front: "Essentialize", back: "Esencializar", ipa: "/ɪˈsenʃəlaɪz/", example: "We should avoid essentializing complex cultures.", example_es: "Debemos evitar esencializar culturas complejas." },
  { front: "Cosmopolitanism", back: "Cosmopolitismo", ipa: "/ˌkɒzməˈpɒlɪtənɪzəm/", example: "Cosmopolitanism promotes global citizenship.", example_es: "El cosmopolitismo promueve la ciudadanía global." },
  { front: "Intersectionality", back: "Interseccionalidad", ipa: "/ˌɪntərˌsekʃəˈnæləti/", example: "Intersectionality examines overlapping social identities.", example_es: "La interseccionalidad examina las identidades sociales superpuestas." },
  { front: "Glocalization", back: "Glocalización", ipa: "/ˌɡloʊkəlaɪˈzeɪʃən/", example: "Glocalization adapts global products to local markets.", example_es: "La glocalización adapta productos globales a mercados locales." },
  { front: "Recalibrate", back: "Recalibrar", ipa: "/riːˈkælɪbreɪt/", example: "We need to recalibrate our approach.", example_es: "Necesitamos recalibrar nuestro enfoque." },
  { front: "Seismic", back: "Sísmico / De gran impacto", ipa: "/ˈsaɪzmɪk/", example: "The policy caused a seismic shift in the industry.", example_es: "La política causó un cambio sísmico en la industria." },
  { front: "Preeminent", back: "Preeminente", ipa: "/priːˈemɪnənt/", example: "She is the preeminent scholar in her field.", example_es: "Ella es la académica preeminente en su campo." },
  { front: "Paradigm shift", back: "Cambio de paradigma", ipa: "/ˈpærədaɪm ʃɪft/", example: "AI represents a paradigm shift in technology.", example_es: "La IA representa un cambio de paradigma en tecnología." },
  { front: "Discourse", back: "Discurso", ipa: "/ˈdɪskɔːrs/", example: "Academic discourse requires precise language.", example_es: "El discurso académico requiere un lenguaje preciso." },
  { front: "Hegemony", back: "Hegemonía", ipa: "/hɪˈdʒeməni/", example: "Cultural hegemony shapes public opinion.", example_es: "La hegemonía cultural moldea la opinión pública." },
  { front: "Empirical", back: "Empírico", ipa: "/ɪmˈpɪrɪkəl/", example: "The study is based on empirical evidence.", example_es: "El estudio se basa en evidencia empírica." },
  { front: "Nuance", back: "Matiz", ipa: "/ˈnjuːɑːns/", example: "The argument lacks nuance.", example_es: "El argumento carece de matices." },
  { front: "Corroborate", back: "Corroborar", ipa: "/kəˈrɒbəreɪt/", example: "Further studies corroborate these findings.", example_es: "Estudios adicionales corroboran estos hallazgos." },
  { front: "Juxtapose", back: "Yuxtaponer", ipa: "/ˌdʒʌkstəˈpoʊz/", example: "The author juxtaposes tradition and modernity.", example_es: "El autor yuxtapone tradición y modernidad." },
  { front: "Proliferation", back: "Proliferación", ipa: "/prəˌlɪfəˈreɪʃən/", example: "The proliferation of misinformation is concerning.", example_es: "La proliferación de desinformación es preocupante." },
  { front: "Ubiquitous", back: "Ubicuo / Omnipresente", ipa: "/juːˈbɪkwɪtəs/", example: "Smartphones have become ubiquitous.", example_es: "Los smartphones se han vuelto omnipresentes." }
];

// 3. C1 Quiz: Reading Vocab
const c1QuizReadingVocab = [
  { question: "To <interrogate> in an academic context means to...", options: ["critically examine or question assumptions", "ask someone questions in a police station", "translate a text", "memorize information"], correct: "critically examine or question assumptions", explanation: "In academic discourse, to <interrogate> means to critically examine or challenge ideas and assumptions." },
  { question: "A <lacuna> is...", options: ["a gap or missing part in knowledge or research", "a type of academic degree", "a research method", "a university department"], correct: "a gap or missing part in knowledge or research", explanation: "A <lacuna> is a gap or blank space, especially in knowledge or a manuscript." },
  { question: "<Epistemology> is the study of...", options: ["the nature and scope of knowledge", "ancient languages", "mathematical equations", "biological systems"], correct: "the nature and scope of knowledge", explanation: "<Epistemology> is the branch of philosophy concerned with the theory of knowledge." },
  { question: "<Ethnocentrism> is the tendency to...", options: ["judge other cultures by the standards of your own", "study multiple languages", "travel to different countries", "appreciate cultural diversity"], correct: "judge other cultures by the standards of your own", explanation: "<Ethnocentrism> is evaluating other cultures according to the norms of one's own culture." },
  { question: "To <essentialize> means to...", options: ["reduce something complex to a single characteristic", "make something essential", "improve something", "analyze in detail"], correct: "reduce something complex to a single characteristic", explanation: "To <essentialize> means to oversimplify by attributing a fixed essence to something complex." },
  { question: "<Cosmopolitanism> promotes...", options: ["the idea that all people belong to a single global community", "national pride", "local traditions only", "economic isolation"], correct: "the idea that all people belong to a single global community", explanation: "<Cosmopolitanism> is the ideology that all human beings belong to a single community." },
  { question: "<Intersectionality> examines...", options: ["how different social identities overlap and interact", "road intersections", "mathematical intersections", "business partnerships"], correct: "how different social identities overlap and interact", explanation: "<Intersectionality> studies how categories like race, gender, and class interconnect." },
  { question: "<Glocalization> refers to...", options: ["adapting global products or ideas to local contexts", "only focusing on local markets", "rejecting globalization", "standardizing products worldwide"], correct: "adapting global products or ideas to local contexts", explanation: "<Glocalization> is the practice of adapting globally distributed products to local markets." },
  { question: "To <recalibrate> means to...", options: ["adjust or correct something based on new information", "repeat an experiment", "cancel a project", "start from scratch"], correct: "adjust or correct something based on new information", explanation: "To <recalibrate> means to adjust measurements, expectations, or approaches." },
  { question: "A <seismic> change is...", options: ["extremely large and significant", "very small and gradual", "temporary", "predictable"], correct: "extremely large and significant", explanation: "<Seismic> figuratively means having enormous impact or significance." },
  { question: "<Preeminent> means...", options: ["surpassing all others; most distinguished", "average", "unknown", "controversial"], correct: "surpassing all others; most distinguished", explanation: "<Preeminent> means superior to or notable above all others." },
  { question: "A <paradigm shift> is...", options: ["a fundamental change in approach or underlying assumptions", "a minor adjustment", "a temporary trend", "a return to old methods"], correct: "a fundamental change in approach or underlying assumptions", explanation: "A <paradigm shift> is a fundamental change in the basic concepts and practices of a discipline." },
  { question: "<Discourse> refers to...", options: ["written or spoken communication on a topic", "a type of university course", "a research grant", "a scientific experiment"], correct: "written or spoken communication on a topic", explanation: "<Discourse> is formal discussion or debate, or a connected series of utterances on a topic." },
  { question: "<Hegemony> means...", options: ["dominance or leadership of one group over others", "equality among groups", "cooperation between nations", "academic excellence"], correct: "dominance or leadership of one group over others", explanation: "<Hegemony> is the dominance of one group over others, especially in politics or culture." },
  { question: "<Empirical> evidence is based on...", options: ["observation and experience rather than theory", "personal opinions", "mathematical proofs only", "historical documents only"], correct: "observation and experience rather than theory", explanation: "<Empirical> means based on verifiable observation or experience rather than theory." },
  { question: "A <nuance> is...", options: ["a subtle difference in meaning or expression", "a major difference", "an obvious error", "a simple explanation"], correct: "a subtle difference in meaning or expression", explanation: "A <nuance> is a subtle distinction or variation in meaning, tone, or color." },
  { question: "To <corroborate> means to...", options: ["confirm or support with evidence", "contradict", "ignore", "simplify"], correct: "confirm or support with evidence", explanation: "To <corroborate> means to confirm or give support to a statement or theory." },
  { question: "To <juxtapose> means to...", options: ["place things side by side for comparison", "combine into one", "separate completely", "arrange chronologically"], correct: "place things side by side for comparison", explanation: "To <juxtapose> means to place close together for contrasting effect." },
  { question: "<Proliferation> means...", options: ["rapid increase in number or spread", "gradual decrease", "complete elimination", "careful selection"], correct: "rapid increase in number or spread", explanation: "<Proliferation> is a rapid increase in the number or amount of something." },
  { question: "<Ubiquitous> means...", options: ["present everywhere; very common", "extremely rare", "invisible", "temporary"], correct: "present everywhere; very common", explanation: "<Ubiquitous> means found everywhere; omnipresent." }
];

writeJSON(join(DATA_DIR, 'c1', 'c1-reading-phrasal-verbs-idioms.json'), c1ReadingPhrasalVerbsIdioms);
writeJSON(join(DATA_DIR, 'c1', 'c1-flashcard-reading-vocab.json'), c1FlashcardReadingVocab);
writeJSON(join(DATA_DIR, 'c1', 'c1-quiz-reading-vocab.json'), c1QuizReadingVocab);

console.log('--- C1: 3 files created ---\n');

// ============================================================
// C2 MODULES (+5)
// ============================================================

// 1. C2 Reading: Phrasal Verbs & Idioms Combined
const c2ReadingPhrasalVerbsIdioms = {
  title: "Figurative Language in Scholarly and Literary Discourse",
  estimatedReadingTime: 18,
  learningObjectives: [
    "Analyze sophisticated phrasal verbs in scholarly writing",
    "Understand literary and philosophical idioms at near-native level",
    "Evaluate the rhetorical function of figurative language",
    "Deploy phrasal verbs and idioms with native-like precision"
  ],
  sections: [
    {
      id: "intro",
      title: "Mastery of Figurative Language",
      type: "introduction",
      content: "At the C2 level, figurative language is not merely decorative — it is a precision instrument for intellectual discourse. Phrasal verbs and idioms in academic, literary, and philosophical writing carry layers of meaning that require deep cultural and linguistic competence. This reading explores how mastery-level English deploys these tools."
    },
    {
      id: "philosophical-discourse",
      title: "Phrasal Verbs in Philosophical Writing",
      type: "theory",
      content: "Philosophical discourse employs phrasal verbs with remarkable precision:\n\nThe philosopher grappled with the aporia at the heart of Western ontology. She sought to tease out the implications of categorical imperatives while pushing back against reductive epistemology. Her work drew on heteroglossia to open up new avenues of inquiry, ultimately arriving at a position that did away with the vicious circularity of previous arguments.\n\nPhilosophical phrasal verbs:\n• Grapple with - struggle intellectually with a difficult concept\n• Tease out - carefully extract or identify subtle elements\n• Push back against - resist or challenge\n• Draw on - use as a resource or influence\n• Open up - create new possibilities\n• Do away with - eliminate or abolish\n• Arrive at - reach through reasoning"
    },
    {
      id: "literary-analysis",
      title: "Idioms in Literary Criticism",
      type: "theory",
      content: "Literary criticism employs idioms that bridge the scholarly and the evocative:\n\n• Read between the lines - Understand implicit meaning. 'The subaltern narrative requires us to read between the lines of colonial texts.'\n• A far cry from - Very different from. 'This palimpsest of meaning is a far cry from surface-level interpretation.'\n• Strike a chord - Resonate emotionally. 'The ekphrasis in the poem strikes a chord with readers across cultures.'\n• Cut to the chase - Get to the essential point. 'To cut to the chase: the topology of the argument is fundamentally flawed.'\n• The jury is still out - No conclusion yet. 'The jury is still out on whether qualia can be empirically studied.'\n• A tall order - A very difficult task. 'Reconciling inviolability with jurisprudence is a tall order.'"
    },
    {
      id: "examples",
      title: "Mastery-Level Usage",
      type: "examples",
      content: "Example 1: 'The scholar teased out the heteroglossia embedded in the palimpsest, drawing on postcolonial theory to push back against essentialist readings.'\n\nExample 2: 'The pathophysiology of the condition opened up new avenues for research, though the requisite interdisciplinary approach proved a tall order.'\n\nExample 3: 'By grappling with the aporia of free will, the philosopher arrived at a position that did away with the vicious circularity of compatibilist arguments.'\n\nExample 4: 'The arbitrage between competing theoretical frameworks is a far cry from simple eclecticism — it requires reading between the lines of each tradition.'"
    },
    {
      id: "rhetorical-function",
      title: "The Rhetorical Power of Figurative Language",
      type: "theory",
      content: "At the C2 level, understanding why a writer chooses a phrasal verb or idiom is as important as understanding what it means:\n\n'Tease out' implies patience and delicacy — the writer is handling fragile ideas.\n'Push back against' implies intellectual courage — the writer is challenging authority.\n'Grapple with' implies honest struggle — the writer acknowledges difficulty.\n'Do away with' implies decisive action — the writer is making a bold claim.\n\nThese choices are never accidental. They signal the writer's stance, confidence, and relationship to the material."
    },
    {
      id: "summary",
      title: "Key Takeaways",
      type: "summary",
      content: "Remember:\n• C2 figurative language carries rhetorical and philosophical weight\n• Phrasal verbs in scholarly writing signal intellectual stance\n• Literary idioms bridge analytical precision and evocative power\n• The choice of figurative language reveals the writer's relationship to their subject\n• Mastery means not just understanding but deploying these tools strategically"
    }
  ],
  keyVocabulary: [
    { term: "grapple with", definition: "To struggle intellectually with a complex problem", example: "Philosophers grapple with questions of consciousness.", pronunciation: "/ˈɡræpəl wɪð/" },
    { term: "tease out", definition: "To carefully extract or identify subtle elements", example: "The critic teased out hidden themes in the novel.", pronunciation: "/tiːz aʊt/" },
    { term: "push back against", definition: "To resist or challenge an idea or authority", example: "Scholars push back against reductive interpretations.", pronunciation: "/pʊʃ bæk əˈɡenst/" },
    { term: "draw on", definition: "To use something as a resource or influence", example: "The theory draws on multiple disciplines.", pronunciation: "/drɔː ɒn/" },
    { term: "do away with", definition: "To eliminate or abolish something", example: "The new framework does away with outdated assumptions.", pronunciation: "/duː əˈweɪ wɪð/" },
    { term: "read between the lines", definition: "To understand the implicit or hidden meaning", example: "You need to read between the lines of the report.", pronunciation: "/riːd bɪˈtwiːn ðə laɪnz/" },
    { term: "a far cry from", definition: "Very different from something", example: "This analysis is a far cry from simplistic readings.", pronunciation: "/ə fɑːr kraɪ frɒm/" },
    { term: "the jury is still out", definition: "No definitive conclusion has been reached", example: "The jury is still out on this theory.", pronunciation: "/ðə ˈdʒʊri ɪz stɪl aʊt/" }
  ],
  grammarPoints: [
    {
      rule: "Rhetorical Function of Phrasal Verbs",
      explanation: "At the C2 level, phrasal verbs are chosen not just for meaning but for rhetorical effect. 'Grapple with' implies honest intellectual struggle, while 'deal with' is neutral. 'Tease out' implies delicacy, while 'extract' is clinical.",
      examples: ["'Grapple with' (implies struggle) vs 'address' (neutral)", "'Tease out' (implies delicacy) vs 'identify' (clinical)", "'Push back against' (implies courage) vs 'disagree with' (neutral)"],
      commonMistakes: ["Using neutral verbs when a phrasal verb would add rhetorical power to academic writing"]
    }
  ]
};

// 2. C2 Flashcard: Reading Vocab (reinforcing orphaned terms)
const c2FlashcardReadingVocab = [
  { front: "Aporia", back: "Aporía (contradicción irresoluble)", ipa: "/əˈpɔːriə/", example: "The text reveals an aporia at the heart of the argument.", example_es: "El texto revela una aporía en el corazón del argumento." },
  { front: "Palimpsest", back: "Palimpsesto", ipa: "/ˈpælɪmpsest/", example: "The city is a palimpsest of historical layers.", example_es: "La ciudad es un palimpsesto de capas históricas." },
  { front: "Heteroglossia", back: "Heteroglosia (multiplicidad de voces)", ipa: "/ˌhetərəˈɡlɒsiə/", example: "Bakhtin's concept of heteroglossia transformed literary theory.", example_es: "El concepto de heteroglosia de Bajtín transformó la teoría literaria." },
  { front: "Subaltern", back: "Subalterno", ipa: "/sʌˈbɔːltərn/", example: "Spivak asked whether the subaltern can speak.", example_es: "Spivak preguntó si el subalterno puede hablar." },
  { front: "Ekphrasis", back: "Écfrasis (descripción literaria de arte visual)", ipa: "/ˈekfrəsɪs/", example: "Keats's 'Ode on a Grecian Urn' is a famous ekphrasis.", example_es: "La 'Oda a una urna griega' de Keats es una famosa écfrasis." },
  { front: "Ontology", back: "Ontología", ipa: "/ɒnˈtɒlədʒi/", example: "Ontology examines the nature of being and existence.", example_es: "La ontología examina la naturaleza del ser y la existencia." },
  { front: "Categorical imperative", back: "Imperativo categórico", ipa: "/ˌkætəˈɡɒrɪkəl ɪmˈperətɪv/", example: "Kant's categorical imperative is a foundation of moral philosophy.", example_es: "El imperativo categórico de Kant es un fundamento de la filosofía moral." },
  { front: "Qualia", back: "Qualia (experiencias subjetivas)", ipa: "/ˈkwɑːliə/", example: "The problem of qualia challenges materialist philosophy.", example_es: "El problema de los qualia desafía la filosofía materialista." },
  { front: "Vicious circularity", back: "Circularidad viciosa", ipa: "/ˈvɪʃəs ˌsɜːrkjəˈlærəti/", example: "The argument suffers from vicious circularity.", example_es: "El argumento sufre de circularidad viciosa." },
  { front: "Inviolability", back: "Inviolabilidad", ipa: "/ɪnˌvaɪələˈbɪləti/", example: "The inviolability of human rights is a core principle.", example_es: "La inviolabilidad de los derechos humanos es un principio fundamental." },
  { front: "Jurisprudence", back: "Jurisprudencia", ipa: "/ˌdʒʊərɪsˈpruːdəns/", example: "Legal jurisprudence evolves with societal changes.", example_es: "La jurisprudencia legal evoluciona con los cambios sociales." },
  { front: "Pathophysiology", back: "Fisiopatología", ipa: "/ˌpæθoʊˌfɪziˈɒlədʒi/", example: "Understanding the pathophysiology is essential for treatment.", example_es: "Comprender la fisiopatología es esencial para el tratamiento." },
  { front: "Arbitrage", back: "Arbitraje", ipa: "/ˈɑːrbɪtrɑːʒ/", example: "Intellectual arbitrage between disciplines yields new insights.", example_es: "El arbitraje intelectual entre disciplinas produce nuevas perspectivas." },
  { front: "Topology", back: "Topología", ipa: "/təˈpɒlədʒi/", example: "The topology of the argument reveals hidden connections.", example_es: "La topología del argumento revela conexiones ocultas." },
  { front: "Requisite", back: "Requisito / Necesario", ipa: "/ˈrekwɪzɪt/", example: "The requisite expertise is rare in this field.", example_es: "La experiencia requisita es rara en este campo." },
  { front: "Dialectic", back: "Dialéctica", ipa: "/ˌdaɪəˈlektɪk/", example: "Hegel's dialectic involves thesis, antithesis, and synthesis.", example_es: "La dialéctica de Hegel involucra tesis, antítesis y síntesis." },
  { front: "Hermeneutics", back: "Hermenéutica", ipa: "/ˌhɜːrməˈnjuːtɪks/", example: "Hermeneutics is the theory of text interpretation.", example_es: "La hermenéutica es la teoría de la interpretación de textos." },
  { front: "Teleological", back: "Teleológico", ipa: "/ˌteliəˈlɒdʒɪkəl/", example: "A teleological argument explains things by their purpose.", example_es: "Un argumento teleológico explica las cosas por su propósito." },
  { front: "Phenomenology", back: "Fenomenología", ipa: "/fɪˌnɒmɪˈnɒlədʒi/", example: "Phenomenology studies the structures of conscious experience.", example_es: "La fenomenología estudia las estructuras de la experiencia consciente." },
  { front: "Epistemic", back: "Epistémico", ipa: "/ˌepɪˈstemɪk/", example: "There is an epistemic gap in our understanding.", example_es: "Hay una brecha epistémica en nuestra comprensión." }
];

// 3. C2 Quiz: Reading Vocab
const c2QuizReadingVocab = [
  { question: "An <aporia> is...", options: ["an irresolvable internal contradiction in a text or argument", "a type of literary genre", "a rhetorical device for persuasion", "a logical proof"], correct: "an irresolvable internal contradiction in a text or argument", explanation: "An <aporia> is a state of puzzlement or an irresolvable contradiction, often in philosophical texts." },
  { question: "A <palimpsest> metaphorically refers to...", options: ["something with multiple layers of meaning or history", "a single clear message", "an ancient language", "a type of manuscript"], correct: "something with multiple layers of meaning or history", explanation: "A <palimpsest> originally meant a manuscript written over earlier text; metaphorically, it refers to layered meanings." },
  { question: "<Heteroglossia> describes...", options: ["the coexistence of multiple voices or perspectives in a text", "a single authoritative voice", "grammatical errors", "translation between languages"], correct: "the coexistence of multiple voices or perspectives in a text", explanation: "<Heteroglossia>, coined by Bakhtin, refers to the diversity of voices and social languages within a text." },
  { question: "The <subaltern> refers to...", options: ["marginalized groups excluded from power structures", "military officers", "academic professors", "political leaders"], correct: "marginalized groups excluded from power structures", explanation: "The <subaltern> refers to populations socially, politically, and geographically outside hegemonic power." },
  { question: "<Ekphrasis> is...", options: ["a literary description of a visual work of art", "a type of poetry meter", "a philosophical argument", "a grammatical structure"], correct: "a literary description of a visual work of art", explanation: "<Ekphrasis> is the literary representation or description of visual art." },
  { question: "<Ontology> is concerned with...", options: ["the nature of being and existence", "the study of language", "mathematical proofs", "historical events"], correct: "the nature of being and existence", explanation: "<Ontology> is the philosophical study of the nature of being, becoming, and reality." },
  { question: "Kant's <categorical imperative> is...", options: ["a universal moral law that applies regardless of circumstances", "a suggestion for good behavior", "a legal requirement", "a scientific hypothesis"], correct: "a universal moral law that applies regardless of circumstances", explanation: "The <categorical imperative> is Kant's principle that one should act only according to rules one could will to be universal laws." },
  { question: "<Qualia> are...", options: ["subjective, conscious experiences like the redness of red", "scientific measurements", "logical propositions", "mathematical constants"], correct: "subjective, conscious experiences like the redness of red", explanation: "<Qualia> are the subjective, phenomenal qualities of conscious experience." },
  { question: "<Vicious circularity> in an argument means...", options: ["the conclusion is assumed in the premises", "the argument is very long", "the argument uses many examples", "the argument is well-structured"], correct: "the conclusion is assumed in the premises", explanation: "<Vicious circularity> occurs when an argument's conclusion is presupposed by its premises." },
  { question: "<Inviolability> means...", options: ["the quality of being sacred and not to be transgressed", "flexibility", "temporary protection", "conditional rights"], correct: "the quality of being sacred and not to be transgressed", explanation: "<Inviolability> means the quality of being too important to be broken or violated." },
  { question: "<Jurisprudence> is...", options: ["the theory and philosophy of law", "a court verdict", "a type of crime", "a legal document"], correct: "the theory and philosophy of law", explanation: "<Jurisprudence> is the theoretical study of law and legal systems." },
  { question: "<Pathophysiology> studies...", options: ["the functional changes associated with disease", "healthy body functions", "surgical techniques", "pharmaceutical production"], correct: "the functional changes associated with disease", explanation: "<Pathophysiology> examines the disordered physiological processes that cause or result from disease." },
  { question: "<Arbitrage> in an intellectual context means...", options: ["exploiting differences between frameworks for new insights", "financial trading only", "legal mediation", "random selection"], correct: "exploiting differences between frameworks for new insights", explanation: "<Arbitrage> metaphorically means leveraging differences between systems or frameworks productively." },
  { question: "<Topology> in discourse analysis refers to...", options: ["the structural arrangement and connections within an argument", "the study of maps", "geographical features", "surface textures"], correct: "the structural arrangement and connections within an argument", explanation: "<Topology> metaphorically refers to the shape and structure of relationships within a system of ideas." },
  { question: "<Requisite> means...", options: ["necessary or required for a particular purpose", "optional", "excessive", "irrelevant"], correct: "necessary or required for a particular purpose", explanation: "<Requisite> means made necessary by particular circumstances; essential." },
  { question: "<Dialectic> involves...", options: ["the resolution of opposing ideas through reasoned argument", "a single perspective", "emotional persuasion", "statistical analysis"], correct: "the resolution of opposing ideas through reasoned argument", explanation: "The <dialectic> is a method of argument involving thesis, antithesis, and synthesis." },
  { question: "<Hermeneutics> is the study of...", options: ["interpretation, especially of texts", "ancient languages", "mathematical symbols", "chemical compounds"], correct: "interpretation, especially of texts", explanation: "<Hermeneutics> is the theory and methodology of interpretation, particularly of texts." },
  { question: "A <teleological> explanation focuses on...", options: ["purpose or end goals", "historical causes", "random events", "statistical probability"], correct: "purpose or end goals", explanation: "<Teleological> relates to explaining phenomena by their purpose or design." },
  { question: "<Phenomenology> examines...", options: ["the structures of subjective experience and consciousness", "physical phenomena only", "economic systems", "political structures"], correct: "the structures of subjective experience and consciousness", explanation: "<Phenomenology> is the philosophical study of the structures of experience and consciousness." },
  { question: "<Epistemic> relates to...", options: ["knowledge and the conditions for its possibility", "emotions", "physical strength", "artistic expression"], correct: "knowledge and the conditions for its possibility", explanation: "<Epistemic> pertains to knowledge or the degree of its validation." }
];

// 4. C2 Completion: Reading Vocab
const c2CompletionReadingVocab = [
  { sentence: "The text reveals an ______ at the heart of the deconstructionist argument.", correct: "aporia", explanation: "An <aporia> is an irresolvable internal contradiction in a philosophical argument.", tip: "Complete with the term for an irresolvable contradiction" },
  { sentence: "The city's architecture is a ______ of colonial, modern, and postmodern layers.", correct: "palimpsest", explanation: "A <palimpsest> metaphorically describes something with multiple overlapping layers of history.", tip: "Complete with the term for layered historical traces" },
  { sentence: "Bakhtin's concept of ______ emphasizes the multiplicity of voices in any text.", correct: "heteroglossia", explanation: "<Heteroglossia> refers to the coexistence of diverse social languages within a single text.", tip: "Complete with Bakhtin's term for multiple voices" },
  { sentence: "Spivak's question about whether the ______ can speak remains central to postcolonial studies.", correct: "subaltern", explanation: "The <subaltern> refers to marginalized populations excluded from hegemonic power structures.", tip: "Complete with the term for marginalized groups" },
  { sentence: "The poem's vivid ______ brings the painting to life through language.", correct: "ekphrasis", explanation: "<Ekphrasis> is the literary description or representation of a visual work of art.", tip: "Complete with the term for literary description of visual art" },
  { sentence: "Questions of ______ — what exists and what it means to exist — underpin the entire philosophical tradition.", correct: "ontology", explanation: "<Ontology> is the branch of philosophy dealing with the nature of being and existence.", tip: "Complete with the philosophical study of being" },
  { sentence: "Kant's ______ ______ demands that we act only according to universalizable principles.", correct: "categorical imperative", explanation: "The <categorical imperative> is Kant's foundational principle of moral philosophy.", tip: "Complete with Kant's universal moral law (two words)" },
  { sentence: "The hard problem of consciousness centers on explaining subjective ______.", correct: "qualia", explanation: "<Qualia> are the subjective, phenomenal qualities of conscious experience.", tip: "Complete with the term for subjective conscious experiences" },
  { sentence: "The argument suffers from ______ ______, assuming what it sets out to prove.", correct: "vicious circularity", explanation: "<Vicious circularity> occurs when an argument's conclusion is presupposed in its premises.", tip: "Complete with the term for circular reasoning (two words)" },
  { sentence: "The ______ of human dignity is a cornerstone of international law.", correct: "inviolability", explanation: "<Inviolability> means the quality of being sacred and not to be transgressed.", tip: "Complete with the term for being untouchable/sacred" },
  { sentence: "Legal ______ has evolved significantly since the Enlightenment.", correct: "jurisprudence", explanation: "<Jurisprudence> is the theory and philosophy of law.", tip: "Complete with the term for the philosophy of law" },
  { sentence: "Understanding the ______ of the disease is essential for developing effective treatments.", correct: "pathophysiology", explanation: "<Pathophysiology> studies the functional changes associated with disease.", tip: "Complete with the study of disease mechanisms" },
  { sentence: "Intellectual ______ between competing theories can yield unexpected insights.", correct: "arbitrage", explanation: "<Arbitrage> metaphorically means exploiting differences between frameworks productively.", tip: "Complete with the term for exploiting differences between systems" },
  { sentence: "The ______ of the argument reveals connections invisible at the surface level.", correct: "topology", explanation: "<Topology> metaphorically refers to the structural arrangement within a system of ideas.", tip: "Complete with the term for structural arrangement" },
  { sentence: "The ______ interdisciplinary expertise is rarely found in a single researcher.", correct: "requisite", explanation: "<Requisite> means necessary or required for a particular purpose.", tip: "Complete with the adjective meaning 'necessary'" },
  { sentence: "Hegel's ______ proceeds through thesis, antithesis, and synthesis.", correct: "dialectic", explanation: "The <dialectic> is a method of resolving opposing ideas through reasoned argument.", tip: "Complete with Hegel's method of reasoning" },
  { sentence: "Biblical ______ has a long tradition in Western scholarship.", correct: "hermeneutics", explanation: "<Hermeneutics> is the theory and methodology of interpretation.", tip: "Complete with the study of interpretation" },
  { sentence: "A ______ explanation accounts for phenomena by reference to their purpose.", correct: "teleological", explanation: "<Teleological> relates to explaining things by their purpose or end goals.", tip: "Complete with the adjective meaning 'purpose-based'" },
  { sentence: "Husserl's ______ seeks to describe experience as it presents itself to consciousness.", correct: "phenomenology", explanation: "<Phenomenology> studies the structures of subjective experience.", tip: "Complete with Husserl's philosophical method" },
  { sentence: "There remains a significant ______ gap in our understanding of consciousness.", correct: "epistemic", explanation: "<Epistemic> relates to knowledge and the conditions for its possibility.", tip: "Complete with the adjective relating to knowledge" }
];

// 5. C2 Matching: Reading Vocab
const c2MatchingReadingVocab = [
  { left: "aporia", right: "contradicción irresoluble", explanation: "An irresolvable internal contradiction in a text or argument" },
  { left: "palimpsest", right: "capas superpuestas de significado", explanation: "Something with multiple layers of meaning or history" },
  { left: "heteroglossia", right: "multiplicidad de voces en un texto", explanation: "The coexistence of multiple social languages within a text" },
  { left: "subaltern", right: "grupos marginados del poder", explanation: "Populations excluded from hegemonic power structures" },
  { left: "ekphrasis", right: "descripción literaria de arte visual", explanation: "Literary representation of a visual work of art" },
  { left: "ontology", right: "estudio del ser y la existencia", explanation: "The philosophical study of being and existence" },
  { left: "categorical imperative", right: "ley moral universal de Kant", explanation: "Kant's principle of acting according to universalizable rules" },
  { left: "qualia", right: "experiencias subjetivas de la conciencia", explanation: "The subjective, phenomenal qualities of conscious experience" },
  { left: "vicious circularity", right: "razonamiento circular vicioso", explanation: "When an argument's conclusion is assumed in its premises" },
  { left: "inviolability", right: "cualidad de ser sagrado e intocable", explanation: "The quality of being too important to be broken or violated" },
  { left: "jurisprudence", right: "teoría y filosofía del derecho", explanation: "The theoretical study of law and legal systems" },
  { left: "pathophysiology", right: "estudio de mecanismos de enfermedad", explanation: "The study of functional changes associated with disease" },
  { left: "arbitrage", right: "aprovechamiento de diferencias entre sistemas", explanation: "Exploiting differences between frameworks for new insights" },
  { left: "topology", right: "estructura y conexiones de un argumento", explanation: "The structural arrangement within a system of ideas" },
  { left: "requisite", right: "necesario / requerido", explanation: "Made necessary by particular circumstances; essential" },
  { left: "dialectic", right: "resolución de ideas opuestas", explanation: "Method of argument through thesis, antithesis, and synthesis" },
  { left: "hermeneutics", right: "teoría de la interpretación", explanation: "The theory and methodology of interpretation" },
  { left: "teleological", right: "relativo al propósito o finalidad", explanation: "Explaining phenomena by their purpose or design" },
  { left: "phenomenology", right: "estudio de la experiencia consciente", explanation: "The philosophical study of structures of experience" },
  { left: "epistemic", right: "relativo al conocimiento", explanation: "Pertaining to knowledge and its conditions" }
];

writeJSON(join(DATA_DIR, 'c2', 'c2-reading-phrasal-verbs-idioms.json'), c2ReadingPhrasalVerbsIdioms);
writeJSON(join(DATA_DIR, 'c2', 'c2-flashcard-reading-vocab.json'), c2FlashcardReadingVocab);
writeJSON(join(DATA_DIR, 'c2', 'c2-quiz-reading-vocab.json'), c2QuizReadingVocab);
writeJSON(join(DATA_DIR, 'c2', 'c2-completion-reading-vocab.json'), c2CompletionReadingVocab);
writeJSON(join(DATA_DIR, 'c2', 'c2-matching-reading-vocab.json'), c2MatchingReadingVocab);

console.log('--- C2: 5 files created ---\n');

// ============================================================
// UPDATE learningModules.json
// ============================================================

const modulesPath = join(DATA_DIR, 'learningModules.json');
const modules = JSON.parse(readFileSync(modulesPath, 'utf-8'));

// New modules to insert per level.
// Each level's new modules chain together, and the first one's prerequisite
// is the last module before the review. The review's prerequisite is updated
// to point to the last new module.

const newModules = {
  // ---- A1 (+5) ----
  // Chain: quiz-basic-idioms-a1 → reading-phrasal-verbs-a1 → reading-idioms-a1 → flashcard-daily-life-vocab-a1 → quiz-daily-life-vocab-a1 → completion-everyday-expressions-a1 → quiz-basic-review-a1
  a1: [
    { id: "reading-phrasal-verbs-a1", name: "Phrasal Verbs in Everyday Life", learningMode: "reading", dataPath: "data/a1/a1-reading-phrasal-verbs.json", level: ["a1"], category: "PhrasalVerbs", unit: 1, prerequisites: ["quiz-basic-idioms-a1"], description: "Learn basic phrasal verbs through everyday stories and examples", estimatedTime: 6, difficulty: 1 },
    { id: "reading-idioms-a1", name: "Common Idioms in Daily Life", learningMode: "reading", dataPath: "data/a1/a1-reading-idioms.json", level: ["a1"], category: "Idioms", unit: 1, prerequisites: ["reading-phrasal-verbs-a1"], description: "Discover common English idioms through simple stories", estimatedTime: 6, difficulty: 1 },
    { id: "flashcard-daily-life-vocab-a1", name: "Daily Life Vocabulary", learningMode: "flashcard", dataPath: "data/a1/a1-flashcard-daily-life-vocab.json", level: ["a1"], category: "Vocabulary", unit: 1, prerequisites: ["reading-idioms-a1"], description: "Essential daily routines and activities vocabulary (20 words)", estimatedTime: 5, difficulty: 1 },
    { id: "quiz-daily-life-vocab-a1", name: "Daily Life Vocabulary Quiz", learningMode: "quiz", dataPath: "data/a1/a1-quiz-daily-life-vocab.json", level: ["a1"], category: "Vocabulary", unit: 1, prerequisites: ["flashcard-daily-life-vocab-a1"], description: "Test your knowledge of daily life vocabulary", estimatedTime: 5, difficulty: 1 },
    { id: "completion-everyday-expressions-a1", name: "Everyday Expressions Practice", learningMode: "completion", dataPath: "data/a1/a1-completion-everyday-expressions.json", level: ["a1"], category: "Vocabulary", unit: 1, prerequisites: ["quiz-daily-life-vocab-a1"], description: "Complete sentences with everyday expressions, phrasal verbs and idioms", estimatedTime: 5, difficulty: 1 }
  ],
  // ---- A2 (+5) ----
  a2: [
    { id: "reading-phrasal-verbs-a2", name: "Phrasal Verbs in Daily Situations", learningMode: "reading", dataPath: "data/a2/a2-reading-phrasal-verbs.json", level: ["a2"], category: "PhrasalVerbs", unit: 2, prerequisites: ["quiz-elementary-idioms-a2"], description: "Learn phrasal verbs used in work, shopping and social situations", estimatedTime: 8, difficulty: 2 },
    { id: "reading-idioms-a2", name: "Idioms for Everyday Conversations", learningMode: "reading", dataPath: "data/a2/a2-reading-idioms.json", level: ["a2"], category: "Idioms", unit: 2, prerequisites: ["reading-phrasal-verbs-a2"], description: "Discover idioms about feelings, time and common situations", estimatedTime: 8, difficulty: 2 },
    { id: "flashcard-culture-health-vocab-a2", name: "Culture & Health Vocabulary", learningMode: "flashcard", dataPath: "data/a2/a2-flashcard-culture-health-vocab.json", level: ["a2"], category: "Vocabulary", unit: 2, prerequisites: ["reading-idioms-a2"], description: "Culture, health and technology vocabulary (20 words)", estimatedTime: 5, difficulty: 2 },
    { id: "quiz-culture-health-vocab-a2", name: "Culture & Health Quiz", learningMode: "quiz", dataPath: "data/a2/a2-quiz-culture-health-vocab.json", level: ["a2"], category: "Vocabulary", unit: 2, prerequisites: ["flashcard-culture-health-vocab-a2"], description: "Test your knowledge of culture, health and technology vocabulary", estimatedTime: 5, difficulty: 2 },
    { id: "completion-reading-vocab-a2", name: "Reading Vocabulary Practice", learningMode: "completion", dataPath: "data/a2/a2-completion-reading-vocab.json", level: ["a2"], category: "Vocabulary", unit: 2, prerequisites: ["quiz-culture-health-vocab-a2"], description: "Complete sentences reinforcing reading vocabulary", estimatedTime: 5, difficulty: 2 }
  ],
  // ---- B1 (+5) ----
  b1: [
    { id: "reading-phrasal-verbs-b1", name: "Phrasal Verbs in Professional Life", learningMode: "reading", dataPath: "data/b1/b1-reading-phrasal-verbs.json", level: ["b1"], category: "PhrasalVerbs", unit: 3, prerequisites: ["quiz-idioms-challenge-b1"], description: "Master phrasal verbs for professional and social contexts", estimatedTime: 10, difficulty: 3 },
    { id: "reading-idioms-b1", name: "Idioms in Work and Education", learningMode: "reading", dataPath: "data/b1/b1-reading-idioms.json", level: ["b1"], category: "Idioms", unit: 3, prerequisites: ["reading-phrasal-verbs-b1"], description: "Learn idioms for professional and educational settings", estimatedTime: 10, difficulty: 3 },
    { id: "flashcard-reading-vocab-b1", name: "Reading Vocabulary", learningMode: "flashcard", dataPath: "data/b1/b1-flashcard-reading-vocab.json", level: ["b1"], category: "Vocabulary", unit: 3, prerequisites: ["reading-idioms-b1"], description: "Education, environment and social media vocabulary (20 words)", estimatedTime: 5, difficulty: 3 },
    { id: "quiz-reading-vocab-b1", name: "Reading Vocabulary Quiz", learningMode: "quiz", dataPath: "data/b1/b1-quiz-reading-vocab.json", level: ["b1"], category: "Vocabulary", unit: 3, prerequisites: ["flashcard-reading-vocab-b1"], description: "Test your knowledge of intermediate reading vocabulary", estimatedTime: 5, difficulty: 3 },
    { id: "matching-reading-vocab-b1", name: "Reading Vocabulary Matching", learningMode: "matching", dataPath: "data/b1/b1-matching-reading-vocab.json", level: ["b1"], category: "Vocabulary", unit: 3, prerequisites: ["quiz-reading-vocab-b1"], description: "Match intermediate vocabulary with Spanish translations", estimatedTime: 5, difficulty: 3 }
  ],
  // ---- B2 (+3) ----
  b2: [
    { id: "reading-phrasal-verbs-b2", name: "Phrasal Verbs in Academic Discourse", learningMode: "reading", dataPath: "data/b2/b2-reading-phrasal-verbs.json", level: ["b2"], category: "PhrasalVerbs", unit: 4, prerequisites: ["quiz-phrasal-verbs-b2"], description: "Advanced phrasal verbs in professional and academic contexts", estimatedTime: 12, difficulty: 4 },
    { id: "reading-idioms-b2", name: "Idioms in Professional Contexts", learningMode: "reading", dataPath: "data/b2/b2-reading-idioms.json", level: ["b2"], category: "Idioms", unit: 4, prerequisites: ["reading-phrasal-verbs-b2"], description: "Business and global issue idioms for upper-intermediate learners", estimatedTime: 12, difficulty: 4 },
    { id: "flashcard-reading-vocab-b2", name: "Reading Vocabulary", learningMode: "flashcard", dataPath: "data/b2/b2-flashcard-reading-vocab.json", level: ["b2"], category: "Vocabulary", unit: 4, prerequisites: ["reading-idioms-b2"], description: "Professional, innovation and global issues vocabulary (20 words)", estimatedTime: 5, difficulty: 4 }
  ],
  // ---- C1 (+3) ----
  c1: [
    { id: "reading-phrasal-verbs-idioms-c1", name: "Phrasal Verbs & Idioms in Discourse", learningMode: "reading", dataPath: "data/c1/c1-reading-phrasal-verbs-idioms.json", level: ["c1"], category: "Reading", unit: 5, prerequisites: ["quiz-phrasal-verbs-c1"], description: "Sophisticated phrasal verbs and idioms in academic and professional discourse", estimatedTime: 15, difficulty: 5 },
    { id: "flashcard-reading-vocab-c1", name: "Reading Vocabulary", learningMode: "flashcard", dataPath: "data/c1/c1-flashcard-reading-vocab.json", level: ["c1"], category: "Vocabulary", unit: 5, prerequisites: ["reading-phrasal-verbs-idioms-c1"], description: "Advanced academic and scholarly vocabulary (20 words)", estimatedTime: 5, difficulty: 5 },
    { id: "quiz-reading-vocab-c1", name: "Reading Vocabulary Quiz", learningMode: "quiz", dataPath: "data/c1/c1-quiz-reading-vocab.json", level: ["c1"], category: "Vocabulary", unit: 5, prerequisites: ["flashcard-reading-vocab-c1"], description: "Test your knowledge of advanced academic vocabulary", estimatedTime: 5, difficulty: 5 }
  ],
  // ---- C2 (+5) ----
  c2: [
    { id: "reading-phrasal-verbs-idioms-c2", name: "Figurative Language in Scholarly Discourse", learningMode: "reading", dataPath: "data/c2/c2-reading-phrasal-verbs-idioms.json", level: ["c2"], category: "Reading", unit: 6, prerequisites: ["quiz-mastery-idioms-c2"], description: "Mastery-level phrasal verbs and idioms in philosophical and literary discourse", estimatedTime: 18, difficulty: 5 },
    { id: "flashcard-reading-vocab-c2", name: "Reading Vocabulary", learningMode: "flashcard", dataPath: "data/c2/c2-flashcard-reading-vocab.json", level: ["c2"], category: "Vocabulary", unit: 6, prerequisites: ["reading-phrasal-verbs-idioms-c2"], description: "Philosophical and literary vocabulary for near-native proficiency (20 words)", estimatedTime: 5, difficulty: 5 },
    { id: "quiz-reading-vocab-c2", name: "Reading Vocabulary Quiz", learningMode: "quiz", dataPath: "data/c2/c2-quiz-reading-vocab.json", level: ["c2"], category: "Vocabulary", unit: 6, prerequisites: ["flashcard-reading-vocab-c2"], description: "Test your knowledge of mastery-level vocabulary", estimatedTime: 5, difficulty: 5 },
    { id: "completion-reading-vocab-c2", name: "Reading Vocabulary Practice", learningMode: "completion", dataPath: "data/c2/c2-completion-reading-vocab.json", level: ["c2"], category: "Vocabulary", unit: 6, prerequisites: ["quiz-reading-vocab-c2"], description: "Complete sentences with advanced philosophical and literary terms", estimatedTime: 8, difficulty: 5 },
    { id: "matching-reading-vocab-c2", name: "Reading Vocabulary Matching", learningMode: "matching", dataPath: "data/c2/c2-matching-reading-vocab.json", level: ["c2"], category: "Vocabulary", unit: 6, prerequisites: ["completion-reading-vocab-c2"], description: "Match mastery-level vocabulary with Spanish translations", estimatedTime: 5, difficulty: 5 }
  ]
};

// Review module IDs per level — their prerequisite needs updating
const reviewModules = {
  a1: "quiz-basic-review-a1",
  a2: "quiz-elementary-review-a2",
  b1: "quiz-intermediate-review-b1",
  b2: "quiz-upper-intermediate-review-b2",
  c1: "quiz-advanced-grammar-review-c1",
  c2: "quiz-mastery-assessment-c2"
};

let totalInserted = 0;

for (const [level, newMods] of Object.entries(newModules)) {
  const reviewId = reviewModules[level];
  const reviewIdx = modules.findIndex(m => m.id === reviewId);
  
  if (reviewIdx === -1) {
    console.error(`❌ Review module not found: ${reviewId}`);
    continue;
  }

  // Insert new modules right before the review
  modules.splice(reviewIdx, 0, ...newMods);
  
  // Update review's prerequisite to point to last new module
  const lastNewId = newMods[newMods.length - 1].id;
  const updatedReviewIdx = modules.findIndex(m => m.id === reviewId);
  modules[updatedReviewIdx].prerequisites = [lastNewId];
  
  console.log(`✅ ${level.toUpperCase()}: Inserted ${newMods.length} modules before ${reviewId}, updated prerequisite → ${lastNewId}`);
  totalInserted += newMods.length;
}

writeJSON(modulesPath, modules);
console.log(`\n🎉 Total: ${totalInserted} new modules inserted. learningModules.json updated.`);
console.log(`📊 Total modules now: ${modules.length}`);
