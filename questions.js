// Questions database for Imposter Game - Find the Liar Mode
// Each pair has a Normal question and a slightly different Liar question.

const IMPOSTER_QUESTIONS = {
  general: {
    name: "General Questions",
    icon: "💬",
    pairs: [
      {
        normal: "What is your favorite hot beverage to drink in the morning?",
        liar: "What is your favorite cold beverage to drink in the afternoon?"
      },
      {
        normal: "Where do you go when you want to relax and wind down?",
        liar: "Where do you go when you want to exercise or get active?"
      },
      {
        normal: "What is a hobby you would love to start if you had unlimited free time?",
        liar: "What is a chore or boring activity you absolutely hate doing?"
      },
      {
        normal: "What is your favorite season of the year and why?",
        liar: "What is the worst season of the year in your opinion?"
      },
      {
        normal: "What animal do you think would make the best pet to keep in a house?",
        liar: "What wild animal are you most afraid of encountering?"
      },
      {
        normal: "What is your favorite room in your house and why?",
        liar: "What is a area in your house that always needs cleaning or fixing?"
      },
      {
        normal: "What is your favorite musical instrument to listen to?",
        liar: "What is the most annoying or grating sound you can think of?"
      },
      {
        normal: "Where would you go on your absolute dream vacation?",
        liar: "What is the worst or most disappointing place you have ever traveled to?"
      }
    ]
  },
  funny: {
    name: "Funny & Absurd",
    icon: "🤪",
    pairs: [
      {
        normal: "If you could only eat one food for the rest of your life, what would it be?",
        liar: "What is a food that you would never eat, even if you were starving?"
      },
      {
        normal: "What superpower would be the most useful for doing everyday household chores?",
        liar: "What superpower would be the most annoying or embarrassing to have in public?"
      },
      {
        normal: "What is something you believed as a child that seems totally ridiculous now?",
        liar: "What is a popular conspiracy theory or myth that you refuse to believe is false?"
      },
      {
        normal: "If you were a color, which one would you be and why?",
        liar: "What color do you think is the absolute ugliest and should be banned?"
      },
      {
        normal: "What would you do first if you won a 10-million-dollar lottery tomorrow?",
        liar: "What is the dumbest or most useless thing you have ever spent money on?"
      },
      {
        normal: "If you could talk to any species of animal, which one would you choose?",
        liar: "Which animal do you think has the most stuck-up or rude attitude?"
      },
      {
        normal: "What is your go-to karaoke song when you want to show off?",
        liar: "What song is so overplayed and annoying that it makes you want to cover your ears?"
      }
    ]
  },
  deep: {
    name: "Deep Thoughts",
    icon: "🧠",
    pairs: [
      {
        normal: "What does success mean to you in one simple sentence?",
        liar: "What is a common misconception or lie about what makes people happy?"
      },
      {
        normal: "If you could travel back in time, which historical era would you visit?",
        liar: "If you had to live in a futuristic sci-fi world, what job would you want?"
      },
      {
        normal: "What is a valuable life lesson you learned the hard way?",
        liar: "What is a piece of bad advice you were given that you completely ignored?"
      },
      {
        normal: "What personality trait do you value most in a close friend?",
        liar: "What is a behavior or trait that immediately makes you lose respect for someone?"
      },
      {
        normal: "What is a book, movie, or song that completely changed how you see the world?",
        liar: "What is a highly popular book, movie, or trend that you think is completely overrated?"
      },
      {
        normal: "What is something you are deeply grateful for in your life today?",
        liar: "What is a minor inconvenience or first-world problem that really ruins your mood?"
      }
    ]
  },
  party: {
    name: "Party & Social",
    icon: "🎉",
    pairs: [
      {
        normal: "What is your favorite party game or board game to play with friends?",
        liar: "What is a game that always ends in a heated argument or rage quit?"
      },
      {
        normal: "What is the best genre or style of music to play at a social gathering?",
        liar: "What kind of music makes you want to leave a party immediately?"
      },
      {
        normal: "Describe your ideal Friday night in one sentence.",
        liar: "Describe your worst nightmare social situation."
      },
      {
        normal: "What is your favorite snack to eat while watching a movie with a group?",
        liar: "What is the messiest or most awkward food to eat in front of people you just met?"
      },
      {
        normal: "What is a funny party trick or talent you wish you could perform?",
        liar: "What is a useless skill you possess that you would never show off at a party?"
      },
      {
        normal: "If you were hosting a theme party, what would the theme be?",
        liar: "What is the most uncomfortable dress code or outfit you have ever had to wear?"
      }
    ]
  }
};
