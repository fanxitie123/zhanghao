const BrandMatrix = () => {
  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm rounded-xl border border-blue-500/30 shadow-lg shadow-blue-500/10 overflow-hidden">
        <div className="px-4 py-3 bg-gradient-to-r from-blue-600/30 to-transparent border-b border-blue-500/20">
          <h2 className="text-white font-semibold flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
            赣州国资国企党建馆
          </h2>
        </div>
        
        <div className="p-4">
          <div className="grid grid-cols-2 gap-2 mb-4">
            <div className="aspect-[4/3] rounded-lg overflow-hidden border border-blue-500/20 relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-red-600/20 to-blue-600/20 flex items-center justify-center">
                <svg className="w-16 h-16 text-red-500/60" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            <div className="aspect-[4/3] rounded-lg overflow-hidden border border-blue-500/20 relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-red-700/30 to-red-500/10 flex items-center justify-center">
                <svg className="w-12 h-12 text-red-400/50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21 15 16 10 5 21" />
                </svg>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            <div className="aspect-[4/3] rounded-lg overflow-hidden border border-blue-500/20 relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-slate-600/30 to-slate-800/30 flex items-center justify-center">
                <svg className="w-12 h-12 text-white/40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="3" width="20" height="14" rx="2" />
                  <line x1="8" y1="21" x2="16" y2="21" />
                  <line x1="12" y1="17" x2="12" y2="21" />
                </svg>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            <div className="aspect-[4/3] rounded-lg overflow-hidden border border-blue-500/20 relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-red-600/20 to-orange-600/20 flex items-center justify-center">
                <svg className="w-12 h-12 text-red-400/50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          </div>

          <p className="text-white/70 text-xs leading-relaxed mb-3">
            在馆内集中系统展示赣州市属国有企业的红色根脉与发展历程，是集员工入职教育、党员培训、党组织生活、中层干部挂职锻炼教育三大定位为一体的红色教育基地。馆内设有五个篇章，生动全面展示了党建引领、党性锤炼、红色基因等寓教于乐的新颖模式。自2021年开馆以来，作为市首家全面展示苏区国资国企党的建设馆，获得社会各界广泛好评，作为市首家全面展示苏区国资国企党的建设馆，作为市首家全面展示苏区国资国企党的建设馆。
          </p>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-xs text-white/50">
              <span>参观人数: 12,860+</span>
              <span>场次: 320+</span>
            </div>
            <button className="px-3 py-1 bg-blue-600/30 hover:bg-blue-600/50 text-blue-300 text-xs rounded-md transition-all duration-300 border border-blue-500/30">
              了解更多
            </button>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm rounded-xl border border-blue-500/30 shadow-lg shadow-blue-500/10 overflow-hidden">
        <div className="px-4 py-3 bg-gradient-to-r from-blue-600/30 to-transparent border-b border-blue-500/20">
          <h2 className="text-white font-semibold flex items-center gap-2">
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
            赣商数据港
          </h2>
        </div>
        
        <div className="p-4">
          <div className="grid grid-cols-2 gap-2 mb-4">
            <div className="aspect-video rounded-lg overflow-hidden border border-cyan-500/20 relative group col-span-2">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 to-slate-800/40 flex items-center justify-center">
                <div className="grid grid-cols-3 gap-1">
                  {[...Array(9)].map((_, i) => (
                    <div
                      key={i}
                      className="w-8 h-8 bg-gradient-to-br from-cyan-500/30 to-blue-600/30 rounded animate-pulse"
                      style={{ animationDelay: `${i * 0.1}s` }}
                    />
                  ))}
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-white/70 text-xs">
                <span>赣商数据港全景</span>
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
              </div>
            </div>
          </div>

          <p className="text-white/70 text-xs leading-relaxed mb-3">
            赣州市国投集团数字产业平台项目一期大楼，一节点、三中心、三基地"架构高标准打造，是赣州市建设全面数字经济发展试验区建设试点城市的重要项目。它以推动数据要素高效流通、数据资产合规交易、数据服务一体为目标，致力于构建数据产业生态与产业体系。目前，赣商数据港已初步形成全市数字经济和数字产业发展的综合性平台，为区域数字经济高质量发展提供了重要支撑。
          </p>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-xs text-white/50">
              <span>入驻企业: 45家</span>
              <span>数据节点: 12个</span>
            </div>
            <button className="px-3 py-1 bg-cyan-600/30 hover:bg-cyan-600/50 text-cyan-300 text-xs rounded-md transition-all duration-300 border border-cyan-500/30">
              了解更多
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrandMatrix;
