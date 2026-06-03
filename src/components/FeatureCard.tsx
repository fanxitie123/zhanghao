const FeatureCard = () => {
  const features = [
    {
      id: 1,
      title: "'把党旗插在项目上'（红领实践）",
      organization: "中共赣州市国润商业投资管理有限公司支部委员会",
      description: "始终把党建工作与项目建设同谋划、同部署、同推进，充分发挥党支部战斗堡垒作用和党员先锋模范作用，设立党员先锋岗、党员责任区，让党旗在项目一线高高飘扬。通过'把党旗插在项目上'，党建引领在企业项目一线、助力城市工业提升中成效显著。",
      icon: "flag"
    },
    {
      id: 2,
      title: "'党建引领 国盛护航'",
      organization: "中共赣州市国盛保安服务有限公司支部委员会",
      description: "坚持党建引领，聚焦中心任务，大力实施'234'工作法，即坚持党建质量提升和保障服务能力提升双轮驱动，围绕安全生产、服务质量、队伍建设、客户满意度4个目标，着力打造'党建引领 国盛护航'品牌，以高质量党建引领高质量发展。",
      icon: "shield"
    },
    {
      id: 3,
      title: "'国保红'（筑梦国保）",
      organization: "中共赣州市国保房地产开发有限公司支部委员会",
      description: "坚持党建引领，践行'1234'工作法，即坚持一个核心、打造两个平台、建立三联机制、实现四个提升，充分发挥党组织战斗堡垒作用和党员先锋模范作用，凝聚'红色力量'，打造保障'红色引擎'，为公司高质量发展贡献动能。",
      icon: "building"
    }
  ];

  const renderIcon = (iconType: string) => {
    switch (iconType) {
      case "flag":
        return (
          <svg className="w-6 h-6 text-red-500" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
        );
      case "shield":
        return (
          <svg className="w-6 h-6 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
        );
      case "building":
        return (
          <svg className="w-6 h-6 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 21l1.65-3.8a9 9 0 113.4 2.9L3 21" />
            <path d="M16.5 3.5a2.121 2.121 0 013 3L7.5 14 3 17l1.5-4.5L16.5 3.5z" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm rounded-xl border border-blue-500/30 shadow-lg shadow-blue-500/10 overflow-hidden">
        <div className="px-4 py-3 bg-gradient-to-r from-blue-600/30 to-transparent border-b border-blue-500/20">
          <h2 className="text-white font-semibold flex items-center gap-2">
            <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
            党建品牌矩阵
          </h2>
        </div>
        
        <div className="p-4">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-red-700 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-red-500/30">
              <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-white font-semibold mb-1">红领国投</h3>
              <p className="text-white/60 text-xs mb-2">品牌内涵</p>
              <div className="grid grid-cols-4 gap-2 text-xs">
                <div className="bg-red-500/20 text-red-300 px-2 py-1 rounded">以红为魂</div>
                <div className="bg-red-500/20 text-red-300 px-2 py-1 rounded">以领为要</div>
                <div className="bg-red-500/20 text-red-300 px-2 py-1 rounded">以国为本</div>
                <div className="bg-red-500/20 text-red-300 px-2 py-1 rounded">以投为术</div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-red-500/10 to-blue-500/10 rounded-lg p-3 mb-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-1 h-4 bg-gradient-to-b from-red-500 to-blue-500 rounded-full" />
              <span className="text-white/80 text-xs font-medium">一支部一特色</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {["金融板块", "城建板块", "文旅板块", "产投板块"].map((item, index) => (
                <div key={index} className="flex items-center gap-2 text-xs text-white/60">
                  <div className="w-1.5 h-1.5 bg-white/40 rounded-full" />
                  {item}
                </div>
              ))}
            </div>
          </div>

          <p className="text-white/70 text-xs leading-relaxed">
            以"红"为魂，代表国投集团纯正红色、传承了中央苏区时期国家资产管理机构——财政人民委员部和国家银行"红色管家"的革命精神；以"领"为要，代表国投集团聚焦主责主业，以高质量党建引领企业高质量发展；以"国"为本，代表国投集团致力于打造成为全省一流、国内有影响力的资产管理与产业投资平台；以"投"为术，代表国投集团坚持市场化、专业化运作，推动国有资本保值增值。
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {features.map((feature) => (
          <div
            key={feature.id}
            className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm rounded-xl border border-blue-500/20 shadow-lg shadow-blue-500/5 overflow-hidden hover:border-blue-500/40 transition-all duration-300"
          >
            <div className="px-4 py-3 bg-gradient-to-r from-blue-600/20 to-transparent border-b border-blue-500/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {renderIcon(feature.icon)}
                  <div>
                    <h3 className="text-white font-medium text-sm">{feature.title}</h3>
                    <p className="text-white/50 text-xs">{feature.organization}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-green-400 text-xs">进行中</span>
                </div>
              </div>
            </div>
            <div className="p-4">
              <p className="text-white/70 text-xs leading-relaxed">
                {feature.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeatureCard;
