const EducationVideo = () => {
  const videos = [
    {
      id: 1,
      title: "中国共产党历史展馆",
      duration: "03:45"
    },
    {
      id: 2,
      title: "中国共产党纪律建设史",
      duration: "05:20"
    },
    {
      id: 3,
      title: "中国共产党的历史使命",
      duration: "04:15"
    }
  ];

  return (
    <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm rounded-xl border border-blue-500/30 shadow-lg shadow-blue-500/10 overflow-hidden">
      <div className="px-4 py-3 bg-gradient-to-r from-blue-600/30 to-transparent border-b border-blue-500/20">
        <h2 className="text-white font-semibold flex items-center gap-2">
          <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
          党性教育视频
        </h2>
      </div>

      <div className="p-4">
        <div className="relative aspect-video rounded-lg overflow-hidden mb-4 border border-red-500/30">
          <div className="absolute inset-0 bg-gradient-to-br from-red-900/60 via-red-700/40 to-blue-900/60 flex items-center justify-center">
            <div className="text-center">
              <h3 className="text-white text-xl font-bold mb-2">延续红色血脉</h3>
              <p className="text-red-200 text-lg">培育时代新人</p>
              <p className="text-white/60 text-xs mt-2">爱国教育专题活动启动仪式</p>
            </div>
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <button className="w-14 h-14 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-300 group">
              <svg className="w-6 h-6 text-white ml-1" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
            </button>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/80 to-transparent" />
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
            <div className="text-white/80 text-xs">
              点击观看
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 text-white/60 text-xs">
                <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>12.5K</span>
              </div>
              <div className="flex items-center gap-1 text-white/60 text-xs">
                <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17 3a2.828 2.828 0 114 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
                </svg>
                <span>892</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          {videos.map((video) => (
            <div
              key={video.id}
              className="flex items-center gap-3 p-2 bg-slate-700/30 hover:bg-slate-700/50 rounded-lg transition-all duration-300 cursor-pointer group"
            >
              <div className="relative w-20 h-12 rounded overflow-hidden flex-shrink-0">
                <div className="absolute inset-0 bg-gradient-to-br from-red-600/40 to-blue-600/40 flex items-center justify-center">
                  <svg className="w-5 h-5 text-white/80" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
                <div className="absolute bottom-1 right-1 bg-black/60 px-1 rounded text-white/80 text-xs">
                  {video.duration}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white/80 text-xs truncate group-hover:text-white transition-colors">
                  {video.title}
                </p>
              </div>
              <svg className="w-4 h-4 text-white/40 group-hover:text-white/60 transition-colors flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 5l7 7-7 7" />
              </svg>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EducationVideo;
