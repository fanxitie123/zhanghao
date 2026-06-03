import { useEffect } from 'react';
import * as XLSX from 'xlsx';
import { Download, FileSpreadsheet } from 'lucide-react';

export default function TestExcelGenerator() {
  useEffect(() => {
    const generateExcel = () => {
      const workbook = XLSX.utils.book_new();

      const sheet1Data = [
        ['', '部门业绩表', '', '', ''],
        ['姓名', '部门', '职位', '入职日期', '薪资'],
        ['张三', '技术部', '前端开发工程师', '2020-05-15', '15000'],
        ['李四', '产品部', '产品经理', '2019-08-20', '18000'],
        ['王五', '财务部', '财务主管', '2018-03-10', '20000'],
        ['赵六', '人事部', 'HR专员', '2021-01-05', '12000'],
        ['钱七', '技术部', '后端开发工程师', '2020-11-20', '16000'],
      ];
      const sheet1 = XLSX.utils.aoa_to_sheet(sheet1Data);
      sheet1['!merges'] = [
        { s: { r: 0, c: 0 }, e: { r: 0, c: 4 } },
      ];
      XLSX.utils.book_append_sheet(workbook, sheet1, '员工信息');

      const sheet2Data = [
        ['季度', '月份', '销售额', '利润', '增长率'],
        ['第一季度', '2024-01', '500000', '80000', '12%'],
        ['', '2024-02', '550000', '95000', '10%'],
        ['', '2024-03', '620000', '110000', '13%'],
        ['第二季度', '2024-04', '580000', '100000', '-6%'],
        ['', '2024-05', '700000', '130000', '21%'],
        ['', '2024-06', '750000', '145000', '7%'],
      ];
      const sheet2 = XLSX.utils.aoa_to_sheet(sheet2Data);
      sheet2['!merges'] = [
        { s: { r: 1, c: 0 }, e: { r: 3, c: 0 } },
        { s: { r: 4, c: 0 }, e: { r: 6, c: 0 } },
      ];
      XLSX.utils.book_append_sheet(workbook, sheet2, '销售数据');

      const sheet3Data = [
        ['项目信息', '', '', '', ''],
        ['项目名称', '负责人', '状态', '预计完成时间', ''],
        ['电商平台重构', '张三', '进行中', '2024-12-31', ''],
        ['移动端APP开发', '钱七', '待开始', '2025-01-15', ''],
        ['数据分析平台', '李四', '已完成', '2024-06-15', ''],
        ['CRM系统升级', '王五', '进行中', '2024-09-30', ''],
      ];
      const sheet3 = XLSX.utils.aoa_to_sheet(sheet3Data);
      sheet3['!merges'] = [
        { s: { r: 0, c: 0 }, e: { r: 0, c: 4 } },
        { s: { r: 1, c: 3 }, e: { r: 1, c: 4 } },
      ];
      XLSX.utils.book_append_sheet(workbook, sheet3, '项目管理');

      const sheet4Data = [
        ['设备清单', '', '', ''],
        ['设备信息', '', '', ''],
        ['ID', '设备名称', '购买日期', '使用年限', '状态'],
        ['D001', '笔记本电脑', '2022-01-15', '2年', '正常'],
        ['D002', '显示器', '2022-03-20', '2年', '正常'],
        ['D003', '打印机', '2021-06-10', '3年', '需维护'],
        ['D004', '投影仪', '2023-05-08', '1年', '正常'],
        ['D005', '服务器', '2020-12-01', '4年', '已淘汰'],
      ];
      const sheet4 = XLSX.utils.aoa_to_sheet(sheet4Data);
      sheet4['!merges'] = [
        { s: { r: 0, c: 0 }, e: { r: 0, c: 4 } },
        { s: { r: 1, c: 0 }, e: { r: 1, c: 4 } },
      ];
      XLSX.utils.book_append_sheet(workbook, sheet4, '设备清单');

      const sheet5Data = [
        ['报告标题', '', '', '', '', ''],
        ['', '部门A', '部门B', '部门C', '部门D', '合计'],
        ['第一季度', '1000', '2000', '1500', '1800', '6300'],
        ['第二季度', '1200', '2200', '1700', '1900', '7000'],
        ['第三季度', '1100', '2100', '1600', '1850', '6650'],
        ['第四季度', '1300', '2300', '1800', '1950', '7350'],
        ['全年总计', '', '', '', '', ''],
      ];
      const sheet5 = XLSX.utils.aoa_to_sheet(sheet5Data);
      sheet5['!merges'] = [
        { s: { r: 0, c: 0 }, e: { r: 0, c: 5 } },
        { s: { r: 6, c: 1 }, e: { r: 6, c: 5 } },
      ];
      XLSX.utils.book_append_sheet(workbook, sheet5, '季度报告');

      const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });
      const blob = new Blob([wbout], { type: 'application/octet-stream' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = '测试数据.xlsx';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    };

    generateExcel();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-sm p-12 text-center">
        <FileSpreadsheet className="w-16 h-16 mx-auto mb-4 text-blue-500" />
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Excel 文件生成器</h1>
        <p className="text-gray-600 mb-6">正在生成测试用 Excel 文件...</p>
        <button
          onClick={() => window.location.reload()}
          className="flex items-center gap-2 px-6 py-3 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors mx-auto"
        >
          <Download className="w-4 h-4" />
          重新生成
        </button>
      </div>
    </div>
  );
}
