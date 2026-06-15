import type { SolidPrinciple } from '../types';

export const solidPrinciples: SolidPrinciple[] = [
  {
    id: 'srp',
    acronym: 'S',
    name: 'Single Responsibility Principle',
    tagline: 'A class should have only one reason to change',
    difficulty: 'beginner',
    problem: {
      title: 'God Class Anti-Pattern',
      className: 'UserService',
      methods: ['Send Email', 'Save User', 'Generate Report', 'Create PDF'],
      warnings: ['Tightly Coupled', 'Difficult To Maintain', 'Hard To Test'],
      warningDetails: [
        {
          id: 'coupled',
          label: 'Tightly Coupled',
          simpleDefinition: 'Everything is stuck together — change one part and others break.',
          whyHere: 'All 4 jobs live inside ONE class. Send Email needs SMTP settings. Create PDF uses the same report data. Save User touches the database. They all share the same file, same variables, same imports — so they cannot move independently.',
          realExample: 'You change the email template string inside sendEmail(). Accidentally you rename a variable called "userData" that generateReport() also uses. Now reports export blank pages — even though you only wanted to fix an email!',
          analogy: 'Like one person who is simultaneously the chef, cashier, cleaner, AND manager. If the chef is sick, the whole restaurant shuts down — even customers who just wanted to pay.',
          connectedMethods: ['Send Email', 'Save User', 'Generate Report', 'Create PDF'],
        },
        {
          id: 'maintain',
          label: 'Difficult To Maintain',
          simpleDefinition: 'Every small fix becomes scary because you might break something unrelated.',
          whyHere: 'UserService is already 400+ lines with email logic, SQL queries, CSV formatting, and PDF rendering mixed together. New developers must read ALL of it to change ANYTHING. There is no clear boundary between jobs.',
          realExample: 'Product asks: "Add SMS notifications." You open UserService, find sendEmail(), copy-paste it as sendSMS() inside the same class. Now the class has 5 responsibilities. Six months later nobody knows which methods belong to which feature.',
          analogy: 'A junk drawer with batteries, receipts, tools, and snacks. Finding one thing means digging through everything. Adding one more item makes it worse for everyone.',
          connectedMethods: ['Send Email', 'Generate Report', 'Create PDF'],
        },
        {
          id: 'test',
          label: 'Hard To Test',
          simpleDefinition: 'You cannot check if one feature works without setting up ALL the others.',
          whyHere: 'To unit-test saveUser(), you must also mock the email server, PDF library, and report generator — because they all live in the same class. A test for "does user save work?" accidentally sends real emails or hits real databases.',
          realExample: 'QA wants to test PDF generation. But createPDF() is inside UserService which also calls sendEmail() on success. Your test triggers 500 real emails to customers during CI pipeline. Tests are slow, flaky, and dangerous.',
          analogy: 'Testing if your car horn works, but the only way to test it is to start the entire engine, fill the gas tank, and drive on a highway. You wanted a 2-second test — you got a 30-minute ritual.',
          connectedMethods: ['Save User', 'Send Email', 'Create PDF'],
        },
      ],
    },
    breakdown: {
      actions: [
        { label: 'Add Feature', effect: 'New method added — class grows larger, all dependencies affected' },
        { label: 'Fix Bug', effect: 'Email fix breaks PDF generation — cascading failures' },
        { label: 'Modify Email', effect: 'Report logic accidentally modified — regression errors' },
      ],
      description: 'Every change ripples through the entire class, breaking unrelated functionality.',
    },
    solution: {
      before: ['UserService: Send Email, Save User, Generate Report, Create PDF'],
      after: [
        { className: 'UserService', methods: ['Save User', 'Get User'] },
        { className: 'EmailService', methods: ['Send Email', 'Send Welcome'] },
        { className: 'ReportService', methods: ['Generate Report', 'Export CSV'] },
        { className: 'PdfService', methods: ['Create PDF', 'Add Watermark'] },
      ],
    },
    sandbox: {
      methods: [
        { id: 'm1', name: 'Send Email', correctClass: 'email' },
        { id: 'm2', name: 'Save User', correctClass: 'user' },
        { id: 'm3', name: 'Generate Report', correctClass: 'report' },
        { id: 'm4', name: 'Create PDF', correctClass: 'pdf' },
      ],
      classes: [
        { id: 'user', name: 'UserService' },
        { id: 'email', name: 'EmailService' },
        { id: 'report', name: 'ReportService' },
        { id: 'pdf', name: 'PdfService' },
      ],
    },
    code: {
      bad: `class UserService {
  sendEmail(user: User) { /* SMTP logic */ }
  saveUser(user: User) { /* DB logic */ }
  generateReport(user: User) { /* Report logic */ }
  createPDF(report: Report) { /* PDF logic */ }
}`,
      good: `class UserService {
  constructor(private repo: UserRepository) {}
  saveUser(user: User) { return this.repo.save(user); }
}

class EmailService {
  sendEmail(user: User) { /* SMTP logic only */ }
}

class ReportService {
  generateReport(user: User) { /* Report logic only */ }
}

class PdfService {
  createPDF(report: Report) { /* PDF logic only */ }
}`,
    },
    realWorld: [
      { company: 'Amazon', usage: 'Order processing, shipping, and payment are separate microservices', icon: '📦' },
      { company: 'Netflix', usage: 'Encoding, recommendation, and billing are independent services', icon: '🎬' },
      { company: 'Instagram', usage: 'Feed, stories, and messaging have dedicated teams & services', icon: '📸' },
      { company: 'Uber', usage: 'Ride matching, payments, and maps are decoupled modules', icon: '🚗' },
    ],
  },
  {
    id: 'ocp',
    acronym: 'O',
    name: 'Open/Closed Principle',
    tagline: 'Open for extension, closed for modification',
    difficulty: 'intermediate',
    problem: {
      title: 'Switch Statement Hell',
      className: 'PaymentProcessor',
      methods: ['Process CreditCard', 'Process PayPal', 'Process Crypto', 'Add New Method?'],
      warnings: ['Must Modify Core', 'Breaks Existing Code', 'Violates Stability'],
    },
    breakdown: {
      actions: [
        { label: 'Add Bitcoin', effect: 'Must edit PaymentProcessor — risk breaking CreditCard flow' },
        { label: 'Fix PayPal Bug', effect: 'Crypto processing accidentally affected' },
        { label: 'Add Apple Pay', effect: 'Growing switch statement — untestable monster' },
      ],
      description: 'Every new payment method requires modifying the core processor class.',
    },
    solution: {
      before: ['PaymentProcessor with giant if/else for each payment type'],
      after: [
        { className: 'PaymentProcessor', methods: ['Process(payment: IPayment)'] },
        { className: 'CreditCardPayment', methods: ['Process()'] },
        { className: 'PayPalPayment', methods: ['Process()'] },
        { className: 'CryptoPayment', methods: ['Process()'] },
      ],
    },
    sandbox: {
      methods: [
        { id: 'm1', name: 'CreditCard.Process()', correctClass: 'cc' },
        { id: 'm2', name: 'PayPal.Process()', correctClass: 'pp' },
        { id: 'm3', name: 'Crypto.Process()', correctClass: 'cr' },
        { id: 'm4', name: 'Processor.Process()', correctClass: 'proc' },
      ],
      classes: [
        { id: 'proc', name: 'PaymentProcessor' },
        { id: 'cc', name: 'CreditCardPayment' },
        { id: 'pp', name: 'PayPalPayment' },
        { id: 'cr', name: 'CryptoPayment' },
      ],
    },
    code: {
      bad: `class PaymentProcessor {
  process(type: string, amount: number) {
    if (type === 'credit') { /* ... */ }
    else if (type === 'paypal') { /* ... */ }
    else if (type === 'crypto') { /* ... */ }
    // Must modify this class for every new type!
  }
}`,
      good: `interface PaymentMethod {
  process(amount: number): void;
}

class CreditCard implements PaymentMethod {
  process(amount: number) { /* ... */ }
}

class PaymentProcessor {
  process(method: PaymentMethod, amount: number) {
    method.process(amount); // No modification needed!
  }
}`,
    },
    realWorld: [
      { company: 'Stripe', usage: 'Plugin architecture for new payment methods without core changes', icon: '💳' },
      { company: 'Shopify', usage: 'App ecosystem extends platform without modifying core', icon: '🛒' },
      { company: 'VS Code', usage: 'Extension API allows features without touching editor core', icon: '💻' },
      { company: 'Spring Framework', usage: 'Bean post-processors extend behavior via interfaces', icon: '🍃' },
    ],
  },
  {
    id: 'lsp',
    acronym: 'L',
    name: 'Liskov Substitution Principle',
    tagline: 'Subtypes must be substitutable for their base types',
    difficulty: 'intermediate',
    problem: {
      title: 'Broken Inheritance',
      className: 'Bird',
      methods: ['Fly()', 'Eat()', 'Penguin.Fly() → Crash!'],
      warnings: ['Unexpected Behavior', 'Runtime Errors', 'Broken Contracts'],
    },
    breakdown: {
      actions: [
        { label: 'Use Penguin as Bird', effect: 'fly() throws exception — contract violated' },
        { label: 'Refactor Fly Logic', effect: 'All bird subclasses break — fragile hierarchy' },
        { label: 'Add FlyingBird', effect: 'Inheritance tree becomes confusing and leaky' },
      ],
      description: 'Subclasses that cannot fulfill the parent contract cause runtime surprises.',
    },
    solution: {
      before: ['Bird → Eagle (flies), Bird → Penguin (cannot fly — breaks LSP)'],
      after: [
        { className: 'Bird', methods: ['Eat()', 'Move()'] },
        { className: 'FlyingBird', methods: ['Fly()', 'Eat()', 'Move()'] },
        { className: 'Eagle', methods: ['Fly()', 'Eat()'] },
        { className: 'Penguin', methods: ['Swim()', 'Eat()'] },
      ],
    },
    sandbox: {
      methods: [
        { id: 'm1', name: 'Eat()', correctClass: 'bird' },
        { id: 'm2', name: 'Fly()', correctClass: 'flying' },
        { id: 'm3', name: 'Swim()', correctClass: 'penguin' },
        { id: 'm4', name: 'Move()', correctClass: 'bird' },
      ],
      classes: [
        { id: 'bird', name: 'Bird' },
        { id: 'flying', name: 'FlyingBird' },
        { id: 'penguin', name: 'Penguin' },
        { id: 'eagle', name: 'Eagle' },
      ],
    },
    code: {
      bad: `class Bird { fly() { /* all birds fly? */ } }
class Penguin extends Bird {
  fly() { throw new Error("Can't fly!"); }
}`,
      good: `interface Bird { eat(): void; move(): void; }
interface FlyingBird extends Bird { fly(): void; }

class Eagle implements FlyingBird {
  eat() {} fly() {} move() {}
}
class Penguin implements Bird {
  eat() {} move() { /* swim */ }
}`,
    },
    realWorld: [
      { company: 'Java Collections', usage: 'List implementations are fully interchangeable', icon: '☕' },
      { company: 'React Components', usage: 'Custom components honor the same props contract', icon: '⚛️' },
      { company: 'AWS SDK', usage: 'S3 client implementations are swappable', icon: '☁️' },
      { company: 'Database Drivers', usage: 'Any JDBC driver works with the same interface', icon: '🗄️' },
    ],
  },
  {
    id: 'isp',
    acronym: 'I',
    name: 'Interface Segregation Principle',
    tagline: 'Clients should not depend on interfaces they do not use',
    difficulty: 'intermediate',
    problem: {
      title: 'Fat Interface',
      className: 'IWorker',
      methods: ['Work()', 'Eat()', 'Sleep()', 'Robot must implement Eat & Sleep?'],
      warnings: ['Forced Implementation', 'Empty Methods', 'Tight Coupling'],
    },
    breakdown: {
      actions: [
        { label: 'Add Robot Worker', effect: 'Must implement eat() and sleep() with no-ops' },
        { label: 'Change Eat()', effect: 'Robot class affected despite not eating' },
        { label: 'Add Manager Role', effect: 'Interface grows — more forced empty methods' },
      ],
      description: 'Workers are forced to implement methods they will never use.',
    },
    solution: {
      before: ['IWorker: work(), eat(), sleep() — all workers must implement all'],
      after: [
        { className: 'IWorkable', methods: ['Work()'] },
        { className: 'IEatable', methods: ['Eat()'] },
        { className: 'ISleepable', methods: ['Sleep()'] },
        { className: 'Human', methods: ['Work()', 'Eat()', 'Sleep()'] },
        { className: 'Robot', methods: ['Work()'] },
      ],
    },
    sandbox: {
      methods: [
        { id: 'm1', name: 'Work()', correctClass: 'workable' },
        { id: 'm2', name: 'Eat()', correctClass: 'eatable' },
        { id: 'm3', name: 'Sleep()', correctClass: 'sleepable' },
        { id: 'm4', name: 'Recharge()', correctClass: 'robot' },
      ],
      classes: [
        { id: 'workable', name: 'IWorkable' },
        { id: 'eatable', name: 'IEatable' },
        { id: 'sleepable', name: 'ISleepable' },
        { id: 'robot', name: 'Robot' },
      ],
    },
    code: {
      bad: `interface IWorker {
  work(): void;
  eat(): void;
  sleep(): void;
}
class Robot implements IWorker {
  work() {}
  eat() {} // Robot doesn't eat!
  sleep() {} // Robot doesn't sleep!
}`,
      good: `interface Workable { work(): void; }
interface Eatable { eat(): void; }
interface Sleepable { sleep(): void; }

class Human implements Workable, Eatable, Sleepable {
  work() {} eat() {} sleep() {}
}
class Robot implements Workable {
  work() {} // Only what it needs!
}`,
    },
    realWorld: [
      { company: 'USB Standards', usage: 'USB-C, USB-A, HDMI are separate focused interfaces', icon: '🔌' },
      { company: 'React Hooks', usage: 'useState, useEffect are small focused APIs', icon: '⚛️' },
      { company: 'Go Interfaces', usage: 'io.Reader and io.Writer are minimal interfaces', icon: '🐹' },
      { company: 'Microservices', usage: 'Each service exposes only relevant endpoints', icon: '🔗' },
    ],
  },
  {
    id: 'dip',
    acronym: 'D',
    name: 'Dependency Inversion Principle',
    tagline: 'Depend on abstractions, not concretions',
    difficulty: 'advanced',
    problem: {
      title: 'Hard-Coded Dependencies',
      className: 'OrderService',
      methods: ['MySQLDatabase', 'SMTPEmail', 'FileLogger — all hardcoded'],
      warnings: ['Cannot Swap Implementations', 'Hard To Test', 'Tight Coupling'],
    },
    breakdown: {
      actions: [
        { label: 'Switch to MongoDB', effect: 'Must rewrite OrderService internals' },
        { label: 'Mock for Testing', effect: 'Cannot inject mocks — tests hit real DB' },
        { label: 'Add Redis Cache', effect: 'OrderService grows with more concrete deps' },
      ],
      description: 'High-level modules are directly tied to low-level implementation details.',
    },
    solution: {
      before: ['OrderService → MySQLDatabase, SMTPEmail, FileLogger (concrete)'],
      after: [
        { className: 'OrderService', methods: ['CreateOrder()'] },
        { className: 'IDatabase', methods: ['Save()', 'Find()'] },
        { className: 'IEmailService', methods: ['Send()'] },
        { className: 'ILogger', methods: ['Log()'] },
      ],
    },
    sandbox: {
      methods: [
        { id: 'm1', name: 'CreateOrder()', correctClass: 'order' },
        { id: 'm2', name: 'Save()', correctClass: 'db' },
        { id: 'm3', name: 'Send()', correctClass: 'email' },
        { id: 'm4', name: 'Log()', correctClass: 'logger' },
      ],
      classes: [
        { id: 'order', name: 'OrderService' },
        { id: 'db', name: 'IDatabase' },
        { id: 'email', name: 'IEmailService' },
        { id: 'logger', name: 'ILogger' },
      ],
    },
    code: {
      bad: `class OrderService {
  private db = new MySQLDatabase();
  private email = new SMTPEmail();
  createOrder(data) {
    this.db.save(data);
    this.email.send("Order confirmed");
  }
}`,
      good: `interface IDatabase { save(data: unknown): void; }
interface IEmailService { send(msg: string): void; }

class OrderService {
  constructor(
    private db: IDatabase,
    private email: IEmailService
  ) {}
  createOrder(data) {
    this.db.save(data);
    this.email.send("Order confirmed");
  }
}`,
    },
    realWorld: [
      { company: 'Spring DI', usage: 'IoC container injects interfaces, not concrete classes', icon: '🍃' },
      { company: 'NestJS', usage: 'Providers and modules use dependency injection', icon: '🐱' },
      { company: 'Angular', usage: 'Injectable services depend on abstractions', icon: '🅰️' },
      { company: 'Hexagonal Architecture', usage: 'Ports and adapters decouple core from infrastructure', icon: '⬡' },
    ],
  },
];
