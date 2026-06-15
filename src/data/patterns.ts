import type { PatternDetail, PatternItem } from '../types';

export const dashboardSections: PatternItem[] = [
  { id: 'system-design', name: 'System Design Academy', category: 'architecture', difficulty: 'advanced', useCases: ['Scalability', 'CAP Theorem', 'TinyURL', 'Uber'], description: 'Become a strong architect — concepts, design problems, capacity math, and decision lab', icon: '🎓' },
  { id: 'solid', name: 'SOLID Principles', category: 'solid', difficulty: 'beginner', useCases: ['Clean Code', 'Maintainability', 'Testability'], description: 'Master the five foundational principles of object-oriented design', icon: '🏛️' },
  { id: 'creational', name: 'Creational Patterns', category: 'creational', difficulty: 'beginner', useCases: ['Object Creation', 'Flexibility', 'Encapsulation'], description: 'Learn how objects are created in flexible and reusable ways', icon: '🏭' },
  { id: 'structural', name: 'Structural Patterns', category: 'structural', difficulty: 'intermediate', useCases: ['Composition', 'Adapters', 'Wrappers'], description: 'Understand how classes and objects are composed into larger structures', icon: '🏗️' },
  { id: 'behavioral', name: 'Behavioral Patterns', category: 'behavioral', difficulty: 'intermediate', useCases: ['Communication', 'Algorithms', 'Responsibility'], description: 'Explore patterns for object interaction and responsibility distribution', icon: '🔄' },
  { id: 'architecture', name: 'Architecture Playground', category: 'architecture', difficulty: 'advanced', useCases: ['System Design', 'Microservices', 'Scalability'], description: 'Build and visualize system architectures interactively', icon: '🌐' },
  { id: 'quiz', name: 'Design Pattern Quiz', category: 'quiz', difficulty: 'intermediate', useCases: ['Assessment', 'Practice', 'Certification'], description: 'Test your knowledge with interactive quizzes at every level', icon: '📝' },
  { id: 'comparison', name: 'Pattern Comparison Lab', category: 'comparison', difficulty: 'intermediate', useCases: ['Decision Making', 'Trade-offs', 'Analysis'], description: 'Compare similar patterns side-by-side to choose the right one', icon: '⚖️' },
  { id: 'case-studies', name: 'Real World Case Studies', category: 'case-studies', difficulty: 'advanced', useCases: ['TinyURL', 'Pastebin', 'Instagram', 'Netflix'], description: 'Study system design through narrated stories and architecture diagrams', icon: '🌍' },
];

export const creationalPatterns: PatternDetail[] = [
  {
    id: 'singleton',
    name: 'Singleton',
    category: 'creational',
    difficulty: 'beginner',
    description: 'Ensures a class has only one instance and provides global access.',
    purpose: 'Control object creation to guarantee a single instance exists.',
    useCases: ['Database Connection Pool', 'Logger', 'Configuration Manager'],
    steps: [
      { title: 'Request Instance', description: 'Client calls getInstance()' },
      { title: 'Check Existing', description: 'Singleton checks if instance already exists' },
      { title: 'Create or Return', description: 'Creates new instance or returns existing one' },
      { title: 'Global Access', description: 'Same instance returned to all callers' },
    ],
    realWorld: ['Spring ApplicationContext', 'Java Runtime', 'Redux Store'],
    simulationType: 'generic',
    code: {
      good: `class DatabaseConnection {
  private static instance: DatabaseConnection;
  private constructor() {}
  static getInstance(): DatabaseConnection {
    if (!this.instance) this.instance = new DatabaseConnection();
    return this.instance;
  }
}`,
    },
  },
  {
    id: 'factory',
    name: 'Factory',
    category: 'creational',
    difficulty: 'beginner',
    description: 'Creates objects without specifying the exact class to instantiate.',
    purpose: 'Delegate object creation to a factory method based on input.',
    useCases: ['Notification Systems', 'Payment Providers', 'Vehicle Manufacturing'],
    steps: [
      { title: 'Request Sent', description: 'Client requests a product type (Car, Bike, Truck)' },
      { title: 'Factory Decides', description: 'Factory examines the request type' },
      { title: 'Object Created', description: 'Appropriate class is instantiated' },
      { title: 'Object Returned', description: 'Client receives the product via common interface' },
    ],
    realWorld: ['Notification Systems', 'Payment Providers', 'Vehicle Manufacturing'],
    simulationType: 'factory',
    code: {
      bad: `const car = new Car();
const bike = new Bike();
// Client knows all concrete classes`,
      good: `interface Vehicle { drive(): void; }
class VehicleFactory {
  create(type: string): Vehicle {
    switch(type) {
      case 'car': return new Car();
      case 'bike': return new Bike();
      case 'truck': return new Truck();
    }
  }
}`,
    },
  },
  {
    id: 'abstract-factory',
    name: 'Abstract Factory',
    category: 'creational',
    difficulty: 'intermediate',
    description: 'Creates families of related objects without specifying concrete classes.',
    purpose: 'Produce groups of related products that work together.',
    useCases: ['UI Theme Kits', 'Cross-Platform Widgets', 'Database Families'],
    steps: [
      { title: 'Select Factory', description: 'Choose DarkTheme or LightTheme factory' },
      { title: 'Create Family', description: 'Factory produces matching Button, Input, Modal' },
      { title: 'Consistent Products', description: 'All products share the same theme/style' },
      { title: 'Client Uses', description: 'Client works with products via abstract interfaces' },
    ],
    realWorld: ['Material UI Themes', 'Flutter Widget Sets', 'AWS SDK Families'],
    simulationType: 'generic',
    code: {
      good: `interface UIFactory {
  createButton(): Button;
  createInput(): Input;
}
class DarkThemeFactory implements UIFactory {
  createButton() { return new DarkButton(); }
  createInput() { return new DarkInput(); }
}`,
    },
  },
  {
    id: 'builder',
    name: 'Builder',
    category: 'creational',
    difficulty: 'intermediate',
    description: 'Constructs complex objects step by step with a fluent API.',
    purpose: 'Separate construction from representation for complex objects.',
    useCases: ['SQL Query Builder', 'HTTP Request Builder', 'Pizza Ordering'],
    steps: [
      { title: 'Create Builder', description: 'Instantiate builder for target object' },
      { title: 'Set Properties', description: 'Chain method calls to configure object' },
      { title: 'Validate', description: 'Builder validates required fields' },
      { title: 'Build', description: 'Final immutable object is constructed' },
    ],
    realWorld: ['StringBuilder', 'React.createElement', 'Lombok @Builder'],
    simulationType: 'generic',
    code: {
      good: `class PizzaBuilder {
  private size = 'medium';
  private toppings: string[] = [];
  setSize(s: string) { this.size = s; return this; }
  addTopping(t: string) { this.toppings.push(t); return this; }
  build(): Pizza { return new Pizza(this.size, this.toppings); }
}`,
    },
  },
  {
    id: 'prototype',
    name: 'Prototype',
    category: 'creational',
    difficulty: 'intermediate',
    description: 'Creates new objects by cloning an existing instance.',
    purpose: 'Copy existing objects without depending on their classes.',
    useCases: ['Document Templates', 'Game Entity Cloning', 'Configuration Copies'],
    steps: [
      { title: 'Select Prototype', description: 'Choose an existing object to clone' },
      { title: 'Clone', description: 'Deep or shallow copy is performed' },
      { title: 'Customize', description: 'Modify specific properties on the clone' },
      { title: 'Use Clone', description: 'Independent object ready for use' },
    ],
    realWorld: ['JavaScript Object.assign', 'Git Branching', 'Figma Component Instances'],
    simulationType: 'generic',
    code: {
      good: `interface Prototype { clone(): Prototype; }
class Document implements Prototype {
  constructor(public title: string, public content: string) {}
  clone(): Document {
    return new Document(this.title, this.content);
  }
}`,
    },
  },
];

export const structuralPatterns: PatternDetail[] = [
  {
    id: 'adapter',
    name: 'Adapter',
    category: 'structural',
    difficulty: 'beginner',
    description: 'Allows incompatible interfaces to work together.',
    purpose: 'Convert one interface to another that clients expect.',
    useCases: ['Legacy System Integration', 'Third-party API Wrappers', 'Data Format Conversion'],
    steps: [
      { title: 'Old API Request', description: 'Client sends request in new format' },
      { title: 'Adapter Converts', description: 'Adapter translates to old API format' },
      { title: 'Old API Responds', description: 'Legacy system processes the request' },
      { title: 'Response Converted', description: 'Adapter translates response back to new format' },
    ],
    realWorld: ['USB-C to HDMI Adapters', 'REST to GraphQL Adapters', 'Power Outlet Adapters'],
    simulationType: 'adapter',
    code: {
      good: `interface NewPayment { pay(amount: number): void; }
class LegacyPaymentSystem { makePayment(cents: number) {} }
class PaymentAdapter implements NewPayment {
  constructor(private legacy: LegacyPaymentSystem) {}
  pay(amount: number) { this.legacy.makePayment(amount * 100); }
}`,
    },
  },
  {
    id: 'bridge',
    name: 'Bridge',
    category: 'structural',
    difficulty: 'intermediate',
    description: 'Separates abstraction from implementation so both can vary independently.',
    purpose: 'Decouple an abstraction from its implementation.',
    useCases: ['Cross-platform Rendering', 'Remote Controls', 'Device Drivers'],
    steps: [
      { title: 'Define Abstraction', description: 'Create high-level control interface' },
      { title: 'Define Implementation', description: 'Create platform-specific implementation' },
      { title: 'Bridge Connects', description: 'Abstraction holds reference to implementation' },
      { title: 'Independent Variation', description: 'Both sides can change independently' },
    ],
    realWorld: ['JDBC Drivers', 'React Native Bridge', 'Graphics API Abstraction'],
    simulationType: 'generic',
    code: {
      good: `interface Renderer { render(shape: string): void; }
class VectorRenderer implements Renderer { render(s) { /* vector */ } }
class Shape {
  constructor(protected renderer: Renderer) {}
  draw() { this.renderer.render(this.type); }
}`,
    },
  },
  {
    id: 'composite',
    name: 'Composite',
    category: 'structural',
    difficulty: 'intermediate',
    description: 'Composes objects into tree structures to represent part-whole hierarchies.',
    purpose: 'Treat individual objects and compositions uniformly.',
    useCases: ['File System Trees', 'UI Component Trees', 'Organization Charts'],
    steps: [
      { title: 'Define Component', description: 'Common interface for leaf and composite' },
      { title: 'Create Leaves', description: 'Individual items (files, buttons)' },
      { title: 'Create Composites', description: 'Containers that hold children' },
      { title: 'Uniform Operation', description: 'Client operates on tree uniformly' },
    ],
    realWorld: ['React Component Tree', 'DOM Structure', 'File Explorer'],
    simulationType: 'generic',
    code: {
      good: `interface FileSystemNode { getSize(): number; }
class File implements FileSystemNode { getSize() { return this.size; } }
class Folder implements FileSystemNode {
  constructor(private children: FileSystemNode[]) {}
  getSize() { return this.children.reduce((s, c) => s + c.getSize(), 0); }
}`,
    },
  },
  {
    id: 'decorator',
    name: 'Decorator',
    category: 'structural',
    difficulty: 'intermediate',
    description: 'Adds behavior to objects dynamically without altering their structure.',
    purpose: 'Wrap objects to add responsibilities at runtime.',
    useCases: ['Coffee Shop Orders', 'Stream Wrappers', 'Middleware Pipelines'],
    steps: [
      { title: 'Base Object', description: 'Start with plain coffee ($2)' },
      { title: 'Add Milk', description: 'Wrap with milk decorator (+$0.50)' },
      { title: 'Add Chocolate', description: 'Wrap with chocolate decorator (+$1.00)' },
      { title: 'Final Cost', description: 'Calculate total through decorator chain' },
    ],
    realWorld: ['Java I/O Streams', 'Express Middleware', 'Coffee Shop Orders'],
    simulationType: 'decorator',
    code: {
      good: `interface Coffee { cost(): number; description(): string; }
class MilkDecorator implements Coffee {
  constructor(private coffee: Coffee) {}
  cost() { return this.coffee.cost() + 0.5; }
  description() { return this.coffee.description() + ', milk'; }
}`,
    },
  },
  {
    id: 'facade',
    name: 'Facade',
    category: 'structural',
    difficulty: 'beginner',
    description: 'Provides a simplified interface to a complex subsystem.',
    purpose: 'Hide complexity behind a single easy-to-use interface.',
    useCases: ['Home Theater System', 'API Gateway', 'Compiler Front-end'],
    steps: [
      { title: 'Complex Subsystem', description: 'Multiple interdependent classes exist' },
      { title: 'Create Facade', description: 'Single class wraps all subsystem calls' },
      { title: 'Simple Method', description: 'watchMovie() handles everything internally' },
      { title: 'Client Happy', description: 'One call instead of dozens' },
    ],
    realWorld: ['AWS SDK Facades', 'jQuery', 'Spring @RestController'],
    simulationType: 'generic',
    code: {
      good: `class HomeTheaterFacade {
  constructor(private tv, private amp, private player) {}
  watchMovie(movie: string) {
    this.tv.on(); this.amp.setVolume(5);
    this.player.play(movie);
  }
}`,
    },
  },
  {
    id: 'flyweight',
    name: 'Flyweight',
    category: 'structural',
    difficulty: 'advanced',
    description: 'Shares common state among multiple objects to save memory.',
    purpose: 'Minimize memory usage by sharing intrinsic state.',
    useCases: ['Text Editors', 'Game Particle Systems', 'Icon Caching'],
    steps: [
      { title: 'Identify Shared State', description: 'Find data common across many objects' },
      { title: 'Create Flyweight', description: 'Store shared state in flyweight factory' },
      { title: 'External State', description: 'Keep unique state outside flyweight' },
      { title: 'Memory Saved', description: 'Thousands of objects share one flyweight' },
    ],
    realWorld: ['String Interning in Java', 'Browser DOM Nodes', 'Game Texture Atlases'],
    simulationType: 'generic',
    code: {
      good: `class TreeType {
  constructor(public name: string, public color: string, public texture: string) {}
}
class TreeFactory {
  private types = new Map<string, TreeType>();
  getType(name: string, color: string): TreeType {
    const key = name + color;
    if (!this.types.has(key)) this.types.set(key, new TreeType(name, color, 'tex'));
    return this.types.get(key)!;
  }
}`,
    },
  },
  {
    id: 'proxy',
    name: 'Proxy',
    category: 'structural',
    difficulty: 'intermediate',
    description: 'Provides a surrogate or placeholder to control access to another object.',
    purpose: 'Add access control, lazy loading, or logging around a real object.',
    useCases: ['Virtual Proxy (Lazy Loading)', 'Protection Proxy', 'Caching Proxy'],
    steps: [
      { title: 'Client Request', description: 'Client calls proxy method' },
      { title: 'Proxy Intercepts', description: 'Proxy performs access check or caching' },
      { title: 'Delegate to Real', description: 'Proxy forwards to real subject if allowed' },
      { title: 'Return Result', description: 'Client receives result transparently' },
    ],
    realWorld: ['Nginx Reverse Proxy', 'Java Dynamic Proxy', 'Vue computed properties'],
    simulationType: 'generic',
    code: {
      good: `interface Image { display(): void; }
class ProxyImage implements Image {
  private realImage: RealImage | null = null;
  display() {
    if (!this.realImage) this.realImage = new RealImage('photo.jpg');
    this.realImage.display();
  }
}`,
    },
  },
];

export const behavioralPatterns: PatternDetail[] = [
  {
    id: 'strategy',
    name: 'Strategy',
    category: 'behavioral',
    difficulty: 'beginner',
    description: 'Defines a family of algorithms and makes them interchangeable.',
    purpose: 'Encapsulate algorithms and switch between them at runtime.',
    useCases: ['Navigation Routes', 'Sorting Algorithms', 'Payment Methods'],
    steps: [
      { title: 'Select Strategy', description: 'Choose Car, Bike, or Walking strategy' },
      { title: 'Calculate Route', description: 'Selected strategy computes optimal route' },
      { title: 'Display Route', description: 'Route rendered on map with strategy-specific logic' },
      { title: 'Switch Strategy', description: 'Change strategy without modifying navigation app' },
    ],
    realWorld: ['Google Maps Transport Modes', 'Compression Algorithms', 'Auth Strategies'],
    simulationType: 'strategy',
    code: {
      good: `interface RouteStrategy { calculateRoute(from: string, to: string): Route; }
class CarStrategy implements RouteStrategy { calculateRoute(f, t) { /* highways */ } }
class NavigationApp {
  constructor(private strategy: RouteStrategy) {}
  setStrategy(s: RouteStrategy) { this.strategy = s; }
  navigate(from: string, to: string) { return this.strategy.calculateRoute(from, to); }
}`,
    },
  },
  {
    id: 'observer',
    name: 'Observer',
    category: 'behavioral',
    difficulty: 'beginner',
    description: 'Defines a subscription mechanism to notify multiple objects of events.',
    purpose: 'Establish one-to-many dependency for automatic notifications.',
    useCases: ['Event Systems', 'Model-View Updates', 'Stock Price Alerts'],
    steps: [
      { title: 'Subscribe', description: 'Subscribers register with the YouTube channel' },
      { title: 'New Video Uploaded', description: 'Channel publishes new content event' },
      { title: 'Notify All', description: 'All subscribers receive notification' },
      { title: 'Subscribers React', description: 'Each subscriber handles notification independently' },
    ],
    realWorld: ['YouTube Notifications', 'React useState/useEffect', 'Redis Pub/Sub'],
    simulationType: 'observer',
    code: {
      good: `interface Observer { update(data: unknown): void; }
class YouTubeChannel {
  private observers: Observer[] = [];
  subscribe(obs: Observer) { this.observers.push(obs); }
  uploadVideo(title: string) {
    this.observers.forEach(o => o.update({ title }));
  }
}`,
    },
  },
  {
    id: 'command',
    name: 'Command',
    category: 'behavioral',
    difficulty: 'intermediate',
    description: 'Encapsulates a request as an object, enabling undo/redo and queuing.',
    purpose: 'Turn requests into objects with execute() and undo() methods.',
    useCases: ['Text Editor Undo/Redo', 'Task Queues', 'Smart Home Commands'],
    steps: [
      { title: 'Create Command', description: 'Wrap action in command object' },
      { title: 'Invoker Receives', description: 'Invoker stores command in history' },
      { title: 'Execute', description: 'Command.execute() performs the action' },
      { title: 'Undo', description: 'Command.undo() reverses the action' },
    ],
    realWorld: ['Photoshop History', 'CQRS Pattern', 'Smart Home Alexa'],
    simulationType: 'generic',
    code: {
      good: `interface Command { execute(): void; undo(): void; }
class TypeCommand implements Command {
  constructor(private editor: Editor, private text: string) {}
  execute() { this.editor.insert(this.text); }
  undo() { this.editor.delete(this.text.length); }
}`,
    },
  },
  {
    id: 'state',
    name: 'State',
    category: 'behavioral',
    difficulty: 'intermediate',
    description: 'Allows an object to alter its behavior when its internal state changes.',
    purpose: 'Encapsulate state-specific behavior in separate classes.',
    useCases: ['Vending Machine', 'Media Player', 'TCP Connection States'],
    steps: [
      { title: 'Initial State', description: 'Object starts in Idle state' },
      { title: 'Trigger Event', description: 'User action triggers state transition' },
      { title: 'State Changes', description: 'Object behavior changes with new state' },
      { title: 'State-Specific Logic', description: 'Each state handles events differently' },
    ],
    realWorld: ['React Component Lifecycle', 'Order Status Flow', 'Game Character States'],
    simulationType: 'generic',
    code: {
      good: `interface State { handle(context: Player): void; }
class PlayingState implements State {
  handle(ctx: Player) { ctx.setState(new PausedState()); }
}
class Player {
  constructor(private state: State) {}
  setState(s: State) { this.state = s; }
  pressPlay() { this.state.handle(this); }
}`,
    },
  },
  {
    id: 'chain-of-responsibility',
    name: 'Chain of Responsibility',
    category: 'behavioral',
    difficulty: 'intermediate',
    description: 'Passes requests along a chain of handlers until one processes it.',
    purpose: 'Decouple sender from receiver by giving multiple objects a chance to handle.',
    useCases: ['Support Ticket Escalation', 'Middleware Pipelines', 'Event Bubbling'],
    steps: [
      { title: 'Ticket Created', description: 'Support ticket enters Level 1 queue' },
      { title: 'Level 1 Tries', description: 'Agent attempts resolution' },
      { title: 'Escalate', description: 'Unresolved tickets move to Level 2 → Manager → Director' },
      { title: 'Resolved', description: 'Appropriate handler resolves the ticket' },
    ],
    realWorld: ['Customer Support Tiers', 'Express Middleware', 'Java Servlet Filters'],
    simulationType: 'chain',
    code: {
      good: `abstract class Handler {
  protected next: Handler | null = null;
  setNext(h: Handler) { this.next = h; }
  handle(request: string): string | null {
    const result = this.process(request);
    if (result) return result;
    return this.next?.handle(request) ?? null;
  }
  abstract process(req: string): string | null;
}`,
    },
  },
  {
    id: 'mediator',
    name: 'Mediator',
    category: 'behavioral',
    difficulty: 'intermediate',
    description: 'Defines how a set of objects interact through a central mediator.',
    purpose: 'Reduce chaotic dependencies between communicating objects.',
    useCases: ['Air Traffic Control', 'Chat Rooms', 'Form Coordination'],
    steps: [
      { title: 'Components Register', description: 'UI components register with mediator' },
      { title: 'Event Occurs', description: 'One component triggers an event' },
      { title: 'Mediator Coordinates', description: 'Mediator notifies relevant components' },
      { title: 'Loose Coupling', description: 'Components never reference each other directly' },
    ],
    realWorld: ['Redux Store', 'Air Traffic Control', 'Slack Channels'],
    simulationType: 'generic',
    code: {
      good: `class DialogMediator {
  private components: Map<string, Component> = new Map();
  register(c: Component) { this.components.set(c.id, c); }
  notify(sender: string, event: string) {
    this.components.forEach((c, id) => {
      if (id !== sender) c.react(event);
    });
  }
}`,
    },
  },
  {
    id: 'memento',
    name: 'Memento',
    category: 'behavioral',
    difficulty: 'advanced',
    description: 'Captures and restores an object\'s internal state without violating encapsulation.',
    purpose: 'Save and restore object state for undo functionality.',
    useCases: ['Save/Load Game', 'Document Snapshots', 'Database Transactions'],
    steps: [
      { title: 'Capture State', description: 'Originator creates memento of current state' },
      { title: 'Store Memento', description: 'Caretaker saves memento in history stack' },
      { title: 'Modify State', description: 'Originator state changes through operations' },
      { title: 'Restore', description: 'Caretaker restores from saved memento' },
    ],
    realWorld: ['Git Commits', 'Photoshop History', 'Database Rollback'],
    simulationType: 'generic',
    code: {
      good: `class EditorMemento { constructor(public content: string) {} }
class Editor {
  private content = '';
  save(): EditorMemento { return new EditorMemento(this.content); }
  restore(m: EditorMemento) { this.content = m.content; }
}`,
    },
  },
  {
    id: 'visitor',
    name: 'Visitor',
    category: 'behavioral',
    difficulty: 'advanced',
    description: 'Separates algorithms from the objects on which they operate.',
    purpose: 'Add new operations to object structures without modifying them.',
    useCases: ['AST Traversal', 'Document Export', 'Tax Calculation'],
    steps: [
      { title: 'Define Visitor', description: 'Create visitor with visit methods per element type' },
      { title: 'Accept Visitor', description: 'Each element calls appropriate visit method' },
      { title: 'Double Dispatch', description: 'Operation determined by element + visitor types' },
      { title: 'New Operations', description: 'Add new visitor without changing elements' },
    ],
    realWorld: ['ESLint AST Visitors', 'Compiler IR Passes', 'XML DOM Traversal'],
    simulationType: 'generic',
    code: {
      good: `interface Visitor { visitCircle(c: Circle): void; visitSquare(s: Square): void; }
class AreaCalculator implements Visitor {
  visitCircle(c: Circle) { return Math.PI * c.radius ** 2; }
  visitSquare(s: Square) { return s.side ** 2; }
}`,
    },
  },
  {
    id: 'iterator',
    name: 'Iterator',
    category: 'behavioral',
    difficulty: 'beginner',
    description: 'Provides a way to access elements of a collection sequentially.',
    purpose: 'Traverse collections without exposing internal representation.',
    useCases: ['Collection Traversal', 'Tree Walking', 'Pagination'],
    steps: [
      { title: 'Get Iterator', description: 'Collection provides iterator instance' },
      { title: 'hasNext()', description: 'Check if more elements exist' },
      { title: 'next()', description: 'Retrieve current element and advance' },
      { title: 'Complete', description: 'All elements visited sequentially' },
    ],
    realWorld: ['Java for-each', 'JavaScript Generators', 'Database Cursors'],
    simulationType: 'generic',
    code: {
      good: `interface Iterator<T> { hasNext(): boolean; next(): T; }
class BookCollection implements Iterator<Book> {
  private index = 0;
  hasNext() { return this.index < this.books.length; }
  next() { return this.books[this.index++]; }
}`,
    },
  },
];

export const allPatterns: PatternDetail[] = [
  ...creationalPatterns,
  ...structuralPatterns,
  ...behavioralPatterns,
];

export function getPatternById(id: string): PatternDetail | undefined {
  return allPatterns.find((p) => p.id === id);
}

export function getPatternsByCategory(category: string): PatternDetail[] {
  return allPatterns.filter((p) => p.category === category);
}
