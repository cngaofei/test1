// Mock数据生成脚本
function generateMockData() {
  const customers = [
    '北京华联集团', '上海浦东发展银行', '深圳腾讯科技', '广州阿里巴巴', '杭州网易',
    '成都华为技术', '武汉小米科技', '南京苏宁易购', '西安中兴通讯', '重庆长安汽车'
  ];

  const types = ['网络故障', '账户问题', '账单异议', '功能咨询', '其他'];
  const assignees = ['张伟', '李娜', '王强'];
  const severities = ['critical', 'high', 'medium', 'low'];
  const severityWeights = [0.1, 0.2, 0.4, 0.3]; // 分布比例

  const statuses = ['pending', 'pending', 'pending', 'pending', 'in_progress', 'in_progress', 'in_progress', 'resolved', 'resolved', 'closed'];
  const remarks = [
    '客户强烈投诉，需优先处理', '等待技术部门支持', '已与客户沟通解决方案', '客户要求回拨',
    '问题复杂需升级处理', '简单问题已远程解决', '需现场上门服务', '客户满意解决',
    '', '多次联系未接听', '建议升级VIP服务', ''
  ];

  function randomPick(arr, weights) {
    if (!weights) return arr[Math.floor(Math.random() * arr.length)];
    let r = Math.random();
    let cumulative = 0;
    for (let i = 0; i < arr.length; i++) {
      cumulative += weights[i];
      if (r <= cumulative) return arr[i];
    }
    return arr[arr.length - 1];
  }

  function randomDate(daysAgo, daysFuture) {
    const now = new Date();
    const offset = Math.floor(Math.random() * (daysFuture + daysAgo)) - daysAgo;
    const d = new Date(now);
    d.setDate(d.getDate() + offset);
    return d.toISOString().split('T')[0];
  }

  function uuid() {
    return 'case_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  const data = [];
  const now = new Date();

  for (let i = 0; i < 30; i++) {
    const createdOffset = Math.floor(Math.random() * 60); // 60天内创建
    const created = new Date(now);
    created.setDate(created.getDate() - createdOffset);

    const deadlineOffset = createdOffset - (7 + Math.floor(Math.random() * 38)); // 解决期限在创建后7~45天
    const deadline = new Date(created);
    deadline.setDate(deadline.getDate() - deadlineOffset);

    data.push({
      id: uuid(),
      customer: customers[Math.floor(Math.random() * customers.length)],
      type: types[Math.floor(Math.random() * types.length)],
      severity: randomPick(severities, severityWeights),
      assignee: assignees[Math.floor(Math.random() * assignees.length)],
      deadline: deadline.toISOString().split('T')[0],
      status: statuses[Math.floor(Math.random() * statuses.length)],
      createdAt: created.toISOString(),
      updatedAt: created.toISOString(),
      remark: remarks[Math.floor(Math.random() * remarks.length)]
    });
  }

  // 确保有今天到期的客诉（用于测试提醒功能）
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];

  data[0].deadline = todayStr;
  data[0].severity = 'critical';
  data[0].status = 'in_progress';

  data[1].deadline = todayStr;
  data[1].severity = 'high';
  data[1].status = 'pending';

  // 确保有一条已过期的
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 3);
  data[2].deadline = yesterday.toISOString().split('T')[0];
  data[2].severity = 'critical';
  data[2].status = 'in_progress';

  return data;
}