const OrderStatusEnum = {
  0: "待支付",
  1: "已支付",
  2: "已作废",
  3: "待审单",
  4: "待发货",
  5: "待收货",
  6: "待收货（等待退款）",
  7: "已完成",
  8: "已完成（待退款）",
  9: "已完成（维权结束）"
}

const OrderOperTypeEnum = {
  0: "系统自动生成",
  1: "后台手动添加",
  2: "前台会员操作"
}

export {
  OrderStatusEnum,
  OrderOperTypeEnum
}