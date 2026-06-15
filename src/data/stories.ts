import type { PatternStory } from '../types';

export const patternStories: Record<string, PatternStory> = {
  strategy: {
    id: 'strategy',
    title: 'The Duck Simulator Disaster',
    subtitle: 'When inheritance goes horribly wrong',
    bookReference: 'Head First Design Patterns — Chapter 1: Strategy Pattern',
    characters: [
      { id: 'sim', name: 'SimUduck', role: 'Duck Simulator CEO', avatar: '🦆', color: '#7C4DFF' },
      { id: 'dev', name: 'Duck Developer', role: 'Frustrated Engineer', avatar: '👨‍💻', color: '#00E5FF' },
      { id: 'boss', name: 'The Boss', role: 'Product Manager', avatar: '👔', color: '#FFD740' },
    ],
    scenes: [
      {
        id: 's1', title: 'The Happy Pond', mood: 'neutral',
        lines: [
          { characterId: 'sim', text: 'Welcome to SimUduck — the number one duck simulation game on the market!' },
          { characterId: 'sim', text: 'Every duck quacks AND flies. Our inheritance hierarchy is beautiful!' },
          { characterId: 'dev', text: 'We put quack() and fly() in the Duck superclass. All subclasses inherit them. Clean and simple!' },
        ],
        visuals: [{ emoji: '🦆', label: 'Mallard Duck', position: 'left', animation: 'bounce' }, { emoji: '🦆', label: 'Redhead Duck', position: 'center', animation: 'bounce' }, { emoji: '🦆', label: 'Rubber Duck', position: 'right', animation: 'bounce' }],
      },
      {
        id: 's2', title: 'The Boss Strikes', mood: 'problem',
        lines: [
          { characterId: 'boss', text: 'Listen up! We need FLYING ducks in the next release. Add a fly() method to the Duck superclass. NOW.' },
          { characterId: 'dev', text: 'Easy enough... fly() goes in Duck, all subclasses inherit it. Ship it!' },
        ],
        visuals: [{ emoji: '👔', label: 'The Boss', position: 'center', animation: 'enter' }],
      },
      {
        id: 's3', title: 'Rubber Duck Can\'t Fly!', mood: 'conflict',
        lines: [
          { characterId: 'dev', text: 'Wait wait wait... Rubber Ducks don\'t fly! And Decoy Ducks don\'t fly OR quack!' },
          { characterId: 'dev', text: 'I\'m overriding fly() to do nothing... and quack() too... This inheritance hierarchy is a NIGHTMARE!' },
          { characterId: 'sim', text: 'Our entire codebase is breaking because we forced every duck to fly. What do we do?!' },
        ],
        visuals: [
          { emoji: '🦆', label: 'Rubber Duck', position: 'left', animation: 'shake' },
          { emoji: '💥', label: 'fly() CRASH!', position: 'center', animation: 'glow' },
          { emoji: '🎯', label: 'Decoy Duck', position: 'right', animation: 'shake' },
        ],
        insight: 'Inheritance forces ALL subclasses to carry behavior they don\'t need. This is fragile and violates encapsulation.',
        insightCharacterId: 'sim',
      },
      {
        id: 's4', title: 'The Strategy Rescue', mood: 'insight',
        lines: [
          { characterId: 'sim', text: 'I have an idea! Pull flying and quacking OUT of Duck and into separate behavior classes!' },
          { characterId: 'sim', text: 'Duck HAS-A flyBehavior and quackBehavior. We can swap them at RUNTIME!' },
          { characterId: 'dev', text: 'Mallard gets FlyWithWings, Rubber gets FlyNoWay... No more overriding! Composition over inheritance!' },
        ],
        visuals: [
          { emoji: '🦆', label: 'Duck', position: 'center', animation: 'glow' },
          { emoji: '✈️', label: 'FlyBehavior', position: 'left', animation: 'enter' },
          { emoji: '🔊', label: 'QuackBehavior', position: 'right', animation: 'enter' },
        ],
        insight: 'Strategy Pattern: Define a family of algorithms, encapsulate each one, and make them interchangeable.',
        insightCharacterId: 'dev',
      },
      {
        id: 's5', title: 'Happy Ducks Again', mood: 'solution',
        lines: [
          { characterId: 'dev', text: 'Mallard uses FlyWithWings, Rubber uses FlyNoWay, Decoy uses FlyNoWay plus MuteQuack!' },
          { characterId: 'sim', text: 'We can add new fly behaviors without touching Duck at all. SimUduck is saved!' },
        ],
        visuals: [
          { emoji: '🦆', label: 'Mallard ✈️🔊', position: 'left', animation: 'bounce' },
          { emoji: '🦆', label: 'Rubber 🚫✈️', position: 'center', animation: 'bounce' },
          { emoji: '🎯', label: 'Decoy 🚫🚫', position: 'right', animation: 'bounce' },
        ],
        quiz: {
          question: 'What design principle does Strategy follow?',
          options: ['Inherit behavior from parent', 'Encapsulate what varies', 'Use global variables', 'Make everything static'],
          correctIndex: 1,
          explanation: 'Head First teaches: "Encapsulate what varies." Flying behavior varies — so pull it out into Strategy classes.',
        },
      },
      {
        id: 's6', title: 'The Moral', mood: 'celebration',
        lines: [
          { characterId: 'sim', text: 'We learned something huge today — never let your superclass dictate behavior that subclasses must override!' },
          { characterId: 'dev', text: 'Use composition over inheritance. Strategy pattern for the win!' },
        ],
        visuals: [{ emoji: '🎉', label: 'SimUduck Saved!', position: 'center', animation: 'glow' }],
      },
    ],
    moral: 'When you see the same behavior duplicated across classes, or subclasses forced to override parent methods with empty implementations — reach for Strategy.',
  },

  observer: {
    id: 'observer',
    title: 'The Weather Station Broadcast',
    subtitle: 'One update, many listeners',
    bookReference: 'Head First Design Patterns — Chapter 2: Observer Pattern',
    characters: [
      { id: 'station', name: 'WeatherData', role: 'Weather Station', avatar: '🌡️', color: '#FF5252' },
      { id: 'display1', name: 'CurrentDisplay', role: 'Current Conditions Board', avatar: '📺', color: '#00E5FF' },
      { id: 'display2', name: 'StatsDisplay', role: 'Statistics Panel', avatar: '📊', color: '#00E676' },
    ],
    scenes: [
      {
        id: 's1', title: 'The Polling Problem', mood: 'problem',
        lines: [
          { characterId: 'station', text: 'I measure temperature, humidity, and pressure constantly. Three displays need my data...' },
          { characterId: 'station', text: 'But every display keeps calling getTemperature() every second! So much wasted CPU!' },
          { characterId: 'display1', text: 'Hey WeatherData, anything new? Anything new? Anything new? ...This polling is killing me.' },
        ],
        visuals: [{ emoji: '🌡️', label: 'Weather Station', position: 'center', animation: 'glow' }],
        insight: 'Polling is inefficient — displays constantly ask "anything new?" even when nothing changed.',
        insightCharacterId: 'display2',
      },
      {
        id: 's2', title: 'Push, Don\'t Pull', mood: 'insight',
        lines: [
          { characterId: 'station', text: 'New plan — I will NOTIFY you when my measurements change. You SUBSCRIBE to me!' },
          { characterId: 'station', text: 'When my data changes, I call notifyObservers(). You update automatically!' },
          { characterId: 'display1', text: 'So I register once with registerObserver() and you push updates to me? Brilliant!' },
        ],
        visuals: [
          { emoji: '🌡️', label: 'Subject', position: 'center', animation: 'glow' },
          { emoji: '📺', label: 'Observer 1', position: 'left', animation: 'enter' },
          { emoji: '📊', label: 'Observer 2', position: 'right', animation: 'enter' },
        ],
      },
      {
        id: 's3', title: 'New Measurement!', mood: 'solution',
        lines: [
          { characterId: 'station', text: 'Temperature just hit 82°F! Pushing update to all observers NOW!' },
          { characterId: 'display1', text: 'Got it! Refreshing current conditions board — 82°F displayed!' },
          { characterId: 'display2', text: 'Me too! Updating statistics panel with the new reading!' },
        ],
        visuals: [
          { emoji: '🌡️', label: '82°F', position: 'center', animation: 'flow' },
          { emoji: '📺', label: 'Updated!', position: 'left', animation: 'bounce' },
          { emoji: '📊', label: 'Updated!', position: 'right', animation: 'bounce' },
        ],
        insight: 'Observer defines a one-to-many dependency: when one object changes state, all dependents are notified automatically.',
        insightCharacterId: 'station',
      },
      {
        id: 's4', title: 'Loose Coupling Wins', mood: 'celebration',
        lines: [
          { characterId: 'display2', text: 'Want a new ForecastDisplay? Just implement Observer and subscribe. WeatherData doesn\'t change at all!' },
          { characterId: 'station', text: 'I don\'t even know what type of display you are — I just call update() on the Observer interface!' },
        ],
        visuals: [{ emoji: '🌤️', label: 'ForecastDisplay', position: 'center', animation: 'enter' }],
        quiz: {
          question: 'What is the key benefit of Observer?',
          options: ['Tight coupling between objects', 'Loose coupling — subjects and observers interact through an interface', 'Only one observer allowed', 'Observers must poll for data'],
          correctIndex: 1,
          explanation: 'Observer achieves loose coupling: the subject only knows observers implement the Observer interface.',
        },
      },
    ],
    moral: 'When a change to one object requires changing others, and you don\'t know how many objects need to change — use Observer.',
  },

  decorator: {
    id: 'decorator',
    title: 'Starbuzz Coffee Crisis',
    subtitle: 'The inheritance explosion at the coffee shop',
    bookReference: 'Head First Design Patterns — Chapter 3: Decorator Pattern',
    characters: [
      { id: 'ceo', name: 'Starbuzz CEO', role: 'Coffee Shop Owner', avatar: '☕', color: '#8B4513' },
      { id: 'dev', name: 'Barista Dev', role: 'Menu System Developer', avatar: '👨‍💻', color: '#00E5FF' },
    ],
    scenes: [
      {
        id: 's1', title: 'The Menu Explosion', mood: 'problem',
        lines: [
          { characterId: 'ceo', text: 'Starbuzz sells coffee with milk, mocha, whip, and soy — in every combination imaginable.' },
          { characterId: 'ceo', text: 'We have 20 drink types now. Add a new condiment and we need 20 MORE classes!' },
          { characterId: 'dev', text: 'DarkRoastWithMilkAndMochaAndWhip... this inheritance tree is INSANE. I can\'t maintain this!' },
        ],
        visuals: [
          { emoji: '☕', label: 'DarkRoast', position: 'left' },
          { emoji: '☕🥛', label: 'DarkRoast+Milk', position: 'center' },
          { emoji: '☕🥛🍫', label: 'DarkRoast+Milk+Mocha', position: 'right' },
        ],
        insight: 'Inheritance doesn\'t scale for combinations. Every new condiment multiplies the number of classes.',
        insightCharacterId: 'dev',
      },
      {
        id: 's2', title: 'Wrap, Don\'t Extend', mood: 'insight',
        lines: [
          { characterId: 'dev', text: 'What if we start with a base Beverage, then WRAP it with condiment decorators?' },
          { characterId: 'dev', text: 'Mocha is a Beverage that wraps another Beverage. cost() equals wrapped.cost() plus 0.20!' },
          { characterId: 'ceo', text: 'So each topping is a wrapper, not a subclass? Show me!' },
        ],
        visuals: [
          { emoji: '☕', label: 'DarkRoast ($0.99)', position: 'center', animation: 'glow' },
          { emoji: '🥛', label: '+ Milk ($0.10)', position: 'left', animation: 'enter' },
          { emoji: '🍫', label: '+ Mocha ($0.20)', position: 'right', animation: 'enter' },
        ],
      },
      {
        id: 's3', title: 'Stacking Decorators', mood: 'solution',
        lines: [
          { characterId: 'ceo', text: 'Customer orders Dark Roast plus Mocha plus Whip. Three wrappers stacked!' },
          { characterId: 'dev', text: 'Total cost flows through the chain — each decorator adds its price. Same object, unlimited toppings!' },
        ],
        visuals: [
          { emoji: '🍦', label: 'Whip (+$0.10)', position: 'center', animation: 'bounce' },
          { emoji: '🍫', label: 'Mocha (+$0.20)', position: 'center', animation: 'bounce' },
          { emoji: '☕', label: 'Dark Roast ($0.99)', position: 'center', animation: 'glow' },
        ],
        insight: 'Decorator lets you wrap objects with new behavior dynamically. Same object, unlimited toppings.',
        insightCharacterId: 'dev',
      },
      {
        id: 's4', title: 'Open for Condiments', mood: 'celebration',
        lines: [
          { characterId: 'dev', text: 'New condiment? One new Decorator class. Zero changes to existing code!' },
          { characterId: 'ceo', text: 'Starbuzz is saved! Open for extension, closed for modification!' },
        ],
        visuals: [{ emoji: '🎉', label: 'Starbuzz Menu: Infinite Combos!', position: 'center', animation: 'glow' }],
        quiz: {
          question: 'Decorator is an alternative to what?',
          options: ['Singleton pattern', 'Subclassing for extending behavior', 'Database normalization', 'Using interfaces'],
          correctIndex: 1,
          explanation: 'Decorator provides a flexible alternative to subclassing for extending functionality.',
        },
      },
    ],
    moral: 'When you need to add responsibilities to objects dynamically and transparently, without affecting other objects — decorate them.',
  },

  factory: {
    id: 'factory',
    title: 'The Pizza Franchise Wars',
    subtitle: 'NY style vs Chicago style — who makes the pizza?',
    bookReference: 'Head First Design Patterns — Chapter 4: Factory Method Pattern',
    characters: [
      { id: 'fran', name: 'Joel', role: 'Pizza Franchise Owner', avatar: '🍕', color: '#FF5252' },
      { id: 'ny', name: 'NY Store', role: 'Thin Crust Specialists', avatar: '🗽', color: '#7C4DFF' },
      { id: 'chi', name: 'Chicago Store', role: 'Deep Dish Specialists', avatar: '🌆', color: '#00E5FF' },
    ],
    scenes: [
      {
        id: 's1', title: 'One Pizza Class?', mood: 'problem',
        narrator: 'Joel wants to franchise his pizza stores. But NY makes thin crust and Chicago makes deep dish. One Pizza class can\'t do both...',
        visuals: [{ emoji: '🍕', label: 'if (style === "NY") ... else ...', position: 'center', animation: 'shake' }],
        dialogue: [{ characterId: 'fran', text: 'Every new city means more if/else in orderPizza(). This is unmaintainable!' }],
      },
      {
        id: 's2', title: 'Let Subclasses Decide', mood: 'insight',
        narrator: 'Solution: create an abstract createPizza() method. Each store subclass decides which pizza to instantiate!',
        visuals: [
          { emoji: '🗽', label: 'NYPizzaStore', position: 'left', animation: 'enter' },
          { emoji: '🍕', label: 'createPizza()', position: 'center', animation: 'glow' },
          { emoji: '🌆', label: 'ChicagoPizzaStore', position: 'right', animation: 'enter' },
        ],
        dialogue: [{ characterId: 'ny', text: 'My createPizza() returns NYStyleCheesePizza. Joel\'s code never changes!' }],
        insight: 'Factory Method: define an interface for creating objects, but let subclasses decide which class to instantiate.',
      },
      {
        id: 's3', title: 'Franchise Success', mood: 'celebration',
        narrator: 'California wants veggie pizza? Just create CaliforniaPizzaStore. The orderPizza() flow stays identical everywhere.',
        visuals: [{ emoji: '🌴', label: 'CaliforniaPizzaStore', position: 'center', animation: 'bounce' }],
        quiz: {
          question: 'Who decides which pizza object to create?',
          options: ['The customer', 'The abstract PizzaStore superclass', 'The concrete store subclass', 'A global factory function'],
          correctIndex: 2,
          explanation: 'In Factory Method, subclasses override the factory method to produce the right product type.',
        },
      },
    ],
    moral: 'When a class can\'t anticipate the class of objects it must create, let subclasses handle instantiation via a factory method.',
  },

  singleton: {
    id: 'singleton',
    title: 'The Chocolate Factory Meltdown',
    subtitle: 'One factory, one instance, one disaster waiting to happen',
    bookReference: 'Head First Design Patterns — Chapter 5: Singleton Pattern',
    characters: [
      { id: 'choco', name: 'Choc-O-Holic', role: 'Chocolate Factory', avatar: '🍫', color: '#8B4513' },
      { id: 'dev', name: 'Factory Engineer', role: 'System Architect', avatar: '👨‍💻', color: '#00E5FF' },
    ],
    scenes: [
      {
        id: 's1', title: 'Two Factories?!', mood: 'conflict',
        narrator: 'The chocolate factory MUST have only one instance — it controls 500 chocolate boilers! But two instances were accidentally created...',
        visuals: [
          { emoji: '🍫', label: 'Factory #1', position: 'left', animation: 'shake' },
          { emoji: '🍫', label: 'Factory #2', position: 'right', animation: 'shake' },
          { emoji: '💥', label: 'BOILER OVERFLOW!', position: 'center', animation: 'glow' },
        ],
        dialogue: [{ characterId: 'dev', text: 'new ChocolateBoiler() was called twice! We need to GUARANTEE only one instance exists.' }],
      },
      {
        id: 's2', title: 'Private Constructor', mood: 'insight',
        narrator: 'Make the constructor private. Provide a static getInstance() that returns the ONE instance. Problem solved!',
        visuals: [{ emoji: '🔒', label: 'private constructor', position: 'left' }, { emoji: '🍫', label: 'getInstance()', position: 'right', animation: 'glow' }],
        insight: 'Singleton ensures a class has only one instance and provides a global point of access.',
      },
      {
        id: 's3', title: 'One Factory to Rule Them All', mood: 'solution',
        narrator: 'Now every call to getInstance() returns the same ChocolateBoiler. Boilers are safe. Chocolate flows.',
        visuals: [{ emoji: '🍫', label: 'Single Instance', position: 'center', animation: 'glow' }],
        quiz: {
          question: 'When should you use Singleton?',
          options: ['For every class', 'When exactly one instance is needed to coordinate actions', 'When you need many instances', 'Never — it\'s always bad'],
          correctIndex: 1,
          explanation: 'Use Singleton when exactly one instance is needed (config managers, connection pools, loggers).',
        },
      },
    ],
    moral: 'Use Singleton sparingly — only when you truly need one instance. Be aware it can make testing harder.',
  },

  command: {
    id: 'command',
    title: 'The Universal Remote Control',
    subtitle: 'Buttons, slots, and the magic of undo',
    bookReference: 'Head First Design Patterns — Chapter 6: Command Pattern',
    characters: [
      { id: 'remote', name: 'Universal Remote', role: '7-Slot Remote', avatar: '📱', color: '#7C4DFF' },
      { id: 'light', name: 'Living Room Light', role: 'Receiver', avatar: '💡', color: '#FFD740' },
      { id: 'fan', name: 'Ceiling Fan', role: 'Receiver', avatar: '🌀', color: '#00E5FF' },
    ],
    scenes: [
      {
        id: 's1', title: 'Hardwired Buttons', mood: 'problem',
        narrator: 'The remote has 7 slots. Hardwiring each button to a specific device makes it impossible to reconfigure or undo...',
        visuals: [{ emoji: '📱', label: 'Remote → Light ON (hardcoded)', position: 'center', animation: 'shake' }],
        dialogue: [{ characterId: 'remote', text: 'Slot 1 always turns on the light. What if the user wants the fan instead?' }],
      },
      {
        id: 's2', title: 'Commands as Objects', mood: 'insight',
        narrator: 'Encapsulate each action as a Command object with execute() and undo(). The remote just calls command.execute()!',
        visuals: [
          { emoji: '📱', label: 'Remote (Invoker)', position: 'left' },
          { emoji: '📋', label: 'LightOnCommand', position: 'center', animation: 'glow' },
          { emoji: '💡', label: 'Light (Receiver)', position: 'right' },
        ],
        insight: 'Command turns a request into a stand-alone object. You can parameterize, queue, log, and undo requests.',
      },
      {
        id: 's3', title: 'Undo Magic', mood: 'solution',
        narrator: 'Press ON → light turns on. Press UNDO → LightOnCommand.undo() → light turns off. Pure magic!',
        visuals: [
          { emoji: '💡', label: 'ON', position: 'left', animation: 'glow' },
          { emoji: '↩️', label: 'UNDO', position: 'center', animation: 'bounce' },
          { emoji: '💡', label: 'OFF', position: 'right' },
        ],
        quiz: {
          question: 'What three roles exist in Command pattern?',
          options: ['Factory, Product, Client', 'Invoker, Command, Receiver', 'Subject, Observer, Mediator', 'Proxy, RealSubject, Client'],
          correctIndex: 1,
          explanation: 'Invoker triggers commands, Command encapsulates the request, Receiver does the actual work.',
        },
      },
    ],
    moral: 'When you need to parameterize objects with operations, queue requests, or support undo — use Command.',
  },

  adapter: {
    id: 'adapter',
    title: 'The Turkey Pretending to be a Duck',
    subtitle: 'When interfaces just don\'t match',
    bookReference: 'Head First Design Patterns — Chapter 7: Adapter Pattern',
    characters: [
      { id: 'duck', name: 'Duck', role: 'Expected Interface', avatar: '🦆', color: '#7C4DFF' },
      { id: 'turkey', name: 'Wild Turkey', role: 'Incompatible Class', avatar: '🦃', color: '#FF5252' },
      { id: 'adapter', name: 'TurkeyAdapter', role: 'The Translator', avatar: '🔄', color: '#00E5FF' },
    ],
    scenes: [
      {
        id: 's1', title: 'Ducks Only!', mood: 'problem',
        narrator: 'Your duck simulation only works with Duck objects (quack + fly). But a Wild Turkey was donated — it gobbles and flies differently!',
        visuals: [{ emoji: '🦃', label: 'Turkey (gobble, fly)', position: 'center', animation: 'shake' }],
        dialogue: [{ characterId: 'duck', text: 'I need quack() and fly(). Turkey has gobble() and fly(). They\'re INCOMPATIBLE!' }],
      },
      {
        id: 's2', title: 'The Adapter Cloak', mood: 'insight',
        narrator: 'Wrap the Turkey in a TurkeyAdapter that implements Duck. quack() calls gobble(), fly() delegates to turkey.fly()!',
        visuals: [
          { emoji: '🦃', label: 'Turkey', position: 'left' },
          { emoji: '🔄', label: 'TurkeyAdapter', position: 'center', animation: 'glow' },
          { emoji: '🦆', label: 'Duck interface', position: 'right' },
        ],
        insight: 'Adapter converts the interface of a class into another interface clients expect.',
      },
      {
        id: 's3', title: 'Turkey Quacks!', mood: 'celebration',
        narrator: 'The simulation calls duck.quack() on the adapter. The turkey gobbles. Nobody knows the difference!',
        visuals: [{ emoji: '🦆', label: 'Looks like a Duck!', position: 'center', animation: 'bounce' }],
        quiz: {
          question: 'Adapter is most useful when...',
          options: ['Creating new objects from scratch', 'Integrating code that can\'t be modified with incompatible interfaces', 'Adding features dynamically', 'Ensuring one instance'],
          correctIndex: 1,
          explanation: 'Adapter bridges incompatible interfaces — especially with legacy or third-party code.',
        },
      },
    ],
    moral: 'When you need to use an existing class but its interface doesn\'t match what you need — wrap it with an Adapter.',
  },

  facade: {
    id: 'facade',
    title: 'Home Theater Simplified',
    subtitle: 'One button to rule them all',
    bookReference: 'Head First Design Patterns — Chapter 7: Facade Pattern',
    characters: [
      { id: 'user', name: 'Movie Fan', role: 'Tired User', avatar: '😩', color: '#FFD740' },
      { id: 'facade', name: 'HomeTheaterFacade', role: 'The Simplifier', avatar: '🎬', color: '#7C4DFF' },
    ],
    scenes: [
      {
        id: 's1', title: '16 Steps to Watch a Movie', mood: 'problem',
        narrator: 'To watch a movie: turn on projector, screen, receiver, DVD, set input, set volume, set surround... 16 steps every time!',
        visuals: [
          { emoji: '📽️', label: 'Projector', position: 'left' },
          { emoji: '🔊', label: 'Amp', position: 'center' },
          { emoji: '💿', label: 'DVD', position: 'right' },
        ],
        dialogue: [{ characterId: 'user', text: 'I just want to watch Star Wars! Why do I need an engineering degree?!' }],
      },
      {
        id: 's2', title: 'watchMovie()', mood: 'solution',
        narrator: 'HomeTheaterFacade.watchMovie() does ALL 16 steps internally. One call. Done.',
        visuals: [{ emoji: '🎬', label: 'watchMovie("Star Wars")', position: 'center', animation: 'glow' }],
        insight: 'Facade provides a unified interface to a set of interfaces in a subsystem. It defines a higher-level entry point.',
      },
      {
        id: 's3', title: 'Popcorn Time', mood: 'celebration',
        narrator: 'One button press. Lights dim. Movie plays. The Facade hides all complexity behind a simple interface.',
        visuals: [{ emoji: '🍿', label: 'Movie Night!', position: 'center', animation: 'bounce' }],
      },
    ],
    moral: 'When a subsystem has many parts and you want a simple entry point — create a Facade.',
  },

  state: {
    id: 'state',
    title: 'The Gumball Machine Saga',
    subtitle: 'When behavior depends on internal state',
    bookReference: 'Head First Design Patterns — Chapter 10: State Pattern',
    characters: [
      { id: 'machine', name: 'Gumball Machine', role: 'Context', avatar: '🎰', color: '#FF5252' },
      { id: 'ceo', name: 'CEO', role: 'Demanding Boss', avatar: '👔', color: '#FFD740' },
    ],
    scenes: [
      {
        id: 's1', title: 'if/else Nightmare', mood: 'problem',
        narrator: 'The gumball machine has 4 states: NoQuarter, HasQuarter, Sold, SoldOut. Every action needs a giant if/else on current state...',
        visuals: [{ emoji: '🎰', label: 'state = ???', position: 'center', animation: 'shake' }],
        dialogue: [{ characterId: 'ceo', text: 'Add a "winner" state where 10% of sales dispense TWO gumballs. Good luck with those if statements!' }],
      },
      {
        id: 's2', title: 'State Objects', mood: 'insight',
        narrator: 'Create a State class for each state. The machine delegates behavior to the current State object. State transitions change the current state.',
        visuals: [
          { emoji: '🪙', label: 'NoQuarterState', position: 'left', animation: 'enter' },
          { emoji: '✅', label: 'HasQuarterState', position: 'center', animation: 'enter' },
          { emoji: '🍬', label: 'SoldState', position: 'right', animation: 'enter' },
        ],
        insight: 'State allows an object to alter its behavior when its internal state changes — it appears to change its class.',
      },
      {
        id: 's3', title: 'Clean Transitions', mood: 'solution',
        narrator: 'Insert quarter → NoQuarter becomes HasQuarter. Turn crank → dispense gumball → back to NoQuarter. Each state handles its own logic!',
        visuals: [{ emoji: '🍬', label: 'Gumball dispensed!', position: 'center', animation: 'bounce' }],
        quiz: {
          question: 'State vs Strategy — what\'s the difference?',
          options: ['They are identical', 'State: object transitions itself; Strategy: client chooses algorithm', 'State is for creation; Strategy is for structure', 'No difference in practice'],
          correctIndex: 1,
          explanation: 'In State, the context transitions between states. In Strategy, the client selects which strategy to use.',
        },
      },
    ],
    moral: 'When an object\'s behavior depends on its state and it must change behavior at runtime — use State.',
  },

  'chain-of-responsibility': {
    id: 'chain-of-responsibility',
    title: 'The Support Ticket Journey',
    subtitle: 'Pass it along until someone can help',
    bookReference: 'Gang of Four — Chain of Responsibility Pattern',
    characters: [
      { id: 'user', name: 'Frustrated User', role: 'Customer', avatar: '😤', color: '#FF5252' },
      { id: 'l1', name: 'Level 1 Agent', role: 'Frontline Support', avatar: '👤', color: '#00E5FF' },
      { id: 'mgr', name: 'Manager', role: 'Escalation Handler', avatar: '👔', color: '#7C4DFF' },
    ],
    scenes: [
      {
        id: 's1', title: 'Ticket Arrives', mood: 'neutral',
        narrator: 'A support ticket enters the system. Level 1 Agent tries to resolve it...',
        visuals: [{ emoji: '🎫', label: 'Support Ticket', position: 'center', animation: 'flow' }],
      },
      {
        id: 's2', title: 'Can\'t Resolve — Escalate', mood: 'problem',
        narrator: 'Level 1 can\'t fix it. The ticket moves to Level 2, then Manager, then Director — each handler gets a chance.',
        visuals: [
          { emoji: '👤', label: 'L1 ❌', position: 'left' },
          { emoji: '🧑‍💻', label: 'L2 ❌', position: 'center' },
          { emoji: '👔', label: 'Manager ✅', position: 'right', animation: 'glow' },
        ],
        insight: 'Chain of Responsibility decouples senders from receivers by giving multiple objects a chance to handle the request.',
      },
      {
        id: 's3', title: 'Resolved!', mood: 'celebration',
        narrator: 'The Manager resolves the ticket. The chain worked — no single handler needed to know about all others.',
        visuals: [{ emoji: '✅', label: 'Ticket Resolved', position: 'center', animation: 'bounce' }],
      },
    ],
    moral: 'When you want to give more than one object a chance to handle a request — chain them together.',
  },

  srp: {
    id: 'srp',
    title: 'The Overworked UserService',
    subtitle: 'A Head First approach to Single Responsibility',
    bookReference: 'SOLID Principles — Robert C. Martin',
    characters: [
      { id: 'dev', name: 'Junior Dev', role: 'Eager Programmer', avatar: '👨‍💻', color: '#00E5FF' },
      { id: 'senior', name: 'Senior Architect', role: 'Mentor', avatar: '🧑‍🏫', color: '#7C4DFF' },
    ],
    scenes: [
      {
        id: 's1', title: 'The Swiss Army Class', mood: 'problem',
        lines: [
          { characterId: 'dev', text: 'I built UserService with sendEmail, saveUser, generateReport, and createPDF — all in ONE class. Efficient, right?' },
          { characterId: 'senior', text: 'Hold on. Let me explain the three problems you just created: Tightly Coupled, Hard to Maintain, and Hard to Test.' },
        ],
        visuals: [{ emoji: '📦', label: 'UserService (HUGE)', position: 'center', animation: 'shake' }],
      },
      {
        id: 's2', title: 'What is Tightly Coupled?', mood: 'conflict',
        lines: [
          { characterId: 'senior', text: 'Tightly Coupled means everything is glued together. Change the email code and you might break PDF generation — because they share the same class and variables!' },
          { characterId: 'dev', text: 'So when I fixed the email template, reports started exporting blank pages? That was coupling!' },
          { characterId: 'senior', text: 'Exactly. Like one person being chef, cashier, AND cleaner — get sick and the whole restaurant shuts down.' },
        ],
        visuals: [{ emoji: '🔗', label: 'All methods connected', position: 'center', animation: 'shake' }],
        insight: 'Tightly Coupled: parts cannot change independently because they share the same code, data, and dependencies.',
        insightCharacterId: 'senior',
      },
      {
        id: 's3', title: 'What is Difficult to Maintain?', mood: 'problem',
        lines: [
          { characterId: 'senior', text: 'Difficult to Maintain means every small fix is scary. The class is 400 lines mixing SQL, SMTP, CSV, and PDF logic. New devs must read ALL of it to change ANYTHING.' },
          { characterId: 'dev', text: 'Product asked for SMS notifications. I copy-pasted sendEmail as sendSMS in the same class. Now it is even worse!' },
          { characterId: 'senior', text: 'That is the junk drawer problem — every new feature makes the mess harder for everyone.' },
        ],
        visuals: [{ emoji: '🗄️', label: 'Junk drawer class', position: 'center', animation: 'glow' }],
        insight: 'Difficult to Maintain: no clear boundaries between features, so every change risks breaking unrelated code.',
        insightCharacterId: 'senior',
      },
      {
        id: 's4', title: 'What is Hard to Test?', mood: 'problem',
        lines: [
          { characterId: 'senior', text: 'Hard to Test means you cannot check ONE feature without setting up ALL the others. To test saveUser you must mock email servers and PDF libraries too!' },
          { characterId: 'dev', text: 'Our CI pipeline sent 500 real emails during a PDF test last week. Because createPDF and sendEmail live in the same class!' },
          { characterId: 'senior', text: 'Like testing a car horn by starting the whole engine and driving on a highway. You wanted 2 seconds, got 30 minutes.' },
        ],
        visuals: [{ emoji: '🧪', label: 'Tests trigger emails!', position: 'center', animation: 'shake' }],
        insight: 'Hard to Test: one class with many responsibilities forces you to mock everything just to test one small behavior.',
        insightCharacterId: 'senior',
      },
      {
        id: 's5', title: 'The Great Split', mood: 'solution',
        lines: [
          { characterId: 'senior', text: 'Split into UserService, EmailService, ReportService, PdfService. Each class has ONE job. Change email without touching PDF!' },
          { characterId: 'dev', text: 'Now I can test saveUser with just a fake database. No emails, no PDFs. This is so much cleaner!' },
        ],
        visuals: [
          { emoji: '👤', label: 'UserService', position: 'left', animation: 'enter' },
          { emoji: '📧', label: 'EmailService', position: 'center', animation: 'enter' },
          { emoji: '📊', label: 'ReportService', position: 'right', animation: 'enter' },
        ],
        quiz: {
          question: 'Why was UserService hard to test?',
          options: ['It was written in TypeScript', 'Many responsibilities in one class forced mocking everything', 'It had too few methods', 'Tests are always hard'],
          correctIndex: 1,
          explanation: 'When one class does email + DB + reports + PDF, testing any single part requires setting up mocks for all the others.',
        },
      },
    ],
    moral: 'If you find yourself saying "And my class also does X" — it\'s time to split.',
  },
};

export const systemDesignStories: Record<string, PatternStory> = {
  tinyurl: {
    id: 'tinyurl',
    title: 'Sara\'s Link Sharing Nightmare',
    subtitle: 'Designing a URL Shortener like TinyURL',
    bookReference: 'System Design Interview — URL Shortening Service',
    characters: [
      { id: 'sara', name: 'Sara', role: 'Conference Speaker', avatar: '👩‍💼', color: '#7C4DFF' },
      { id: 'arch', name: 'System Architect', role: 'Design Guide', avatar: '🏗️', color: '#00E5FF' },
    ],
    scenes: [
      {
        id: 's1', title: 'The Long URL Problem', mood: 'problem',
        narrator: 'Sara is speaking at a tech conference. She wants to share a link, but it\'s 200 characters long. Nobody can type it from a slide!',
        visuals: [{ emoji: '🔗', label: 'https://very-long-url.com/...', position: 'center', animation: 'shake' }],
        dialogue: [{ characterId: 'sara', text: 'I need something like tinyurl.com/abc123 — short, memorable, shareable!' }],
      },
      {
        id: 's2', title: 'Requirements Gathering', mood: 'neutral',
        narrator: 'Functional: create short URL, redirect to original, optional expiry. Non-functional: low latency, highly available, scalable.',
        visuals: [
          { emoji: '📝', label: 'Requirements', position: 'left' },
          { emoji: '⚡', label: '< 100ms redirect', position: 'center' },
          { emoji: '📈', label: '100M URLs/day', position: 'right' },
        ],
      },
      {
        id: 's3', title: 'Capacity Estimation', mood: 'insight',
        narrator: '100M new URLs/day = ~1,200 writes/sec. 100:1 read/write ratio = 120K reads/sec. 5 years of storage = 180 billion URLs!',
        visuals: [{ emoji: '🧮', label: '1,200 writes/sec', position: 'left' }, { emoji: '📖', label: '120K reads/sec', position: 'right' }],
        insight: 'Always estimate traffic, storage, and bandwidth before designing. Numbers drive architecture decisions.',
      },
      {
        id: 's4', title: 'The Encoding Algorithm', mood: 'insight',
        narrator: 'Use Base62 encoding (a-z, A-Z, 0-9) on a unique ID. 7 characters = 62^7 = 3.5 trillion unique URLs!',
        visuals: [
          { emoji: '🔢', label: 'Unique ID: 12345', position: 'left', animation: 'flow' },
          { emoji: '🔄', label: 'Base62 Encode', position: 'center', animation: 'glow' },
          { emoji: '🔗', label: 'tiny.url/3D7', position: 'right', animation: 'bounce' },
        ],
        dialogue: [{ characterId: 'arch', text: 'Key Generation Service pre-generates IDs offline to avoid collisions!' }],
      },
      {
        id: 's5', title: 'The Full Architecture', mood: 'solution',
        narrator: 'Client → Load Balancer → API Servers → Cache (Redis) → Database (sharded). Cache handles 80% of reads!',
        visuals: [
          { emoji: '🖥️', label: 'Client', position: 'left' },
          { emoji: '⚖️', label: 'Load Balancer', position: 'center' },
          { emoji: '⚡', label: 'Cache', position: 'right', animation: 'glow' },
        ],
        insight: 'Cache-Aside pattern: check cache first, on miss read DB and populate cache. Critical for read-heavy systems.',
      },
      {
        id: 's6', title: 'Sara Shares Her Link', mood: 'celebration',
        narrator: 'Sara creates tiny.url/xK9mQ2. The audience types it easily. Redirect happens in 50ms. Standing ovation!',
        visuals: [{ emoji: '🎉', label: 'Link Shared!', position: 'center', animation: 'bounce' }],
        quiz: {
          question: 'Why use a Key Generation Service instead of hashing?',
          options: ['Hashing is faster', 'Hashing can cause collisions; KGS guarantees unique keys', 'KGS uses less memory', 'Hashing is more secure'],
          correctIndex: 1,
          explanation: 'Hashing long URLs can produce collisions. A KGS pre-generates unique IDs, guaranteeing no duplicates.',
        },
      },
    ],
    moral: 'URL shorteners teach encoding, caching, database sharding, and read-heavy system design — foundational system design skills.',
  },

  pastebin: {
    id: 'pastebin',
    title: 'The Developer\'s Code Snippet',
    subtitle: 'Designing Pastebin for text sharing',
    bookReference: 'System Design Interview — Pastebin',
    characters: [
      { id: 'dev', name: 'Alex', role: 'Backend Developer', avatar: '👨‍💻', color: '#00E5FF' },
      { id: 'arch', name: 'Architect', role: 'System Designer', avatar: '🏗️', color: '#7C4DFF' },
    ],
    scenes: [
      {
        id: 's1', title: 'Sharing Code on IRC', mood: 'problem',
        narrator: 'Alex wants to share a 500-line code snippet in a chat. Pasting it directly breaks formatting and floods the channel.',
        visuals: [{ emoji: '💬', label: 'IRC Chat (flooded)', position: 'center', animation: 'shake' }],
        dialogue: [{ characterId: 'dev', text: 'I need pastebin.com/abc — paste text, get a link, share the link!' }],
      },
      {
        id: 's2', title: 'Two-Layer Storage', mood: 'insight',
        narrator: 'Metadata (URL, expiry, size) goes in a database. The actual text content goes in Object Storage (S3) — they have different access patterns!',
        visuals: [
          { emoji: '🗄️', label: 'Metadata DB', position: 'left' },
          { emoji: '📦', label: 'Object Store (S3)', position: 'right', animation: 'glow' },
        ],
        insight: 'Separate hot metadata from cold blob storage. DB for fast lookups, object store for large text content.',
      },
      {
        id: 's3', title: 'APIs and Cleanup', mood: 'solution',
        narrator: 'POST /api/v1/pastes creates a paste. GET /api/v1/pastes/{key} retrieves it. A cleanup cron deletes expired pastes.',
        visuals: [
          { emoji: '📤', label: 'POST → Create', position: 'left', animation: 'flow' },
          { emoji: '📥', label: 'GET → Retrieve', position: 'right', animation: 'flow' },
        ],
      },
      {
        id: 's4', title: 'Alex Shares Code', mood: 'celebration',
        narrator: 'Alex pastes code, gets pastebin.com/xYz9. Shares in IRC. Teammates click and see perfectly formatted code. Done!',
        visuals: [{ emoji: '✅', label: 'Code Shared!', position: 'center', animation: 'bounce' }],
      },
    ],
    moral: 'Pastebin teaches blob storage vs metadata DB, API design, data expiration, and content delivery patterns.',
  },
};

export function getStoryForPattern(patternId: string): PatternStory | undefined {
  return patternStories[patternId];
}

export function getSystemDesignStory(id: string): PatternStory | undefined {
  return systemDesignStories[id];
}

export function getAllStoryIds(): string[] {
  return [...Object.keys(patternStories), ...Object.keys(systemDesignStories)];
}
