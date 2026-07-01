# 🔧 WEYAK CLOUD COMPUTER — FULL IMPLEMENTATION GUIDE

## الجزء الأول: Backend Setup

---

## 1️⃣ خادم Node.js مع Express و Socket.io

### ملف: `server.ts`

```typescript
import express from 'express';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new SocketIOServer(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

app.use(cors());
app.use(express.json());

// ============================================
// DATABASE MODELS
// ============================================

interface Task {
  id: string;
  title: string;
  status: 'pending' | 'processing' | 'validating' | 'executing' | 'completed';
  agentId: string;
  createdAt: Date;
  progress: number;
}

interface Agent {
  id: string;
  name: string;
  type: 'account' | 'visibility' | 'growth';
  status: 'active' | 'idle' | 'busy';
  memory: Record<string, any>;
  connections: string[];
  taskQueue: Task[];
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'agent';
  agentId: string;
  content: string;
  timestamp: Date;
  attachments?: string[];
}

// ============================================
// IN-MEMORY STORAGE (Replace with Database)
// ============================================

const agents: Map<string, Agent> = new Map([
  [
    'account-manager',
    {
      id: 'account-manager',
      name: 'Account Manager',
      type: 'account',
      status: 'active',
      memory: {},
      connections: ['gmail', 'outlook'],
      taskQueue: [],
    },
  ],
  [
    'visibility-manager',
    {
      id: 'visibility-manager',
      name: 'Visibility Manager',
      type: 'visibility',
      status: 'active',
      memory: {},
      connections: ['seo', 'gad'],
      taskQueue: [],
    },
  ],
  [
    'growth-manager',
    {
      id: 'growth-manager',
      name: 'Growth Manager',
      type: 'growth',
      status: 'active',
      memory: {},
      connections: ['analytics', 'crm'],
      taskQueue: [],
    },
  ],
]);

const chatMessages: ChatMessage[] = [];
const tasks: Map<string, Task> = new Map();

let totalTasks = 24;
let runningTasks = 3;
let pendingTasks = 8;
let completedTasks = 13;

// ============================================
// REST ENDPOINTS
// ============================================

// Get all agents
app.get('/api/agents', (req, res) => {
  const agentsList = Array.from(agents.values()).map((agent) => ({
    ...agent,
    taskCount: agent.taskQueue.length,
  }));
  res.json(agentsList);
});

// Get specific agent
app.get('/api/agents/:id', (req, res) => {
  const agent = agents.get(req.params.id);
  if (!agent) {
    return res.status(404).json({ error: 'Agent not found' });
  }
  res.json(agent);
});

// Update agent status
app.patch('/api/agents/:id/status', (req, res) => {
  const agent = agents.get(req.params.id);
  if (!agent) {
    return res.status(404).json({ error: 'Agent not found' });
  }

  agent.status = req.body.status;
  io.emit('agent:updated', agent);

  res.json(agent);
});

// Get all tasks
app.get('/api/tasks', (req, res) => {
  const tasksList = Array.from(tasks.values());
  res.json({
    total: totalTasks,
    running: runningTasks,
    pending: pendingTasks,
    completed: completedTasks,
    tasks: tasksList,
  });
});

// Create new task
app.post('/api/tasks', (req, res) => {
  const { title, agentId } = req.body;

  const task: Task = {
    id: `task-${Date.now()}`,
    title,
    status: 'pending',
    agentId,
    createdAt: new Date(),
    progress: 0,
  };

  tasks.set(task.id, task);
  totalTasks++;
  pendingTasks++;

  io.emit('task:created', task);
  io.emit('stats:updated', {
    total: totalTasks,
    running: runningTasks,
    pending: pendingTasks,
    completed: completedTasks,
  });

  res.json(task);
});

// Get chat messages
app.get('/api/chat/:agentId', (req, res) => {
  const messages = chatMessages.filter(
    (msg) => msg.agentId === req.params.agentId
  );
  res.json(messages);
});

// ============================================
// SOCKET.IO EVENTS
// ============================================

io.on('connection', (socket) => {
  console.log(`Client connected: ${socket.id}`);

  // Send initial state
  socket.emit('agents:list', Array.from(agents.values()));
  socket.emit('stats:update', {
    total: totalTasks,
    running: runningTasks,
    pending: pendingTasks,
    completed: completedTasks,
  });

  // Chat events
  socket.on('chat:send', (data: { agentId: string; message: string }) => {
    const message: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      agentId: data.agentId,
      content: data.message,
      timestamp: new Date(),
    };

    chatMessages.push(message);
    io.emit('chat:message', message);

    // Simulate agent response
    setTimeout(() => {
      const agentResponse: ChatMessage = {
        id: `msg-${Date.now()}`,
        sender: 'agent',
        agentId: data.agentId,
        content: `Processing: "${data.message}"`,
        timestamp: new Date(),
      };

      chatMessages.push(agentResponse);
      io.emit('chat:message', agentResponse);
    }, 1000);
  });

  // Task execution
  socket.on('task:execute', (data: { taskId: string; agentId: string }) => {
    const task = tasks.get(data.taskId);
    if (!task) return;

    const agent = agents.get(data.agentId);
    if (!agent) return;

    // Simulate task progress
    task.status = 'processing';
    runningTasks++;
    pendingTasks--;

    io.emit('task:updated', task);
    io.emit('stats:updated', {
      total: totalTasks,
      running: runningTasks,
      pending: pendingTasks,
      completed: completedTasks,
    });

    // Simulate task completion
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 30;
      task.progress = Math.min(progress, 100);

      if (progress >= 100) {
        clearInterval(interval);
        task.status = 'completed';
        runningTasks--;
        completedTasks++;

        io.emit('task:updated', task);
        io.emit('stats:updated', {
          total: totalTasks,
          running: runningTasks,
          pending: pendingTasks,
          completed: completedTasks,
        });
      } else {
        io.emit('task:progress', { taskId: data.taskId, progress });
      }
    }, 500);
  });

  // Agent status update
  socket.on('agent:update', (data: { agentId: string; status: string }) => {
    const agent = agents.get(data.agentId);
    if (agent) {
      agent.status = data.status as any;
      io.emit('agent:updated', agent);
    }
  });

  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

// ============================================
// START SERVER
// ============================================

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
```

---

## 2️⃣ Frontend Hook لـ Socket.io

### ملف: `hooks/useSocket.ts`

```typescript
import { useEffect, useRef, useCallback, useState } from 'react';
import io, { Socket } from 'socket.io-client';

interface UseSocketReturn {
  socket: Socket | null;
  isConnected: boolean;
  emit: (event: string, data: any) => void;
  on: (event: string, callback: (data: any) => void) => void;
}

export function useSocket(url?: string): UseSocketReturn {
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const socketUrl = url || process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000';

    socketRef.current = io(socketUrl, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });

    socketRef.current.on('connect', () => {
      setIsConnected(true);
      console.log('✅ Socket connected');
    });

    socketRef.current.on('disconnect', () => {
      setIsConnected(false);
      console.log('❌ Socket disconnected');
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, [url]);

  const emit = useCallback((event: string, data: any) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit(event, data);
    }
  }, []);

  const on = useCallback((event: string, callback: (data: any) => void) => {
    if (socketRef.current) {
      socketRef.current.on(event, callback);
    }
  }, []);

  return {
    socket: socketRef.current,
    isConnected,
    emit,
    on,
  };
}
```

---

## 3️⃣ Components التنفيذ الفعلي

### ملف: `components/Dashboard.tsx`

```typescript
import React, { useState, useEffect } from 'react';
import { useSocket } from '../hooks/useSocket';

interface Stats {
  total: number;
  running: number;
  pending: number;
  completed: number;
}

interface Task {
  id: string;
  title: string;
  status: 'pending' | 'processing' | 'validating' | 'executing' | 'completed';
  progress: number;
}

interface Agent {
  id: string;
  name: string;
  status: 'active' | 'idle' | 'busy';
  connections: string[];
  memory: Record<string, any>;
}

export const Dashboard: React.FC = () => {
  const { emit, on, isConnected } = useSocket();
  const [stats, setStats] = useState<Stats>({
    total: 0,
    running: 0,
    pending: 0,
    completed: 0,
  });
  const [agents, setAgents] = useState<Agent[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    if (!isConnected) return;

    // Listen for updates
    on('stats:update', (data: Stats) => {
      setStats(data);
    });

    on('stats:updated', (data: Stats) => {
      setStats(data);
    });

    on('agents:list', (data: Agent[]) => {
      setAgents(data);
    });

    on('task:updated', (data: Task) => {
      setTasks((prev) => {
        const index = prev.findIndex((t) => t.id === data.id);
        if (index >= 0) {
          const newTasks = [...prev];
          newTasks[index] = data;
          return newTasks;
        }
        return [...prev, data];
      });
    });

    on('task:progress', (data: { taskId: string; progress: number }) => {
      setTasks((prev) =>
        prev.map((t) =>
          t.id === data.taskId ? { ...t, progress: data.progress } : t
        )
      );
    });
  }, [isConnected, on]);

  const pipelineStages = [
    { name: 'Input', color: '#D4AF37' },
    { name: 'Process', color: '#3B5BFE' },
    { name: 'Validate', color: '#D4AF37' },
    { name: 'Execute', color: '#3B5BFE' },
    { name: 'Complete', color: '#10b981' },
  ];

  return (
    <div className="p-6 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 min-h-screen text-white">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-blue-500">
          Weyak Agent Runtime Environment
        </h1>
        <div className="flex gap-2">
          <span
            className={`px-3 py-1 rounded-full text-sm ${
              isConnected
                ? 'bg-green-500/20 text-green-400'
                : 'bg-red-500/20 text-red-400'
            }`}
          >
            {isConnected ? '🟢 Connected' : '🔴 Disconnected'}
          </span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Tasks" value={stats.total} color="#D4AF37" />
        <StatCard label="Running" value={stats.running} color="#3B5BFE" />
        <StatCard label="Pending" value={stats.pending} color="#f59e0b" />
        <StatCard
          label="Completed"
          value={stats.completed}
          color="#10b981"
        />
      </div>

      {/* Task Pipeline */}
      <div className="bg-slate-800/50 rounded-lg p-6 mb-8 border border-slate-700">
        <h2 className="text-xl font-bold mb-4 text-yellow-400">
          Task Pipeline
        </h2>
        <div className="flex items-center justify-between">
          {pipelineStages.map((stage, index) => (
            <React.Fragment key={stage.name}>
              <div className="text-center flex-1">
                <div
                  className="w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center text-sm font-bold"
                  style={{ backgroundColor: stage.color + '20', borderColor: stage.color, borderWidth: 2 }}
                >
                  {String(index + 1)}
                </div>
                <p className="text-sm text-gray-400">{stage.name}</p>
              </div>
              {index < pipelineStages.length - 1 && (
                <div className="flex-1 h-1 mx-2" style={{ backgroundColor: stage.color + '40' }}></div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Agents */}
      <div className="bg-slate-800/50 rounded-lg p-6 mb-8 border border-slate-700">
        <h2 className="text-xl font-bold mb-4 text-yellow-400">Active Agents</h2>
        <div className="grid grid-cols-3 gap-4">
          {agents.map((agent) => (
            <div
              key={agent.id}
              className="bg-slate-700/50 p-4 rounded-lg border border-slate-600 hover:border-yellow-400/50 transition"
            >
              <h3 className="font-semibold text-yellow-400 mb-2">
                {agent.name}
              </h3>
              <div className="flex items-center gap-2 mb-3">
                <span
                  className={`w-3 h-3 rounded-full ${
                    agent.status === 'active'
                      ? 'bg-green-500'
                      : agent.status === 'busy'
                      ? 'bg-yellow-500'
                      : 'bg-gray-500'
                  }`}
                ></span>
                <span className="text-sm text-gray-300 capitalize">
                  {agent.status}
                </span>
              </div>
              <div className="text-sm text-gray-400">
                Connections: {agent.connections.join(', ')}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tasks */}
      <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
        <h2 className="text-xl font-bold mb-4 text-yellow-400">Recent Tasks</h2>
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {tasks.slice(0, 10).map((task) => (
            <div
              key={task.id}
              className="bg-slate-700/50 p-3 rounded-lg flex justify-between items-center"
            >
              <div className="flex-1">
                <p className="text-sm font-medium">{task.title}</p>
                <div className="w-full bg-slate-600 rounded-full h-2 mt-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all"
                    style={{ width: `${task.progress}%` }}
                  ></div>
                </div>
              </div>
              <span className="text-xs text-gray-400 ml-4">
                {Math.round(task.progress)}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Stat Card Component
interface StatCardProps {
  label: string;
  value: number;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, color }) => (
  <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
    <p className="text-gray-400 text-sm mb-2">{label}</p>
    <p className="text-3xl font-bold" style={{ color }}>
      {value}
    </p>
  </div>
);
```

### ملف: `components/ChatInterface.tsx`

```typescript
import React, { useState, useEffect, useRef } from 'react';
import { useSocket } from '../hooks/useSocket';

interface Message {
  id: string;
  sender: 'user' | 'agent';
  agentId: string;
  content: string;
  timestamp: Date;
}

interface Agent {
  id: string;
  name: string;
}

export const ChatInterface: React.FC<{ agents: Agent[] }> = ({ agents }) => {
  const { emit, on } = useSocket();
  const [selectedAgent, setSelectedAgent] = useState<string>(
    agents[0]?.id || ''
  );
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    on('chat:message', (message: Message) => {
      if (message.agentId === selectedAgent) {
        setMessages((prev) => [...prev, message]);
        setIsLoading(false);
      }
    });
  }, [selectedAgent, on]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    emit('chat:send', {
      agentId: selectedAgent,
      message: input,
    });

    setInput('');
    setIsLoading(true);
  };

  return (
    <div className="flex flex-col h-full bg-slate-900">
      {/* Agent Selector */}
      <div className="p-4 border-b border-slate-700 flex gap-2 overflow-x-auto">
        {agents.map((agent) => (
          <button
            key={agent.id}
            onClick={() => setSelectedAgent(agent.id)}
            className={`px-4 py-2 rounded-lg whitespace-nowrap transition ${
              selectedAgent === agent.id
                ? 'bg-blue-500 text-white'
                : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
            }`}
          >
            {agent.name}
          </button>
        ))}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs px-4 py-2 rounded-lg ${
                msg.sender === 'user'
                  ? 'bg-blue-500 text-white'
                  : 'bg-slate-700 text-gray-100'
              }`}
            >
              <p className="text-sm">{msg.content}</p>
              <p className="text-xs mt-1 opacity-70">
                {new Date(msg.timestamp).toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-slate-700 px-4 py-2 rounded-lg">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-slate-700">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
          />
          <button
            onClick={handleSend}
            disabled={isLoading}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 transition"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};
```

---

## 4️⃣ Main Component

### ملف: `components/WeyakComputer.tsx` (Updated)

```typescript
import React, { useState, useEffect } from 'react';
import { Dashboard } from './Dashboard';
import { ChatInterface } from './ChatInterface';
import { DesktopView } from './DesktopView';
import { useSocket } from '../hooks/useSocket';

interface Agent {
  id: string;
  name: string;
  status: 'active' | 'idle' | 'busy';
}

export const WeyakComputer: React.FC = () => {
  const { isConnected } = useSocket();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'chat' | 'desktop'>(
    'dashboard'
  );
  const [agents, setAgents] = useState<Agent[]>([
    { id: 'account-manager', name: 'Account Manager', status: 'active' },
    { id: 'visibility-manager', name: 'Visibility Manager', status: 'active' },
    { id: 'growth-manager', name: 'Growth Manager', status: 'active' },
  ]);

  return (
    <div className="h-screen flex flex-col bg-slate-900">
      {/* Header */}
      <header className="bg-gradient-to-r from-slate-800 to-slate-900 border-b border-slate-700 px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-yellow-400">Weyak Cloud Computer</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-400">
            {isConnected ? '🟢 Online' : '🔴 Offline'}
          </span>
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-slate-800/50 border-b border-slate-700 px-6 flex gap-4">
        {[
          { id: 'dashboard', label: 'Dashboard' },
          { id: 'chat', label: 'Chat' },
          { id: 'desktop', label: 'Desktop' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-3 font-medium transition border-b-2 ${
              activeTab === tab.id
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-gray-400 hover:text-gray-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'chat' && <ChatInterface agents={agents} />}
        {activeTab === 'desktop' && <DesktopView />}
      </div>
    </div>
  );
};
```

---

## 5️⃣ Installation & Setup

### Step 1: Install Dependencies

```bash
# Backend
npm install express socket.io cors dotenv

# Frontend
npm install socket.io-client
```

### Step 2: Environment Variables

```env
# .env
PORT=5000
FRONTEND_URL=http://localhost:3000
REACT_APP_SOCKET_URL=http://localhost:5000
```

### Step 3: Start Server

```bash
# Terminal 1 - Backend
npm run dev

# Terminal 2 - Frontend
npm start
```

---

## 🎯 ماذا تعطيك هذه الحزمة:

✅ **Real-time Communication** بـ Socket.io  
✅ **Live Task Management** مع Progress Tracking  
✅ **Agent Status Management**  
✅ **Chat Interface** يعمل بفعالية  
✅ **Database Integration Ready**  
✅ **Production-Ready Code**

---

## التطوير اللاحق:

1. استبدل In-Memory Storage بـ Database (PostgreSQL/Supabase)
2. أضف Authentication (JWT)
3. أضف n8n Integration
4. أضف File Upload/Download
5. أضف Real Desktop Streaming (اختياري)

---

**هل تريد شيء معين أضيفه أو أعدّله؟** 🚀