import type { ArchitectureNode } from '../types';

export const architectureComponents: ArchitectureNode[] = [
  { id: 'frontend', type: 'frontend', label: 'Frontend', icon: '🖥️' },
  { id: 'api-gateway', type: 'gateway', label: 'API Gateway', icon: '🚪' },
  { id: 'load-balancer', type: 'lb', label: 'Load Balancer', icon: '⚖️' },
  { id: 'microservice', type: 'service', label: 'Microservice', icon: '⚙️' },
  { id: 'database', type: 'database', label: 'Database', icon: '🗄️' },
  { id: 'cache', type: 'cache', label: 'Cache', icon: '⚡' },
  { id: 'queue', type: 'queue', label: 'Message Queue', icon: '📨' },
  { id: 'cdn', type: 'cdn', label: 'CDN', icon: '🌐' },
];

export const aiKnowledgeBase: Record<string, { text: string; relatedPattern?: string }> = {
  'factory vs builder': {
    text: 'Factory focuses on WHAT to create — it returns ready-made products based on a type parameter. Builder focuses on HOW to assemble — it constructs complex objects step by step with a fluent API. Use Factory when you need different types of related objects. Use Builder when an object has many optional configurations.',
    relatedPattern: 'factory',
  },
  'strategy vs state': {
    text: 'Strategy lets the CLIENT choose which algorithm to use at runtime (e.g., navigation mode). State lets the OBJECT change its own behavior based on internal state transitions (e.g., a vending machine moving from "idle" to "dispensing"). Strategy is about interchangeable algorithms; State is about state-dependent behavior.',
    relatedPattern: 'strategy',
  },
  'adapter vs facade': {
    text: 'Adapter translates one interface into another that a client expects — it\'s a bridge between incompatible systems. Facade provides a simplified unified interface to a complex subsystem — it doesn\'t change interfaces, it hides complexity. Adapter = translation. Facade = simplification.',
    relatedPattern: 'adapter',
  },
  'decorator vs proxy': {
    text: 'Decorator adds responsibilities to an object dynamically (e.g., adding milk to coffee). Proxy controls access to an object (e.g., lazy loading an image). Decorator enhances behavior; Proxy manages access. Both use wrapping, but their intent differs.',
    relatedPattern: 'decorator',
  },
  'what is srp': {
    text: 'Single Responsibility Principle: A class should have only one reason to change. If a class handles emails, database operations, AND report generation, any change to one concern risks breaking the others. Split into focused classes, each owning a single responsibility.',
    relatedPattern: 'srp',
  },
  'what is solid': {
    text: 'SOLID is five principles for maintainable OOP: S — Single Responsibility (one job per class), O — Open/Closed (extend without modifying), L — Liskov Substitution (subtypes are interchangeable), I — Interface Segregation (small focused interfaces), D — Dependency Inversion (depend on abstractions).',
  },
  'when to use observer': {
    text: 'Use Observer when changes in one object need to notify multiple dependent objects automatically. Examples: event systems, pub/sub messaging, UI model-view updates, stock price alerts. It decouples the publisher from subscribers.',
    relatedPattern: 'observer',
  },
  'when to use singleton': {
    text: 'Use Singleton when exactly one instance of a class should exist globally — database connection pools, configuration managers, logging services. Be cautious: Singleton can make testing harder and create hidden dependencies.',
    relatedPattern: 'singleton',
  },
  'what is load balancer': {
    text: 'A Load Balancer distributes incoming traffic across multiple servers. Without it, one server handles everything and dies under load. Types: Round Robin (equal rotation), Least Connections (send to least busy), IP Hash (same user → same server). Place it BEFORE your API servers.',
  },
  'what is api gateway': {
    text: 'API Gateway is the single front door for all client requests. It handles: authentication (JWT), rate limiting, SSL termination, request routing (/feed → Feed Service), and logging. Clients never talk to internal services directly.',
  },
  'what is caching': {
    text: 'Caching stores frequently-read data in fast memory (Redis/Memcached) so you don\'t hit the database every time. Cache-Aside pattern: 1) Check cache 2) On miss, read DB 3) Store in cache. Target 90%+ hit rate. Cache hot data: feeds, sessions, user profiles.',
  },
  'what is message queue': {
    text: 'Message Queue (Kafka/RabbitMQ/SQS) decouples services. Producer publishes event → consumers process async. Use when: user doesn\'t need to wait (email, feed fan-out, video transcode), you need retry on failure, or workers scale independently.',
  },
  'what is cdn': {
    text: 'CDN (Content Delivery Network) caches static files at edge servers worldwide. User in Tokyo gets files from Tokyo edge, not US origin. Essential for: images, videos, JS/CSS. Reduces origin load by 95%+. CloudFront, Akamai, Cloudflare.',
  },
  'what is database sharding': {
    text: 'Sharding splits one database into multiple partitions by a key (user_id, video_id). Each shard handles a subset of data. Use when single DB hits write limits (~5K writes/sec for PostgreSQL). Challenge: cross-shard queries become hard.',
  },
  'what is scalability': {
    text: 'Scalability = handling more load by adding resources. Vertical: bigger server (limited). Horizontal: more servers + load balancer (unlimited). Key: make services stateless so any server handles any request. Database is usually the first bottleneck.',
  },
  'what is cap theorem': {
    text: 'CAP: Consistency, Availability, Partition tolerance — pick 2. In distributed systems, network partitions WILL happen (P is mandatory). Choose CP (bank: correct balance, may go down) or AP (social media: always up, likes may be slightly off).',
  },
  'monolith vs microservices': {
    text: 'Monolith: one codebase, simple deploy, good for startups/MVP. Microservices: independent deploy, scale per service, good at scale. Start monolith with clear modules → extract services when a specific part needs independent scaling (Instagram extracted Media Service first).',
  },
  'instagram architecture': {
    text: 'Instagram: React Native → API Gateway → Media Service (upload) + Feed Service (read). Kafka async fan-out for new posts. Memcached for feed cache. CDN for images. PostgreSQL (users) + Cassandra (posts). Key insight: separate read path (feed) from write path (upload).',
  },
  'snapchat architecture': {
    text: 'Snapchat: WebSocket gateway for real-time snaps. Messaging Service routes 1-to-1 (ephemeral). Stories Service for 24h broadcast. Redis with TTL for auto-expiry. Media → S3 → CDN. Key insight: ephemeral data needs TTL at every layer, not permanent DB storage.',
  },
  'youtube architecture': {
    text: 'YouTube: Chunked upload → Transcode Queue → Worker fleet → CDN. Separate upload pipeline from playback. Recommendation ML as independent service. Vitess (sharded MySQL) for metadata. Key insight: CPU-heavy transcode NEVER blocks upload response.',
  },
  'netflix architecture': {
    text: 'Netflix: Zuul Gateway → 700+ microservices. Playback Service + EVCache + Open Connect CDN (custom). Cassandra for viewing history. Chaos Monkey tests failures. Key insight: design for failure — assume every component WILL break.',
  },
  'tiktok architecture': {
    text: 'TikTok: FYP ML Service (two-stage: candidate gen → rank). Video CDN for clips. Kafka streams engagement (likes, skips) back to ML in real-time. Client pre-fetches next 3 videos. Key insight: recommendation-first, not social-graph-first.',
  },
  'whatsapp architecture': {
    text: 'WhatsApp: WebSocket gateway with consistent hashing. Erlang chat servers (millions of connections). Message queue for offline delivery. Redis for presence/TTL. S3 for media. Key insight: sticky sessions + offline inbox queue.',
  },
  'uber architecture': {
    text: 'Uber: Dispatch Saga orchestrator → Matching Engine + Redis Geo (GEORADIUS) → Pricing Service (Strategy pattern) → Maps for live tracking → Kafka trip events → MySQL. Key insight: geospatial index is non-negotiable for ride-sharing.',
  },
  'amazon architecture': {
    text: 'Amazon: Storefront → API Gateway → Order Service (Saga) → Inventory (reserve) + Payment (circuit breaker) → SQS → Shipping. ElastiCache for stock. DynamoDB for orders. Key insight: Saga with compensating transactions for every order step.',
  },
};
