const PioneerTypical = () => {
  const pioneers = [
    {
      id: 1,
      name: "黄丽红",
      title: "赣州市三八红旗手",
      year: "2022年",
      description: "从事不动产工作20余年，无论严寒酷暑，无论是在繁忙的综合受理窗口，还是在偏远的乡镇上门服务，始终坚持把群众放在首位，用真心、耐心、细心服务好每一位办事群众。她始终以党员的标准严格要求自己，发挥先锋模范作用，在平凡的岗位上做出了不平凡的业绩，展现了新时代女性的风采。",
      icon: "award"
    },
    {
      id: 2,
      name: "成华清",
      title: "赣州市五一劳动奖章",
      year: "2022年",
      description: "自2004年入职以来，始终扎根一线，任劳任怨，在平凡的岗位上默默奉献。作为一名党员，他始终牢记初心使命，勇于担当作为，带领团队完成了多项重点工程建设任务。他以精益求精的态度对待每一项工作，以扎实过硬的本领赢得了同事和群众的广泛赞誉。",
      icon: "medal"
    }
  ];

  const renderIcon = (iconType: string) => {
    switch (iconType) {
      case "award":
        return (
          <svg className="w-5 h-5 text-yellow-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 9H4.5a2.5 2.5 0 010-5H6" />
            <path d="M18 9h1.5a2.5 2.5 0 000-5H18" />
            <path d="M4 22h16" />
            <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
            <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
            <path d="M18 2H6v7a6 6 0 0012 0V2Z" />
          </svg>
        );
      case "medal":
        return (
          <svg className="w-5 h-5 text-yellow-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 8v4l3 3" />
            <circle cx="12" cy="12" r="10" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm rounded-xl border border-blue-500/30 shadow-lg shadow-blue-500/10 overflow-hidden">
      <div className="px-4 py-3 bg-gradient-to-r from-blue-600/30 to-transparent border-b border-blue-500/20">
        <h2 className="text-white font-semibold flex items-center gap-2">
          <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
          先锋典型
        </h2>
      </div>

      <div className="p-4 space-y-3">
        {pioneers.map((pioneer) => (
          <div
            key={pioneer.id}
            className="bg-gradient-to-r from-yellow-500/10 to-transparent rounded-lg p-3 border border-yellow-500/20 hover:border-yellow-500/40 transition-all duration-300"
          >
            <div className="flex items-center gap-2 mb-2">
              {renderIcon(pioneer.icon)}
              <span className="text-yellow-400 text-xs font-medium">{pioneer.year}</span>
              <span className="text-yellow-400/60 text-xs">{pioneer.title}</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center flex-shrink-0">
                <span className="text-white text-sm font-bold">{pioneer.name.charAt(0)}</span>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-white font-medium text-sm mb-1">{pioneer.name}</h4>
                <p className="text-white/60 text-xs line-clamp-3">
                  {pioneer.description}
                </p>
              </div>
            </div>
          </div>
        ))}

        <button className="w-full py-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 text-xs rounded-lg transition-all duration-300 border border-blue-500/30 flex items-center justify-center gap-2">
          <span>查看更多先锋典型</span>
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default PioneerTypical;
