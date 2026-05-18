// Mock数据生成脚本
function generateMockData() {
  const customers = [
    '北京华联集团', '上海浦东发展银行', '深圳腾讯科技', '广州阿里巴巴', '杭州网易',
    '成都华为技术', '武汉小米科技', '南京苏宁易购', '西安中兴通讯', '重庆长安汽车'
  ];

  const types = ['网络故障', '账户问题', '账单异议', '功能咨询', '其他'];
  const assignees = ['张伟', '李娜', '王强'];
  const severities = ['critical', 'high', 'medium', 'low'];
  const severityWeights = [0.1, 0.2, 0.4, 0.3];

  const statuses = ['pending', 'pending', 'pending', 'pending', 'in_progress', 'in_progress', 'in_progress', 'resolved', 'resolved', 'closed'];
  const remarks = [
    '客户强烈投诉，需优先处理', '等待技术部门支持', '已与客户沟通解决方案', '客户要求回拨',
    '问题复杂需升级处理', '简单问题已远程解决', '需现场上门服务', '客户满意解决',
    '', '多次联系未接听', '建议升级VIP服务', ''
  ];

  // 各状态对应的跟进记录模板
  const logTemplates = {
    pending: [
      ['收到客户投诉，已登记系统，待分配跟进人。'],
    ],
    in_progress: [
      ['收到客户投诉，已登记系统。', '已联系客户确认问题详情，正在排查原因。'],
      ['收到投诉，初步判断为系统侧问题。', '已提交技术工单，等待后台处理。', '技术反馈需要2个工作日，已告知客户。'],
      ['登记客诉，第一时间回拨客户。', '客户描述问题后，已远程协助操作，问题部分缓解。', '仍有残留问题，继续跟进中。'],
    ],
    resolved: [
      ['收到投诉，立即跟进。', '排查发现是配置错误，已修复。', '回访客户确认问题已解决，客户满意。'],
      ['登记问题，联系技术支持。', '技术完成修复，通知客户验证。', '客户验证通过，标记已解决。'],
    ],
    closed: [
      ['收到投诉，跟进处理。', '问题解决后客户确认关闭。'],
    ],
  };

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

  function uuid() {
    return 'case_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  function logId() {
    return 'log_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6);
  }

  function buildLogs(status, assignee, createdAt) {
    const templates = logTemplates[status] || logTemplates['pending'];
    const msgs = templates[Math.floor(Math.random() * templates.length)];
    const base = new Date(createdAt);
    return msgs.map((content, i) => {
      const t = new Date(base);
      t.setHours(t.getHours() + i * (8 + Math.floor(Math.random() * 16)));
      return { id: logId(), author: assignee, content, createdAt: t.toISOString() };
    });
  }

  const data = [];
  const now = new Date();

  for (let i = 0; i < 30; i++) {
    const createdOffset = Math.floor(Math.random() * 60);
    const created = new Date(now);
    created.setDate(created.getDate() - createdOffset);

    const deadlineOffset = createdOffset - (7 + Math.floor(Math.random() * 38));
    const deadline = new Date(created);
    deadline.setDate(deadline.getDate() - deadlineOffset);

    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const assignee = assignees[Math.floor(Math.random() * assignees.length)];

    data.push({
      id: uuid(),
      customer: customers[Math.floor(Math.random() * customers.length)],
      type: types[Math.floor(Math.random() * types.length)],
      severity: randomPick(severities, severityWeights),
      assignee,
      deadline: deadline.toISOString().split('T')[0],
      status,
      createdAt: created.toISOString(),
      updatedAt: created.toISOString(),
      remark: remarks[Math.floor(Math.random() * remarks.length)],
      logs: buildLogs(status, assignee, created.toISOString())
    });
  }

  // 确保有今天到期的客诉（用于测试提醒功能）
  const todayStr = now.toISOString().split('T')[0];
  data[0].deadline = todayStr;
  data[0].severity = 'critical';
  data[0].status = 'in_progress';

  data[1].deadline = todayStr;
  data[1].severity = 'high';
  data[1].status = 'pending';

  // 确保有一条已过期的
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 3);
  data[2].deadline = yesterday.toISOString().split('T')[0];
  data[2].severity = 'critical';
  data[2].status = 'in_progress';

  return data;
}
