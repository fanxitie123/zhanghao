import { Sidebar } from '../components/Sidebar';
import { ChatArea } from '../components/ChatArea';
import { InputArea } from '../components/InputArea';
import { Header } from '../components/Header';

export default function Home() {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      
      <div className="flex-1 flex flex-col min-w-0">
        <Header title="谈谈监察对象的范围" />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <ChatArea />
          <InputArea />
        </div>
      </div>
    </div>
  );
}
