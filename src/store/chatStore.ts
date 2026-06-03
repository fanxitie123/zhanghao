import { create } from 'zustand';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  thinking?: string[];
  sources?: string[];
  files?: { name: string; size: string; type: string }[];
}

export interface Session {
  id: string;
  title: string;
  lastMessage: string;
  createdAt: string;
}

interface ChatStore {
  sessions: Session[];
  currentSessionId: string | null;
  messages: Message[];
  isThinking: boolean;
  setCurrentSession: (sessionId: string) => void;
  createNewSession: () => void;
  addMessage: (message: Omit<Message, 'id'>) => void;
  setThinking: (thinking: string[]) => void;
  clearThinking: () => void;
  deleteSession: (sessionId: string) => void;
}

const mockSessions: Session[] = [
  {
    id: '1',
    title: '谈谈监察对象的范围',
    lastMessage: '监察对象是指所有依法行使公权力的公职人员',
    createdAt: '2024-01-15 10:30',
  },
  {
    id: '2',
    title: '监察对象的处分种类有哪些？',
    lastMessage: '警告、记过、记大过、降级、撤职、开除',
    createdAt: '2024-01-14 15:20',
  },
  {
    id: '3',
    title: '政务处分与行政处分的区别',
    lastMessage: '政务处分适用于所有监察对象，行政处分仅适用于公务员',
    createdAt: '2024-01-13 09:15',
  },
  {
    id: '4',
    title: '如何认定职务违法？',
    lastMessage: '职务违法行为需具备主体、主观、客观、客体四个要件',
    createdAt: '2024-01-12 14:45',
  },
  {
    id: '5',
    title: '监察机关的职责有哪些？',
    lastMessage: '监督、调查、处置三项主要职责',
    createdAt: '2024-01-11 11:20',
  },
];

const sessionMessages: Record<string, Message[]> = {
  '1': [
    {
      id: '1-1',
      role: 'user',
      content: '谈谈监察对象的范围',
    },
    {
      id: '1-2',
      role: 'assistant',
      thinking: [
        '搜索监察法中关于监察对象的六类人员的具体定义和范围',
        '了解监察对象与公务员、公职人员等概念的区别和联系',
        '查询监察机关对不同类别监察对象的监督方式和权限',
        '整理分析结果，形成结构化回答',
      ],
      content: `监察对象是指所有依法行使公权力的公职人员，其范围由《中华人民共和国监察法》第十五条明确界定为六类人员。判断是否属于监察对象的核心标准是**是否实际行使公权力**，履行公务，而非仅看其是否具有公职身份或编制。

## 一、监察对象的六类法定范围

### 1. 公务员及参照公务员法管理的人员
包括中国共产党机关、人大机关、行政机关、监察委员会、法院、检察院、政协机关、民主党派和工商联机关的公务员，以及法律、法规授权的事业单位中经批准参照公务员法管理的人员。

### 2. 法律、法规授权或受委托管理公共事务组织中的公务人员
指在法律、法规授权或受国家机关委托的组织中，从事组织、领导、管理、监督等公务的人员。

### 3. 国有企业管理人员
特指在国家出资企业中履行管理职责的人员。

### 4. 公办事业单位中从事管理的人员
指国家举办或利用国有资产举办的事业单位中从事管理工作的人员。

### 5. 基层群众性自治组织中从事管理的人员
包括村委会、居委会中管理集体事务和公益事业的人员。

### 6. 其他依法履行公职的人员
兜底条款，确保监察全覆盖。`,
      sources: ['《中华人民共和国监察法》', '相关司法解释'],
    },
  ],
  '2': [
    {
      id: '2-1',
      role: 'user',
      content: '监察对象的处分种类有哪些？',
    },
    {
      id: '2-2',
      role: 'assistant',
      thinking: [
        '检索《公职人员政务处分法》关于处分种类的规定',
        '分析各类处分的适用情形和影响',
        '整理处分的期限和后果',
        '形成清晰的分类说明',
      ],
      content: `根据《中华人民共和国公职人员政务处分法》，政务处分的种类分为以下六种：

## 政务处分种类

### 1. 警告
- **期限**：六个月
- **适用**：适用于轻微违纪违法行为
- **影响**：在处分期间不得晋升职务、职级、衔级和级别

### 2. 记过
- **期限**：十二个月
- **适用**：适用于较严重的违纪违法行为
- **影响**：在处分期间不得晋升职务、职级、衔级和级别

### 3. 记大过
- **期限**：十八个月
- **适用**：适用于严重的违纪违法行为
- **影响**：在处分期间不得晋升职务、职级、衔级和级别

### 4. 降级
- **期限**：二十四个月
- **适用**：适用于严重违纪违法行为
- **影响**：降低职务、职级、衔级和级别

### 5. 撤职
- **期限**：二十四个月
- **适用**：适用于严重违纪违法且不适宜继续担任现职的情况
- **影响**：撤销现任职务，按照规定降低职务、职级、衔级和级别

### 6. 开除
- **期限**：无期限（终身）
- **适用**：适用于严重违纪违法、丧失公职人员基本条件的情况
- **影响**：解除与单位的人事关系，不得再担任公职`,
      sources: ['《中华人民共和国公职人员政务处分法》'],
    },
  ],
  '3': [
    {
      id: '3-1',
      role: 'user',
      content: '政务处分与行政处分有什么区别？',
    },
    {
      id: '3-2',
      role: 'assistant',
      thinking: [
        '对比政务处分和行政处分的法律依据',
        '分析两者的适用对象范围',
        '比较处分权限和程序',
        '总结主要区别点',
      ],
      content: `政务处分与行政处分是两种不同的惩戒制度，主要区别如下：

## 一、法律依据不同
- **政务处分**：依据《中华人民共和国公职人员政务处分法》
- **行政处分**：依据《中华人民共和国公务员法》及相关行政法规

## 二、适用对象不同
- **政务处分**：适用于所有监察对象，包括公务员、事业单位工作人员、国有企业管理人员等
- **行政处分**：仅适用于公务员和参照公务员法管理的人员

## 三、作出机关不同
- **政务处分**：由监察机关作出
- **行政处分**：由任免机关或行政机关作出

## 四、种类差异
- **政务处分**：警告、记过、记大过、降级、撤职、开除
- **行政处分**：警告、记过、记大过、降级、撤职、开除（与政务处分种类相同）

## 五、救济途径不同
- **政务处分**：可以向作出处分决定的监察机关申请复审，对复审决定不服的，可以向上一级监察机关申请复核
- **行政处分**：可以向原处理机关申请复核，对复核结果不服的，可以向同级公务员主管部门或者作出该人事处理的机关的上一级机关提出申诉`,
      sources: ['《公职人员政务处分法》', '《公务员法》'],
    },
  ],
  '4': [
    {
      id: '4-1',
      role: 'user',
      content: '如何认定职务违法？',
    },
    {
      id: '4-2',
      role: 'assistant',
      thinking: [
        '研究职务违法的构成要件',
        '分析主体要件：必须是公职人员',
        '分析主观要件：故意或过失',
        '分析客观要件：实施了违法行为',
        '分析客体要件：侵犯了公职人员职务行为的廉洁性',
      ],
      content: `认定职务违法行为需要具备以下四个构成要件：

## 一、主体要件
行为主体必须是**公职人员**，即依法履行公共职务的国家机关、国有企事业单位、人民团体等组织中的工作人员。

## 二、主观要件
行为人在主观上必须具有**过错**，包括故意或过失：
- **故意**：明知自己的行为会发生危害后果，仍然希望或放任结果发生
- **过失**：应当预见自己的行为可能发生危害后果，因为疏忽大意而没有预见，或者已经预见但轻信能够避免

## 三、客观要件
行为人实施了违反法律、法规、规章规定的职务行为，包括：
- 滥用职权
- 玩忽职守
- 徇私舞弊
- 贪污贿赂
- 其他违反职务廉洁性要求的行为

## 四、客体要件
行为侵犯了公职人员职务行为的**廉洁性**和**公共利益**，损害了国家机关的正常管理秩序和公众信任。

## 认定程序
1. 监察机关依法立案调查
2. 收集证据，查明事实
3. 依据法律规定作出认定
4. 告知被调查人并听取陈述申辩`,
      sources: ['《监察法》', '相关司法解释'],
    },
  ],
  '5': [
    {
      id: '5-1',
      role: 'user',
      content: '监察机关的职责有哪些？',
    },
    {
      id: '5-2',
      role: 'assistant',
      thinking: [
        '检索《监察法》关于监察机关职责的规定',
        '分析监督、调查、处置三项职责的具体内容',
        '说明各项职责的实施方式',
        '总结职责之间的关系',
      ],
      content: `根据《中华人民共和国监察法》，监察机关主要履行以下三项职责：

## 一、监督职责
监察机关对所有公职人员依法履职、秉公用权、廉洁从政从业以及道德操守情况进行监督检查。

**主要方式：**
- 日常监督检查
- 专项监督检查
- 受理群众举报
- 廉政教育

## 二、调查职责
监察机关对涉嫌贪污贿赂、滥用职权、玩忽职守、权力寻租、利益输送、徇私舞弊以及浪费国家资财等职务违法和职务犯罪进行调查。

**主要权限：**
- 谈话
- 查询、冻结
- 搜查
- 扣押
- 留置

## 三、处置职责
监察机关根据调查结果，对违法的公职人员依法作出政务处分决定；对履行职责不力、失职失责的领导人员进行问责；对涉嫌职务犯罪的，将调查结果移送人民检察院依法审查、提起公诉；向监察对象所在单位提出监察建议。

**处置方式：**
- 给予政务处分
- 作出问责决定
- 移送司法机关
- 提出监察建议`,
      sources: ['《中华人民共和国监察法》'],
    },
  ],
};

export const useChatStore = create<ChatStore>((set) => ({
  sessions: mockSessions,
  currentSessionId: '1',
  messages: sessionMessages['1'],
  isThinking: false,
  
  setCurrentSession: (sessionId) => {
    set({ currentSessionId: sessionId });
    set({ messages: sessionMessages[sessionId] || [] });
  },
  
  createNewSession: () => {
    const newSession: Session = {
      id: Date.now().toString(),
      title: '新对话',
      lastMessage: '',
      createdAt: new Date().toLocaleString('zh-CN'),
    };
    set((state) => ({ 
      sessions: [newSession, ...state.sessions],
      currentSessionId: newSession.id,
      messages: [],
    }));
  },
  
  addMessage: (message) => {
    const newMessage: Message = {
      ...message,
      id: Date.now().toString(),
    };
    set((state) => ({ messages: [...state.messages, newMessage] }));
    
    if (message.role === 'user') {
      set({ isThinking: true });
      
      setTimeout(() => {
        const thinkingSteps = [
          '正在分析您的问题...',
          '检索相关法律法规...',
          '整理分析结果...',
          '生成回答内容...',
        ];
        
        set((prevState) => ({
          messages: [
            ...prevState.messages,
            {
              id: (Date.now() + 1).toString(),
              role: 'assistant' as const,
              content: `根据您的问题，以下是相关解答：\n\n这是系统针对您的问题生成的专业回答内容。系统正在努力学习更多知识，以便为您提供更准确、更全面的解答。`,
              thinking: thinkingSteps,
              sources: ['相关法律法规', '政策文件'],
            },
          ],
          isThinking: false,
        }));
      }, 2000);
    }
  },
  
  setThinking: (thinking) => {
    set({ isThinking: true });
  },
  
  clearThinking: () => {
    set({ isThinking: false });
  },
  
  deleteSession: (sessionId) => {
    set((state) => {
      const newSessions = state.sessions.filter(s => s.id !== sessionId);
      const newCurrentSessionId = state.currentSessionId === sessionId 
        ? newSessions.length > 0 ? newSessions[0].id : null
        : state.currentSessionId;
      return {
        sessions: newSessions,
        currentSessionId: newCurrentSessionId,
        messages: newCurrentSessionId ? sessionMessages[newCurrentSessionId] || [] : [],
      };
    });
  },
}));
