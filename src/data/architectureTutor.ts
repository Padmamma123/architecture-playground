import type { ArchitectureGuide, ArchitectureGuideStep } from '../types';
import { aiKnowledgeBase } from './architecture';

export function getArchitectureAnswer(
  query: string,
  guide: ArchitectureGuide | null,
  step: ArchitectureGuideStep | null,
  stepIndex: number,
): string {
  const lower = query.toLowerCase();

  if (guide && step) {
    if (lower.includes('problem') || lower.includes('wrong') || lower.includes('why need')) {
      return `**Problem at this step:**\n${step.problem}\n\n**Why it matters for ${guide.name}:**\n${step.solution}`;
    }
    if (lower.includes('solution') || lower.includes('fix') || lower.includes('how')) {
      return `**Solution:**\n${step.solution}\n\n**Architect tip:**\n${step.architectTip}`;
    }
    if (lower.includes('break') || lower.includes('10x') || lower.includes('scale') || lower.includes('bottleneck')) {
      return getBottleneckAnswer(guide.id, stepIndex);
    }
    if (lower.includes('queue') || lower.includes('kafka') || lower.includes('async')) {
      return `**Why queues matter here:**\nQueues decouple producers from consumers. The user gets a fast response while heavy work happens in background.\n\n**In ${guide.name}:**\n${step.solution}\n\n**Rule:** If the user doesn't need to wait for the result → use a queue.`;
    }
    if (lower.includes('cache') || lower.includes('redis') || lower.includes('memcache')) {
      return `**Caching strategy:**\nRead-heavy systems need cache-aside pattern: check cache → on miss, read DB → store in cache.\n\n**At this step:**\n${step.solution}\n\n**Target:** 90%+ cache hit rate for hot data.`;
    }
    if (lower.includes('cdn')) {
      return `**CDN purpose:** Serve static content (images, videos, JS) from edge servers near users.\n\n**For ${guide.name}:** ${guide.scale}\n\nWithout CDN, every request crosses the ocean to your origin server. With CDN, 95%+ of requests never touch origin.`;
    }
    if (lower.includes('fail') || lower.includes('down') || lower.includes('outage')) {
      return `**Failure scenario at step ${stepIndex + 1}:**\nIf "${step.title}" component fails: ${getFailureImpact(guide.id, stepIndex)}\n\n**Architect rule:** Design for failure. Add redundancy, health checks, and circuit breakers.`;
    }
    if (lower.includes('database') || lower.includes('sql') || lower.includes('nosql') || lower.includes('db')) {
      return `**Database choice for ${guide.name}:**\n${getDatabaseAdvice(guide.id)}\n\n**At current step:**\n${step.architectTip}`;
    }
  }

  const systemKeywords: Record<string, string> = {
    instagram: 'instagram architecture',
    snapchat: 'snapchat architecture',
    youtube: 'youtube architecture',
    netflix: 'netflix architecture',
    tiktok: 'tiktok architecture',
    whatsapp: 'whatsapp architecture',
    uber: 'uber architecture',
    amazon: 'amazon architecture',
  };
  for (const [kw, key] of Object.entries(systemKeywords)) {
    if (lower.includes(kw) && aiKnowledgeBase[key]) {
      return aiKnowledgeBase[key].text;
    }
  }

  const componentKeywords: Record<string, string> = {
    'load balancer': 'what is load balancer',
    lb: 'what is load balancer',
    gateway: 'what is api gateway',
    cache: 'what is caching',
    redis: 'what is caching',
    queue: 'what is message queue',
    kafka: 'what is message queue',
    shard: 'what is database sharding',
    microservice: 'monolith vs microservices',
    monolith: 'monolith vs microservices',
    cap: 'what is cap theorem',
    cdn: 'what is cdn',
    scale: 'what is scalability',
    scalability: 'what is scalability',
  };
  for (const [kw, key] of Object.entries(componentKeywords)) {
    if (lower.includes(kw) && aiKnowledgeBase[key]) {
      return aiKnowledgeBase[key].text;
    }
  }

  for (const [key, value] of Object.entries(aiKnowledgeBase)) {
    if (lower.includes(key) || key.split(' ').every((w) => lower.includes(w))) {
      return value.text;
    }
  }

  if (guide && step) {
    return `Great question about **${guide.name}**!\n\nAt **${step.title}**:\n• Problem: ${step.problem.slice(0, 120)}...\n• Solution: ${step.solution.slice(0, 120)}...\n\nTry asking:\n• "What breaks at 10x scale?"\n• "Why do we need a queue?"\n• "What if this component fails?"`;
  }

  return 'I\'m your Architecture Tutor! Select a system (Instagram, Snapchat, YouTube, Netflix, TikTok) and I\'ll guide you step-by-step. You can also ask about load balancers, caching, queues, CDN, and more.';
}

function getBottleneckAnswer(guideId: string, stepIndex: number): string {
  const bottlenecks: Record<string, string[]> = {
    instagram: [
      'No architecture yet — everything on one server breaks at ~1000 users.',
      'Single client is fine, but no backend means no real product.',
      'Gateway without services = auth bottleneck. One gateway instance handles ~10K req/sec.',
      'Media service without CDN = your servers serve every image. Bandwidth becomes bottleneck at 10K concurrent viewers.',
      'Without CDN, origin bandwidth is first bottleneck. 10x traffic = 10x bandwidth cost.',
      'Without queue, celebrity post blocks upload for 30+ seconds. Fan-out is the bottleneck.',
      'Without cache, every feed read hits DB. DB becomes bottleneck at ~5K reads/sec.',
      'At 10x: shard DB by user_id, add read replicas, expand Kafka partitions, CDN handles media.',
    ],
    snapchat: [
      'Real-time messaging needs persistent connections. One server handles ~50K WebSockets.',
      'Without gateway, polling kills battery and servers.',
      'Messaging without TTL storage = database fills with ephemeral data.',
      'Redis TTL prevents storage bottleneck. Auto-expiry = zero cleanup cost.',
      'Stories mixed with snaps = complexity bottleneck in one service.',
      'Without CDN, video snaps lag globally. Media size is the bottleneck.',
    ],
    youtube: [
      '500 hours/min uploaded. Single server = impossible.',
      'Client-only = no platform. Need backend immediately.',
      'Without LB, viral video crashes one server.',
      'Without chunked upload, large files fail and retry = bandwidth waste.',
      'Without transcode queue, upload blocks for hours. CPU is bottleneck.',
      'Without CDN, video playback latency kills UX globally.',
      'ML recommendations without cache = GPU bottleneck on every homepage load.',
      'At 10x: shard Vitess, expand transcode workers auto-scale, CDN absorbs playback.',
    ],
    netflix: [
      '15% of internet traffic. Single region = global outage risk.',
      'Without Zuul, 700 services are unmanageable.',
      'Playback without cache = DB query per play. Latency bottleneck.',
      'Without Open Connect CDN, ISP bandwidth is bottleneck. Netflix built their own.',
      'Recommendations without pre-compute = ML latency on every page load.',
      'At 10x: multi-region failover, expand EVCache clusters, Chaos Monkey validates resilience.',
    ],
    tiktok: [
      '1B users need personalized feed, not friend feed. ML is the core.',
      'Without pre-fetch, scroll latency kills engagement.',
      'Single region = 300ms+ latency for global users.',
      'FYP without two-stage ML = can\'t rank millions of videos in real-time.',
      'Without CDN, video bytes overwhelm origin at 100 swipes/user/session.',
      'Without real-time Kafka feedback, FYP shows stale content within seconds.',
    ],
    whatsapp: [
      '2B users can\'t poll for messages. Need push architecture.',
      'Mobile-only — WebSocket from day one.',
      'Random LB breaks WebSocket sticky sessions.',
      'Thread-per-connection dies at 10K connections. Need Erlang/Go.',
      'Without offline queue, messages to offline users are lost.',
      'Online status in MySQL = millions of wasteful writes/sec.',
      'Media blobs in DB = storage disaster. Use S3.',
    ],
    uber: [
      'Sub-5-second matching across 1M drivers is the core challenge.',
      'Rider and driver have different update patterns — separate apps.',
      'Dispatch must orchestrate, not do everything.',
      'Without geospatial index, matching takes seconds not milliseconds.',
      'Hard-coded pricing can\'t handle surge. Strategy pattern needed.',
      'Live tracking + analytics need separate services + Kafka.',
      'Multi-service trip lifecycle needs Saga with compensating transactions.',
    ],
    amazon: [
      '1.6M orders/day — each touches 4+ services. Saga is mandatory.',
      'Browse is read-heavy; checkout is write-heavy — separate paths.',
      'Gateway rate-limits bots during Prime Day.',
      'Without saga orchestration, inventory and payment get out of sync.',
      'Overselling and bank API timeouts need locking + circuit breaker.',
      'Cache inventory reads; queue fulfillment async.',
      'DynamoDB for order scale; SQS decouples shipping from checkout.',
    ],
  };
  const msgs = bottlenecks[guideId] ?? ['At 10x traffic, the newest component without redundancy becomes the bottleneck.'];
  return `**Bottleneck analysis:**\n${msgs[Math.min(stepIndex, msgs.length - 1)]}\n\n**General rule:** Find the slowest component in your path. That's what you scale next.`;
}

function getFailureImpact(_guideId: string, stepIndex: number): string {
  if (stepIndex <= 1) return 'users cannot access the app at all. Need multi-region redundancy.';
  if (stepIndex <= 3) return 'requests fail or route incorrectly. Load balancer redirects to healthy instances.';
  return 'degraded service for that feature, but other features continue. Circuit breaker prevents cascade failure.';
}

function getDatabaseAdvice(guideId: string): string {
  const advice: Record<string, string> = {
    instagram: 'PostgreSQL for users/follows (relational). Cassandra for posts (write-heavy, partitioned by user_id).',
    snapchat: 'Redis for ephemeral snaps (TTL). Cassandra for message metadata. S3 for media blobs.',
    youtube: 'Vitess (sharded MySQL) for video metadata. BigQuery for analytics. Never mix OLTP and OLAP.',
    netflix: 'Cassandra for viewing history (write-heavy). S3 for encoded video files. EVCache for hot metadata.',
    tiktok: 'Distributed NoSQL for engagement signals. Feature store for ML. Object storage for video.',
    whatsapp: 'Cassandra/HBase for message metadata. S3 for media. Redis for presence with TTL. Erlang for connections.',
    uber: 'MySQL for trip records. Redis Geo for driver locations. Kafka for trip events. Saga in Dispatch.',
    amazon: 'DynamoDB for orders (Amazon built it for this). ElastiCache for inventory. SQS for async fulfillment.',
  };
  return advice[guideId] ?? 'Choose DB based on access pattern: relational for transactions, NoSQL for scale, cache for speed.';
}
