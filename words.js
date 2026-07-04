// Words database for Imposter Game - Classic Mode
// Each pair has a Civilian word and a slightly similar Undercover word.

const IMPOSTER_WORDS = {
  food: {
    name: "Food & Drinks",
    icon: "🍔",
    pairs: [
      { civilian: "Pizza", undercover: "Burger" },
      { civilian: "Coffee", undercover: "Tea" },
      { civilian: "Sushi", undercover: "Sashimi" },
      { civilian: "Beer", undercover: "Wine" },
      { civilian: "Chocolate", undercover: "Ice Cream" },
      { civilian: "Onion", undercover: "Garlic" },
      { civilian: "Coca-Cola", undercover: "Pepsi" },
      { civilian: "Butter", undercover: "Margarine" },
      { civilian: "Lemon", undercover: "Lime" },
      { civilian: "Milk", undercover: "Yogurt" },
      { civilian: "Donut", undercover: "Croissant" },
      { civilian: "Hot Dog", undercover: "Sausage" },
      { civilian: "Pancake", undercover: "Waffle" },
      { civilian: "Apple", undercover: "Pear" },
      { civilian: "Pasta", undercover: "Rice" }
    ]
  },
  animals: {
    name: "Animals & Nature",
    icon: "🦁",
    pairs: [
      { civilian: "Lion", undercover: "Tiger" },
      { civilian: "Dog", undercover: "Cat" },
      { civilian: "Dolphin", undercover: "Whale" },
      { civilian: "Eagle", undercover: "Falcon" },
      { civilian: "Crocodile", undercover: "Alligator" },
      { civilian: "Bee", undercover: "Wasp" },
      { civilian: "Shark", undercover: "Whale Shark" },
      { civilian: "Horse", undercover: "Donkey" },
      { civilian: "Wolf", undercover: "Fox" },
      { civilian: "Bear", undercover: "Grizzly Bear" },
      { civilian: "Tree", undercover: "Shrub" },
      { civilian: "River", undercover: "Lake" },
      { civilian: "Mountain", undercover: "Hill" },
      { civilian: "Rain", undercover: "Snow" },
      { civilian: "Rose", undercover: "Tulip" }
    ]
  },
  travel: {
    name: "Travel & Places",
    icon: "✈️",
    pairs: [
      { civilian: "Paris", undercover: "London" },
      { civilian: "Tokyo", undercover: "Seoul" },
      { civilian: "New York", undercover: "Los Angeles" },
      { civilian: "Beach", undercover: "Pool" },
      { civilian: "Hotel", undercover: "Hostel" },
      { civilian: "Airplane", undercover: "Helicopter" },
      { civilian: "Train", undercover: "Subway" },
      { civilian: "Ship", undercover: "Yacht" },
      { civilian: "Suitcase", undercover: "Backpack" },
      { civilian: "Map", undercover: "Compass" },
      { civilian: "Castle", undercover: "Palace" },
      { civilian: "Museum", undercover: "Gallery" },
      { civilian: "Desert", undercover: "Savanna" },
      { civilian: "Forest", undercover: "Jungle" },
      { civilian: "Mountain", undercover: "Volcano" }
    ]
  },
  movies: {
    name: "Movies & TV",
    icon: "🎬",
    pairs: [
      { civilian: "Cinema", undercover: "Theatre" },
      { civilian: "Batman", undercover: "Spider-Man" },
      { civilian: "Harry Potter", undercover: "Percy Jackson" },
      { civilian: "Star Wars", undercover: "Star Trek" },
      { civilian: "Anime", undercover: "Cartoon" },
      { civilian: "Horror", undercover: "Thriller" },
      { civilian: "Comedy", undercover: "Drama" },
      { civilian: "Popcorn", undercover: "Nachos" },
      { civilian: "Actor", undercover: "Director" },
      { civilian: "Hollywood", undercover: "Bollywood" },
      { civilian: "Oscar", undercover: "Emmy" },
      { civilian: "Netflix", undercover: "Disney+" },
      { civilian: "Iron Man", undercover: "Captain America" },
      { civilian: "James Bond", undercover: "Ethan Hunt" },
      { civilian: "Vampire", undercover: "Werewolf" }
    ]
  },
  gaming: {
    name: "Gaming & Geek",
    icon: "🎮",
    pairs: [
      { civilian: "PlayStation", undercover: "Xbox" },
      { civilian: "Minecraft", undercover: "Roblox" },
      { civilian: "Chess", undercover: "Checkers" },
      { civilian: "Pokemon", undercover: "Digimon" },
      { civilian: "Keyboard", undercover: "Mouse" },
      { civilian: "Controller", undercover: "Joystick" },
      { civilian: "VR Headset", undercover: "AR Glasses" },
      { civilian: "Mario", undercover: "Sonic" },
      { civilian: "Dragon", undercover: "Griffin" },
      { civilian: "Sword", undercover: "Shield" },
      { civilian: "Spell", undercover: "Potion" },
      { civilian: "Robot", undercover: "Cyborg" },
      { civilian: "Alien", undercover: "Predator" },
      { civilian: "Dungeons & Dragons", undercover: "Pathfinder" },
      { civilian: "Fortnite", undercover: "PUBG" }
    ]
  },
  sports: {
    name: "Sports & Hobbies",
    icon: "🏆",
    pairs: [
      { civilian: "Football", undercover: "Rugby" },
      { civilian: "Tennis", undercover: "Badminton" },
      { civilian: "Running", undercover: "Walking" },
      { civilian: "Swimming", undercover: "Diving" },
      { civilian: "Gym", undercover: "Yoga" },
      { civilian: "Guitar", undercover: "Piano" },
      { civilian: "Painting", undercover: "Drawing" },
      { civilian: "Photography", undercover: "Videography" },
      { civilian: "Chess", undercover: "Go" },
      { civilian: "Reading", undercover: "Writing" },
      { civilian: "Skiing", undercover: "Snowboarding" },
      { civilian: "Bicycle", undercover: "Scooter" },
      { civilian: "Camping", undercover: "Hiking" },
      { civilian: "Fishing", undercover: "Hunting" },
      { civilian: "Surfboard", undercover: "Skateboard" }
    ]
  },
  objects: {
    name: "Everyday Objects",
    icon: "🛋️",
    pairs: [
      { civilian: "Mirror", undercover: "Window" },
      { civilian: "Sofa", undercover: "Armchair" },
      { civilian: "Pillow", undercover: "Blanket" },
      { civilian: "Mug", undercover: "Cup" },
      { civilian: "Key", undercover: "Lock" },
      { civilian: "Clock", undercover: "Watch" },
      { civilian: "Pen", undercover: "Pencil" },
      { civilian: "Book", undercover: "Notebook" },
      { civilian: "Candle", undercover: "Lamp" },
      { civilian: "Umbrella", undercover: "Raincoat" },
      { civilian: "Wallet", undercover: "Purse" },
      { civilian: "Soap", undercover: "Shampoo" },
      { civilian: "Toothbrush", undercover: "Floss" },
      { civilian: "Spoon", undercover: "Fork" },
      { civilian: "Scissors", undercover: "Knife" }
    ]
  },
  occupations: {
    name: "Occupations",
    icon: "💼",
    pairs: [
      { civilian: "Doctor", undercover: "Nurse" },
      { civilian: "Teacher", undercover: "Professor" },
      { civilian: "Police", undercover: "Firefighter" },
      { civilian: "Chef", undercover: "Baker" },
      { civilian: "Pilot", undercover: "Astronaut" },
      { civilian: "Artist", undercover: "Designer" },
      { civilian: "Lawyer", undercover: "Judge" },
      { civilian: "Writer", undercover: "Journalist" },
      { civilian: "Actor", undercover: "Singer" },
      { civilian: "Farmer", undercover: "Gardener" },
      { civilian: "Builder", undercover: "Architect" },
      { civilian: "Soldier", undercover: "Sailor" },
      { civilian: "Waiter", undercover: "Bartender" },
      { civilian: "Barber", undercover: "Hairdresser" },
      { civilian: "Scientist", undercover: "Engineer" }
    ]
  },
  popculture: {
    name: "Pop Culture",
    icon: "🦸",
    pairs: [
      { civilian: "Superman", undercover: "Spider-Man" },
      { civilian: "Barbie", undercover: "Ken" },
      { civilian: "Mickey Mouse", undercover: "Donald Duck" },
      { civilian: "Sherlock Holmes", undercover: "Watson" },
      { civilian: "Pikachu", undercover: "Eevee" },
      { civilian: "Taylor Swift", undercover: "Beyoncé" },
      { civilian: "Elon Musk", undercover: "Jeff Bezos" },
      { civilian: "Santa Claus", undercover: "Easter Bunny" },
      { civilian: "Dracula", undercover: "Frankenstein" },
      { civilian: "Hercules", undercover: "Achilles" },
      { civilian: "Yoda", undercover: "Darth Vader" },
      { civilian: "Gandalf", undercover: "Dumbledore" },
      { civilian: "Shrek", undercover: "Donkey" },
      { civilian: "Simba", undercover: "Mufasa" },
      { civilian: "Peter Pan", undercover: "Robin Hood" }
    ]
  },
  tech: {
    name: "Tech & Brands",
    icon: "💻",
    pairs: [
      { civilian: "Apple", undercover: "Samsung" },
      { civilian: "Google", undercover: "Yahoo" },
      { civilian: "Facebook", undercover: "Instagram" },
      { civilian: "YouTube", undercover: "TikTok" },
      { civilian: "Zoom", undercover: "Skype" },
      { civilian: "Windows", undercover: "macOS" },
      { civilian: "Android", undercover: "iOS" },
      { civilian: "Laptop", undercover: "Desktop" },
      { civilian: "Wifi", undercover: "Bluetooth" },
      { civilian: "Email", undercover: "Chat" },
      { civilian: "Amazon", undercover: "eBay" },
      { civilian: "Tesla", undercover: "Porsche" },
      { civilian: "Spotify", undercover: "Apple Music" },
      { civilian: "Uber", undercover: "Lyft" },
      { civilian: "Bitcoin", undercover: "Ethereum" }
    ]
  },
  history: {
    name: "History & Myth",
    icon: "🏛️",
    pairs: [
      { civilian: "Zeus", undercover: "Jupiter" },
      { civilian: "Thor", undercover: "Odin" },
      { civilian: "Mummy", undercover: "Zombie" },
      { civilian: "Gladiator", undercover: "Knight" },
      { civilian: "Pirate", undercover: "Viking" },
      { civilian: "Pyramids", undercover: "Sphinx" },
      { civilian: "Colosseum", undercover: "Pantheon" },
      { civilian: "Cleopatra", undercover: "Nefertiti" },
      { civilian: "Julius Caesar", undercover: "Augustus" },
      { civilian: "Atlantis", undercover: "El Dorado" },
      { civilian: "Pegasus", undercover: "Unicorn" },
      { civilian: "Pharaoh", undercover: "Emperor" },
      { civilian: "Samurai", undercover: "Ninja" },
      { civilian: "Medusa", undercover: "Siren" },
      { civilian: "Ghost", undercover: "Phantom" }
    ]
  },
  science: {
    name: "Science & School",
    icon: "🔬",
    pairs: [
      { civilian: "Physics", undercover: "Chemistry" },
      { civilian: "Math", undercover: "Geometry" },
      { civilian: "Astronomy", undercover: "Astrology" },
      { civilian: "Atom", undercover: "Molecule" },
      { civilian: "Telescope", undercover: "Microscope" },
      { civilian: "Calculator", undercover: "Ruler" },
      { civilian: "Library", undercover: "Classroom" },
      { civilian: "Homework", undercover: "Exam" },
      { civilian: "Backpack", undercover: "Pencil Case" },
      { civilian: "Blackboard", undercover: "Whiteboard" },
      { civilian: "Mars", undercover: "Venus" },
      { civilian: "Sun", undercover: "Moon" },
      { civilian: "Gravity", undercover: "Magnetism" },
      { civilian: "Water", undercover: "Ice" },
      { civilian: "Dinosaur", undercover: "Fossil" }
    ]
  }
};
