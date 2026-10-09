export type Subscription = {
  id: string;
  name: string;
  amountAzn: number;
  period: "daily" | "monthly";
  status: "active" | "cancelled";
  description: string;
  refundedAzn?: number;
  suspicious?: boolean;
  serviceId?: string;
};

export type BillState = {
  userId: string;
  balanceAzn: number;
  subscriptions: Subscription[];
};

export function initialBillState(): BillState {
  return {
    userId: "demo-user-1",
    balanceAzn: 4.72,
    subscriptions: [
      {
        id: "sub-playzone-content",
        name: "PlayZone Plus",
        amountAzn: 0.35,
        period: "daily",
        status: "active",
        description:
          "Üçüncü tərəf məzmun xidməti (oyun/əyləncə). Adətən bir SMS linkinə klik və ya kampaniyaya qoşulma zamanı aktivləşir.",
        suspicious: true,
        serviceId: "PLZ-00142",
      },
      {
        id: "sub-data-addon",
        name: "Əlavə 2GB internet paketi",
        amountAzn: 2.0,
        period: "monthly",
        status: "active",
        description: "İstifadəçinin özü aktivləşdirdiyi əlavə data paketi.",
        serviceId: "DTA-00087",
      },
    ],
  };
}
