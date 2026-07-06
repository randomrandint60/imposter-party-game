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
      { normal: "What is the best gift you have ever received from someone?", liar: "What is the most useless or weird purchase you have ever made?" },
      { normal: "What is your favorite way to commute or travel locally?", liar: "What is the most frustrating way to travel around a city?" },
      { normal: "What is a smell that always brings back good memories for you?", liar: "What is a smell that immediately makes you feel nauseous?" },
      { normal: "What is the most productive part of your daily routine?", liar: "What is the biggest distraction that stops you from getting work done?" },
      { normal: "If you could instantly master any language, which would it be?", liar: "What is a subject in school that you were terrible at?" },
      { normal: "What is a daily habit you have that improves your life?", liar: "What is a bad habit you are constantly trying to break?" }
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
      { normal: "What is the weirdest food combination that you actually enjoy?", liar: "What is a popular food combination that you think is disgusting?" },
      { normal: "If animals could talk, which species would be the rudest?", liar: "What animal do you think is completely useless in nature?" },
      { normal: "If you were arrested with no explanation, what would your friends assume you did?", liar: "What is the most boring, rule-abiding thing you do every day?" },
      { normal: "What is the silliest reason you've ever gotten mad at someone?", liar: "What is a completely valid reason to immediately stop talking to someone?" },
      { normal: "If you were a ghost, how would you mildly inconvenience people?", liar: "What is a minor inconvenience that completely ruins your day?" },
      { normal: "What is a ridiculous fashion trend you secretly wish would come back?", liar: "What is a popular fashion trend that you think looks absolutely ridiculous?" },
      { normal: "If your life was a sitcom, what would the catchy theme song be?", liar: "What is a song that immediately makes you want to leave the room?" }
    ]
  },
  popculture: {
    name: "Pop Culture & Media", icon: "🎬",
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
      { normal: "What is your favorite board game or card game to play with family?", liar: "What game always causes arguments when you play it with friends?" },
      { normal: "What movie can you quote almost entirely from memory?", liar: "What is a classic movie that you have never seen and don't care to?" },
      { normal: "What reality TV show is your guilty pleasure?", liar: "What is a reality TV concept that you think goes way too far?" },
      { normal: "Which fictional world from a book or movie would you want to live in?", liar: "Which fictional dystopian world would you never survive in?" },
      { normal: "What is the best TV show intro or theme song of all time?", liar: "What TV show has an intro you always skip because it's too long?" },
      { normal: "Who is the most iconic duo in film or television history?", liar: "What two actors do you think had zero on-screen chemistry?" }
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
      { normal: "What is the best hotel or campsite you've ever stayed at?", liar: "What was your worst lodging experience while traveling?" },
      { normal: "What is the most exotic or unusual place you have ever traveled to?", liar: "What is the most boring, mundane town or city you have ever driven through?" },
      { normal: "Do you prefer traveling with a detailed itinerary or being completely spontaneous?", liar: "What is a travel habit that annoys you when vacationing with others?" },
      { normal: "If you could instantly teleport to one place right now, where would it be?", liar: "What is a place you have visited that you swear you will never go back to?" },
      { normal: "What is your favorite mode of transportation for a long journey?", liar: "What is the most stressful part about navigating a busy airport?" },
      { normal: "What is a cultural festival or event around the world you'd love to attend?", liar: "What is a local event or fair that you think is completely overrated?" }
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
      { normal: "Would you want to upload your consciousness to a computer after death?", liar: "What is a popular digital trend that you find completely creepy?" },
      { normal: "If you had a time machine, what year in the future would you visit?", liar: "If you went back in time, what historical period would you absolutely hate?" },
      { normal: "What is a piece of technology you completely rely on but don't understand?", liar: "What is a complex piece of technology that you think is actually very simple?" },
      { normal: "If aliens visited Earth, what would be the first thing you'd show them?", liar: "What human behavior would be the hardest to explain to an alien?" },
      { normal: "Would you ever install a cybernetic implant to enhance your brain?", liar: "What is a physical trait you would never want to surgically alter?" },
      { normal: "If we made contact with aliens, what do you think their first message would be?", liar: "What is a sci-fi trope that you find incredibly annoying in movies?" }
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
      { normal: "What is a quality you value most in your closest friends?", liar: "What trait or behavior makes you immediately distrust someone?" },
      { normal: "What is a risk you took that completely changed the trajectory of your life?", liar: "What is a safe choice you made that you deeply regret now?" },
      { normal: "How do you think people will remember you after you're gone?", liar: "What is a false assumption people often make about you?" },
      { normal: "What is the most difficult decision you have ever had to make?", liar: "What is a trivial decision that always takes you way too long to make?" },
      { normal: "What is a belief or opinion you held strongly but recently changed?", liar: "What is a stubborn belief you will never let go of, no matter what?" },
      { normal: "What brings you the most genuine sense of peace and happiness?", liar: "What is something minor that consistently ruins your mood?" }
    ]
  },
  food: {
    name: "Food & Dining", icon: "🍔",
    pairs: [
      { normal: "What is your favorite comfort food on a cold winter night?", liar: "What is a popular comfort food that you think is extremely overrated?" },
      { normal: "If you could only eat at one restaurant forever, what would it be?", liar: "What is a restaurant chain you refuse to ever eat at again?" },
      { normal: "What is your favorite dessert to order after a big meal?", liar: "What is a dessert ingredient that ruins a dish for you?" },
      { normal: "What is the best homemade meal someone has ever cooked for you?", liar: "What is the worst kitchen disaster you have ever caused or witnessed?" },
      { normal: "If you had to choose a final meal, what would you request?", liar: "What is a food that you only eat because it is healthy, not because it tastes good?" },
      { normal: "What is your favorite international cuisine and why?", liar: "What is a popular exotic dish that you absolutely refuse to try?" },
      { normal: "What is the best street food you have ever eaten?", liar: "What is a fast food item that you think is completely gross?" },
      { normal: "If you could invent a new flavor of ice cream, what would it be?", liar: "What is the absolute worst ice cream flavor you can imagine?" },
      { normal: "What is a weird snack that you love but others might find strange?", liar: "What is a popular snack food that you can't stand the smell of?" },
      { normal: "What is your favorite thing to cook or bake from scratch?", liar: "What is a recipe or cooking technique you always manage to mess up?" },
      { normal: "What is your go-to order at a coffee shop or cafe?", liar: "What is a trendy cafe drink that you think is just overpriced sugar water?" }
    ]
  },
  sports: {
    name: "Sports & Hobbies", icon: "⚽",
    pairs: [
      { normal: "What is your favorite sport or game to play with friends?", liar: "What is a sport that you find incredibly boring to watch?" },
      { normal: "If you could instantly be a professional athlete in one sport, which one?", liar: "What is a physical activity you are notoriously terrible at?" },
      { normal: "What is a hobby you dedicate the most time to on weekends?", liar: "What is a hobby that you tried picking up but quit almost immediately?" },
      { normal: "What is the most thrilling or adventurous thing you've ever done?", liar: "What is an extreme sport you would never do, no matter how much you were paid?" },
      { normal: "Who is an athlete or competitor you greatly admire?", liar: "Who is a famous sports figure you think is completely arrogant?" },
      { normal: "What is your favorite team or club to support?", liar: "What is a team or franchise you actively root against?" },
      { normal: "What is a creative hobby you've always wanted to try?", liar: "What is a creative trend or craft that you think is a waste of time?" },
      { normal: "What is the best live sporting event you've ever been to?", liar: "What is an event you paid to see that ended up being a huge disappointment?" },
      { normal: "Do you prefer individual sports or team sports, and why?", liar: "What is a team activity that always frustrates you?" },
      { normal: "If you could win an Olympic gold medal, what event would it be in?", liar: "What Olympic event do you think shouldn't be considered a sport?" }
    ]
  }
};
