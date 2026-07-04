// ============================================================
//  Imposter Party Game — Questions Database (Find the Liar Mode)
//  Each pair has a Normal question and a slightly different Liar question.
// ============================================================

const IMPOSTER_QUESTIONS = {
  general: {
    name: "General & Lifestyle", icon: "💬",
    pairs: [
      { normal: "What is your favorite hot beverage to drink in the morning?", liar: "What is your favorite cold beverage to drink in the afternoon?" },
      { normal: "Where do you go when you want to relax and wind down?", liar: "Where do you go when you want to exercise or get active?" },
      { normal: "What is a hobby you would love to start if you had unlimited free time?", liar: "What is a chore or boring activity you absolutely hate doing?" },
      { normal: "What is your favorite season of the year and why?", liar: "What is the worst season of the year in your opinion?" },
      { normal: "What animal do you think would make the best pet to keep in a house?", liar: "What wild animal are you most afraid of encountering?" },
      { normal: "What is your favorite room in your house and why?", liar: "What is an area in your house that always needs cleaning or fixing?" },
      { normal: "What is your favorite musical instrument to listen to?", liar: "What is the most annoying or grating sound you can think of?" },
      { normal: "Where would you go on your absolute dream vacation?", liar: "What is the worst or most disappointing place you have ever traveled to?" },
      { normal: "What is your favorite day of the week and why?", liar: "What is the most stressful day of the week for you?" },
      { normal: "What is your favorite way to spend a rainy Sunday afternoon?", liar: "What is your favorite outdoor activity on a sunny summer day?" },
      { normal: "What is a book or movie that completely changed the way you think?", liar: "What is a popular trend or meme that you find completely stupid?" },
      { normal: "What is your favorite childhood memory?", liar: "What is a weird fear or phobia you have kept since childhood?" },
      { normal: "What is your favorite celebration or holiday of the year?", liar: "What holiday do you feel is the most commercialized and overrated?" },
      { normal: "What is your absolute favorite clothing item to wear?", liar: "What is the most uncomfortable outfit or accessory you own?" },
      { normal: "What is the best gift you have ever received from someone?", liar: "What is the most useless or weird purchase you have ever made?" }
    ]
  },
  funny: {
    name: "Funny & Absurd", icon: "🤪",
    pairs: [
      { normal: "If you could only eat one food for the rest of your life, what would it be?", liar: "What is a food that you would never eat, even if you were starving?" },
      { normal: "If you were a superhero, what ridiculous superpower would you want to have?", liar: "What is a completely useless talent or trick you can do?" },
      { normal: "What is the weirdest dream you can remember having recently?", liar: "What is a movie plot or story that makes absolutely no sense to you?" },
      { normal: "If you could talk to one species of animal, which one would it be?", liar: "What insect or creature do you wish was completely extinct?" },
      { normal: "If you won a million dollars, what is the first silly thing you would buy?", liar: "What is the most overpriced thing you've ever paid for?" },
      { normal: "What is a conspiracy theory that you secretly think might be true?", liar: "What is a common myth or lie that many people still believe?" },
      { normal: "If you could rename yourself to any object or word, what would it be?", liar: "What is a name or word you think sounds extremely ugly?" },
      { normal: "If you had to live inside a video game world, which one would you pick?", liar: "What is a place in a movie or game that you would absolutely hate to visit?" },
      { normal: "What is the most embarrassing thing that has happened to you in public?", liar: "What is a proud achievement of yours that other people might find silly?" },
      { normal: "If you could replace your hands with any object, what would it be?", liar: "What is a tool or kitchen gadget you find completely useless?" },
      { normal: "What would your dream house look like if money was no object?", liar: "What is the ugliest building or house style you've ever seen?" },
      { normal: "What is the weirdest food combination that you actually enjoy?", liar: "What is a popular food combination that you think is disgusting?" }
    ]
  },
  popculture: {
    name: "Pop Culture & Media", icon: "🎨",
    pairs: [
      { normal: "Who is your favorite actor or actress of all time?", liar: "Who is an actor or celebrity you find extremely annoying?" },
      { normal: "What is your favorite song to blast in the car with windows down?", liar: "What is a song that makes you want to cover your ears immediately?" },
      { normal: "Which movie character do you think you are most similar to?", liar: "Which villain or bad guy in a movie do you find the most relatable?" },
      { normal: "What is your favorite video game to play when you are bored?", liar: "What is a popular video game that you think is completely overrated?" },
      { normal: "What is the best concert or live performance you've ever attended?", liar: "What is a TV show or performance you fell asleep during?" },
      { normal: "Who is your favorite singer or band right now?", liar: "Who is a musical artist that you think is completely auto-tuned?" },
      { normal: "What is your favorite movie genre and why?", liar: "What genre of movies do you find the most boring or predictable?" },
      { normal: "What was your favorite cartoon to watch when you were a kid?", liar: "What cartoon or children's show did you find creepy as a kid?" },
      { normal: "Which celebrity would you love to have dinner with?", liar: "Which historical figure do you think was probably a jerk?" },
      { normal: "What is your favorite board game or card game to play with family?", liar: "What game always causes arguments when you play it with friends?" }
    ]
  },
  travel: {
    name: "Travel & Nature", icon: "🌍",
    pairs: [
      { normal: "What is the most beautiful natural place you have ever seen in person?", liar: "What is the dirtiest or most polluted place you have ever visited?" },
      { normal: "Would you prefer to live in a cozy cabin in the mountains or a beach house?", liar: "What type of environment would you find the most stressful to live in?" },
      { normal: "What is the longest road trip or flight you have ever taken?", liar: "What is a place nearby that you have absolutely no interest in visiting?" },
      { normal: "What is your favorite outdoor activity during a nice spring day?", liar: "What is a chore or yard work activity you hate doing in the summer?" },
      { normal: "Which country or city has the best food in your experience?", liar: "What is a place where you had a terrible food experience?" },
      { normal: "What is a landmark or monument you would love to visit in the future?", liar: "What tourist trap landmark did you visit that was super disappointing?" },
      { normal: "Would you rather explore a dense jungle or a vast sandy desert?", liar: "Where would you hate to get stranded without any supplies?" },
      { normal: "What is your favorite sea creature or underwater animal?", liar: "What creature in the ocean absolutely terrifies you?" },
      { normal: "What is the best hotel or campsite you've ever stayed at?", liar: "What was your worst lodging experience while traveling?" }
    ]
  },
  scifi: {
    name: "Sci-Fi & Tech", icon: "💻",
    pairs: [
      { normal: "What futuristic technology do you wish was invented already?", liar: "What current tech gadget do you think is a total waste of money?" },
      { normal: "If you could travel to any planet in the solar system, which one?", liar: "Which planet or space environment sounds the most hostile and terrifying?" },
      { normal: "Would you ever go on a one-way trip to colonize Mars?", liar: "What is a place on Earth you would never move to, even for a high-paying job?" },
      { normal: "What is the most useful app on your smartphone that you use daily?", liar: "What is the most addictive or time-wasting app on your phone?" },
      { normal: "If you could build a robot to do one task for you, what would it be?", liar: "What is a task you actually enjoy doing and would never let a robot do?" },
      { normal: "Do you think artificial intelligence will help humanity or destroy it?", liar: "What is a major problem in the world that technology cannot solve?" },
      { normal: "What sci-fi movie has the most realistic future in your opinion?", liar: "What movie has a future that you think is completely impossible?" },
      { normal: "Would you want to upload your consciousness to a computer after death?", liar: "What is a popular digital trend that you find completely creepy?" }
    ]
  },
  thoughts: {
    name: "Deep Thoughts", icon: "🧠",
    pairs: [
      { normal: "What is the most important lesson life has taught you so far?", liar: "What is a piece of advice people give that you think is terrible?" },
      { normal: "What does success look like to you in your personal life?", liar: "What is a superficial thing that society values too much?" },
      { normal: "What is a skill or language you wish you had learned years ago?", liar: "What is a class or subject you studied that was a complete waste of time?" },
      { normal: "What is something you do to clear your head when you are stressed?", liar: "What is a bad habit you do when you are anxious or bored?" },
      { normal: "What is the most selfless act you have witnessed someone do?", liar: "What is a selfish behavior that you see far too often in public?" },
      { normal: "What is a goal you hope to achieve within the next five years?", liar: "What is a goal you used to have but realized wasn't worth it?" },
      { normal: "What is a quality you value most in your closest friends?", liar: "What trait or behavior makes you immediately distrust someone?" }
    ]
  }
};
